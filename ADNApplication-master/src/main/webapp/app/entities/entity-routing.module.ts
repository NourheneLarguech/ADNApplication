import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VersionApplicableComponent } from './version-applicable/list/version-applicable.component';
import { UserRouteAccessService } from '../core/auth/user-route-access.service';
import { EditComponent } from './update/edit/edit.component';
import { VersionApplicableRoutingResolveService } from './version-applicable/route/version-applicable-routing-resolve.service';
import { UpdateModule } from './update/update.module';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'product',
        data: { pageTitle: 'adnApplicationApp.product.home.title' },
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
      },
      {
        path: 'update',
        data: { pageTitle: 'adnApplicationApp.update.home.title' },
        loadChildren: () => import('./update/update.module').then(m => m.UpdateModule),
      },
      // {
      //   path: 'edit',
      //   component: EditComponent,
      //   data: { pageTitle: 'adnApplicationApp.versionApplicable.home.title' },
      //   loadChildren: () => import('./version-applicable/version-applicable.module').then(m => m.VersionApplicableModule),
      //
      // },
      {
        path: 'version-applicable',
        data: { pageTitle: 'adnApplicationApp.versionApplicable.home.title' },
        loadChildren: () => import('./version-applicable/version-applicable.module').then(m => m.VersionApplicableModule),
      },
      {
        path: 'version-cible',
        data: { pageTitle: 'adnApplicationApp.versionCible.home.title' },
        loadChildren: () => import('./version-cible/version-cible.module').then(m => m.VersionCibleModule),
      },

      {
        path: 'client',
        data: { pageTitle: 'adnApplicationApp.update.home.title' },
        loadChildren: () => import('./client/client.module').then(m => m.ClientModule),
      },
      {
        path: 'client-update',
        data: { pageTitle: 'adnApplicationApp.clientUpdate.home.title' },
        loadChildren: () => import('./client-update/client-update.module').then(m => m.ClientUpdateModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
