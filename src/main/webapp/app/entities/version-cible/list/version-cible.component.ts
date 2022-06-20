import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IVersionCible } from '../version-cible.model';
import { VersionCibleService } from '../service/version-cible.service';
import { VersionCibleDeleteDialogComponent } from '../delete/version-cible-delete-dialog.component';

@Component({
  selector: 'jhi-version-cible',
  templateUrl: './version-cible.component.html',
})
export class VersionCibleComponent implements OnInit {
  versionCibles?: IVersionCible[];
  isLoading = false;

  constructor(protected versionCibleService: VersionCibleService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.versionCibleService.query().subscribe({
      next: (res: HttpResponse<IVersionCible[]>) => {
        this.isLoading = false;
        this.versionCibles = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IVersionCible): number {
    return item.id!;
  }

  delete(versionCible: IVersionCible): void {
    const modalRef = this.modalService.open(VersionCibleDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.versionCible = versionCible;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
