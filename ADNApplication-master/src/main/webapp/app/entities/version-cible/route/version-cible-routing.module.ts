import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VersionCibleComponent } from '../list/version-cible.component';
import { VersionCibleDetailComponent } from '../detail/version-cible-detail.component';
import { VersionCibleUpdateComponent } from '../update/version-cible-update.component';
import { VersionCibleRoutingResolveService } from './version-cible-routing-resolve.service';

const versionCibleRoute: Routes = [
  {
    path: '',
    component: VersionCibleComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VersionCibleDetailComponent,
    resolve: {
      versionCible: VersionCibleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VersionCibleUpdateComponent,
    resolve: {
      versionCible: VersionCibleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VersionCibleUpdateComponent,
    resolve: {
      versionCible: VersionCibleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(versionCibleRoute)],
  exports: [RouterModule],
})
export class VersionCibleRoutingModule {}
