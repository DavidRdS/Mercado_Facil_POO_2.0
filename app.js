// API Configuration
const API_BASE_URL = 'http://localhost:3000/api/estoque';

// State Management
let estadoApp = {
    estoque: [],
    filtroAtual: 'todos',
    produtoSelecionado: null
};

// DOM Elements
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');
const formNovoProduto = document.getElementById('form-novo-produto');
const formMovimentacao = document.getElementById('form-movimentacao');
const formLimites = document.getElementById('form-limites');
const modal = document.getElementById('modal-limites');
const btnCloseModal = document.querySelector('.btn-close');
const btnCancelModal = document.getElementById('btn-cancel-modal');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.btn-filter');
const toast = document.getElementById('toast');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
    setupEventListeners();
    updateClock();
    setInterval(updateClock, 1000);
});

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => navegarSecao(btn.dataset.section));
    });

    // Form Submissions
    formNovoProduto.addEventListener('submit', handleNovoProduto);
    formMovimentacao.addEventListener('submit', handleMovimentacao);
    formLimites.addEventListener('submit', handleAtualizarLimites);

    // Filters
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => aplicarFiltro(btn.id));
    });

    // Search
    searchInput.addEventListener('input', handleBusca);

    // Modal
    btnCloseModal.addEventListener('click', fecharModal);
    btnCancelModal.addEventListener('click', fecharModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal();
    });

    // Produto Select
    document.getElementById('produto-select').addEventListener('change', handleProdutoSelecionado);

    // Relatório
    document.getElementById('btn-relatorio-geral').addEventListener('click', gerarRelatorio);
    document.getElementById('btn-print').addEventListener('click', imprimirRelatorio);
}

// Carregar Dados da API
async function carregarDados() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error('Erro ao carregar estoque');
        
        estadoApp.estoque = await response.json();
        atualizarDashboard();
        atualizarTabela();
        atualizarSelectProdutos();
        atualizarAlertas();
    } catch (error) {
        console.error('Erro:', error);
        mostrarToast('Erro ao carregar dados', 'error');
    }
}

// Navegação entre seções
function navegarSecao(secao) {
    navButtons.forEach(btn => btn.classList.remove('active'));
    sections.forEach(sec => sec.classList.remove('active'));

    document.querySelector(`[data-section="${secao}"]`).classList.add('active');
    document.getElementById(secao).classList.add('active');

    // Atualizar título
    const titulos = {
        'estoque': 'Dashboard de Estoque',
        'novo-produto': 'Novo Produto',
        'movimentacao': 'Movimentação',
        'relatorio': 'Relatório',
        'alertas': 'Alertas'
    };
    document.getElementById('page-title').textContent = titulos[secao];
}

// Atualizar Dashboard
function atualizarDashboard() {
    const total = estadoApp.estoque.length;
    const baixo = estadoApp.estoque.filter(e => e.status === 'ESTOQUE_BAIXO').length;
    const fora = estadoApp.estoque.filter(e => e.status === 'FORA_DE_ESTOQUE').length;
    const ok = estadoApp.estoque.filter(e => e.status === 'OK').length;

    document.getElementById('total-produtos').textContent = total;
    document.getElementById('estoque-baixo').textContent = baixo;
    document.getElementById('fora-estoque').textContent = fora;
    document.getElementById('estoque-ok').textContent = ok;
}

