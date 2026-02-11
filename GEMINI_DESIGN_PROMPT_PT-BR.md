# Tarefa de Design: Estilizar Minha Aplicação de Calculadora Financeira

Tenho uma aplicação React + TypeScript funcionando que precisa de estilização bonita e profissional. Tudo funciona perfeitamente, mas está básica. Preciso que você a transforme em uma ferramenta financeira moderna e confiável.

---

## 🔴 OS INDISPENSÁVEIS (Você Não Pode Trabalhar Sem Eles)

### 1. Stack Tecnológica
- **Framework:** React 19 com TypeScript
- **Build Tool:** Vite 7
- **Estilização:** CSS Modules (arquivos `.module.css`) → Convertendo para Tailwind CSS
- **Estrutura de Componentes:** Atomic Design (atoms → molecules → organisms → pages)
- **Gráficos:** Biblioteca Recharts para visualização de dados
- **Versão Node:** 22 LTS
- **Backend:** Express 5 + TypeScript (já funcionando, preciso apenas estilizar o frontend)

### 2. Preferência de Framework CSS
**Use Tailwind CSS** - Quero que você converta meus CSS Modules para classes Tailwind.

Vou instalá-lo depois que você fornecer os componentes estilizados. Apenas me dê as classes Tailwind diretamente no JSX.

### 3. Estrutura de Código Atual (O Código "Feio" para Estilizar)

#### Hierarquia de Componentes
```
Components/
├── atoms/                 # Elementos básicos (Button, Input, Label, Card, Icon, Spinner, Tooltip)
├── molecules/             # Combinações simples (InputField = Label + Input + Error)
├── organisms/             # Componentes complexos (CalculatorForm, ComparisonResults, CostComparisonChart, Header, Footer)
└── pages/                 # Páginas completas (CalculatorPage)
```

#### Componente da Página Principal (CalculatorPage.tsx)
```tsx
import { useState } from 'react';
import { Header, CalculatorForm, ComparisonResults } from '../../organisms';
import { Card } from '../../atoms';
import type { CalculationInput, CalculationResponse } from '../../../types/calculation.types';
import styles from './CalculatorPage.module.css';

export function CalculatorPage() {
  const [result, setResult] = useState<CalculationResponse | null>(null);
  const [input, setInput] = useState<CalculationInput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = (calculationResult: CalculationResponse, calculationInput: CalculationInput) => {
    setResult(calculationResult);
    setInput(calculationInput);
    setError(null);
    setLoading(false);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <Header />
      <section className={styles.formSection}>
        <Card>
          <CalculatorForm
            onCalculate={handleCalculate}
            onError={handleError}
            onLoadingChange={setLoading}
          />
        </Card>
      </section>
      <section className={styles.resultsSection}>
        <ComparisonResults result={result} input={input} loading={loading} error={error} />
      </section>
      <Footer />
    </div>
  );
}
```

#### Componente Button (Átomo)
```tsx
import type { ButtonHTMLAttributes } from 'react';
import { Spinner } from '../Spinner';
import styles from './Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
}

export function Button({ children, variant = 'primary', type = 'button', disabled, fullWidth, loading, className, ...rest }: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button 
      type={type} 
      disabled={isDisabled} 
      className={`${styles.button} ${styles[`button--${variant}`]} ${fullWidth ? styles['button--fullWidth'] : ''} ${className ?? ''}`.trim()} 
      {...rest}
    >
      {loading && <Spinner size="sm" />}
      {loading ? 'Calculando...' : children}
    </button>
  );
}
```

#### Componente Card (Átomo)
```tsx
import type { HTMLAttributes } from 'react';
import styles from './Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'outlined';
}

export function Card({ children, padding = 'medium', variant = 'default', className, ...rest }: CardProps) {
  return (
    <div 
      className={`${styles.card} ${styles[`card--padding-${padding}`]} ${variant === 'outlined' ? styles['card--outlined'] : ''} ${className ?? ''}`.trim()} 
      {...rest}
    >
      {children}
    </div>
  );
}
```

