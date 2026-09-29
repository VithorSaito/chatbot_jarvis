### JARVIS — CHATBOT CORPORATIVO

Documentação Técnica, Funcional e de Regras de Negócio

Rottas Incorporadora e Construtora

Versão: 1.0

Status: Em desenvolvimento

Data: 28/09/2026

## 1. Visão geral

O Jarvis é um chatbot corporativo desenvolvido para permitir que usuários consultem informações da organização diretamente pelo Microsoft Teams. A solução utiliza um Bot integrado ao Teams, uma API backend hospedada no Railway e um fluxo de RAG (Retrieval-Augmented Generation) desenvolvido no Dify.

O objetivo técnico é receber a pergunta do usuário, encaminhá-la ao workflow do Dify, recuperar informações relevantes da base de conhecimento, gerar uma resposta com LLM e devolver a resposta ao usuário no Teams.

## 2. Objetivos do projeto

- Disponibilizar uma interface de consulta corporativa dentro do Microsoft Teams.
- Permitir que o usuário faça perguntas em linguagem natural.
- Utilizar documentos corporativos como fonte de conhecimento para o RAG.
- Centralizar a lógica de integração entre Teams e Dify em uma API Fastify.
- Automatizar a alimentação da base de conhecimento por meio de um worker.
- Evitar reprocessamento desnecessário de documentos que não sofreram alterações.
- Preparar o chatbot para atendimento em conversa direta (1:1) no Teams.
## 3. Escopo

### 3.1 Incluído

- Aplicativo Jarvis no Microsoft Teams.
- Azure Bot para integração com o Teams.
- API Fastify hospedada no Railway.
- Endpoint de recebimento de mensagens do Teams.
- Workflow de RAG no Dify.
- Base de conhecimento do Dify.
- Worker para ingestão/sincronização de documentos.
- Comunicação API → Dify.
- Retorno da resposta do Dify → API → Teams.
### 3.2 Fora do escopo atual

- Definição de novos mecanismos de autenticação além dos recursos já utilizados pelo Teams/Azure.
- Implementação de Redis ou gerenciamento avançado de contexto, enquanto não houver requisito definido.
- Publicação do Dify em infraestrutura externa — depende da administração da infraestrutura.
## 4. Arquitetura da solução

Fluxo lógico principal:

Usuário Teams → Teams App/Jarvis → Azure Bot → API Fastify (Railway) → Dify Workflow → Knowledge Retrieval → LLM → API Fastify → Teams

## 4.1 Componentes

| Componente | Responsabilidade | Estado |
| --- | --- | --- |
| Microsoft Teams | Interface de interação com o usuário. | Configurado |
| Teams Developer Portal | Aplicativo Jarvis e configuração do bot/scopes. | Configurado |
| Azure Bot | Receber/encaminhar mensagens do Teams para a API. | Configurado |
| Fastify API | Orquestrar recebimento da mensagem e chamada ao Dify. | Hospedada |
| Railway | Hospedagem pública da API. | Ativo |
| Dify | Workflow de RAG e geração da resposta. | Configurado |
| Knowledge Base | Fonte documental utilizada pelo RAG. | Criada |
| Worker | Sincronização e ingestão dos documentos. | Quase concluído |


## 5. Configuração conhecida

| Item | Configuração |
| --- | --- |
| Teams App | Jarvis |
| Azure Bot | Jarvis121fa |
| Microsoft App ID | d2516b83-461e-4922-93e3-f9dfe198d9d0 |
| Tenant ID | 4e989c12-46b7-4385-9cc2-605737d14a6b |
| Teams de teste | teste - jarvis |
| Canal de teste | ti |
| API | Fastify / Railway |
| Endpoint Teams | https://chatbotjarvis-production.up.railway.app/teams/messages |
| Dify atual | http://dify.rottas.local/ |
| Dify API atual | http://dify.rottas.local/v1 |
| Dify versão | 1.17.1 |


## 6. Fluxo funcional

### 6.1 Fluxo de pergunta

1. Usuário envia uma mensagem para o Jarvis no Teams.
2. Azure Bot recebe o evento e encaminha a mensagem para o endpoint configurado.
3. A API Fastify recebe o payload.
4. A API extrai o texto/pergunta do evento.
5. A API envia a pergunta para o endpoint de execução do Workflow do Dify.
6. O Dify executa o Knowledge Retrieval sobre a base de conhecimento.
7. O contexto recuperado é utilizado pelo LLM para gerar a resposta.
8. O Dify devolve o resultado à API.
9. A API devolve a resposta ao Teams.
10. O usuário visualiza a resposta no Teams.
## 6.2 Fluxo de documentos

11. O worker consulta a origem dos documentos.
12. O worker identifica documentos novos ou modificados.
13. Documentos sem alteração devem ser ignorados.
14. Documentos novos/modificados são processados.
15. O conteúdo é enviado para a base de conhecimento do Dify.
16. O Dify realiza o processamento/indexação necessário para o RAG.
## 7. Regras de negócio

