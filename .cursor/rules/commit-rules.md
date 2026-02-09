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

- **`feat:`** - Nova funcionalidade
- **`fix:`** - Correção de bug
- **`refactor:`** - Refatoração de código (sem mudança de funcionalidade)
- **`docs:`** - Mudanças na documentação
- **`style:`** - Formatação, ponto e vírgula faltando, etc (sem mudança de código)
- **`test:`** - Adicionar ou modificar testes
- **`chore:`** - Mudanças em build, dependências, configurações, etc
- **`perf:`** - Melhoria de performance
- **`build:`** - Mudanças no sistema de build ou dependências externas

---

## 📋 Formato

```
prefixo: descrição curta na primeira linha
         descrição adicional opcional na segunda linha (se necessário)
```

---

## ⚠️ O que NÃO Fazer

- ❌ Fazer commits sem autorização do usuário
- ❌ Fazer múltiplos commits pequenos quando um único commit consolidado é suficiente
- ❌ Fazer push (sempre deixar para o usuário)
- ❌ Usar inglês nos commits
- ❌ Commits muito longos (mais de 2 linhas)
- ❌ Mensagens vagas ("fix: corrige bug", "feat: adiciona feature")
- ❌ **Mencionar "FASE 1", "FASE 2", "BUG 1", etc.** - usar descrições claras da funcionalidade ao invés de referências a planos internos

---

## 🔄 Workflow

1. Fazer mudanças no código
2. Verificar alterações: `git status`, `git diff`
3. Adicionar ao staging: `git add <arquivos>`
4. Criar commit com mensagem clara
5. **NUNCA fazer push** (usuário faz quando apropriado)

---

## 📊 Quando Fazer Múltiplos Commits

Fazer commits separados quando:
- Mudanças são **logicamente independentes**
- Features são **completamente diferentes**
- **Fix urgente** em meio a desenvolvimento

Caso contrário, **consolidar em um único commit**.

---

## 🎯 Checklist Antes de Commitar

- [ ] O código foi testado e funciona?
- [ ] Todos os arquivos relevantes estão no staging?
- [ ] A mensagem é clara e descritiva?
- [ ] O prefixo está correto?
- [ ] A mensagem está em português?
- [ ] Não há referências a "FASE X" ou "BUG X"?
- [ ] O commit é focado em uma mudança lógica?

---

## 📚 Baseado Em

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
