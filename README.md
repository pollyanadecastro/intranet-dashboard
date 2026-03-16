# PRD — IntraNet: Dashboard de Comunicação Interna
## Documento de Requisitos do Produto (Product Requirements Document)

---

## Parte 1 — Prompt utilizado para geração com IA

O prompt abaixo foi submetido ao Claude (Anthropic) para auxiliar no planejamento, modelagem e desenvolvimento do protótipo:

---

### Prompt completo enviado ao Claude:

```
Você é um especialista em Engenharia de Software. Me ajude a desenvolver
um protótipo de Dashboard de Comunicação Interna para uma startup.

CONTEXTO
A empresa precisa centralizar postagens, perfis de colaboradores e
comentários em uma única interface web. Para validar a ideia sem custos
de infraestrutura, utilizaremos a API pública JSONPlaceholder
(jsonplaceholder.typicode.com) como backend simulado, consumindo:

  • GET /users
  • GET /posts?userId={id}
  • GET /comments?postId={id}

REQUISITOS DO PROTÓTIPO
Desenvolva uma interface em HTML5, CSS3 e JavaScript puro contendo:

  • Lista de colaboradores com busca em tempo real
  • Perfil do colaborador selecionado com suas postagens
  • Expansão de comentários por postagem
  • Tratamento de erros de rede com try/catch e timeout de 8s
    usando AbortController
  • Feedback visual de carregamento e falhas para o usuário

O código deve rodar diretamente no navegador, sem instalação ou build,
e seguir o padrão MVC separando claramente Model, View e Controller.
```

---

## Parte 2 — Product Requirements Document (PRD)

### 2.1 Visão Geral do Produto

**Nome do produto:** IntraNet — Dashboard de Comunicação Interna  
**Versão:** 1.0 (MVP / Protótipo)  
**Data:** 2025  
**Equipe:** Engenharia de Software — Startup  

**Problema:** Empresas em crescimento enfrentam fragmentação de comunicação interna. 
Comunicados se perdem em e-mails e grupos de WhatsApp, é difícil encontrar perfis de 
colegas e não há um canal centralizado para postagens institucionais.

**Solução proposta:** Um Dashboard web centralizado que reúne em uma única interface:
- Diretório de colaboradores com busca
- Feed de postagens por autor
- Visualização de comentários por postagem
- Indicadores de status de conectividade com a API

---

### 2.2 Objetivos do Produto

| Objetivo | Métrica de sucesso |
|----------|-------------------|
| Centralizar comunicação interna | 100% das postagens visíveis em um único lugar |
| Facilitar descoberta de colaboradores | Busca funcional em < 200ms |
| Prototipar sem infraestrutura própria | Custo zero de backend no MVP |
| Demonstrar resiliência de rede | 0 crashes em caso de falha da API |

---

### 2.3 User Stories (Histórias de Usuário)

| ID | Perfil | Desejo | Benefício | Endpoint REST |
|----|--------|--------|-----------|--------------|
| US-01 | Funcionário | Ver lista de colaboradores com foto, nome e e-mail | Encontrar contatos rapidamente | `GET /users` |
| US-02 | Funcionário | Ver postagens recentes de um colaborador específico | Me manter atualizado sobre projetos e ideias da equipe | `GET /posts?userId={id}` |
| US-03 | Gestor | Visualizar comentários de uma postagem | Acompanhar o engajamento e discussões da equipe | `GET /comments?postId={id}` |
| US-04 | Funcionário | Buscar colaborador por nome ou e-mail | Acessar o perfil de um colega sem precisar rolar a lista inteira | Filtro local (sem requisição) |
| US-05 | Usuário | Receber alerta visual quando a API estiver indisponível ou lenta | Saber quando o sistema está com problemas e não ficar aguardando sem feedback | AbortController + Toast |

---

### 2.4 Requisitos Funcionais

