# 2. Especificações do Projeto

## 2.1 Personas

**Persona 1**  
**Nome**: Carlos Barros  
**Idade**: 42 anos  
**Profissão**: Barbeiro  
**Perfil**: Carlos é casado, pai de três filhos adolescentes, e gosta de viajar com a família. Carlos é proprietário de uma barbearia tradicional e utiliza planilhas para controlar produtos como lâminas, produtos e equipamentos. O controle é manual, com atualizações feitas semanalmente ou quando percebe falta de algum item e a compra é feita com um único fornecedor, que visita a barbearia uma vez por mês para verificar o que está em falta e sugerir reposições. Carlos usa o celular para redes sociais e WhatsApp com clientes e está aberto a soluções que simplifiquem sua rotina, desde que sejam fáceis de usar e não exijam muito tempo de aprendizado.

**Persona 2**  
**Nome**: Priscila Vieira  
**Idade**: 29 anos  
**Profissão**: Atendende  
**Perfil**: Camila Souza, 29 anos, é atendente em uma padaria de bairro, curte festas e encontros sociais. No trabalho, realiza diariamente o atendimento ao público com o uso de um aplicativo que integra o controle de estoque com as vendas, facilitando o acompanhamento das saídas. Camila valoriza soluções que otimizem seu tempo no dia a dia.

## 2.2 Historias de usuário

<!-- Onboard -->
- Como um administrador, eu quero cadastrar, editar e remover usuários, para controlar quem tem acesso ao sistema e quais são seus níveis de permissão.
- Como um administrador, eu quero configurar informações da empresa (nome, cnpj, endereço), para que os relatórios e documentos emitidos pelo sistema sejam padronizados.
- Como um administrador, eu quero criar, editar e excluir categorias de produtos, para organizar o estoque de forma lógica e facilitar a busca por itens.
<!-- Cadastro -->
- Como administrador e usuário do sistema de estoque, quero definir e utilizar diferentes unidades de medida (como unidade, quilo, litro, metro, grama), para que suas quantidades registradas de forma precisa conforme o tipo de item.
- Como um gerente de estoque, eu quero cadastrar novos produtos com informações detalhadas (sku, nome, descrição, fornecedor, custo, preço de venda, imagens, categorias), para manter um registro completo e preciso dos itens.
<!-- Entrada/saida -->
- Como funcionário quero registrar a entrada de produtos com data e quantidade e saída de produtos (venda, transferência, perda) para refletir corretamente o inventário.
- Como um gerente de estoque, eu quero poder realizar contagens no inventário (acertos, perdas, quebras), para corrigir discrepâncias entre o estoque físico e o registrado no sistema.
- Como gerente de estoque, quero visualizar o histórico completo de movimentações de um produto específico, incluindo entradas, saídas, ajustes e o registro de quem realizou cada ação, para garantir rastreabilidade e controle operacional.
- Como operador de estoque, eu quero que o sistema me indique qual lote retirar primeiro, seguindo a regra pvps (primeiro que vence, primeiro que sai), para otimizar o fluxo e reduzir o desperdício.
- Como gerente de estoque, eu quero poder bloquear um lote específico para saída em caso de recall ou problema de qualidade, para impedir que produtos defeituosos cheguem ao cliente.
<!-- Consulta -->
- Como funcionário, quero consultar preços custo, preço de venda e promoções, para informar corretamente os clientes.
- Como funcionário, quero consultar a quantidade disponível de um item, para responder a pedidos internos ou de clientes.
<!-- Controle -->
- Como gerende de estoque e administrador, desejo definir niveis minimos e máximos de estoque para ser alertado quando um item estiver acabando e evitar problemas.
- Como administrador, quero bloquear movimentações de itens inativos, para evitar erros.
- Como administrador, quero configurar políticas de validade/lote, para controlar produtos perecíveis, reduzindo custos e desperdícios.
<!-- Requisições -->
- Quero emitir nota de reserva de produto, para garantir que o item não seja vendido a outro cliente.
- Como vendedor, quero reservear itens no estoque ao registrar um pedido, para envitar vendas de produtos indispóniveis.
- Como vendedor, quero receber notificações quando um produto reservado for liberado, para saber quando posso movimentá-lo.
- Como um gerente de estoque, quero acompanhar status de pedidos em tempo real, para informar clientes com precisão.
<!-- Relátorios -->
- Quero visualizar dashboards com indicadores-chave (giro, rupturas, perdas, cobertura de estoque, sazonalidade, previsões de vendas), para tomar decisões rápidas e eficientes.
- Como um administrador, eu quero visualizar um log de todas as ações importantes realizadas no sistema, para poder auditar e rastrear alterações.
<!-- Extras -->
- Como funcionário, quero registrar movimentações pelo celular, para atualizar o estoque em tempo real no chão de fábrica ou no armazém.
- Como funcionário, quero usar câmera do celular para ler código de barras/qr code, para agilizar o processo.
- Como um adminstrador de sistemas, eu quero realizar backups e restaurações do banco de dados, para garantir a segurança e a integridade das informações do estoque.

## 3.1 Requisitos Funcionais

<!--

O - Onboard - Integração inicial do sistema
C - Cadastro - Cadastro de informações no sistema
E - Entrada/Saida - Registro de movimentações no sistema
V - Consulta - Verificação de informações extras
R - Controle - Regras de controle do estoque
S - Requisições - Solicitações realizadas no sistema.
P - Relátorios - Planilhas/Reportes.
I - Conectividade - Integração com outros sistemas.
X - Extra - ...
N - Não Funcionais - Requisitos Não Funcionais

-->

