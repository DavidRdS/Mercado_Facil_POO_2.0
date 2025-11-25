// userController.js
const express = require('express');
const router = express.Router();
const { all, run } = require('./db'); 

// ----------------------------------------------------
// Rotas da API (CRUD e Autenticação de USUARIO)
// ----------------------------------------------------

/**
 * ROTA GET /api/usuarios
 * Lista todos os usuários (exceto senha)
 */
router.get('/', async (req, res) => {
    try {
        const usuarios = await all('SELECT id, nome, email FROM USUARIO'); 
        res.json(usuarios);
    } catch (error) {
        console.error("Erro na rota GET /api/usuarios:", error);
        res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
});

/**
 * ROTA POST /api/usuarios/cadastro
 * Cria um novo usuário (Cadastro)
 */
router.post('/cadastro', async (req, res) => {
    const { nome, email, senha } = req.body;
    
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }
    
    // NOTA IMPORTANTE: Em um ambiente real, a senha DEVE ser hasheada e salgada 
    // usando bibliotecas como bcrypt antes de ser salva.
    
    try {
        const sql = 'INSERT INTO USUARIO (nome, email, senha) VALUES (?, ?, ?)';
        const result = await run(sql, [nome, email, senha]);
        
        // Retorna 201 Created e os dados do novo usuário (sem a senha)
        res.status(201).json({ 
            id: result.id, 
            nome: nome, 
            email: email, 
            message: 'Usuário cadastrado com sucesso.'
        });
    } catch (error) {
        // Se a inserção falhar devido ao email já existir
        if (error.message.includes('UNIQUE constraint failed')) {
             return res.status(409).json({ error: 'Este e-mail já está em uso.' });
        }
        console.error("Erro na rota POST /api/usuarios/cadastro:", error);
        res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
});

/**
 * ROTA POST /api/usuarios/login
 * Autentica um usuário existente
 */
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    try {
        // Busca o usuário pelo email, incluindo a senha para comparação
        const usuarios = await all('SELECT id, nome, email, senha FROM USUARIO WHERE email = ?', [email]);
        
        if (usuarios.length === 0) {
            // Usuário não encontrado
            return res.status(401).json({ error: 'Email ou senha inválidos.' });
        }

        const usuario = usuarios[0];

        // NOTA: Em um ambiente real, você usaria bcrypt.compare(senha, usuario.senha)
        // Aqui, fazemos uma comparação simples por ser apenas para demonstração.
        if (usuario.senha === senha) {
            // Sucesso no login. Retorna dados do usuário (sem a senha)
            res.json({
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                message: 'Login realizado com sucesso.'
            });
        } else {
            // Senha incorreta
            return res.status(401).json({ error: 'Email ou senha inválidos.' });
        }

    } catch (error) {
        console.error("Erro na rota POST /api/usuarios/login:", error);
        res.status(500).json({ error: 'Erro no servidor durante o login.' });
    }
});

/**
 * ROTA GET /api/usuarios/:id
 * Busca um usuário específico pelo ID (exceto senha)
 */
router.get('/:id', async (req, res) => {
    const id = req.params.id; 
    try {
        const usuario = await all('SELECT id, nome, email FROM USUARIO WHERE id = ?', [id]);
        
        if (usuario.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        res.json(usuario[0]); 
    } catch (error) {
        console.error("Erro na rota GET /api/usuarios/:id:", error);
        res.status(500).json({ error: 'Erro ao buscar usuário.' });
    }
});


/**
 * ROTA DELETE /api/usuarios/:id
 * Exclui um usuário
 */
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    
    try {
        const sql = 'DELETE FROM USUARIO WHERE id = ?';
        const result = await run(sql, [id]);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado para exclusão.' });
        }
        
        res.status(204).send(); 
    } catch (error) {
        console.error("Erro na rota DELETE /api/usuarios/:id:", error);
        res.status(500).json({ error: 'Erro ao excluir usuário.' });
    }
});

module.exports = router;