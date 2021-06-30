import {jsonToXML, xmlToJson} from "../@v3/ArquivoFiscal/_aux/XMLHelper";
import {EmpresaService} from "../@v3/Empresa/EmpresaService";
import {HTTP, IO, Util} from "../@xp";
import {moment} from "../@extra";
import {NFSe} from "./Emissao";
import IBGEService from "../@v3/IBGE/IBGEService";

function soapEnvelope(metodo: string, requestObj: any) {
    return `<?xml version="1.0" ?>
        <soapenv:Envelope
            xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
            xmlns:urn="http://des36.el.com.br:8080/el-issonline/">
            <soapenv:Header/>
            <soapenv:Body>
            <urn:${metodo}>${jsonToXML(requestObj)}</urn:${metodo}>
            </soapenv:Body>
        </soapenv:Envelope>`;
}

function precisaDeAtualizacao(obj: any) {
    return !obj.token || moment().diff(obj.lastRequest, 'minutes') >= 4;
}

function cleanToken() {
    return {
        token: "",
        lastRequest: moment().startOf("year")
    }
}

const empresaService = new EmpresaService();

class NFSeELService {
    public static Login: string = app.config['NFSe.EL.CNPJ'];
    public static Senha: string = app.config['NFSe.EL.Senha'];
    public static UF: string = app.config['NFSe.EL.UF'];
    public static Municipio: string = app.config['NFSe.EL.Municipio'];
    private static readonly auth: any = cleanToken();
    private static readonly cookie = cleanToken();
    private static readonly Prestador: any = empresaService.findByCNPJ(app.config['NFSe.EL.CNPJ']);
    authToken = NFSeELService.authToken;
    cookiePrefeitura = NFSeELService.cookiePrefeitura;
    emissaoDeServicoEmLote = NFSeELService.emissaoDeServicoEmLote;
    soapRequest = NFSeELService.soapRequest;
    /**
     * Retorna o token de autorização do usuário
     * @param login
     * @param senha
     * @returns {*}
     */
    autenticarContribuinte = NFSeELService.autenticarContribuinte;
    listarServicosMunicipaisPrestador = NFSeELService.listarServicosMunicipaisPrestador;
    consultarUltimoLote = NFSeELService.consultarUltimoLote;
    consultarUltimoRPS = NFSeELService.consultarUltimoRPS;
    consultarLotePorProtocolo = NFSeELService.consultarLotePorProtocolo;
    consultarNFSePorTomador = NFSeELService.consultarNFSePorTomador;
    consultarNFSePorNumero = NFSeELService.consultarNFSePorNumero;
    consultarNFSePorRPS = NFSeELService.consultarNFSePorRPS;
    validarXML = NFSeELService.validarXML;
    cancelarNota = NFSeELService.cancelarNota;
    transmitirEmLote = NFSeELService.transmitirEmLote;
    obterChaveDoArquivo = NFSeELService.obterChaveDoArquivo;
    obterArquivoPorChave = NFSeELService.obterArquivoPorChave;
    obterArquivoPorEntidade = NFSeELService.obterArquivoPorEntidade;
    obterPDFPorChave = NFSeELService.obterPDFPorChave;
    obterXMLPorChave = NFSeELService.obterXMLPorChave;
    obterArquivoPorNumero = NFSeELService.obterArquivoPorNumero;
    obterPDFPorNumero = NFSeELService.obterPDFPorNumero;
    obterXMLPorNumero = NFSeELService.obterXMLPorNumero;
    getUrlPrefeitura = NFSeELService.getUrlPrefeitura;

    private readonly auth: { lastRequest: any; token: string };
    private readonly cookie: { lastRequest: any; token: string };
    public UF: string;
    public Municipio: string;
    public Login: string;
    public Senha: string;
    public Prestador: any;

