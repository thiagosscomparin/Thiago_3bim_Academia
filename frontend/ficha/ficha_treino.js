const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let ficha = null;
bloquearAtributos(true);

async function procurePorAluno(idAluno) {
    try {
        const resposta = await fetch(`${URL_API}/ficha_treino/aluno/${idAluno}`);
        const data = await resposta.json();
        return data.sucesso ? data.ficha : null;
    } catch (erro) {
        return null;
    }
}

async function procure() {
    const id_aluno = document.getElementById("inputId_aluno").value.trim();
    if (!id_aluno) {
        mostrarAviso("Informe o ID do aluno pra procurar.");
        return;
    }

    ficha = await procurePorAluno(id_aluno);
    oQueEstaFazendo = '';

    if (ficha) {
        mostrarDadosFicha(ficha);
        visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none');
        mostrarAviso("Achou ficha para este aluno, pode alterar ou excluir");
    } else {
        limparAtributos();
        visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
        mostrarAviso("Este aluno ainda não tem ficha, pode inserir");
    }
}

function inserir() {
    bloquearAtributos(false);
    document.getElementById("inputId_aluno").readOnly = true;
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Preencha o objetivo e o nível e clique em salvar");
}

function alterar() {
    bloquearAtributos(false);
    document.getElementById("inputId_aluno").readOnly = true;
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Altere os dados e clique em salvar");
}

function excluir() {
    bloquearAtributos(true);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - Clique em salvar para confirmar a exclusão");
}

async function salvar() {
    const id_aluno = document.getElementById("inputId_aluno").value.trim();
    const objetivo = document.getElementById("inputObjetivo").value;
    const nivel = document.getElementById("selectNivel").value;

    const dadosFicha = { id_aluno, objetivo, nivel };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            const resp = await fetch(`${URL_API}/ficha_treino`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosFicha) });
            const data = await resp.json();
            if (!data.sucesso) return mostrarAviso(data.mensagem);
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            const resp = await fetch(`${URL_API}/ficha_treino/${ficha.id_ficha}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosFicha) });
            const data = await resp.json();
            if (!data.sucesso) return mostrarAviso(data.mensagem);
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            const resposta = await fetch(`${URL_API}/ficha_treino/${ficha.id_ficha}`, { method: 'DELETE' });
            const data = await resposta.json();
            if (!data.sucesso) {
                mostrarAviso(data.mensagem || "Erro ao excluir no servidor.");
                return;
            }
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("inputId_aluno").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/ficha_treino/listar`);
        const data = await resposta.json();

        if (data.sucesso) {
            let texto = "";
            for (let linha of data.fichas) {
                texto += `<b>Aluno [${linha.id_aluno}]</b> — ${linha.objetivo} (${linha.nivel})<br>`;
            }
            document.getElementById("outputSaida").innerHTML = texto || "Nenhuma ficha cadastrada.";
        } else {
            document.getElementById("outputSaida").innerHTML = `Erro no banco: ${data.mensagem}`;
        }
    } catch (erro) {
        console.error("Erro ao listar:", erro);
        document.getElementById("outputSaida").innerHTML = "Servidor offline ou erro de conexão (CORS).";
    }
}

function cancelarOperacao() {
    limparAtributos();
    bloquearAtributos(true);
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    mostrarAviso("Cancelou a operação");
}

function mostrarAviso(mensagem) {
    document.getElementById("divAviso").innerHTML = mensagem;
}

function mostrarDadosFicha(f) {
    document.getElementById("inputId_aluno").value = f.id_aluno;
    document.getElementById("inputObjetivo").value = f.objetivo;
    document.getElementById("selectNivel").value = f.nivel;
    bloquearAtributos(true);
}

function limparAtributos() {
    ficha = null;
    oQueEstaFazendo = '';
    document.getElementById("inputObjetivo").value = "";
    document.getElementById("selectNivel").value = "";
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputId_aluno").readOnly = !soLeitura;
    document.getElementById("inputObjetivo").readOnly = soLeitura;
    document.getElementById("selectNivel").disabled = soLeitura;
}

function visibilidadeDosBotoes(btP, btI, btA, btE, btS) {
    document.getElementById("btProcure").style.display = btP;
    document.getElementById("btInserir").style.display = btI;
    document.getElementById("btAlterar").style.display = btA;
    document.getElementById("btExcluir").style.display = btE;
    document.getElementById("btSalvar").style.display = btS;
    document.getElementById("btCancelar").style.display = btS;
}