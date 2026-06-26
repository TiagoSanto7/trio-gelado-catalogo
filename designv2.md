# DESIGN V2 - TRIO GELADOS

## Objetivo

Criar uma variante do design atual, que deverá ser mantida para caso precisemos alterar entre as versões. 

## Como será executado

Será executado etapa por etapa para manter o controle do design, então para cada etapa (ex: fazer o efeito da calda no cabeçalho) será feito uma validação se atende a espectativa.

---

## Etapas

### ✅ Etapa 1 — Textura de Casquinha de Waffle

Padrão diagonal crosshatch (45° e -45°) em marrom translúcido sobre o fundo bege,
imitando a textura de uma casquinha de waffle. Aplicado no `body` via `repeating-linear-gradient`.

---

### Etapa 2 — Calda Derretendo no Header

No cabeçalho, adicionar um efeito de borda irregular que pareça calda de sorvete
escorrendo para baixo. Implementado via `::after` com SVG inline de 3 gotas,
posicionado logo abaixo do header sticky.

---

### Etapa 3 — Tipografia e Cores

Trocar a fonte dos títulos por uma opção mais arredondada e amigável (Fredoka One, Baloo ou Nunito).
Ajustar a paleta geral para tons de sorvete napolitano (creme, rosa, chocolate) ou pastéis alegres.

---

### Etapa 4 — Botões Estilo Picolé

Botões principais ("Adicionar" e "Finalizar pedido") com formato mais alongado e bem arredondado
nas pontas. Cores em tons pastéis vibrantes (rosa morango, amarelo baunilha, verde pistache).
Hover com leve animação de "pulo" para cima.

---

### Etapa 5 — Botões Estilo Cookie

Botões menores (+ e − do carrinho) perfeitamente redondos, com cor ou sombra que lembre
um cookie com gotas de chocolate.
