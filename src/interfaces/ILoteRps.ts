import { IRps } from './IRps';
import { IIdentificacaoDaPessoa } from './IIdentificacaoDaPessoa';

export interface ILoteRps {
  id: string;
  numero: number;
  identificacaoDoPrestador: IIdentificacaoDaPessoa;
  listaRps: IRps[];
}
