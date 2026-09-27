const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let aluno = null;
let arquivoFotoSelecionado = null;
bloquearAtributos(true);

async function carregarPlanos() {
    try {
        const resposta = await fetch(`${URL_API}/plano/listar`);
        const data = await resposta.json();

        const select = document.getElementById("selectPlano");
        select.innerHTML = '<option value="">Selecione um plano...</option>';

        if (data.sucesso) {
            for (let p of data.planos) {
                const option = document.createElement("option");
                option.value = p.id_plano;
                option.textContent = `${p.nome_plano} - R$ ${p.valor_mensal}`;
                select.appendChild(option);
            }
        }
    } catch (erro) {
        console.error("Erro ao carregar planos:", erro);
    }
}

async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/aluno/${chave}`);
        const data = await resposta.json();
        return data.sucesso ? data.aluno : null;
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

    aluno = await procurePorChavePrimaria(id_aluno);
    oQueEstaFazendo = '';

    if (aluno) {
        mostrarDadosAluno(aluno);
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
    document.getElementById("inputId_aluno").readOnly = true;
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

function previewImagem(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    arquivoFotoSelecionado = arquivo;

    const leitor = new FileReader();
    leitor.onload = (e) => {
        document.getElementById("imgAluno").src = e.target.result;
    };
    leitor.readAsDataURL(arquivo);
}

async function enviarFoto(id_aluno) {
    if (!arquivoFotoSelecionado) return;

    const formData = new FormData();
    formData.append('foto', arquivoFotoSelecionado);

    try {
        await fetch(`${URL_API}/aluno/upload/${id_aluno}`, { method: 'POST', body: formData });
        arquivoFotoSelecionado = null;
    } catch (erro) {
        console.error("Erro ao enviar foto:", erro);
    }
}

async function salvar() {
    const id_aluno = document.getElementById("inputId_aluno").value.trim();
    const nome_aluno = document.getElementById("inputNome_aluno").value;
    const id_plano = document.getElementById("selectPlano").value;

    const dadosAluno = { nome_aluno, id_plano: id_plano || null };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            const resp = await fetch(`${URL_API}/aluno`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosAluno) });
            const data = await resp.json();
            if (!data.sucesso) return mostrarAviso(data.mensagem);

            await enviarFoto(data.aluno.id_aluno);
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            const resp = await fetch(`${URL_API}/aluno/${id_aluno}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosAluno) });
            const data = await resp.json();
            if (!data.sucesso) return mostrarAviso(data.mensagem);

            await enviarFoto(id_aluno);
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            const resposta = await fetch(`${URL_API}/aluno/${id_aluno}`, { method: 'DELETE' });
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
        const resposta = await fetch(`${URL_API}/aluno/listar`);
        const data = await resposta.json();

        if (data.sucesso) {
            let texto = "";
            for (let linha of data.alunos) {
                texto += `<b>[${linha.id_aluno}]</b> ${linha.nome_aluno}<br>`;
            }
            document.getElementById("outputSaida").innerHTML = texto || "Nenhum aluno cadastrado.";
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

function mostrarDadosAluno(a) {
    document.getElementById("inputId_aluno").value = a.id_aluno;
    document.getElementById("inputNome_aluno").value = a.nome_aluno;
    document.getElementById("selectPlano").value = a.id_plano || "";

    const img = document.getElementById("imgAluno");
    img.src = a.foto_aluno
        ? `${URL_API}/imagens/${a.foto_aluno}`
        : "https://via.placeholder.com/300x300.png?text=Sem+Foto";

    bloquearAtributos(true);
}

function limparAtributos() {
    aluno = null;
    oQueEstaFazendo = '';
    arquivoFotoSelecionado = null;
    document.getElementById("inputNome_aluno").value = "";
    document.getElementById("selectPlano").value = "";
    document.getElementById("imgAluno").src = "https://via.placeholder.com/300x300.png?text=Sem+Foto";
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputId_aluno").readOnly = !soLeitura;
    document.getElementById("inputNome_aluno").readOnly = soLeitura;
    document.getElementById("selectPlano").disabled = soLeitura;
}

function visibilidadeDosBotoes(btP, btI, btA, btE, btS) {
    document.getElementById("btProcure").style.display = btP;
    document.getElementById("btInserir").style.display = btI;
    document.getElementById("btAlterar").style.display = btA;
    document.getElementById("btExcluir").style.display = btE;
    document.getElementById("btSalvar").style.display = btS;
    document.getElementById("btCancelar").style.display = btS;
}

carregarPlanos();