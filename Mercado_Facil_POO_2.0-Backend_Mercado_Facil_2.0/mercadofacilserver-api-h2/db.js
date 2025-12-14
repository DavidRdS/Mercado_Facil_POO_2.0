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
 * Inicializa o banco criando tabelas e adicionando dados iniciais
 */
function inicializarBancoDeDados() {
    db.serialize(() => {

        // ---------- TABELA PRODUTO ----------
        db.run(`
            CREATE TABLE IF NOT EXISTS PRODUTO (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                preco REAL NOT NULL,
                url_imagem TEXT
            )
        `, (err) => {
            if (err) {
                console.error("Erro ao criar tabela PRODUTO:", err.message);
                return;
            }

            db.get("SELECT COUNT(*) AS count FROM PRODUTO", (err, row) => {
                if (row && row.count === 0) {
                    console.log("📌 Inserindo dados iniciais na tabela PRODUTO...");

                    const stmt = db.prepare("INSERT INTO PRODUTO (nome, preco, url_imagem) VALUES (?, ?, ?)");

                    stmt.run("Laptop Gamer Xtreme", 5999.90, "https://www.asus.com/media/Odin/Websites/global/ProductLine/20200824120814.jpg");
                    stmt.run("Mouse Sem Fio Ultra-Ergonômico", 149.90, "https://down-br.img.susercontent.com/file/d73b0451aa2ba881e9b4ed0fbe4b4be4");
                    stmt.run("Monitor Gamer 27\" 4K", 2800.00, "https://i.zst.com.br/thumbs/12/18/38/1909415800.jpg");
                    stmt.run("SSD NVMe 2TB Gen4", 899.50, "https://down-br.img.susercontent.com/file/br-11134207-7r98o-mctsz0t6p6gx43_tn.webp");
                    stmt.run("Teclado Mecânico RGB Pro", 450.00, "https://images.tcdn.com.br/img/img_prod/745260/avantpro_comece_a_usar_o_avantpro_entrar_nao_possui_uma_conta_crie_uma_aqui_teclado_mecanico_gamer_6_237_1_d5733ebcd2e25afeccfb10edfb570ad2.png");
                    stmt.run("Headset Wireless Hi-Fi", 699.00, "https://mirandacomputacao.jetassets.com.br/produto/48627-principal.png");

                    stmt.finalize(() => {
                        console.log("✔ Dados iniciais inseridos.");
                    });
                }
            });
        });

        // ---------- TABELA PEDIDOS ----------
        db.run(`
            CREATE TABLE IF NOT EXISTS PEDIDOS (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                produtoId INTEGER,
                nome TEXT,
                email TEXT,
                endereco TEXT,
                valor REAL,
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error("Erro ao criar tabela PEDIDOS:", err.message);
            } else {
                console.log("🧾 Tabela PEDIDOS pronta.");
            }
        });

        // ---------- TABELA ESTOQUE ----------
        db.run(`
            CREATE TABLE IF NOT EXISTS ESTOQUE (
                produtoId TEXT PRIMARY KEY,
                quantidade INTEGER NOT NULL,
                minimo INTEGER NOT NULL,
                maximo INTEGER NOT NULL,
                status TEXT NOT NULL,
                dataAtualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error("Erro ao criar tabela ESTOQUE:", err.message);
            } else {
                console.log("📦 Tabela ESTOQUE pronta.");
            }
        });

        // ---------- TABELA HISTORICO ----------
        db.run(`
            CREATE TABLE IF NOT EXISTS HISTORICO (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                produtoId TEXT NOT NULL,
                tipo TEXT NOT NULL,
                quantidade INTEGER NOT NULL,
                motivo TEXT NOT NULL,
                referencia TEXT,
                data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error("Erro ao criar tabela HISTORICO:", err.message);
            } else {
                console.log("📜 Tabela HISTORICO pronta.");
            }
        });

    });
}

/**
 * SELECT que retorna múltiplos resultados
 */
function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

/**
 * INSERT, UPDATE e DELETE
 */
function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID });
        });
    });
}

module.exports = { all, run };
