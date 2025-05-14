import { Component } from '@angular/core';
import { ModalService } from '../../../../services/modal/modal.service';

@Component({
  selector: 'app-create',
  imports: [],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {

  constructor(private modalService: ModalService) {

  }
  
  close() {
    this.modalService.close({ value: 'fechou com esse valor' })
  }

}