#### Estrutura do Componente de Formulário (CalculatorForm.tsx)
```tsx
// CalculatorForm possui:
// - Seção 1: "Dados Básicos" com 5 campos em grid de 2 colunas
//   • Valor do Carro (input de moeda)
//   • Aluguel Mensal (input de moeda)
//   • Taxa de Juros Mensal (%) (input de porcentagem com tooltip)
//   • Prazo do Financiamento (meses) (input numérico)
//   • Período de Análise (meses) (input numérico)
//
// - Seção 2: "Opções Avançadas" recolhível (botão de alternância com ícone ▶/▼)
//   Quando expandido, mostra 4 campos em grid de 2 colunas:
//   • Entrada (%) (input de porcentagem com tooltip)
//   • Manutenção Anual (R$) (input de moeda)
//   • Taxa de Seguro Anual (%) (input de porcentagem)
//   • Taxa IPVA (%) (input de porcentagem com tooltip)
//
// - Exibição de erro: mensagem formError (se presente)
// - Botão de envio: "Calcular Comparação" (largura total, variante primária)
// - Estado de carregamento: Botão mostra spinner + texto "Calculando..."
// - Usa molécula InputField para todos os campos (Label + Input + erro opcional + tooltip opcional)

// Valores padrão:
const DEFAULT_VALUES = {
  carValue: 50000,
  monthlyRent: 2200,
  interestRateMonth: 1.5, // Exibir como 1.5%
  financingTermMonths: 48,
  analysisPeriodMonths: 48,
  downPaymentPercent: 25, // Exibir como 25%
  maintenanceAnnual: 2000,
  insuranceRateAnnual: 6, // Exibir como 6%
  ipvaRate: 4, // Exibir como 4%
};
```

#### Estrutura do Componente Footer (Footer.tsx)
```tsx
// Footer possui duas seções lado a lado (empilhadas no mobile):
//
// Seção Esquerda: "Sobre o Projeto"
// - Título da seção
// - Descrição: Texto breve sobre o projeto e desenvolvedor
// - Tecnologias usadas: Texto pequeno listando stack tecnológica
//
// Seção Direita: "Contato"
// - Título da seção
// - Link LinkedIn (ícone + texto)
// - Link GitHub (ícone + texto)
//
// Barra de copyright no rodapé:
// - Texto de copyright centralizado
// - Ano gerado dinamicamente
//
// Layout: Grid de 2 colunas no desktop, coluna única no mobile
// Ícones: Ícones SVG do LinkedIn e GitHub do componente Icon
```

#### Estrutura do Componente de Resultados (ComparisonResults.tsx)
```tsx
// ComparisonResults exibe:
//
// 1. TRÊS CARDS DE COMPARAÇÃO (lado a lado no desktop, empilhados no mobile):
//
//    Card 1: "Compra à Vista"
//    - Custo total (grande, proeminente): R$ 83.009,67
//    - Botão expansível "▶ Detalhar custos"
//    - Quando expandido, mostra detalhamento:
//      • Depreciação: R$ 23.990,00
//      • IPVA: R$ 6.116,00
//      • Seguro: R$ 9.174,00
//      • Manutenção: R$ 8.000,00
//      • Custo de Oportunidade: R$ 33.709,67
//
//    Card 2: "Compra Financiada"
//    - Custo total (grande, proeminente): R$ 121.082,42
//    - Info secundária: Parcela: R$ 1.101,56/mês
//    - Info secundária: Total em juros: R$ 15.375,00
//    - Detalhamento expansível com 7 itens
//
//    Card 3: "Aluguel"
//    - Custo total (grande, proeminente): R$ 105.600,00
//    - Info secundária: Custo mensal: R$ 2.200,00
//    - Sem detalhamento (cenário mais simples)
//
// 2. GRÁFICO DE COMPARAÇÃO DE CUSTOS (abaixo dos cards):
//    - Gráfico de linhas com 3 linhas (À Vista, Financiado, Aluguel)
//    - Eixo X: Meses (1 até período de análise)
//    - Eixo Y: Custo acumulado (R$)
//    - Marcadores verticais nos pontos de equilíbrio
//    - Legenda com nomes dos cenários
//    - Tooltips ao passar o mouse
//
// 3. SEÇÃO PONTO DE EQUILÍBRIO (abaixo do gráfico):
//    - Título da seção: "Ponto de Equilíbrio" com ícone info (ℹ) + tooltip
//    - Duas declarações:
//      • "Aluguel vs Compra à Vista: empata no mês 29" (ou "Nunca empata")
//      • "Aluguel vs Compra Financiada: Nunca empata" (ou "empata no mês X")
//
// 4. ESTADOS:
//    - Carregando: 3 cards skeleton com animação shimmer
//    - Vazio: Ícone info + "Preencha o formulário acima para ver os resultados"
//    - Erro: Ícone de erro + mensagem de erro
```