// Atualizar Tabela
function atualizarTabela(filtro = 'todos') {
    const tbody = document.getElementById('estoque-table');
    
    let dados = estadoApp.estoque;

    // Aplicar filtro
    if (filtro !== 'todos') {
        const statusMap = {
            'ok': 'OK',
            'low': 'ESTOQUE_BAIXO',
            'out': 'FORA_DE_ESTOQUE'
        };
        dados = dados.filter(e => e.status === statusMap[filtro]);
    }

    if (dados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum produto encontrado</td></tr>';
        return;
    }

    tbody.innerHTML = dados.map(item => `
        <tr>
            <td><strong>${item.produtoId}</strong></td>
            <td>${item.quantidade}</td>
            <td>${item.minimo}</td>
            <td>${item.maximo}</td>
            <td>${getStatusBadge(item.status)}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-action btn-view" onclick="verHistorico('${item.produtoId}')">📋</button>
                    <button class="btn-action btn-edit" onclick="abrirModalLimites('${item.produtoId}', ${item.minimo}, ${item.maximo})">✏️</button>
                    <button class="btn-action btn-delete" onclick="deletarProduto('${item.produtoId}')">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Get Status Badge
function getStatusBadge(status) {
    const badges = {
        'OK': '<span class="status-badge status-ok">✓ OK</span>',
        'ESTOQUE_BAIXO': '<span class="status-badge status-low">⚠️ Baixo</span>',
        'FORA_DE_ESTOQUE': '<span class="status-badge status-out">✗ Fora</span>'
    };
    return badges[status] || status;
}

// Aplicar Filtro
function aplicarFiltro(filtroId) {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    document.getElementById(filtroId).classList.add('active');

    const filtroMap = {
        'filter-all': 'todos',
        'filter-ok': 'ok',
        'filter-low': 'low',
        'filter-out': 'out'
    };

    estadoApp.filtroAtual = filtroMap[filtroId];
    atualizarTabela(estadoApp.filtroAtual);
}

// Busca
function handleBusca(e) {
    const termo = e.target.value.toLowerCase();
    
    if (termo === '') {
        atualizarTabela(estadoApp.filtroAtual);
        return;
    }

    const tbody = document.getElementById('estoque-table');
    const dados = estadoApp.estoque.filter(e => 
        e.produtoId.toLowerCase().includes(termo)
    );

    if (dados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum produto encontrado</td></tr>';
        return;
    }

    tbody.innerHTML = dados.map(item => `
        <tr>
            <td><strong>${item.produtoId}</strong></td>
            <td>${item.quantidade}</td>
            <td>${item.minimo}</td>
            <td>${item.maximo}</td>
            <td>${getStatusBadge(item.status)}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-action btn-view" onclick="verHistorico('${item.produtoId}')">📋</button>
                    <button class="btn-action btn-edit" onclick="abrirModalLimites('${item.produtoId}', ${item.minimo}, ${item.maximo})">✏️</button>
                    <button class="btn-action btn-delete" onclick="deletarProduto('${item.produtoId}')">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Handle Novo Produto
async function handleNovoProduto(e) {
    e.preventDefault();

    const produtoData = {
        produtoId: document.getElementById('produto-id').value,
        quantidade: parseInt(document.getElementById('quantidade-inicial').value),
        minimo: parseInt(document.getElementById('estoque-minimo').value),
        maximo: parseInt(document.getElementById('estoque-maximo').value)
    };

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(produtoData)
        });

        if (!response.ok) throw new Error('Erro ao criar produto');

        mostrarToast('Produto cadastrado com sucesso!', 'success');
        formNovoProduto.reset();
        await carregarDados();
        navegarSecao('estoque');
    } catch (error) {
        console.error('Erro:', error);
        mostrarToast('Erro ao cadastrar produto', 'error');
    }
}

// Handle Movimentação
async function handleMovimentacao(e) {
    e.preventDefault();

    const produtoId = document.getElementById('produto-select').value;
    const tipoMovimentacao = document.getElementById('tipo-movimentacao').value;
    const quantidade = parseInt(document.getElementById('quantidade-mov').value);
    const motivo = document.getElementById('motivo-mov').value;
    const referencia = document.getElementById('referencia-mov').value;

    if (!produtoId || !tipoMovimentacao || !motivo) {
        mostrarToast('Preencha todos os campos obrigatórios', 'warning');
        return;
    }

    try {
        const endpoint = tipoMovimentacao === 'entrada' 
            ? `${API_BASE_URL}/${produtoId}/entrada`
            : `${API_BASE_URL}/${produtoId}/saida`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                quantidade,
                motivo,
                referencia: referencia || undefined
            })
        });

        if (!response.ok) throw new Error('Erro na movimentação');

        mostrarToast(`${tipoMovimentacao === 'entrada' ? 'Entrada' : 'Saída'} registrada com sucesso!`, 'success');
        formMovimentacao.reset();
        await carregarDados();
    } catch (error) {
        console.error('Erro:', error);
        mostrarToast('Erro ao registrar movimentação', 'error');
    }
}

