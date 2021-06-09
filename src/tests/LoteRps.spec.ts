import { expect } from 'chai';
import { LoteRps } from '../models/LoteRps';
import { Rps } from '../models/Rps';
import { DadosDoTomador } from '../models/DadosDoTomador';
import { DadosDoPrestador } from '../models/DadosDoPrestador';
import { Servico } from '../models/Servico';
import { Contato } from '../models/Contato';
import { Endereco } from '../models/Endereco';
import { IdentificacaoDaPessoa } from '../models/IdentificacaoDaPessoa';
import { LocalDePrestacaoDoServico, StatusDoRps, TipoDeISSRetido, TipoDeLogradouro, TipoDoRps } from '../constants';
import { IdentificacaoDoRps } from '../models/IdentificacaoDoRps';
import { Valores } from '../models/Valores';
import { SoapService } from '../services/SoapService';

describe('Test the composition of the class LoteRps', () => {
  let servicos = [
    new Servico({
      aliquota: 1,
      valorDoServico: 100,
      valorDoISSQN: 0,
      numeroDoAlvara: '0000000',
      valorDoDesconto: 0,
      unidadeDeMedida: 'UN',
      quantidade: 1,
      codigoServicoMunicipal: '1',
      codigoServicoLC116: '1',
      cnae: '1',
      descricao: 'Serviço de Teste'
    })
  ];

  let dadosDoPrestador = new DadosDoPrestador({
    nomeFantasia: 'Prestador Teste',
    razaoSocial: 'Prestador Teste LTDA',
    identificacao: new IdentificacaoDaPessoa({
      inscricaoMunicipal: '0000000',
      documento: '00000000000000'
    }),
    contato: new Contato({
      email: 'prestador@teste.com',
      telefone: '(00) 0000-0000'
    }),
    endereco: new Endereco({
      tipoDeLogradouro: TipoDeLogradouro.Rua,
      logradouro: 'Rua dos bobos',
      numero: '0',
      complemento: 'Casa Engraçada',
      bairro: 'Prestador',
      municipio: 'Cidade',
      uf: 'UF',
      codigoDoMunicipio: '000'
    }),
    incentivadorCultural: false,
    naturezaDaOperacao: 1,
    optanteDoSimplesNacional: false,
    regimeEspecialDeTributacao: 0
  });

  let dadosDoTomador = new DadosDoTomador({
    nomeFantasia: 'Tomador Teste',
    razaoSocial: 'Tomador Teste LTDA',
    identificacao: new IdentificacaoDaPessoa({
      inscricaoMunicipal: '1111111',
      documento: '11111111111111'
    }),
    contato: new Contato({
      email: 'tomador@teste.com',
      telefone: '(00) 0000-0000'
    }),
    endereco: new Endereco({
      tipoDeLogradouro: TipoDeLogradouro.Rua,
      logradouro: 'Rua dos bobos',
      numero: '0',
      complemento: 'Casa Engraçada',
      bairro: 'Tomador',
      municipio: 'Cidade',
      uf: 'UF',
      codigoDoMunicipio: '000'
    })
  });

  let rps = new Rps({
    dadosDoTomador,
    dadosDoPrestador,
    servicos,
    identificacao: new IdentificacaoDoRps({
      tipo: TipoDoRps.Rps,
      numero: 123,
      serie: 'PADRAO'
    }),
    dataDeEmissao: new Date(),
    issRetido: TipoDeISSRetido.Normal,
    observacao: 'Teste',
    status: StatusDoRps.Normal,
    valores: new Valores(),
    localDePrestacaoDoServico: LocalDePrestacaoDoServico.NoMunicipio
  });

  let loteRps = new LoteRps({
    listaRps: [rps],
    numero: 123,
    identificacaoDoPrestador: dadosDoPrestador.identificacao
  });

  it('Should generate a 32 bit hash', () => {
    expect(Buffer.from(loteRps.id).length).to.equals(32);
  });
});
