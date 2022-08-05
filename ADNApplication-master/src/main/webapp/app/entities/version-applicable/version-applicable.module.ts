import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VersionApplicableComponent } from './list/version-applicable.component';
import { VersionApplicableDetailComponent } from './detail/version-applicable-detail.component';
import { VersionApplicableUpdateComponent } from './update/version-applicable-update.component';
import { VersionApplicableDeleteDialogComponent } from './delete/version-applicable-delete-dialog.component';
import { VersionApplicableRoutingModule } from './route/version-applicable-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  imports: [SharedModule, VersionApplicableRoutingModule, Ng2SearchPipeModule, DataTablesModule],
  declarations: [
    VersionApplicableComponent,
    VersionApplicableDetailComponent,
    VersionApplicableUpdateComponent,
    VersionApplicableDeleteDialogComponent,
  ],
  entryComponents: [VersionApplicableDeleteDialogComponent],
})
export class VersionApplicableModule {}
