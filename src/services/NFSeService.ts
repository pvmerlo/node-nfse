import { DateTime } from 'luxon';
import { IAuthToken } from '../interfaces/IAuthToken';
import { SoapService } from './SoapService';
import { DadosDoPrestador } from '../models';
import axios from 'axios';
import '../helpers';
import { Prefeitura, prefeituras } from '../constants/Prefeituras';
import MissingArgumentException from '../exceptions/MissingArgumentException';
import BadRequest from '../exceptions/BadRequest';

function cleanToken(): IAuthToken {
  return {
    token: '',
    lastRequest: DateTime.now().startOf('year')
  };
}

export class NFSeService {
  private readonly auth: IAuthToken;
  private readonly cookie: IAuthToken;
  login: string;
  senha: string;
  prefeitura: Prefeitura;
  prestador: DadosDoPrestador;

  constructor(partial: Partial<NFSeService>) {
    Object.assign(this, partial || {});

    this.auth = cleanToken();
    this.cookie = cleanToken();

    if (!this.login) {
      throw new MissingArgumentException('O login é obrigatório para autenticação no serviço.');
    }

    if (!this.senha) {
      throw new MissingArgumentException('A senha é obrigatória para autenticação no serviço.');
    }

    if (!this.prefeitura) {
      throw new MissingArgumentException('A prefeitura é obrigatória para autenticação no serviço.');
    }

    if (
      !prefeituras
        .map(p => {
          return p.municipio + p.estado;
        })
        .includes(this.prefeitura.municipio + this.prefeitura.estado)
    ) {
      throw new BadRequest('A prefeitura ainda não é atendida por este serviço.');
    }

    this.init().then(() => {
      console.log('.:| NFSeService iniciado |:.');
    });
  }

  async init() {
    await this.setAuthToken();
    await this.setSiteCookie();
  }

  get urlMunicipio() {
    return (
      this.prefeitura.urlAlternativa ||
      'http://' +
        this.prefeitura.estado.toLowerCase() +
        '-' +
        this.prefeitura.municipio.clearAccents().toLowerCase().replace(/-/g, '').replace(/ /g, '') +
        '-pm-nfs.cloud.el.com.br'
    );
  }

  private static tokenExpirado(authToken: IAuthToken) {
    return !authToken.token || authToken.lastRequest.diffNow('minutes').minutes >= 4;
  }

  private async setAuthToken(): Promise<void> {
    console.log({ token: this.auth });

    if (NFSeService.tokenExpirado(this.auth)) {
      this.auth.lastRequest = DateTime.now();
      this.auth.token = await this.autenticarContribuinte();
      console.log({ token: this.auth.token });
    }
  }

  private async setSiteCookie(): Promise<void> {
    if (NFSeService.tokenExpirado(this.cookie)) {
      this.cookie.lastRequest = DateTime.now();
      const loginURL = this.urlMunicipio + '/paginas/sistema/login.jsf?e=expire';
      const login = await axios.get(loginURL);
      this.cookie.token = login.headers['set-cookie'].find((c: any) => c.indexOf('JSESSIONID') !== -1);
    }
  }

  private async autenticarContribuinte(): Promise<any> {
    return await SoapService.doRequest(this.urlMunicipio, 'autenticarContribuinte', {
      identificacaoPrestador: this.login,
      senha: this.senha
    });
  }

  get servicosDoPrestador() {
    return SoapService.doRequest(this.urlMunicipio, 'ListarServicosMunicipaisPrestador', {
      identificacaoPrestador: this.prestador.identificacao.documento
    });
  }

  get ultimoLote() {
    return SoapService.doRequest(
      this.urlMunicipio,
      'consultarUltimoLote',
      {
        identificacaoPrestador: this.prestador.identificacao.documento
      },
      'ConsultarUltimoLote'
    );
  }

  get consultarUltimoRPS() {
    return SoapService.doRequest(
      this.urlMunicipio,
      'consultarUltimaRps',
      {
        identificacaoPrestador: this.prestador.identificacao.documento
      },
      'ConsultarUltimaRps'
    );
  }

  consultarLotePorProtocolo(numeroProtocolo: number) {
    return SoapService.doRequest(
      this.urlMunicipio,
      'consultarLoteRpsEnvio',
      {
        identificacaoPrestador: this.prestador.identificacao.documento,
        numeroProtocolo
      },
      'ConsultarLoteRpsEnvio'
    );
  }

  obterArquivoPorChave(
    cnpj: string,
    chave: string,
    tipo = '',
    arquivoDestino?: string,
    uf?: string,
    municipio?: string
  ) {
    // let url = `${this.urlMunicipio}/paginas/sistema/autenticacaoNota${tipo === 'PDF' ? '' : 'XML'}.jsf?`;
    // url += 'cpfCnpj=' + cnpj;
    // url += '&chave=' + chave.toLowerCase();
    // const accept = ['application/pdf', 'text/xml'];
    //
    // const arquivo = HTTP.request({
    //   url,
    //   connectionTimeout: 20000,
    //   readTimeout: 20000,
    //   headers: {
    //     'User-Agent':
    //       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36',
    //     'Accept': accept.join(','),
    //     'Accept-Language': 'en-US,en;q=0.5',
    //     'Accept-Encoding': 'gzip, deflate',
    //     'Connection': 'keep-alive',
    //     'Upgrade-Insecure-Requests': '1',
    //     'Cookie': 'JSESSIONID=' + this.cookiePrefeitura(uf, municipio)
    //   }
    // });
    //
    // if (accept.indexOf(arquivo.contentType) !== -1) {
    //   if (arquivoDestino) {
    //     return new IO(app.config['diretorios.download'] + '/' + chave + '.pdf', arquivo.bodyStream);
    //   } else if (arquivo.contentType === 'text/xml') {
    //     return arquivo.body;
    //   }
    // } else {
    //   throw new Error('Nota Fiscal não encontrada na base de dados da prefeitura.');
    // }
  }
}
