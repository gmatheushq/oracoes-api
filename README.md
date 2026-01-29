# oracoes-api

API de orações em Português (PT) e Latim (LA).

## Rodar local

```bash
npm install
npm run dev
```

- Health: `http://localhost:3000/health`
- Lista: `http://localhost:3000/oracoes`
- Detalhe: `http://localhost:3000/oracoes/{id}`

## Swagger (documentação interativa)

Em desenvolvimento, o Swagger fica disponível em:

- `http://localhost:3000/docs`

Em produção, por padrão o Swagger fica **desativado**. Para ativar:

```bash
SWAGGER_ENABLED=true npm start
```
