import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVersionApplicable, getVersionApplicableIdentifier } from '../version-applicable.model';

export type EntityResponseType = HttpResponse<IVersionApplicable>;
export type EntityArrayResponseType = HttpResponse<IVersionApplicable[]>;

@Injectable({ providedIn: 'root' })
export class VersionApplicableService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/version-applicables');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(versionApplicable: IVersionApplicable): Observable<EntityResponseType> {
    return this.http.post<IVersionApplicable>(this.resourceUrl, versionApplicable, { observe: 'response' });
  }

  update(versionApplicable: IVersionApplicable): Observable<EntityResponseType> {
    return this.http.put<IVersionApplicable>(
      `${this.resourceUrl}/${getVersionApplicableIdentifier(versionApplicable) as number}`,
      versionApplicable,
      { observe: 'response' }
    );
  }

  partialUpdate(versionApplicable: IVersionApplicable): Observable<EntityResponseType> {
    return this.http.patch<IVersionApplicable>(
      `${this.resourceUrl}/${getVersionApplicableIdentifier(versionApplicable) as number}`,
      versionApplicable,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVersionApplicable>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVersionApplicable[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addVersionApplicableToCollectionIfMissing(
    versionApplicableCollection: IVersionApplicable[],
    ...versionApplicablesToCheck: (IVersionApplicable | null | undefined)[]
  ): IVersionApplicable[] {
    const versionApplicables: IVersionApplicable[] = versionApplicablesToCheck.filter(isPresent);
    if (versionApplicables.length > 0) {
      const versionApplicableCollectionIdentifiers = versionApplicableCollection.map(
        versionApplicableItem => getVersionApplicableIdentifier(versionApplicableItem)!
      );
      const versionApplicablesToAdd = versionApplicables.filter(versionApplicableItem => {
        const versionApplicableIdentifier = getVersionApplicableIdentifier(versionApplicableItem);
        if (versionApplicableIdentifier == null || versionApplicableCollectionIdentifiers.includes(versionApplicableIdentifier)) {
          return false;
        }
        versionApplicableCollectionIdentifiers.push(versionApplicableIdentifier);
        return true;
      });
      return [...versionApplicablesToAdd, ...versionApplicableCollection];
    }
    return versionApplicableCollection;
  }
}
