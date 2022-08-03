import { IProduct } from 'app/entities/product/product.model';
import { IVersionApplicable } from 'app/entities/version-applicable/version-applicable.model';
import { IVersionCible } from 'app/entities/version-cible/version-cible.model';
import { Statut } from 'app/entities/enumerations/statut.model';

export interface IClient {
  id?: number;
  uidClient?: string | null;
  nameClient?: string | null;
  productClient?: string | null;
  comment?: string | null;
  description?: string | null;
  statut?: Statut | null;
  client_product?: IProduct | null;
  versionApplicable?: IVersionApplicable | null;
  versionCible?: IVersionCible | null;
  nextStatut?: Statut | null;
}

export class Client implements IClient {
  constructor(
    public id?: number,
    public uidClient?: string | null,
    public nameClient?: string | null,
    public productClient?: string | null,
    public comment?: string | null,
    public description?: string | null,
    public statut?: Statut | null,
    public client_product?: IProduct | null,
    public versionApplicable?: IVersionApplicable | null,
    public versionCible?: IVersionCible | null,
    public nextStatut?: Statut | null
  ) {}
}

export function getClientIdentifier(client: IClient): number | undefined {
  return client.id;
}
