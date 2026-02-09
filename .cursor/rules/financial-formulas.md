# Financial Calculation Formulas

Documentação das fórmulas financeiras usadas no projeto.

---

## 📊 Overview

O projeto compara três cenários de aquisição/uso de veículo:

1. **Compra à Vista** - Pagamento integral no momento da compra
2. **Compra Financiada** - Pagamento parcelado com juros
3. **Aluguel/Assinatura** - Pagamento mensal recorrente

---

## 💰 1. Compra à Vista (Cash Purchase)

### Custo Total

```
Custo Total = Preço de Compra
            - Depreciação (ao longo do tempo)
            + Custos de Manutenção
            + Seguro + IPVA
            + Custo de Oportunidade
```

### 1.1 Depreciação

**Conceito:** Perda de valor do veículo ao longo do tempo.

**Métodos:**

#### Depreciação Linear (Recomendado para MVP)
```typescript
depreciacaoAnual = valorCarro * taxaDepreciacao

// Exemplo: Carro de R$ 50.000 com 15% ao ano por 3 anos
// Ano 1: 50.000 * 0.15 = 7.500
// Ano 2: 50.000 * 0.15 = 7.500
// Ano 3: 50.000 * 0.15 = 7.500
// Total depreciado: 22.500
```

#### Depreciação Exponencial (Mais Realista)
```typescript
valorAtual = valorInicial * Math.pow(1 - taxaDepreciacao, anos)
depreciacaoTotal = valorInicial - valorAtual

// Exemplo: Carro de R$ 50.000 com 15% ao ano por 3 anos
// Ano 1: 50.000 * (1 - 0.15)^1 = 42.500
// Ano 2: 50.000 * (1 - 0.15)^2 = 36.125
// Ano 3: 50.000 * (1 - 0.15)^3 = 30.706
// Total depreciado: 19.294
```

**Taxas Típicas:**
- Ano 1: 20-25% (maior depreciação)
- Ano 2-3: 15% ao ano
- Ano 4+: 10% ao ano

**Implementação Sugerida:**
```typescript
function calcularDepreciacao(
  valorInicial: number,
  anos: number,
  metodo: 'linear' | 'exponencial' = 'exponencial'
): number {
  const taxas = [0.20, 0.15, 0.15, 0.10, 0.10]; // taxas por ano
  
  if (metodo === 'linear') {
    const taxaMedia = 0.15;
    return valorInicial * taxaMedia * anos;
  }
  
  // Exponencial
  let valorAtual = valorInicial;
  for (let i = 0; i < anos && i < taxas.length; i++) {
    valorAtual *= (1 - taxas[i]);
  }
  
  return valorInicial - valorAtual;
}
```

### 1.2 Custo de Oportunidade

**Conceito:** Quanto o dinheiro investido no carro poderia render se aplicado em investimentos.

**Fórmula:**
```
Custo de Oportunidade = Capital Investido × Taxa de Juros × Tempo
```

**Taxa de Referência:**
- **CDI/Selic:** ~13.75% ao ano (2024)
- **Poupança:** ~8% ao ano
- **Conservador:** Usar Selic como referência

**Implementação:**
```typescript
function calcularCustoOportunidade(
  capitalInvestido: number,
  anos: number,
  taxaAnual: number = 0.1375 // Selic 2024
): number {
  // Juros compostos (mais realista)
  const montanteFinal = capitalInvestido * Math.pow(1 + taxaAnual, anos);
  return montanteFinal - capitalInvestido;
}

// Exemplo: R$ 50.000 por 3 anos a 13.75% aa
// Renderia: 50.000 * (1.1375)^3 = 73.456
// Custo de oportunidade: 23.456
```

### 1.3 IPVA (Imposto sobre Propriedade de Veículos Automotores)

**Fórmula:**
```
IPVA Anual = Valor do Carro × Alíquota Estadual
```

**Alíquotas por Estado (exemplos):**
- São Paulo: 4%
- Rio de Janeiro: 4%
- Minas Gerais: 4%
- Média nacional: 3-4%

**Observação:** IPVA é calculado sobre o valor de mercado (que deprecia).

