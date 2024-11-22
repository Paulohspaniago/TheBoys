async function listarMissoes(nome = '', nivelDificuldade = '', resultado = '') {
    try {
        const url = new URL('http://localhost:3000/api/missoes');
        
        if (nome) url.searchParams.append('nome', nome);
        if (nivelDificuldade) url.searchParams.append('nivel_dificuldade', nivelDificuldade);
        if (resultado) url.searchParams.append('resultado', resultado);
        
        const response = await fetch(url);
        const missoes = await response.json();

        const tabela = document.getElementById("tabela-missoes").getElementsByTagName("tbody")[0];

        tabela.innerHTML = "";

        missoes.forEach(missao => {
            const linha = tabela.insertRow();

            const dificuldade = missao.nivel_dificuldade.charAt(0).toUpperCase() + missao.nivel_dificuldade.slice(1);
            const resultadoFormatado = missao.resultado.charAt(0).toUpperCase() + missao.resultado.slice(1);

            linha.innerHTML = `
            <td id="btns-lista">
                <button class="btn-excluir" data-id="${missao.id_missao}">Excluir</button>
                <button class="btn-editar" data-id="${missao.id_missao}">Editar</button>
            </td>
            <td>${missao.nome_missao}</td>
            <td>${missao.descricao_missao}</td>
            <td>${missao.recompensa}</td>
            <td>${resultadoFormatado}</td>
            <td>${dificuldade}</td>
            `;
        });
    } catch (error) {
        console.error("Erro ao listar missões: ", error);
    }
}

// Busca personalizada
document.getElementById('btn-busca-missoes').addEventListener("click", () => {
    const nomeBusca = document.getElementById("input-nome-missao").value;
    const dificuldadeBusca = document.getElementById("input-dificuldade").value;
    const resultadoBusca = document.getElementById("input-resultado").value;

    listarMissoes(nomeBusca, dificuldadeBusca, resultadoBusca);
});

// Mostrar todas as missões
document.getElementById('btn-todas-missoes').addEventListener("click", () => {
    document.getElementById("input-nome-missao").value = "";
    document.getElementById("input-dificuldade").value = "";
    document.getElementById("input-resultado").value = "";

    listarMissoes();
});

// Exclusão de missão
document.getElementById("tabela-missoes").addEventListener("click", async (event) => {
    if (event.target && event.target.classList.contains("btn-excluir")) {
        const idMissao = event.target.getAttribute("data-id");
        const confirmar = confirm("Tem certeza que deseja excluir esta missão?");
        if (confirmar) {
            try {
                const response = await fetch(`http://localhost:3000/api/missoes/${idMissao}`, { method: "DELETE" });
                if (response.ok) {
                    alert("Missão deletada com sucesso.");
                    listarMissoes();
                } else {
                    alert("Erro ao excluir missão.");
                }
            } catch (error) {
                console.error("Erro ao excluir missão: ", error);
            }
        }
    }
});

// Edição de missão
document.getElementById("tabela-missoes").addEventListener("click", async (event) => {
    if (event.target && event.target.classList.contains("btn-editar")) {
        const idMissao = event.target.getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api/missoes/${idMissao}`);
            const missao = await response.json();

            document.getElementById("editar-id-missao").value = missao.id_missao;
            document.getElementById("editar-nome-missao").value = missao.nome_missao;
            document.getElementById("editar-descricao-missao").value = missao.descricao_missao;
            document.getElementById("editar-recompensa").value = missao.recompensa;
            document.getElementById("editar-resultado").value = missao.resultado.toLowerCase();
            document.getElementById("editar-nivel-dificuldade").value = missao.nivel_dificuldade.toLowerCase();

            document.getElementById("editar-missao-dialog").showModal();
        } catch (error) {
            console.error("Erro ao buscar dados da missão para edição: ", error);
        }
    }
});

// Salvar edição de missão
document.getElementById("salvar-edicao-missao").addEventListener("click", async () => {
    const idMissao = document.getElementById("editar-id-missao").value;

    const missaoAtualizada = {
        nome_missao: document.getElementById("editar-nome-missao").value,
        descricao_missao: document.getElementById("editar-descricao-missao").value,
        recompensa: document.getElementById("editar-recompensa").value,
        resultado: document.getElementById("editar-resultado").value,
        nivel_dificuldade: document.getElementById("editar-nivel-dificuldade").value,
    };

    try {
        const response = await fetch(`http://localhost:3000/api/missoes/${idMissao}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(missaoAtualizada),
        });

        if (response.ok) {
            alert("Missão atualizada com sucesso.");
            document.getElementById("editar-missao-dialog").close();
            listarMissoes();
        } else {
            alert("Erro ao atualizar missão");
        }
    } catch (error) {
        console.error("Erro ao atualizar missão: ", error);
    }
});

// Fechar modal de edição
document.getElementById("btn-sair-edicao-missao").addEventListener("click", () => {
    document.getElementById("editar-missao-dialog").close();
});

// Carregar missões ao carregar a página
document.addEventListener("DOMContentLoaded", () => listarMissoes());
