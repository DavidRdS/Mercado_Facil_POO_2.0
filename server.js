const express = require("express");
const cors = require("cors");
const path = require("path");

// Importar rotas
const estoqueRoutes = require("./src/routes/estoque.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend (index.html, styles.css, app.js)
const publicPath = path.join(__dirname);
app.use(express.static(publicPath));

// Rotas
app.use("/api/estoque", estoqueRoutes);

// Rota raiz
app.get("/", (req, res) => {
  res.json({
    mensagem: "🏪 API Mercado Fácil - Servidor em execução",
    versao: "2.0",
    endpoints: {
      estoque: "/api/estoque",
      documentacao: "/docs",
    },
  });
});

// Documentação básica
app.get("/docs", (req, res) => {
  res.json({
    titulo: "API Mercado Fácil - Documentação",
    modulos: {
      estoque: {
        criar: "POST /api/estoque",
        listar: "GET /api/estoque",
        consultar: "GET /api/estoque/:produtoId",
        entrada: "POST /api/estoque/:produtoId/entrada",
        saida: "POST /api/estoque/:produtoId/saida",
        ajuste: "PUT /api/estoque/:produtoId/ajuste",
        historico: "GET /api/estoque/:produtoId/historico",
        alertas: "GET /api/estoque/alerta/baixo",
        relatorio: "GET /api/estoque/relatorio/geral",
        deletar: "DELETE /api/estoque/:produtoId",
      },
    },
  });
});

// Tratamento de erros 404
app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada",
    caminho: req.path,
    metodo: req.method,
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API Mercado Fácil rodando em http://localhost:${PORT}`);
  console.log(`📚 Documentação em http://localhost:${PORT}/docs`);
});
