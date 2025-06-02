import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../../components/header/header.component';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { TypingComponent } from '../../../components/typing/typing.component';
import { ChatService } from '../../../services/chat/chat.service';
import { ToastService } from '../../../services/toast/toast.service';
import { fadeAnimation } from '../../../shared/animations/fade-animation';
import { ImageGalleryService } from '../../../services/image-gallery/image-gallery.service';
import { Message } from '../../../shared/models/chat/message';

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    LoaderComponent,
    TypingComponent
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  animations: [fadeAnimation]
})
export class ChatComponent implements OnInit {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  newMessage = '';
  isRecording = false;
  recordingTime = '00:00';
  audioUrl: string | undefined = undefined;

  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private startTime!: number;
  private intervalId: any;
  private audioContext!: AudioContext;
  private analyser!: AnalyserNode;
  private dataArray!: Uint8Array;
  private source!: MediaStreamAudioSourceNode;
  private animationId!: number;

  get chat() {
    return this.chatService.chat;
  }

  get thinking() {
    return this.chatService.thinking$;
  }

  get triggerScroll() {
    return this.chatService.scrollToBottom$;
  }

  constructor(private cdr: ChangeDetectorRef,
    private chatService: ChatService,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private imageGalleryService: ImageGalleryService
  ) {
    this.triggerScroll.subscribe(() => {
      this.scrollToBottom();
    })
  }

  ngOnInit(): void {
    let chatId = this.activatedRoute.snapshot.queryParams['id'];
    this.activatedRoute.queryParams.subscribe(async (params) => {
      chatId = params['id'];
      if (chatId) {
        await this.chatService.setChat(chatId);
        setTimeout(() => {
          this.scrollToBottom();
        }, 1);
      }
    });

    if (chatId) this.chatService.setChat(chatId);
  }

  triggerFileInput() {
    this.fileInputRef.nativeElement.click();
  }

  handleFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      console.log('Arquivo selecionado:', file);
    }
  }

  async toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      await this.startRecording();
    }
  }

  private async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Setup media recorder
      this.mediaRecorder = new MediaRecorder(stream);
      this.recordedChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.recordedChunks, { type: 'audio/webm' });
        this.audioUrl = URL.createObjectURL(audioBlob);
      };

      this.mediaRecorder.start();
      this.startTime = Date.now();
      this.isRecording = true;

      // Iniciar cronômetro
      this.intervalId = setInterval(() => {
        const elapsedMs = Date.now() - this.startTime;
        const seconds = Math.floor((elapsedMs / 1000) % 60);
        const minutes = Math.floor(elapsedMs / 60000);
        this.recordingTime = `${this.pad(minutes)}:${this.pad(seconds)}`;
      }, 500);

      // Setup audio visualization
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.source = this.audioContext.createMediaStreamSource(stream);
      this.source.connect(this.analyser);
      this.analyser.fftSize = 2048;
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      this.cdr.detectChanges();

      setTimeout(() => {
        this.drawVisualizer();
      }, 1);
    } catch (err) {
      console.error('Erro ao acessar microfone:', err);
    }
  }

  private async stopRecording() {
    this.isRecording = false;
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    clearInterval(this.intervalId);
    this.recordingTime = '00:00';

    setTimeout(() => {
      this.cdr.detectChanges();
    }, 1);
    // Parar animação e fechar contexto
    if (this.audioContext) {
      await this.audioContext.close();
    }
    cancelAnimationFrame(this.animationId);
  }

  private pad(num: number): string {
    return num < 10 ? '0' + num : '' + num;
  }

  private drawVisualizer() {
    const canvas = this.canvasRef.nativeElement;
    const canvasCtx = canvas.getContext('2d')!;
    canvas.width = 300;
    canvas.height = 60;

    const draw = () => {
      this.animationId = requestAnimationFrame(draw);

      this.analyser.getByteTimeDomainData(this.dataArray);

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = '#7f5af0';
      canvasCtx.beginPath();

      const sliceWidth = canvas.width / this.dataArray.length;
      let x = 0;

      for (let i = 0; i < this.dataArray.length; i++) {
        const v = this.dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        i === 0 ? canvasCtx.moveTo(x, y) : canvasCtx.lineTo(x, y);
        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    draw();
  }

  scrollToBottom(): void {
    const container = this.messagesContainer?.nativeElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  async toggleSendMessage() {
    if (this.isRecording) {
      await this.stopRecording();
    }
    if (this.audioUrl) {
      this.sendMessage(true);
    }
    if (!this.newMessage.trim()) {
      this.toastService.show('Digite uma mensagem', 'warning');
      return;
    };

    if (this.thinking.value) return;

    this.sendMessage();
  }

  async sendMessage(audio?: boolean) {
    const newMessage = new Message();
    if (audio) {
      const audioElement = new Audio(this.audioUrl);

      await new Promise<void>((resolve) => {
        audioElement.addEventListener('canplaythrough', () => resolve(), { once: true });
      });

      audioElement.play();
      this.audioUrl = undefined;
      return;
    }

    newMessage.text = this.newMessage;
    newMessage.role = 'user';

    setTimeout(() => {
      this.scrollToBottom();
    }, 100);

    await this.chatService.sendMessage(newMessage);

    this.newMessage = '';

  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.toggleSendMessage();
    }
  }

  openImagePreview(content: any, index: number) {
    this.imageGalleryService.open(content.images.map((image: string) => {
      return {
        url: image,
        alt: 'Imagem ' + index,
        loaded: false
      }
    }), index);
  }

}