// Atualizar Select de Produtos
function atualizarSelectProdutos() {
    const select = document.getElementById('produto-select');
    const opcaoVazia = select.querySelector('option:first-child');
    
    const opcoes = estadoApp.estoque.map(item => 
        `<option value="${item.produtoId}">${item.produtoId}</option>`
    ).join('');

    select.innerHTML = opcaoVazia.outerHTML + opcoes;
}

// Handle Produto Selecionado
async function handleProdutoSelecionado(e) {
    const produtoId = e.target.value;
    
    if (!produtoId) {
        document.getElementById('info-produto').style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${produtoId}`);
        if (!response.ok) throw new Error('Erro ao carregar produto');

        const produto = await response.json();
        document.getElementById('info-quantidade').textContent = produto.quantidade;
        document.getElementById('info-status').textContent = getStatusLabel(produto.status);
        document.getElementById('info-minimo').textContent = produto.minimo;
        document.getElementById('info-maximo').textContent = produto.maximo;
        document.getElementById('info-produto').style.display = 'block';
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Get Status Label
function getStatusLabel(status) {
    const labels = {
        'OK': '✓ OK',
        'ESTOQUE_BAIXO': '⚠️ Estoque Baixo',
        'FORA_DE_ESTOQUE': '✗ Fora de Estoque'
    };
    return labels[status] || status;
}

// Abrir Modal Limites
function abrirModalLimites(produtoId, minimo, maximo) {
    document.getElementById('modal-produto-id').value = produtoId;
    document.getElementById('modal-minimo').value = minimo;
    document.getElementById('modal-maximo').value = maximo;
    modal.classList.add('active');
}

// Fechar Modal
function fecharModal() {
    modal.classList.remove('active');
}

// Handle Atualizar Limites
async function handleAtualizarLimites(e) {
    e.preventDefault();

    const produtoId = document.getElementById('modal-produto-id').value;
    const minimo = parseInt(document.getElementById('modal-minimo').value);
    const maximo = parseInt(document.getElementById('modal-maximo').value);

    if (minimo >= maximo) {
        mostrarToast('Mínimo deve ser menor que máximo', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${produtoId}/limites`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ minimo, maximo })
        });

        if (!response.ok) throw new Error('Erro ao atualizar limites');

        mostrarToast('Limites atualizados com sucesso!', 'success');
        fecharModal();
        await carregarDados();
    } catch (error) {
        console.error('Erro:', error);
        mostrarToast('Erro ao atualizar limites', 'error');
    }
}