```typescript
function calcularIPVA(valorCarro: number, anos: number, aliquota: number = 0.04): number {
  let ipvaTotal = 0;
  let valorAtual = valorCarro;
  
  for (let ano = 0; ano < anos; ano++) {
    ipvaTotal += valorAtual * aliquota;
    valorAtual *= 0.85; // deprecia 15% ao ano
  }
  
  return ipvaTotal;
}
```

### 1.4 Seguro

**Fórmula:**
```
Seguro Anual = Valor do Carro × Taxa de Seguro
```

**Taxas Típicas:**
- Seguro completo: 5-8% do valor do carro ao ano
- Terceiros: 1-2% do valor do carro ao ano

**Implementação:**
```typescript
function calcularSeguro(
  valorCarro: number,
  anos: number,
  taxaSeguro: number = 0.06 // 6% ao ano
): number {
  let seguroTotal = 0;
  let valorAtual = valorCarro;
  
  for (let ano = 0; ano < anos; ano++) {
    seguroTotal += valorAtual * taxaSeguro;
    valorAtual *= 0.85; // deprecia
  }
  
  return seguroTotal;
}
```

### 1.5 Manutenção

**Custos Anuais Típicos:**
- Manutenção preventiva: R$ 1.500 - R$ 3.000/ano
- Pneus (a cada 2-3 anos): R$ 2.000 - R$ 3.000
- Revisões: R$ 800 - R$ 1.500/ano

**Simplificação:**
```typescript
const CUSTO_MANUTENCAO_ANUAL = 2000; // valor fixo por ano
const custoManutencaoTotal = CUSTO_MANUTENCAO_ANUAL * anos;
```

---

## 💳 2. Compra Financiada (Financed Purchase)

### Custo Total

```
Custo Total = Entrada
            + Total de Parcelas (com juros)
            + Custos de Propriedade (IPVA, Seguro, Manutenção)
            + Depreciação
            + Custo de Oportunidade (da entrada)
```

### 2.1 Cálculo de Parcelas (Sistema Price)

**Sistema Price (mais comum):**
```
PMT = PV × [i × (1 + i)^n] / [(1 + i)^n - 1]

Onde:
PMT = Valor da parcela mensal
PV = Valor presente (valor financiado)
i = Taxa de juros mensal
n = Número de parcelas
```

**Implementação:**
```typescript
function calcularParcelaPrice(
  valorFinanciado: number,
  taxaJurosMensal: number,
  numeroParcelas: number
): number {
  const i = taxaJurosMensal;
  const n = numeroParcelas;
  
  const parcela = valorFinanciado * 
    (i * Math.pow(1 + i, n)) / 
    (Math.pow(1 + i, n) - 1);
  
  return parcela;
}

// Exemplo: R$ 40.000 financiados a 1.5% am por 48 meses
// Parcela = 40.000 * [0.015 × (1.015)^48] / [(1.015)^48 - 1]
// Parcela ≈ R$ 1.247,52
```

### 2.2 Total de Juros Pagos

```typescript
function calcularTotalJuros(
  valorFinanciado: number,
  parcela: number,
  numeroParcelas: number
): number {
  const totalPago = parcela * numeroParcelas;
  const jurosTotal = totalPago - valorFinanciado;
  return jurosTotal;
}
```

### 2.3 Taxas de Juros Típicas (2024)

- **Banco (novo):** 1.5% - 2.5% ao mês
- **Concessionária:** 1.0% - 2.0% ao mês
- **Usado:** 2.0% - 3.0% ao mês

**Conversão Anual:**
```typescript
// Juros mensal → anual
const taxaAnual = Math.pow(1 + taxaMensal, 12) - 1;

// Exemplo: 1.5% am = 19.56% aa
```

### 2.4 Entrada (Down Payment)

**Típico:**
- Carros novos: 20-30% do valor
- Carros usados: 30-40% do valor

```typescript
const entrada = valorCarro * 0.25; // 25%
const valorFinanciado = valorCarro - entrada;
```

---

## 🚗 3. Aluguel/Assinatura (Rental)

### Custo Total

```
Custo Total = Mensalidade × Número de Meses
```

**Vantagens:**
- Sem depreciação (não é seu)
- Sem custo de oportunidade (não imobiliza capital)
- Geralmente inclui seguro e manutenção
- Sem IPVA (já incluído)

**Simplificação:**
```typescript
function calcularCustoAluguel(
  mensalidade: number,
  meses: number
): number {
  return mensalidade * meses;
}
```

