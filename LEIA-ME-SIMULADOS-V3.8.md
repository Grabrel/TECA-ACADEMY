# Teca Academia 3.8 — simulados reais e fixos (fase inicial)

## O que está funcional
- Quatro conjuntos fixos, iguais para qualquer conta: 70 questões por simulado (280 referências distintas no total).
- **Fontes**: cadernos de provas do TJ-SP de 2025, 2024, 2023, 2021, todos organizados pela Vunesp, consultados por links externos; gabaritos vinculados à versão 1 de cada prova.
- Simulado 1: todas as questões do exame de 2025 (70).
- Simulados 2–4: seleção determinística de 70 entre 100 questões, 16 Português, 30 Direito, 24 Conhecimentos Gerais. Questões anuladas excluídas (2024: 26, 30, 64, 98).
- Folha de respostas dentro da Teca, com anotação livre de raciocínio, navegação por número, histórico por conta e resultados em escala 0–100.
- O sistema reaproveita `study_state.payload` no Supabase existente (não precisa nova migração). Não gera XP por acerto/por assistir PDF.
- Nova aba própria no menu — separada de Mini-simulados.

## Limite importante — não falsificar comentários
Esta entrega contém três comentários específicos conferidos (2021: questões 1 e 4; 2023: questão 1), mas **não possui 280 comentários específicos de todas as alternativas**. Para cada erro, já mostra a letra oficial, a justificativa do aluno e um roteiro por área com exemplo de raciocínio. Os guias **NÃO** são correções técnicas individualizadas das perguntas. Precisam de revisão editorial manual, incluindo base legal atualizada, antes de serem anunciados assim. Uma revisão detalhada desse tipo depende de leitura de cada enunciado e alternativa do caderno oficial.

## Direitos e origem
A Teca **não republica texto integral das questões**, imagens, nem PDFs. Cadernos e gabaritos são abertos na origem. Confirme os termos de uso dos materiais antes de qualquer incorporação do enunciado original ao site.

## Como instalar
Envie o **conteúdo** desta pasta à raiz do GitHub Pages do repositório Teca (não a pasta como subdiretório). Atualize a página e procure **Teca Academia 3.8**. Preserve as configurações `config.js` e demais arquivos. Não há migração SQL nesta entrega.

## Avisos pedagógicos
Os cadernos de 2024, 2023, 2021 têm 100 questões; os simulados da Teca usam uma seleção de 70 e não representam uma prova Vunesp nova. Algumas leis e funcionalidades de informática mudaram depois dessas provas; confira a legislação do edital atual. A nota avalia a parte objetiva; a redação não está incluída.
