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
    this.clientService.linkUser();

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
    // console.log(typeof name);
    if (typeof name === 'string') {
      this.NumVersion = name.substring(name.length - 2, name?.length);
    }
    if (typeof name === 'object') {
      //console.log('else');
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
        this.clientService.getVersionApplicabe().subscribe(VersionApplicable => {
          console.log(VersionApplicable);
          for (const versionAPP of VersionApplicable) {
            if (this.nameClient(versionAPP.nameVersionApplicable) === this.nameClient(client.nameClient)) {
              this.clientService.deleteVersionApplicable(versionAPP.id).subscribe(deleteverAPP => {
                console.log(deleteverAPP);
              });
            }
          }
        });

        this.clientService.getVersionCible().subscribe(VersionCible => {
          console.log(VersionCible);
          for (const versionCIB of VersionCible) {
            if (this.nameClient(versionCIB.nameVersionCible) === this.nameClient(client.nameClient)) {
              this.clientService.deleteVersionCible(versionCIB.id).subscribe(deleteverCIB => {
                console.log(deleteverCIB);
              });
            }
          }
        });

        this.clientService.getVersionADN().subscribe(updateADN => {
          for (let update of updateADN.updates) {
            console.log(update.name);
            if (this.nameClient(update.name) === this.nameClient(client.nameClient)) {
              this.clientService.deleteUpdateADN(update.uid).subscribe(deleteUpdate => {
                console.log(deleteUpdate);
              });
            }
          }
        });
        this.clientService.getVersionADN().subscribe(versionADN => {
          for (let version of versionADN.versions) {
            console.log(version.name);
            if (this.nameClient(version.name) === this.nameClient(client.nameClient)) {
              this.clientService.deleteVersionADN(version.uid).subscribe(deleteVersion => {
                console.log(deleteVersion);
              });
            }
          }
        });
      }
    });
  }
  changeStatut(client: IClient): void {
    this.clientService.getUpdate(client).subscribe(data => {
      this.ResGetUpdate = data.updateFiles;
      console.log('test', this.ResGetUpdate);
      if (this.ResGetUpdate.length === 0) {
        //console.log("longeur 0")
        this.afficher();
      } else {
        this.clientService.EditStatut(client).subscribe(
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
