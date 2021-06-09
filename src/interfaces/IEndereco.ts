import { TipoDeLogradouro } from '../constants';

export interface IEndereco {
  tipoDeLogradouro: TipoDeLogradouro;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  codigoDoMunicipio: string;
  municipio: string;
  uf: string;
  cep: string;
}
