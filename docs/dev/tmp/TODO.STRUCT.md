# Estrutura do Repositório

```txt
docs/
docs/dev/data/dataModel.toml -> database model
docs/dev/TECHDEBT.md -> TODO, INFO, DEBUG, ...
docs/dev/
docs/blob/
src/
.gitignore
CITATION.cff
```

<!--

## Estrutura do diretório

Todos os arquivos referente ao site são inseridos dentro da pasta "src". Dentro desta pasta irá conter as pastas referentes a paginas do site e dentro de cada uma dessas haverá um arquivo index.html e styles.css.

```txt
📁 src
├── 📁 .template
│  ├── 📄 index.html
│  ├── 🎨 styles.css
│  └── 🚀 script.js
├── 📁 static
│  ├── 🖼️ logo.png
│  ├── 🖼️ icone_instagram.svg
│  └── 🖼️ foto_generica.jpeg
├── 📁 login
│  ├── 📄 index.html
│  ├── 🎨 styles.css
│  └── 🚀 script.js
├── 📁 perfil
│  ├── 📄 index.html
│  ├── 🎨 styles.css
│  └── 🚀 script.js
├── 📄 index.html
├── 🎨 styles.css
└── 🚀 script.js
```

Há uma pasta chamada `src/.template/`, nela haverá arquivos HTML, CSS e JavaScript modelos para criar as paginas. Elas serão utilizadas para reservar espaços como cabeçalho e rodapé ou estilos pré definidos.

Os arquivos de imagem devem ficar todos na pasta `src/static/` e ao utilizar as imagens no HTML, colocar como abaixo:

```html
<!-- Para arquivos que estão em sub-pastas dentro da pasta src _->
<!-- Como exemplo: src/login/index.html _->
<img src="../static/imagem.png" >

<!-- Para arquivos dentro da pasta src _->
<!-- Como exemplo: src/index.html _->
<img src="static/imagem.png" >
```

-->

<!--
TODO: ## Estrutura do HTML e CSS
-->