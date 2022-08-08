import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IClient } from '../client.model';
import { ClientService } from '../service/client.service';
import { ClientDeleteDialogComponent } from '../delete/client-delete-dialog.component';
import { IUpdate } from '../../update/update.model';
import { ModalComponent } from '../../update/modal/modal.component';
import { StatutList } from '../../enumerations/statut-list.model';

@Component({
  selector: 'jhi-client',
  templateUrl: './client.component.html',
})
export class ClientComponent implements OnInit {
  clients?: IClient[];
  isLoading = false;
  NumVersion?: any;
  constructor(protected clientService: ClientService, protected modalService: NgbModal) {}
  ResGetUpdate?: any;
  errorMessage?: any;
  profilUser?: any;
  links?: any;
  link?: string;
  loadAll(): void {
    this.isLoading = true;
    this.linkUser();

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
  linkUser(): void {
    this.clientService.profilUser().subscribe(profilUser => {
      this.profilUser = profilUser;
    });
    this.clientService.getLink().subscribe(links => {
      this.links = links;
      for (const link of this.links) {
        console.log(link);
        if (this.profilUser.id === link.user.id) {
          this.link = link.nameLink;
          console.log(link.nameLink);
        }
      }
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
  changeStatut(client: IClient): void {
    this.clientService.getUpdate(client, this.link).subscribe(data => {
      this.ResGetUpdate = data.updateFiles;
      console.log('test', this.ResGetUpdate);
      if (this.ResGetUpdate.length === 0) {
        //console.log("longeur 0")
        this.afficher();
      } else {
        this.clientService.EditStatut(client, this.link).subscribe(
          ResEditStatut => {
            //this.statut = ResEditStatut;
            this.updateNextStatut(ResEditStatut, client.id);
            this.clientService.EditerUpdate(client, ResEditStatut).subscribe(
              data1 => {
                console.log(data1);
              },
              error => {
                console.error(error);
              }
            );
          },
          error => {
            this.errorMessage = error.message;
            console.error('There was an error!', error);
          }
        );
      }
    });
  }
  afficher(): void {
    const modalRef = this.modalService.open(ModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.closed;
  }
  updateNextStatut(statut: string, id: number | undefined): void {
    if (this.clients !== undefined && id !== undefined) {
      for (const client of this.clients) {
        if (client.id === id) {
          client.nextStatut = this.initialStatut(statut);
          client.statut = this.getStatut(statut);
        }
      }
    }
  }
  initialStatut(statut: any): any {
    let statutNext = '';
    if (statut === 'SUSPENDED') {
      statutNext = 'PASSER EN IN_TEST';
    } else {
      if (statut === 'IN_TEST') {
        statutNext = 'PASSER EN FIELD_TEST';
      } else {
        if (statut === 'FIELD_TEST') {
          statutNext = 'PASSER EN PUBLISHED';
        } else {
          if (statut === 'PUBLISHED') {
            statutNext = 'PASSER EN SUSPENDED';
          }
        }
      }
    }
    return statutNext;
  }
  getStatut(statut: string): any {
    if (statut === 'SUSPENDED') {
      return StatutList.SUSPENDED;
    }
    if (statut === 'IN_TEST') {
      return StatutList.IN_TEST;
    }
    if (statut === 'FIELD_TEST') {
      return StatutList.FIELD_TEST;
    }
    if (statut === 'PUBLISHED') {
      return StatutList.PUBLISHED;
    }
  }
}
