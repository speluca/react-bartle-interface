-- ============================================================
--  Estrutura do banco do estudo (rodar no Supabase: SQL Editor)
--  Menu lateral → SQL Editor → New query → cole tudo → Run
-- ============================================================

-- 1) Sessão do participante (1 linha por participante)
create table if not exists sessao (
  id            uuid primary key default gen_random_uuid(),
  codigo        text unique not null,          -- chave anônima (liga ao Bartle externo)
  criado_em     timestamptz default now(),
  consentiu     boolean,                        -- aceitou o TCLE
  demografico   jsonb,                          -- respostas demográficas
  pre_score     int,                            -- acertos no pré-teste
  pre_respostas jsonb,
  pos_score     int,                            -- acertos no pós-teste
  pos_respostas jsonb,
  ordem_jogos   jsonb,                          -- ordem aleatória sorteada
  concluido     boolean default false
);

-- 2) Resultado por jogo (1 linha por jogo jogado)
create table if not exists resultado_jogo (
  id        uuid primary key default gen_random_uuid(),
  codigo    text not null,                      -- mesmo código da sessão
  jogo      text not null,                      -- quiz | infinito | explorador | construtor
  metricas  jsonb,                              -- métricas calculadas pelo jogo
  criado_em timestamptz default now()
);

-- ============================================================
--  Segurança (RLS)
--  Participante (anônimo): só INSERE/ATUALIZA — não consegue LER.
--  Leitura/relatórios: apenas admin autenticado (Etapa 4).
-- ============================================================

alter table sessao        enable row level security;
alter table resultado_jogo enable row level security;

-- participantes anônimos podem criar/atualizar a própria sessão
create policy "anon insere sessao"
  on sessao for insert to anon with check (true);

create policy "anon atualiza sessao"
  on sessao for update to anon using (true) with check (true);

-- participantes anônimos podem inserir resultados de jogo
create policy "anon insere resultado"
  on resultado_jogo for insert to anon with check (true);

-- (Opcional, Etapa 4) leitura para administradores autenticados:
-- create policy "admin le sessao"
--   on sessao for select to authenticated using (true);
-- create policy "admin le resultado"
--   on resultado_jogo for select to authenticated using (true);
