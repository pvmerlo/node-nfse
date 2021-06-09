import { IContato } from '../interfaces';

export class Contato implements IContato {
  email: string;
  telefone: string;

  constructor(partial?: Partial<Contato>) {
    Object.assign(this, partial || {});
  }

  xml() {
    return `
    <Contato>
        <Telefone>${this.telefone}</Telefone>
        <Email>${this.email}</Email>
    </Contato>
`;
  }
}
