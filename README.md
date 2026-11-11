# Teca Academia 3.0 — TJ-SP Escrevente 2026/2027

**Projeto estático pronto para publicar no GitHub Pages.** Feito para estudar os princípios das questões — não apenas memorizar letras de gabarito — com missões, XP, trilhas, autoexplicação, revisão espaçada e calendário do Edital 02/2026.

> **Versão 3.0 | 10/11/2026 | Concurso TJSP2607**. Este pacote é uma versão inicial funcional, não um preparatório completo ou uma fonte oficial de publicações. Verifique retificações e novos avisos sempre em https://www.vunesp.com.br/TJSP2607.

## Funcionalidades

- **113 desafios autorais introdutórios**, distribuídos entre Português, Direito, Lógica, Matemática, Informática, Gerais e Redação, reaproveitados da Teca Academia anterior.
- **Ciclo de estudo ativo**: tentar a questão → escrever justificativa → revelar gabarito e princípio → aplicar em outra situação → autoavaliar compreensão.
- **XP de aprendizagem**: pontos só ao completar todas as etapas, com limite de um registro remunerado por questão/dia. Missões diárias e três objetivos semanais geram bônus de XP.
- **Missões rotativas** de Direito, Português e outra área, mais uma revisão; desafio semanal exige variedade de matérias, dias e atividades.
- **Revisões espaçadas**: se um desafio foi resolvido com confiança, progride para intervalos de 1, 3, 7, 14 e 30 dias; se não, reaparece em 1 dia. Este é um algoritmo simples, não personalizado por evidência experimental.
- **Calendário do edital**: etapas, períodos, detalhes dos horários conhecidos, avisos de datas indefinidas e lembretes pessoais separados.
- **Arquivo `.ics`** para importar os prazos no Google Agenda, Apple Calendário ou outros apps; alguns eventos possuem `VALARM` para o dia anterior, sujeito às regras do calendário usado.
- **Instalação web app (PWA)** e cache offline após o primeiro carregamento em HTTPS; **progresso salvo localmente** e exportável em JSON.

## Publicar no GitHub Pages (sem pagar)

1. Crie um repositório no GitHub, por exemplo `teca-academia`.
2. Envie **os arquivos desta pasta para a raiz do repositório**, preservando os diretórios `assets/` e `data/`.
3. Em **Settings → Pages → Build and deployment**, escolha **Deploy from a branch** e a branch `main`, pasta `/ (root)`.
4. Acesse o endereço publicado, normalmente `https://SEU-USUARIO.github.io/teca-academia/`.
5. No celular, abra o site e use a opção **Adicionar à tela inicial** (ou **Instalar aplicativo**, quando aparecer).

Para testar localmente:

```bash
cd teca-academia-v3
python -m http.server 8000
# Abra http://localhost:8000
```

## Como atualizar o calendário após novos editais

Os eventos estão em **`data/events.js`**. Para cada evento, edite os campos:

```js
{
  id: "prova",
  title: "PROVA objetiva + redação",
  start: "2027-03-14",
  end: "2027-03-14",
  kind: "prova",
  status: "prevista",          // "confirmada" quando uma publicação oficial confirmar
  hour: "Período da tarde (horário exato a divulgar)",
  note: "Confirmar local/horário no edital de convocação",
  page: "27 e 53",
  link: "https://www.vunesp.com.br/TJSP2607",
  tags: ["geral"]
}
```

Os itens sem data ficam em `window.TECA_UNDATED`. **Nunca coloque uma data presumida como oficial.** Se mudar `events.js`, **atualize também** `calendario_tjsp2607.ics`: o calendário do site e o arquivo de importação são separados. A versão inicial do `.ics` contém apenas os eventos do edital de abertura, não os compromissos pessoais.

### Eventos-base do edital