    constructor(empresa: any) {
        if (typeof empresa === "string") {
            this.Prestador = empresaService.findByCNPJ(empresa);
        } else if (empresa) {
            this.Prestador = empresa;
        } else {
            this.Prestador = empresaService.findByCNPJ(app.config['NFSe.EL.CNPJ']);
            empresa = this.Prestador;
        }

        this.auth = cleanToken();
        this.cookie = cleanToken();

        if (empresa.EmissaoDeNFSeEL) {
            if (empresa.EmissaoDeNFSeEL.Prefeitura) {
                this.UF = empresa.EmissaoDeNFSeEL.Prefeitura.split("__")[0]; // TODO: campo de estado para NFSe
                this.Municipio = empresa.EmissaoDeNFSeEL.Prefeitura.split("__")[1];
            }
            if (!empresa.EmissaoDeNFSeEL.Login) {
                this.Login = empresa.EmissaoDeNFSeEL.Login;
            } else {
                this.Login = empresa.CNPJ;
            }
            if (empresa.EmissaoDeNFSeEL.Senha) {
                this.Senha = empresa.EmissaoDeNFSeEL.Senha;
                this.authToken();
            }
        }

        return this;
    }

    static importarArquivosViaSelenide(params: {
        Login: string;
        Senha: string;
        UF: string;
        Municipio: string;
        DataInicial?: string;
        DataFinal?: string;
        Movimento?: string;
    }) {
        try {
            log.info(JSON.stringify(params, null, 4))
            const nfseRequest = HTTP.request({
                url: app.config["sefaz.url.servico"] + "/nfse",
                method: "POST",
                contentType: "application/json",
                body: params,
                connectionTimeout: parseInt(app.config["NFSe.EL.connectionTimeout"], 10),
                readTimeout: parseInt(app.config["NFSe.EL.readTimeout"], 10),
            });

            if (nfseRequest.status === 200) {
                return nfseRequest.body;
            } else {
                log.error(JSON.stringify(nfseRequest.body, null, 4))
            }
        } catch (e) {
            log.error(JSON.stringify(e.message, null, 4))
        }
    }

    static authToken() {
        if (precisaDeAtualizacao(this.auth)) {
            this.auth.lastRequest = moment();
            this.auth.token = this.autenticarContribuinte();
        }
        return this.auth.token;
    }

    static cookiePrefeitura(uf: any, municipio: any) {
        if (precisaDeAtualizacao(this.cookie)) {
            this.cookie.lastRequest = moment();
            const loginURL = this.getUrlPrefeitura(uf, municipio) + "/paginas/sistema/login.jsf?e=expire";
            const login = HTTP.get(loginURL);
            this.cookie.token = login.cookies.filter((c: any) => c.name === "JSESSIONID")[0].value;
        }
        return this.cookie.token;
    }

    static emissaoDeServicoEmLote(tomadores: any, servicos: any, rpsInicial?: any) {

        const ultimoRPS = rpsInicial || this.consultarUltimoRPS();
        const ultimoLote = this.consultarUltimoLote();

        let numeroRps = 1;
        if (ultimoRPS >= numeroRps) {
            numeroRps = ultimoRPS + 1;
        }

        let lote = 1;
        if (ultimoLote >= lote) {
            lote = ultimoLote + 1;
        }

        return NFSe.toXML(lote, numeroRps, this.Prestador, tomadores, servicos);
    }

    static soapRequest(metodo: string, requestObj: any, envelopeName?: string, rawReturn = false) {
        const xml = soapEnvelope((envelopeName || metodo), requestObj);
        const retorno = xmlToJson(
            HTTP.request({
                url: this.getUrlPrefeitura(this.UF, this.Municipio) + ":80/RpsServiceService",
                headers: {
                    'Content-Type': 'text/xml; charset=utf-8',
                },
                connectionTimeout: 60000,
                readTimeout: 60000,
                method: 'POST',
                body: xml
            }).body
        );

        if (rawReturn) {
            return retorno;
        }

        return Util.get(retorno, "$.['S:Envelope']['S:Body']['ns2:" + (envelopeName || metodo) + "Response'].return")[0];
    }

