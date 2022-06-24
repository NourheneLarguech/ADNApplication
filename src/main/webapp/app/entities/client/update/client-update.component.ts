import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IClient, Client } from '../client.model';
import { ClientService } from '../service/client.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IVersionApplicable } from 'app/entities/version-applicable/version-applicable.model';
import { VersionApplicableService } from 'app/entities/version-applicable/service/version-applicable.service';
import { IVersionCible } from 'app/entities/version-cible/version-cible.model';
import { VersionCibleService } from 'app/entities/version-cible/service/version-cible.service';
import { Statut } from 'app/entities/enumerations/statut.model';

@Component({
  selector: 'jhi-client-update',
  templateUrl: './client-update.component.html',
})
export class ClientUpdateComponent implements OnInit {
  isSaving = false;
  statutValues = Object.keys(Statut);

  productsSharedCollection: IProduct[] = [];
  versionApplicablesSharedCollection: IVersionApplicable[] = [];
  versionCiblesSharedCollection: IVersionCible[] = [];

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
  });

  constructor(
    protected clientService: ClientService,
    protected productService: ProductService,
    protected versionApplicableService: VersionApplicableService,
    protected versionCibleService: VersionCibleService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ client }) => {
      this.updateForm(client);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const client = this.createFromForm();
    if (client.id !== undefined) {
      this.subscribeToSaveResponse(this.clientService.update(client));
    } else {
      this.subscribeToSaveResponse(this.clientService.create(client));
    }
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
