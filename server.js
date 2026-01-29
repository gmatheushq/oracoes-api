const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

// Swagger (docs interativa)
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Swagger ativo por padrão em dev. Em produção, só ativa se SWAGGER_ENABLED=true
const SWAGGER_ENABLED = process.env.SWAGGER_ENABLED === "true" || NODE_ENV !== "production";

const ORACOES = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "oracoes.json"), "utf8")
);

const app = express();
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(rateLimit({ windowMs: 60000, max: 120 }));

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Orações API", version: "1.0.0" }
  },
  apis: [__filename]
});

if (SWAGGER_ENABLED) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Healthcheck da API
 *     tags: [System]
 *     responses:
 *       200:
 *         description: OK
 */
app.get("/health", (_req, res) => res.json({ ok: true, count: ORACOES.length }));

/**
 * @openapi
 * /oracoes:
 *   get:
 *     summary: Lista todas as orações
 *     tags: [Orações]
 *     responses:
 *       200:
 *         description: Lista de orações
 */
app.get("/oracoes", (_req, res) => res.json(ORACOES));

/**
 * @openapi
 * /oracoes/{id}:
 *   get:
 *     summary: Busca uma oração por ID
 *     tags: [Orações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Oração encontrada
 *       404:
 *         description: Não encontrada
 */
app.get("/oracoes/:id", (req, res) => {
  const o = ORACOES.find((x) => x.id === req.params.id);
  if (!o) return res.status(404).json({ erro: "not_found" });
  res.json(o);
});

app.listen(PORT, () => {
  console.log(`✅ API rodando em http://localhost:${PORT}`);
  if (SWAGGER_ENABLED) console.log(`📚 Swagger em http://localhost:${PORT}/docs`);
});
