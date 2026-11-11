# Teca Academia 3.2 — TJ-SP / GitHub Pages

## Correção das missões que não abriam (3.2)

Se a versão 3.0 foi aberta quando os arquivos `data/lessons.js` não carregavam, ela salvou o plano do dia com IDs vazios (`id: ""`). Na versão 3.1, mesmo após carregar todas as aulas, os botões "Começar" ainda não encontravam o conteúdo e nada acontecia.

**A versão 3.2 valida as missões salvas e reconstrói automaticamente apenas planos inválidos.** Ela mantém o histórico, o XP, os intervalos de revisão e as missões válidas, sem exigir limpeza dos dados do navegador. Também mostra uma mensagem e regenera o plano se um botão tentar abrir algum identificador obsoleto.

**Como testar:** abra a tela inicial e confirme que cada missão mostra um título concreto de aula (não "Conteúdo disponível"). Clique em cada botão "Começar": deve abrir uma questão com alternativas e campo de justificativa.

## Correção crítica

A versão 3.0 podia abrir a interface, mas mostrar **0 de 0 princípios** e calendário vazio quando `data/lessons.js` e `data/events.js` não eram enviados para o GitHub Pages, eram publicados fora da pasta `data/`, ou eram carregados de uma versão antiga em cache.

A 3.2 coloca **113 desafios**, **14 eventos datados do edital** e **3 eventos aguardando publicação** diretamente dentro de `index.html`. Assim, as trilhas e calendário funcionam mesmo que os arquivos auxiliares não sejam enviados. O pacote também mostra os quatro próximos marcos do edital e uma lista cronológica de eventos, independentemente do dia selecionado.

## Atualização do repositório existente

1. Faça backup do estado atual, criando uma branch no GitHub; se o app antigo tiver XP, abra Ajustes > Exportar progresso.
2. Envie **`index.html`** para a raiz do repositório, substituindo o antigo.
3. Substitua também **`sw.js`** para corrigir a política de cache (agora tenta a rede antes do cache).
4. Envie `calendario_tjsp2607.ics`, `manifest.webmanifest` e `assets/icon.svg` para manter a experiência de calendário e instalação no celular.
5. A pasta `fonte-editavel/` é **opcional**. Ela contém os arquivos de desenvolvimento e NÃO precisa estar publicada.
6. Em Settings → Pages, confirme a publicação pela branch `main` e pasta raiz (`/ (root)`). Aguarde o deploy efetivo, confira a URL publicada e atualize a página. Se continuar vendo a versão antiga por cache do navegador, abra em aba anônima ou remova o site instalado da tela inicial e abra novamente pelo navegador.

**Não apague sua conta/repositório GitHub e não apague o armazenamento local do navegador sem exportar o progresso.** A chave de progresso é a mesma da versão 3.0 (`teca_academia_v3_tjsp2607`).

## Testes esperados

- Aba Trilhas: Português, Direito, Lógica, Matemática, Informática, Gerais e Redação com contagens **maiores que zero** e aulas acessíveis.
- Clique em Abrir trilha > primeira aula: questão, justificativa obrigatória, gabarito comentado, transferência e XP.
- Aba Calendário: marcos de 10/12/2026, 11/12/2026, 14/03/2027 e 17/03/2027; 14 eventos em lista; 3 eventos sem data; exportação `.ics`.
- Celular: navegação inferior, calendário mensal, lista de eventos e salvamento local.

## Cobertura e limitações

Os 113 desafios foram recuperados da apostila interativa anterior e são **introdutórios**. Não equivalem a 100% do conteúdo exigido no edital. Para legislação, o texto legal atualizado e as retificações oficiais prevalecem.

Fonte do calendário: Edital de abertura TJ-SP nº 02/2026, código TJSP2607, especialmente páginas 11–13, 27–28 e 53. Prova e gabarito têm **datas previstas**; a hora exata da prova ainda não foi divulgada no edital. Verifique mudanças em https://www.vunesp.com.br/TJSP2607.

O arquivo `.ics` registra eventos de dia inteiro e inclui horários informados como descrições, para não inventar horários nem dar precisão indevida. O app não envia notificações push com o site fechado; os lembretes dependem do calendário do telefone. Não há sincronização automática entre dispositivos.