---

## 🟢 OS ÚTEIS (Fazem o Design se Encaixar)

### 1. Vibe / Estética
**Palavras-chave:** Minimalista, Profissional, Confiável, Limpo, Ferramenta Financeira, Moderno

**Inspiração de Design:** 
- Apps fintech modernos como **Nubank** (banco digital brasileiro) - limpo, confiante, focado em dados
- **Stripe Dashboard** - mínimo, profissional, excelente apresentação de dados
- **Apps Financeiros da Apple** - clareza, bom espaçamento, tipografia legível

**NÃO:** 
- Brincalhão, gamificado, excessivamente colorido
- Sobrecarregado com decorações desnecessárias
- Infantil ou não profissional

**Tom:** 
Esta é uma ferramenta séria de decisão financeira. Os usuários estão comparando investimentos de R$ 80.000+. Eles precisam confiar nos dados e entendê-los rapidamente.

### 2. Paleta de Cores (OBRIGATÓRIA - Use Essas Cores Exatas)

**Cores da Marca (PRIMÁRIAS):**
- **Soft Sage (Verde Sálvia Suave):** `#ACC8A2` - Cor principal da marca para ações primárias, destaques, acentos
- **Deep Olive (Oliva Profundo):** `#1A2517` - Texto, cabeçalhos, elementos escuros da UI

**Derive Tons Adicionais:**
- Tons mais claros de sage (para fundos, destaques sutis, estados hover)
- Tons mais escuros de sage (para estados pressionados, ênfase)
- Tons mais claros de olive (para texto secundário)
- Tons mais escuros de olive (para ênfase forte)

**Cores Neutras (você cria essas):**
- Branco/off-white para fundo principal
- Cinzas claros para bordas, divisores, estados desabilitados
- Cinzas médios para texto secundário
- Cinzas escuros para texto do corpo (ou use olive)

**Cores dos Cenários (IMPORTANTE - para 3 cards e linhas do gráfico):**
Crie 3 cores distintas e complementares que:
- Funcionem harmoniosamente com a paleta sage/olive
- Sejam facilmente distinguíveis em um gráfico de linhas
- Transmitam o conceito de cada cenário

**Abordagem sugerida:**
- Cenário 1 (À Vista): Use família verde sage
- Cenário 2 (Financiado): Tom terra quente (tan/marrom/âmbar)
- Cenário 3 (Aluguel): Neutro frio (azul-acinzentado/ardósia)

**Cores Semânticas:**
- **Sucesso:** Derive do verde sage (para destacar "melhor opção")
- **Erro:** Vermelho suave que complementa olive/sage (não vermelho brilhante)
- **Aviso:** Âmbar/laranja suave
- **Info:** Azul suave

### 3. Contexto do Conteúdo

#### Que Tipo de Dados São Mostrados?

**Ferramenta de Comparação Financeira** - Usuários comparam 3 cenários de aquisição de carro ao longo do tempo.

**Dados do Formulário (Entrada):**
- 5 campos básicos + 4 campos avançados
- Valores em moeda: R$ 50.000,00 (formato brasileiro: ponto para milhares, vírgula para decimais)
- Porcentagens: 1,5% (separador decimal vírgula)
- Períodos de tempo: 48 meses
- Todos os campos têm validação, alguns têm tooltips explicando termos financeiros

**Dados de Resultado (Saída):**
1. **Três totais de custo** - Números mais importantes, precisam de destaque visual
   - À Vista: ~R$ 83.000
   - Financiado: ~R$ 121.000
   - Aluguel: ~R$ 105.600

