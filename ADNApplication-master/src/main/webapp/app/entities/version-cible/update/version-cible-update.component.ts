import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IVersionCible, VersionCible } from '../version-cible.model';
import { VersionCibleService } from '../service/version-cible.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';

@Component({
  selector: 'jhi-version-cible-update',
  templateUrl: './version-cible-update.component.html',
})
export class VersionCibleUpdateComponent implements OnInit {
  isSaving = false;

  productsSharedCollection: IProduct[] = [];

  editForm = this.fb.group({
    id: [],
    uidVersionCible: [null, [Validators.required]],
    nameVersionCible: [null, [Validators.required]],
    comment: [],
    description: [],
    createDate: [],
    modifyBy: [],
    modifidDate: [],
    product: [],
  });

  constructor(
    protected versionCibleService: VersionCibleService,
    protected productService: ProductService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ versionCible }) => {
      this.updateForm(versionCible);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const versionCible = this.createFromForm();
    if (versionCible.id !== undefined) {
      this.subscribeToSaveResponse(this.versionCibleService.update(versionCible));
    } else {
      this.subscribeToSaveResponse(this.versionCibleService.create(versionCible));
    }
  }

  trackProductById(index: number, item: IProduct): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVersionCible>>): void {
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

  protected updateForm(versionCible: IVersionCible): void {
    this.editForm.patchValue({
      id: versionCible.id,
      uidVersionCible: versionCible.uidVersionCible,
      nameVersionCible: versionCible.nameVersionCible,
      comment: versionCible.comment,
      description: versionCible.description,
      createDate: versionCible.createDate,
      modifyBy: versionCible.modifyBy,
      modifidDate: versionCible.modifidDate,
      product: versionCible.product,
    });

    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(
      this.productsSharedCollection,
      versionCible.product
    );
  }

  protected loadRelationshipsOptions(): void {
    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) => this.productService.addProductToCollectionIfMissing(products, this.editForm.get('product')!.value))
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));
  }

  protected createFromForm(): IVersionCible {
    return {
      ...new VersionCible(),
      id: this.editForm.get(['id'])!.value,
      uidVersionCible: this.editForm.get(['uidVersionCible'])!.value,
      nameVersionCible: this.editForm.get(['nameVersionCible'])!.value,
      comment: this.editForm.get(['comment'])!.value,
      description: this.editForm.get(['description'])!.value,
      createDate: this.editForm.get(['createDate'])!.value,
      modifyBy: this.editForm.get(['modifyBy'])!.value,
      modifidDate: this.editForm.get(['modifidDate'])!.value,
      product: this.editForm.get(['product'])!.value,
    };
  }
}
