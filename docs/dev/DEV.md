# Ambiente de Desenvolvimento

## VSCode

Para garantir a melhor experiência e consistência de código, é recomendado a utilização das seguintes extensões do VS Code:

### Essencial

- [Vue.volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - Completação de código para Vue.js.
- [sdras.vue-vscode-snippets](https://marketplace.visualstudio.com/items?itemName=sdras.vue-vscode-snippets) - Snippets de código para Vue.js.
- [bradlc.vscode-tailwindcss](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - Completação de código para tailwindcss.

### Recomendado

- [formulahendry.auto-rename-tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag) - Renomeia inicio e fechamento de tags html automaticamente.
- [EditorConfig.EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) - Adiciona as configurações de formatação do projeto (arquivo .editorconfig ) no VSCode.
- [esbenp.prettier-vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Adiciona outras configurações de formatação do projeto (arquivo .prettierrc.json) no VSCode.
- [tamasfe.even-better-toml](https://marketplace.visualstudio.com/items?itemName=tamasfe.even-better-toml) - Adiciona formatação de arquivos .toml.
- [dbaeumer.vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - Adiciona informações do eslint (Verificação de errors e regras/estrutura do código).

### Opcionais

- [bierner.github-markdown-preview](https://marketplace.visualstudio.com/items?itemName=bierner.github-markdown-preview) - Adiciona formatação de arquivos .md no estilo do Github.
- [streetsidesoftware.code-spell-checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) - Adiciona um corretor ortografico.
- [streetsidesoftware.code-spell-checker-portuguese-brazilian](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker-portuguese-brazilian) - Adiciona a lingua portuguesa no corretor ortografico (prescisa de configuração).
- [Gruntfuggly.todo-tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree) - Mostra todos os "TODO"s no código.

- [ecmel.vscode-html-css](https://marketplace.visualstudio.com/items?itemName=ecmel.vscode-html-css) - Adiciona alguns snippets de código html,css.
- [HTMLHint.vscode-htmlhint](https://marketplace.visualstudio.com/items?itemName=HTMLHint.vscode-htmlhint) - Adiciona alguns snippets de código html,css
xabikos.JavaScriptSnippets Adiciona alguns snippets de código js.

## Git e GitHub

- Para o desenvolvimento do projeto, é obrigatório o uso do git, se houver dúvidas, sempre entrar em contato com o Scrum Master ou o Project Owner.
- Evitar enviar tudo em um so commit, se tudo for feito de uma vez, fica difícil identificar o que foi realizado ou alterado.

> É melhor que haja vários commits, mesmo que com poucas alterações e o que você esteja fazendo não tenha ficado pronto. É pra isso que servem as branches, você desenvolve tudo nela sem alterar o funcionamento do projeto, e quando essa feature estiver pronto, todo o código feito nela é revisado e unido a branch principal (main/master).

### Branches

- Nunca utilizar a main/master para desenvolver features.
- Utilizar a main/master apenas se foram alterações simples com poucas linhas.

O desenvolvimento em branches funciona da seguinte forma: Suponhamos que será desenvolvido a tela de perfil do usuário, primeiramente, em um terminal criamos uma branch separada e alternamos para ela:

<!-- TODO: Colocar prints ou GIFs do vscode para auxiliar -->

```shell
# Para criar a branch, utilizar `git branch`
git branch feature-tela-perfil

# para alternar para branch
git checkout feature-tela-perfil

# confirma que estamos na branch feature-tela-perfil
git status
```

Caso necessário, pode utilizar o nome pessoal para nomear a branch como `dev-fulano`, mas pessoalmente eu procuraria outras alternativas pois é importante que o nome da branch seja algo descritivo sobre o que você esta desenvolvendo nela.

Exemplos de branches recomendadas:

```shell
# desenvolver tela de perfil
feature-tela-perfil
dev-tela-perfil
# resolver bug no login
fix-login
```

Após alternar para branch `feature-tela-perfil`, desenvolver o código necessário dentro dela criando commits a cada alterações conforme necessário.

> [!NOTE]
> É importante que as alterações sejam realizadas referente a feature que você esta desenvolvendo:
>
> Viu um erro em outro arquivo que esta fora do escopo da branch (por exemplo na tela de login)? Você pode:
>
> - Opção 1: Criar uma 3º branch separada e realizar um commit com **APENAS** as alterações feitas para resolver esse erro.
> - Opção 2: Informar ao Scrum Master ou o Project Owner.
> - Opção 3: Deixar pra resolver após finalizar a branch.

Também é importante que as suas alterações não causem problemas em outras partes do código, por exemplo remover uma imagem que esta sendo utilizada por outra tela ou recurso do site.

### Pull Request

Sempre que terminar uma feature ou um fix, abrir um terminal e envie a branch para o github:

<!-- TODO: Colocar prints ou GIFs do vscode para auxiliar -->

```shell
git pull origin nome-da-branch
```

<!-- TODO: Colocar prints do github para ilustrar -->
Após enviar a branch, crie um "Pull Request", isto é, uma solicitação para unir o código que esta na branch enviada com a branch principal, aqui, será realizado a revisão de todo o código para ter certeza que tudo esta funcionando corretamente.
