import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UpdateComponent } from '../list/update.component';
import { UpdateDetailComponent } from '../detail/update-detail.component';
import { UpdateUpdateComponent } from '../update/update-update.component';
import { UpdateRoutingResolveService } from './update-routing-resolve.service';
import { EditComponent } from '../edit/edit.component';
const updateRoute: Routes = [
  {
    path: '',
    component: UpdateComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UpdateDetailComponent,
    resolve: {
      update: UpdateRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UpdateUpdateComponent,
    resolve: {
      update: UpdateRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EditComponent,
    resolve: {
      update: UpdateRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(updateRoute)],
  exports: [RouterModule],
})
export class UpdateRoutingModule {}
