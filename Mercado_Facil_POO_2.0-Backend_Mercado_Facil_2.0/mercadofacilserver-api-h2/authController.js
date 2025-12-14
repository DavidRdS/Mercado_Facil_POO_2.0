const express = require('express');
const router = express.Router();

// LOGIN SIMPLES (admin / admin)
router.post('/login', (req, res) => {
    const { login, senha } = req.body;

    // validação básica
    if (!login || !senha) {
        return res.status(400).json({
            erro: 'Login e senha são obrigatórios'
        });
    }

    // usuário fixo (acadêmico)
    if (login === 'admin' && senha === 'admin') {
        return res.json({
            mensagem: 'Login realizado com sucesso',
            usuario: {
                nome: 'Administrador',
                perfil: 'ADMIN'
            }
        });
    }

    // credenciais inválidas
    return res.status(401).json({
        erro: 'Login ou senha inválidos'
    });
});

module.exports = router;