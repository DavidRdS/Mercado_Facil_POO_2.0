# 🚀 Guia Completo - Sistema de Estoque Mercado Fácil

## Visão Geral do Projeto

Sistema completo de gerenciamento de estoque com:
- **Backend**: API REST em Node.js/Express
- **Frontend**: Interface web responsiva (HTML/CSS/JavaScript)
- **Persistência**: JSON local

---

## 📦 Estrutura de Arquivos

```
Mercado_Facil_POO_2.0/
├── src/
│   ├── models/
│   │   └── Estoque.js              # Modelo de estoque (lógica)
│   ├── controllers/
│   │   └── EstoqueController.js    # Controlador (CRUD + persistência)
│   └── routes/
│       └── estoque.routes.js       # Rotas da API
├── data/
│   └── estoque.json                # Banco de dados JSON
├── server.js                        # Servidor Express
├── package.json                     # Dependências
├── index.html                       # Frontend HTML
├── styles.css                       # Frontend CSS
├── app.js                           # Frontend JavaScript
├── ESTOQUE_DOCS.md                 # Documentação da API
├── FRONTEND_README.md              # Documentação do Frontend
└── GUIA_COMPLETO.md               # Este arquivo
```

---

## 🔧 Instalação e Setup

### 1. Instalar Dependências

```bash
npm install
```

### 2. Verificar package.json

Deve conter:
```json
{
  "name": "mercado-facil-estoque",
  "version": "1.0.0",
  "description": "Sistema de Estoque do Mercado Fácil",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
```

---

## 🎯 Como Usar

### Passo 1: Iniciar o Servidor Backend

```bash
npm start
```

Você verá:
```
🚀 API Mercado Fácil rodando em http://localhost:3000
📚 Documentação em http://localhost:3000/docs
```

### Passo 2: Abrir o Frontend

#### Opção A: Clique duplo no arquivo
- Clique duplo em `index.html`

#### Opção B: Servidor Local (Recomendado)
```bash
# Se tiver Python
python -m http.server 8000

# Ou se tiver Node.js
npx http-server

# Ou instale globalmente
npm install -g http-server
http-server
```

Acesse: `http://localhost:8000`

---

## 📊 Fluxo de Uso

### Primeira Vez

1. Navegue para **Novo Produto**
2. Cadastre alguns produtos:
   - PROD001: 50 unidades (mín: 10, máx: 100)
   - PROD002: 5 unidades (mín: 20, máx: 80)
   - PROD003: 0 unidades (mín: 15, máx: 60)

3. Veja os produtos no **Dashboard**
4. Verifique os **Alertas** (deve mostrar PROD002 e PROD003)

### Registrar Movimentações

1. Vá para **Movimentação**
2. Selecione um produto
3. Escolha tipo (Entrada/Saída)
4. Digite a quantidade
5. Selecione o motivo
6. Registre

### Ver Histórico

1. No **Dashboard**, clique no ícone 📋 de qualquer produto
2. Veja todas as movimentações

### Editar Limites

1. No **Dashboard**, clique no ícone ✏️
2. Ajuste mínimo e máximo
3. Salve as alterações

### Gerar Relatório

1. Vá para **Relatório**
2. Clique "Gerar Relatório Geral"
3. Visualize todos os produtos
4. Clique 🖨️ para imprimir

---

## 🔌 API Reference

### Base URL
```
http://localhost:3000/api/estoque
```

### 1. Listar Todos os Produtos
```bash
GET /api/estoque

Response:
[
  {
    "id": "estoque_1",
    "produtoId": "PROD001",
    "quantidade": 50,
    "minimo": 10,
    "maximo": 100,
    "status": "OK",
    "dataCriacao": "2024-12-06T...",
    "dataAtualizacao": "2024-12-06T...",
    "historico": [...]
  }
]
```

### 2. Criar Novo Produto
```bash
POST /api/estoque

Body:
{
  "produtoId": "PROD001",
  "quantidade": 50,
  "minimo": 10,
  "maximo": 100
}

Response: { id, produtoId, ... }
```

