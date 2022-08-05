import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  status?: string;
  isOpened = false;
  constructor(public ngbActiveModal: NgbActiveModal) {}

  public close(): any {
    this.ngbActiveModal.dismiss();
  }
}
