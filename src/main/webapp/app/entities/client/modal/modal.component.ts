import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ClientService } from '../service/client.service';
import { IClient } from '../client.model';
import { BehaviorSubject, Observable } from 'rxjs';
//import {prepareProfile} from "selenium-webdriver/firefox";
//import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'jhi-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  // @Output() profilClient = new EventEmitter<string>();
  // addNewItem(value:string):void{
  //     this.profilClient.emit(value);
  // }

  status?: string;
  uidproduct?: string;
  client?: IClient;
  listProfil?: string[][];
  myGroup = new FormGroup({
    profil: new FormControl(),
  });
  //public profilClient?:string;

  constructor(public ngbActiveModal: NgbActiveModal, protected fb: FormBuilder, protected clientService: ClientService) {}

  save(): void {
    const profil = this.myGroup.controls.profil.value;
    //this.profilClient=profil;
    console.log(this.client?.client_product?.uidProduct);
    console.log(this.client?.client_product?.nameProduct);
    console.log(profil);
    this.clientService.viewProfil(this.client?.client_product?.uidProduct).subscribe(data => {
      this.listProfil = data.profiles;
      console.log(this.listProfil);
      //profil=profil!==undefined? profil:'';
      this.listProfil?.push(...this.listProfil, profil);
      console.log(this.listProfil);
      this.clientService.addProfil(this.client, profil, this.listProfil).subscribe(
        data2 => {
          console.log(data2);
          this.clientService.shareData(profil);
          this.close();
        },
        error => {
          console.error(error);
        }
      );
    });
  }
  public close(): any {
    this.ngbActiveModal.dismiss();
  }
}
