# Obras Tolkien Frontend

## Instruções de Instalação e Execução

1. **Pré-requisitos:**

   - Node.js (versão recomendada: 18.x ou superior)
   - Angular CLI (`npm install -g @angular/cli`)

2. **Instalação:**

   ```powershell
   cd terra-media
   npm install
   ```

3. **Execução:**
   ```powershell
   ng serve
   ```
   Acesse `http://localhost:4200` no navegador.

---

## Críticas e Sugestões de Melhorias

    Devido à limitação da API, não foi possível implementar a funcionalidade de ordenação.

    Optei por utilizar exclusivamente componentes do Angular Material, evitando bibliotecas externas. Como resultado, o layout final apresenta diferenças em relação ao design original do Figma.

**Melhorias planejadas:**
Implementação do cadastro e remoção de usuários.
Refresh token
loading

---

## Funcionalidades Bônus Implementadas

- **Diálogo de Confirmação Reutilizável:**
  - Sistema de alert/confirm customizado via serviço e componente compartilhado.
- **Toast de Notificações:**
  - Serviço para exibir mensagens de sucesso/erro em tempo real.
- **Componentização Modular:**
  - Modais para detalhes, comentários e autores implementados como componentes independentes.
- **Testes Automatizados:**
  - Cobertura de testes unitários para todos componentes e serviços principais.

---
