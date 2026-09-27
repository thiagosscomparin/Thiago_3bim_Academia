# Sistema Academia

Projeto acadêmico desenvolvido para a disciplina de DW1 (3º Bimestre), utilizando arquitetura MVC (Model-View-Controller) com Node.js, Express e PostgreSQL.

**Aluno:** Thiago da Silva Scomparin
**Turma:** M32 — Segundo Ano

## Sobre o projeto

Sistema de gestão de academia com 3 entidades:

- **Plano** — planos disponíveis (Mensal, Trimestral, etc.)
- **Aluno** — cadastro de alunos, com foto e vínculo a um plano
- **Ficha de Treino** — ficha exclusiva de cada aluno (objetivo e nível)

## Diagrama do Banco de Dados

```
┌──────────────────┐
│      plano        │
├──────────────────┤
│ id_plano (PK)      │
│ nome_plano         │
│ valor_mensal       │
└──────────────────┘
          │
          │ 1:N
          ▼
┌──────────────────┐
│      aluno         │
├──────────────────┤
│ id_aluno (PK)      │
│ nome_aluno         │
│ id_plano (FK)      │
│ foto_aluno         │
└──────────────────┘
          │
          │ 1:1
          ▼
┌──────────────────┐
│  ficha_treino      │
├──────────────────┤
│ id_ficha (PK)      │
│ id_aluno (FK,UNIQUE)│
│ objetivo           │
│ nivel              │
└──────────────────┘
```

## Estrutura do Projeto

```
backend/
  controllers/   → lógica de negócio de cada entidade
  routes/        → mapeamento dos endpoints da API
  database.js    → conexão com o PostgreSQL
  server.js      → inicialização do servidor Express
frontend/
  menu/          → página inicial
  plano/         → CRUD de planos
  aluno/         → CRUD de alunos (com upload de foto)
  ficha/         → CRUD de fichas de treino
imagens/         → fotos dos alunos enviadas via upload
schema.sql       → script de criação das tabelas e carga inicial
```

## Como executar

### 1. Pré-requisitos

- Node.js instalado
- PostgreSQL instalado e rodando

### 2. Instalar as dependências

```
npm install
```

### 3. Configurar o banco de dados

Crie um banco no PostgreSQL e rode o script `schema.sql` (via pgAdmin ou terminal) para criar as tabelas e inserir os dados iniciais.

### 4. Configurar o arquivo `.env`

Crie um arquivo `.env` dentro da pasta `backend/` com as seguintes variáveis:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nome_do_seu_banco
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
PORT=3001
```

### 5. Iniciar o servidor

```
npm run dev
```

O servidor sobe em `http://localhost:3001`.

### 6. Abrir o sistema

Abra o arquivo `index.html` no navegador (ou use uma extensão como Live Server).

## Endpoints da API

| Método | Rota                          | Descrição                     |
|--------|-------------------------------|--------------------------------|
| GET    | /plano/listar                 | Lista todos os planos          |
| GET    | /aluno/listar                 | Lista todos os alunos          |
| GET    | /ficha_treino/listar          | Lista todas as fichas          |
| GET    | /ficha_treino/aluno/:idAluno  | Busca a ficha de um aluno      |
| POST   | /aluno/upload/:id             | Envia a foto de um aluno       |