import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVersionApplicable, VersionApplicable } from '../version-applicable.model';
import { VersionApplicableService } from '../service/version-applicable.service';

@Injectable({ providedIn: 'root' })
export class VersionApplicableRoutingResolveService implements Resolve<IVersionApplicable> {
  constructor(protected service: VersionApplicableService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVersionApplicable> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((versionApplicable: HttpResponse<VersionApplicable>) => {
          if (versionApplicable.body) {
            return of(versionApplicable.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new VersionApplicable());
  }
}
