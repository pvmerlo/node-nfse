import { IRps } from '../interfaces';
import { DadosDoPrestador } from './DadosDoPrestador';
import { DadosDoTomador } from './DadosDoTomador';
import { LocalDePrestacaoDoServico, StatusDoRps, TipoDeISSRetido } from '../constants';
import { Valores } from './Valores';
import { xmlAtor, xmlServico } from '../OC/Emissao';
import { IdentificacaoDoRps } from './IdentificacaoDoRps';
import { Servico } from './Servico';

export class Rps implements IRps {
  id: string;
  identificacao: IdentificacaoDoRps;
  dadosDoPrestador: DadosDoPrestador;
  dadosDoTomador: DadosDoTomador;
  dataDeEmissao: Date;
  issRetido: TipoDeISSRetido;
  observacao: string;
  status: StatusDoRps;
  servicos: Servico[];
  valores: Valores;
  localDePrestacaoDoServico: LocalDePrestacaoDoServico;

  constructor(partial?: Partial<Rps>) {
    Object.assign(this, partial || {});
  }

  xml() {
    return `
        <Rps>
          <Id>${this.id}</Id>
          <LocalPrestacao>${this.localDePrestacaoDoServico}</LocalPrestacao>
          <IssRetido>${this.issRetido}</IssRetido>
          <DataEmissao>${this.dataDeEmissao}</DataEmissao>
          ${this.identificacao.xml()}
          ${this.dadosDoPrestador.xml()}
          ${this.dadosDoTomador.xml()}
          <Servicos>
            ${this.servicos.map(servico => servico.xml(this.localDePrestacaoDoServico))}
          </Servicos>
          ${this.valores.xml(this.servicos)}
          <Observacao>${this.observacao}</Observacao>
          <Status>${this.status}</Status>
        </Rps>
`;
  }
}
