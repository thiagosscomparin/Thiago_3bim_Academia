
-- ==============================================================================
-- Projeto: Sistema de Academia
-- Arquivo DDL + Carga Inicial (CREATE TABLE + INSERT INTO)
-- Tabelas: plano (independente), aluno (1:N com plano), ficha_treino (1:1 com aluno)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- Tabela independente: plano
-- ------------------------------------------------------------------------------
CREATE TABLE public.plano (
    id_plano SERIAL PRIMARY KEY,
    nome_plano VARCHAR(100) NOT NULL,
    valor_mensal NUMERIC(10, 2) NOT NULL
);

-- ------------------------------------------------------------------------------
-- Tabela com relacionamento 1:N (um plano pode ter vários alunos)
-- ------------------------------------------------------------------------------
CREATE TABLE public.aluno (
    id_aluno SERIAL PRIMARY KEY,
    nome_aluno VARCHAR(150) NOT NULL,
    id_plano INTEGER NOT NULL,
    foto_aluno VARCHAR(255),
    CONSTRAINT fk_aluno_plano FOREIGN KEY (id_plano)
        REFERENCES public.plano (id_plano)
        ON DELETE RESTRICT
);

-- ------------------------------------------------------------------------------
-- Tabela com relacionamento 1:1 (cada aluno tem uma única ficha de treino)
-- ------------------------------------------------------------------------------
CREATE TABLE public.ficha_treino (
    id_ficha SERIAL PRIMARY KEY,
    id_aluno INTEGER NOT NULL UNIQUE,
    objetivo VARCHAR(100) NOT NULL,
    nivel VARCHAR(20) NOT NULL,
    CONSTRAINT fk_ficha_aluno FOREIGN KEY (id_aluno)
        REFERENCES public.aluno (id_aluno)
        ON DELETE CASCADE
);

-- ==============================================================================
-- CARGA INICIAL - plano (10 registros)
-- ==============================================================================
INSERT INTO public.plano (nome_plano, valor_mensal) VALUES
('Mensal', 120.00),
('Trimestral', 100.00),
('Semestral', 90.00),
('Anual', 80.00),
('Mensal Fit', 130.00),
('Mensal Premium', 180.00),
('Dia Avulso', 25.00),
('Estudante', 95.00),
('Terceira Idade', 70.00),
('Corporativo', 85.00);

-- ==============================================================================
-- CARGA INICIAL - aluno (10 registros)
-- ==============================================================================
INSERT INTO public.aluno (nome_aluno, id_plano, foto_aluno) VALUES
('Ana Beatriz Souza', 1, '1.png'),
('Bruno Carvalho Lima', 2, '2.png'),
('Camila Ferreira Dias', 3, '3.png'),
('Diego Almeida Rocha', 4, '4.png'),
('Eduarda Martins Silva', 5, '5.png'),
('Felipe Nogueira Costa', 6, '6.png'),
('Gabriela Ramos Pinto', 7, '7.png'),
('Henrique Barbosa Melo', 8, '8.png'),
('Isabela Cardoso Teixeira', 9, '9.png'),
('João Pedro Azevedo', 10, '10.png');

-- ==============================================================================
-- CARGA INICIAL - ficha_treino (10 registros, um por aluno)
-- ==============================================================================
INSERT INTO public.ficha_treino (id_aluno, objetivo, nivel) VALUES
(1, 'Hipertrofia', 'Intermediário'),
(2, 'Emagrecimento', 'Iniciante'),
(3, 'Condicionamento físico', 'Avançado'),
(4, 'Hipertrofia', 'Avançado'),
(5, 'Emagrecimento', 'Intermediário'),
(6, 'Definição muscular', 'Intermediário'),
(7, 'Condicionamento físico', 'Iniciante'),
(8, 'Hipertrofia', 'Iniciante'),
(9, 'Reabilitação', 'Iniciante'),
(10, 'Definição muscular', 'Avançado');