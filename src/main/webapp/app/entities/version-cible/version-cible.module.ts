import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VersionCibleComponent } from './list/version-cible.component';
import { VersionCibleDetailComponent } from './detail/version-cible-detail.component';
import { VersionCibleUpdateComponent } from './update/version-cible-update.component';
import { VersionCibleDeleteDialogComponent } from './delete/version-cible-delete-dialog.component';
import { VersionCibleRoutingModule } from './route/version-cible-routing.module';

@NgModule({
  imports: [SharedModule, VersionCibleRoutingModule],
  declarations: [VersionCibleComponent, VersionCibleDetailComponent, VersionCibleUpdateComponent, VersionCibleDeleteDialogComponent],
  entryComponents: [VersionCibleDeleteDialogComponent],
})
export class VersionCibleModule {}