### 3. Obter um Produto
```bash
GET /api/estoque/:produtoId

Response: { produto completo }
```

### 4. Registrar Entrada
```bash
POST /api/estoque/:produtoId/entrada

Body:
{
  "quantidade": 20,
  "motivo": "compra",
  "referencia": "NF123456"
}

Response: { produto atualizado }
```

### 5. Registrar Saída
```bash
POST /api/estoque/:produtoId/saida

Body:
{
  "quantidade": 5,
  "motivo": "venda",
  "referencia": "PED789"
}

Response: { produto atualizado }
```

### 6. Atualizar Limites
```bash
PUT /api/estoque/:produtoId/limites

Body:
{
  "minimo": 15,
  "maximo": 120
}

Response: { produto atualizado }
```

### 7. Ver Histórico
```bash
GET /api/estoque/:produtoId/historico

Response:
[
  {
    "data": "2024-12-06T...",
    "tipo": "entrada",
    "quantidade": 20,
    "motivo": "compra",
    "referencia": "NF123456"
  }
]
```

### 8. Alertas de Estoque Baixo
```bash
GET /api/estoque/alerta/baixo

Response:
{
  "alertas": [
    {
      "produtoId": "PROD002",
      "quantidade": 5,
      "minimo": 20,
      "status": "ESTOQUE_BAIXO"
    }
  ]
}
```

### 9. Relatório Geral
```bash
GET /api/estoque/relatorio/geral

Response:
{
  "dataRelatorio": "2024-12-06T...",
  "totalProdutos": 3,
  "estatisticas": {
    "totalEstoque": 55,
    "estoqueOk": 1,
    "estoqueBaixo": 1,
    "foraDeSestoque": 1
  },
  "produtos": [...]
}
```

### 10. Deletar Produto
```bash
DELETE /api/estoque/:produtoId

Response: { sucesso: true }
```

---

## 🎨 Interface do Frontend

### Cores Utilizadas
- **Primária**: #667eea (Roxo)
- **Sucesso**: #2dce89 (Verde)
- **Aviso**: #fb6340 (Laranja)
- **Erro**: #f5365c (Vermelho)

### Status Produtos
- ✓ **OK**: Quantidade entre mínimo e máximo
- ⚠️ **Estoque Baixo**: Abaixo do mínimo
- ✗ **Fora de Estoque**: Quantidade = 0

### Motivos de Movimentação
- **Compra**: Nova entrada de mercadoria
- **Devolução**: Cliente devolveu produto
- **Venda**: Saída para cliente
- **Ajuste**: Correção de inventário
- **Perda**: Produto danificado/perdido
- **Outro**: Outros motivos

---

## 🧪 Exemplos de Teste

### Teste 1: Criar e Listar Produtos

```bash
# Terminal 1: Inicie o servidor
npm start

# Terminal 2: Crie um produto
curl -X POST http://localhost:3000/api/estoque \
  -H "Content-Type: application/json" \
  -d '{
    "produtoId": "ARROZ_1KG",
    "quantidade": 100,
    "minimo": 20,
    "maximo": 200
  }'

# Listar todos
curl http://localhost:3000/api/estoque
```

### Teste 2: Movimentação

```bash
# Registrar entrada
curl -X POST http://localhost:3000/api/estoque/ARROZ_1KG/entrada \
  -H "Content-Type: application/json" \
  -d '{
    "quantidade": 50,
    "motivo": "compra",
    "referencia": "NF001"
  }'

# Registrar saída
curl -X POST http://localhost:3000/api/estoque/ARROZ_1KG/saida \
  -H "Content-Type: application/json" \
  -d '{
    "quantidade": 30,
    "motivo": "venda",
    "referencia": "PED001"
  }'
```

### Teste 3: Frontend Completo

1. Inicie o servidor: `npm start`
2. Abra `index.html` no navegador
3. Cadastre 3 produtos diferentes
4. Realize entradas e saídas
5. Verifique o histórico
6. Gere um relatório
7. Imprima (Ctrl+P)

---

