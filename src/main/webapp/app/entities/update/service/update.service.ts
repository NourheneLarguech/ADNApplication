import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUpdate, getUpdateIdentifier } from '../update.model';


export type EntityResponseType = HttpResponse<IUpdate>;
export type EntityArrayResponseType = HttpResponse<IUpdate[]>;
@Injectable({ providedIn: 'root' })
export class UpdateService {


  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/updates');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

 /* ***************Ajouter une version applicable ****************** */
  addVersionApplicabe(update:IUpdate):Observable<any> {
    console.log('addVersionApplicable');
    const token: string | null= `${String(localStorage.getItem('PlatformAPIToken'))}`;
    return this.http.post<any>('https://test.actiaadn.com/api/v1/version/',
      {"name":update.versionApplicable,
        "comment":update.comment,
        "description":update.description,
        "productUid":update.product?.uidProduct}
      ,{headers:{"authorization":token}})}


  /* ***************Ajouter une version cible ****************** */
  addVersionCible(update: IUpdate):Observable<any>{
    console.log('addVersioncible');
    const token: string | null= `${String(localStorage.getItem('PlatformAPIToken'))}`;
    return this.http.post<any>('https://test.actiaadn.com/api/v1/version/',
      {"name":update.versionCible,
        "comment":update.comment,
        "description":update.description,
        "productUid":update.product?.uidProduct}
      ,{headers:{"authorization":token}})
  }
  /* ***************Ajouter une version applicable à notre application ****************** */
  createVersionApplicable(update: IUpdate, todayString: string, uid:string,createby:string): Observable<any> {
  const token: string | null= `${String(localStorage.getItem('authenticationToken'))}`;
    // console.log(todayString);
    console.log('token :'+ token)
    return this.http.post<any>('http://localhost:8080/api/version-applicables',
      {
        "uidVersionApplicable": uid,
        "nameVersionApplicable":update.versionApplicable,
        "comment": update.comment,
        "description": update.description,
        "createDate": todayString,
        "modifyBy": createby,
        "modifidDate": todayString,
        "product": {
          "id": update.product?.id,
          "uidProduct": update.product?.uidProduct,
          "nameProduct": update.product?.nameProduct,
          "versionApplicables": null,
          "versionCibles": null,
          "updates": null
        }
      }
    ,{headers:{"authorization": `Bearer ${token}`}})}

  /* ***************Ajouter une version cible à notre application ****************** */
  createVersionCible(update: IUpdate, todayString: string, uid:string,createby:string): Observable<any> {
    const token: string | null= `${String(localStorage.getItem('authenticationToken'))}`;
    //console.log('token :'+ token)
    return this.http.post<any>('http://localhost:8080/api/version-cibles',
      {
        "uidVersionCible": uid,
        "nameVersionCible":update.versionCible,
        "comment": update.comment,
        "description": update.description,
        "createDate": todayString,
        "modifyBy": createby,
        "modifidDate": todayString,
        "product": {
          "id": update.product?.id,
          "uidProduct": update.product?.uidProduct,
          "nameProduct": update.product?.nameProduct,
          "versionApplicables": null,
          "versionCibles": null,
          "updates": null
        }
      }
      ,{headers:{"authorization": `Bearer ${token}`}})}