| ID | Prioridade | Descrição do Requisito |
| :-: | :-: | :-- |
| CNTR-01O | MÉDIA | O sistema deve permitir o cadastro de novos usuários apenas pelo administrador e possuir niveis de permissão. |
| CNTR-02O | BAIXA | O sistema deve permitir a configuração informações da empresas como nome, cnpj e endereço para documentos emitidos. |
| CNTR-03O | BAIXA | O sistema deve permitir a criação de categorias de protudos. |
| CNTR-04C | BAIXA | O sistema deve permitir o cadastro de diferentes unidades de medida (como unidade, quilo, litro, metro, grama). |
| CNTR-05C | ALTA | O sistema deve permitir o cadastro de produtos com informações detalhadas como sku, nome, descrição, fornecedor, custo, preço de venda, imagens, categorias. |
| CNTR-06E | MÉDIA | O sistema deve permitir o registro de entradas e saídas do estoque com informações de data, quantidade e motivo (venda, transferência, perda). |
| CNTR-07E | MÉDIA | O sistema deve permitir o ajuste da quantidade em estoque. |
| CNTR-08E | MÉDIA | O sistema deve manter e permitir a visualização do histórico de movimentações de um item com informações detalhadas. |
| CNTR-09E | BAIXA | O sistema deve registrar informações de lote individuais de cada protudo e utilizar a informação para definir o fluxo de itens. |
| CNTR-10E | BAIXA | O sistema deve permitir adicionar informações adicionais para bloqueio de itens especificos como por lote ou itens inativos. |
| CNTR-11V | BAIXA | O sistema deve permitir a consulta de informações de preço (custo, venda, promoções) e quantidade. |
| CNTR-12R | MÉDIA | O sistema deve configurações de alerta de estoque minimo e máximo assim como outras métricas como validade. |
| CNTR-13S | BAIXA | O sistema deve permitir a reserva de itens em estoque e emitir números de pedido conforme a reserva. |
| CNTR-14P | BAIXA | O sistema deve gerar relatórios de giro, sazonalidade, previsão de vendas, etc... |
| CNTR-15P | BAIXA | O sistema deve manter registro de todas as operações como logs de acesso, baixa e entrada de produtos, alterações de informações nos produtos, ... |
| CNTR-16X | BAIXA | O sistema deve possuir formas de escanear códigos de barra ou QR para agilizar no preenchimento do formulário de produtos. |
| CNTR-17X | BAIXA | O sistema deve realizar backups recorrentes das informações. |
| CNTR-18P | MÉDIA | O sistema deve manter um dashboard para fácil identificação de indicadores importantes e rotineiros. |
| CNTR-19S | BAIXA | O sistema deve notificar quando produtos reservados do estoque estiverem disponíveis. |

## 3.2 REQUISITOS NÃO FUNCIONAIS

| ID | Prioridade | Descrição do Requisito |
| :-: | :-: | :-- |
| CNTRN-01 | ALTA | O sistema deve armazenas dados de forma segura. |
| CNTRN-02 | MÉDIA | O sistema deve ter backend e a camada lógica não deve ficar na aplicação web. |
| CNTRN-03 | MÉDIA | O sistema deve ter um design responsivo e deve se adaptar a dispositivos móveis. |

## 3.3 RESTRIÇÕES

| ID  | Restrição                                                        |
|------|-----------------------------------------------------------------|
| 01   | O projeto deverá ser entregue até o final do semestre.          |

<!--

Historias de usuário fora do escopo desse projeto:

### Onboard

- ~~Como usuário, quero importar dados de produtos via planilha para agilizar o cadastro inicial.~~
- ~~Como administrador, quero definir múltiplos depósitos/filiais, para controlar estoques em diferentes locais.~~

### Cadastro

- ~~Como gerente de estoque, eu quero criar "kits" ou "produtos compostos" (um produto que é composto por vários outros itens do estoque), para que, ao registrar a saída do kit, o sistema automaticamente dê baixa nos seus componentes.~~
- Como gerente de estoque, eu quero cadastrar produtos com variações (ex: tamanho, cor, voltagem), para gerenciar o estoque de cada variação de forma independente dentro do mesmo produto principal.
- Como gerente de estoque, eu quero anexar imagens e documentos (manuais, especificações técnicas) ao cadastro de um produto, para facilitar a identificação e consulta por parte da equipe.

### Controle

- ~~Como fornecedor, quero receber pedidos de reposição automaticamente, quando o estoque atingir o nível mínimo.~~

### Requisições

- ~~Como um operador de estoque, eu quero consultar e registrar a transferência de produtos entre diferentes almoxarifados ou locais, para manter a acuracidade dos níveis de estoque em cada local.~~
- ~~Como um gerente de estoque, eu quero cadastrar e gerenciar informações dos fornecedores, para facilitar o processo de cotação e compra de novos itens.~~
- ~~Quero sugerir produtos substitutos automaticamente, caso o item desejado esteja em falta.~~
- Como fornecedor quero acompanhar status de entrega dos meus pedidos, para garantir prazos.
- Como funcionário, quero registrar devoluções de itens para produtos entregues incorretamente ou pós validade.

### Conectividade

- ~~Como usuário, quero que o sistema tenha integração com sistemas de e-commerce para atualizar estoque automaticamente após vendas online.~~
- ~~Como fornecedor, quero enviar notas fiscais eletrônicas diretamente pelo sistema, para agilizar a entrada de mercadorias.~~

### Relátorios

- ~~Como membro do financeiro, eu quero gerar relatórios de valoração de estoque usando diferentes métodos (custo médio, peps/fifo), para realizar o fechamento contábil mensal.~~

### Extras

- ~~Como usuário do sistema, quero poder registrar movimentações mesmo quando estiver sem conexão com o servidor, para que eu possa continuar trabalhando normalmente e sincronizar os dados assim que a conexão for restabelecida.~~

-->