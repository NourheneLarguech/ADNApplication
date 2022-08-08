import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IUpdate, Update } from '../update.model';
import { UpdateService } from '../service/update.service';
import { IVersionApplicable } from 'app/entities/version-applicable/version-applicable.model';
import { VersionApplicableService } from 'app/entities/version-applicable/service/version-applicable.service';
import { IVersionCible } from 'app/entities/version-cible/version-cible.model';
import { VersionCibleService } from 'app/entities/version-cible/service/version-cible.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { StatutList } from 'app/entities/enumerations/statut-list.model';

@Component({
  selector: 'jhi-update-update',
  templateUrl: './update-update.component.html',
})
export class UpdateUpdateComponent implements OnInit {
  varDebutUpload = 0;
  varFinUpload = 2097152;
  todayString = new Date().toDateString();

  versionName = '';
  versionApplicableName = '';
  versionCibleName = '';
  description = '';
  comment = '';
  isSaving = false;
  statutListValues = Object.keys(StatutList);
  ResVersionApplicableADN: any;
  errorMessage: any;
  ResAddVersionCibleADN: any;
  ResAddVersionApplicable: any;
  ResAddVesionCible: any;
  resUpdateADN: any;
  file: any;
  fileZ?: File;
  ResRegisterUpload: any;
  contentfile: any;
  sizeFile: any;
  fileName: any;
  uploadFile: any;
  versionApplicablesSharedCollection: IVersionApplicable[] = [];
  versionCiblesSharedCollection: IVersionCible[] = [];
  productsSharedCollection: IProduct[] = [];
  ResUpdate: any;
  formData?: any;
  contentfile2: any;

  editForm = this.fb.group({
    id: [],
    uidUpdate: [],
    versionName: [null, [Validators.required]],
    statut: [],
    description: [],
    comment: [],
    versionApplicable: [],
    versionCible: [],
    product: [],
  });

  constructor(
    protected updateService: UpdateService,
    protected versionApplicableService: VersionApplicableService,
    protected versionCibleService: VersionCibleService,
    protected productService: ProductService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.updateService.getLink();
    this.activatedRoute.data.subscribe(({ update }) => {
      this.updateForm(update);

      this.loadRelationshipsOptions();
    });
  }
  //récupérer le nom d'un fichier et ajouter à les champs ***
  public handleFileUpload(_event: any): void {
    if (_event.target.files.length > 0) {
      //this.fileZ=_event;
      this.fileName = _event.target.files[0];
      this.fileZ = _event.target.files.file;
      console.log(this.fileName.toString());

      this.versionName = this.fileName.name.split('.').slice(0, -1).join('.');
      console.log(this.fileName.size);
      this.versionApplicableName = this.fileName.name.split('.').slice(0, -1).join('.').concat('.A');
      this.versionCibleName = this.fileName.name.split('.').slice(0, -1).join('.').concat('.B');
      this.description = 'Create '.concat(this.fileName.name.split('.').slice(0, -1).join('.'));
      this.comment = 'Create '.concat(this.fileName.name.split('.').slice(0, -1).join('.'));
      console.log(this.fileName.name.split('.').slice(0, -1).join('.'));
      // const update = this.createFromForm();
      //this.formData.append('uploadFile',this.fileName,this.fileName.name)
    }
  }

  // Lire le contenu d'un ficheier crc *********************
  fileChanged(e: any): any {
    this.file = e.target.files[0];
  }
  uploadDocument(): any {
    const fileReader = new FileReader();
    fileReader.onload = e => {
      //console.log(fileReader.result);
      this.contentfile = fileReader.result;
    };
    fileReader.readAsText(this.file);
  }

