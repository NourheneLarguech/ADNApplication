import { Component, OnInit } from '@angular/core';
import { Statut } from '../../enumerations/statut.model';
import { IProduct } from '../../product/product.model';
import { IVersionApplicable } from '../../version-applicable/version-applicable.model';
import { IVersionCible } from '../../version-cible/version-cible.model';
import { ClientService } from '../service/client.service';
import { ProductService } from '../../product/service/product.service';
import { VersionApplicableService } from '../../version-applicable/service/version-applicable.service';
import { VersionCibleService } from '../../version-cible/service/version-cible.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modal/modal.component';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Client, IClient } from '../client.model';
import { finalize, map } from 'rxjs/operators';
import { User } from '../../../admin/user-management/user-management.model';

@Component({
  selector: 'jhi-edit-version',
  templateUrl: './edit-version.component.html',
})
export class EditVersionComponent implements OnInit {
  isSaving = false;
  statutValues = Object.keys(Statut);
  version0: any;
  productsSharedCollection: IProduct[] = [];
  versionApplicablesSharedCollection: IVersionApplicable[] = [];
  versionCiblesSharedCollection: IVersionCible[] = [];
  profilProduct: string[] = [];
  uidproduct?: string;
  profil?: string;
  resGetUpdate?: any;
  permissionClient?: any;
  listInitial?: any = [];
  listProduit?: any;
  list: any = [];
  nouvelStatut = true;
  versionName?: string;
  todayString = new Date().toDateString();
  newVersion?: string;
  addToMemoryFlag = true;
  name?: string | null;
  verApp?: string;
  verCib?: string;
  versionApplicable?: any;
  versionCible?: any;
  versionApplicableADN?: any;
  versionCibleADN?: any;
  va?: any;
  profilUser?: any;
  links?: any;
  link?: string;
  editForm = this.fb.group({
    id: [],
    uidClient: [],
    nameClient: [],
    productClient: [],
    comment: [],
    description: [],
    statut: [],
    client_product: [],
    versionApplicable: [],
    versionCible: [],
    droitClient: [],
  });
  constructor(
    protected clientService: ClientService,
    protected productService: ProductService,
    protected versionApplicableService: VersionApplicableService,
    protected versionCibleService: VersionCibleService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.clientService.linkUser();
    this.activatedRoute.data.subscribe(({ client }) => {
      this.updateForm(client);

      this.loadRelationshipsOptions();
      this.productService.getUpdate().subscribe(resGetUpdate => {
        this.resGetUpdate = resGetUpdate;
        this.clientService.viewDroitClient().subscribe(permissionClient => {
          this.permissionClient = permissionClient;
          this.resGetUpdate.forEach((element: any) => {
            this.listInitial.push(this.droitUtilisateur(element.id));
          });
          this.resGetUpdate.forEach((element: any) => {
            this.list.push(this.droitUtilisateur(element.id));
          });
        });
      });
    });
  }

  droitUtilisateur(idUpdate: number): any {
    this.nouvelStatut = false;
    const client = this.createFromForm();
    for (const permission of this.permissionClient) {
      if (permission.client.id === client.id && permission.update.id === idUpdate) {
        this.nouvelStatut = true;
      }
    }
    return this.nouvelStatut;
  }

  toggleEvent(id: number): void {
    this.list[id] = !this.list[id];
    //  console.log(id);
    this.addToMemoryFlag = !this.addToMemoryFlag;
  }
  add(produit: any, client: IClient): void {
    console.log('add');
    this.clientService.addPermissionClient(produit, client).subscribe(resAddPermission => {
      // console.log(resAddPermission);
    });
  }
  delete(produit: any, client: IClient): void {
    // console.log('delete');
    for (const permission of this.permissionClient) {
      if (permission.client.id === client.id && permission.update.id === produit.id) {
        this.clientService.deletePermissionClient(permission.id).subscribe(
          data => {
            // console.log(data);
          },
          error => {
            console.error(error);
          }
        );
      }
    }
  }
  ModifierDroitClient(): void {
    let i = 0;
    const client = this.createFromForm();
    this.productService.getUpdate().subscribe(listProduit => {
      this.listProduit = listProduit;
      this.listProduit.forEach((produit: any) => {
        if (this.list[i] !== this.listInitial[i]) {
          if (this.list[i] === true) {
            this.add(produit, client);
          } else {
            this.delete(produit, client);
          }
        }
        i++;
      });
    });
  }