  /* Update à plateforme ADN */
  createUpdateADN(Update:IUpdate,uidApplicable:string,uidCible:string):Observable<any>{
    console.log('createUpload');
    const token: string | null= `${String(localStorage.getItem('PlatformAPIToken'))}`;
    return this.http.post<any>('https://test.actiaadn.com/api/v1/update/',
      {
        "titles": {},
        "descriptions": {},
        "status": "SUSPENDED",
        "productUid":Update.product?.uidProduct,
        "appliedVersions": [
          {
            "uid": uidApplicable,
            "name": Update.versionApplicable,
            "comment": Update.comment,
            "productUid":Update.product?.uidProduct
          }
        ],
        "linkedVersion": {
          "uid": uidCible,
          "name": Update.versionCible,
          "comment": Update.comment,
          "productUid": Update.product?.uidProduct
        },
        "name": Update.versionName
      },
      {headers:{"authorization":token}})

  }
// Register Upload
  registerUpload(sizeFile:string,uidUpdate:string,contentFile:any,fileName:any):Observable<any>{
    console.log('createUpload');
    const token: string | null= `${String(localStorage.getItem('PlatformAPIToken'))}`;
    return this.http.post<any>(`https://test.actiaadn.com/api/v1/upload/register/${uidUpdate}`,
      {
        "name":fileName,
        "mimeType": "application/x-compress"
      },
      {headers:{"authorization":token,
          "x-upload-checksum":contentFile,
          "x-upload-content-length":sizeFile,
          "x-upload-content-type":"application/x-compress",
          "x-upload-previous-file-uid":"undefined",
          "x-upload-profiles":"DEFAULT",
          "x-upload-uid":uidUpdate
        }})

  }
  createUpdate(update: IUpdate,uidU:string,idVersionApplicable:any,idVersionCible:any,uidVA:string,uidVC:string,todayString:string):Observable<any>{
    console.log('addVersioncible');
    const token: string | null= `${String(localStorage.getItem('authenticationToken'))}`;
    return this.http.post<any>('http://localhost:8080/api/updates',
      {
        "uidUpdate": uidU,
        "versionName": update.versionName,
        "statut": "SUSPENDED",
        "description": update.description,
        "comment": update.comment,
        "versionApplicable": {
          "id": idVersionApplicable,
          "uidVersionApplicable": uidVA,
          "nameVersionApplicable": update.versionApplicable,
          "comment": update.comment,
          "description": update.description,
          "createDate": todayString,
          "modifyBy": todayString,
          "modifidDate": todayString,
          "updates": null,
          "product": {
            "id": update.product?.id,
            "uidProduct": update.product?.uidProduct,
            "nameProduct": update.product?.nameProduct
          }
        },
        "versionCible": {
          "id": idVersionCible,
          "uidVersionCible": uidVC,
          "nameVersionCible": update.versionCible,
          "comment": update.comment,
          "description": update.description,
          "createDate": todayString,
          "modifyBy": todayString,
          "modifidDate": todayString,
          "updates": null,
          "product": {
            "id": update.product?.id,
            "uidProduct": update.product?.uidProduct,
            "nameProduct": update.product?.nameProduct
          }
        },
        "product": {
          "id": update.product?.id,
          "uidProduct": update.product?.uidProduct,
          "nameProduct": update.product?.nameProduct,
          "versionApplicables": null,
          "versionCibles": null,
          "updates": null
        }
      }
      ,{headers:{"authorization": `Bearer ${token}`}})
  }
  EditStatut(update:IUpdate):Observable<any>{
    const token: string | null= `${String(localStorage.getItem('PlatformAPIToken'))}`;
   // console.log("*****");
    const uiUpdate : string =update.uidUpdate !== undefined ? update.uidUpdate  : '';
    //console.error('test uiid0 ',uiUpdate);
    return this.http.patch<any>(`https://test.actiaadn.com/api/v1/update/${uiUpdate}`,{},
      {headers:{"authorization":token}, responseType: 'text' as  'json'})

  }
  EditUpdateADN(update:IUpdate):Observable<any>{
      const token: string | null= `${String(localStorage.getItem('PlatformAPIToken'))}`;
      return this.http.put<any>(`https://test.actiaadn.com/api/v1/update/`,
          {
              "updateFiles": [ ],
              "uid": update.uidUpdate,
              "titles": {},
              "descriptions": {},
              "name": update.versionName,
              "comment": update.comment,
              "status": update.statut,
              "linkedVersion": {
                  "productUid": update.uidUpdate,
                  "createdBy": update.versionApplicable?.modifyBy,
                  "modifiedBy": update.versionApplicable?.modifyBy,
                  "uid": update.versionCible?.uidVersionCible,
                  "description":update.description,
                  "name": update.versionCible?.nameVersionCible,
                  "comment": update.comment
              },
              "appliedVersions": [
                  {
                      "productUid": update.product?.uidProduct,
                      "createdBy": update.versionApplicable?.modifyBy,
                      "modifiedBy": update.versionApplicable?.modifyBy,
                      "uid": update.versionApplicable?.uidVersionApplicable,
                      "description": update.description,
                      "name": update.versionApplicable?.nameVersionApplicable,
                      "comment": update.comment
                  }
              ],
              "productUid": update.product?.uidProduct,
              "blocking": false,
              "productProfiles": [

              ],
              "majorUpdate": false
          },{headers:{"authorization":token}})
  }
  getUpdate(update:IUpdate):Observable<any>{
      const token: string | null= `${String(localStorage.getItem('PlatformAPIToken'))}`;
      const uiUpdate : string =update.uidUpdate !== undefined ? update.uidUpdate  : '';
      return this.http.get(`https://test.actiaadn.com/api/v1/update/${uiUpdate}`,
          {headers:{"authorization":token}})
  }