    static autenticarContribuinte() {
        return this.soapRequest("autenticarContribuinte", {
            identificacaoPrestador: this.Login,
            senha: this.Senha
        });
    }

    static listarServicosMunicipaisPrestador(cnpj: string) {
        return this.soapRequest("ListarServicosMunicipaisPrestador", {
            identificacaoPrestador: this.Prestador.CNPJ
        });
    }

    static consultarUltimoLote() {
        return this.soapRequest("consultarUltimoLote", {
            identificacaoPrestador: this.Login
        }, "ConsultarUltimoLote");
    }

    static consultarUltimoRPS() {
        return this.soapRequest("consultarUltimaRps", {
            identificacaoPrestador: this.Login
        }, "ConsultarUltimaRps");
    }

    static consultarLotePorProtocolo(numeroProtocolo: number) {
        return this.soapRequest("consultarLoteRpsEnvio", {
            identificacaoPrestador: this.Login, numeroProtocolo
        }, "ConsultarLoteRpsEnvio");
    }

    static consultarNFSePorTomador(identificacaoTomador: string) {
        return this.soapRequest("ConsultarNfseEnvio", {
            identificacaoPrestador: this.Login,
            identificacaoTomador,
            dataInicial: "2000-01-01T00:00:00",
            dataFinal: moment().format("YYYY-MM-DD[T]HH:mm:ss"),
        }, 'ConsultarNfseEnvio');
    }

    static consultarNFSePorNumero(numeroNfse: number) {
        return this.soapRequest("ConsultarNfseEnvio", {
            identificacaoPrestador: this.Login, numeroNfse,
            dataInicial: "2000-01-01T00:00:00",
            dataFinal: moment().format("YYYY-MM-DD[T]HH:mm:ss"),
            // numeroProtocolo: numeroProtocolo
        }, 'ConsultarNfseEnvio');
    }

    static consultarNFSePorRPS(identificacaoRps: number) {
        const consulta = this.soapRequest("ConsultarNfseRpsEnvio", {
            identificacaoPrestador: this.Login, identificacaoRps
        }, 'ConsultarNfseRpsEnvio');

        if (consulta && consulta.nfeRpsNotaFiscal) {
            return consulta.nfeRpsNotaFiscal;
        }
    }

    static validarXML(arquivo: any) {
        return {
            arquivo,
            ...this.soapRequest("ValidarLoteRps", {
                identificacaoPrestador: this.Login, arquivo
            }, 'ValidarLoteRps', true)
        };
    }

    static cancelarNota(numeroNfse: number, motivoCancelamento: string) {
        return this.soapRequest("CancelarNfseMotivoEnvio", {
            identificacaoPrestador: this.Login, senha: this.Senha, numeroNfse, motivoCancelamento
        }, 'CancelarNfseMotivoEnvio');
    }

    static transmitirEmLote(tomadores: any[], servicos: any[], rpsInicial?: number) {
        if (!rpsInicial) {
            rpsInicial = this.consultarUltimoRPS();
        }
        log.info("RPS: " + this.consultarUltimoRPS());
        return tomadores.map((tomador, index) => {
            const xml = this.emissaoDeServicoEmLote(
                [tomador],
                servicos,
                (rpsInicial ? rpsInicial : 0) + index
            );
            if (xml) {
                const transmissao = this.soapRequest("enviarLoteRpsEnvio", {
                    identificacaoPrestador: this.Prestador.CNPJ,
                    hashIdentificador: this.authToken(),
                    arquivo: xml
                }, "EnviarLoteRpsEnvio");
                transmissao.Tomador = tomador.CNPJ;
                return transmissao;
            } else {
                log.warning(JSON.stringify({
                    tomador, servicos
                }, null, 4))
            }
        });
    }

