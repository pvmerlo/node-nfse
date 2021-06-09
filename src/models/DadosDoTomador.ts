import { IDadosDoTomador } from '../interfaces';
import { Contato } from './Contato';
import { Endereco } from './Endereco';
import { IdentificacaoDaPessoa } from './IdentificacaoDaPessoa';
import { TipoDaPessoa } from '../constants/TipoDaPessoa';

export class DadosDoTomador implements IDadosDoTomador {
  contato: Contato;
  endereco: Endereco;
  identificacao: IdentificacaoDaPessoa;
  nomeFantasia: string;
  razaoSocial: string;

  constructor(partial?: Partial<DadosDoTomador>) {
    if (partial.contato) {
      partial.contato = new Contato(partial.contato);
    }
    if (partial.endereco) {
      partial.endereco = new Endereco(partial.endereco);
    }
    if (partial.identificacao) {
      partial.identificacao = new IdentificacaoDaPessoa(partial.identificacao);
    }
    Object.assign(this, partial || {});
  }

  xml() {
    return `
    <DadosPrestador>
        ${this.identificacao.xml(TipoDaPessoa.Destinatario)}
        <RazaoSocial>${this.razaoSocial.replace(/&/g, 'e')}</RazaoSocial>
        <NomeFantasia>${this.nomeFantasia.replace(/&/g, 'e')}</NomeFantasia>
    </DadosPrestador>
`;
  }
}
