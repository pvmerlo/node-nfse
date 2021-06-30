import {Util} from "../@xp";
import {moment} from "../@extra";
import IBGEService from "../@v3/IBGE/IBGEService";
import {EmpresaService} from "../@v3/Empresa/EmpresaService";

const UUID = Java.type("java.util.UUID");

function getHash() {
    return UUID.randomUUID().toString().replaceAll("-", "");
}

function indicacaoDocumento(documento: string) {
    if (documento.length === 11) {
        return 1;
    } else if (documento.length === 14) {
        return 2;
    } else {
        return 0;
    }
}

function xmlIdentificacao(ator: any, tipoDoAtor: string) {
    let xml = "";
    xml += `    <Identificacao${tipoDoAtor}>`;
    xml += `        <CpfCnpj>${Util.onlyNumbers(ator.CNPJ)}</CpfCnpj>`;
    xml += `        <IndicacaoCpfCnpj>${indicacaoDocumento(Util.onlyNumbers(ator.CNPJ))}</IndicacaoCpfCnpj>`;
    if (ator.InscricaoMunicipal) {
        xml += `    <InscricaoMunicipal>${ator.InscricaoMunicipal}</InscricaoMunicipal>`;
    }
    xml += `    </Identificacao${tipoDoAtor}>`
    return xml;
}

export function xmlAtor(ator: any, tipoDoAtor: string) {
    let xml = "";
    xml += `<Dados${tipoDoAtor}>`;
    xml += xmlIdentificacao(ator, tipoDoAtor)
    xml += `    <RazaoSocial>${ator.RazaoSocial.replace(/&/g, "e")}</RazaoSocial>`;
    xml += `    <NomeFantasia>${ator.NomeFantasia.replace(/&/g, "e")}</NomeFantasia>`;
    if (tipoDoAtor === "Prestador") {
        xml += `                <IncentivadorCultural>2</IncentivadorCultural>`;
        xml += `                <OptanteSimplesNacional>1</OptanteSimplesNacional>`;
        xml += `                <NaturezaOperacao>1</NaturezaOperacao>`;
        xml += `                <RegimeEspecialTributacao>0</RegimeEspecialTributacao>`;
    }
    const endereco = ator.Endereco;
    xml += `<Endereco>`;
    if (endereco.TipoLogradouro) xml += `<LogradouroTipo>${endereco.TipoLogradouro}</LogradouroTipo>`;
    if (endereco.Logradouro) xml += `    <Logradouro>${endereco.Logradouro}</Logradouro>`;
    if (endereco.Numero) xml += `        <LogradouroNumero>${endereco.Numero}</LogradouroNumero>`;
    if (endereco.Complemento) xml += `   <LogradouroComplemento>${endereco.Complemento}</LogradouroComplemento>`;
    if (endereco.Bairro) xml += `        <Bairro>${endereco.Bairro}</Bairro>`;
    if (endereco.CodigoDoMunicipio) {
        xml += `<CodigoMunicipio>${endereco.CodigoDoMunicipio}</CodigoMunicipio>`;
    } else if (endereco.Municipio) {
        const municipio = IBGEService.buscarMunicipio(endereco.Municipio, endereco.UF);
        if (municipio) {
            xml += `<CodigoMunicipio>${municipio.id}</CodigoMunicipio>`;
        } else {
            xml += `<CodigoMunicipio>3201506</CodigoMunicipio>`;
        }
    }
    xml += `<Municipio>${endereco.Municipio}</Municipio>`;
    xml += `<Uf>${endereco.UF}</Uf>`;
    if (endereco.CEP) xml += `           <Cep>${Util.onlyNumbers(endereco.CEP)}</Cep>`;
    xml += `</Endereco>`;

    xml += `<Contato>`;
    xml += `    <Telefone>${Util.onlyNumbers(ator.Telefones[0].Numero)}</Telefone>`;
    xml += `    <Email>${ator.Autenticacao.Email}</Email>`;
    xml += `</Contato>`;
    xml += `</Dados${tipoDoAtor}>`;

    return xml;
}

