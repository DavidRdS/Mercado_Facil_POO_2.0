async function carregarProdutos() {
    const response = await fetch("http://localhost:3000/api/produtos");
    const produtos = await response.json();

    const container = document.getElementById("lista-produtos");

    produtos.forEach(produto => {
        const card = document.createElement("div");
        card.className = "bg-white shadow-lg rounded-xl p-4 text-center";

        card.innerHTML = `
            <img src="${produto.url_imagem}" class="w-40 h-40 mx-auto">
            <h2 class="text-lg font-semibold mt-2">${produto.nome}</h2>
            <p class="text-indigo-600 text-xl font-bold mt-1">R$ ${produto.preco.toFixed(2)}</p>
            <button data-id="${produto.id}" class="btn-comprar mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                Comprar
            </button>
        `;

        container.appendChild(card);
    });

    document.querySelectorAll(".btn-comprar").forEach(btn => {
        btn.addEventListener("click", e => {
            const id = e.target.getAttribute("data-id");
            window.location.href = `pagamento.html?id=${id}`;
        });
    });
}

carregarProdutos();