- **28/10 a 10/12/2026** — inscrições, com início às 10h de 28/10 e encerramento às 23h59 de 10/12;
- **11/12/2026** — último dia para pagamento do boleto (atenção ao horário bancário);
- **14/03/2027** — prova objetiva e redação, **data prevista**, no período da tarde, duração máxima de cinco horas; horário exato a definir;
- **17/03/2027** — divulgação **prevista** do gabarito;
- **A definir** — convocação para consulta ao local e horário, recursos de gabarito, resultado final.

Contém também datas condicionais de redução de taxa, recursos e pedidos de atendimento especial. **Fonte:** Edital 02/2026, TJSP2607, pp. 11–13, 27–28, 47–48, 53, e Anexo VIII. A referência principal está na biblioteca de materiais do usuário; a Vunesp é a fonte canônica para eventuais atualizações.

## Limites importantes

- **Não há notificações push automáticas** com o site fechado. É necessário integrar um serviço e permitir notificações no celular para oferecer essa função. O arquivo `.ics` é a alternativa inicial sem backend.
- O progresso fica no `localStorage` do navegador e **não sincroniza entre computadores/celulares**. Use o backup JSON em **Backup e ajustes**.
- A validação de justificativas e transferências é só por **comprimento mínimo do texto**; o sistema **não verifica se o raciocínio está semanticamente correto**. Compare honestamente sua explicação com o feedback.
- As 113 questões são **material introdutório autoral**, não uma base completa nem questões oficiais da Vunesp; textos legais e alterações devem ser conferidos nas fontes oficiais. A preparação precisa incluir provas reais autorizadas e simulados inéditos.
- O método combina técnicas apoiadas por evidências, mas **a gamificação deste aplicativo não foi validada cientificamente como um todo** e não garante aprovação.

## Base pedagógica para a reconstrução

- **EUA / ciência cognitiva:** Dunlosky et al. (2013) — testes de recuperação e prática distribuída: https://www.psychologicalscience.org/publications/journals/pspi/learning-techniques.html
- **Metanálise internacional:** Donoghue & Hattie (2021) — síntese sobre técnicas de aprendizagem: https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2021.581216/full
- **Revisão metodológica:** Weinstein et al. (2018) — estratégias para aprender: https://pmc.ncbi.nlm.nih.gov/articles/PMC5780548/
- **Japão / Países Baixos:** ideias de resolução estruturada de problemas e abordagem contextual inspiram o modo de apresentação das atividades; não afirmamos que este é um programa oficial dessas nações.

## Arquivos

```text
index.html                 interface principal
styles.css                 aparência e adaptação ao celular
app.js                     motor de missões, XP, revisões e calendário
data/lessons.js            desafios introdutórios
data/events.js            eventos e metadados do Edital 02/2026
calendario_tjsp2607.ics    calendário importável no celular
manifest.webmanifest       instalação como web app
sw.js                      cache/offline básico
assets/icon.svg            ícone do aplicativo
README.md                  instruções e fontes
```

## Privacidade

Não são usados serviços externos de autenticação, analytics ou anúncios. URLs externas são apenas fontes e portais oficiais abertos pelo próprio usuário. Seus textos de justificativa **não são enviados a servidor**; o app salva progresso e resultados, não os textos livres das explicações.

### Por que não gamificar apenas por tempo?

XP de leitura pode criar a impressão de progresso sem testar aprendizagem. Aqui, a recompensa está vinculada a uma tentativa, justificativa, explicação da regra e transferência, mas a qualidade conceitual da resposta escrita ainda depende de autoavaliação. Uma próxima versão poderá usar rubricas ou correção por um professor/IA, mantendo privacidade e transparência.

**Fontes complementares:** abordagem japonesa de resolução estruturada de problemas: https://eric.ed.gov/?id=EJ961895 ; Educação Matemática Realística da Universidade de Utrecht: https://www.uu.nl/onderzoek/freudenthal-instituut/realistic-mathematics-education ; revisão sobre gamificação em aprendizagem: https://link.springer.com/article/10.1007/s11423-023-10337-7 .
