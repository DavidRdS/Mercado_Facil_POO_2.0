# 📦 Setor de Estoque - Mercado Fácil

## Visão Geral

O setor de estoque gerencia toda a entrada, saída e controle de produtos do Mercado Fácil. Sistema com:
- ✅ Controle de quantidade
- ✅ Limite mínimo e máximo
- ✅ Histórico de movimentações
- ✅ Alertas de estoque baixo
- ✅ Ajuste de inventário

---

## 🏗️ Estrutura

```
src/
├── models/
│   └── Estoque.js           # Classe Estoque (lógica)
├── controllers/
│   └── EstoqueController.js # Gerenciador de operações
└── routes/
    └── estoque.routes.js    # Endpoints da API
```

---

## 📊 Endpoints da API

### 1️⃣ **Criar Estoque**
```bash
POST /api/estoque
Content-Type: application/json

{
  "produtoId": "PROD-001",
  "quantidade": 50,
  "minimo": 10,
  "maximo": 200
}
```

**Resposta (201):**
```json
{
  "sucesso": true,
  "mensagem": "Estoque criado com sucesso",
  "estoque": {
    "id": "EST-...",
    "produtoId": "PROD-001",
    "quantidade": 50,
    "minimo": 10,
    "maximo": 200,
    "status": "OK",
    "dataCriacao": "2025-01-15T10:30:00.000Z",
    "dataAtualizacao": "2025-01-15T10:30:00.000Z"
  }
}
```

---

### 2️⃣ **Listar Todos os Estoques**
```bash
GET /api/estoque
```

**Resposta (200):**
```json
{
  "sucesso": true,
  "total": 3,
  "estoques": [
    {
      "id": "EST-001",
      "produtoId": "PROD-001",
      "quantidade": 50,
      "status": "OK"
    }
  ]
}
```

---

### 3️⃣ **Consultar Estoque Específico**
```bash
GET /api/estoque/PROD-001
```

---

### 4️⃣ **Registrar Entrada (Compra)**
```bash
POST /api/estoque/PROD-001/entrada
Content-Type: application/json

{
  "quantidade": 30,
  "motivo": "Compra",
  "referencia": "NF-2025-001"
}
```

**Resposta:**
```json
{
  "sucesso": true,
  "mensagem": "Entrada de 30 unidades registrada",
  "quantidadeAnterior": 50,
  "quantidadeAtual": 80,
  "estoque": { ... }
}
```

---

### 5️⃣ **Registrar Saída (Venda)**
```bash
POST /api/estoque/PROD-001/saida
Content-Type: application/json

{
  "quantidade": 10,
  "motivo": "Venda",
  "referencia": "PDV-2025-100"
}
```

---

### 6️⃣ **Ajuste de Inventário**
```bash
PUT /api/estoque/PROD-001/ajuste
Content-Type: application/json

{
  "novaQuantidade": 75,
  "motivo": "Ajuste de Inventário",
  "referencia": "INV-2025-01"
}
```

---

### 7️⃣ **Atualizar Limites**
```bash
PUT /api/estoque/PROD-001/limites
Content-Type: application/json

{
  "minimo": 15,
  "maximo": 300
}
```

---

### 8️⃣ **Obter Histórico de Movimentações**
```bash
GET /api/estoque/PROD-001/historico
```

**Resposta:**
```json
{
  "sucesso": true,
  "produtoId": "PROD-001",
  "total": 5,
  "historico": [
    {
      "tipo": "ENTRADA",
      "quantidade": 30,
      "motivo": "Compra",
      "referencia": "NF-2025-001",
      "quantidadeAnterior": 50,
      "quantidadeNova": 80,
      "data": "2025-01-15T11:00:00.000Z"
    }
  ]
}
```

---

### 9️⃣ **Alertas - Estoque Baixo**
```bash
GET /api/estoque/alerta/baixo
```

**Resposta:**
```json
{
  "sucesso": true,
  "total": 2,
  "avisos": [
    {
      "produtoId": "PROD-003",
      "quantidade": 5,
      "minimo": 10,
      "maximo": 100,
      "status": "ESTOQUE_BAIXO",
      "faltam": 5
    }
  ]
}
```

---

### 🔟 **Relatório Geral**
```bash
GET /api/estoque/relatorio/geral
```

**Resposta:**
```json
{
  "sucesso": true,
  "relatorio": {
    "data": "2025-01-15T12:00:00.000Z",
    "totalProdutos": 50,
    "quantidadeTotalEstoque": 5000,
    "produtosEstoqueBaixo": 5,
    "produtosForaEstoque": 2,
    "detalhes": [...]
  }
}
```

---

### 1️⃣1️⃣ **Deletar Estoque**
```bash
DELETE /api/estoque/PROD-001
```

---

## 🔧 Como Usar

### 1. Instalar dependências
```bash
cd Mercado_Facil_POO_2.0
npm install
```

### 2. Iniciar servidor
```bash
npm start
# ou
node server.js
```

### 3. Testar com cURL ou Postman

**Exemplo com cURL:**
```bash
# Criar estoque
curl -X POST http://localhost:3000/api/estoque \
  -H "Content-Type: application/json" \
  -d '{
    "produtoId": "PROD-001",
    "quantidade": 100,
    "minimo": 20,
    "maximo": 500
  }'

# Registrar entrada
curl -X POST http://localhost:3000/api/estoque/PROD-001/entrada \
  -H "Content-Type: application/json" \
  -d '{
    "quantidade": 50,
    "motivo": "Compra",
    "referencia": "NF-001"
  }'

# Registrar saída
curl -X POST http://localhost:3000/api/estoque/PROD-001/saida \
  -H "Content-Type: application/json" \
  -d '{
    "quantidade": 20,
    "motivo": "Venda",
    "referencia": "PDV-100"
  }'

# Listar todos
curl http://localhost:3000/api/estoque

# Obter relatório
curl http://localhost:3000/api/estoque/relatorio/geral
```

---

## 📋 Status do Estoque

| Status | Descrição |
|--------|-----------|
| `OK` | Estoque normal |
| `ESTOQUE_BAIXO` | Abaixo da quantidade mínima |
| `FORA_DE_ESTOQUE` | Quantidade = 0 |
| `ESTOQUE_CHEIO` | Na quantidade máxima |

---

## 🔐 Validações

- ✅ Quantidade não pode ser negativa
- ✅ Quantidade deve respeitar limites (mín/máx)
- ✅ Não permite venda maior que o estoque
- ✅ Alerta automático quando estoque fica baixo

---

## 📁 Arquivo de Dados

Os dados são armazenados em: `data/estoque.json`

Estrutura:
```json
[
  {
    "id": "EST-123",
    "produtoId": "PROD-001",
    "quantidade": 100,
    "minimo": 20,
    "maximo": 500,
    "dataCriacao": "2025-01-15T10:00:00.000Z",
    "dataAtualizacao": "2025-01-15T11:30:00.000Z",
    "historico": [...]
  }
]
```

---

## 🚀 Próximos Passos

1. Integrar com setor de Produtos
2. Integrar com PDV para sincronização
3. Gerar relatórios em PDF
4. Implementar notificações de baixo estoque
5. Dashboard de visualização

---

**✨ Sistema pronto para uso!**
