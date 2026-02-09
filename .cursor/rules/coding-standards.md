# Coding Standards

Padrões de código para garantir consistência e qualidade no projeto.

---

## 🎯 TypeScript

### Naming Conventions

#### Interfaces & Types
```typescript
// ✅ Bom: PascalCase, sem prefixo I
interface User {
  id: string;
  name: string;
}

type CalculationResult = {
  totalCost: number;
};

// ❌ Ruim: Prefixo I (estilo C#/Java)
interface IUser { } // ❌
```

#### Classes & Enums
```typescript
// ✅ Bom: PascalCase
class CashPurchaseService { }
enum PurchaseType {
  CASH = 'cash',
  FINANCED = 'financed'
}
```

#### Functions & Variables
```typescript
// ✅ Bom: camelCase, nomes descritivos com verbos
function calculateTotalCost(params: CalculationParams): number { }
const totalCost = 10000;
const isFinanced = true;

// ❌ Ruim: Nomes vagos
function calc(p: any) { } // ❌
const x = 10000; // ❌
```

#### Constants
```typescript
// ✅ Bom: UPPER_SNAKE_CASE para constantes verdadeiras
const MAX_FINANCING_YEARS = 5;
const DEFAULT_INTEREST_RATE = 0.12;
const API_BASE_URL = 'http://localhost:3000';

// Nota: Configuração que pode mudar → camelCase
const apiConfig = { baseURL: '...' };
```

#### Files
```typescript
// ✅ Bom: kebab-case
// cash-purchase.service.ts
// calculation-result.dto.ts
// break-even.service.ts

// ❌ Ruim: camelCase, PascalCase em arquivos
// cashPurchase.service.ts ❌
// CalculationResult.ts ❌
```

### Type Safety Rules

#### Strict Mode (ALWAYS)
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,           // ✅ Obrigatório
    "noImplicitAny": true,    // ✅ Já incluído no strict
    "strictNullChecks": true  // ✅ Já incluído no strict
  }
}
```

#### Avoid `any`
```typescript
// ❌ Ruim: any esconde erros
function processData(data: any) { }

// ✅ Bom: Tipo específico
function processData(data: CalculationInput) { }

// ✅ Aceitável: unknown quando realmente não sabe
function parseJson(json: string): unknown {
  return JSON.parse(json);
}
```

#### Explicit Return Types
```typescript
// ✅ Bom: Tipo de retorno explícito em funções públicas
export function calculateCost(value: number): number {
  return value * 1.1;
}

// ✅ Aceitável: Inferência em funções privadas simples
function multiply(a: number, b: number) { // retorno inferido: number
  return a * b;
}
```

#### Prefer Type Inference for Variables
```typescript
// ✅ Bom: Tipo inferido quando óbvio
const name = 'John';          // string inferido
const age = 30;               // number inferido
const items = [1, 2, 3];      // number[] inferido

// ✅ Bom: Tipo explícito quando não óbvio
const result: CalculationResult = await calculate();
```

### Code Organization

#### One Export Per File Rule
```typescript
// ✅ Bom: Um export principal por arquivo
// cash-purchase.service.ts
export class CashPurchaseService {
  // ...
}

// ✅ Aceitável: Tipos relacionados junto
// calculation.types.ts
export interface CalculationInput { }
export interface CalculationResult { }
export type CalculationType = 'cash' | 'financed' | 'rental';
```

#### File Size Limit
- **Guideline:** Máximo 200-250 linhas por arquivo
- **Se exceder:** Considerar quebrar em múltiplos arquivos/módulos
- **Exceção:** Arquivos de tipos/interfaces podem ser maiores

#### Imports Order
```typescript
// 1. External dependencies
import express from 'express';
import { z } from 'zod';

// 2. Internal absolute imports (@/...)
import { User } from '@/domain/entities/user';

// 3. Relative imports (mesmo módulo)
import { calculateDepreciation } from './depreciation';
import type { CalculationParams } from './types';

