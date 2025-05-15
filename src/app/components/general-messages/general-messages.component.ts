import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-general-messages',
  imports: [
    CommonModule
  ],
  templateUrl: './general-messages.component.html',
  styleUrl: './general-messages.component.scss'
})
export class GeneralMessagesComponent {

  get content() {
    return this.modalService.modalRef?.instance.content;
  }

  constructor(private modalService: ModalService) { }

  close(value: any) {
    this.modalService.close(value);
  }

}
