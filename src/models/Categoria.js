export class Categoria {
    #idCategoria;
    #nome;
    #descricao;
    #dataCad;

    constructor(pNome, pDescricao, pIdC) {
        this.nome = pNome;
        this.descricao = pDescricao;
        this.idCategoria = pIdC;

    }

    get idCategoria() {
        return this.#idCategoria;
    }
    set idCategoria(value) {
        this.#validarIdCategoria(value);
        this.#idCategoria = value;
    }

    get nome() {
        return this.#nome;
    }
    set nome(value) {
        this.#validarNome(value);
        this.#nome = value
    }

    get descricao() {
        return this.#descricao;
    }
    set descricao(value) {
        this.#validarDescricao(value);
        this.#descricao = value
    }

    #validarIdCategoria(value) {
        if (value && value <= 0) {
            throw new Error('Verifique o id informado');
        }
    }

    #validarNome(value) {
        if (!value || value.trim().length < 3 || value.trim().length > 100) {
            throw new Error('O campo nome é obrigatório e deve ter entre 3 e 100 caracteres')
        }
    }
    #validarDescricao(value) {
        if (value && (value.trim().length < 10 || value.trim().length > 255)) {
            throw new Error('Sua descrição deve conter entre 10 e 255 caracteres')
        }
    }

    static criar(dados) {
        return new Categoria(dados.nome, dados.descricao, null);
    }
    static alterar(dados, idCategoria) {
        return new Categoria(dados.nome, dados.descricao, idCategoria);
    }
}