# IntraNet — Dashboard de Comunicação Interna

Protótipo acadêmico de um Dashboard de Comunicação Interna desenvolvido com HTML5, CSS3 e JavaScript puro, consumindo a API REST pública [JSONPlaceholder](https://jsonplaceholder.typicode.com) como backend simulado.

---

## Funcionalidades

- Listagem de colaboradores com busca em tempo real
- Visualização de postagens por colaborador
- Expansão de comentários por postagem
- Skeleton loading durante requisições
- Tratamento de erros de rede com mensagem amigável e botão de nova tentativa
- Timeout de 8 segundos em todas as chamadas à API
- Indicador de status de conectividade com a API
- Notificações toast para feedback do usuário

---

## Tecnologias

- HTML5
- CSS3
- JavaScript puro (sem frameworks)
- [JSONPlaceholder](https://jsonplaceholder.typicode.com) — API REST pública para prototipagem

---

## Arquitetura

O projeto segue o padrão **MVC (Model-View-Controller)**:

```
js/
├── model/
│   └── api.js         → comunicação com a API, timeout e tratamento de erros
├── view/
│   └── render.js      → geração do HTML da interface
└── controller/
    └── app.js         → coordenação entre Model e View
```

---

## Estrutura de Pastas

```
intranet-dashboard/
├── css/
│   └── style.css
├── js/
│   ├── controller/
│   │   └── app.js
│   ├── model/
│   │   └── api.js
│   └── view/
│       └── render.js
├── index.html
└── README.md
```

---

## Como rodar

**Opção 1 — Live Server (VS Code)**

1. Instale a extensão **Live Server** no VS Code
2. Clique com o botão direito em `index.html`
3. Clique em **"Open with Live Server"**

**Opção 2 — Python**

```bash
python -m http.server 8080
```

Acesse: `http://localhost:8080`

**Opção 3 — Node.js**

```bash
npx serve .
```

> O arquivo não funciona abrindo diretamente pelo explorador de arquivos (`file://`) por restrições de CORS do navegador. Use sempre um servidor local.

---

## Endpoints consumidos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/users` | Lista de colaboradores |
| GET | `/posts?userId={id}` | Postagens de um colaborador |
| GET | `/comments?postId={id}` | Comentários de uma postagem |

---

## Resiliência de rede

Todas as requisições implementam:

- **Timeout de 8s** via `AbortController`
- **try/catch** para captura de erros de rede e códigos HTTP de erro
- **Cache local** de comentários para evitar requisições duplicadas
- **Feedback visual** em todos os estados de erro

---

## Licença

Projeto acadêmico — livre para uso educacional.
