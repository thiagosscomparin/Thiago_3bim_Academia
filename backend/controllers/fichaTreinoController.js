const { query } = require('../database');

// Listar todas as fichas de treino
exports.listarFichasTreino = async (req, res) => {
    try {
        const result = await query('SELECT * FROM public.ficha_treino ORDER BY id_ficha');
        res.json({ sucesso: true, fichas: result.rows });
    } catch (error) {
        console.error('Erro ao listar fichas de treino:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar fichas de treino.' });
    }
};

// Obter ficha de treino por ID
exports.obterFichaTreino = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' });
        }

        const result = await query('SELECT * FROM public.ficha_treino WHERE id_ficha = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Ficha de treino não encontrada.' });
        }

        res.json({ sucesso: true, ficha: result.rows[0] });
    } catch (error) {
        console.error('Erro ao obter ficha de treino:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
    }
};

// Obter ficha de treino pelo ID do aluno (útil pro relacionamento 1:1)
exports.obterFichaPorAluno = async (req, res) => {
    try {
        const idAluno = parseInt(req.params.idAluno, 10);
        if (isNaN(idAluno)) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID de aluno inválido.' });
        }

        const result = await query('SELECT * FROM public.ficha_treino WHERE id_aluno = $1', [idAluno]);
        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Este aluno ainda não possui ficha de treino.' });
        }

        res.json({ sucesso: true, ficha: result.rows[0] });
    } catch (error) {
        console.error('Erro ao obter ficha de treino por aluno:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
    }
};

// Criar ficha de treino
exports.criarFichaTreino = async (req, res) => {
    try {
        const { id_aluno, objetivo, nivel } = req.body;

        if (!id_aluno || !objetivo || !nivel) {
            return res.status(400).json({ sucesso: false, mensagem: 'Aluno, objetivo e nível são obrigatórios.' });
        }

        const sql = `
            INSERT INTO public.ficha_treino (id_aluno, objetivo, nivel)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

        const values = [id_aluno, objetivo, nivel];

        const result = await query(sql, values);
        res.status(201).json({ sucesso: true, mensagem: 'Ficha de treino inserida com sucesso!', ficha: result.rows[0] });
    } catch (error) {
        console.error('Erro ao criar ficha de treino:', error);
        if (error.code === '23505') {
            return res.status(400).json({ sucesso: false, mensagem: 'Este aluno já possui uma ficha de treino.' });
        }
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'O aluno informado não existe no cadastro.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir ficha de treino no banco de dados.' });
    }
};

// Atualizar ficha de treino
exports.atualizarFichaTreino = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { objetivo, nivel } = req.body;

        const sql = `
            UPDATE public.ficha_treino 
            SET objetivo = $1, 
                nivel = $2 
            WHERE id_ficha = $3
            RETURNING *
        `;

        const values = [objetivo, nivel, id];

        const result = await query(sql, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Ficha de treino não encontrada.' });
        }

        res.json({ sucesso: true, mensagem: 'Ficha de treino alterada com sucesso!', ficha: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar ficha de treino:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar ficha de treino.' });
    }
};

// Deletar ficha de treino
exports.deletarFichaTreino = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        await query('DELETE FROM public.ficha_treino WHERE id_ficha = $1', [id]);

        res.json({ sucesso: true, mensagem: 'Ficha de treino excluída com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar ficha de treino:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir ficha de treino.' });
    }
};