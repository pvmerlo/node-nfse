import * as js2xmlparser from 'js2xmlparser';
import axios from 'axios';
import * as xml2js from 'xml2js';

export class SoapService {
  static envelope(method: string, requestObj: any) {
    const body = js2xmlparser.parse(`urn:${method}`, requestObj).replace(`<?xml version='1.0'?>`, '');
    return `<?xml version="1.0" ?>
        <soapenv:Envelope
            xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
            xmlns:urn="http://des36.el.com.br:8080/el-issonline/">
            <soapenv:Header/>
            <soapenv:Body>
            ${body}
            </soapenv:Body>
        </soapenv:Envelope>`;
  }

  static async doRequest(url: string, action: string, requestObj: any, envelopeName?: string, rawReturn = false) {
    try {
      const response = await axios.request({
        url: url + '/RpsServiceService',
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml; charset=utf-8'
        },
        data: SoapService.envelope(envelopeName || action, requestObj)
      });
      const returnTag = response.data.match(new RegExp('<return>(.*?)</return>'))?.[1];
      if (returnTag) {
        console.log(returnTag);
        return xml2js.parseString(returnTag);
      }
    } catch (e) {
      console.log(e.message);
    }
  }
}