export function xmlServico(servico: any) {
    let xml = "";
    xml += `<Servico>`;
    if (servico.CodigoCnae) {
        xml += `<CodigoCnae>${servico.CodigoCnae}</CodigoCnae>`;
    }
    xml += `<CodigoServico116>${servico.CodigoServico116}</CodigoServico116>`;
    xml += `<CodigoServicoMunicipal>${servico.CodigoServicoMunicipal}</CodigoServicoMunicipal>`;
    xml += `<Quantidade>${servico.Quantidade.toFixed(4)}</Quantidade>`;
    xml += `<Unidade>${servico.Unidade || "UN"}</Unidade>`;
    xml += `<Descricao>${servico.Descricao}</Descricao>`;
    xml += `<Aliquota>${servico.Aliquota ? servico.Aliquota.toFixed(4) : '0.0000'}</Aliquota>`;
    xml += `<ValorServico>${servico.Valor.toFixed(4)}</ValorServico>`;
    xml += `<ValorIssqn>${(servico.LocalDePrestacaoDoServico === 1 || servico.LocalDePrestacaoDoServico === '1' ? (servico.Valor * (servico.Aliquota / 100)) : 0).toFixed(2)}</ValorIssqn>`;
    xml += `<ValorDesconto>${servico.ValorDesconto ? servico.ValorDesconto.toFixed(2) : 0}</ValorDesconto>`;
    if (servico.NumeroAlvara) {
        xml += `<NumeroAlvara>${servico.NumeroAlvara}</NumeroAlvara>`;
    }
    xml += `</Servico>`;
    return xml;
}

export function xmlRPS(numero: number, prestador: any, tomador: any, servicos: any, observacao?: string) {
    let xml = "";
    xml += `        <Rps>`;
    xml += `            <Id>${getHash()}</Id>`;
    xml += `            <LocalPrestacao>${servicos[0].LocalDePrestacaoDoServico ? servicos[0].LocalDePrestacaoDoServico : '2'}</LocalPrestacao>`;
    xml += `            <IssRetido>1</IssRetido>`;
    xml += `            <DataEmissao>${moment().subtract(3, "hours").format("YYYY-MM-DD[T]HH:mm:ss")}</DataEmissao>`;
    xml += `            <IdentificacaoRps>`;
    xml += `                <Numero>${numero.toFixed(0)}</Numero>`;
    // xml += `                <Serie>1</Serie>`;
    xml += `                <Tipo>1</Tipo>`;
    xml += `            </IdentificacaoRps>`;
    xml += `            ${xmlAtor(prestador, "Prestador")}`
    xml += `            ${xmlAtor(tomador, "Tomador")}`
    xml += `            <Servicos>`;
    servicos.forEach((servico: any) => {
        xml += xmlServico(servico);
    });
    xml += `            </Servicos>`;
    // TODO: Outros campos de valores, impostos etc não necessários no momento
    xml += `            <Valores>`;
    xml += `                <ValorServicos>${somarValores(servicos.map((s: any) => s.Valor))}</ValorServicos>`;
    xml += `                <ValorIss>${somarValores(servicos.map((s: any) => (s.Valor * (s.Aliquota / 100))))}</ValorIss>`;
    xml += `            </Valores>`;
    if (observacao || servicos[0].Observacao) {
        xml += `            <Observacao>${observacao || servicos[0].Observacao}</Observacao>`
    }
    xml += `            <Status>1</Status>`;
    xml += `        </Rps>`;

    return xml;
}

function somarValores(fn: any) {
    return parseFloat(fn.reduce((a: any, b: any) => a + b)).toFixed(2)
}

export class NFSe {
    static toXML(numeroDoLote: number, rpsInicial: number, prestador: any, tomadores: any[], servicos: any) {
        const empresaService = new EmpresaService();

        let xml = "<LoteRps " +
            "xmlns=\"http://www.el.com.br/nfse/xsd/el-nfse.xsd\" " +
            "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
            "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" " +
            "xsi:schemaLocation=\"http://www.el.com.br/nfse/xsd/el-nfse.xsd el-nfse.xsd \">";

        xml += `    <Id>${getHash()}</Id>`
        xml += `    <NumeroLote>${numeroDoLote}</NumeroLote>`
        xml += `    <QuantidadeRps>_qtd_rps_</QuantidadeRps>`
        xml += xmlIdentificacao(prestador, "Prestador");
        xml += `    <ListaRps>`;
        let quantidadeRps = 0;
        tomadores.forEach((tomador: any, index: number) => {
            if (typeof tomador === "string") {
                tomador = empresaService.findByCNPJ(tomador);
            }
            if (tomador) {
                const servicosDoTomador = Array.isArray(servicos) ? servicos : servicos[tomador.CNPJ];
                if (servicosDoTomador && servicosDoTomador.length) {
                    xml += xmlRPS((rpsInicial + index), prestador, tomador, servicosDoTomador);
                    quantidadeRps++;
                }
            }
        })
        xml += `    </ListaRps>`;
        xml += "</LoteRps>";
        if (quantidadeRps > 0) {
            return xml.replace("_qtd_rps_", quantidadeRps.toFixed());
        }
        return;
    }
}
