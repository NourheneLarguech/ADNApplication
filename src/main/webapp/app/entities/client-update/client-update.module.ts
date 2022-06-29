import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ClientUpdateComponent } from './list/client-update.component';
import { ClientUpdateDetailComponent } from './detail/client-update-detail.component';
import { ClientUpdateUpdateComponent } from './update/client-update-update.component';
import { ClientUpdateDeleteDialogComponent } from './delete/client-update-delete-dialog.component';
import { ClientUpdateRoutingModule } from './route/client-update-routing.module';

@NgModule({
  imports: [SharedModule, ClientUpdateRoutingModule],
  declarations: [ClientUpdateComponent, ClientUpdateDetailComponent, ClientUpdateUpdateComponent, ClientUpdateDeleteDialogComponent],
  entryComponents: [ClientUpdateDeleteDialogComponent],
})
export class ClientUpdateModule {}
