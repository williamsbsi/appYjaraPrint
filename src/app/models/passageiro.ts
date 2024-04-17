import { Comodo } from './comodo';
import { Convenio } from './convenio';
export class Passageiro {
    id: number;
    cpf: string;
    nome: string;
    email: string;
    nascimento: string;
    idade: number;
    telefone: string;
    pontos: number;
    voucher: string;
    tdoc: string;
    ndoc: string;
    estrangeiro: boolean;
    convenio: Convenio;
    public comodo: Comodo;

    public setComodo(comodo: Comodo){
        this.comodo = comodo;
    }
}
