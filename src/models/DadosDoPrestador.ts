import { IDadosDoPrestador } from '../interfaces';
import { Contato } from './Contato';
import { Endereco } from './Endereco';
import { IdentificacaoDaPessoa } from './IdentificacaoDaPessoa';
import { TipoDaPessoa } from '../constants/TipoDaPessoa';

export class DadosDoPrestador implements IDadosDoPrestador {
  contato: Contato;
  endereco: Endereco;
  identificacao: IdentificacaoDaPessoa;
  incentivadorCultural: boolean;
  naturezaDaOperacao: number;
  nomeFantasia: string;
  optanteDoSimplesNacional: boolean;
  razaoSocial: string;
  regimeEspecialDeTributacao: number;

  constructor(partial?: Partial<DadosDoPrestador>) {
    Object.assign(this, partial || {});
  }

  xml() {
    return `
    <DadosPrestador>
        ${this.identificacao.xml(TipoDaPessoa.Emitente)}
        <RazaoSocial>${this.razaoSocial.replace(/&/g, 'e')}</RazaoSocial>
        <NomeFantasia>${this.nomeFantasia.replace(/&/g, 'e')}</NomeFantasia>
        <IncentivadorCultural>${this.incentivadorCultural ? '1' : '2'}</IncentivadorCultural>
        <OptanteSimplesNacional>${this.optanteDoSimplesNacional ? '1' : '2'}</OptanteSimplesNacional>
        <NaturezaOperacao>${this.naturezaDaOperacao}</NaturezaOperacao>
        <RegimeEspecialTributacao>${this.regimeEspecialDeTributacao}</RegimeEspecialTributacao>
    </DadosPrestador>
`;
  }
}
