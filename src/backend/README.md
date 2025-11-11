# backend

Neste diretorio estão os arquivos do backend da aplicação.

O backend do projeto foi desenvolvido utilizando as seguintes tecnologias:

- Express.js: Framework responsável pelos endpoints da API.
- Zod: Biblioteca responsavel pela validação de objetos.
- Drizzle ORM: Biblioteca auxiliar para conexão à base de dados.
- Bun: Runtime TypesCript

<!--

Chalk: Colorir texto do terminal
eslint: Linter de JavaScript + TypeScript

-->

## Instruções

> ![IMPORTANT]
>
> O backend foi desenvolvido utilizando o run "Bun" devido a possibilidade de rodar TypesScript nativamente, portanto é recomendado a utilização do mesmo.
>
> É possível rodar o projeto utilizando o Node.js, entretanto é necessário utilizar o tsc para transpilar o código.

Para rodar o projeto, siga os procedimentos:

1 - Instalar o bun: <https://bun.com/docs/installation>

2 - Instalar as dependências do projeto

```sh
# Obs: Verificar se está corretamente no diretorio /src/backend/
bun install
````

3 - Adicionar as configurações de ambiente

```sh
# Copiar o arquivo example.env para .env (Pode ser feito manualmente)
cp example.env .env

# Editar o arquivo .env caso necessário
code .env # Editar com VSCode
nvim .env # Editar com neovim
```

4 -  Aplicar ou inicializar a estrutura da base de dados

```sh
bun run db:push
```

5 -  Rodar o backend

```sh
bun run dev
```

## Desenvolvimento

Caso haja alterações no esquema/schema da base de dados (`src/db/schema.ts`), é necessário realizar a migração dos dados:

```sh
# Aplica o esquema na base de dados
bun run push
```

Caso haja erros na execução do comando anterior devido a conflitos de esquema, é necessário realizar a seguinte migração:

```sh
# Gera migrações para a base de dados em caso de mudanças
bun run db:generate

# Aplica as migrações geradas na base de dados existente
bun run db:migrate
```
