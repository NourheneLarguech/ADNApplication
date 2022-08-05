import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VersionApplicableComponent } from '../list/version-applicable.component';
import { VersionApplicableDetailComponent } from '../detail/version-applicable-detail.component';
import { VersionApplicableUpdateComponent } from '../update/version-applicable-update.component';
import { VersionApplicableRoutingResolveService } from './version-applicable-routing-resolve.service';

const versionApplicableRoute: Routes = [
  {
    path: '',
    component: VersionApplicableComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VersionApplicableDetailComponent,
    resolve: {
      versionApplicable: VersionApplicableRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VersionApplicableUpdateComponent,
    resolve: {
      versionApplicable: VersionApplicableRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VersionApplicableUpdateComponent,
    resolve: {
      versionApplicable: VersionApplicableRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(versionApplicableRoute)],
  exports: [RouterModule],
})
export class VersionApplicableRoutingModule {}
