import { IClient } from 'app/entities/client/client.model';
import { IUpdate } from 'app/entities/update/update.model';

export interface IClientUpdate {
  id?: number;
  client?: IClient | null;
  update?: IUpdate | null;
}

export class ClientUpdate implements IClientUpdate {
  constructor(public id?: number, public client?: IClient | null, public update?: IUpdate | null) {}
}

export function getClientUpdateIdentifier(clientUpdate: IClientUpdate): number | undefined {
  return clientUpdate.id;
}
