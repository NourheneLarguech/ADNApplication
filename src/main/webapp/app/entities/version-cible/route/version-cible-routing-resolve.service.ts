import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVersionCible, VersionCible } from '../version-cible.model';
import { VersionCibleService } from '../service/version-cible.service';

@Injectable({ providedIn: 'root' })
export class VersionCibleRoutingResolveService implements Resolve<IVersionCible> {
  constructor(protected service: VersionCibleService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVersionCible> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((versionCible: HttpResponse<VersionCible>) => {
          if (versionCible.body) {
            return of(versionCible.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new VersionCible());
  }
}