// 4. CSS/Assets
import styles from './Component.module.css';
```

---

## ⚛️ React / Frontend

### Component Rules

#### Functional Components Only
```typescript
// ✅ Bom: Functional component com TypeScript
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>;
};

// ❌ Ruim: Class component (não usar mais)
class Button extends React.Component { } // ❌
```

#### Props Interface Above Component
```typescript
// ✅ Bom: Props definidas logo acima
interface CardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, description, children }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </div>
  );
};
```

#### Destructure Props in Parameter
```typescript
// ✅ Bom: Destructuring direto
export const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>;
};

// ❌ Ruim: Usar props.
export const Button: React.FC<ButtonProps> = (props) => {
  return <button onClick={props.onClick}>{props.children}</button>; // ❌
};
```

#### One Component Per File
```typescript
// ✅ Bom: Um componente principal por arquivo
// Button.tsx
export const Button = () => { };

// ❌ Ruim: Múltiplos componentes exportados
// components.tsx
export const Button = () => { };
export const Input = () => { };  // ❌ Criar Input.tsx separado
```

### Hooks Rules

#### Custom Hooks Naming
```typescript
// ✅ Bom: Sempre começar com 'use'
function useCalculation() { }
function useFormValidation() { }

// ❌ Ruim: Sem prefixo 'use'
function calculation() { } // ❌
```

#### Hooks Order (Always the Same)
```typescript
export const Component = () => {
  // 1. useState
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  
  // 2. useEffect
  useEffect(() => { }, []);
  
  // 3. Custom hooks
  const { data, loading } = useCalculation();
  
  // 4. Event handlers
  const handleClick = () => { };
  
  // 5. Render
  return <div>...</div>;
};
```

### Styling

#### CSS Modules (Recommended)
```typescript
// Button.module.css
.button {
  padding: 10px 20px;
}

.button--primary {
  background: blue;
}

// Button.tsx
import styles from './Button.module.css';

export const Button = () => (
  <button className={styles.button}>Click</button>
);
```

#### No Complex Inline Styles
```typescript
// ❌ Ruim: Inline styles complexos
<div style={{ padding: '10px', margin: '5px', backgroundColor: '#fff' }}>

// ✅ Bom: CSS Module ou classe
<div className={styles.container}>

// ✅ Aceitável: Inline para valores dinâmicos simples
<div style={{ width: `${percentage}%` }}>
```

#### Mobile-First Approach
```css
/* ✅ Bom: Mobile primeiro, depois desktop */
.container {
  padding: 10px; /* mobile */
}