  DeleteUpdateADN(update:IUpdate):Observable<any>{
    const token: string | null= `${String(localStorage.getItem('PlatformAPIToken'))}`;
    const uiUpdate : string =update.uidUpdate !== undefined ? update.uidUpdate  : '';
    return this.http.delete<any>(`https://test.actiaadn.com/api/v1/update/${uiUpdate}`,
      {headers:{"authorization":token}})
  }
  DeleteVersionApplicableADN(update:IUpdate):Observable<any>{
    const token: string | null= `${String(localStorage.getItem('PlatformAPIToken'))}`;
    const uidVer : string =update.versionApplicable?.uidVersionApplicable !==undefined?update.versionApplicable?.uidVersionApplicable:'';
    return this.http.delete<any>(`https://test.actiaadn.com/api/v1/version/${uidVer}`,
      {headers:{"authorization":token}})
  }
    DeleteVersionCibleADN(update:IUpdate):Observable<any>{
        const token: string | null= `${String(localStorage.getItem('PlatformAPIToken'))}`;
        const uidVerCible : string  =update.versionCible?.uidVersionCible!==undefined?update.versionCible?.uidVersionCible:'' ;
        return this.http.delete<any>(`https://test.actiaadn.com/api/v1/version/${uidVerCible}`,
            {headers:{"authorization":token}})
    }
    DeleteVersionApplicable(update:IUpdate):Observable<any>{
        const token: string | null= `${String(localStorage.getItem('authenticationToken'))}`;
        const idVersionApplicable :number|undefined=update.versionApplicable?.id
        const id:string=idVersionApplicable?.toString()!== undefined?idVersionApplicable?.toString():'';
        return this.http.delete<any>(`http://localhost:8080/api/version-applicables/${id}`,
            {headers:{"authorization": `Bearer ${token}`}})
    }
    DeleteVersionCible(update:IUpdate):Observable<any>{
        const token: string | null= `${String(localStorage.getItem('authenticationToken'))}`;
        const idVersionCible :number|undefined=update.versionCible?.id
        const id:string=idVersionCible?.toString()!== undefined?idVersionCible?.toString():'';
        return this.http.delete<any>(`http://localhost:8080/api/version-cibles/${id}`,
            {headers:{"authorization": `Bearer ${token}`}})
    }
    EditerUpdate(update:IUpdate,statut:string):Observable<any>{
        const token: string | null= `${String(localStorage.getItem('authenticationToken'))}`;
        const id :number|undefined=update.id;
        const idUpdate:string=id?.toString()!== undefined?id?.toString():'';
        return this.http.put<any>(`http://localhost:8080/api/updates/${idUpdate}`,{
                "id": update.id,
                "uidUpdate": update.uidUpdate,
                "versionName": update.versionName,
                "statut": statut,
                "description": update.description,
                "comment": update.comment,
                "versionApplicable": {
                    "id": update.versionApplicable?.id,
                    "uidVersionApplicable": update.versionApplicable?.uidVersionApplicable,
                    "nameVersionApplicable": update.versionApplicable?.nameVersionApplicable,
                    "comment": update.versionApplicable?.comment,
                    "description": update.versionApplicable?.description,
                    "createDate": update.versionApplicable?.modifidDate,
                    "modifyBy":update.versionApplicable?.modifyBy,
                    "modifidDate": update.versionApplicable?.modifidDate,
                },
                "versionCible": {
                    "id": update.versionCible?.id,
                    "uidVersionCible": update.versionCible?.uidVersionCible,
                    "nameVersionCible": update.versionCible?.nameVersionCible,
                    "comment": update.versionCible?.comment,
                    "description": update.versionCible?.description,
                    "createDate": update.versionCible?.modifidDate,
                    "modifyBy": update.versionCible?.modifyBy,
                    "modifidDate":  update.versionCible?.modifidDate
                },
                "product": {
                    "id": update.product?.id,
                    "uidProduct": update.product?.uidProduct,
                    "nameProduct": update.product?.nameProduct
                }
            },
            {headers:{"authorization": `Bearer ${token}`}})


    }
  // *** upload file ***
  // uploadFile(Update:IUpdate,file:any, uidUpdate: string, contentFile: any,sizefile:string,deb:string,fin:string):Observable<any>
  // { const token: string | null= `${String(localStorage.getItem('PlatformAPIToken'))}`;
  //
  //   return this.http.put<any>(`https://test.actiaadn.com/public/v1/upload/${uidUpdate}`,
  //     {
  //       "":file
  //     },
  //     {headers:{"authorization":token,
  //         "x-upload-checksum":contentFile,
  //         //"content-length":length,
  //         "x-upload-content-type":"application/x-compress",
  //         "x-upload-previous-file-uid":"undefined",
  //         "x-upload-profiles":"DEFAULT",
  //         "x-upload-uid":uidUpdate,
  //         "content-range":`bytes ${deb}-${fin}/${sizefile}`
  //       }})
  //
  // }
  // uploadFile2(Update:IUpdate,file:any, uidUpdate: string, contentFile: any,sizefile:string):Observable<any>
  // { const token: string | null= `${String(localStorage.getItem('PlatformAPIToken'))}`;
  //
  //   return this.http.put<any>(`https://test.actiaadn.com/public/v1/upload/${uidUpdate}`,
  //     {
  //       "":file
  //     },
  //     {headers:{"authorization":token,
  //         "x-upload-checksum":contentFile,
  //         //"content-length":length,
  //         "x-upload-content-type":"application/x-compress",
  //         "x-upload-previous-file-uid":"undefined",
  //         "x-upload-profiles":"DEFAULT",
  //         "x-upload-uid":uidUpdate,
  //         "content-range":`bytes 125829120-127672869/${sizefile}`
  //       }})
  //
  // }
  // // // *** upload last
  // uploadFileLast(Update:IUpdate,uidUpdate:string,contentFile: any,sizefile:string):Observable<any>
  // { const token: string | null= `${String(localStorage.getItem('PlatformAPIToken'))}`;
  //   return this.http.put<any>(`https://test.actiaadn.com/public/v1/upload/${uidUpdate}`,
  //     {
  //       "name": "MULTIC-FSX-STD1_1.1-2.4.2.z",
  //       "mimeType": "application/x-compress"
  //     },
  //     {headers:{"authorization":token,
  //         "x-upload-checksum":contentFile,
  //         //"content-length":"2097152",
  //         "x-upload-content-type":"application/x-compress",
  //         "x-upload-previous-file-uid":"undefined",
  //         "x-upload-profiles":"DEFAULT",
  //         "x-upload-uid":uidUpdate,
  //         "content-range":`bytes 125829120-127672869/${sizefile}`
  //       }})
  //
  // }


