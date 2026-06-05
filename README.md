# TCC — Binário & Estilos de Jogo

Aplicação web (React + Vite) para um estudo experimental que investiga como diferentes
estilos de jogo (perfis de Bartle) se relacionam com o aprendizado de **sistema binário**.

## Documentação
- 📘 **[docs/visao-geral.md](docs/visao-geral.md)** — visão geral, fluxo, arquitetura, status e como testar.
- 📋 **[docs/questionarios.md](docs/questionarios.md)** — TCLE, questionários e esquema de dados.

## Rodando

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run lint
```

## Status atual
**Etapa 1 concluída** — fluxo completo do estudo navegável (entrada → TCLE → demográfico →
pré-teste → 4 jogos em ordem aleatória → pós-teste → encerramento) + modo admin com acesso
livre. Ainda **sem backend**: a sessão é registrada no `console` ao final do fluxo.

Próximas etapas (captura de métricas dos jogos, Supabase e área de admin) estão descritas
em [docs/visao-geral.md](docs/visao-geral.md#status--roadmap).
