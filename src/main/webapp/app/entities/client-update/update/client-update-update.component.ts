import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IClientUpdate, ClientUpdate } from '../client-update.model';
import { ClientUpdateService } from '../service/client-update.service';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { IUpdate } from 'app/entities/update/update.model';
import { UpdateService } from 'app/entities/update/service/update.service';

@Component({
  selector: 'jhi-client-update-update',
  templateUrl: './client-update-update.component.html',
})
export class ClientUpdateUpdateComponent implements OnInit {
  isSaving = false;

  clientsSharedCollection: IClient[] = [];
  updatesSharedCollection: IUpdate[] = [];

  editForm = this.fb.group({
    id: [],
    client: [],
    update: [],
  });

  constructor(
    protected clientUpdateService: ClientUpdateService,
    protected clientService: ClientService,
    protected updateService: UpdateService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ clientUpdate }) => {
      this.updateForm(clientUpdate);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const clientUpdate = this.createFromForm();
    if (clientUpdate.id !== undefined) {
      this.subscribeToSaveResponse(this.clientUpdateService.update(clientUpdate));
    } else {
      this.subscribeToSaveResponse(this.clientUpdateService.create(clientUpdate));
    }
  }

  trackClientById(index: number, item: IClient): number {
    return item.id!;
  }

  trackUpdateById(index: number, item: IUpdate): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClientUpdate>>): void {
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

  protected updateForm(clientUpdate: IClientUpdate): void {
    this.editForm.patchValue({
      id: clientUpdate.id,
      client: clientUpdate.client,
      update: clientUpdate.update,
    });

    this.clientsSharedCollection = this.clientService.addClientToCollectionIfMissing(this.clientsSharedCollection, clientUpdate.client);
    this.updatesSharedCollection = this.updateService.addUpdateToCollectionIfMissing(this.updatesSharedCollection, clientUpdate.update);
  }

  protected loadRelationshipsOptions(): void {
    this.clientService
      .query()
      .pipe(map((res: HttpResponse<IClient[]>) => res.body ?? []))
      .pipe(map((clients: IClient[]) => this.clientService.addClientToCollectionIfMissing(clients, this.editForm.get('client')!.value)))
      .subscribe((clients: IClient[]) => (this.clientsSharedCollection = clients));

    this.updateService
      .query()
      .pipe(map((res: HttpResponse<IUpdate[]>) => res.body ?? []))
      .pipe(map((updates: IUpdate[]) => this.updateService.addUpdateToCollectionIfMissing(updates, this.editForm.get('update')!.value)))
      .subscribe((updates: IUpdate[]) => (this.updatesSharedCollection = updates));
  }

  protected createFromForm(): IClientUpdate {
    return {
      ...new ClientUpdate(),
      id: this.editForm.get(['id'])!.value,
      client: this.editForm.get(['client'])!.value,
      update: this.editForm.get(['update'])!.value,
    };
  }
}
