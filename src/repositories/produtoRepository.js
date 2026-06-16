import { connection } from "../configs/Database.js";

const produtoRepository = {
    criar: async (produto) => {
        const sql = 'INSERT INTO Produtos (IdCategoria, NomeProduto, DescricaoProduto, Preco, Imagem, Estoque) VALUES (?, ?, ?, ?, ?, ?);';
        const values = [produto.idCategoria, produto.nomeProduto, produto.descricaoProduto, produto.preco, produto.imagem, produto.estoque];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    editar: async (produto) => {
        const sql = 'UPDATE Produtos SET IdCategoria=?, NomeProduto=?, DescricaoProduto=?, Preco=?, Estoque=? WHERE IdProduto=?;';
        const values = [produto.idCategoria, produto.nomeProduto, produto.descricaoProduto, produto.preco, produto.estoque, produto.idProduto];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    deletar: async (idProduto) => {
        const sql = 'DELETE FROM Produtos WHERE IdProduto = ?;';
        const values = [idProduto];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
      selecionar: async () => {
        const sql = `
            SELECT 
                p.*, 
                c.NomeCategoria 
            FROM 
                Produtos p 
            INNER JOIN 
                categorias c ON p.IdCategoria = c.IdCategoria;
        `;
        const [rows] = await connection.execute(sql);
        return rows;
    }
}

export default produtoRepository;