// Ver Histórico
async function verHistorico(produtoId) {
    try {
        const response = await fetch(`${API_BASE_URL}/${produtoId}/historico`);
        if (!response.ok) throw new Error('Erro ao carregar histórico');

        const historico = await response.json();
        let conteudo = `<h3>Histórico: ${produtoId}</h3>`;
        
        if (historico.length === 0) {
            conteudo += '<p>Nenhuma movimentação registrada</p>';
        } else {
            conteudo += '<table class="table"><thead><tr><th>Data</th><th>Tipo</th><th>Quantidade</th><th>Motivo</th><th>Referência</th></tr></thead><tbody>';
            historico.forEach(mov => {
                conteudo += `<tr>
                    <td>${new Date(mov.data).toLocaleString('pt-BR')}</td>
                    <td>${mov.tipo}</td>
                    <td>${mov.quantidade}</td>
                    <td>${mov.motivo}</td>
                    <td>${mov.referencia || '-'}</td>
                </tr>`;
            });
            conteudo += '</tbody></table>';
        }

        // Criar modal temporário para histórico
        const modalTemp = document.createElement('div');
        modalTemp.className = 'modal active';
        modalTemp.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Histórico do Produto</h3>
                    <button class="btn-close">&times;</button>
                </div>
                <div style="padding: 20px; max-height: 600px; overflow-y: auto;">
                    ${conteudo}
                </div>
            </div>
        `;
        document.body.appendChild(modalTemp);

        modalTemp.querySelector('.btn-close').addEventListener('click', () => {
            modalTemp.remove();
        });
        modalTemp.addEventListener('click', (e) => {
            if (e.target === modalTemp) modalTemp.remove();
        });
    } catch (error) {
        console.error('Erro:', error);
        mostrarToast('Erro ao carregar histórico', 'error');
    }
}

// Deletar Produto
async function deletarProduto(produtoId) {
    if (!confirm(`Tem certeza que deseja deletar o produto ${produtoId}?`)) return;

    try {
        const response = await fetch(`${API_BASE_URL}/${produtoId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Erro ao deletar');

        mostrarToast('Produto deletado com sucesso!', 'success');
        await carregarDados();
    } catch (error) {
        console.error('Erro:', error);
        mostrarToast('Erro ao deletar produto', 'error');
    }
}

// Gerar Relatório
async function gerarRelatorio() {
    try {
        const response = await fetch(`${API_BASE_URL}/relatorio/geral`);
        if (!response.ok) throw new Error('Erro ao gerar relatório');

        const relatorio = await response.json();
        const tbody = document.getElementById('relatorio-table-body');

        tbody.innerHTML = relatorio.produtos.map(item => `
            <tr>
                <td>${item.produtoId}</td>
                <td>${item.quantidade}</td>
                <td>${item.minimo}</td>
                <td>${item.maximo}</td>
                <td>${getStatusBadge(item.status)}</td>
                <td>${new Date(item.dataAtualizacao).toLocaleString('pt-BR')}</td>
            </tr>
        `).join('');

        document.getElementById('relatorio-content').style.display = 'block';
        mostrarToast('Relatório gerado com sucesso!', 'success');
    } catch (error) {
        console.error('Erro:', error);
        mostrarToast('Erro ao gerar relatório', 'error');
    }
}

// Imprimir Relatório
function imprimirRelatorio() {
    window.print();
}

// Atualizar Alertas
function atualizarAlertas() {
    const container = document.getElementById('alertas-container');
    const alertas = [];

    estadoApp.estoque.forEach(item => {
        if (item.status === 'FORA_DE_ESTOQUE') {
            alertas.push({
                tipo: 'danger',
                titulo: `Sem Estoque: ${item.produtoId}`,
                mensagem: 'Reposição urgente necessária',
                nivel: 1
            });
        } else if (item.status === 'ESTOQUE_BAIXO') {
            alertas.push({
                tipo: 'warning',
                titulo: `Estoque Baixo: ${item.produtoId}`,
                mensagem: `Quantidade atual: ${item.quantidade}`,
                nivel: 2
            });
        }
    });

    if (alertas.length === 0) {
        container.innerHTML = '<div class="alert-info">✓ Tudo em ordem! Nenhum alerta no momento.</div>';
        return;
    }

    // Ordenar por nível de severidade
    alertas.sort((a, b) => a.nivel - b.nivel);

    container.innerHTML = alertas.map(alerta => `
        <div class="alert-item alert-${alerta.tipo}">
            <div class="alert-text">
                <strong>${alerta.titulo}</strong>
                <small>${alerta.mensagem}</small>
            </div>
        </div>
    `).join('');
}

// Update Clock
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR');
    document.getElementById('current-time').textContent = timeString;
}

// Toast Notification
function mostrarToast(mensagem, tipo = 'success') {
    toast.textContent = mensagem;
    toast.className = `toast show ${tipo}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
