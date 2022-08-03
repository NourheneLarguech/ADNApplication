import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IClient } from '../client.model';
import { ClientService } from '../service/client.service';

@Component({
  selector: 'jhi-client-detail',
  templateUrl: './client-detail.component.html',
})
export class ClientDetailComponent implements OnInit {
  client: IClient | null = null;
  permissionClient: any;
  constructor(protected activatedRoute: ActivatedRoute, protected clientService: ClientService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ client }) => {
      this.client = client;
    });
    this.clientService.viewDroitClient().subscribe(permissionClient => {
      this.permissionClient = permissionClient;

      console.log(this.permissionClient);
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
}