  NameCalculator(name?: string): string | undefined {
    return name?.substring(0, name.indexOf('_'));
  }
  NameVersion(name?: string): string | undefined {
    return name?.substring(name.indexOf('_') + 1, name.length);
  }
  previousState(): void {
    window.history.back();
  }

  save(): void {
    //this.isSaving = true;
    const client = this.createFromForm();

    this.ModifierDroitClient();
    if (client.versionApplicable === null) {
      this.newVersion = this.convertirVersion(client?.productClient);

      this.clientService.createVersion2(client, this.newVersion).subscribe(version => {
        console.log(this.link);
        this.clientService.createVersionApplicable(client, this.todayString, version.createdBy).subscribe(ResVersApplicable => {
          // console.log(ResVersApplicable);
          this.versionApplicable = ResVersApplicable;
        });
        this.clientService
          .createVersionCible(client, this.todayString, version.uid, version.name, version.createdBy)
          .subscribe(versionCible => {
            // console.log(versionCible);
            this.versionCible = versionCible;
            this.name = this.functionNameVersion(client.nameClient, version.name);
            // console.log(this.functionNameVersion(client.nameClient, version.name));
            this.clientService
              .createUpdateADN(client, client.uidClient, version.uid, client.nameClient, version.name, this.name)
              .subscribe(resUpdate => {
                // console.log(resUpdate);
                this.clientService
                  .UpdateClient(
                    client,
                    this.versionApplicable.id,
                    this.versionCible.id,
                    resUpdate.uid,
                    this.name,
                    this.versionApplicable.uidVersionApplicable,
                    this.versionCible.uidVersionCible,
                    client.nameClient,
                    this.newVersion,
                    this.todayString
                  )
                  .subscribe(resUpdate => {
                    // console.log(resUpdate);
                  });
              });
          });
      });
    } else {
      this.clientService.createVersionApplicableFromCible(client, this.todayString).subscribe(va => {
        this.va = va;
      });
      this.newVersion = this.convertirVersion2(client.versionCible?.nameVersionCible);
      this.clientService.createVersion2(client, this.newVersion).subscribe(version => {
        //console.log(version);

        this.clientService
          .createVersionCible(client, this.todayString, version.uid, version.name, version.createdBy)
          .subscribe(versionCible => {
            // console.log(versionCible);
            this.versionCible = versionCible;
            this.name = this.functionNameVersion(client.versionCible?.nameVersionCible, version.name);

            this.clientService
              .createUpdateADN(
                client,
                client.versionCible?.uidVersionCible,
                version.uid,
                client.versionCible?.nameVersionCible,
                version.name,
                this.name
              )
              .subscribe(resUpdate => {
                // console.log(resUpdate);
                this.clientService
                  .UpdateClient(
                    client,
                    this.va.id,
                    this.versionCible.id,
                    resUpdate.uid,
                    this.name,
                    this.va.uidVersionApplicable,
                    version.uid,
                    this.va.nameVersionApplicable,
                    this.newVersion,
                    this.todayString
                  )
                  .subscribe(resUpdate => {
                    // console.log(resUpdate);
                  });
              });
          });
      });
    }

    this.clientService.GetVersion(client).subscribe(data => {
      // this.versionName=data;
      let i = 0;
      while (data.versions[i].name !== undefined) {
        // console.log(data.versions[i].name);
        i++;
      }
    });
  }
  convertirVersion(lastVersion: string | undefined | null): string | undefined {
    let ver = lastVersion?.substring(lastVersion.length - 1, lastVersion.length - 1);
    Number(ver);
    if (ver !== undefined) {
      ver = ver + 1;
      ver = ver.toString();
      this.newVersion = lastVersion?.concat('_ActimuxIndexV').concat(ver);
    }
    return this.newVersion;
  }
  convertirVersion2(lastVersion: string | undefined | null): string | undefined {
    let ver = lastVersion?.substring(lastVersion.length - 1);
    Number(ver);
    if (ver !== undefined) {
      let variable = Number(ver) + 1;
      ver = variable.toString();
      let version1 = lastVersion?.substring(0, lastVersion?.length - 1);
      this.newVersion = version1?.concat(ver);
    }
    return this.newVersion;
  }
  functionNameVersion(nameVersionApplicable?: string | null, nameVersionCible?: string | null): string | null | undefined {
    const name = nameVersionApplicable?.substring(0, nameVersionApplicable.indexOf('_'));

    this.verApp = nameVersionApplicable?.substring(nameVersionApplicable?.length - 1);
    this.verCib = nameVersionCible?.substring(nameVersionCible?.length - 1);
    // console.log('nn');
    // console.log(nameVersionCible?.substring(nameVersionCible?.length - 1, nameVersionCible?.length - 1));
    if (this.verApp !== undefined && this.verCib !== undefined) {
      this.name = name?.concat('_ActimuxIndexV').concat(this.verApp.toString()).concat('toV').concat(this.verCib.toString());
    }
    return this.name;
  }
  trackProductById(index: number, item: IProduct): number {
    return item.id!;
  }

