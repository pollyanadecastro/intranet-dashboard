# IntraNet — Dashboard de Comunicação Interna

Protótipo desenvolvido com HTML5, CSS3 e JavaScript puro. Arquitetura MVC consumindo a API pública JSONPlaceholder.

## Como rodar

Abra o arquivo `index.html` diretamente no navegador. Não requer instalação, build ou servidor.

## Estrutura

```
intranet-dashboard/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── model/api.js
│   ├── controller/app.js
│   └── view/render.js
└── assets/
```

## Endpoints consumidos

- `GET /users`
- `GET /posts?userId={id}`
- `GET /comments?postId={id}`
