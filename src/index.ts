// import { SoapService } from './services/SoapService';
import './helpers';
// SoapService.doRequest(
//   'http://es-colatina-pm-nfs.cloud.el.com.br',
//   'consultarUltimoLote',
//   {
//     identificacaoPrestador: '41866833000117'
//   },
//   'ConsultarUltimoLote'
// )
//   .then(data => {
//     console.log(data);
//   })
//   .catch(err => {
//     console.log(err);
//   });

import { NFSeService } from './services/NFSeService';
import { prefeituras } from './constants/Prefeituras';

prefeituras.forEach(prefeitura => {
  const service = new NFSeService({
    login: '41866833000117',
    senha: 'colatina123',
    prefeitura
  });
});
