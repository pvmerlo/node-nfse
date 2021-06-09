import { IServico } from '../interfaces';
import { LocalDePrestacaoDoServico } from '../constants';

export class Servico implements IServico {
  aliquota: number;
  cnae: string;
  codigoServicoLC116: string;
  codigoServicoMunicipal: string;
  descricao: string;
  numeroDoAlvara: string;
  quantidade: number;
  unidadeDeMedida: string;
  valorDoDesconto: number;
  valorDoISSQN: number;
  valorDoServico: number;

  constructor(partial?: Partial<Servico>) {
    Object.assign(this, partial || {});
  }

  xml(localDePrestacaoDoServico: LocalDePrestacaoDoServico) {
    return `
    <Servico>
        ${this.cnae ? `<CodigoCnae>${this.cnae}</CodigoCnae>` : ``}
        <CodigoServico116>${this.codigoServicoLC116}</CodigoServico116>
        <CodigoServicoMunicipal>${this.codigoServicoMunicipal}</CodigoServicoMunicipal>
        <Quantidade>${this.quantidade.toFixed(4)}</Quantidade>
        <Unidade>${this.unidadeDeMedida || 'UN'}</Unidade>
        <Descricao>${this.descricao}</Descricao>
        <Aliquota>${this.aliquota.toFixed(4)}</Aliquota>
        <ValorServico>${this.valorDoServico.toFixed(4)}</ValorServico>
        <ValorIssqn>${(localDePrestacaoDoServico === LocalDePrestacaoDoServico.ForaDoMunicipio
          ? this.valorDoServico * (this.aliquota / 100)
          : 0
        ).toFixed(2)}</ValorIssqn>
        <ValorDesconto>${this.valorDoDesconto.toFixed(2)}</ValorDesconto>
        ${this.numeroDoAlvara ? `<NumeroAlvara>${this.numeroDoAlvara}</NumeroAlvara>` : ``}
    </Servico>
`;
  }
}
