# Estudo TCC — Fluxo, Questionários e Dados

Documento de referência para a coleta. Conteúdo dos formulários é **rascunho** — editar à vontade.

---

## Visão geral do fluxo

**Participante** (anônimo):
```
TCLE (recusa = encerra) → dados demográficos → pré-teste de binário
→ despedida/transição → jogos (ordem aleatória) → pós-teste de binário → encerramento
```

**Admin** (login):
```
login → acesso livre (joga qualquer jogo) → [futuro] visualizar/exportar dados
```

- **Backend:** Supabase (Postgres hospedado, auth de admin, export CSV). Salvar online.
- **Construto medido (pré/pós):** conhecimento de sistema binário (mede o ganho de aprendizado).
- **Ordem dos jogos:** aleatória por participante (a ordem sorteada é registrada nos dados).

### 🔗 Ligação Bartle ↔ estudo — Opção 1 (código pré-gerado) ✅
- O pesquisador gera previamente uma lista de **códigos únicos** (ex.: `TCC-0001`, `TCC-0002`…).
- Cada participante recebe um código e usa o **mesmo** no formulário do Bartle (externo) e no app.
- O app **valida** o código contra a lista e **carimba** todas as respostas/métricas com ele.
- A junção com o Bartle é feita **na planilha**, pela coluna `codigo`.
- Recomendação: no formulário do Bartle, usar **lista suspensa** (não texto livre) para reduzir erro de digitação.
- Evoluções futuras possíveis: QR/link pré-preenchido (Opção 3), import do perfil no backend (Opção 4), ou Bartle dentro do app (Opção 6).

---

## 1. TCLE — Termo de Consentimento Livre e Esclarecido
*(modelo — preencher os `[colchetes]`)*

> **Termo de Consentimento Livre e Esclarecido**
>
> Você está sendo convidado(a) a participar da pesquisa **"[título]"**, conduzida por **[pesquisador]**, da **[instituição]**, que investiga como diferentes estilos de jogo influenciam o aprendizado do sistema binário.
>
> **O que você fará:** responder a um questionário inicial (dados demográficos e conhecimento sobre binário), jogar e, ao final, responder a um questionário rápido. Tempo estimado: **[~X min]**.
>
> **Anonimato:** a participação é **anônima**. Não coletamos nome, e-mail, CPF, matrícula ou qualquer dado que identifique você. Os resultados serão usados apenas de forma agregada, para fins acadêmicos.
>
> **Voluntariedade:** sua participação é voluntária; você pode desistir a qualquer momento, sem prejuízo.
>
> **Riscos/benefícios:** os riscos são mínimos; o benefício é contribuir para pesquisas em educação e gamificação.
>
> **Contato:** [e-mail do pesquisador].
>
> ☐ **Li e concordo em participar** &nbsp;&nbsp; [ Não aceito ]

- **"Não aceito"** → encerra o estudo imediatamente (registra apenas a recusa, sem coletar mais nada).

---

## 2. Dados demográficos
*(apenas opções fechadas, sem nada que identifique o participante)*

1. **Faixa etária:** até 17 · 18–24 · 25–34 · 35–44 · 45+
2. **Gênero:** Feminino · Masculino · Outro · Prefiro não informar
3. **Escolaridade:** Ensino médio · Superior em andamento · Superior completo · Pós-graduação
4. **Área de formação/estudo:** Exatas/Tecnologia · Saúde · Humanas · Outra
5. **Com que frequência você joga jogos digitais?** Nunca · Raramente · Às vezes · Frequentemente · Diariamente
6. **Familiaridade prévia com sistema binário:** Nenhuma · Básica · Intermediária · Avançada

---

## 3. Teste de conhecimento de binário (pré e pós)

**Formas paralelas** (perguntas equivalentes, valores diferentes) para evitar efeito de memória:
- **Forma A → pré-teste**
- **Forma B → pós-teste**

