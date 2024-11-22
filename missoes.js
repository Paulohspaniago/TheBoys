const dialogCadastrarMissao = document.getElementById("dialog-cadastrar-missao");
const btnCadastrarMissao = document.getElementById("btn-cadastrar-missao");

// Abrir o modal de cadastro de missões
btnCadastrarMissao.addEventListener("click", () => {
    dialogCadastrarMissao.showModal();
});

const btnFecharCadastro = document.getElementById("btn-dialog-cadastrar-fechar");
btnFecharCadastro.addEventListener("click", () => {
    dialogCadastrarMissao.close();
});

// Botão de cadastro de missões
const btnDialogCadastrarMissao = document.getElementById("btn-dialog-cadastrar-missao");
btnDialogCadastrarMissao.addEventListener("click", async () => {
    const confirmar = confirm("Tem certeza que deseja cadastrar esta missão?");

    if (confirmar) {
        const nomeMissao = document.getElementById("nome-missao").value;
        const descricaoMissao = document.getElementById("descricao-missao").value;
        const recompensa = document.getElementById("recompensa-missao").value;
        const resultado = document.getElementById("resultado-missao").value;
        const nivelDificuldade = document.getElementById("nivel-dificuldade").value;

        try {
            const response = await fetch("http://localhost:3000/api/missoes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome_missao: nomeMissao,
                    descricao_missao: descricaoMissao,
                    recompensa: recompensa,
                    resultado: resultado,
                    nivel_dificuldade: nivelDificuldade
                }),
            });

            if (response.ok) {
                alert("Missão cadastrada com sucesso.");
                
                nomeMissao = "";
                descricaoMissao = "";
                recompensa = "";
                resultado = "";
                nivelDificuldade = "";
    
                listarMissoes();
            } else {
                alert("Erro ao cadastrar missão");
            }
        } catch (error) {
            console.error("Erro ao cadastrar missão: ", error);
        }
    }
});

// Função para listar missões
async function listarMissoes() {
    try {
        const response = await fetch("http://localhost:3000/api/missoes");
        if (!response.ok) {
            throw new Error("Erro ao buscar as missões");
        }

        const missoes = await response.json();
        const missoesContainer = document.getElementById("missoes-container");
        missoesContainer.innerHTML = ""; // Limpar o container

        if (missoes.length === 0) {
            missoesContainer.innerHTML = "<p>Nenhuma missão cadastrada.</p>";
            return;
        }

        missoes.forEach(missao => {
            const missaoElement = document.createElement("div");
            missaoElement.classList.add("missao-item");
            missaoElement.innerHTML = `
                <h3>${missao.nome_missao}</h3>
                <p>${missao.descricao_missao}</p>
                <p><strong>Recompensa:</strong> ${missao.recompensa}</p>
                <p><strong>Resultado:</strong> ${missao.resultado}</p>
                <p><strong>Nível de dificuldade:</strong> ${missao.nivel_dificuldade}</p>
            `;
            missoesContainer.appendChild(missaoElement);
        });
    } catch (error) {
        console.error("Erro ao listar missões: ", error);
        const missoesContainer = document.getElementById("missoes-container");
        missoesContainer.innerHTML = "<p>Erro ao carregar missões. Tente novamente mais tarde.</p>";
    }
}

// Botão para exibir missões
const btnMostrarMissoes = document.getElementById("btn-mostrar-missoes");
btnMostrarMissoes.addEventListener("click", listarMissoes);

// Carregar missões ao iniciar
document.addEventListener("DOMContentLoaded", listarMissoes);
