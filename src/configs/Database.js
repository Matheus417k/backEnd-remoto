import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Carrega as variáveis do seu arquivo .env (onde está DB_DATABASE=infinity)
dotenv.config();

// Singleton para a conexão com o banco de dados
class Database {
    static #instance = null;
    #pool = null;

    #createPool() {
        this.#pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE, // Vai ler automaticamente 'infinity' do seu .env
            port: process.env.DB_PORT,
            waitForConnections: true,
            connectionLimit: 100,
            queueLimit: 0,
            ssl: {
                rejectUnauthorized: false
            }
        });
    }

    static getInstance() {
        if (!Database.#instance) {
            Database.#instance = new Database();
            Database.#instance.#createPool();
        }
        return Database.#instance;
    }

    getPool() {
        return this.#pool;
    }
}

// Exporta a conexão configurada com os seus dados
export const connection = Database.getInstance().getPool();

// Função que cria o banco 'infinity' e as suas 4 tabelas automaticamente
export async function initializeDatabase() {
    console.log("Inicializando o banco de dados e tabelas do projeto Infinity...");
    try {
        const tempConnection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            ssl: { rejectUnauthorized: false }
        });

        // Pega o nome do banco do seu .env ('infinity')
        const dbName = process.env.DB_DATABASE || 'infinity'; 

        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        await tempConnection.query(`USE \`${dbName}\`;`);

        // 1. Criando a tabela Categorias
        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS Categorias (
                IdCategoria INT AUTO_INCREMENT PRIMARY KEY,
                NomeCategoria VARCHAR(100) NOT NULL,
                Descricao VARCHAR(255),
                DataCad TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 2. Criando a tabela Produtos
        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS Produtos (
                IdProduto INT AUTO_INCREMENT PRIMARY KEY,
                IdCategoria INT NOT NULL,
                NomeProduto VARCHAR(150) NOT NULL,
                DescricaoProduto VARCHAR(255),
                Preco DECIMAL(10,2) NOT NULL,
                Imagem VARCHAR(255),
                Estoque INT NOT NULL DEFAULT 0,
                DataCad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT FK_Produtos_Categorias
                    FOREIGN KEY (IdCategoria)
                    REFERENCES Categorias(IdCategoria)
            );
        `);

        // 3. Criando a tabela Pedidos
        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS Pedidos (
                IdPedido INT AUTO_INCREMENT PRIMARY KEY,
                ValorTotal DECIMAL(10,2) NOT NULL,
                StatusPedido ENUM('Aberto','Finalizado','Pendente'),
                DataCad TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 4. Criando a tabela ItensPedido
        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS ItensPedido (
                IdItemPedido INT AUTO_INCREMENT PRIMARY KEY,
                IdPedido INT NOT NULL,
                IdProduto INT NOT NULL,
                Quantidade INT NOT NULL,
                PrecoUnitario DECIMAL(10,2) NOT NULL,
                DataCad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT FK_ItensPedido_Pedidos
                    FOREIGN KEY (IdPedido)
                    REFERENCES Pedidos(IdPedido),
                CONSTRAINT FK_ItensPedido_Produtos
                    FOREIGN KEY (IdProduto)
                    REFERENCES Produtos(IdProduto)
            );
        `);

        await tempConnection.end();
        console.log(`Banco de dados "${dbName}" e tabelas criados/verificados com sucesso!`);
    } catch (error) {
        console.error("Erro ao inicializar o banco do projeto Infinity:", error);
        throw error;
    }
}