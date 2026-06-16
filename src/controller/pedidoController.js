import { Pedido } from "../models/Pedido.js";
import { ItenPedido } from "../models/ItensPedido.js";
import { statusPed } from "../enums/statusPedido.js";
import pedidoRepository from "../repositories/pedidoRepository.js";

const pedidoController = {
    criar: async (req, res) => {
        try {
            const { itens } = req.body;

            const result = await pedidoRepository.criar(itens, statusPed.ABERTO);
            
            res.status(201).json({ result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao criar pedido', errorMessage: error.message });
        }
    },

    criarItens: async (req, res) => {
        try {
            const { idPedido } = req.params;
            const { itens } = req.body;

            const result = await pedidoRepository.criarItens(idPedido, itens);
            
            res.status(201).json({ message: 'Itens adicionados ao pedido com sucesso', result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao adicionar itens ao pedido', errorMessage: error.message });
        }
    },
    
    editarItens: async (req, res) => {
        try {
            const { idItemPedido } = req.params;
            const { quantidade } = req.body;

            if (!quantidade || quantidade <= 0) {
                return res.status(400).json({ message: "Quantidade inválida para atualização." });
            }

            const result = await pedidoRepository.editarItens(idItemPedido, quantidade);
            
            res.status(200).json({ message: 'Item do pedido atualizado com sucesso', result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao editar item', errorMessage: error.message });
        }
    },

    deletarItens: async (req, res) => {
        try {
            const { idItemPedido } = req.params;

            const result = await pedidoRepository.deletarItens(idItemPedido);
            
            res.status(200).json({ message: 'Item removido do pedido com sucesso', result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao deletar item', errorMessage: error.message });
        }
    },

    editar: async (req, res) => {
        try {
            const { idPedido } = req.params;
            const { statusPedido } = req.body;

            const result = await pedidoRepository.editar(idPedido, statusPedido);
            
            res.status(200).json({ message: 'Pedido atualizado com sucesso', result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao editar pedido', errorMessage: error.message });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await pedidoRepository.selecionar();
            res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },
    
    deletar: async (req, res) => {
        try {
            const { idPedido } = req.params;

            const result = await pedidoRepository.deletar(idPedido);
            
            res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ 
                message: 'Erro ao deletar o pedido completo', 
                errorMessage: error.message 
            });
        }
    }
};

export default pedidoController;