2. **Detalhamentos detalhados** - Informação secundária, expansível
   - 5-7 itens de linha por cenário
   - Cada linha: Rótulo + Valor em moeda

3. **Dados do gráfico** - Comparação visual ao longo de 48 meses
   - 3 linhas com trajetórias diferentes
   - Aluguel cresce linearmente
   - À vista e financiado têm aumentos escalonados (custos anuais)

4. **Pontos de equilíbrio** - Insights chave
   - Mês 29: Aluguel iguala custo de compra à vista
   - Nunca: Aluguel nunca iguala financiado (ou mês específico)

#### Jornada do Usuário & Fluxo de Trabalho

**Passo 1: Estado Inicial**
- Usuário chega na página
- Formulário está visível com valores padrão sensatos pré-preenchidos
- Seção de resultados mostra: "Preencha o formulário acima para ver os resultados"

**Passo 2: Ajustar Valores**
- Usuário modifica valor do carro, custo de aluguel, etc.
- Opcional: Usuário expande "Opções Avançadas" para ajustar premissas
- Feedback de validação em tempo real em entradas inválidas

**Passo 3: Calcular**
- Usuário clica no botão "Calcular Comparação"
- Botão mostra estado de carregamento: spinner + "Calculando..."
- Formulário é desabilitado durante cálculo

**Passo 4: Ver Resultados**
- Três cards aparecem com totais
- Gráfico anima mostrando evolução de custos
- Seção de ponto de equilíbrio exibe conclusões
- Usuário pode expandir cada card para ver detalhamento detalhado

**Passo 5: Iterar**
- Usuário ajusta valores no formulário e recalcula
- Resultados atualizam com novos dados
- Usuário compara cenários, toma decisão

---

## 🎨 REQUISITOS ESPECÍFICOS DE DESIGN

### Layout & Espaçamento

**Layout da Página:**
- Container de largura máxima: **1200px** centralizado no viewport
- Padding: 16px mobile, 24px tablet, 32px desktop
- Seções de formulário e resultados claramente separadas (espaço visual para respirar)

**Sistema de Grid:**
- Campos do formulário: 2 colunas no desktop (≥768px), 1 coluna no mobile
- Cards de resultado: 3 colunas no desktop (≥1024px), 2 colunas no tablet (≥640px), 1 coluna no mobile
- Gap consistente: 16px mobile, 24px desktop

**Escala de Espaçamento (padrão Tailwind):**
- Base: 4px
- Comum: 8px, 12px, 16px, 24px, 32px, 48px, 64px
- Use consistentemente em todo lugar

### Design do Formulário

**Estrutura Visual:**
- Títulos de seção claros: "Dados Básicos", "Opções Avançadas"
- Tipografia do título da seção: peso médio, bom espaçamento
- Campos agrupados: relação visível dentro de uma seção

**Campos de Entrada:**
- Bordas limpas (1px sólido, cor neutra)
- Bom padding interno (12px vertical, 16px horizontal)
- Estado de foco: Cor de borda sage, sombra/brilho sutil
- Estado de erro: Borda vermelha suave, texto de erro abaixo (pequeno, vermelho)
- Estado desabilitado: Fundo cinza, opacidade reduzida

**Alternância de Opções Avançadas:**
- Botão claro com ícone chevron (▶ recolhido, ▼ expandido)
- Animação suave de deslizamento para baixo (duração da transição: 300ms)
- Texto: "Opções Avançadas"

