import { IValores } from '../interfaces';
import { Servico } from './Servico';

export class Valores implements IValores {
  valorDoIss: number;
  valorDosServicos: number;

  constructor(partial?: Partial<Valores>) {
    Object.assign(this, partial || {});
  }

  xml(servicos: Servico[]) {
    return `
    <Valores>
        <ValorServicos>${servicos
          .map(s => s.valorDoServico)
          .reduce((prev, current) => prev + current)
          .toFixed(2)}</ValorServicos>
        <ValorIss>${servicos
          .map(s => s.valorDoServico * (s.aliquota / 100))
          .reduce((prev, current) => prev + current)
          .toFixed(2)}</ValorIss>
    </Valores>
`;
  }
}
