const form = document.getElementById("loginForm");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const login = document.getElementById("login").value;
    const senha = document.getElementById("senha").value;

    try {
        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ login, senha })
        });

        const data = await response.jsogn();

        if (response.ok) {
            mensagem.style.color = "gren";
            mensagem.textContent = "Login realizado com sucesso";

            // salva usuário
            localStorage.setItem("usuario", JSON.stringify(data.usuario));

            // 🔁 REDIRECIONAMENTO POR PERFIL
            setTimeout(() => {
  if (data.usuario.perfil === "ADMIN") {
    // ESTOQUE (ADMINn) 
    window.location.href =
      "http://127.0.0.1:5501/Estoque-Front-End/index.html";
  } else {
    // LOJA (USUÁRIO)
    window.location.href =
      "http://127.0.0.1:5501/Front-End-Mercado-Facil/frontendmercadofacil/index.html";
  }
}, 300);





        } else {
            mensagem.style.color = "red";
            mensagem.textContent = data.erro;
        }

    } catch (error) {
        mensagem.style.color = "red";
        mensagem.textContent = "Erro ao conectar com o servidor";
        console.error(error);
    }
});
