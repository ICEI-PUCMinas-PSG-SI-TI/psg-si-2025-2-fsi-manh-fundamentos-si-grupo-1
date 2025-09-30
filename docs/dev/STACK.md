# Stack

No último projeto, devido a ementa de introdução a HTML, CSS e JavaScript, o plano de ensino não permitia a utilização de frameworks ou bibliotecas entre outros para o desenvolvimento. Nesse projeto, os conhecimentos estão sendo avançados, porém gradualmente, portanto algumas tecnologias utilizadas para esse STACK podem não os mais robustos mas conversam melhor com os do projeto anterior.

## Divisão de Recursos

Como já explicado, o primeiro trabalho interdisciplinar utilizou o `json-server` para todas as funções (servir arquivos, base de dados) e toda a lógica de negocio era realizada no navegador, isso ocasiona em uma falta de segurança e aumenta a complexidade de manutenção da aplicação.

Portanto, nesse projeto será realizado a divisão em tres conceitos básicos:

- **Front-End**: É a parte responsável pela apresentação e interação dos dados com o usuário.
- **Back-end**: O servidor, responsável pela lógica de negócio (Servir arquivos, realizar validações, CRUDs, ...).
- **Base de dados**: Responsável pelo armazenamento das informações.

Abaixo está um pouco de porque cada tecnologia foi escolhida e o que a mesma acrescenta ao projeto.

### Front-End

- Vue.js (HTML+CSS+TypeScript): Um framework simples e robusto para renderização das informações no navegador.
- TailwindCSS: Bibliotecas de componentes HTML e CSS, agiliza na prototipagem do layout.
- DaisyUI: Biblioteca de componentes.
- Vite: Framework utilizado para realizar o bundle da aplicação (juntar a aplicação em um único pacote).

### Back-End

- Express.js: Framework responsável pelo controle das requisições HTTP.
- Faker.js: Framework utilizado para gerar informações temporárias, bem útil no desenvolvimento para testes da aplicação.
- Winston.js: Utilizado para o logging da aplicação, útil no desenvolvimento e acompanhamento da aplicação.

### Base de dados

- SQLite: Formato de armazenamento utilizado para armazenar os dados utilizando armazenamento em arquivo único (SQL sem a necessidade de um 2º serviço).
- Drizzle ORM: Framework JavaScript para o mapeamento das informações presentes na base de dados.

### Outras tecnologias

<!--TODO: Incrementar descrições -->
- TypesScript: Um JavaScript com melhor tipagem.
- Prettier: Formatação de código.
- Eslint: Linter.

### Pode ser utilizando no futuro

nodemon: Auto-restarts your Express server on file changes.
ts-node-dev: TypeScript-friendly alternative to nodemon.
dotenv: Manage environment variables easily.
Zod or Yup: Schema validation for TypeScript—great for validating request bodies and responses.
JWT or Passport.js Add user authentication to your Express backend.
Helmet: Secure your Express app by setting HTTP headers.

### Outros "insights"

## Back-end

Express.js ou <https://fastify.dev>: O express é bastante utilizado na industria, portanto o aprendizado pode ser utilizado no mercado.

## Estrutura

Frontend <-(HTTP: REST)-> Backend <-> Lógica <-> Database (PostgreSQL)
