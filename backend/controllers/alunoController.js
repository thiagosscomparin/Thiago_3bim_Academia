const { query } = require('../database');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Listar todos os alunos
exports.listarAlunos = async (req, res) => {
    try {
        const result = await query('SELECT * FROM public.aluno ORDER BY id_aluno');
        res.json({ sucesso: true, alunos: result.rows });
    } catch (error) {
        console.error('Erro ao listar alunos:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar alunos.' });
    }
};

// Obter aluno por ID
exports.obterAluno = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' });
        }

        const result = await query('SELECT * FROM public.aluno WHERE id_aluno = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Aluno não encontrado.' });
        }

        res.json({ sucesso: true, aluno: result.rows[0] });
    } catch (error) {
        console.error('Erro ao obter aluno:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
    }
};

// Criar aluno
exports.criarAluno = async (req, res) => {
    try {
        const { nome_aluno, id_plano, foto_aluno } = req.body;

        if (!nome_aluno) {
            return res.status(400).json({ sucesso: false, mensagem: 'O nome do aluno é obrigatório.' });
        }

        const sql = `
            INSERT INTO public.aluno (nome_aluno, id_plano, foto_aluno)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

        const values = [
            nome_aluno,
            id_plano || null,
            foto_aluno || null
        ];

        const result = await query(sql, values);
        res.status(201).json({ sucesso: true, mensagem: 'Aluno inserido com sucesso!', aluno: result.rows[0] });
    } catch (error) {
        console.error('Erro ao criar aluno:', error);
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'O plano informado não existe no cadastro.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir aluno no banco de dados.' });
    }
};

// Atualizar aluno
exports.atualizarAluno = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { nome_aluno, id_plano } = req.body;

        const sql = `
            UPDATE public.aluno 
            SET nome_aluno = $1, 
                id_plano = $2
            WHERE id_aluno = $3
            RETURNING *
        `;

        const values = [
            nome_aluno,
            id_plano || null,
            id
        ];

        const result = await query(sql, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Aluno não encontrado.' });
        }

        res.json({ sucesso: true, mensagem: 'Aluno alterado com sucesso!', aluno: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar aluno:', error);
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'O plano informado não existe no cadastro.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar aluno.' });
    }
};

// Upload e salvamento de imagem com Sharp
exports.uploadImagem = async (req, res) => {
    try {
        const id = req.params.id;
        if (!req.file) {
            return res.status(400).json({ sucesso: false, mensagem: 'Nenhum arquivo enviado.' });
        }

        const pastaImagens = path.join(__dirname, '../../imagens');
        if (!fs.existsSync(pastaImagens)) {
            fs.mkdirSync(pastaImagens, { recursive: true });
        }

        const caminhoDestino = path.join(pastaImagens, `${id}.png`);

        // Processa e converte para PNG no tamanho ideal
        await sharp(req.file.buffer)
            .resize(300, 300, { fit: 'cover' })
            .toFormat('png')
            .toFile(caminhoDestino);

        // Salva o nome do arquivo no banco
        await query('UPDATE public.aluno SET foto_aluno = $1 WHERE id_aluno = $2', [`${id}.png`, id]);

        res.json({ sucesso: true, mensagem: 'Imagem salva com sucesso!' });
    } catch (error) {
        console.error('Erro ao salvar imagem:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao processar imagem.' });
    }
};

// Deletar aluno
exports.deletarAluno = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        await query('DELETE FROM public.aluno WHERE id_aluno = $1', [id]);

        const imgPath = path.join(__dirname, '../../imagens', `${id}.png`);
        if (fs.existsSync(imgPath)) {
            fs.unlinkSync(imgPath);
        }

        res.json({ sucesso: true, mensagem: 'Aluno excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar aluno:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir aluno.' });
    }
};