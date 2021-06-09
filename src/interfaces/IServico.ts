import { LocalDePrestacaoDoServico } from '../constants';

export interface IServico {
  cnae: string;
  codigoServicoLC116: string;
  codigoServicoMunicipal: string;
  quantidade: number;
  unidadeDeMedida: string;
  descricao: string;
  aliquota: number;
  valorDoServico: number;
  valorDoISSQN: number;
  valorDoDesconto: number;
  numeroDoAlvara: string;
}
