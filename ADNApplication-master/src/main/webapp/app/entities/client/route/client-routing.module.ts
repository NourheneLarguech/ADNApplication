import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ClientComponent } from '../list/client.component';
import { ClientDetailComponent } from '../detail/client-detail.component';
import { ClientUpdateComponent } from '../update/client-update.component';
import { ClientRoutingResolveService } from './client-routing-resolve.service';
import { EditVersionComponent } from '../edit-version/edit-version.component';

const clientRoute: Routes = [
  {
    path: '',
    component: ClientComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ClientDetailComponent,
    resolve: {
      client: ClientRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ClientUpdateComponent,
    resolve: {
      client: ClientRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EditVersionComponent,
    resolve: {
      client: ClientRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(clientRoute)],
  exports: [RouterModule],
})
export class ClientRoutingModule {}
