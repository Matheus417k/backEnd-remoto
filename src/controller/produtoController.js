import { Produto } from "../models/Produtos.js";
import produtoRepository from "../repositories/produtoRepository.js";

const produtoController = {
    criar: async (req, res) => {
        try {
            const { idCategoria, nomeProduto, descricaoProduto, preco, estoque } = req.body;
            const imagem = req.file ? `/uploads/images/${req.file.filename}` : null;
            
            const produto = Produto.criar({ idCategoria, nomeProduto, descricaoProduto, preco, estoque, imagem });
            const result = await produtoRepository.criar(produto);
            
            res.status(201).json({ result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },
    editar: async (req, res) => {
        try {
            const idProduto = req.params.idProduto;
            const { idCategoria, nomeProduto, descricaoProduto, preco, estoque } = req.body;

            const produto = Produto.alterar({ idCategoria, nomeProduto, descricaoProduto, preco, estoque, imagem: null }, idProduto);
            const result = await produtoRepository.editar(produto);

            res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },
    deletar: async (req, res) => {
        try {
            const idProduto = req.params.idProduto;
            const result = await produtoRepository.deletar(idProduto);

            res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },
    selecionar: async (req, res) => {
        try {
            const result = await produtoRepository.selecionar();
            res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    }
}

export default produtoController;