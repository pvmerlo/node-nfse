import { IIdentificacaoDaPessoa } from '../interfaces';
import { TipoDoDocumento } from '../constants';
import { TipoDaPessoa } from '../constants/TipoDaPessoa';

export class IdentificacaoDaPessoa implements IIdentificacaoDaPessoa {
  documento: string;
  inscricaoMunicipal: string;

  constructor(partial?: Partial<IdentificacaoDaPessoa>) {
    Object.assign(this, partial || {});
  }

  get tipoDoDocumento(): TipoDoDocumento {
    let tipo = TipoDoDocumento.NaoIdentificado;
    if (this.documento?.length === 11) {
      tipo = TipoDoDocumento.CPF;
    } else if (this.documento?.length === 14) {
      tipo = TipoDoDocumento.CNPJ;
    }
    return tipo;
  }

  xml(tipoDaPessoa: TipoDaPessoa) {
    return `
    <Identificacao${tipoDaPessoa}>
        <CpfCnpj>${this.documento}</CpfCnpj>
        <IndicacaoCpfCnpj>${this.tipoDoDocumento}</IndicacaoCpfCnpj>
        ${this.inscricaoMunicipal ? `<InscricaoMunicipal>${this.inscricaoMunicipal}</InscricaoMunicipal>` : ``}
    </Identificacao${tipoDaPessoa}>
    `;
  }
}
