import { ItemVenda } from "./itemVenda";

export class Venda {
    id: number;
    totalValue: number;
    usuarioId: number;
    creationDate: string;
    items: ItemVenda[]
}