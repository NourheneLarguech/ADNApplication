import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVersionCible, getVersionCibleIdentifier } from '../version-cible.model';

export type EntityResponseType = HttpResponse<IVersionCible>;
export type EntityArrayResponseType = HttpResponse<IVersionCible[]>;

@Injectable({ providedIn: 'root' })
export class VersionCibleService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/version-cibles');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(versionCible: IVersionCible): Observable<EntityResponseType> {
    return this.http.post<IVersionCible>(this.resourceUrl, versionCible, { observe: 'response' });
  }

  update(versionCible: IVersionCible): Observable<EntityResponseType> {
    return this.http.put<IVersionCible>(`${this.resourceUrl}/${getVersionCibleIdentifier(versionCible) as number}`, versionCible, {
      observe: 'response',
    });
  }

  partialUpdate(versionCible: IVersionCible): Observable<EntityResponseType> {
    return this.http.patch<IVersionCible>(`${this.resourceUrl}/${getVersionCibleIdentifier(versionCible) as number}`, versionCible, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVersionCible>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVersionCible[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addVersionCibleToCollectionIfMissing(
    versionCibleCollection: IVersionCible[],
    ...versionCiblesToCheck: (IVersionCible | null | undefined)[]
  ): IVersionCible[] {
    const versionCibles: IVersionCible[] = versionCiblesToCheck.filter(isPresent);
    if (versionCibles.length > 0) {
      const versionCibleCollectionIdentifiers = versionCibleCollection.map(
        versionCibleItem => getVersionCibleIdentifier(versionCibleItem)!
      );
      const versionCiblesToAdd = versionCibles.filter(versionCibleItem => {
        const versionCibleIdentifier = getVersionCibleIdentifier(versionCibleItem);
        if (versionCibleIdentifier == null || versionCibleCollectionIdentifiers.includes(versionCibleIdentifier)) {
          return false;
        }
        versionCibleCollectionIdentifiers.push(versionCibleIdentifier);
        return true;
      });
      return [...versionCiblesToAdd, ...versionCibleCollection];
    }
    return versionCibleCollection;
  }
}