| ID | Regra |
| --- | --- |
| RN01 | Toda pergunta recebida pelo bot deve ser encaminhada para a camada de processamento da API. |
| RN02 | A API deve ser a responsável por orquestrar a comunicação entre Teams e Dify. |
| RN03 | A pergunta do usuário deve ser enviada ao workflow do Dify como variável de entrada do workflow. |
| RN04 | O RAG deve utilizar a base de conhecimento corporativa configurada no Dify. |
| RN05 | A base de conhecimento deve ser alimentada por documentos corporativos processados pelo worker. |
| RN06 | O worker deve evitar reprocessar documentos que não sofreram alteração. |
| RN07 | Documentos novos devem ser considerados para ingestão. |
| RN08 | Documentos alterados devem ser atualizados/reprocessados conforme a estratégia definida pelo worker. |
| RN09 | A resposta gerada pelo Dify deve retornar pela API antes de ser entregue ao usuário no Teams. |
| RN10 | A solução deve suportar atendimento em conversa direta no Teams após a configuração do escopo Personal. |
| RN11 | O acesso externo ao Dify deve ocorrer por HTTPS válido antes da API hospedada no Railway depender do serviço em produção. |
| RN12 | Chaves de API e credenciais não devem ser expostas em código-fonte ou mensagens de diagnóstico. |


## 8. Casos de uso

### UC01 — Enviar pergunta ao Jarvis

Ator: Usuário do Microsoft Teams

Pré-condições: Bot instalado e disponível; API acessível.

Fluxo principal:

1. Usuário envia uma pergunta.
2. Teams encaminha o evento ao Azure Bot.
3. Azure Bot chama a API.
4. API extrai a pergunta.
5. API solicita processamento ao Dify.
6. Dify recupera contexto e gera resposta.
7. API recebe a resposta.
8. API envia a resposta ao Teams.
Pós-condição: usuário recebe a resposta no Teams.

### UC02 — Consultar conhecimento corporativo

Ator: Usuário do Teams

Fluxo principal:

9. Usuário formula uma pergunta relacionada aos documentos corporativos.
10. Workflow do Dify executa o mecanismo de recuperação.
11. Documentos relevantes são recuperados.
12. LLM recebe a pergunta e o contexto recuperado.
13. Resposta é gerada e devolvida à API.
### UC03 — Sincronizar documentos

Ator: Worker

14. Worker consulta a origem dos documentos.
15. Compara informações necessárias para detectar novos/alterados.
16. Seleciona documentos que precisam de processamento.
17. Processa e envia os documentos ao Dify.
18. Registra/considera o estado necessário para evitar processamento desnecessário.
### UC04 — Atendimento direto 1:1

Ator: Usuário do Microsoft Teams

19. Usuário abre uma conversa direta com o Jarvis.
20. O Teams encaminha a mensagem ao Azure Bot.
21. A API processa a pergunta normalmente.
22. Dify executa o RAG.
23. Resposta retorna ao chat direto.
Status: pendente de habilitação/configuração do escopo Personal no Teams.

## 9. API

### 9.1 Endpoint principal

POST /teams/messages

Endpoint responsável por receber as mensagens encaminhadas pelo Azure Bot/Teams.

### 9.2 Integração com Dify

Endpoint utilizado para execução do Workflow:

POST /v1/workflows/run

A chamada utiliza autenticação Bearer e envia as variáveis de entrada do workflow, o modo de resposta e o identificador lógico do usuário.

Estrutura conceitual:

{ "inputs": { "question": "..." }, "response_mode": "blocking", "user": "teams-user" }

## 10. Dify

### 10.1 Workflow

Estrutura definida:

START → KNOWLEDGE RETRIEVAL → LLM → ANSWER

Entrada planejada do workflow: question (String).

O workflow utiliza Knowledge Retrieval para consultar a base e um LLM para produzir a resposta.

## 10.2 Estado da integração

A integração API → Dify foi implementada, porém a validação ponta a ponta depende da publicação/acessibilidade externa do Dify.

O Dify atual está em endereço interno (dify.rottas.local / 192.168.0.23). Para o Railway consumir o serviço, é necessário disponibilizar o Dify externamente por HTTPS e com infraestrutura de rede adequada.

## 11. Worker de ingestão

Responsabilidade: manter a base de conhecimento do Dify sincronizada com a origem documental.

- Consultar a origem dos documentos.
- Detectar novos documentos.
- Detectar documentos modificados.
- Ignorar documentos sem alteração.
- Processar documentos selecionados.
- Enviar/atualizar os documentos na base do Dify.
A estratégia de detecção pode utilizar metadados como tamanho e data de atualização, conforme a implementação definida para a origem dos documentos.

## 12. Segurança

