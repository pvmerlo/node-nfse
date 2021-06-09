import { IIdentificacaoDoRps } from '../interfaces';
import { TipoDoRps } from '../constants';

export class IdentificacaoDoRps implements IIdentificacaoDoRps {
  numero: number;
  serie: string;
  tipo: TipoDoRps;

  constructor(partial?: Partial<IdentificacaoDoRps>) {
    Object.assign(this, partial || {});
  }

  xml() {
    return `
    <IdentificacaoRps>
        <Numero>${this.numero.toFixed(0)}</Numero>
        ${this.serie ? `<Serie>${this.serie}</Serie>` : ``}
        <Tipo>${this.tipo}</Tipo>
    </IdentificacaoRps>
`;
  }
}
