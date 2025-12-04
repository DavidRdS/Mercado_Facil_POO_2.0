// URL da API
const API_URL = "http://localhost:3000/api/produtos";

// Função de formatar preço
function formatarPreco(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Função para criar o card do produto
const criarCardProduto = (produto) => {
    const card = document.createElement("div");
    card.className = "bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer";

    card.innerHTML = `
        <img src="${produto.url_imagem}" alt="${produto.nome}" class="w-full h-48 object-contain mb-4 rounded">
        <h3 class="text-lg font-semibold text-gray-800">${produto.nome}</h3>
        <p class="text-indigo-600 font-bold text-xl mt-2">${formatarPreco(produto.preco)}</p>

        <button 
            class="btn-comprar w-full bg-pink-600 hover:bg-pink-700 text-white py-3 mt-4 rounded-lg font-bold"
            data-id="${produto.id}"
        >
            Comprar Agora 🛒
        </button>
    `;

    // Evento do botão Comprar
    card.querySelector('.btn-comprar').addEventListener('click', (event) => {
        const produtoId = event.target.getAttribute('data-id');

        // Armazena o produto no localStorage
        localStorage.setItem("produtoSelecionado", JSON.stringify(produto));

        console.log(`Produto ${produto.nome} enviado para a página de pagamento.`);

        // 👉 CORREÇÃO IMPORTANTE AQUI:
        // Se o Live Server estiver aberto dentro da pasta frontendmercadofacil:
        window.location.href = "./pagamento.html";

        // Se estiver rodando na pasta raiz, use:
        // window.location.href = "./frontendmercadofacil/pagamento.html";
    });

    return card;
};

// Carregar produtos da API
async function carregarProdutos() {
    try {
        const resposta = await fetch(API_URL);
        const produtos = await resposta.json();

        const container = document.getElementById("produtos-lista");
        container.innerHTML = "";

        produtos.forEach(produto => {
            container.appendChild(criarCardProduto(produto));
        });

    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
        document.getElementById("produtos-lista").innerHTML =
            "<p class='text-red-600 text-lg'>Erro ao carregar produtos.</p>";
    }
}

// Inicia o carregamento
carregarProdutos();
