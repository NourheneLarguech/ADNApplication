import { IVersionApplicable } from 'app/entities/version-applicable/version-applicable.model';
import { IVersionCible } from 'app/entities/version-cible/version-cible.model';
import { IUpdate } from 'app/entities/update/update.model';

export interface IProduct {
  id?: number;
  uidProduct?: string;
  nameProduct?: string;
  versionApplicables?: IVersionApplicable[] | null;
  versionCibles?: IVersionCible[] | null;
  updates?: IUpdate[] | null;
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public uidProduct?: string,
    public nameProduct?: string,
    public versionApplicables?: IVersionApplicable[] | null,
    public versionCibles?: IVersionCible[] | null,
    public updates?: IUpdate[] | null
  ) {}
}

export function getProductIdentifier(product: IProduct): number | undefined {
  return product.id;
}