**RF-01** — O sistema deve listar todos os colaboradores retornados por `GET /users`.  
**RF-02** — Ao selecionar um colaborador, o sistema deve carregar suas postagens via `GET /posts?userId={id}`.  
**RF-03** — Ao clicar em "Ver comentários", o sistema deve carregar os comentários via `GET /comments?postId={id}`.  
**RF-04** — O sistema deve exibir um campo de busca que filtre colaboradores por nome ou e-mail em tempo real.  
**RF-05** — O sistema deve exibir estados de carregamento (skeleton) durante requisições pendentes.  
**RF-06** — O sistema deve exibir mensagens de erro quando requisições falharem, com opção de nova tentativa.  
**RF-07** — O sistema deve cachear comentários já carregados para evitar requisições duplicadas.  

---

### 2.5 Requisitos Não-Funcionais

**RNF-01 — Timeout:** Toda requisição à API deve ser cancelada automaticamente após 8 segundos sem resposta, usando `AbortController`.

**RNF-02 — Tratamento de exceções:** Toda chamada de rede deve estar envolvida em bloco `try/catch`. Erros HTTP (404, 500, etc.) devem ser capturados e exibidos ao usuário de forma amigável.

**RNF-03 — Disponibilidade percebida:** O sistema nunca deve travar. Em caso de falha de rede, o usuário deve sempre receber feedback e uma opção de nova tentativa.

**RNF-04 — Performance:** O filtro de usuários deve operar sobre dados já carregados em memória, sem novas requisições, garantindo resposta imediata.

**RNF-05 — Compatibilidade:** O protótipo deve funcionar nos navegadores modernos (Chrome, Firefox, Safari, Edge) sem necessidade de instalação ou build.

---

### 2.6 Diagrama de Classes UML

```
┌──────────────────────────────────┐       1          *  ┌──────────────────────────────────┐
│           <<class>>              │─────────────────────▶│           <<class>>              │
│             Usuario              │                       │            Postagem              │
├──────────────────────────────────┤                       ├──────────────────────────────────┤
│ + id: int                        │                       │ + id: int                        │
│ + nome: String                   │                       │ + usuarioId: int                 │
│ + email: String                  │                       │ + titulo: String                 │
│ + telefone: String               │                       │ + corpo: String                  │
│ + empresa: String                │                       ├──────────────────────────────────┤
│ + cidade: String                 │                       │ + getComentarios(): List          │
├──────────────────────────────────┤                       │ + renderizar(): void              │
│ + getPostagens(): List           │                       └──────────────────────────────────┘
└──────────────────────────────────┘                                        │ 1
                                                                            │
                                                                            │ *
                                                            ┌───────────────▼──────────────────┐
                                                            │           <<class>>              │
                                                            │           Comentario             │
                                                            ├──────────────────────────────────┤
                                                            │ + id: int                        │
                                                            │ + postagemId: int                │
                                                            │ + nome: String                   │
                                                            │ + email: String                  │
                                                            │ + corpo: String                  │
                                                            ├──────────────────────────────────┤
                                                            │ + renderizar(): void              │
                                                            └──────────────────────────────────┘
```

**Multiplicidade:**
- `Usuario` 1 → * `Postagem`: Um usuário pode ter várias postagens; cada postagem pertence a exatamente um usuário.
- `Postagem` 1 → * `Comentario`: Uma postagem pode ter vários comentários; cada comentário pertence a exatamente uma postagem.

---

### 2.7 Arquitetura — Padrão MVC

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Browser)                       │
│                                                                 │
│  ┌───────────────┐    ┌────────────────┐    ┌────────────────┐  │
│  │     MODEL     │    │   CONTROLLER   │    │      VIEW      │  │
│  │               │    │                │    │                │  │
│  │ fetchWithTimeout│◀──│ Controller.    │──▶│ View.render    │  │
│  │ fetchUsers()  │    │ init()         │    │ UserItem()     │  │
│  │ fetchPosts()  │    │ selectUser()   │    │ renderProfile()│  │
│  │ fetchComments │    │ toggleComments │    │ renderPost()   │  │
│  │               │    │ filterUsers()  │    │ renderComment()│  │
│  └──────┬────────┘    └────────────────┘    └────────────────┘  │
│         │                                                        │
└─────────┼────────────────────────────────────────────────────────┘
          │ HTTP GET
          ▼
