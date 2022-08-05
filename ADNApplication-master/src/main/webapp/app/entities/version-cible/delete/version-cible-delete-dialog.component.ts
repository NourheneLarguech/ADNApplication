import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVersionCible } from '../version-cible.model';
import { VersionCibleService } from '../service/version-cible.service';

@Component({
  templateUrl: './version-cible-delete-dialog.component.html',
})
export class VersionCibleDeleteDialogComponent {
  versionCible?: IVersionCible;

  constructor(protected versionCibleService: VersionCibleService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.versionCibleService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
