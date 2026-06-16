import { connection } from "../configs/Database.js";

const categoriaRepository = {
    criar: async (categoria) => {
        const sql = 'INSERT INTO categorias (NomeCategoria, Descricao) VALUES (?, ?);';
        const values = [categoria.nome, categoria.descricao];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    editar: async (categoria) => {
        const sql = 'UPDATE categorias SET NomeCategoria=?, Descricao=? WHERE IdCategoria = ?;';
        const values = [categoria.nome, categoria.descricao, categoria.idCategoria];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    deletar: async (idCategoria) => {
        const sql = 'DELETE FROM categorias WHERE IdCategoria = ?;';
        const values = [idCategoria];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    selecionar: async () => {
        const sql = 'SELECT * FROM categorias;';
        const [rows] = await connection.execute(sql);
        return rows;
    }
}

export default categoriaRepository;