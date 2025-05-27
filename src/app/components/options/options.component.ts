import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-options',
  imports: [],
  templateUrl: './options.component.html',
  styleUrl: './options.component.scss'
})
export class OptionsComponent {

  @Output() emitter = new EventEmitter();

  choose(option: number) {
    this.emitter.emit(option);
  }

}
