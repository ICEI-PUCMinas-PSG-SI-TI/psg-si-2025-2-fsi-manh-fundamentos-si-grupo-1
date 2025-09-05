# Tecnologias

Observação: As dificuldades foram geradas pelo conhecimento atual que possuo de cada técnologia e não refletem diretamente a dificuldade de aprendizado e desenvolvimento de cadas stack.

## Utilizada em TIAW

**Dificuldade**  
Aprendizado: 1/10  
Desenvolvimento: 6/10

**Frontend**  
HTML, CSS, JavaScript

**Componentes**  
Bootstrap

**Banco de dados**  
json-server

**Informações**  
Stack fundamental para o desenvolvimento web, focada em criar interfaces estáticas ou com pouca interatividade. O json-server simula uma API RESTful completa com base em um simples arquivo JSON.

**Difuldades**  

- Gerenciamento de Estado no Frontend: Sem um framework (como React ou Vue), qualquer aplicação com um mínimo de interatividade se torna difícil de gerenciar. Você precisa controlar o estado dos dados em variáveis JavaScript e atualizar o DOM manualmente (document.getElementById, innerHTML, etc.). Isso rapidamente vira um "código espaguete", difícil de manter e depurar.
- Toda validação lógica é realizada no frontend da aplicação, ou seja, não há segurança no armazenamento de dados e a aplicação fica complexa.

## HTML/CSS/JS (Vanilla) + Express.js

**Dificuldade**  
Aprendizado: 3/10  
Desenvolvimento: 5/10

**Frontend**  
HTML, CSS, JavaScript (sem framework).

**Componentes**  
Bootstrap

**Backend**  
Express.js

**Banco de Dados**  
Drizzle ORM: SQLite, JSON, etc.

**Informações**  
É a evolução natural da stack estática de TIAW. O json-server é substituído por um backend de verdade com Express.js. Isso permite criar APIs robustas, lidar com lógica de negócios, autenticação e persistir dados em um banco de dados real.

**Difuldades**  

- Gerenciamento de Estado no Frontend: Sem um framework (como React ou Vue), qualquer aplicação com um mínimo de interatividade se torna difícil de gerenciar. Você precisa controlar o estado dos dados em variáveis JavaScript e atualizar o DOM manualmente (document.getElementById, innerHTML, etc.). Isso rapidamente vira um "código espaguete", difícil de manter e depurar.

## HTML/CSS/TypeScript + Express.js + Vite

**Dificuldade**  
Aprendizado: 5/10  
Desenvolvimento: 5/10

**Frontend**  
HTML, CSS, TypeScript.

**Componentes**  
Bootstrap.

**Backend**
Express.js (com TypeScript).

**Banco de Dados**
Drizzle ORM: SQLite, JSON, etc.

**Informações**
Stack vanilla modernizada". Ela mantém a simplicidade de não usar um framework de frontend pesado (como React ou Vue), mas adiciona TypeScript para a produtividade e segurança do código que adiciona tipagem estática ao JavaScript, prevenindo inúmeros bugs comuns e melhorando a auto-completação no editor.

**Dificuldades**  

- Configuração do Ambiente de Desenvolvimento: O maior desafio prático. Durante o desenvolvimento, você precisa rodar dois servidores ao mesmo tempo:
    1. O servidor de desenvolvimento do Vite para o frontend (ex: localhost:5173).
    2. O servidor do Express.js para o backend/API (ex: localhost:3000).
    3. É necessário configurar um proxy no Vite para que as chamadas de API do frontend (/api/...) sejam corretamente redirecionadas para o servidor Express, evitando problemas de CORS.
- Configuração para Produção: Após o desenvolvimento, o Vite gera uma pasta dist com os arquivos estáticos (HTML, JS, CSS) otimizados. É preciso configurar o servidor Express para servir corretamente esses arquivos em um ambiente de produção, o que exige um setup específico para servir o index.html principal e os assets estáticos.
- Ainda é Manual: TypeScript torna a manipulação do DOM mais segura, mas não elimina a necessidade de fazê-la manualmente. A complexidade de manter a UI sincronizada com o estado da aplicação ainda existe, que é o principal problema que frameworks como React e Vue resolvem.

## Vue.js + Express.js

**Dificuldade**  
Aprendizado: 4/10  
Desenvolvimento: 5/10

**Frontend**  
Vue.js (HTML + CSS + TypeScript)  

**Componentes**  
PrimeVue  

**Backend**  
Express.js (+ TypeScript)  

**Banco de dados**  
Drizzle ORM: SQLite, JSON, etc.

**Informações**  
O Vue.js é conhecido por sua curva de aprendizado suave e excelente documentação. O Express.js é um framework minimalista para Node.js, tornando o desenvolvimento do backend rápido e flexível. O Drizzle é um ORM (Object-Relational Mapper) moderno que facilita a interação com o banco de dados de forma segura e tipada.  

**Dificuldades**  

- Configuração do Ambiente de Desenvolvimento: O maior desafio prático. Durante o desenvolvimento, você precisa rodar dois servidores ao mesmo tempo:

## React + Express.js

**Dificuldade**  
Aprendizado: 6/10  
Desenvolvimento: 6/10

**Frontend**  
React (JSX + CSS + TypeScript)  

**Componentes**  
Material-UI (MUI), Ant Design, Shadcn/ui, ...  

**Backend**  
Express.js (+ TypeScript)  

**Banco de dados**  
Drizzle ORM: SQLite, JSON, etc.

