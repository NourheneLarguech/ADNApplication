import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IClient, getClientIdentifier } from '../client.model';

export type EntityResponseType = HttpResponse<IClient>;
export type EntityArrayResponseType = HttpResponse<IClient[]>;

@Injectable({ providedIn: 'root' })
export class ClientService {
  profil: BehaviorSubject<any>;
  observable!: Observable<any>;
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/clients');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.profil = new BehaviorSubject<any>('');
    this.observable = this.profil.asObservable();
  }
  viewProfil(uidProduct?: string): Observable<any> {
    const token: string | null = `${String(localStorage.getItem('PlatformAPIToken'))}`;
    uidProduct = uidProduct !== undefined ? uidProduct : '';

    return this.http.get<any>(`https://test.actiaadn.com/api/v1/product/simple/${uidProduct}`, { headers: { authorization: token } });
  }
  addProfil(client?: IClient, profil?: string, listProfil?: string[][]): Observable<any> {
    const token: string | null = `${String(localStorage.getItem('PlatformAPIToken'))}`;
    return this.http.put<any>(
      'https://test.actiaadn.com/api/v1/product/',
      {
        versions: [],
        updates: [],
        id: '',
        uid: client?.client_product?.uidProduct,
        name: client?.client_product?.nameProduct,
        comment: '',
        code: '',
        profiles: listProfil,
        icon: null,
        right: null,
        uniqueProfiles: listProfil,
      },
      { headers: { authorization: token } }
    );
  }
  create(client: IClient): Observable<EntityResponseType> {
    return this.http.post<IClient>(this.resourceUrl, client, { observe: 'response' });
  }

  update(client: IClient): Observable<EntityResponseType> {
    return this.http.put<IClient>(`${this.resourceUrl}/${getClientIdentifier(client) as number}`, client, { observe: 'response' });
  }

  partialUpdate(client: IClient): Observable<EntityResponseType> {
    return this.http.patch<IClient>(`${this.resourceUrl}/${getClientIdentifier(client) as number}`, client, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IClient>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IClient[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addClientToCollectionIfMissing(clientCollection: IClient[], ...clientsToCheck: (IClient | null | undefined)[]): IClient[] {
    const clients: IClient[] = clientsToCheck.filter(isPresent);
    if (clients.length > 0) {
      const clientCollectionIdentifiers = clientCollection.map(clientItem => getClientIdentifier(clientItem)!);
      const clientsToAdd = clients.filter(clientItem => {
        const clientIdentifier = getClientIdentifier(clientItem);
        if (clientIdentifier == null || clientCollectionIdentifiers.includes(clientIdentifier)) {
          return false;
        }
        clientCollectionIdentifiers.push(clientIdentifier);
        return true;
      });
      return [...clientsToAdd, ...clientCollection];
    }
    return clientCollection;
  }

  shareData(newValue: any): void {
    this.profil.next(newValue);
  }
}
