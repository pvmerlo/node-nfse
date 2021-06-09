import { IIdentificacaoDaPessoa } from './IIdentificacaoDaPessoa';
import { IEndereco } from './IEndereco';
import { IContato } from './IContato';

interface IDadosDaPessoa {
  identificacao: IIdentificacaoDaPessoa;
  razaoSocial: string;
  nomeFantasia: string;
  endereco: IEndereco;
  contato: IContato;
}

export interface IDadosDoTomador extends IDadosDaPessoa {}

export interface IDadosDoPrestador extends IDadosDaPessoa {
  incentivadorCultural: boolean;
  optanteDoSimplesNacional: boolean;
  naturezaDaOperacao: number;
  regimeEspecialDeTributacao: number;
}