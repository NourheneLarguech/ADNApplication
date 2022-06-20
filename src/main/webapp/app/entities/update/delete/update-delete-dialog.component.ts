import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUpdate } from '../update.model';
import { UpdateService } from '../service/update.service';

@Component({
  templateUrl: './update-delete-dialog.component.html',
})
export class UpdateDeleteDialogComponent {
  update?: IUpdate;

  constructor(protected updateService: UpdateService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.updateService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
