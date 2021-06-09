import { TipoDoDocumento } from '../constants';

export interface IIdentificacaoDaPessoa {
  documento: string;
  tipoDoDocumento: TipoDoDocumento;
  inscricaoMunicipal: string;
}
