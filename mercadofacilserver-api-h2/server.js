// server.js (Adicione esta linha no TOPO)
console.log("--- Tentando iniciar o script ---"); 

// ** NOVO: Importa o CORS **
const cors = require('cors'); 
const express = require('express');
// Importa as funções 'all' (para SELECT) e 'run' (para INSERT/UPDATE/DELETE) do db.js
const { all, run } = require('./db'); 

const app = express();

// ** NOVO: Habilita o CORS para todas as origens (ideal para desenvolvimento) **
app.use(cors()); 

app.use(express.json()); // Habilita o Express a ler payloads JSON nas requisições
const PORT = 3000;

// Rota de Teste Simples
app.get('/', (req, res) => {
    res.send('API MercadoFácil Server está rodando!');
});

// ----------------------------------------------------
// Rotas da API (CRUD de PRODUTO)
// ----------------------------------------------------

/**
 * ROTA GET /api/produtos
 * Lista todos os produtos
 * **MODIFICADO: Inclui o campo url_imagem**
 */
app.get('/api/produtos', async (req, res) => {
    try {
        // Inclui o novo campo 'url_imagem'
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
 * **MODIFICADO: Inclui o campo url_imagem**
 */
app.get('/api/produtos/:id', async (req, res) => {
    // Captura o ID da URL
    const id = req.params.id; 
    try {
        // Inclui o novo campo 'url_imagem'
        const produto = await all('SELECT id, nome, preco, url_imagem FROM PRODUTO WHERE id = ?', [id]);
        
        if (produto.length === 0) {
            // Se a lista estiver vazia, o produto não existe (404 Not Found)
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }
        // Retorna o primeiro (e único) elemento encontrado.
        res.json(produto[0]); 
    } catch (error) {
        console.error("Erro na rota GET /api/produtos/:id:", error);
        res.status(500).json({ error: 'Erro ao buscar produto.' });
    }
});
/**
 * ROTA POST /api/produtos
 * Cria um novo produto
 * **MODIFICADO: Inclui o campo url_imagem**
 */
app.post('/api/produtos', async (req, res) => {
    // Agora esperamos também a url_imagem
    const { nome, preco, url_imagem } = req.body;
    
    // Validação básica: url_imagem é opcional ou pode ser uma string vazia, mas o tipo é importante.
    if (!nome || typeof preco !== 'number') {
        return res.status(400).json({ error: 'Nome (texto) e Preço (número) são obrigatórios.' });
    }
    
    try {
        // Adiciona url_imagem ao SQL e aos parâmetros
        const sql = 'INSERT INTO PRODUTO (nome, preco, url_imagem) VALUES (?, ?, ?)';
        const result = await run(sql, [nome, preco, url_imagem || null]); // Usa null se a URL não for fornecida
        
        res.status(201).json({ 
            id: result.id, 
            nome: nome, 
            preco: preco,
            url_imagem: url_imagem || null, // Retorna a URL (ou null) no JSON de resposta
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
 * **MODIFICADO: Inclui o campo url_imagem**
 */
app.put('/api/produtos/:id', async (req, res) => {
    const id = req.params.id;
    // Agora esperamos também a url_imagem
    const { nome, preco, url_imagem } = req.body;
    
    // Validação básica
    if (!nome || typeof preco !== 'number') {
        return res.status(400).json({ error: 'Nome e Preço (número) são obrigatórios para atualização.' });
    }
    
    try {
        // Adiciona url_imagem ao SQL e aos parâmetros
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
        // Executa a exclusão.
        // É uma boa prática verificar se alguma linha foi realmente deletada antes de retornar 204.
        // Se a sua função 'run' puder retornar o número de linhas afetadas, você pode adicionar essa verificação.
        await run(sql, [id]);
        
        // 204 No Content: Resposta padrão para exclusão bem-sucedida, sem corpo de resposta.
        res.status(204).send(); 
    } catch (error) {
        console.error("Erro na rota DELETE /api/produtos/:id:", error);
        res.status(500).json({ error: 'Erro ao excluir produto.' });
    }
});

// IMPORTA O NOVO MÓDULO DE ROTAS DE USUÁRIO
const userRoutes = require('./userController');

// ... (middleware e outras rotas de Produto)

// -----------------------------------------------------------
// MONTAGEM DOS CONTROLADORES (APÓS ROTAS DE PRODUTO)
// -------------------------------------------------------------

// DEFINE QUE TODAS AS ROTAS EM userRoutes COMEÇARÃO COM /api/usuarios
app.use('/api/usuarios', userRoutes);

// ----------------------------------------------------
// Inicialização do Servidor
// ----------------------------------------------------

app.listen(PORT, () => {
    console.log(`🚀 API MercadoFácil rodando em http://localhost:${PORT}`);
    console.log('--------------------------------------------------');
    console.log('Use http://localhost:3000/api/produtos para testar.');
});