**Botão de Envio:**
- Largura total, proeminente
- Cor primária: Soft sage (#ACC8A2)
- Texto: "Calcular Comparação"
- Altura: Confortável (48px mínimo para alvos de toque)
- Estado de carregamento: Spinner (lado esquerdo) + texto "Calculando..."
- Hover: Sage ligeiramente mais escuro
- Desabilitado: Desbotado, cursor not-allowed

**Tooltips:**
- Pequeno ícone info (ℹ) ao lado do rótulo
- Ao passar o mouse: Mostrar explicação no tooltip
- Tooltip: Fundo escuro (olive), texto branco, cantos arredondados

### Design dos Cards de Resultados

**Container do Card:**
- Fundo branco (ou tom muito claro)
- Sombra sutil para profundidade (não muito forte)
- Cantos arredondados (8px ou 12px)
- Padding: 24px
- Largura igual quando lado a lado

**Conteúdo do Card:**
- **Título:** Tamanho H3, peso médio/semibold, cor olive
  - "Compra à Vista" / "Compra Financiada" / "Aluguel"
- **Custo Total:** Grande, negrito (2-3x tamanho do texto do corpo), cor olive
  - Este é o número MAIS IMPORTANTE
  - Exemplo: R$ 83.009,67
- **Info Secundária:** Menor, peso médio, texto cinza
  - Exemplo: "Parcela: R$ 1.101,56/mês"
- **Alternância de Detalhamento:** Botão de texto com chevron, cor sutil
- **Itens de Detalhamento:** Layout de duas colunas (rótulo à esquerda, valor à direita)
  - Leve indentação
  - Texto menor que custo total
  - Bom espaçamento entre linhas

**Destaque do Menor Custo:**
- Determinar qual cenário tem menor custo total
- Adicionar indicador visual sutil:
  - Opção 1: Borda colorida fina (verde de sucesso)
  - Opção 2: Pequeno badge "Melhor Opção" no canto superior
  - Opção 3: Tinta de fundo muito sutil (cor de sucesso com 5% de opacidade)
- Não exagere - mantenha profissional

### Design do Gráfico

**Container:**
- Largura total dentro do container de largura máxima
- Altura: 400px desktop, 300px mobile
- Fundo branco ou transparente
- Margem: Bom espaço acima e abaixo

**Estilização do Gráfico (customização Recharts):**
- **Linhas:** Largura 2-3px, curvas suaves
  - À Vista: Tom verde sage
  - Financiado: Tom terra quente
  - Aluguel: Tom neutro frio
- **Linhas de grade:** Muito sutis (cinza claro, baixa opacidade)
- **Eixos:**
  - Eixo X: Meses (mostrar a cada 6 meses ou mais)
  - Eixo Y: R$ (formatar como moeda, abreviado se necessário: "R$ 80k")
- **Legenda:** Rótulos claros, posicionada no topo ou embaixo, caixas de cor
- **Tooltips:** Ao passar o mouse, mostrar valores exatos formatados como moeda
- **Marcadores de ponto de equilíbrio:** Linhas verticais tracejadas nos meses de equilíbrio
  - Rótulo: Texto pequeno "Break-even: Mês X"

### Seção de Ponto de Equilíbrio

**Importância Visual:**
Esta é informação CHAVE - o principal insight que os usuários querem.

**Design:**
- Seção distinta (considere fundo ou borda sutil)
- Título da seção: "Ponto de Equilíbrio" com ícone info
- Duas linhas de declaração:
  - Texto claro e legível
  - Destacar o número do mês (negrito ou colorido)
  - Exemplo: "Aluguel vs Compra à Vista: empata no **mês 29**"
- Tooltip no ícone info: Explicar o que significa ponto de equilíbrio

### Tipografia

**Família de Fontes:**
- Sans-serif moderno
- Sugestões: Inter, Roboto, Open Sans, ou fontes do sistema
- Bom em tamanhos pequenos, excelente legibilidade

**Escala de Tipos:**
```
H1 (Título da página): 32-36px, negrito (700)
H2 (Títulos de seção): 24-28px, semibold (600)
H3 (Títulos de card): 18-20px, médio (500)
Corpo: 16px, regular (400)
Pequeno: 14px, regular (400)
Minúsculo (rótulos): 12px, regular (400)
```

**Especial:**
- Valores em moeda: Use números tabulares/monoespaçados para alinhamento
- Altura da linha: 1.5 para texto do corpo, mais apertada (1.2-1.3) para títulos

**Cores:**
- Títulos: Deep olive (#1A2517)
- Texto do corpo: Deep olive ou cinza escuro
- Texto secundário: Cinza médio
- Texto suave: Cinza claro

### Estados & Interações

**1. Estados do Botão:**
- Padrão: Fundo soft sage, texto branco
- Hover: Sage mais escuro (10-15% mais escuro)
- Ativo/Pressionado: Sage ainda mais escuro
- Desabilitado: Fundo cinza, texto cinza, opacidade 50%
- Carregando: Fundo sage, spinner + texto, cursor desabilitado

**2. Estados de Entrada:**
- Padrão: Borda neutra (cinza), fundo branco
- Hover: Borda ligeiramente mais escura
- Foco: Borda sage, sombra sutil (sage com baixa opacidade)
- Erro: Borda vermelha, texto vermelho abaixo
- Desabilitado: Fundo cinza claro, texto cinza, cursor not-allowed

**3. Estados do Card:**
- Padrão: Branco, sombra sutil
- Hover: Sombra ligeiramente mais forte (opcional)
- Menor custo: Acento de sucesso (borda/badge/tinta)
- Expandido: Seção de detalhamento visível com animação suave

**4. Estados de Carregamento:**
- **Carregamento do formulário:** Botão desabilitado, mostra spinner
- **Carregamento de resultados:** Mostrar 3 cards skeleton
  - Skeleton: Retângulos cinzas com animação shimmer
  - Placeholder para título, total, alternância de detalhamento
- **Carregamento do gráfico:** Placeholder de retângulo cinza

**5. Estado Vazio:**
- Conteúdo centralizado
- Ícone (info/lâmpada)
- Texto: "Preencha o formulário acima para ver os resultados"
- Cores suaves (cinza)

**6. Estado de Erro:**
- Ícone de erro (⚠ ou ✕)
- Mensagem de erro em vermelho (vermelho suave da paleta)
- Posicionado apropriadamente (abaixo do formulário ou na área de resultados)

### Design Responsivo (Crítico)

**Mobile (< 640px):**
- Formulário: Coluna única, entradas de largura total
- Cards: Empilhar verticalmente, largura total
- Gráfico: Largura total, altura reduzida (250-300px)
- Tipografia: Ligeiramente menor (mas mínimo 14px para legibilidade)
- Padding: 16px nas laterais
- Botão: Largura total, altura 48px (bom alvo de toque)

**Tablet (640px - 1024px):**
- Formulário: 2 colunas
- Cards: 2 na linha superior, 1 na inferior (ou todos 3 em uma linha se couberem)
- Gráfico: Largura total, altura 350px
- Tipografia: Tamanhos padrão

**Desktop (> 1024px):**
- Formulário: 2 colunas para campos básicos, 2 colunas para avançados
- Cards: 3 lado a lado, largura igual
- Gráfico: Largura total, altura 400-450px
- Tipografia: Tamanhos completos
- Largura máxima: Container 1200px

**Alvos de Toque:**
- Mínimo 44px para elementos tocáveis no mobile
- Botões, botões de alternância, seções expansíveis

---

## 📦 ENTREGÁVEIS SOLICITADOS

### 1. Configuração Tailwind

Forneça as definições de cores para adicionar ao `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Sua paleta sage/olive com variantes
        sage: {
          50: '#...', // Mais claro
          100: '#...',
          // ... até
          900: '#...', // Mais escuro
          DEFAULT: '#ACC8A2', // Soft Sage
        },
        olive: {
          50: '#...',
          // ...
          900: '#...',
          DEFAULT: '#1A2517', // Deep Olive
        },
        // Cores dos cenários
        scenario: {
          cash: '#...',
          financed: '#...',
          rental: '#...',
        },
      },
    },
  },
}
```

### 2. Componentes Estilizados (Código Completo)

Forneça JSX completo para cada componente com classes Tailwind:

**Ordem de Prioridade:**
1. **Button** (variantes primária e secundária, todos os estados)
2. **Card** (variantes padrão e contornada, tamanhos de padding)
3. **InputField** (ou átomo Input se mais simples)
4. **CalculatorPage** (estrutura de layout principal)
5. **CalculatorForm** (grid de formulário, seções, alternância, envio)
6. **ComparisonResults** (grid de cards, detalhamento, estados)
7. **Footer** (layout de duas colunas, links sociais, copyright)

**Requisitos:**
- Mantenha TODA a lógica, props, tipos TypeScript existentes
- Mantenha TODO o espalhamento de prop classNames para extensibilidade
- Apenas substitua `className={styles.xxx}` com classes utilitárias Tailwind
- Mostre código completo, pronto para copiar e colar

### 3. Classes Utilitárias de Tipografia

Forneça classes Tailwind reutilizáveis para estilos de texto comuns:

```tsx
// Exemplo:
const typography = {
  h1: 'text-4xl font-bold text-olive-900',
  h2: 'text-2xl font-semibold text-olive-800',
  h3: 'text-xl font-medium text-olive-700',
  body: 'text-base text-olive-900',
  small: 'text-sm text-gray-600',
  currency: 'font-mono font-bold text-2xl text-olive-900',
};
```

### 4. Exemplo com Dados Reais

Mostre-me UM componente completo renderizado com dados de exemplo:

**Exemplo: Card "Compra à Vista" (Expandido)**
- Título: "Compra à Vista"
- Total: R$ 83.009,67
- Alternância de detalhamento (estado expandido)
- Todos os 5 itens de detalhamento visíveis
- Estilização totalmente aplicada

### 5. Classes de Animação/Transição

Forneça classes Tailwind para:
- Seções recolhíveis (opções avançadas do formulário, detalhamentos do card)
- Shimmer de carregamento skeleton
- Efeitos hover
- Anéis de foco

---

## 🎯 OBJETIVOS DE DESIGN & CRITÉRIOS DE SUCESSO

### Objetivos Principais

1. **Clareza Acima de Tudo**
   - Usuário vê instantaneamente qual opção custa menos
   - Custos totais são os elementos mais proeminentes
   - Hierarquia guia o olho: Formulário → Totais → Gráfico → Detalhes

2. **Confiança Profissional**
   - Design visual inspira confiança nos cálculos
   - Sério, não brincalhão
   - Consistente com aplicações financeiras modernas

3. **Usabilidade Mobile-First**
   - Perfeito em smartphones (onde muitos brasileiros tomam decisões financeiras)
   - Amigável ao toque (alvos mínimos de 48px)
   - Legível sem zoom

4. **Acessibilidade**
   - Taxas de contraste WCAG AA mínimo
   - Navegação por teclado funciona perfeitamente
   - Estados de foco claramente visíveis
   - Amigável a leitores de tela (preservar atributos ARIA)

### O Sucesso Parece

- Usuário abre app no telefone, entende imediatamente o que fazer
- Usuário preenche formulário facilmente (bons alvos de toque, rótulos claros)
- Usuário vê resultados e identifica instantaneamente melhor opção
- Usuário expande detalhamento sem confusão
- Usuário entende gráfico sem explicação
- Usuário confia nos números e design o suficiente para tomar uma decisão

---

## 🇧🇷 CONTEXTO BRASILEIRO

### Considerações Regionais

**Idioma:** Português (Brasil)
- Todo o texto da UI está em português
- Não traduza ou altere o texto

**Formato de Moeda:** 
- Símbolo: R$ (Reais)
- Formato: R$ 50.000,00
- Separador de milhares: ponto (.)
- Separador decimal: vírgula (,)
- Exemplo: R$ 83.009,67

**Formato de Número:**
- Porcentagens: 1,5% (vírgula, não ponto)
- Exemplo: 1,5% ao mês

**Público-Alvo:**
- Idade: 25-45 anos
- Contexto: Considerando compra de carro ou aluguel de longo prazo
- Alfabetização financeira: Média a alta
- Dispositivo: Mix de mobile e desktop (divisão 60/40 favorecendo mobile)

**Notas Culturais:**
- Brasileiros estão acostumados a detalhamentos financeiros detalhados (comum em apps bancários)
- Preferência de cor: Tons terrosos e naturais ressoam bem (sage + olive é boa escolha)
- Indicadores de confiança: Design limpo, cálculos claros, sem informações ocultas

---

## 💡 CONTEXTO ADICIONAL

### O Que Torna Isso Desafiador

1. **Complexidade de Dados:**
   - 3 cenários com estruturas diferentes
   - Múltiplos componentes de custo por cenário
   - Gráfico de série temporal com 3 linhas
   - Análise de ponto de equilíbrio

2. **Hierarquia de Informação:**
   - Precisa mostrar resumo (totais) com destaque
   - Ocultar detalhes (detalhamentos) por padrão
   - Tornar gráfico informativo mas não avassalador
   - Apresentar insights de ponto de equilíbrio claramente

3. **Desafios Responsivos:**
   - 3 cards lado a lado no desktop
   - Devem empilhar graciosamente no mobile
   - Gráfico deve ser legível em telas pequenas
   - Formulário com muitos campos deve permanecer utilizável

### O Que Faz um Ótimo Design Aqui

**Hierarquia Visual:**
- Números maiores e mais ousados = Custos totais
- Menores, secundários = Custos mensais, juros pagos
- Menores, expansíveis = Detalhamentos detalhados

**Uso de Cor:**
- Sage para ações primárias (botão calcular, estados de foco)
- Olive para texto e estrutura
- Cores dos cenários para diferenciação (cards, gráfico)
- Cor de sucesso para destaque "melhor opção" (sutil)
- Cor de erro apenas para erros

**Espaço em Branco:**
- Espaçamento generoso entre seções
- Não aperte informações
- Deixe os dados respirarem

**Divulgação Progressiva:**
- Info básica sempre visível (totais)
- Detalhes ocultos por padrão (detalhamentos)
- Fácil de expandir para usuários curiosos
- Gráfico fornece resumo visual

**Micro-interações:**
- Animações suaves de expandir/recolher
- Efeitos hover sutis
- Estados de carregamento que não frustram
- Tooltips do gráfico para valores precisos

---

## 🚀 EXPECTATIVAS DE FLUXO DE TRABALHO

### Como Isso Vai Funcionar

**Passo 1: Você Fornece Designs**
- Config Tailwind com paleta de cores completa
- Componentes estilizados com classes Tailwind
- Recomendações de tipografia e espaçamento
- Um exemplo completo com dados reais

**Passo 2: Eu Implemento**
- Instalar Tailwind no meu projeto
- Adicionar sua config ao `tailwind.config.js`
- Substituir meus CSS Modules pelas suas classes Tailwind
- Testar em diferentes tamanhos de tela

**Passo 3: Iteração (Se Necessário)**
- Vou tirar screenshot do resultado
- Se ajustes forem necessários, vou te perguntar
- Você fornecerá classes refinadas
- Repetir até perfeito

### O Que Preciso de Você

1. **Código completo, pronto para copiar e colar** - Não apenas nomes de classes, mas JSX completo do componente
2. **Seções comentadas** - Explique por que escolheu certas classes
3. **Variantes claramente mostradas** - Mostre-me botões primário e secundário, por exemplo
4. **Classes responsivas incluídas** - Use prefixos `sm:`, `md:`, `lg:` onde necessário
5. **Todos os estados cobertos** - Padrão, hover, foco, desabilitado, carregando, erro

### Com O Que Você NÃO Precisa Se Preocupar

- Tipos TypeScript (já definidos, mantenha-os)
- Lógica do componente (já funciona, mantenha)
- Gerenciamento de estado (já implementado)
- Integração com API (já funcionando)
- Props e callbacks (já corretos)

**Apenas foque em torná-lo bonito com classes Tailwind!**

---

## 🎨 SOLICITAÇÃO FINAL

Por favor, estilize minha calculadora financeira para ser:

✅ **Profissional** - Inspira confiança em cálculos financeiros  
✅ **Clara** - Usuário vê imediatamente qual opção custa menos  
✅ **Moderna** - Usa paleta sage/olive com design limpo e contemporâneo  
✅ **Mobile-friendly** - Perfeita em smartphones (crítico para mercado brasileiro)  
✅ **Acessível** - Bom contraste, navegação por teclado, leitores de tela  
✅ **Sutil** - Sem animações ou decorações exageradas  
✅ **Focada em dados** - Design serve os números, não o contrário  

**Lembre-se:** Esta é uma ferramenta para tomar decisões de R$ 80.000+. Usuários precisam de clareza e confiança, não ostentação.

Foque em tipografia excepcional, espaçamento perfeito e uma paleta de cores que pareça terrosa, confiável e calma (sage + olive).

Mostre-me os componentes estilizados, e vamos tornar esta calculadora linda! 🚗💰