- API Keys do Dify devem permanecer em variáveis de ambiente/secret manager.
- Não utilizar chaves reais em código versionado.
- O Dify publicado externamente deve utilizar HTTPS válido.
- A exposição externa do Dify deve ser controlada pela infraestrutura de rede da organização.
- Logs não devem registrar tokens ou credenciais.
- A API deve validar o payload recebido antes de processá-lo.
## 13. Observabilidade e tratamento de erros

| Situação | Comportamento esperado |
| --- | --- |
| Teams não consegue chamar API | Registrar erro de entrada/conectividade. |
| Payload inválido | Validar e rejeitar sem executar o Dify. |
| Dify indisponível | Registrar erro e retornar resposta controlada. |
| API Key inválida | Registrar erro de autenticação sem expor a chave. |
| Workflow inválido/não publicado | Registrar erro retornado pelo Dify. |
| Documento não alterado | Não reprocessar. |
| Documento novo/alterado | Enviar para ingestão. |


## 14. Ambiente e infraestrutura

| Ambiente | Serviço | Descrição |
| --- | --- | --- |
| Desenvolvimento/Interno | Dify | Hospedado internamente; atualmente dify.rottas.local. |
| Cloud | API | Fastify hospedado no Railway. |
| Microsoft | Bot | Azure Bot integrado ao Teams. |
| Microsoft | App | Jarvis configurado no Teams Developer Portal. |


## 15. Checklist do projeto

| Item | Status | Próxima ação |
| --- | --- | --- |
| Integração Teams → API | CONCLUÍDO | Manter testes de regressão. |
| RAG no Dify | CONCLUÍDO | Validar ponta a ponta após publicação. |
| Hospedagem da API | CONCLUÍDO | Monitorar Railway. |
| Base de conhecimento | CONCLUÍDO | Alimentar documentos. |
| Alimentação da base | PENDENTE | Executar worker após conclusão. |
| Worker | QUASE 100% | Finalizar e testar sincronização. |
| Dify público | PENDENTE | Infra disponibilizar HTTPS externo. |
| Chat direto | PENDENTE | Habilitar/configurar escopo Personal. |
| Teste ponta a ponta | PENDENTE | Executar após as etapas anteriores. |


## 16. Critérios de aceite

- Usuário consegue enviar uma pergunta pelo Teams.
- A mensagem chega à API hospedada no Railway.
- A API consegue autenticar e executar o workflow do Dify.
- O Dify consegue consultar a base de conhecimento.
- O LLM gera uma resposta baseada no contexto recuperado.
- A resposta retorna para a API.
- A resposta é exibida ao usuário no Teams.
- O worker consegue identificar documentos novos/alterados.
- Documentos processados ficam disponíveis para consulta no RAG.
- O bot responde em conversa direta 1:1.
## 17. Decisões técnicas registradas

- Fastify é utilizado como camada backend de integração.
- Railway hospeda a API publicamente.
- Dify é responsável pelo workflow de RAG e geração da resposta.
- A API recebe a mensagem do Teams e envia diretamente o texto ao Dify; o Dify não precisa buscar a última mensagem do Teams.
- O fluxo inicial do Dify é Workflow, com Knowledge Retrieval seguido por LLM.
- A integração deve ser construída incrementalmente, validando cada caminho antes de adicionar novas camadas.
## 18. Pendências e dependências

| Pendência | Dependência | Impacto |
| --- | --- | --- |
| Dify público via HTTPS | Administrador/infraestrutura | Bloqueia validação completa API → Dify em produção. |
| Worker | Desenvolvimento | Bloqueia ingestão automatizada. |
| Carga dos documentos | Worker + Dify | Bloqueia consultas com conhecimento corporativo completo. |
| Chat 1:1 | Teams Developer Portal/Azure | Bloqueia atendimento direto. |
| Teste ponta a ponta | Todas as anteriores | Validação final do produto. |


## 19. Glossário

| Termo | Definição |
| --- | --- |
| Teams | Plataforma de comunicação onde o usuário interage com o Jarvis. |
| Azure Bot | Componente Microsoft responsável pela integração do bot com canais como Teams. |
| Teams Developer Portal | Portal utilizado para configurar o aplicativo Jarvis no Teams. |
| Fastify | Framework Node.js utilizado para a API backend. |
| Railway | Plataforma onde a API está hospedada. |
| Dify | Plataforma utilizada para construir o workflow de IA/RAG. |
| RAG | Arquitetura que recupera conhecimento relevante antes da geração da resposta. |
| Knowledge Base | Conjunto de documentos utilizado pelo mecanismo de recuperação. |
| Worker | Processo responsável pela sincronização/ingestão dos documentos. |
| LLM | Modelo de linguagem utilizado para gerar a resposta. |


## 20. Observação sobre o estado da documentação

Esta documentação consolida as decisões e configurações conhecidas até 28/09/2026. Itens marcados como pendentes representam trabalho ainda não validado em produção. Valores, endpoints e identificadores devem ser atualizados quando houver mudança de ambiente.
