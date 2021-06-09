import { LocalDePrestacaoDoServico, StatusDoRps, TipoDeISSRetido } from '../constants';
import { IDadosDoPrestador, IDadosDoTomador } from './IDadosDaPessoa';
import { IValores } from './IValores';
import { IIdentificacaoDoRps } from './IIdentificacaoDoRps';
import { IServico } from './IServico';

export interface IRps {
  id: string;
  identificacao: IIdentificacaoDoRps;
  issRetido: TipoDeISSRetido;
  dataDeEmissao: Date;
  dadosDoPrestador: IDadosDoPrestador;
  dadosDoTomador: IDadosDoTomador;
  servicos: IServico[];
  valores: IValores;
  observacao: string;
  status: StatusDoRps;
  localDePrestacaoDoServico: LocalDePrestacaoDoServico;
}
