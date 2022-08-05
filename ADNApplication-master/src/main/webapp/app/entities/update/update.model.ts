// import { IVersionApplicable } from 'app/entities/version-applicable/version-applicable.model';
import { IVersionCible } from 'app/entities/version-cible/version-cible.model';
import { IProduct } from 'app/entities/product/product.model';
import { StatutList } from 'app/entities/enumerations/statut-list.model';
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
export interface IUpdate {
  id?: number;
  uidUpdate?: string;
  versionName?: string;
  statut?: StatutList | null;
  description?: string | null;
  comment?: string | null;
  versionApplicable?: IVersionApplicable | null;
  versionCible?: IVersionCible | null;
  product?: IProduct | null;
  nextStatut?: string;
}

export class Update implements IUpdate {
  constructor(
    public id?: number,
    public uidUpdate?: string,
    public versionName?: string,
    public statut?: StatutList | null,
    public description?: string | null,
    public comment?: string | null,
    public versionApplicable?: IVersionApplicable | null,
    public versionCible?: IVersionCible | null,
    public product?: IProduct | null
  ) {}
}

export function getUpdateIdentifier(update: IUpdate): number | undefined {
  return update.id;
}
