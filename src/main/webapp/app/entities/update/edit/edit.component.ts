import { Component, OnInit } from '@angular/core';
import { StatutList } from '../../enumerations/statut-list.model';
import { IVersionApplicable } from '../../version-applicable/version-applicable.model';
import { IVersionCible } from '../../version-cible/version-cible.model';
import { IProduct } from '../../product/product.model';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { UpdateService } from '../service/update.service';
import { VersionApplicableService } from '../../version-applicable/service/version-applicable.service';
import { VersionCibleService } from '../../version-cible/service/version-cible.service';
import { ProductService } from '../../product/service/product.service';
import { ActivatedRoute } from '@angular/router';
import { IUpdate, Update } from '../update.model';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize, map } from 'rxjs/operators';
import { UpdateDeleteDialogComponent } from '../delete/update-delete-dialog.component';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modal/modal.component';
declare let window: any;
@Component({
  selector: 'jhi-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  ResEditStatut: any;
  versionName = '';
  description = '';
  comment = '';
  isSaving = false;
  statutListValues = Object.keys(StatutList);
  errorMessage: any;
  ResAddVersionApplicable: any;
  file: any;
  versionApplicablesSharedCollection: IVersionApplicable[] = [];
  versionCiblesSharedCollection: IVersionCible[] = [];
  productsSharedCollection: IProduct[] = [];
  statutNext?: string;
  statut: any;
  formModal: any;
  ResGetUpdate: any;
  productName?: string;
  versionApplicableName?: string;
  versionCibleName?: string;
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
  private closeResult?: string;

  constructor(
    protected updateService: UpdateService,
    protected versionApplicableService: VersionApplicableService,
    protected versionCibleService: VersionCibleService,
    protected productService: ProductService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.updateService.getLink();
    this.activatedRoute.data.subscribe(({ update }) => {
      this.updateForm(update);
      this.loadRelationshipsOptions();
      this.statut = this.createFromForm().statut;
      this.productName = this.createFromForm().product?.nameProduct;
      this.versionApplicableName = this.createFromForm().versionApplicable?.nameVersionApplicable;
      this.versionCibleName = this.createFromForm().versionCible?.nameVersionCible;
      if (this.createFromForm().statut === 'SUSPENDED') {
        this.statutNext = 'PASSER EN IN_TEST';
      } else {
        if (this.createFromForm().statut === 'IN_TEST') {
          this.statutNext = 'PASSER EN FIELD_TEST';
        } else {
          if (this.createFromForm().statut === 'FIELD_TEST') {
            this.statutNext = 'PASSER EN PUBLISHED';
          } else {
            if (this.createFromForm().statut === 'PUBLISHED') {
              this.statutNext = 'PASSER EN SUSPENDED';
            }
          }
        }
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  changeStatut(): void {
    const update = this.createFromForm();
    this.updateService.getUpdate(update).subscribe(data => {
      this.ResGetUpdate = data.updateFiles;

      console.log(this.ResGetUpdate);
      if (this.ResGetUpdate.length === 0) {
        console.log('longeur 0');
        this.afficher();
      } else {
        this.updateService.EditStatut(update).subscribe(
          ResEditStatut => {
            this.statut = ResEditStatut;

            if (this.statut === 'SUSPENDED') {
              this.statutNext = 'PASSER EN IN_TEST';
            } else {
              if (this.statut === 'IN_TEST') {
                this.statutNext = 'PASSER EN FIELD_TEST';
              } else {
                if (this.statut === 'FIELD_TEST') {
                  this.statutNext = 'PASSER EN PUBLISHED';
                } else {
                  this.statutNext = 'PASSER EN SUSPENDED';
                }
              }
            }
          },
          error => {
            this.errorMessage = error.message;
            console.error('There was an error!', error);
          }
        );
      }
    });
  }
  save(): void {
    this.isSaving = true;
    const update = this.createFromForm();

    if (update.id !== undefined) {
      this.subscribeToSaveResponse(this.updateService.update(update));
      this.updateService.EditUpdateADN(update).subscribe(
        data => console.log(data),
        error => console.log(error)
      );
    }
  }
  afficher(): void {
    const modalRef = this.modalService.open(ModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.closed;
  }

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

  // open(content?:any):any {
  //   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }
  // open(statut: string): any {
  //     const modalref = this.modalService.open(ModalComponent, {size: 'lg'});
  //     modalref.componentInstance.statut = statut;
  // }

  // private getDismissReason(reason: any): string {
  //     if (reason === ModalDismissReasons.ESC) {
  //         return 'by pressing ESC';
  //     } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //         return 'by clicking on a backdrop';
  //     } else {
  //         return `with: ${reason}`;
  //     }
  // }

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
