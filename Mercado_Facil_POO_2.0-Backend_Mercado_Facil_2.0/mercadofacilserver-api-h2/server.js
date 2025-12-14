// server.js
console.log("--- Tentando iniciar o script ---"); 

const cors = require('cors'); 
const express = require('express');
const { all, run } = require('./db'); 
const authRoutes = require('./authController');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas de autenticação (LOGIN)
app.use('/api', authRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.send('API MercadoFácil Server está rodando!');
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`🚀 API rodando em http://localhost:${PORT}`);
});

// ----------------------------------------------------
// Rotas da API (CRUD de PRODUTO)
// ----------------------------------------------------

/**
 * ROTA GET /api/produtos
 * Lista todos os produtos
 */
app.get('/api/produtos', async (req, res) => {
    try {
        const produtos = await all('SELECT id, nome, preco, url_imagem FROM PRODUTO');
        res.json(produtos);
    } catch (error) {
        console.error("Erro na rota GET /api/produtos:", error);
        res.status(500).json({ error: 'Erro ao buscar produtos.' });
    }
});

/**
 * ROTA GET /api/produtos/:id
 * Busca um produto específico pelo ID
 */
app.get('/api/produtos/:id', async (req, res) => {
    const id = req.params.id; 
    try {
        const produto = await all('SELECT id, nome, preco, url_imagem FROM PRODUTO WHERE id = ?', [id]);
        
        if (produto.length === 0) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }
        res.json(produto[0]); 
    } catch (error) {
        console.error("Erro na rota GET /api/produtos/:id:", error);
        res.status(500).json({ error: 'Erro ao buscar produto.' });
    }
});
/**
 * ROTA POST /api/produtos
 * Cria um novo produto
 */
app.post('/api/produtos', async (req, res) => {
    const { nome, preco, url_imagem } = req.body;
    
    if (!nome || typeof preco !== 'number') {
        return res.status(400).json({ error: 'Nome (texto) e Preço (número) são obrigatórios.' });
    }
    
    try {
        const sql = 'INSERT INTO PRODUTO (nome, preco, url_imagem) VALUES (?, ?, ?)';
        const result = await run(sql, [nome, preco, url_imagem || null]); 
        
        res.status(201).json({ 
            id: result.id, 
            nome: nome, 
            preco: preco,
            url_imagem: url_imagem || null,
            message: 'Produto criado com sucesso.'
        });
    } catch (error) {
        console.error("Erro na rota POST /api/produtos:", error);
        res.status(500).json({ error: 'Erro ao inserir produto no banco de dados.' });
    }
});


/**
 * ROTA PUT /api/produtos/:id
 * Atualiza um produto existente
 */
app.put('/api/produtos/:id', async (req, res) => {
    const id = req.params.id;
    const { nome, preco, url_imagem } = req.body;
    
    if (!nome || typeof preco !== 'number') {
        return res.status(400).json({ error: 'Nome e Preço (número) são obrigatórios para atualização.' });
    }
    
    try {
        const sql = 'UPDATE PRODUTO SET nome = ?, preco = ?, url_imagem = ? WHERE id = ?';
        await run(sql, [nome, preco, url_imagem || null, id]);
        
        res.json({ id: id, nome, preco, url_imagem: url_imagem || null, message: 'Produto atualizado com sucesso.' });
    } catch (error) {
        console.error("Erro na rota PUT /api/produtos/:id:", error);
        res.status(500).json({ error: 'Erro ao atualizar produto.' });
    }
});


/**
 * ROTA DELETE /api/produtos/:id
 * Exclui um produto
 */
app.delete('/api/produtos/:id', async (req, res) => {
    const id = req.params.id;
    
    try {
        const sql = 'DELETE FROM PRODUTO WHERE id = ?';
        await run(sql, [id]);
        
        res.status(204).send(); 
    } catch (error) {
        console.error("Erro na rota DELETE /api/produtos/:id:", error);
        res.status(500).json({ error: 'Erro ao excluir produto.' });
    }
});

// ----------------------------------------------------
// Rotas da API (CRUD de PEDIDO)
// ----------------------------------------------------

/**
 * ROTA POST /api/pedidos
 * Cria um novo pedido
 */
app.post('/api/pedidos', async (req, res) => {
    try {
        const { produtoId, nome, email, endereco, valor } = req.body;

        const sql = `
            INSERT INTO PEDIDOS (produtoId, nome, email, endereco, valor)
            VALUES (?, ?, ?, ?, ?)
        `;

        await run(sql, [produtoId, nome, email, endereco, valor]);

        res.status(201).json({ mensagem: 'Pedido registrado com sucesso!' });

    } catch (error) {
        console.error("Erro ao registrar pedido:", error);
        res.status(500).json({ erro: "Erro ao registrar pedido." });
    }
});


/**
 * ROTA GET /api/pedidos
 * Lista todos os pedidos
 */
app.get('/api/pedidos', async (req, res) => {
    try {
        // Agora, 'data_criacao' está correto no db.js e no SELECT
        const sql = 'SELECT id, produtoId, nome, email, endereco, valor, data_criacao FROM PEDIDOS ORDER BY data_criacao DESC';
        const pedidos = await all(sql);
        res.json(pedidos);
    } catch (error) {
        console.error("Erro na rota GET /api/pedidos:", error);
        res.status(500).json({ error: 'Erro ao buscar pedidos.' });
    }
});


/**
 * ROTA GET /api/pedidos/:id
 * Busca um pedido específico pelo ID
 */
app.get('/api/pedidos/:id', async (req, res) => {
    const id = req.params.id; 
    try {
        const sql = 'SELECT id, produtoId, nome, email, endereco, valor, data_criacao FROM PEDIDOS WHERE id = ?';
        const pedido = await all(sql, [id]);
        
        if (pedido.length === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }
        
        res.json(pedido[0]); 
    } catch (error) {
        console.error("Erro na rota GET /api/pedidos/:id:", error);
        res.status(500).json({ error: 'Erro ao buscar pedido.' });
    }
});


// IMPORTA O NOVO MÓDULO DE ROTAS DE USUÁRIO
const userRoutes = require('./userController');

// -----------------------------------------------------------
// MONTAGEM DOS CONTROLADORES (APÓS ROTAS DE PRODUTO)
// -------------------------------------------------------------

// DEFINE QUE TODAS AS ROTAS EM userRoutes COMEÇARÃO COM /api/usuarios
const estoqueRoutes = require('./EstoqueController');
app.use('/api/estoque', estoqueRoutes);


// ----------------------------------------------------
// Inicialização do Servidor    
// ----------------------------------------------------

app.listen(PORT, () => {
    console.log(`🚀 API MercadoFácil rodando em http://localhost:${PORT}`);
    console.log('--------------------------------------------------');
    console.log('Use http://localhost:3000/api/produtos para testar.');
    console.log('Use http://localhost:3000/api/pedidos para listar pedidos.');
});