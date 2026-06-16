# 📦 E-Commerce REST API (Back-End)

Esta é uma API REST modular e de alta performance desenvolvida em **Node.js** com **Express** e **MySQL** para servir como o ecossistema de back-end de uma plataforma de e-commerce. A aplicação foi projetada focando na integridade dos dados, validações rígidas de negócios e controle transacional de estoque, estando totalmente pronta para se integrar de forma segura a interfaces modernas (SPA).

---

## 🚀 Diferenciais Técnicos do Projeto

* **Garantia de Integridade (Transactions):** Toda a manipulação de pedidos (criação, edição e exclusão) utiliza transações nativas do MySQL (`beginTransaction`, `commit` e `rollback`). Se houver qualquer falha ou falta de estoque durante o processo, a operação é revertida automaticamente.
* **Padrão de Projeto Singleton:** A classe de conexão com o banco de dados (`Database.js`) garante que apenas uma instância e um único pool de até 100 conexões existam na aplicação, otimizando o uso de memória do servidor.
* **Encapsulamento e Validação Rígida:** Os modelos da aplicação (`Produto`, `Categoria`, `Pedido`, `ItenPedido`) utilizam campos privados do JavaScript (`#`). Os dados só são persistidos no banco após passarem por setters de validação que verificam tamanhos de string, valores negativos e tipos incorretos.
* **Upload Inteligente de Imagens:** Middleware construído sobre o **Multer** que aceita apenas formatos `.png` e `.jpeg` (limite de 10 MB), gerando hashes aleatórios com a biblioteca `crypto` para evitar conflito de nomes no servidor.

---

## 🛠️ Tecnologias Utilizadas

* **Node.js** (Ambiente de execução)
* **Express** (Framework Web)
* **MySQL2** (Driver com suporte a Promises)
* **Multer** (Processamento de arquivos/imagens)
* **CORS** (Segurança para compartilhamento de recursos entre origens)

---

## 📁 Estrutura de Pastas Modular

O projeto foi organizado de forma modular e limpa para facilitar a manutenção e o desenvolvimento em equipe:

```text
src/
├── configs/      # Configurações de Banco de Dados (Singleton Pattern)
├── controller/   # Orquestradores das requisições e respostas HTTP
├── enums/        # Definições de estados fixos (ex: Status do Pedido)
├── middlewares/  # Intermediadores de requisição (Filtro do Multer)
├── models/       # Regras de negócio, encapsulamento e validações
├── repositories/ # Camada dedicada exclusivamente a queries SQL e transações
├── routes/       # Definição e agrupamento dos endpoints da API
└── uploads/      # Armazenamento local das imagens dos produtos