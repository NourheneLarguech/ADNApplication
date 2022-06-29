import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IClientUpdate } from '../client-update.model';
import { ClientUpdateService } from '../service/client-update.service';

@Component({
  templateUrl: './client-update-delete-dialog.component.html',
})
export class ClientUpdateDeleteDialogComponent {
  clientUpdate?: IClientUpdate;

  constructor(protected clientUpdateService: ClientUpdateService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.clientUpdateService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
