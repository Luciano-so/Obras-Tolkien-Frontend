# 🧙‍♂️ Obras Tolkien – Frontend

Interface web para visualização e gerenciamento de obras do universo de J.R.R. Tolkien. Projeto desenvolvido com **Angular** e **Angular Material**.

---

## 🔐 Usuários de Teste

Todos os usuários utilizam a **senha: `123`**

| Usuário    | Senha |
|------------|-------|
| Admin      | 123   |
| Luciano    | 123   |
| Teste      | 123   |
| Joao       | 123   |

---

## ⚙️ Instruções de Instalação e Execução

### ✅ Pré-requisitos

- Node.js (recomendado: versão 18.x ou superior)
- Angular CLI:
  ```bash
  npm install -g @angular/cli
  ```

### 📥 Instalação

```bash
cd terra-media
npm install
```

### ▶️ Execução

```bash
ng serve
```

Acesse no navegador: [http://localhost:4200](http://localhost:4200)

---

## 🧪 Testes Unitários

Para rodar os testes e gerar relatório de cobertura:

```bash
ng test --code-coverage
```

### Exemplo de cobertura obtida:

```
=============================== Coverage summary ===============================
Statements   : 91.85% ( 282/307 )
Branches     : 80% ( 52/65 )
Functions    : 91.57% ( 87/95 )
Lines        : 91.28% ( 262/287 )
================================================================================
```

---

## 🐳 Execução com Docker

### 🏗️ Build da imagem

```bash
docker build -t terra-media-frontend .
```

### 🚀 Rodar o container

```bash
docker run -p 4200:80 terra-media-frontend
```

Acesse: [http://localhost:4200](http://localhost:4200)

---

## 🗂️ Estrutura do Projeto

- `src/app/features/books`: Funcionalidades relacionadas a livros (modais, detalhes, comentários)
- `src/app/shared`: Componentes e serviços reutilizáveis (diálogo de confirmação, toasts)
- `src/assets`: Imagens e arquivos estáticos

---

## 💡 Funcionalidades Bônus

- ✅ **Diálogo de Confirmação Reutilizável**
- ✅ **Loading**
- ✅ **Toast de Notificações**
- ✅ **Componentização Modular** (modais independentes)
- ✅ **Testes Automatizados** com ampla cobertura

---

## 📌 Limitações e Melhorias Futuras

### ⚠️ Limitações

- Devido à limitação da API, não foi possível implementar a **ordenação de dados**.

### 🛠️ Melhorias Planejadas

- Cadastro e remoção de usuários
- Implementação de **refresh token**
