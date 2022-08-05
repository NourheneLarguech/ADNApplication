import { IUpdate } from 'app/entities/update/update.model';
import { IProduct } from 'app/entities/product/product.model';

export interface IVersionCible {
  id?: number;
  uidVersionCible?: string;
  nameVersionCible?: string;
  comment?: string | null;
  description?: string | null;
  createDate?: string | null;
  modifyBy?: string | null;
  modifidDate?: string | null;
  updates?: IUpdate[] | null;
  product?: IProduct | null;
}

export class VersionCible implements IVersionCible {
  constructor(
    public id?: number,
    public uidVersionCible?: string,
    public nameVersionCible?: string,
    public comment?: string | null,
    public description?: string | null,
    public createDate?: string | null,
    public modifyBy?: string | null,
    public modifidDate?: string | null,
    public updates?: IUpdate[] | null,
    public product?: IProduct | null
  ) {}
}

export function getVersionCibleIdentifier(versionCible: IVersionCible): number | undefined {
  return versionCible.id;
}
