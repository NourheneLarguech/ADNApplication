import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IVersionApplicable, VersionApplicable } from '../version-applicable.model';
import { VersionApplicableService } from '../service/version-applicable.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';

@Component({
  selector: 'jhi-version-applicable-update',
  templateUrl: './version-applicable-update.component.html',
})
export class VersionApplicableUpdateComponent implements OnInit {
  isSaving = false;

  productsSharedCollection: IProduct[] = [];

  editForm = this.fb.group({
    id: [],
    uidVersionApplicable: [null, [Validators.required]],
    nameVersionApplicable: [null, [Validators.required]],
    comment: [],
    description: [],
    createDate: [],
    modifyBy: [],
    modifidDate: [],
    product: [],
  });

  constructor(
    protected versionApplicableService: VersionApplicableService,
    protected productService: ProductService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ versionApplicable }) => {
      this.updateForm(versionApplicable);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const versionApplicable = this.createFromForm();
    if (versionApplicable.id !== undefined) {
      this.subscribeToSaveResponse(this.versionApplicableService.update(versionApplicable));
    } else {
      this.subscribeToSaveResponse(this.versionApplicableService.create(versionApplicable));
    }
  }

  trackProductById(index: number, item: IProduct): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVersionApplicable>>): void {
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

  protected updateForm(versionApplicable: IVersionApplicable): void {
    this.editForm.patchValue({
      id: versionApplicable.id,
      uidVersionApplicable: versionApplicable.uidVersionApplicable,
      nameVersionApplicable: versionApplicable.nameVersionApplicable,
      comment: versionApplicable.comment,
      description: versionApplicable.description,
      createDate: versionApplicable.createDate,
      modifyBy: versionApplicable.modifyBy,
      modifidDate: versionApplicable.modifidDate,
      product: versionApplicable.product,
    });

    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(
      this.productsSharedCollection,
      versionApplicable.product
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

  protected createFromForm(): IVersionApplicable {
    return {
      ...new VersionApplicable(),
      id: this.editForm.get(['id'])!.value,
      uidVersionApplicable: this.editForm.get(['uidVersionApplicable'])!.value,
      nameVersionApplicable: this.editForm.get(['nameVersionApplicable'])!.value,
      comment: this.editForm.get(['comment'])!.value,
      description: this.editForm.get(['description'])!.value,
      createDate: this.editForm.get(['createDate'])!.value,
      modifyBy: this.editForm.get(['modifyBy'])!.value,
      modifidDate: this.editForm.get(['modifidDate'])!.value,
      product: this.editForm.get(['product'])!.value,
    };
  }
}
