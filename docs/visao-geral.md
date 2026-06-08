# Visão Geral do Projeto — TCC: Binário & Estilos de Jogo

Aplicação web (React + Vite) para um **estudo experimental** que investiga como diferentes
estilos de jogo (perfis de Bartle) se relacionam com o aprendizado de **sistema binário**.

> 📄 Conteúdo dos formulários (TCLE, demográficos, teste de binário) e esquema de dados:
> ver [questionarios.md](./questionarios.md).

---

## Como rodar

```bash
npm install      # instala dependências
npm run dev      # ambiente de desenvolvimento (abre em http://localhost:5173)
npm run build    # gera build de produção em dist/
npm run preview  # serve o build para conferência
npm run lint     # checagem de lint
```

Requisitos: Node.js (18+). Não há backend ainda — ver "Status / Roadmap".

---

## O estudo em uma frase

Cada participante entra com um **código anônimo**, aceita o termo, responde dados
demográficos e um **pré-teste** de binário, joga **4 jogos** (um por perfil de Bartle, em
**ordem aleatória**) e responde um **pós-teste**. Comparando pré × pós e cruzando com o
perfil de Bartle (coletado **fora** do app), mede-se o aprendizado por estilo de jogador.

### Dois tipos de usuário
- **Participante** — segue o fluxo linear completo (não escolhe os jogos).
- **Admin** — entra por login e joga qualquer jogo livremente (sem o fluxo do estudo).

---

## Fluxo do participante

```
entrada (código)
  → TCLE  ──(recusa)──► encerramento
  → dados demográficos
  → pré-teste de binário (Forma A)
  → transição ("começar os jogos")
  → jogos em ORDEM ALEATÓRIA: Quiz · Torre · Ruínas · Forja
  → pós-teste de binário (Forma B)
  → encerramento
```

## Fluxo do admin

```
entrada → login → Hub (escolhe qualquer jogo) → joga → volta ao Hub → "Sair"
```

---

## Os 4 jogos (cenários) e os perfis de Bartle

| Jogo | Arquivo | Perfil | Mecânica |
|---|---|---|---|
| 🕵️ Quiz Hacker | [Quiz.jsx](../src/Quiz.jsx) | Competidor | múltipla escolha (firewall), vidas, streak |
| 📡 Torre da Transmissão | [Infinito.jsx](../src/Infinito.jsx) | Conquistador | ativar bits, 30s, energia, andares |
| 🧭 Ruínas Binárias | [Explorador.jsx](../src/Explorador.jsx) | Explorador | regiões, portais, relíquias |
| 🔥 Forja Digital | [Construtor.jsx](../src/Construtor.jsx) | Socializador | ajudar NPCs montando núcleos |

---

## Estrutura de arquivos (`src/`)

**Fluxo / controle**
- [App.jsx](../src/App.jsx) — controlador: máquina de estados do fluxo (participante/admin) e o acumulador de sessão.
- [Entrada.jsx](../src/Entrada.jsx) — tela inicial: código do participante ou login do admin.
- [Tcle.jsx](../src/Tcle.jsx) — termo de consentimento (aceitar/recusar).
- [Demografico.jsx](../src/Demografico.jsx) — questionário demográfico.
- [TesteBinario.jsx](../src/TesteBinario.jsx) — teste de binário reutilizável (Forma A = pré, Forma B = pós).
- [Transicao.jsx](../src/Transicao.jsx) — tela de transição para os jogos.
- [Encerramento.jsx](../src/Encerramento.jsx) — tela final (conclusão ou recusa).

**Compartilhado**
- [Tela.jsx](../src/Tela.jsx) — shell visual (fundo + card) das telas do fluxo.
- [estilos.js](../src/estilos.js) — estilos de botão compartilhados.

**Jogos**
- [Hub.jsx](../src/Hub.jsx) — menu (usado apenas no modo admin).
- [Quiz.jsx](../src/Quiz.jsx), [Infinito.jsx](../src/Infinito.jsx), [Explorador.jsx](../src/Explorador.jsx), [Construtor.jsx](../src/Construtor.jsx).

---

## Decisões já tomadas
- **Backend:** Supabase (salvar online, export CSV). *Ainda não integrado.*
- **Ligação Bartle ↔ estudo:** **Opção 1 — código pré-gerado** pelo pesquisador; o mesmo
  código é usado no Bartle (externo) e no app; cruzamento na planilha por `codigo`.
- **Bartle:** coletado **fora** do app (por enquanto).
- **Ordem dos jogos:** aleatória por participante.
- **Construto medido (pré/pós):** conhecimento de binário.
- **Anonimato:** nenhum dado identificável (sem nome, e-mail, CPF, matrícula).

---

