export class Pedido {
    #idPedido;
    #valorTotal;
    #statusPedido;

    constructor(pValorTotal, pStatusPedido, pIdPedido) {
        this.valorTotal = pValorTotal;
        this.statusPedido = pStatusPedido;
        this.idPedido = pIdPedido;
    }

    get idPedido() {
        return this.#idPedido;
    }
    set idPedido(value) {
        this.#validarIdPedido(value);
        this.#idPedido = value;
    }
    get valorTotal() {
        return this.#valorTotal;
    }
    set valorTotal(value) {
        this.#validarValorTotal(value);
        this.#valorTotal = value;
    }
    get statusPedido() {
        return this.#statusPedido;
    }
    set statusPedido(value) {
        this.#statusPedido = value;
    }

    #validarIdPedido(value) {
        if (value && value <= 0) throw new Error("Verifique o IdPedido informado");
    }
    #validarValorTotal(value) {
        if (!value || value <= 0) throw new Error("Não foi possível obter o total");
    }

    static criar(dados) {
        return new Pedido(dados.valorTotal, dados.statusPedido, null);
    }
    static editar(dados) {
        return new Pedido(dados.valorTotal, dados.statusPedido, dados.idPedido);
    }
}