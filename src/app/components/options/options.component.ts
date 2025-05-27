import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Option } from '../../shared/models/components/option';

@Component({
  selector: 'app-options',
  imports: [
    CommonModule
  ],
  standalone: true,
  templateUrl: './options.component.html',
  styleUrl: './options.component.scss'
})
export class OptionsComponent {
  @ViewChild('mainElement') mainElement!: ElementRef;

  @Input() options: Option[] = [];
  @Output() emitter = new EventEmitter();

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.mainElement.nativeElement.contains(target)) {
      this.choose(null);
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.choose(null);
  }

  choose(option: number | null) {
    this.emitter.emit(option);
  }

}
