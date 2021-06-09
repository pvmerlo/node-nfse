import { Estado } from './Estado';

export class Prefeitura {
  municipio: string;
  estado: Estado;
  urlAlternativa?: string;
}

export const prefeituras: Prefeitura[] = [
  {
    municipio: 'Alfredo Chaves',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Aracruz',
    estado: Estado.EspiritoSanto,
    urlAlternativa: 'http://nfe.pma.es.gov.br:8080/nfse'
  },
  {
    municipio: 'Baixo Guandu',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Bom Jesus do Norte',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Brumadinho',
    estado: Estado.MinasGerais
  },
  {
    municipio: 'Barra de São Francisco',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Boa Esperança',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Cachoeiro de Itapemirim',
    estado: Estado.EspiritoSanto,
    urlAlternativa: 'http://notafse.cachoeiro.es.gov.br:8189'
  },
  {
    municipio: 'Carangola',
    estado: Estado.MinasGerais
  },
  {
    municipio: 'Castelo',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Colatina',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Confins',
    estado: Estado.MinasGerais
  },
  {
    municipio: 'Domingos Martins',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Ecoporanga',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Espera Feliz',
    estado: Estado.MinasGerais
  },
  {
    municipio: 'Eunápolis',
    estado: Estado.Bahia
  },
  {
    municipio: 'Fundão',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Governador Lindenberg',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Guaçuí',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Ibiraçu',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Itaguaçu',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Itamaraju',
    estado: Estado.Bahia
  },
  {
    municipio: 'Itapemirim',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Itarana',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Iúna',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Januária',
    estado: Estado.MinasGerais
  },
  {
    municipio: 'João Neiva',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Linhares',
    estado: Estado.EspiritoSanto,
    urlAlternativa: 'http://notafiscal.linhares.es.gov.br'
  },
  {
    municipio: 'Manhuaçu',
    estado: Estado.MinasGerais
  },
  {
    municipio: 'Mantenópolis',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Marataízes',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Marechal Floriano',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Marilândia',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Mimoso do Sul',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Montanha',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Monte Santo de Minas',
    estado: Estado.MinasGerais
  },
  {
    municipio: 'Muniz Freire',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Nova Friburgo',
    estado: Estado.RioDeJaneiro
  },
  {
    municipio: 'Nova Venécia',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Pancas',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Pedro Canário',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Pinheiros',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Ponto Belo',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Raul Soares',
    estado: Estado.MinasGerais
  },
  {
    municipio: 'Rio Bananal',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Rio Novo do Sul',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'São João da Barra',
    estado: Estado.RioDeJaneiro
  },
  {
    municipio: 'Santa Maria de Jetibá',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Santa Teresa',
    estado: Estado.EspiritoSanto,
    urlAlternativa: 'http://nfse.santateresa.es.gov.br'
  },
  {
    municipio: 'São Gabriel da Palha',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'São Mateus',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'São Roque do Canaã',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Sooretama',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Taiobeiras',
    estado: Estado.MinasGerais
  },
  {
    municipio: 'Teixeira de Freitas',
    estado: Estado.Bahia
  },
  {
    municipio: 'Três Corações',
    estado: Estado.MinasGerais,
    urlAlternativa: 'http://177.70.128.66/el-nfse'
  },
  {
    municipio: 'Vargem Alta',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Venda Nova do Imigrante',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Viana',
    estado: Estado.EspiritoSanto
  },
  {
    municipio: 'Vila Valério',
    estado: Estado.EspiritoSanto
  }
];