## Status / Roadmap

### ✅ Etapa 1 — Esqueleto do fluxo (concluída)
- Máquina de estados no App, telas de entrada/TCLE/demográfico/teste/transição/encerramento.
- Ordem aleatória dos jogos e avanço automático entre eles.
- Modo admin com acesso livre.
- A sessão é montada em memória e, ao final, **registrada no console** (`Sessão concluída: {...}`).

### ✅ Etapa 2 — Captura de métricas dos jogos (concluída)
- Cada jogo recebe `aoConcluir(metricas)` e `modoEstudo`; ao terminar, reporta suas métricas
  para `sessao.resultados[jogo]` e avança (botão "Continuar →").
- O botão **"Voltar" fica oculto** durante os jogos no modo estudo (impede sair do fluxo);
  no modo admin continua visível ("Voltar ao Hub").
- O **Explorador** foi instrumentado: regiões visitadas, relíquias, desafios concluídos,
  acertos, erros (overshoot), precisão e tempo por área.
- Métricas por jogo (chaves em `sessao.resultados`):
  - **quiz:** acertos, erros, precisao, maiorStreak, pontos, tempoMedioResposta, totalFirewalls, venceu
  - **infinito:** acertos, erros, precisao, andarMaximo, modulosConcluidos, energiaFinal, energiaMedia, maiorSequencia, tempoSessao
  - **explorador:** regioesVisitadas, reliquiasEncontradas, desafiosConcluidos, acertos, erros, precisao, tempoPorArea, tempoTotal
  - **construtor:** artefatosConcluidos, missoesAtendidas, acertos, erros, tentativas, tempoMedioConstrucao, eficiencia

### ✅ Etapa 3 — Persistência (Supabase) (concluída — requer rodar o SQL)
- Cliente em [supabaseClient.js](../src/supabaseClient.js) (chaves anon públicas, protegidas por RLS).
- Camada de dados em [dados.js](../src/dados.js): grava a sessão de forma **incremental**
  (cria no consentimento, atualiza demográfico/pré/pós, insere 1 linha por jogo) com
  **buffer offline** (reenvia o que falhar quando a conexão voltar).
- **Ação necessária:** rodar [docs/supabase.sql](./supabase.sql) no SQL Editor do Supabase
  para criar as tabelas `sessao` e `resultado_jogo` e as políticas de RLS.
- Por ora o código é **aceito sem validação** (qualquer texto) — o cruzamento com o Bartle
  externo é feito por `codigo` na planilha. Validação por lista fica para quando definirmos.

### ⏳ Etapa 4 — Admin (próxima sessão)
1. **Login real de admin** via Supabase Auth (`signInWithPassword`) — substitui o stub atual.
2. **Reativar o RLS do jeito certo** (hoje está **desligado** na `sessao`):
   - anônimo: INSERT/UPDATE (grava); **sem** SELECT.
   - admin autenticado: SELECT (lê tudo).
3. **Painel do admin**: listar `sessao` + `resultado_jogo` e **exportar CSV**.

**Decisões pendentes pra começar:**
- E-mail do usuário admin (criar em Authentication → Users no Supabase).
- Formato do CSV: separado (`sessao.csv` + `resultado_jogo.csv`) ou achatado (1 linha/participante).
- Painel só listar+exportar, ou com filtros/busca.

⚠️ **Estado atual de segurança:** o RLS da `sessao` foi **desativado** (`alter table sessao
disable row level security;`) para destravar a gravação. Reativar corretamente é o passo 2
acima — importante antes de a coleta real ir pro ar com o repositório público.

---

## Limitações conhecidas (estado atual)
- **As tabelas precisam existir:** rode [docs/supabase.sql](./supabase.sql) no Supabase antes
  de coletar. Sem isso, os envios falham e ficam no buffer offline (e há avisos no console).
- **Login admin é stub:** aceita qualquer usuário/senha (Etapa 4).
- **Sem leitura/exportação no app ainda:** os dados aparecem no painel do Supabase
  (Table Editor / export CSV). Tela de admin + login real são a Etapa 4.
- Lint aponta 2 itens `set-state-in-effect` no [Explorador.jsx](../src/Explorador.jsx) (estruturais,
  da forma como o jogo foi escrito) — não quebram nada; eventual refatoração futura.

---

## Como testar o fluxo
1. `npm run dev`
2. **Participante:** digite um código qualquer (ex.: `TCC-0001`) → percorra TCLE → demográfico
   → pré-teste → os 4 jogos (ordem aleatória) → pós-teste → encerramento. Abra o **console do
   navegador** (F12) para ver a sessão registrada ao final.
3. **Admin:** clique em "Sou administrador" → qualquer usuário/senha → Hub livre.
