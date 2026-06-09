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

-- 3) Códigos de participação (pré-gerados pelo admin; Opção 1)
create table if not exists codigos (
  codigo    text primary key,
  criado_em timestamptz default now(),
  usado     boolean default false
);

-- ============================================================
--  Segurança (RLS) — Etapa 4 (versão final)
--  Participante (anônimo): só INSERE/ATUALIZA — NÃO consegue LER.
--  Admin (autenticado): consegue LER (SELECT) tudo.
--
--  Rode este bloco inteiro. É idempotente (pode rodar de novo sem erro).
-- ============================================================

alter table sessao        enable row level security;
alter table resultado_jogo enable row level security;

-- limpa políticas antigas (evita conflito ao re-rodar)
drop policy if exists "anon insere sessao"    on sessao;
drop policy if exists "anon atualiza sessao"  on sessao;
drop policy if exists "admin le sessao"       on sessao;
drop policy if exists "anon insere resultado" on resultado_jogo;
drop policy if exists "admin le resultado"    on resultado_jogo;

-- participante: cria e atualiza a própria sessão
-- (anon + authenticated para funcionar mesmo se um admin estiver logado no navegador)
create policy "anon insere sessao"
  on sessao for insert to anon, authenticated with check (true);
create policy "anon atualiza sessao"
  on sessao for update to anon, authenticated using (true) with check (true);

-- participante: insere resultados de jogo
create policy "anon insere resultado"
  on resultado_jogo for insert to anon, authenticated with check (true);

-- admin autenticado: leitura dos dados (para o painel / export)
create policy "admin le sessao"
  on sessao for select to authenticated using (true);
create policy "admin le resultado"
  on resultado_jogo for select to authenticated using (true);

-- códigos: participante valida (select) e marca usado (update);
-- admin gera (insert). Códigos não são dado sensível (são distribuídos).
alter table codigos enable row level security;

drop policy if exists "valida codigo"  on codigos;
drop policy if exists "marca usado"    on codigos;
drop policy if exists "admin gera codigo" on codigos;

create policy "valida codigo"
  on codigos for select to anon, authenticated using (true);
create policy "marca usado"
  on codigos for update to anon, authenticated using (true) with check (true);
create policy "admin gera codigo"
  on codigos for insert to authenticated with check (true);

-- conferência: deve listar as 5 políticas acima
-- select tablename, policyname, cmd, roles from pg_policies
-- where tablename in ('sessao','resultado_jogo') order by tablename;
