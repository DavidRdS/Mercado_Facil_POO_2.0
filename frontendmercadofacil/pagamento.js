const params = new URLSearchParams(window.location.search);
const produtoId = params.get("id");

let produto;

// Busca dados da API
async function carregarProduto() {
    const response = await fetch(`http://localhost:3000/api/produtos/${produtoId}`);
    produto = await response.json();

    document.getElementById("produto-img").src = produto.url_imagem;
    document.getElementById("produto-nome").textContent = produto.nome;
    document.getElementById("produto-preco").textContent = `R$ ${produto.preco.toFixed(2)}`;
    document.getElementById("valor-total").textContent = `R$ ${produto.preco.toFixed(2)}`;
}

carregarProduto();

// Envia pedido
document.getElementById("formPagamento").addEventListener("submit", async (e) => {
    e.preventDefault();

    const pedido = {
        produtoId,
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        endereco: document.getElementById("endereco").value,
        valor: produto.preco
    };

    const response = await fetch("http://localhost:3000/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido)
    });

    if (response.ok) {
        window.location.href = "confirmacao.html";
    } else {
        alert("Erro ao finalizar o pagamento.");
    }
});
