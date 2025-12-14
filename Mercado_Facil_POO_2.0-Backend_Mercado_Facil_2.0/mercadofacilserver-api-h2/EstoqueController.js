const express = require('express');
const router = express.Router();
const { all, run } = require('./db');

// --------------------------------------------------------
// LISTAR ESTOQUE
// GET /api/estoque
// --------------------------------------------------------
router.get('/', async (req, res) => {
    try {
        const dados = await all("SELECT * FROM ESTOQUE");
        res.json(dados);
    } catch (error) {
        console.error("Erro ao carregar estoque:", error);
        res.status(500).json({ erro: "Erro ao carregar estoque." });
    }
});

// --------------------------------------------------------
// CRIAR NOVO ITEM NO ESTOQUE
// POST /api/estoque
// --------------------------------------------------------
router.post('/', async (req, res) => {
    try {
        const { produtoId, quantidade, minimo, maximo } = req.body;

        if (!produtoId || quantidade == null || minimo == null || maximo == null) {
            return res.status(400).json({ erro: "Campos obrigatórios: produtoId, quantidade, minimo, maximo" });
        }

        let status = "OK";
        if (quantidade <= 0) status = "FORA_DE_ESTOQUE";
        else if (quantidade <= minimo) status = "ESTOQUE_BAIXO";

        const sql = `
            INSERT INTO ESTOQUE (produtoId, quantidade, minimo, maximo, status)
            VALUES (?, ?, ?, ?, ?)
        `;

        await run(sql, [produtoId, quantidade, minimo, maximo, status]);

        res.status(201).json({ mensagem: "Produto cadastrado no estoque com sucesso!" });

    } catch (error) {
        console.error("Erro ao criar item no estoque:", error);
        res.status(500).json({ erro: "Erro ao criar item no estoque." });
    }
});

// --------------------------------------------------------
// VER UM ITEM ESPECÍFICO
// GET /api/estoque/:id
// --------------------------------------------------------
router.get('/:id', async (req, res) => {
    try {
        const produtoId = req.params.id;
        const dados = await all("SELECT * FROM ESTOQUE WHERE produtoId = ?", [produtoId]);

        if (dados.length === 0) {
            return res.status(404).json({ erro: "Produto não encontrado." });
        }

        res.json(dados[0]);
    } catch (error) {
        console.error("Erro ao buscar produto:", error);
        res.status(500).json({ erro: "Erro ao buscar produto." });
    }
});

// --------------------------------------------------------
// MOVIMENTAÇÃO DE ENTRADA
// POST /api/estoque/:id/entrada
// --------------------------------------------------------
router.post('/:id/entrada', async (req, res) => {
    try {
        const produtoId = req.params.id;
        const { quantidade, motivo, referencia } = req.body;

        const produto = await all("SELECT * FROM ESTOQUE WHERE produtoId = ?", [produtoId]);
        if (produto.length === 0) return res.status(404).json({ erro: "Produto não encontrado." });

        const atual = produto[0].quantidade + quantidade;

        let status = "OK";
        if (atual <= 0) status = "FORA_DE_ESTOQUE";
        else if (atual <= produto[0].minimo) status = "ESTOQUE_BAIXO";

        await run(
            "UPDATE ESTOQUE SET quantidade = ?, status = ? WHERE produtoId = ?",
            [atual, status, produtoId]
        );

        await run(
            "INSERT INTO HISTORICO (produtoId, tipo, quantidade, motivo, referencia) VALUES (?, ?, ?, ?, ?)",
            [produtoId, "ENTRADA", quantidade, motivo, referencia]
        );

        res.json({ mensagem: "Entrada registrada com sucesso!" });

    } catch (error) {
        console.error("Erro ao registrar entrada:", error);
        res.status(500).json({ erro: "Erro ao registrar entrada." });
    }
});

// --------------------------------------------------------
// MOVIMENTAÇÃO DE SAÍDA
// POST /api/estoque/:id/saida
// --------------------------------------------------------
router.post('/:id/saida', async (req, res) => {
    try {
        const produtoId = req.params.id;
        const { quantidade, motivo, referencia } = req.body;

        const produto = await all("SELECT * FROM ESTOQUE WHERE produtoId = ?", [produtoId]);
        if (produto.length === 0) return res.status(404).json({ erro: "Produto não encontrado." });

        const atual = produto[0].quantidade - quantidade;

        let status = "OK";
        if (atual <= 0) status = "FORA_DE_ESTOQUE";
        else if (atual <= produto[0].minimo) status = "ESTOQUE_BAIXO";

        await run(
            "UPDATE ESTOQUE SET quantidade = ?, status = ? WHERE produtoId = ?",
            [atual, status, produtoId]
        );

        await run(
            "INSERT INTO HISTORICO (produtoId, tipo, quantidade, motivo, referencia) VALUES (?, ?, ?, ?, ?)",
            [produtoId, "SAIDA", quantidade, motivo, referencia]
        );

        res.json({ mensagem: "Saída registrada com sucesso!" });

    } catch (error) {
        console.error("Erro ao registrar saída:", error);
        res.status(500).json({ erro: "Erro ao registrar saída." });
    }
});

// --------------------------------------------------------
// ATUALIZAR LIMITES
// PUT /api/estoque/:id/limites
// --------------------------------------------------------
router.put('/:id/limites', async (req, res) => {
    try {
        const produtoId = req.params.id;
        const { minimo, maximo } = req.body;

        await run(
            "UPDATE ESTOQUE SET minimo = ?, maximo = ? WHERE produtoId = ?",
            [minimo, maximo, produtoId]
        );

        res.json({ mensagem: "Limites atualizados com sucesso!" });

    } catch (error) {
        console.error("Erro ao atualizar limites:", error);
        res.status(500).json({ erro: "Erro ao atualizar limites." });
    }
});

// --------------------------------------------------------
// HISTÓRICO
// GET /api/estoque/:id/historico
// --------------------------------------------------------
router.get('/:id/historico', async (req, res) => {
    try {
        const produtoId = req.params.id;

        const dados = await all(
            "SELECT * FROM HISTORICO WHERE produtoId = ? ORDER BY data DESC",
            [produtoId]
        );

        res.json(dados);

    } catch (error) {
        console.error("Erro ao carregar histórico:", error);
        res.status(500).json({ erro: "Erro ao carregar histórico." });
    }
});

// --------------------------------------------------------
// DELETAR
// DELETE /api/estoque/:id
// --------------------------------------------------------
router.delete('/:id', async (req, res) => {
    try {
        const produtoId = req.params.id;

        await run("DELETE FROM ESTOQUE WHERE produtoId = ?", [produtoId]);

        res.json({ mensagem: "Produto deletado com sucesso!" });

    } catch (error) {
        console.error("Erro ao deletar:", error);
        res.status(500).json({ erro: "Erro ao deletar item." });
    }
});

// --------------------------------------------------------
// RELATÓRIO GERAL
// GET /api/estoque/relatorio/geral
// --------------------------------------------------------
router.get('/relatorio/geral', async (req, res) => {
    try {
        const dados = await all("SELECT * FROM ESTOQUE");
        res.json({ produtos: dados });

    } catch (error) {
        console.error("Erro ao gerar relatório:", error);
        res.status(500).json({ erro: "Erro ao gerar relatório." });
    }
});

module.exports = router;