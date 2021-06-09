import { IEndereco } from '../interfaces';
import { TipoDeLogradouro } from '../constants';

export class Endereco implements IEndereco {
  bairro: string;
  cep: string;
  codigoDoMunicipio: string;
  complemento: string;
  logradouro: string;
  municipio: string;
  numero: string;
  tipoDeLogradouro: TipoDeLogradouro;
  uf: string;

  constructor(partial?: Partial<Endereco>) {
    Object.assign(this, partial || {});
  }

  get xml() {
    return `
    <Endereco>
        ${this.tipoDeLogradouro ? `<LogradouroTipo>${this.tipoDeLogradouro}</LogradouroTipo>` : ``}
        ${this.logradouro ? `<Logradouro>${this.logradouro}</Logradouro>` : ``}
        ${this.numero ? `<LogradouroNumero>${this.numero}</LogradouroNumero>` : ``}
        ${this.complemento ? `<LogradouroComplemento>${this.complemento}</LogradouroComplemento>` : ``}
        ${this.bairro ? `<Bairro>${this.bairro}</Bairro>` : ``}
        ${this.codigoDoMunicipio ? `<CodigoMunicipio>${this.codigoDoMunicipio}</CodigoMunicipio>` : ``}
        ${this.municipio ? `<Municipio>${this.municipio}</Municipio>` : ``}
        ${this.uf ? `<Uf>${this.uf}</Uf>` : ``}
        ${this.cep ? `<Cep>${this.cep}</Cep>` : ``}
    </Endereco>      
`;
  }
}
