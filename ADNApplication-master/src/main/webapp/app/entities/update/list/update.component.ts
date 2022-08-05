import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUpdate } from '../update.model';
import { UpdateService } from '../service/update.service';
import { UpdateDeleteDialogComponent } from '../delete/update-delete-dialog.component';
import { ModalComponent } from '../modal/modal.component';
import { StatutList } from '../../enumerations/statut-list.model';

@Component({
  selector: 'jhi-update',
  templateUrl: './update.component.html',
})
export class UpdateComponent implements OnInit {
  updates?: IUpdate[];
  isLoading = false;
  tempArray: any = [];
  newArray: any = [];
  arrays: any = [];
  nameVersionList: string[] = [];
  searchText!: string;
  statutNext: any;
  statut: any;
  ResGetUpdate: any;
  errorMessage: any;

  p: any;
  collection?: any[];

  constructor(protected updateService: UpdateService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;
    let nameCalculator = '';
    this.updateService.query().subscribe({
      next: (res: HttpResponse<IUpdate[]>) => {
        this.isLoading = false;
        this.updates = res.body ?? [];
        this.arrays = res.body ?? [];
        console.log(this.arrays);
        for (const versionApp of this.updates) {
          if (versionApp.versionName !== undefined && versionApp.versionName.indexOf('_') !== -1) {
            nameCalculator = versionApp.versionName.substring(0, versionApp.versionName.indexOf('_'));
          }
          if (this.nameVersionList.indexOf(nameCalculator) === -1) {
            this.nameVersionList.push(nameCalculator);
          }
          versionApp.nextStatut = this.initialStatut(versionApp.statut);
        }
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
  updateNextStatut(statut: string, id: number | undefined): void {
    if (this.updates !== undefined && id !== undefined) {
      for (const update of this.updates) {
        if (update.id === id) {
          update.nextStatut = this.initialStatut(statut);
          update.statut = this.getStatut(statut);
        }
      }
    }
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

  initialStatut(statut: any): string {
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

  changeStatut(update: IUpdate): void {
    this.updateService.getUpdate(update).subscribe(data => {
      this.ResGetUpdate = data.updateFiles;
      console.log(this.ResGetUpdate);
      if (this.ResGetUpdate.length === 0) {
        //console.log("longeur 0")
        this.afficher();
      } else {
        this.updateService.EditStatut(update).subscribe(
          ResEditStatut => {
            //this.statut = ResEditStatut;
            this.updateNextStatut(ResEditStatut, update.id);
            this.updateService.EditerUpdate(update, ResEditStatut).subscribe(
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

  trackId(index: number, item: IUpdate): number {
    return item.id!;
  }

  delete(update: IUpdate): void {
    const modalRef = this.modalService.open(UpdateDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.update = update;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
        this.updateService.DeleteUpdateADN(update).subscribe(ResDelete => {
          console.log(ResDelete);
          this.updateService.DeleteVersionApplicableADN(update).subscribe(ResDelVerApp => {
            console.log(ResDelVerApp);
          });
          this.updateService.DeleteVersionCibleADN(update).subscribe(ResVerCible => console.log(ResVerCible));
          this.updateService.DeleteVersionApplicable(update).subscribe(ResVerApp => console.log(ResVerApp));
          this.updateService.DeleteVersionCible(update).subscribe(ResVerCible => console.log(ResVerCible));
        });
      }
    });
  }

  toggleEditable(event: any): void {
    if (event.target.checked) {
      this.tempArray = this.arrays.filter((e: any) => e.versionName.substring(0, e.versionName.indexOf('_')) === event.target.value);
      this.updates = [];
      this.newArray.push(this.tempArray);
      for (let i = 0; i < this.newArray.length; i++) {
        const firstArray = this.newArray[i];
        for (let j = 0; j < firstArray.length; j++) {
          const obj = firstArray[j];
          this.updates.push(obj);
          // console.log(this.versionApplicables);
        }
      }
    } else {
      this.tempArray = this.updates?.filter((e: any) => e.versionName.substring(0, e.versionName.indexOf('_')) !== event.target.value);
      this.updates = [];
      this.newArray = [];
      this.newArray.push(this.tempArray);
      for (let i = 0; i < this.newArray.length; i++) {
        const firstArray = this.newArray[i];
        for (let j = 0; j < firstArray.length; j++) {
          const obj = firstArray[j];
          this.updates.push(obj);
          // console.log(this.versionApplicables);
        }
      }
    }
  }
  NameCalculator(name?: string): string | undefined {
    return name?.substring(0, name.indexOf('_'));
  }
  NameVersion(name?: string): string | undefined {
    return name?.substring(name.indexOf('_') + 1, name.length);
  }

  ngOnInit(): void {
    this.loadAll();
    // console.error(this.searchText);
  }
}
