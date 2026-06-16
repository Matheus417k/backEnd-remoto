export class Produto {
    #idProduto;
    #idCategoria;
    #nomeProduto;
    #descricaoProduto;
    #preco;
    #imagem;
    #estoque;
    #dataCad;

    constructor(pIdC, pNomeProduto, pDescricaoProduto, pPreco, pImagem, pEstoque, pIdP) {
        this.idCategoria = pIdC;
        this.nomeProduto = pNomeProduto;
        this.descricaoProduto = pDescricaoProduto;
        this.preco = pPreco;
        this.imagem = pImagem;
        this.estoque = pEstoque;
        this.idProduto = pIdP;
    }

    get idProduto() {
        return this.#idProduto;
    }
    set idProduto(value) {
        this.#validarIdProduto(value);
        this.#idProduto = value;
    }

    get idCategoria() {
        return this.#idCategoria;
    }
    set idCategoria(value) {
        this.#validarIdCategoria(value);
        this.#idCategoria = value;
    }

    get nomeProduto() {
        return this.#nomeProduto;
    }
    set nomeProduto(value) {
        this.#validarNome(value);
        this.#nomeProduto = value;
    }

    get descricaoProduto() {
        return this.#descricaoProduto;
    }
    set descricaoProduto(value) {
        this.#validarDescricao(value);
        this.#descricaoProduto = value;
    }

    get preco() {
        return this.#preco;
    }
    set preco(value) {
        this.#validarPreco(value);
        this.#preco = value;
    }

    get imagem() {
        return this.#imagem;
    }
    set imagem(value) {
        this.#validarImagem(value);
        this.#imagem = value;
    }

    get estoque() {
        return this.#estoque;
    }
    set estoque(value) {
        this.#validarEstoque(value);
        this.#estoque = value;
    }

    #validarIdProduto(value) {
        if (value && value <= 0) {
            throw new Error('Verifique o id do produto informado');
        }
    }
    
    #validarIdCategoria(value) {
        if (value && value <= 0) {
            throw new Error('Verifique o id da categoria informado');
        }
    }
    
    #validarNome(value) {
        if (!value || value.trim().length < 3 || value.trim().length > 150) {
            throw new Error('O campo nome é obrigatório e deve ter entre 3 e 150 caracteres');
        }
    }
    
    #validarDescricao(value) {
        if (value && (value.trim().length < 10 || value.trim().length > 255)) {
            throw new Error('O campo descrição é obrigatório e deve ter entre 10 e 255 caracteres');
        }
    }
    
    #validarPreco(value) {
        if (value === undefined || isNaN(Number(value)) || value === null || Number(value) <= 0) {
            throw new Error('O campo valor é obrigatório, deve ter valores numéricos, não pode ser menor que 0');
        }
    }
    
    #validarImagem(value) {
        if (value) {
            if(String(value).trim().length < 3){
                throw new Error('O campo imagem não pode ficar vazio');
            }
        }
    }
    
    #validarEstoque(value) {
        if (value === undefined || value === null || value === '' || isNaN(value) || Number(value) < 0) {
            throw new Error('O campo estoque não pode ficar vazio e não pode ser menor que 0!');
        }
    }

    static criar(dados) {
        return new Produto(
            dados.idCategoria, dados.nomeProduto, dados.descricaoProduto, dados.preco, dados.imagem, dados.estoque, null
        );
    }
    
    static alterar(dados, idProduto) {
        return new Produto(
            dados.idCategoria, dados.nomeProduto, dados.descricaoProduto, dados.preco, dados.imagem, dados.estoque, idProduto
        );
    }
}