**Valores Típicos (2024):**
- Carro popular: R$ 1.500 - R$ 2.000/mês
- Carro médio: R$ 2.000 - R$ 3.500/mês
- Carro premium: R$ 3.500 - R$ 6.000/mês

---

## 📈 4. Break-Even Point (Ponto de Equilíbrio)

**Conceito:** Momento em que o custo acumulado de alugar se iguala ao custo de comprar.

### Fórmula

```
Custo Aluguel(t) = Custo Compra(t)

Onde t = tempo (meses ou anos)
```

### Implementação

```typescript
function calcularPontoEquilibrio(
  custoCompraPorPeriodo: (periodo: number) => number,
  custoAluguelPorPeriodo: (periodo: number) => number,
  periodoMaximo: number = 120 // 10 anos
): number | null {
  for (let mes = 1; mes <= periodoMaximo; mes++) {
    const custoCompra = custoCompraPorPeriodo(mes);
    const custoAluguel = custoAluguelPorPeriodo(mes);
    
    // Quando aluguel ultrapassa compra
    if (custoAluguel >= custoCompra) {
      return mes;
    }
  }
  
  return null; // Nunca se igualam
}
```

### Interpretação

- **Break-even < 3 anos:** Comprar é vantajoso
- **Break-even 3-5 anos:** Avaliar uso esperado
- **Break-even > 5 anos:** Aluguel pode ser melhor

---

## 🧮 5. Exemplo Completo

### Cenário

- **Valor do carro:** R$ 50.000
- **Aluguel mensal:** R$ 2.200
- **Financiamento:** 25% entrada, 1.5% am, 48 meses
- **Período de análise:** 4 anos (48 meses)

### Cálculos

#### Compra à Vista
```typescript
const valorCarro = 50000;
const anos = 4;

const depreciacao = calcularDepreciacao(valorCarro, anos); // ~25.000
const custoOportunidade = calcularCustoOportunidade(valorCarro, anos); // ~23.456
const ipva = calcularIPVA(valorCarro, anos); // ~7.200
const seguro = calcularSeguro(valorCarro, anos); // ~10.800
const manutencao = 2000 * anos; // 8.000

const custoTotalVista = valorCarro 
  - depreciacao 
  + custoOportunidade 
  + ipva 
  + seguro 
  + manutencao;

// Resultado: ~74.456
```

#### Compra Financiada
```typescript
const entrada = valorCarro * 0.25; // 12.500
const valorFinanciado = valorCarro - entrada; // 37.500
const parcela = calcularParcelaPrice(valorFinanciado, 0.015, 48); // ~1.247

const totalParcelas = parcela * 48; // ~59.856
const jurosTotal = totalParcelas - valorFinanciado; // ~22.356

const custoTotalFinanciado = entrada 
  + totalParcelas 
  + ipva 
  + seguro 
  + manutencao 
  + depreciacao 
  + calcularCustoOportunidade(entrada, anos);

// Resultado: ~96.812
```

#### Aluguel
```typescript
const mensalidade = 2200;
const meses = 48;

const custoTotalAluguel = mensalidade * meses;

// Resultado: 105.600
```

### Comparação

| Modalidade | Custo Total 4 Anos | Diferença |
|------------|-------------------|-----------|
| À Vista    | R$ 74.456         | Base      |
| Financiado | R$ 96.812         | +30%      |
| Aluguel    | R$ 105.600        | +42%      |

**Break-even:** Aluguel x À Vista = ~34 meses

---

## 📚 Referências

- [Sistema Price de Amortização](https://www.bcb.gov.br/pre/bc_atende/port/servicos6.asp)
- [Taxa Selic - Banco Central](https://www.bcb.gov.br/controleinflacao/taxaselic)
- [Tabela FIPE](https://veiculos.fipe.org.br/)
- [Depreciação de Veículos - Estudo Automotive](https://www.automotive-business.com.br/)

---

## 💡 Notas de Implementação

1. **Permitir customização:** Usuário deve poder ajustar taxas (IPVA, seguro, manutenção)
2. **Valores default inteligentes:** Usar médias razoáveis como default
3. **Validação:** Garantir valores positivos e dentro de ranges realistas
4. **Exibição clara:** Mostrar breakdown dos custos, não apenas total
5. **Gráfico temporal:** Mostrar evolução dos custos ao longo do tempo