  //********************************************************
  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const update = this.createFromForm();
    if (update.id !== undefined) {
      //  this.subscribeToSaveResponse(this.updateService.update(update));
    } else {
      this.AddVersionApplicableADN(update);
      this.AddVersionCibleADN(update);
    }
  }

  AddVersionApplicableADN(update: IUpdate): void {
    this.updateService.addVersionApplicabe(update).subscribe(
      ResVersionApplicableADN => {
        this.ResVersionApplicableADN = ResVersionApplicableADN;
        console.log(this.ResVersionApplicableADN.uid);
        console.log(this.todayString);
        this.AddVersionApplicable(update);
      },
      error => {
        this.errorMessage = error.message;
        console.error('There was an error!', error);
      }
    );
  }
  AddVersionApplicable(update: IUpdate): void {
    this.updateService
      .createVersionApplicable(update, this.todayString, this.ResVersionApplicableADN.uid, this.ResVersionApplicableADN.createdBy)
      .subscribe(
        ResAddVersionApplicable => {
          this.ResAddVersionApplicable = ResAddVersionApplicable;
          console.log(this.ResAddVersionApplicable);
        },
        error => {
          this.errorMessage = error.message;
          console.error('There was an error!', error);
        }
      );
  }
  AddVersionCibleADN(update: IUpdate): void {
    this.updateService.addVersionCible(update).subscribe(
      ResAddVersionCibleADN => {
        this.ResAddVersionCibleADN = ResAddVersionCibleADN;
        this.AddVersionCible(update);
      },
      error => {
        this.errorMessage = error.message;
        console.error('There was an error!', error);
      }
    );
  }
  AddVersionCible(update: IUpdate): void {
    this.updateService
      .createVersionCible(update, this.todayString, this.ResAddVersionCibleADN.uid, this.ResAddVersionCibleADN.createdBy)
      .subscribe(
        ResAddVesionCible => {
          this.ResAddVesionCible = ResAddVesionCible;
          console.log(this.ResAddVesionCible);
          this.UpdateADN(update);
        },
        error => {
          this.errorMessage = error.message;
          console.error('There was an error!', error);
        }
      );
  }
  UpdateADN(update: IUpdate): void {
    this.updateService.createUpdateADN(update, this.ResVersionApplicableADN.uid, this.ResAddVersionCibleADN.uid).subscribe(
      resUpdateADN => {
        this.resUpdateADN = resUpdateADN;
        console.log(this.resUpdateADN);
        console.log(this.contentfile);
        console.log(this.sizeFile);
        //Register Upload ****
        console.log(this.fileName.name);
        console.log('*******');
        console.log(this.fileName.size);
        // this.RegisterUpload(update);
        this.createUpdate(update);
      },
      error => {
        this.errorMessage = error.message;
        console.error('There was an error!', error);
      }
    );
  }
  RegisterUpload(update: IUpdate): void {
    this.updateService.registerUpload(this.fileName.size.toString(), this.resUpdateADN.uid, this.contentfile, this.fileName.name).subscribe(
      ResRegisterUpload => {
        this.ResRegisterUpload = ResRegisterUpload;
        console.log(this.ResRegisterUpload);
        console.log(this.fileName.name);
        //this.Upload(update);
      },
      error => {
        this.errorMessage = error.message;
        console.error('There was an error!', error);
      }
    );
  }

  createUpdate(update: IUpdate): void {
    this.updateService
      .createUpdate(
        update,
        this.resUpdateADN.uid,
        this.ResAddVersionApplicable.id,
        this.ResAddVesionCible.id,
        this.ResVersionApplicableADN.uid,
        this.ResAddVersionCibleADN.uid,
        this.todayString
      )
      .subscribe(
        ResUpdate => {
          this.ResUpdate = ResUpdate;
          console.log(this.ResRegisterUpload);
          console.log(this.fileName.name);
          //this.Upload(update);
        },
        error => {
          this.errorMessage = error.message;
          console.error('There was an error!', error);
        }
      );
  }
  // Upload(update:IUpdate):void{
  //   while(this.varFinUpload<=125829119){
  //
  //     this.updateService.uploadFile(update,this.resUpdateADN.uid, this.fileName,this.contentfile,this.fileName.size.toString(),this.varDebutUpload.toString(),this.varFinUpload.toString()).subscribe(data7 => {
  //         this.uploadFile=data7;
  //         console.log(data7);
  //
  //       },error => {
  //         this.errorMessage = error.message;
  //         console.error('There was an error!', error);
  //       }
  //     )
  //     this.varDebutUpload=this.varFinUpload+1;
  //     this.varFinUpload=this.varFinUpload+2097152;}
  //   this.updateService.uploadFile2(update, this.fileName,this.resUpdateADN.uid.toString(),this.contentfile,this.fileName.size.toString())
  //   this.updateService.uploadFileLast(update,this.resUpdateADN.uid.toString(),this.contentfile,this.fileName.size.toString())
  // }
  trackVersionApplicableById(index: number, item: IVersionApplicable): number {
    return item.id!;
  }

  trackVersionCibleById(index: number, item: IVersionCible): number {
    return item.id!;
  }

  trackProductById(index: number, item: IProduct): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUpdate>>): void {
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

  protected updateForm(update: IUpdate): void {
    this.editForm.patchValue({
      id: update.id,
      uidUpdate: update.uidUpdate,
      versionName: update.versionName,
      statut: update.statut,
      description: update.description,
      comment: update.comment,
      versionApplicable: update.versionApplicable,
      versionCible: update.versionCible,
      product: update.product,
    });

    this.versionApplicablesSharedCollection = this.versionApplicableService.addVersionApplicableToCollectionIfMissing(
      this.versionApplicablesSharedCollection,
      update.versionApplicable
    );
    this.versionCiblesSharedCollection = this.versionCibleService.addVersionCibleToCollectionIfMissing(
      this.versionCiblesSharedCollection,
      update.versionCible
    );
    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(this.productsSharedCollection, update.product);
  }

  protected loadRelationshipsOptions(): void {
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

    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) => this.productService.addProductToCollectionIfMissing(products, this.editForm.get('product')!.value))
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));
  }

  protected createFromForm(): IUpdate {
    return {
      ...new Update(),
      id: this.editForm.get(['id'])!.value,
      uidUpdate: this.editForm.get(['uidUpdate'])!.value,
      versionName: this.editForm.get(['versionName'])!.value,
      statut: this.editForm.get(['statut'])!.value,
      description: this.editForm.get(['description'])!.value,
      comment: this.editForm.get(['comment'])!.value,
      versionApplicable: this.editForm.get(['versionApplicable'])!.value,
      versionCible: this.editForm.get(['versionCible'])!.value,
      product: this.editForm.get(['product'])!.value,
    };
  }
}
