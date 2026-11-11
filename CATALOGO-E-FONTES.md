# Teca Academia 3.5 — Curadoria de aulas de João Bolognesi

**Escopo real:** o levantamento consultou o arquivo da categoria YouTube do blog pessoal do professor, a playlist de Português do Qconcursos e playlists temáticas de Correios, IBGE e Transpetro. Não houve acesso a uma listagem integral e confiável de todos os uploads do canal do professor, nem visualização/escuta integral de todos os vídeos. As classificações foram feitas por título, autoria indicada, descrição pública e contexto do blog. Títulos genéricos e aulas sem docente confirmado não foram mapeados para erros automaticamente. Vídeos podem mudar de disponibilidade no futuro. Registros de portal que redirecionam são mantidos apenas como referência, não assegurados para reprodução.

**Fontes públicas verificadas em 11/11/2026**

- https://joaobolognesi.wordpress.com/category/youtube/
- https://joaobolognesi.wordpress.com/category/crase/
- https://joaobolognesi.wordpress.com/category/regencia-verbal/
- https://joaobolognesi.wordpress.com/category/pontuacao/
- https://joaobolognesi.wordpress.com/2017/06/09/revisao-vunesp/
- https://www.qconcursos.com/playlist/portugues-para-concursos-publicos-dk_
- https://www.qconcursos.com/playlist/concurso-correios-o1l
- https://www.qconcursos.com/playlist/concurso-ibge-hrk
- https://www.qconcursos.com/playlist/concurso-transpetro-e1r
- Anexo VIII, p. 61, Edital 02/2026, TJSP2607: 16 questões, 13 tópicos de Português.

**Implementação:** os IDs `u4` a `u76` das 19 atividades de Português existentes no currículo remoto foram ligados manualmente a assuntos identificados. Para cada erro, a Teca conserva o feedback de sua própria questão e traz, só depois, vídeos verificáveis sobre o tópico, com links para fontes externas. A transferência escrita e a revisão espaçada permanecem. Sem vídeo comprovado, a Teca diz claramente que falta cobertura; não substitui pela aula errada. O mini-simulado também recomenda apoio no resumo de questões erradas, sem alterar a pontuação já armazenada. Conteúdo da biblioteca é código público estático; nenhuma migração SQL necessária. Não há reprodução automática nem concessão de XP por vídeo.

**Dados para auditoria:** `bolognesi-catalogo.json`, `catalogo-de-videos.csv` e `bolognesi-library.js`. Para ampliar o acervo, edite estes dados, certifique-se de que o vídeo e a autoria conferem, registre a fonte e, se for o caso, associe a um ID em `lessonMap`.

**Nota:** Esta aplicação é independente do professor, do Qconcursos, da Vunesp e do TJ-SP. Os vídeos são apenas links externos; não foram copiados, baixados ou reeditados.
