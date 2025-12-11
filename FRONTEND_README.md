# Frontend - Sistema de Estoque Mercado Fácil

Front-end moderno e responsivo para o sistema de gestão de estoque do Mercado Fácil.

## 📋 Arquivos Inclusos

- **index.html** - Estrutura HTML da aplicação
- **styles.css** - Estilos CSS responsivos
- **app.js** - Lógica JavaScript e integrações com API

## 🚀 Como Executar

### Pré-requisitos
- Servidor backend rodando em `http://localhost:3000`
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### Passos

1. **Certifique-se de que o servidor está rodando**
   ```bash
   npm start
   ```

2. **Abra o arquivo no navegador**
   - Opção 1: Clique duplo em `index.html`
   - Opção 2: Use um servidor local (recomendado)
     ```bash
     python -m http.server 8000
     # ou
     npx http-server
     ```
   - Acesse: `http://localhost:8000`

## 🎨 Funcionalidades

### Dashboard
- **Visão Geral**: Estatísticas de produtos (Total, Baixo, Fora, OK)
- **Tabela de Estoque**: Lista completa com filtros
- **Busca**: Encontre produtos rapidamente
- **Filtros**: Filtre por status (OK, Baixo, Fora de Estoque)

### Novo Produto
- Cadastre novos produtos no sistema
- Defina quantidade inicial, mínimo e máximo
- Validação automática de dados

### Movimentação
- **Entrada**: Registre compras e devoluções
- **Saída**: Registre vendas e perdas
- Informações do produto em tempo real
- Histórico de movimentações

### Relatório
- Gera relatório completo de estoque
- Exportar para impressão
- Visualiza status de todos os produtos
- Data/hora de atualização

### Alertas
- **Críticos (Vermelho)**: Produtos fora de estoque
- **Avisos (Amarelo)**: Produtos com estoque baixo
- Ordenados por severidade
- Atualização automática

## 🎯 Seções da Aplicação

### 📊 Dashboard
Visão geral do status do estoque com:
- Contadores de produtos por status
- Tabela de todos os produtos
- Opções para editar limites
- Visualizar histórico
- Deletar produtos

### ➕ Novo Produto
Formulário para cadastrar novos produtos:
- Código do produto
- Quantidade inicial
- Estoque mínimo
- Estoque máximo

### 🔄 Movimentação
Registro de entradas e saídas:
- Seleção de produto
- Tipo de movimentação (Entrada/Saída)
- Quantidade
- Motivo (Compra, Venda, Devolução, etc)
- Referência (NF, Pedido, etc)
- Visualização de informações do produto

### 📈 Relatório
Geração de relatórios:
- Relatório geral de estoque
- Impressão/PDF
- Visualização completa de status

### ⚠️ Alertas
Sistema de notificações:
- Produtos sem estoque (crítico)
- Produtos com estoque baixo (aviso)
- Atualização automática

## 🔗 Integração com API

A aplicação se conecta com a API backend em `http://localhost:3000/api/estoque`

### Endpoints Utilizados

```
GET    /api/estoque                           - Listar todos
POST   /api/estoque                           - Criar novo
GET    /api/estoque/:produtoId                - Obter um
POST   /api/estoque/:produtoId/entrada        - Registrar entrada
POST   /api/estoque/:produtoId/saida          - Registrar saída
PUT    /api/estoque/:produtoId/ajuste         - Ajustar quantidade
PUT    /api/estoque/:produtoId/limites        - Atualizar limites
GET    /api/estoque/:produtoId/historico      - Ver histórico
GET    /api/estoque/alerta/baixo              - Alertas de estoque baixo
GET    /api/estoque/relatorio/geral           - Gerar relatório
DELETE /api/estoque/:produtoId                - Deletar produto
```

## 🎨 Design

### Paleta de Cores
- **Primária**: #667eea (Roxo)
- **Secundária**: #764ba2 (Roxo escuro)
- **Sucesso**: #2dce89 (Verde)
- **Aviso**: #fb6340 (Laranja)
- **Perigo**: #f5365c (Vermelho)

### Responsividade
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (480px - 767px)
- Extra pequeno (< 480px)

## 💻 Navegação

### Sidebar
Clique nos botões para navegar:
- 📊 Dashboard
- ➕ Novo Produto
- 🔄 Movimentação
- 📈 Relatório
- ⚠️ Alertas

### Ações na Tabela
Cada produto tem 3 ações:
- 📋 Ver histórico de movimentações
- ✏️ Editar limites (mínimo/máximo)
- 🗑️ Deletar produto

## 🔍 Buscas e Filtros

### Busca Global
Digite o código do produto na barra de busca para filtrar em tempo real

### Filtros por Status
- **Todos**: Mostra todos os produtos
- **OK**: Produtos com estoque dentro dos limites
- **Baixo**: Produtos abaixo do mínimo
- **Fora**: Produtos sem estoque

## 📱 Modo Responsivo

A aplicação se adapta a todos os tamanhos de tela:
- **Desktop**: Layout completo com sidebar
- **Tablet**: Sidebar colapsada
- **Mobile**: Menu em grid
- **Impressão**: Otimizado para impressão

## ⌨️ Atalhos Úteis

- **Enter**: Submeter formulários
- **Escape**: Fechar modais
- **Ctrl+P ou Cmd+P**: Imprimir relatório

## 🐛 Resolução de Problemas

### "Erro ao carregar dados"
- Verifique se o servidor backend está rodando
- Confirme que a porta 3000 está disponível
- Verifique a conexão de rede

### "Permissão negada ao deletar"
- Verifique as permissões no backend
- Confirme que o produto existe

### "Movimentação não registrada"
- Selecione corretamente o tipo de movimentação
- Verifique se há quantidade suficiente para saída
- Confirme que o produto existe

## 📝 Notas

- Os dados são salvos no backend em JSON
- Todas as operações são confirmadas com notificações
- O histórico é mantido automaticamente
- Filtros não afetam os dados, apenas a visualização

## 🔐 Segurança

- Validação de dados antes de enviar
- Confirmação antes de deletar
- Tratamento de erros em tempo real
- Sem armazenamento local de senhas

## 🚀 Melhorias Futuras

- Autenticação de usuários
- Gráficos de tendência
- Exportar para Excel/CSV
- Notificações push
- Sincronização em tempo real
- Modo offline

---

**Desenvolvido com ❤️ para o Mercado Fácil**
