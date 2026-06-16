import { connection } from '../configs/Database.js'
import { ItenPedido } from '../models/ItensPedido.js';
import { Pedido } from '../models/Pedido.js';

const pedidoRepository = {
    criar: async (itens, statusInicial) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            const itensdoPedido = [];
            for (const item of itens) {
                const [produto] = await conn.execute(
                    'SELECT Estoque, Preco FROM Produtos WHERE IdProduto = ?',
                    [item.idProduto]
                );

                if (produto.length === 0) throw new Error(`Produto ${item.idProduto} não encontrado.`);
                if (produto[0].Estoque < item.quantidade) throw new Error(`Estoque insuficiente para o produto ${item.idProduto}.`);

                itensdoPedido.push({
                    idProduto: item.idProduto,
                    quantidade: item.quantidade,
                    precoUnitario: produto[0].Preco
                });
            }

            const valorTotalCalculado = ItenPedido.calcularValorTotalItens(itensdoPedido);
            const pedido = Pedido.criar({ valorTotal: valorTotalCalculado, statusPedido: statusInicial });

            const sqlPed = 'INSERT INTO Pedidos(ValorTotal, StatusPedido) VALUES (?,?);';
            const [rowsPed] = await conn.execute(sqlPed, [pedido.valorTotal, pedido.statusPedido]);
            const idPedido = rowsPed.insertId;

            for (const item of itensdoPedido) {
                const sqlItens = 'INSERT INTO ItensPedido(IdPedido, IdProduto, Quantidade, PrecoUnitario) VALUES (?,?,?,?);';
                await conn.execute(sqlItens, [idPedido, item.idProduto, item.quantidade, item.precoUnitario]);

                await conn.execute(
                    'UPDATE Produtos SET Estoque = Estoque - ? WHERE IdProduto = ?',
                    [item.quantidade, item.idProduto]
                );
            }

            await conn.commit();
            return { idPedido, valorTotal: pedido.valorTotal, statusPedido: pedido.statusPedido };
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    criarItens: async (idPedido, itens) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            const [pedido] = await conn.execute('SELECT ValorTotal FROM Pedidos WHERE IdPedido = ?', [idPedido]);
            if (pedido.length === 0) throw new Error('Pedido de origem não encontrado.');

            const itensdoPedido = [];
            for (const item of itens) {
                const [produto] = await conn.execute(
                    'SELECT Estoque, Preco FROM Produtos WHERE IdProduto = ?',
                    [item.idProduto]
                );

                if (produto.length === 0) throw new Error(`Produto ${item.idProduto} não encontrado.`);
                if (produto[0].Estoque < item.quantidade) throw new Error(`Estoque insuficiente para o produto ${item.idProduto}.`);

                itensdoPedido.push({
                    idProduto: item.idProduto,
                    quantidade: item.quantidade,
                    precoUnitario: produto[0].Preco
                });
            }

            for (const item of itensdoPedido) {
                await conn.execute(
                    'INSERT INTO ItensPedido(IdPedido, IdProduto, Quantidade, PrecoUnitario) VALUES (?,?,?,?);',
                    [idPedido, item.idProduto, item.quantidade, item.precoUnitario]
                );

                await conn.execute(
                    'UPDATE Produtos SET Estoque = Estoque - ? WHERE IdProduto = ?',
                    [item.quantidade, item.idProduto]
                );
            }

            const valorNovosItens = ItenPedido.calcularValorTotalItens(itensdoPedido);
            const novoValorTotalPedido = Number(pedido[0].ValorTotal) + valorNovosItens;

            await conn.execute(
                'UPDATE Pedidos SET ValorTotal = ? WHERE IdPedido = ?',
                [novoValorTotalPedido, idPedido]
            );

            await conn.commit();
            return { idPedido, novoValorTotal: novoValorTotalPedido, itensAdicionados: itensdoPedido };
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    editarItens: async (idItemPedido, quantidade) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            const [itemAtual] = await conn.execute(
                `SELECT IdPedido, IdProduto, Quantidade, PrecoUnitario FROM ItensPedido WHERE IdItemPedido = ?;`,
                [idItemPedido]
            );

            if (itemAtual.length === 0) throw new Error("Item não encontrado");

            const item = itemAtual[0];

            const quantidadeFinal = quantidade - item.Quantidade;

            if (quantidadeFinal !== 0) {
                if (quantidadeFinal > 0) {
                    const [produto] = await conn.execute(
                        'SELECT Estoque FROM Produtos WHERE IdProduto = ?',
                        [item.IdProduto]
                    );
                    if (produto.length === 0) throw new Error("Produto não encontrado.");
                    if (produto[0].Estoque < quantidadeFinal) throw new Error("Estoque insuficiente para aplicar essa alteração.");
                }

                await conn.execute(
                    `UPDATE Produtos SET Estoque = Estoque - ? WHERE IdProduto = ?;`,
                    [quantidadeFinal, item.IdProduto]
                );
            }

            const valorAntigo = item.Quantidade * item.PrecoUnitario;
            const valorNovo = quantidade * item.PrecoUnitario;
            const diferencaValor = valorNovo - valorAntigo;

            await conn.execute(
                `UPDATE ItensPedido SET Quantidade = ? WHERE IdItemPedido = ?;`,
                [quantidade, idItemPedido]
            );

            await conn.execute(
                `UPDATE Pedidos SET ValorTotal = ValorTotal + ? WHERE IdPedido = ?;`,
                [diferencaValor, item.IdPedido]
            );

            await conn.commit();
            return { idPedido: item.IdPedido, idItemPedido, novaQuantidade: quantidade };
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    deletarItens: async (idItemPedido) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            const [itemAtual] = await conn.execute(
                `SELECT IdPedido, IdProduto, Quantidade, PrecoUnitario FROM ItensPedido WHERE IdItemPedido = ?;`,
                [idItemPedido]
            );

            if (itemAtual.length === 0) throw new Error("Item não encontrado");

            const item = itemAtual[0];
            const valorTotalItem = item.Quantidade * item.PrecoUnitario;

            await conn.execute(
                `UPDATE Produtos SET Estoque = Estoque + ? WHERE IdProduto = ?;`,
                [item.Quantidade, item.IdProduto]
            );

            await conn.execute(
                `DELETE FROM ItensPedido WHERE IdItemPedido = ?;`,
                [idItemPedido]
            );

            await conn.execute(
                `UPDATE Pedidos SET ValorTotal = ValorTotal - ? WHERE IdPedido = ?;`,
                [valorTotalItem, item.IdPedido]
            );

            await conn.commit();
            return { idPedido: item.IdPedido, message: "Item removido e estoque devolvido!" };
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    editar: async (idPedido, statusPedido) => {
        const conn = await connection.getConnection();
        try {
            const sql = 'UPDATE Pedidos SET StatusPedido = ? WHERE IdPedido = ?;';
            const [result] = await conn.execute(sql, [statusPedido, idPedido]);

            if (result.affectedRows === 0) {
                throw new Error("Pedido não encontrado");
            }

            return {
                message: "Status atualizado com sucesso!", idPedido, statusPedido
            };
        } catch (error) {
            throw error;
        } finally {
            conn.release();
        }
    },

    selecionar: async () => {
        const sql = `
            SELECT 
                i.IdItemPedido, i.IdProduto, i.Quantidade, i.PrecoUnitario, 
                p.IdPedido, p.StatusPedido, p.DataCad, p.ValorTotal
            FROM Pedidos AS p
            INNER JOIN ItensPedido AS i ON p.IdPedido = i.IdPedido
            ORDER BY p.IdPedido ASC, i.IdItemPedido ASC;
        `;
        const [rows] = await connection.execute(sql);
        return rows;
    }, 
    deletar: async (idPedido) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            const [pedido] = await conn.execute(
                'SELECT IdPedido FROM Pedidos WHERE IdPedido = ?;', 
                [idPedido]
            );
            
            if (pedido.length === 0) throw new Error('Pedido não encontrado.');

            const [itensDoPedido] = await conn.execute(
                'SELECT IdProduto, Quantidade FROM ItensPedido WHERE IdPedido = ?;',
                [idPedido]
            );

            for (const item of itensDoPedido) {
                await conn.execute(
                    'UPDATE Produtos SET Estoque = Estoque + ? WHERE IdProduto = ?;',
                    [item.Quantidade, item.IdProduto]
                );
            }

            await conn.execute(
                'DELETE FROM ItensPedido WHERE IdPedido = ?;',
                [idPedido]
            );

            await conn.execute(
                'DELETE FROM Pedidos WHERE IdPedido = ?;',
                [idPedido]
            );

            await conn.commit();
            return { 
                idPedidoDeletado: idPedido, 
                message: "Pedido removido e estoque devolvido com sucesso!" 
            };
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }
};

export default pedidoRepository;