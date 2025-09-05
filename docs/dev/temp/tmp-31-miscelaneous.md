# Ideias Gerais de Desenvolvimento

Pra delegar é preciso de conhecimento sobre o produto.
No proximo semestre temos mais uma disciplina de TIAW, provavelmente é importante deixar algumas coisas pra aprender depois (Ex: React).

## DEV

- Documentar API (Swagger) - Permite integração com outros sistemas
- Tipo de movimentações de estoque:
  - Entrada: Aumenta a quantidade de produtos no estoque.
  - Saida: Reduz a quantidade de produtos no estoque.
  - Correção: Aumenta ou reduz a quantidade de produtos no estoque.
  - Zerar?: Zera a quantidade do produto em estoque.

## Estrutura do Projeto

```txt
pages/redirect -> Verifica se o usuário esta logado, se não, manda para o loggin
pages/x -> Se esta logado (recebeu cache junto com a requisição) retorna a pagina corretamente
services/auth -> Gera credenciais para o cliente, verifica chaves
services/cadastro -> Acesso aberto, cria novos clientes
```

## Logs

Como apresentar logs no terminal:

```txt
https://mcutils.com/color-text-generator
HTTP 22/08/2025 15:56:12 &9 10.0.0.1 &f &b GET &a /about &4 404 &f 3.23ms
```