Nível **tranquilo/introdutório**. A alternativa correta está marcada com **✓** (oculta para o participante no app).
**Pontuação:** nº de acertos (0–6). **Ganho de aprendizado:** pós − pré.

### Forma A — pré
1. Quais algarismos são usados no sistema binário? **0 e 1 ✓** · 0 a 9 · 1 e 2 · 0, 1 e 2
2. Qual o valor decimal de `10₂`? 1 · **2 ✓** · 10 · 0
3. Qual o valor decimal de `11₂`? 2 · **3 ✓** · 4 · 11
4. Qual é o número **2** em binário? **10 ✓** · 01 · 11 · 00
5. Qual o valor decimal de `101₂`? 4 · **5 ✓** · 6 · 101
6. Qual número binário é maior? `01₂` · **`11₂` ✓** · `10₂` · `00₂`

### Forma B — pós
1. Quantos algarismos diferentes o sistema binário possui? **2 ✓** · 8 · 10 · 16
2. Qual o valor decimal de `01₂`? **1 ✓** · 2 · 10 · 0
3. Qual o valor decimal de `100₂`? 3 · **4 ✓** · 5 · 100
4. Qual é o número **3** em binário? 10 · **11 ✓** · 01 · 00
5. Qual o valor decimal de `110₂`? 5 · **6 ✓** · 7 · 110
6. Qual número binário é maior? `10₂` · **`11₂` ✓** · `01₂` · `00₂`

> O **pós-questionário** contém **apenas** este teste (Forma B). **Não** repete TCLE nem dados demográficos.

---

## 4. Despedida / transição (fim do pré, início dos jogos)

> ✅ **Tudo certo!** Suas respostas foram registradas. Agora começa a parte divertida: você vai **jogar**, e todos os jogos envolvem **números binários**. Jogue no seu ritmo — ao terminar, há um questionário rápido final. **Boa sorte!** 🎮

---

## 5. Encerramento final (depois do pós-teste)

> 🏁 **Estudo concluído!** Muito obrigado pela sua participação. Seus dados foram salvos de forma **anônima** e ajudarão a pesquisa. Você já pode fechar a janela.

---

## 6. Esquema de dados (o que vai para a planilha)

**Tabela `sessao`** — 1 por participante:
| campo | descrição |
|---|---|
| `codigo` | chave anônima do participante (ligação com o Bartle — em standby) |
| `data_hora` | início da sessão |
| `consentiu` | aceitou o TCLE (sim/não) |
| `demografico` | respostas demográficas (JSON) |
| `pre_score` | acertos no pré-teste (0–6) |
| `pos_score` | acertos no pós-teste (0–6) |
| `ordem_jogos` | ordem aleatória sorteada dos jogos |
| `concluido` | terminou todo o fluxo (sim/não) |

**Tabela `resultado_jogo`** — 1 por jogo jogado:
| campo | descrição |
|---|---|
| `codigo` | mesmo código da sessão |
| `jogo` | qual jogo (quiz / torre / ruínas / forja) |
| `metricas` | métricas que o jogo já calcula (JSON) |
| `data_hora` | quando foi jogado |

**Análise final:** cruzar com o resultado do **Bartle externo** pela chave `codigo` (mecanismo a definir).

### Métricas por jogo (já calculadas hoje nos cenários)
- **Quiz Hacker (Competidor):** acertos, erros, precisão, maior streak, pontuação final, tempo médio de resposta.
- **Torre da Transmissão (Conquistador):** acertos, erros, precisão, andar máximo, módulos concluídos, energia final, energia média, maior streak, tempo de sessão.
- **Ruínas Binárias (Explorador):** regiões visitadas, relíquias encontradas, desafios concluídos, acertos, erros, precisão, tempo por área.
- **Forja Digital (Socializador):** missões/artefatos concluídos, acertos, erros, tentativas, tempo de construção, eficiência das soluções.