**Informações**  
O React, mantido pelo Facebook, utiliza uma arquitetura baseada em componentes que facilita a criação de interfaces complexas e reutilizáveis. Sua integração com o Express.js é robusta, sendo a escolha para incontáveis sistemas em produção.

**Dificuldades**  

- A curva de aprendizado do React pode ser mais íngreme que a do Vue.js devido a conceitos como JSX, gerenciamento de estado (useState, useReducer, Redux) e o ecossistema mais vasto.
- Configurar o ambiente do zero (Webpack, Babel) pode ser complexo, embora ferramentas como create-react-app ou Vite simplifiquem muito esse processo.

**Exemplos de Aplicações**  
Facebook, Instagram, Netflix, Airbnb, ...

## Nuxt.js (Vue.js) + Express.js

**Dificuldade**  
Aprendizado: 6/10  
Desenvolvimento: 7/10

**Frontend**  
Nuxt.js (Vue.js + TypeScript)  

**Componentes**  
Nuxt UI, PrimeVue, Vuetify, ...

**Backend**  
Servidor Nitro (integrado ao Nuxt) ou Express.js desacoplado.  

**Banco de dados**  
Qualquer banco compatível com Node.js (PostgreSQL, MongoDB, etc.).

**Informações**  
Nuxt.js é um framework sobre o Vue.js que oferece funcionalidades prontas para uso, como renderização no lado do servidor (SSR), geração de sites estáticos (SSG), roteamento baseado em arquivos e otimizações de performance. O backend pode ser criado diretamente dentro da pasta /server do Nuxt, utilizando o motor Nitro, ou pode ser uma aplicação Express.js separada, consumida como uma API.  

**Dificuldades**  

- A "magia" do Nuxt (convenções e automações) pode ser confusa para iniciantes que não entendem bem o Vue.js puro primeiro.  
- A configuração de deploy para SSR pode ser mais complexa do que para uma SPA (Single Page Application) tradicional.  
- Depurar problemas entre a camada do Nuxt e o servidor backend pode ser um desafio.  

## Electron

É uma instância do Chrome que permite desenvolver aplicações desktop multiplataforma (Windows, macOS, Linux) utilizando tecnologias web.

**Dificuldade**  
Aprendizado: 8/10  
Desenvolvimento: 8/10  
(Principalmente pela necessidade de dominar múltiplos paradigmas).  

**Frontend**  
Qualquer framework web (React, Vue, Svelte, ou HTML+CSS+JavaScript puros).  

**Componentes**  
Depende da implementação do frontend (ex MUI para React, PrimeVue para Vue).  

**Backend**  
Node.js (integrado ao processo principal do Electron).  

**Banco de dados**  
SQLite (mais comum), IndexedDB (no processo do renderizador), PouchDB.  

**Informações**  
O Electron funciona com dois tipos de processos: o processo principal (Main), que tem acesso a APIs do sistema operacional (criar janelas, menus, acessar arquivos) e roda Node.js, e os processos de renderização (Renderer), que são as janelas da aplicação e rodam o frontend. A comunicação entre eles é crucial e feita via IPC (Inter-Process Communication).  

**Problemas**  

- É estritamente necessário separar a lógica do frontend (UI) da lógica do backend (operações de sistema) via eventos IPC (ipcMain, ipcRenderer), o que pode ser verboso e difícil de gerenciar em aplicações complexas.  
- Não é 100% compatível com TypeScript nativamente, exigindo configurações adicionais e, por vezes, contornos para que a tipagem funcione corretamente entre os processos Main e Renderer.  
- Integrar ferramentas como ORMs (Drizzle, Prisma) que dependem de processos específicos do Node.js pode ser desafiador, exigindo que toda a lógica do banco de dados resida no processo principal e seja exposta de forma segura ao frontend via IPC.

**Exemplos de Aplicações**  
Spotify, Discord, Teams, WhatsApp Desktop, Steam, Epic Games Launcher, VS Code.

## Outras combinações

As combinações abaixo também podem ser utilizadas mas não dependendem de JavaScript/TypeScript então seria necessário aprender as duas linguagens especificas (go, c#, python) de cada uma além do framework frontend (React, Vue, ...) que são em JavaS/TypeS.

Python + (Django/Flask) + (React/Vue)  
Dificuldade: 6/10

ASP.NET Core + (React/Angular/Blazor)  
Dificuldade: 7/10

Go (Golang) + (React/Vue/Svelte)  
Dificuldade: 8/10

Avalonia (C#), Tauri (Rust), PyQt (Python+Qt), React Native (React): variam entre 7–8/10 dependendo do ecossistema e linguagem nativa.

## Comparação de dificuldade

| Stack                |Dificuldade média| Principal Desafio                                                             |
|----------------------|-----------|-------------------------------------------------------------------------------|
| TIAW (Vanilla)       | 2/10      | Gerenciar interatividade sem framework.                                                             |
| Vanilla + Express.js | 4/10      | Entender a separação cliente/servidor e a lógica assíncrona do backend.       |
| TypeS + Express.js   | 5/10      | Aprender TypeScript e gerenciar o setup com dois servidores (Vite + Express). |
| Vue.js + Express.js  | 4.5/10      | Aprender os conceitos de um framework moderno e a separação cliente/servidor. |
| React + Express.js   | 6/10      | Conceitos mais abstratos do React (JSX, Hooks) e um ecossistema mais vasto.   |
| Nuxt.js + Express.js | 6.5/10      | Dominar a arquitetura (SSR vs. CSR) e as abstrações do framework.             |
| Electron             | 8/10      | Gerenciar múltiplos processos (Main/Renderer) e a comunicação via IPC.        |