## 📝 Dados de Exemplo para Teste

```json
{
  "produtoId": "ARROZ_1KG",
  "quantidade": 50,
  "minimo": 20,
  "maximo": 200
}
```

```json
{
  "produtoId": "FEIJAO_1KG",
  "quantidade": 15,
  "minimo": 25,
  "maximo": 150
}
```

```json
{
  "produtoId": "OLEO_500ML",
  "quantidade": 0,
  "minimo": 30,
  "maximo": 100
}
```

---

## 🐛 Troubleshooting

### Problema: "Erro ao carregar dados"

**Solução:**
1. Verifique se o servidor está rodando
2. Confirme porta 3000 está livre
3. Verifique conexão de rede

### Problema: "Arquivo estoque.json não encontrado"

**Solução:**
1. O arquivo será criado automaticamente na primeira inserção
2. Ou crie manualmente: `mkdir data` e `touch data/estoque.json`

### Problema: "CORS error"

**Solução:**
1. Verifique se o CORS está habilitado no server.js
2. Confirme que o frontend está em http://localhost:8000
3. Reinicie o servidor

### Problema: "Movimentação não é permitida"

**Solução:**
1. Verifique se há quantidade suficiente
2. Confirme que o produto existe
3. Verifique mensagem de erro na aba de Alertas

---

## 📈 Estatísticas

### Produtos por Status
- **OK**: Verde - Dentro dos limites
- **ESTOQUE_BAIXO**: Amarelo - Abaixo do mínimo
- **FORA_DE_ESTOQUE**: Vermelho - Quantidade = 0

### Dashboard mostra:
- Total de produtos
- Quantidade em estoque baixo
- Quantidade fora de estoque
- Quantidade com estoque OK

---

## 💾 Persistência de Dados

Os dados são armazenados em `data/estoque.json`:

```json
[
  {
    "id": "estoque_1",
    "produtoId": "PROD001",
    "quantidade": 50,
    "minimo": 10,
    "maximo": 100,
    "status": "OK",
    "dataCriacao": "2024-12-06T10:00:00.000Z",
    "dataAtualizacao": "2024-12-06T11:00:00.000Z",
    "historico": [
      {
        "data": "2024-12-06T10:30:00.000Z",
        "tipo": "entrada",
        "quantidade": 20,
        "motivo": "compra",
        "referencia": "NF123"
      }
    ]
  }
]
```

---

## 🔄 Fluxo de Dados

```
Frontend (index.html)
    ↓
JavaScript (app.js)
    ↓
HTTP Request (Fetch API)
    ↓
Backend (server.js)
    ↓
Routes (estoque.routes.js)
    ↓
Controller (EstoqueController.js)
    ↓
Model (Estoque.js)
    ↓
JSON File (data/estoque.json)
    ↓
HTTP Response (JSON)
    ↓
Frontend (Atualizar UI)
```

---

## 🎓 Aprendizado

Este projeto demonstra:
- ✅ Arquitetura MVC
- ✅ API REST
- ✅ CRUD Operations
- ✅ Persistência de Dados
- ✅ Frontend Responsivo
- ✅ Tratamento de Erros
- ✅ Validação de Dados
- ✅ UI/UX Moderno

---

## 📚 Documentação Adicional

- `ESTOQUE_DOCS.md` - Documentação detalhada da API
- `FRONTEND_README.md` - Guia do Frontend

---

## 🚀 Próximos Passos

1. **Banco de Dados Real**: Migrar de JSON para SQL
2. **Autenticação**: Adicionar login de usuários
3. **Permissões**: Controle de acesso por papel
4. **Relatórios Avançados**: Gráficos e análises
5. **Notificações**: Sistema de alertas em tempo real
6. **Mobile App**: Aplicativo para iOS/Android

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os arquivos de documentação
2. Revise o console do navegador (F12)
3. Confira os logs do servidor (Terminal)
4. Tente fazer um teste manual com curl

---

**Sistema de Estoque - Mercado Fácil**
*Desenvolvido com ❤️ em JavaScript/Node.js*
