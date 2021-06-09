import { TipoDoRps } from '../constants';

export interface IIdentificacaoDoRps {
  numero: number;
  serie?: string;
  tipo: TipoDoRps;
}
