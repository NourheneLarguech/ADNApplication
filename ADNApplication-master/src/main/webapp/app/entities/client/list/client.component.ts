import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IClient } from '../client.model';
import { ClientService } from '../service/client.service';
import { ClientDeleteDialogComponent } from '../delete/client-delete-dialog.component';

@Component({
  selector: 'jhi-client',
  templateUrl: './client.component.html',
})
export class ClientComponent implements OnInit {
  clients?: IClient[];
  isLoading = false;
  NumVersion?: any;
  constructor(protected clientService: ClientService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.clientService.query().subscribe({
      next: (res: HttpResponse<IClient[]>) => {
        this.isLoading = false;
        this.clients = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IClient): number {
    return item.id!;
  }
  nameClient(name?: any): any {
    return name?.substring(0, name.indexOf('_'));
  }
  version(name?: any): any {
    console.log(typeof name);
    if (typeof name === 'string') {
      this.NumVersion = name.substring(name.length - 2, name?.length);
    }
    if (typeof name === 'object') {
      console.log('else');
      this.NumVersion = 'V0';
    }

    return this.NumVersion;
  }

  delete(client: IClient): void {
    const modalRef = this.modalService.open(ClientDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.client = client;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
