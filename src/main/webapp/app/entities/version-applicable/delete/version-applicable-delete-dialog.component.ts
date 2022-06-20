import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVersionApplicable } from '../version-applicable.model';
import { VersionApplicableService } from '../service/version-applicable.service';

@Component({
  templateUrl: './version-applicable-delete-dialog.component.html',
})
export class VersionApplicableDeleteDialogComponent {
  versionApplicable?: IVersionApplicable;

  constructor(protected versionApplicableService: VersionApplicableService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.versionApplicableService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
