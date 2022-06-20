import {Component, OnChanges, OnInit} from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IVersionApplicable } from '../version-applicable.model';
import { VersionApplicableService } from '../service/version-applicable.service';
import { VersionApplicableDeleteDialogComponent } from '../delete/version-applicable-delete-dialog.component';

@Component({
  selector: 'jhi-version-applicable',
  templateUrl: './version-applicable.component.html',
})
export class VersionApplicableComponent implements OnInit{
  versionApplicables?: IVersionApplicable[];
  isLoading = false;
  searchText!:string;


  constructor(protected versionApplicableService: VersionApplicableService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;
    this.versionApplicableService.query().subscribe({
      next: (res: HttpResponse<IVersionApplicable[]>) => {
        this.isLoading = false;
        this.versionApplicables = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IVersionApplicable): number {
    return item.id!;
  }

  delete(versionApplicable: IVersionApplicable): void {
    const modalRef = this.modalService.open(VersionApplicableDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.versionApplicable = versionApplicable;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }

  // ngOnChanges(changes: any): void {
  //   console.error(this.searchText)
  // }
}
