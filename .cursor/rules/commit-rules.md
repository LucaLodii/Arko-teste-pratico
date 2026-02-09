# Commit Rules

Regras para commits no projeto.

---

## 📝 Regras Gerais

### 1. Tamanho
- Commits devem ser **curtos**, com **máximo de 2 linhas**
- Primeira linha: descrição concisa (máximo 72 caracteres idealmente)
- Segunda linha (opcional): detalhamento breve se necessário

### 2. Idioma
- Todos os commits devem ser escritos em **português brasileiro**

### 3. Autorização
- Commits **só devem ser feitos quando o usuário solicitar explicitamente**
- Nunca fazer commits automáticos ou por iniciativa própria

### 4. Consolidação
- Sempre consolidar mudanças em **um único commit** quando possível
- Evitar múltiplos commits pequenos para mudanças relacionadas
- Agrupar alterações logicamente relacionadas

### 5. Push
- **NUNCA fazer push** - apenas o usuário fará o push dos commits
- Apenas criar commits locais

### 6. Sem Referências Internas
- **NUNCA mencionar "FASE 1", "FASE 2", "BUG 1", etc.** nos commits
- Estes planos de desenvolvimento são internos e não serão commitados
- Use descrições claras e diretas da funcionalidade implementada
- O histórico de commits deve fazer sentido para qualquer pessoa externa ao projeto

---

## 🏷️ Prefixos de Commit

Sempre usar prefixos padronizados seguidos de **dois pontos e espaço**:

### feat: Nova Funcionalidade
Adição de uma nova funcionalidade ao projeto.

```bash
feat: adiciona cálculo de custo de compra à vista
feat: implementa formulário de entrada de dados no frontend
```

### fix: Correção de Bug
Correção de um problema ou bug no código.

```bash
fix: corrige cálculo de depreciação para valores negativos
fix: resolve erro de validação no campo de taxa de juros
```

### refactor: Refatoração
Mudança no código que não altera funcionalidade (melhoria de estrutura, legibilidade).

```bash
refactor: extrai lógica de cálculo para serviço dedicado
refactor: simplifica componente de formulário removendo estado duplicado
```

### docs: Documentação
Mudanças exclusivamente em documentação.

```bash
docs: atualiza README com instruções de instalação
docs: adiciona comentários nas fórmulas financeiras
```

### style: Formatação
Mudanças que não afetam o significado do código (espaços, formatação, ponto e vírgula).

```bash
style: formata código com Prettier
style: ajusta indentação no arquivo de configuração
```

### test: Testes
Adição ou modificação de testes.

```bash
test: adiciona testes unitários para serviço de cálculo
test: cobre casos de erro no controller de cálculo
```

### chore: Configuração/Build
Mudanças em configuração, dependências, build, ferramentas.

```bash
chore: adiciona dependência Zod para validação
chore: configura CORS no backend
chore: atualiza configuração do TypeScript
```

### perf: Performance
Melhorias de performance.

```bash
perf: otimiza cálculo de ponto de equilíbrio
perf: adiciona memoização no componente de gráfico
```

### build: Build System
Mudanças no sistema de build ou dependências externas.

```bash
build: atualiza Vite para versão 7.0
build: configura build para produção
```

---

## ✅ Exemplos de Bons Commits

### Commit Simples (1 linha)
```bash
feat: adiciona endpoint de cálculo de comparação
```

### Commit com Detalhamento (2 linhas)
```bash
feat: implementa cálculo de custo de oportunidade
Considera taxa Selic para calcular rendimento perdido do capital investido
```

### Múltiplas Mudanças Relacionadas (1 commit)
```bash
chore: melhora configuração de .gitignore e adiciona templates de variáveis de ambiente
```

---

## ❌ Exemplos de Commits Ruins

### Muito Vago
```bash
fix: corrige bug  ❌
# Deveria ser: fix: corrige cálculo de depreciação para valores negativos
```

### Referência Interna
```bash
feat: implementa FASE 2 do projeto  ❌
# Deveria ser: feat: adiciona formulário de entrada de dados
```

### Muito Longo
```bash
feat: adiciona nova funcionalidade de cálculo que permite ao usuário...  ❌
# Quebrar em 2 linhas ou simplificar
```

### Prefixo Errado
```bash
feat: corrige erro no cálculo  ❌
# Deveria ser: fix: corrige erro no cálculo
```

### Em Inglês
```bash
feat: add calculation endpoint  ❌
# Deveria ser: feat: adiciona endpoint de cálculo
```

---

## 🔄 Workflow de Commit

1. **Fazer as mudanças no código**
2. **Verificar o que foi alterado**: `git status`, `git diff`
3. **Staging das mudanças**: `git add <arquivos>`
4. **Criar commit**: `git commit -m "prefixo: descrição clara"`
5. **NUNCA fazer push** (usuário fará quando apropriado)

---

## 📊 Quando Fazer Múltiplos Commits

Em vez de 1 commit grande, fazer commits separados quando:

1. Mudanças são **logicamente independentes**
   ```bash
   git commit -m "feat: adiciona validação de entrada"
   git commit -m "feat: adiciona cálculo de financiamento"
   ```

2. Features **completamente diferentes**
   ```bash
   git commit -m "feat: implementa backend de cálculo"
   # ... testes ...
   git commit -m "feat: implementa interface de usuário"
   ```

3. **Fix urgente** em meio a desenvolvimento
   ```bash
   git commit -m "fix: corrige erro crítico de validação"
   # Continuar desenvolvimento...
   git commit -m "feat: adiciona nova funcionalidade"
   ```

---

## 🎯 Checklist Antes de Commitar

- [ ] O código foi testado e funciona?
- [ ] Todos os arquivos relevantes foram adicionados ao staging?
- [ ] A mensagem de commit é clara e descritiva?
- [ ] O prefixo está correto?
- [ ] A mensagem está em português?
- [ ] Não há referências a "FASE X" ou "BUG X"?
- [ ] O commit é focado em uma mudança lógica?

---

## 📚 Referências

Este padrão é baseado em:
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)

Adaptado para o contexto e preferências deste projeto.
