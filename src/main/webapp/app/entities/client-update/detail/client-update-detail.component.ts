import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IClientUpdate } from '../client-update.model';

@Component({
  selector: 'jhi-client-update-detail',
  templateUrl: './client-update-detail.component.html',
})
export class ClientUpdateDetailComponent implements OnInit {
  clientUpdate: IClientUpdate | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ clientUpdate }) => {
      this.clientUpdate = clientUpdate;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
