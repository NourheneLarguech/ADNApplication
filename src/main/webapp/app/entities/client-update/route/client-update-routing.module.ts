import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ClientUpdateComponent } from '../list/client-update.component';
import { ClientUpdateDetailComponent } from '../detail/client-update-detail.component';
import { ClientUpdateUpdateComponent } from '../update/client-update-update.component';
import { ClientUpdateRoutingResolveService } from './client-update-routing-resolve.service';

const clientUpdateRoute: Routes = [
  {
    path: '',
    component: ClientUpdateComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ClientUpdateDetailComponent,
    resolve: {
      clientUpdate: ClientUpdateRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ClientUpdateUpdateComponent,
    resolve: {
      clientUpdate: ClientUpdateRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ClientUpdateUpdateComponent,
    resolve: {
      clientUpdate: ClientUpdateRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(clientUpdateRoute)],
  exports: [RouterModule],
})
export class ClientUpdateRoutingModule {}
