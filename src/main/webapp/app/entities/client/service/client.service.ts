import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IClient, getClientIdentifier } from '../client.model';
import { IUpdate } from '../../update/update.model';

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
  addPermissionClient(produit: any, client: IClient): Observable<any> {
    const token: string | null = `${String(localStorage.getItem('authenticationToken'))}`;
    //console.log('token :'+ token)
    return this.http.post<any>(
      'http://localhost:8080/api/client-updates',
      {
        client: {
          id: client.id,
          uidClient: client.uidClient,
          nameClient: client.nameClient,
          productClient: client.productClient,
          comment: client.comment,
          description: client.description,
          statut: client.statut,
        },
        update: {
          id: produit.id,
          uidUpdate: produit.uidUpdate,
          versionName: produit.versionName,
          statut: produit.statut,
          description: produit.description,
          comment: produit.comment,
        },
      },
      { headers: { authorization: `Bearer ${token}` } }
    );
  }

  deletePermissionClient(id: number): Observable<any> {
    const token: string | null = `${String(localStorage.getItem('authenticationToken'))}`;
    return this.http.delete<any>(`http://localhost:8080/api/client-updates/${id}`, { headers: { authorization: `Bearer ${token}` } });
  }
  // UpdateVersion(client:IClient):Observable<any>{
  //     console.log('addVersioncible');
  //     const name=client.productClient?.concat('_ActimuxIndex')
  //     const token: string | null= `${String(localStorage.getItem('PlatformAPIToken'))}`;
  //     return this.http.post<any>('https://test.actiaadn.com/api/v1/version/',
  //         {"name":client.,
  //             "comment":update.comment,
  //             "description":update.description,
  //             "productUid":update.product?.uidProduct}
  //         ,{headers:{"authorization":token}})
  // }
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
  GetVersion(client: IClient): Observable<any> {
    const token: string | null = `${String(localStorage.getItem('PlatformAPIToken'))}`;
    const uid: string = client.client_product?.uidProduct === undefined ? ' ' : client.client_product?.uidProduct?.toString();
    return this.http.get<any>(`https://test.actiaadn.com/api/v1/product/${uid}`, { headers: { authorization: token } });
  }
  createV0ADN(client: IClient): Observable<any> {
    console.log('addVersionApplicable');
    const token: string | null = `${String(localStorage.getItem('PlatformAPIToken'))}`;
    const nameVersion = client?.productClient?.concat('_ActimuxIndexV0');
    return this.http.post<any>(
      'https://test.actiaadn.com/api/v1/version/',
      { name: nameVersion, comment: client.comment, description: client.description, productUid: client.client_product?.uidProduct },
      { headers: { authorization: token } }
    );
  }

  createV0(client: IClient, version: any): Observable<any> {
    const token: string | null = `${String(localStorage.getItem('authenticationToken'))}`;
    console.log('token :' + token);
    return this.http.post<any>(
      'http://localhost:8080/api/clients',
      {
        uidClient: version.uid,
        nameClient: client.nameClient,
        productClient: client.productClient,
        comment: client.comment,
        description: client.description,
        statut: 'SUSPENDED',
        client_product: {
          id: client.client_product?.id,
          uidProduct: client.client_product?.uidProduct,
          nameProduct: client.client_product?.nameProduct,
        },
        versionApplicable: null,
        versionCible: null,
      },
      { headers: { authorization: `Bearer ${token}` } }
    );
  }
  createVersionV0(client: IClient, todayString: string, uid: string, createby: string): Observable<any> {
    const token: string | null = `${String(localStorage.getItem('authenticationToken'))}`;
    // console.log(todayString);
    console.log('token :' + token);
    return this.http.post<any>(
      'http://localhost:8080/api/version-applicables',
      {
        uidVersionApplicable: uid,
        nameVersionApplicable: client.versionApplicable?.nameVersionApplicable,
        comment: client.comment,
        description: client.description,
        createDate: todayString,
        modifyBy: createby,
        modifidDate: todayString,
        product: {
          id: client.client_product?.id,
          uidProduct: client.client_product?.uidProduct,
          nameProduct: client.client_product?.nameProduct,
          versionApplicables: null,
          versionCibles: null,
          updates: null,
        },
      },
      { headers: { authorization: `Bearer ${token}` } }
    );
  }
  viewDroitClient(): Observable<any> {
    const token: string | null = `${String(localStorage.getItem('authenticationToken'))}`;
    return this.http.get<any>('http://localhost:8080/api/client-updates?page=0&size=20&sort=id,asc', {
      headers: { authorization: `Bearer ${token}` },
    });
  }
}
