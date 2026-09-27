const { query } = require('../database');

// Listar todos os planos
exports.listarPlanos = async (req, res) => {
    try {
        const result = await query('SELECT * FROM public.plano ORDER BY id_plano');
        res.json({ sucesso: true, planos: result.rows });
    } catch (error) {
        console.error('Erro ao listar planos:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar planos.' });
    }
};

// Obter plano por ID
exports.obterPlano = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' });
        }

        const result = await query('SELECT * FROM public.plano WHERE id_plano = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Plano não encontrado.' });
        }

        res.json({ sucesso: true, plano: result.rows[0] });
    } catch (error) {
        console.error('Erro ao obter plano:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
    }
};

// Criar plano
exports.criarPlano = async (req, res) => {
    try {
        const { nome_plano, valor_mensal } = req.body;

        if (!nome_plano) {
            return res.status(400).json({ sucesso: false, mensagem: 'O nome do plano é obrigatório.' });
        }

        const sql = `
            INSERT INTO public.plano (nome_plano, valor_mensal)
            VALUES ($1, $2)
            RETURNING *
        `;

        const values = [nome_plano, valor_mensal || 0.0];

        const result = await query(sql, values);
        res.status(201).json({ sucesso: true, mensagem: 'Plano inserido com sucesso!', plano: result.rows[0] });
    } catch (error) {
        console.error('Erro ao criar plano:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir plano no banco de dados.' });
    }
};

// Atualizar plano
exports.atualizarPlano = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { nome_plano, valor_mensal } = req.body;

        const sql = `
            UPDATE public.plano 
            SET nome_plano = $1, 
                valor_mensal = $2 
            WHERE id_plano = $3
            RETURNING *
        `;

        const values = [nome_plano, valor_mensal || 0.0, id];

        const result = await query(sql, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Plano não encontrado.' });
        }

        res.json({ sucesso: true, mensagem: 'Plano alterado com sucesso!', plano: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar plano:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar plano.' });
    }
};

// Deletar plano
exports.deletarPlano = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        await query('DELETE FROM public.plano WHERE id_plano = $1', [id]);

        res.json({ sucesso: true, mensagem: 'Plano excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar plano:', error);
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'Não é possível excluir: existem alunos associados a este plano.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir plano.' });
    }
}; 