    static obterChaveDoArquivo(numero: number) {
        const nfse = this.consultarNFSePorNumero(numero);
        if (nfse && nfse.notasFiscais && nfse.notasFiscais.idNota) {
            return nfse.notasFiscais.idNota;
        }
    }

    static obterArquivoPorChave(cnpj: string, chave: string, tipo = '', arquivoDestino?: string, uf?: string, municipio?: string) {
        let url = `${this.getUrlPrefeitura(uf, municipio)}/paginas/sistema/autenticacaoNota${(tipo === "PDF" ? "" : "XML")}.jsf?`;
        url += 'cpfCnpj=' + cnpj;
        url += '&chave=' + chave.toLowerCase();
        const accept = ['application/pdf', 'text/xml'];

        const arquivo = HTTP.request({
            url,
            connectionTimeout: 20000,
            readTimeout: 20000,
            headers: {
                'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36",
                'Accept': accept.join(","),
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Cookie': 'JSESSIONID=' + this.cookiePrefeitura(uf, municipio)
            }
        });

        if (accept.indexOf(arquivo.contentType) !== -1) {
            if (arquivoDestino) {
                return new IO(app.config["diretorios.download"] + "/" + chave + ".pdf", arquivo.bodyStream)
            } else if (arquivo.contentType === "text/xml") {
                return arquivo.body;
            }
        } else {
            throw new Error("Nota Fiscal não encontrada na base de dados da prefeitura.");
        }
    }

    static obterArquivoPorEntidade(arquivoFiscal: any, tipo = '') {
        let uf = app.config['NFSe.EL.UF'];
        let municipio = app.config['NFSe.EL.Municipio'];

        if (arquivoFiscal.UF) {
            const buscarUF = IBGEService.buscarUF(arquivoFiscal.UF);
            if (buscarUF) {
                uf = buscarUF.sigla
            }
        }

        if (arquivoFiscal.Municipio === 3201506) {
            municipio = "colatina";
        } else if (arquivoFiscal.Municipio) {
            const buscarMunicipio = IBGEService.buscarMunicipio(arquivoFiscal.Municipio, uf);
            if (buscarMunicipio) {
                municipio = buscarMunicipio.nome
            }
        }

        return this.obterArquivoPorChave(
            arquivoFiscal.Emitente.Documento,
            arquivoFiscal.Chave,
            tipo,
            arquivoFiscal["Arquivo" + tipo],
            uf,
            municipio
        )
    }

    static obterPDFPorChave(cnpj: string, chave: string, arquivoDestino?: string) {
        return this.obterArquivoPorChave(cnpj, chave, 'PDF', arquivoDestino);
    }

    static obterXMLPorChave(cnpj: string, chave: string, arquivoDestino?: string) {
        return this.obterArquivoPorChave(cnpj, chave, 'XML', arquivoDestino);
    }

    static obterArquivoPorNumero(cnpj: string, numero: number, tipo?: string, arquivoDestino?: string) {
        const chave = this.obterChaveDoArquivo(numero);
        if (chave) {
            return this.obterArquivoPorChave(cnpj, chave, tipo, arquivoDestino);
        }
    }

    static obterPDFPorNumero(cnpj: string, numero: number, arquivoDestino?: string) {
        return this.obterArquivoPorNumero(cnpj, numero, 'PDF', arquivoDestino);
    }

    static obterXMLPorNumero(cnpj: string, numero: number, arquivoDestino?: string) {
        return this.obterArquivoPorNumero(cnpj, numero, 'XML', arquivoDestino);
    }

    static getUrlPrefeitura(uf?: string, municipio?: string) {
        return "http://" +
            Util.sanitize((uf || this.UF)) +
            "-" +
            Util.sanitize((municipio || this.Municipio)).replaceAll("-", "") +
            "-pm-nfs.cloud.el.com.br"
    };

}

export default NFSeELService;
