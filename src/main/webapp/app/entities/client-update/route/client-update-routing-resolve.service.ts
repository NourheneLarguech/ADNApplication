import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IClientUpdate, ClientUpdate } from '../client-update.model';
import { ClientUpdateService } from '../service/client-update.service';

@Injectable({ providedIn: 'root' })
export class ClientUpdateRoutingResolveService implements Resolve<IClientUpdate> {
  constructor(protected service: ClientUpdateService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IClientUpdate> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((clientUpdate: HttpResponse<ClientUpdate>) => {
          if (clientUpdate.body) {
            return of(clientUpdate.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ClientUpdate());
  }
}
