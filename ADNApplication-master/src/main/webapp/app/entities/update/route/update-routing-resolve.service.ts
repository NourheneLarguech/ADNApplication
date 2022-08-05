import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUpdate, Update } from '../update.model';
import { UpdateService } from '../service/update.service';

@Injectable({ providedIn: 'root' })
export class UpdateRoutingResolveService implements Resolve<IUpdate> {
  constructor(protected service: UpdateService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUpdate> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((update: HttpResponse<Update>) => {
          if (update.body) {
            return of(update.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Update());
  }
}
