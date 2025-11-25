// db.js

// Este arquivo encapsula a lógica de conexão e interação com o SQLite.



const sqlite3 = require('sqlite3').verbose();

const path = require('path');



// Caminho para o arquivo do banco de dados.

const DB_PATH = path.join(__dirname, 'mercadofacil.db');



// Cria uma nova instância do banco de dados

const db = new sqlite3.Database(DB_PATH, (err) => {

    if (err) {

        console.error('Erro ao abrir o banco de dados:', err.message);

    } else {

        console.log('✅ Conectado ao banco de dados SQLite.');

        inicializarBancoDeDados();

    }

});



/**

 * Cria a tabela PRODUTO com a coluna url_imagem e insere dados de teste.

 */

function inicializarBancoDeDados() {

    // Adiciona a coluna url_imagem na criação da tabela

    db.serialize(() => {

        db.run(`

            CREATE TABLE IF NOT EXISTS PRODUTO (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                nome TEXT NOT NULL,

                preco REAL NOT NULL,

                url_imagem TEXT -- Coluna para a foto

            )

        `, (err) => {

            if (err) {

                console.error("Erro ao criar tabela PRODUTO:", err.message);

                return;

            }

           

            // Inserir dados de teste SÓ SE A TABELA ESTIVER VAZIA

            db.get("SELECT COUNT(*) AS count FROM PRODUTO", (err, row) => {

                if (row && row.count === 0) {

                    console.log("Inserindo dados iniciais na tabela PRODUTO...");

                   

                    const stmt = db.prepare("INSERT INTO PRODUTO (nome, preco, url_imagem) VALUES (?, ?, ?)");

                   

                    // URLs de imagens de exemplo de tecnologia (Unsplash)

                    stmt.run("Laptop Gamer Xtreme", 5999.90, "https://images.unsplash.com/photo-1541808605417-7e6153a5c2d3?q=80&w=1500&auto=format&fit=crop");

                    stmt.run("Mouse Sem Fio Ultra-Ergonômico", 149.90, "https://images.unsplash.com/photo-1527814050519-7243e8d93339?q=80&w=1500&auto=format&fit=crop");

                    stmt.run("Monitor Gamer 27\" 4K", 2800.00, "https://images.unsplash.com/photo-1596707447262-d965e6d8c0b9?q=80&w=1500&auto=format&fit=crop");

                    stmt.run("SSD NVMe 2TB Gen4", 899.50, "https://images.unsplash.com/photo-1599370725515-3882a8844837?q=80&w=1500&auto=format&fit=crop");

                    stmt.run("Teclado Mecânico RGB Pro", 450.00, "https://images.unsplash.com/photo-1627476839886-27a3c306d88b?q=80&w=1500&auto=format&fit=crop");

                    stmt.run("Headset Wireless Hi-Fi", 699.00, "https://images.unsplash.com/photo-1546435017-d079493f0b24?q=80&w=1500&auto=format&fit=crop");



                    stmt.finalize(() => {

                        console.log("Dados iniciais inseridos com sucesso.");

                    });

                }

            });

        });

    });

}



/**

 * Função para executar queries SELECT que retornam múltiplos ou zero resultados.

 */

function all(sql, params = []) {

    return new Promise((resolve, reject) => {

        db.all(sql, params, (err, rows) => {

            if (err) {

                reject(err);

            } else {

                resolve(rows);

            }

        });

    });

}



/**

 * Função para executar queries INSERT, UPDATE ou DELETE.

 */

function run(sql, params = []) {

    return new Promise((resolve, reject) => {

        db.run(sql, params, function (err) {

            if (err) {

                reject(err);

            } else {

                // Retorna o ID da última linha inserida (útil para POST)

                resolve({ id: this.lastID });

            }

        });

    });

}



module.exports = { all, run };





