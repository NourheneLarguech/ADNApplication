import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IClientUpdate, getClientUpdateIdentifier } from '../client-update.model';

export type EntityResponseType = HttpResponse<IClientUpdate>;
export type EntityArrayResponseType = HttpResponse<IClientUpdate[]>;

@Injectable({ providedIn: 'root' })
export class ClientUpdateService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/client-updates');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(clientUpdate: IClientUpdate): Observable<EntityResponseType> {
    return this.http.post<IClientUpdate>(this.resourceUrl, clientUpdate, { observe: 'response' });
  }

  update(clientUpdate: IClientUpdate): Observable<EntityResponseType> {
    return this.http.put<IClientUpdate>(`${this.resourceUrl}/${getClientUpdateIdentifier(clientUpdate) as number}`, clientUpdate, {
      observe: 'response',
    });
  }

  partialUpdate(clientUpdate: IClientUpdate): Observable<EntityResponseType> {
    return this.http.patch<IClientUpdate>(`${this.resourceUrl}/${getClientUpdateIdentifier(clientUpdate) as number}`, clientUpdate, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IClientUpdate>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IClientUpdate[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addClientUpdateToCollectionIfMissing(
    clientUpdateCollection: IClientUpdate[],
    ...clientUpdatesToCheck: (IClientUpdate | null | undefined)[]
  ): IClientUpdate[] {
    const clientUpdates: IClientUpdate[] = clientUpdatesToCheck.filter(isPresent);
    if (clientUpdates.length > 0) {
      const clientUpdateCollectionIdentifiers = clientUpdateCollection.map(
        clientUpdateItem => getClientUpdateIdentifier(clientUpdateItem)!
      );
      const clientUpdatesToAdd = clientUpdates.filter(clientUpdateItem => {
        const clientUpdateIdentifier = getClientUpdateIdentifier(clientUpdateItem);
        if (clientUpdateIdentifier == null || clientUpdateCollectionIdentifiers.includes(clientUpdateIdentifier)) {
          return false;
        }
        clientUpdateCollectionIdentifiers.push(clientUpdateIdentifier);
        return true;
      });
      return [...clientUpdatesToAdd, ...clientUpdateCollection];
    }
    return clientUpdateCollection;
  }
}