┌─────────────────────────────────────────────────────────────────┐
│               JSONPlaceholder REST API (Servidor)               │
│                                                                 │
│    GET /users    │    GET /posts?userId    │ GET /comments?postId│
└─────────────────────────────────────────────────────────────────┘
```

**Model** → Responsável por toda comunicação com a API. Implementa `fetchWithTimeout()` com `AbortController`, tratamento de erros HTTP e retorno dos dados crus.

**View** → Responsável exclusivamente pela geração de HTML. Não faz requisições nem lógica de negócio. Métodos puros que recebem dados e retornam strings HTML.

**Controller** → Coordena as interações do usuário. Chama o Model, recebe os dados e delega à View a renderização. Gerencia estado da aplicação (usuário selecionado, painéis abertos, cache de comentários).

---

### 2.8 Estratégias de Resiliência de Rede

#### Timeout com AbortController
```javascript
async function fetchWithTimeout(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`);
    return await res.json();
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') 
      throw new Error(`Timeout: a API não respondeu em ${timeoutMs/1000}s`);
    throw err;
  }
}
```

#### Cenários e Respostas

| Cenário | Comportamento do sistema |
|---------|-------------------------|
| API fora do ar | `catch` captura o erro de rede → exibe card vermelho com mensagem e botão "Tentar novamente" |
| Timeout (> 8s) | `AbortController.abort()` cancela a requisição → toast notifica o usuário |
| HTTP 404 | `!res.ok` lança `Error("HTTP 404")` → capturado pelo `catch` e exibido ao usuário |
| HTTP 500 | Mesmo tratamento do 404 |
| Mudança no formato do JSON | Apenas a camada Model precisa ser atualizada; View e Controller permanecem intocados |
| Requisições duplicadas | Cache local (`commentCache{}`) evita chamadas repetidas para o mesmo `postId` |

---

### 2.9 Mapeamento REST → Funcionalidades

| Verbo HTTP | Endpoint | Funcionalidade |
|------------|----------|---------------|
| `GET` | `/users` | Carregar lista de colaboradores na sidebar |
| `GET` | `/posts?userId={id}` | Carregar postagens do colaborador selecionado |
| `GET` | `/comments?postId={id}` | Expandir comentários de uma postagem |

> **Nota:** O protótipo utiliza apenas o verbo `GET` (leitura). Em produção, seriam adicionados `POST` (criar postagem/comentário), `PUT/PATCH` (editar) e `DELETE` (remover).

---

### 2.10 Plano de Evolução (Roadmap)

**Fase 1 — MVP (concluída)**
- ✅ Protótipo funcional com JSONPlaceholder
- ✅ Arquitetura MVC implementada
- ✅ Tratamento completo de erros de rede

**Fase 2 — Alpha**
- → Substituir JSONPlaceholder por backend Node.js + PostgreSQL próprio
- → Autenticação com JWT
- → Apenas a camada Model precisa ser reescrita

**Fase 3 — Beta**
- → Notificações em tempo real (WebSocket)
- → Upload de anexos em postagens
- → Painel administrativo de usuários

---

### 2.11 Custo e Viabilidade

| Item | Custo no MVP |
|------|-------------|
| Backend / banco de dados | R$ 0 (JSONPlaceholder) |
| Hospedagem (protótipo estático) | R$ 0 (GitHub Pages ou similar) |
| Frameworks ou licenças | R$ 0 (HTML/CSS/JS puro) |
| Tempo até protótipo funcional | 1 sprint |

A escolha da API JSONPlaceholder como servidor simulado permitiu validar toda a arquitetura cliente-servidor e o padrão MVC sem nenhum custo de infraestrutura, reduzindo drasticamente o risco técnico e financeiro da fase inicial.

---

*Documento gerado com auxílio do Claude (Anthropic) — IntraNet Dashboard v1.0*
