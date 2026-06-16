export class ItenPedido {
    #idItemPedido;
    #idPedido;
    #idProduto;
    #quantidade;
    #precoUnitario;

    constructor(pIdPedido, pIdProduto, pQuantidade, pPrecoUnitario, pIdItemPedido) {
        this.idPedido = pIdPedido;
        this.idProduto = pIdProduto;
        this.quantidade = pQuantidade;
        this.precoUnitario = pPrecoUnitario;
        this.idItemPedido = pIdItemPedido;
    }

    get idItemPedido() { return this.#idItemPedido; }
    set idItemPedido(value) {
        this.#validarIdItemPedido(value);
        this.#idItemPedido = value;
    }

    get idPedido() { 
        return this.#idPedido; 
    }
    set idPedido(value) {
        this.#validarPedidoId(value);
        this.#idPedido = value;
    }

    get idProduto() { 
        return this.#idProduto; 
    }
    set idProduto(value) {
        this.#validarProdutoId(value);
        this.#idProduto = value;
    }

    get quantidade() { 
        return this.#quantidade; 
    }
    set quantidade(value) {
        this.#validarQuantidade(value);
        this.#quantidade = value;
    }

    get precoUnitario() { 
        return this.#precoUnitario; 
    }
    set precoUnitario(value) {
        this.#validarPrecoUnitario(value);
        this.#precoUnitario = value;
    }

    #validarIdItemPedido(value) {
        if (value && value <= 0) throw new Error("Verifique o Id do Item do Pedido que foi informado");
    }
    #validarPedidoId(value) {
        if (value && value <= 0) throw new Error("Verifique o Id do Pedido informado");
    }
    #validarProdutoId(value) {
        if (value && value <= 0) throw new Error("Verifique o Id do Produto informado");
    }
    #validarQuantidade(value) {
        if (!value || value <= 0) throw new Error("Não foi possível obter a quantidade");
    }
    #validarPrecoUnitario(value) {
        if (!value || value <= 0) throw new Error("Não foi possível obter o valor");
    }

    static calcularValorTotalItens(itens) {
        return itens.reduce((total, item) => total + (item.precoUnitario * item.quantidade), 0);
    }

    static criar(dados) {
        return new ItenPedido(dados.idPedido, dados.idProduto, dados.quantidade, dados.precoUnitario, null);
    }
    static editar(dados) {
        return new ItenPedido(dados.idPedido, dados.idProduto, dados.quantidade, dados.precoUnitario, dados.idItemPedido);
    }
}