  // create(update: IUpdate): Observable<EntityResponseType> {
  //   return this.http.post<IUpdate>(this.resourceUrl, update, { observe: 'response' });
  // }


  update(update: IUpdate): Observable<EntityResponseType> {
    return this.http.put<IUpdate>(`${this.resourceUrl}/${getUpdateIdentifier(update) as number}`, update, { observe: 'response' });
  }

  partialUpdate(update: IUpdate): Observable<EntityResponseType> {
    return this.http.patch<IUpdate>(`${this.resourceUrl}/${getUpdateIdentifier(update) as number}`, update, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUpdate>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUpdate[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addUpdateToCollectionIfMissing(updateCollection: IUpdate[], ...updatesToCheck: (IUpdate | null | undefined)[]): IUpdate[] {
    const updates: IUpdate[] = updatesToCheck.filter(isPresent);
    if (updates.length > 0) {
      const updateCollectionIdentifiers = updateCollection.map(updateItem => getUpdateIdentifier(updateItem)!);
      const updatesToAdd = updates.filter(updateItem => {
        const updateIdentifier = getUpdateIdentifier(updateItem);
        if (updateIdentifier == null || updateCollectionIdentifiers.includes(updateIdentifier)) {
          return false;
        }
        updateCollectionIdentifiers.push(updateIdentifier);
        return true;
      });
      return [...updatesToAdd, ...updateCollection];
    }
    return updateCollection;
  }
}
