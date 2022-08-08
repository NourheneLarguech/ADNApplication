import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProduct, getProductIdentifier } from '../product.model';

export type EntityResponseType = HttpResponse<IProduct>;
export type EntityArrayResponseType = HttpResponse<IProduct[]>;

@Injectable({ providedIn: 'root' })
export class ProductService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/products');
  links?: any;
  profilUsr?: any;
  link?: string;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}
  getProduct(product: IProduct, link?: string): Observable<any> {
    const token: string | null = `${String(localStorage.getItem('PlatformAPIToken'))}`;
    const uidProduct = product.uidProduct !== undefined ? product.uidProduct : '';
    return this.http.get<any>(`${this.link}/api/v1/product/simple/${uidProduct}`, { headers: { authorization: token } });
  }
  getUpdate(): Observable<any> {
    const token: string | null = `${String(localStorage.getItem('authenticationToken'))}`;
    return this.http.get<any>(`http://localhost:8080/api/updates`, { headers: { authorization: `Bearer ${token}` } });
  }
  profilUser(): Observable<any> {
    const token: string | null = `${String(localStorage.getItem('authenticationToken'))}`;
    return this.http.get<any>('http://localhost:8080/api/account', { headers: { authorization: `Bearer ${token}` } });
  }
  getLink(): Observable<any> {
    const token: string | null = `${String(localStorage.getItem('authenticationToken'))}`;
    return this.http.get<any>('http://localhost:8080/api/links', { headers: { authorization: `Bearer ${token}` } });
  }
  linkUser(): void {
    this.profilUser().subscribe(profilUser => {
      this.profilUsr = profilUser;
    });
    this.getLink().subscribe(links => {
      this.links = links;
      for (const link of this.links) {
        console.log(link);
        if (this.profilUsr.id === link.user.id) {
          this.link = link.nameLink;
          console.log(link.nameLink);
        }
      }
    });
  }
  create(product: IProduct): Observable<EntityResponseType> {
    return this.http.post<IProduct>(this.resourceUrl, product, { observe: 'response' });
  }

  update(product: IProduct): Observable<EntityResponseType> {
    return this.http.put<IProduct>(`${this.resourceUrl}/${getProductIdentifier(product) as number}`, product, { observe: 'response' });
  }

  partialUpdate(product: IProduct): Observable<EntityResponseType> {
    return this.http.patch<IProduct>(`${this.resourceUrl}/${getProductIdentifier(product) as number}`, product, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProduct>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProduct[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProductToCollectionIfMissing(productCollection: IProduct[], ...productsToCheck: (IProduct | null | undefined)[]): IProduct[] {
    const products: IProduct[] = productsToCheck.filter(isPresent);
    if (products.length > 0) {
      const productCollectionIdentifiers = productCollection.map(productItem => getProductIdentifier(productItem)!);
      const productsToAdd = products.filter(productItem => {
        const productIdentifier = getProductIdentifier(productItem);
        if (productIdentifier == null || productCollectionIdentifiers.includes(productIdentifier)) {
          return false;
        }
        productCollectionIdentifiers.push(productIdentifier);
        return true;
      });
      return [...productsToAdd, ...productCollection];
    }
    return productCollection;
  }
}
