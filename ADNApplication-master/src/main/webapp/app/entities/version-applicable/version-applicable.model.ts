import { IUpdate } from 'app/entities/update/update.model';
import { IProduct } from 'app/entities/product/product.model';

export interface IVersionApplicable {
  id?: number;
  uidVersionApplicable?: string;
  nameVersionApplicable?: string;
  comment?: string | null;
  description?: string | null;
  createDate?: string | null;
  modifyBy?: string | null;
  modifidDate?: string | null;
  updates?: IUpdate[] | null;
  product?: IProduct | null;
}

export class VersionApplicable implements IVersionApplicable {
  constructor(
    public id?: number,
    public uidVersionApplicable?: string,
    public nameVersionApplicable?: string,
    public comment?: string | null,
    public description?: string | null,
    public createDate?: string | null,
    public modifyBy?: string | null,
    public modifidDate?: string | null,
    public updates?: IUpdate[] | null,
    public product?: IProduct | null
  ) {}
}

export function getVersionApplicableIdentifier(versionApplicable: IVersionApplicable): number | undefined {
  return versionApplicable.id;
}