  trackVersionApplicableById(index: number, item: IVersionApplicable): number {
    return item.id!;
  }

  trackVersionCibleById(index: number, item: IVersionCible): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClient>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(client: IClient): void {
    this.editForm.patchValue({
      id: client.id,
      uidClient: client.uidClient,
      nameClient: client.nameClient,
      productClient: client.productClient,
      comment: client.comment,
      description: client.description,
      statut: client.statut,
      client_product: client.client_product,
      versionApplicable: client.versionApplicable,
      versionCible: client.versionCible,
    });

    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(
      this.productsSharedCollection,
      client.client_product
    );
    this.versionApplicablesSharedCollection = this.versionApplicableService.addVersionApplicableToCollectionIfMissing(
      this.versionApplicablesSharedCollection,
      client.versionApplicable
    );
    this.versionCiblesSharedCollection = this.versionCibleService.addVersionCibleToCollectionIfMissing(
      this.versionCiblesSharedCollection,
      client.versionCible
    );
  }

  protected loadRelationshipsOptions(): void {
    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) =>
          this.productService.addProductToCollectionIfMissing(products, this.editForm.get('client_product')!.value)
        )
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));

    this.versionApplicableService
      .query()
      .pipe(map((res: HttpResponse<IVersionApplicable[]>) => res.body ?? []))
      .pipe(
        map((versionApplicables: IVersionApplicable[]) =>
          this.versionApplicableService.addVersionApplicableToCollectionIfMissing(
            versionApplicables,
            this.editForm.get('versionApplicable')!.value
          )
        )
      )
      .subscribe((versionApplicables: IVersionApplicable[]) => (this.versionApplicablesSharedCollection = versionApplicables));

    this.versionCibleService
      .query()
      .pipe(map((res: HttpResponse<IVersionCible[]>) => res.body ?? []))
      .pipe(
        map((versionCibles: IVersionCible[]) =>
          this.versionCibleService.addVersionCibleToCollectionIfMissing(versionCibles, this.editForm.get('versionCible')!.value)
        )
      )
      .subscribe((versionCibles: IVersionCible[]) => (this.versionCiblesSharedCollection = versionCibles));
  }

  protected createFromForm(): IClient {
    return {
      ...new Client(),
      id: this.editForm.get(['id'])!.value,
      uidClient: this.editForm.get(['uidClient'])!.value,
      nameClient: this.editForm.get(['nameClient'])!.value,
      productClient: this.editForm.get(['productClient'])!.value,
      comment: this.editForm.get(['comment'])!.value,
      description: this.editForm.get(['description'])!.value,
      statut: this.editForm.get(['statut'])!.value,
      client_product: this.editForm.get(['client_product'])!.value,
      versionApplicable: this.editForm.get(['versionApplicable'])!.value,
      versionCible: this.editForm.get(['versionCible'])!.value,
    };
  }
}
