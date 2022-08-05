import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UpdateComponent } from './list/update.component';
import { UpdateDetailComponent } from './detail/update-detail.component';
import { UpdateUpdateComponent } from './update/update-update.component';
import { UpdateDeleteDialogComponent } from './delete/update-delete-dialog.component';
import { UpdateRoutingModule } from './route/update-routing.module';
import { EditComponent } from './edit/edit.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [SharedModule, UpdateRoutingModule, Ng2SearchPipeModule, NgxPaginationModule, NgbModule],
  declarations: [UpdateComponent, UpdateDetailComponent, UpdateUpdateComponent, UpdateDeleteDialogComponent, EditComponent],
  entryComponents: [UpdateDeleteDialogComponent],
})
export class UpdateModule {}