@media (min-width: 768px) {
  .container {
    padding: 20px; /* desktop */
  }
}
```

---

## 🚀 Express / Backend

### Controller Pattern

#### Async/Await (Not Callbacks)
```typescript
// ✅ Bom: Async/await
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Ruim: Callbacks
export const getUser = (req: Request, res: Response) => {
  userService.findById(req.params.id, (err, user) => { // ❌
    if (err) return res.status(500).json({ error: err });
    res.json(user);
  });
};
```

#### Try/Catch in Every Controller
```typescript
// ✅ Bom: Sempre try/catch
export const calculate = async (req: Request, res: Response) => {
  try {
    // lógica aqui
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

#### Validate Early
```typescript
// ✅ Bom: Validação no início
export const calculate = async (req: Request, res: Response) => {
  try {
    // 1. Validação (já feita por middleware, mas verificar)
    const input = req.body as CalculationInput;
    
    // 2. Lógica
    const result = await service.calculate(input);
    
    // 3. Resposta
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

#### Appropriate Status Codes
```typescript
// ✅ Bom: Status codes corretos
res.status(200).json(data);        // OK
res.status(201).json(created);     // Created
res.status(400).json({ error }); // Bad Request
res.status(404).json({ error }); // Not Found
res.status(500).json({ error }); // Internal Server Error

// ❌ Ruim: Sempre 200
res.json({ error: 'Not found' }); // ❌ Deveria ser 404
```

### Service Pattern

#### Pure Functions When Possible
```typescript
// ✅ Bom: Função pura, sem side effects
export class CashPurchaseService {
  calculate(params: CashPurchaseParams): CashPurchaseResult {
    const depreciation = this.calculateDepreciation(params);
    const totalCost = params.carValue - depreciation + params.maintenance;
    return { totalCost, depreciation };
  }
  
  private calculateDepreciation(params: CashPurchaseParams): number {
    return params.carValue * params.depreciationRate * params.years;
  }
}
```

#### No Direct Access to req/res
```typescript
// ❌ Ruim: Service conhecendo HTTP
export class CalculationService {
  calculate(req: Request, res: Response) { // ❌
    const result = req.body.value * 2;
    res.json({ result });
  }
}

// ✅ Bom: Service recebe dados puros
export class CalculationService {
  calculate(value: number): number {
    return value * 2;
  }
}
```

#### Return Objects, Not Responses
```typescript
// ✅ Bom: Retorna objeto, controller decide o que fazer
export class UserService {
  async findById(id: string): Promise<User> {
    const user = await db.users.findOne({ id });
    if (!user) throw new Error('User not found');
    return user;
  }
}

// ❌ Ruim: Service enviando response
export class UserService {
  async findById(id: string, res: Response) { // ❌
    const user = await db.users.findOne({ id });
    res.json(user);
  }
}
```

---

## 📝 General Best Practices

### Comments

#### When to Comment
```typescript
// ✅ Bom: Comentar o "porquê", não o "o quê"
// Usamos depreciação linear pois é mais simples de explicar ao usuário
const depreciation = carValue * depreciationRate * years;

// ❌ Ruim: Comentário óbvio
// Multiplica o valor do carro pela taxa e anos
const depreciation = carValue * depreciationRate * years; // ❌
```

#### Complex Logic
```typescript
// ✅ Bom: Explicar lógica complexa
/**
 * Calcula o custo de oportunidade do capital investido.
 * Representa o quanto o dinheiro renderia se investido em vez de usado no carro.
 * Taxa baseada em CDI/Selic (~13.75% aa em 2024).
 */
function calculateOpportunityCost(capital: number, years: number): number {
  const annualRate = 0.1375;
  return capital * annualRate * years;
}
```

### Error Handling

#### Descriptive Error Messages
```typescript
// ✅ Bom: Mensagem clara e acionável
throw new Error('Car value must be greater than 0');

// ❌ Ruim: Mensagem vaga
throw new Error('Invalid input'); // ❌
```

#### Custom Error Classes (If Needed)
```typescript
// ✅ Bom: Errors customizados para casos específicos
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

### Magic Numbers

#### Use Named Constants
```typescript
// ❌ Ruim: Magic numbers
const cost = value * 0.15 + 1200; // ❌ O que é 0.15? O que é 1200?

// ✅ Bom: Constantes nomeadas
const DEPRECIATION_RATE = 0.15;
const ANNUAL_MAINTENANCE_COST = 1200;
const cost = value * DEPRECIATION_RATE + ANNUAL_MAINTENANCE_COST;
```

---

## ✅ Code Review Checklist

Antes de fazer commit, verificar:

- [ ] Nomes de variáveis/funções são descritivos?
- [ ] Sem `any` desnecessário?
- [ ] Funções têm tipos de retorno explícitos?
- [ ] Código está na camada correta (domain/application/adapters)?
- [ ] Services não acessam req/res diretamente?
- [ ] Componentes React seguem atomic design?
- [ ] Tem try/catch em controllers?
- [ ] Constantes mágicas foram nomeadas?
- [ ] Código está testável (funções puras quando possível)?
- [ ] Imports estão organizados?

---

## 🎓 Learning Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
