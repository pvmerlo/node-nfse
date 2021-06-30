import { NFSeService } from '../services/NFSeService';
import { expect } from 'chai';
import MissingArgumentException from '../exceptions/MissingArgumentException';
import { Estado } from '../constants/Estado';
import BadRequest from '../exceptions/BadRequest';

describe('Testes relacionados ao NFSeService', () => {
  it('Deve lançar uma exceção do tipo MissingArgumentException caso os parâmetros básicos não sejam fornecidos.', () => {
    const nfseService = () => new NFSeService({});
    expect(nfseService).to.throw(MissingArgumentException);
  });

  it('Deve lançar uma Exceção do tipo BadRequest caso a prefeitura fornecida não seja atendida.', () => {
    const nfseService = () =>
      new NFSeService({
        login: '00000000000000',
        senha: '1234',
        prefeitura: {
          municipio: 'Teste',
          estado: Estado.EspiritoSanto
        }
      });
    expect(nfseService).to.throw(BadRequest);
  });

  it('Deve realizar uma chamada ao método de autenticação e setar o token retornado por ele no serviço.', () => {
    const nfseService = () =>
      new NFSeService({
        login: '00000000000000',
        senha: '1234',
        prefeitura: {
          municipio: 'Colatina',
          estado: Estado.EspiritoSanto
        }
      });

    expect(nfseService().init).to.throw(BadRequest);
  });
});
