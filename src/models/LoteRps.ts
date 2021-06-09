import { ILoteRps } from '../interfaces/ILoteRps';
import { Rps } from './Rps';
import { IdentificacaoDaPessoa } from './IdentificacaoDaPessoa';
import { TipoDaPessoa } from '../constants/TipoDaPessoa';
import { v4 as uuidv4 } from 'uuid';

export class LoteRps implements ILoteRps {
  identificacaoDoPrestador: IdentificacaoDaPessoa;
  listaRps: Rps[];
  numero: number;

  constructor(partial?: Partial<LoteRps>) {
    Object.assign(this, partial || {});
  }

  get id(): string {
    return uuidv4().replace(/-/g, '');
  }

  get quantidadeRps() {
    return this.listaRps?.length || 0;
  }

  get xml() {
    return `
    <LoteRps 
      xmlns="http://www.el.com.br/nfse/xsd/el-nfse.xsd" 
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
      xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
      xsi:schemaLocation="http://www.el.com.br/nfse/xsd/el-nfse.xsd el-nfse.xsd ">
        <Id>${this.id}</Id>
        <NumeroLote>${this.numero}</NumeroLote>
        <QuantidadeRps>${this.quantidadeRps}</QuantidadeRps>
        ${this.identificacaoDoPrestador.xml(TipoDaPessoa.Emitente)}      
        <ListaRps>
        ${this.listaRps.map(rps => rps.xml())}
        </ListaRps>
    </LoteRps>
`;
  }
}
