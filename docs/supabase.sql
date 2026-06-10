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
  avaliacao     jsonb,                          -- avaliação IMMS + preferência de jogos
  concluido     boolean default false
);

-- adiciona coluna avaliacao se a tabela já existia sem ela
alter table sessao add column if not exists avaliacao jsonb;

-- 2) Resultado por jogo (1 linha por jogo jogado)
create table if not exists resultado_jogo (
  id        uuid primary key default gen_random_uuid(),
  codigo    text not null,                      -- mesmo código da sessão
  jogo      text not null,                      -- quiz | infinito | explorador | construtor
  metricas  jsonb,                              -- métricas calculadas pelo jogo
  criado_em timestamptz default now()
);

-- 3) Códigos de participação (pré-gerados pelo admin; Opção 1)
create table if not exists codigos (
  codigo    text primary key,
  criado_em timestamptz default now(),
  usado     boolean default false
);

-- ============================================================
--  Segurança (RLS)
--
--  IMPORTANTE: o PostgREST (Supabase REST API) precisa de uma
--  política SELECT para o papel anon conseguir encontrar a linha
--  antes de executar UPDATE. Sem ela, .update().eq(...) não acha
--  nenhuma linha e retorna 0 rows affected — silenciosamente.
--
--  Os dados da sessão já são anônimos (sem nome, e-mail etc.),
--  então expor SELECT para anon não representa risco real.
--
--  Rode este bloco inteiro. É idempotente (pode rodar de novo).
-- ============================================================

alter table sessao         enable row level security;
alter table resultado_jogo enable row level security;

-- limpa políticas antigas (evita conflito ao re-rodar)
drop policy if exists "anon insere sessao"    on sessao;
drop policy if exists "anon le sessao"        on sessao;
drop policy if exists "anon atualiza sessao"  on sessao;
drop policy if exists "admin le sessao"       on sessao;
drop policy if exists "anon insere resultado" on resultado_jogo;
drop policy if exists "anon le resultado"     on resultado_jogo;
drop policy if exists "admin le resultado"    on resultado_jogo;

-- participante: cria, lê e atualiza sessão
-- (anon + authenticated para funcionar mesmo se um admin estiver logado)
create policy "anon insere sessao"
  on sessao for insert to anon, authenticated with check (true);

-- SELECT necessário: PostgREST filtra via SELECT antes de fazer UPDATE
create policy "anon le sessao"
  on sessao for select to anon, authenticated using (true);

create policy "anon atualiza sessao"
  on sessao for update to anon, authenticated using (true) with check (true);

-- participante: insere e lê resultados de jogo
create policy "anon insere resultado"
  on resultado_jogo for insert to anon, authenticated with check (true);
create policy "anon le resultado"
  on resultado_jogo for select to anon, authenticated using (true);

-- admin autenticado: leitura dos dados (para o painel / export)
-- (as políticas anon acima já cobrem authenticated, mas deixamos explícito)
create policy "admin le sessao"
  on sessao for select to authenticated using (true);
create policy "admin le resultado"
  on resultado_jogo for select to authenticated using (true);

-- códigos: participante valida (select) e marca usado (update);
-- admin gera (insert). Códigos não são dado sensível.
alter table codigos enable row level security;

drop policy if exists "valida codigo"     on codigos;
drop policy if exists "marca usado"       on codigos;
drop policy if exists "admin gera codigo" on codigos;

create policy "valida codigo"
  on codigos for select to anon, authenticated using (true);
create policy "marca usado"
  on codigos for update to anon, authenticated using (true) with check (true);
create policy "admin gera codigo"
  on codigos for insert to authenticated with check (true);

-- conferência: deve listar as políticas acima
-- select tablename, policyname, cmd, roles from pg_policies
-- where tablename in ('sessao','resultado_jogo','codigos') order by tablename, cmd;
