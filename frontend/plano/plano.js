const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let plano = null;
bloquearAtributos(true);

async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/plano/${chave}`);
        const data = await resposta.json();
        return data.sucesso ? data.plano : null;
    } catch (erro) {
        return null;
    }
}

async function procure() {
    const id_plano = document.getElementById("inputId_plano").value.trim();
    if (!id_plano) {
        mostrarAviso("Informe o ID do plano pra procurar.");
        return;
    }

    plano = await procurePorChavePrimaria(id_plano);
    oQueEstaFazendo = '';

    if (plano) {
        mostrarDadosPlano(plano);
        visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none');
        mostrarAviso("Achou no banco, pode alterar ou excluir");
    } else {
        limparAtributos();
        visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
        mostrarAviso("Não achou no banco, pode inserir");
    }
}

function inserir() {
    bloquearAtributos(false);
    document.getElementById("inputId_plano").readOnly = true;
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Preencha os dados e clique em salvar");
}

function alterar() {
    bloquearAtributos(false);
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
    const id_plano = document.getElementById("inputId_plano").value.trim();
    const nome_plano = document.getElementById("inputNome_plano").value;
    const valor_mensal = document.getElementById("inputValor_mensal").value;

    const dadosPlano = { nome_plano, valor_mensal };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            const resp = await fetch(`${URL_API}/plano`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosPlano) });
            const data = await resp.json();
            if (!data.sucesso) return mostrarAviso(data.mensagem);
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            const resp = await fetch(`${URL_API}/plano/${id_plano}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosPlano) });
            const data = await resp.json();
            if (!data.sucesso) return mostrarAviso(data.mensagem);
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            const resposta = await fetch(`${URL_API}/plano/${id_plano}`, { method: 'DELETE' });
            const data = await resposta.json();
            if (!data.sucesso) {
                mostrarAviso(data.mensagem || "Erro ao excluir no servidor.");
                return;
            }
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("inputId_plano").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/plano/listar`);
        const data = await resposta.json();

        if (data.sucesso) {
            let texto = "";
            for (let linha of data.planos) {
                texto += `<b>[${linha.id_plano}]</b> ${linha.nome_plano} — R$ ${linha.valor_mensal}<br>`;
            }
            document.getElementById("outputSaida").innerHTML = texto || "Nenhum plano cadastrado.";
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

function mostrarDadosPlano(p) {
    document.getElementById("inputId_plano").value = p.id_plano;
    document.getElementById("inputNome_plano").value = p.nome_plano;
    document.getElementById("inputValor_mensal").value = p.valor_mensal;
    bloquearAtributos(true);
}

function limparAtributos() {
    plano = null;
    oQueEstaFazendo = '';
    document.getElementById("inputNome_plano").value = "";
    document.getElementById("inputValor_mensal").value = "";
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputId_plano").readOnly = !soLeitura;
    document.getElementById("inputNome_plano").readOnly = soLeitura;
    document.getElementById("inputValor_mensal").readOnly = soLeitura;
}

function visibilidadeDosBotoes(btP, btI, btA, btE, btS) {
    document.getElementById("btProcure").style.display = btP;
    document.getElementById("btInserir").style.display = btI;
    document.getElementById("btAlterar").style.display = btA;
    document.getElementById("btExcluir").style.display = btE;
    document.getElementById("btSalvar").style.display = btS;
    document.getElementById("btCancelar").style.display = btS;
}