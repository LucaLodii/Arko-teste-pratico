# Architecture Guide

Este documento define a arquitetura do projeto Rent vs. Buy Car Calculator.

---

## Backend: Hexagonal Architecture (Ports and Adapters)

### 📁 Folder Structure

```
backend/src/
├── domain/                    # Camada de domínio (core business)
│   ├── entities/             # Entidades de negócio
│   │   └── calculation-result.ts
│   ├── value-objects/        # Objetos de valor imutáveis
│   │   ├── money.ts
│   │   └── percentage.ts
│   └── types/                # Tipos do domínio
│       └── index.ts
│
├── application/               # Camada de aplicação (use cases)
│   ├── services/             # Serviços de cálculo (lógica de negócio)
│   │   ├── cash-purchase.service.ts
│   │   ├── financed-purchase.service.ts
│   │   ├── rental.service.ts
│   │   ├── break-even.service.ts
│   │   └── opportunity-cost.service.ts
│   └── use-cases/            # Casos de uso
│       └── calculate-comparison.use-case.ts
│
├── adapters/                  # Camada de adaptadores
│   ├── controllers/          # HTTP request handlers (input adapters)
│   │   └── calculation.controller.ts
│   ├── validators/           # Input validation (Zod)
│   │   └── calculation-input.validator.ts
│   └── dto/                  # Data Transfer Objects
│       ├── calculation-request.dto.ts
│       └── calculation-response.dto.ts
│
├── ports/                     # Interfaces (contratos)
│   ├── input/                # Portas de entrada
│   │   └── calculation.port.ts
│   └── output/               # Portas de saída (se necessário)
│
├── routes/                    # Definição de rotas Express
│   └── calculation.routes.ts
│
└── index.ts                   # Infrastructure setup (Express, middleware, routes)
```

### 🔄 Data Flow

```
HTTP Request
    ↓
Express Middleware (CORS, JSON parser)
    ↓
Route Handler (routes/calculation.routes.ts)
    ↓
Validator (adapters/validators) - Valida entrada com Zod
    ↓
Controller (adapters/controllers) - Adapta HTTP → Domain
    ↓
Use Case (application/use-cases) - Orquestra a operação
    ↓
Services (application/services) - Lógica de cálculo pura
    ↓
Domain Entities/Value Objects - Representam conceitos de negócio
    ↓
Controller formata resposta (DTO)
    ↓
HTTP Response (JSON)
```

### 📏 Dependency Rules (CRITICAL)

**Regra de ouro:** Dependências apontam SEMPRE para dentro (para o domínio).

1. **Domain (core)** → Não depende de NADA
   - Apenas TypeScript puro
   - Sem imports de Express, Zod, etc
   - Apenas lógica de negócio pura

2. **Application** → Depende apenas de Domain
   - Services usam entities/value-objects do domain
   - Use cases orquestram services
   - Sem conhecimento de HTTP, validação, etc

3. **Adapters** → Dependem de Application e Domain
   - Controllers conhecem HTTP (req/res) e chamam use cases
   - Validators usam Zod e validam contra tipos do Domain
   - DTOs transformam dados externos ↔ domínio

4. **Infrastructure (index.ts)** → Depende de tudo
   - Configura Express
   - Injeta dependências
   - Conecta routes → controllers → use cases

### 📚 API Documentation

**Tool:** Swagger UI (via swagger-ui-express)

**Spec Location:** `backend/src/swagger.yaml` (OpenAPI 3.0 format)

**Access:** `http://localhost:3000/api-docs` when server is running

#### Update Policy

**CRITICAL:** Swagger spec must stay in sync with the actual API.

**Update the spec whenever:**
1. Adding a new endpoint → Add path definition with all parameters and responses
2. Changing request/response DTOs → Update corresponding schemas in `components/schemas`
3. Adding new validation rules → Reflect in schema constraints (min, max, required, etc.)
4. Changing error responses → Update response definitions

**Workflow:**
1. Make code changes (DTOs, controllers, routes)
2. Update `swagger.yaml` to match
3. Restart server and verify at `/api-docs` that changes appear correctly
4. Test "Try it out" functionality for modified endpoints

**Schema Mapping:**
- `CalculationRequestDto` → `components/schemas/CalculationInput`
- `CalculationResponseDto` → `components/schemas/CalculationResponse`
- Nested types → Separate schemas with `$ref` references

**Example:**
```yaml
paths:
  /api/calculate:
    post:
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CalculationInput'
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CalculationResponse'
```

### 🎯 Implementation Guidelines

#### Controllers
```typescript
// ✅ Bom: Controller apenas adapta HTTP ↔ Domain
export class CalculationController {
  async calculate(req: Request, res: Response) {
    try {
      // 1. Validação já foi feita pelo middleware
      const input = req.body as CalculationRequestDto;
      
      // 2. Chama o use case (não faz lógica aqui!)
      const result = await this.calculateComparisonUseCase.execute(input);
      
      // 3. Formata resposta
      res.json(result);
    } catch (error) {
      // 4. Trata erro
      res.status(400).json({ error: error.message });
    }
  }
}

// ❌ Ruim: Controller fazendo lógica de negócio
export class CalculationController {
  async calculate(req: Request, res: Response) {
    const totalCost = req.body.carValue * 0.85 + req.body.maintenance; // ❌
    res.json({ totalCost });
  }
}
```

#### Services
```typescript
// ✅ Bom: Service com função pura, sem side effects. Usa OpportunityCostService.
export class CashPurchaseService {
  constructor(private opportunityCostService: OpportunityCostService) {}

  calculate(params: CashPurchaseParams): CashPurchaseResult {
    const depreciation = this.calculateDepreciation(params.carValue, params.years);
    const opportunityCost = this.opportunityCostService.calculate(
      params.carValue,
      params.years,
      params.interestRate
    );

    return {
      totalCost: params.carValue + params.maintenance - depreciation + opportunityCost,
      depreciation,
      opportunityCost
    };
  }
}

// ❌ Ruim: Service com acesso a req/res
export class CashPurchaseService {
  calculate(req: Request, res: Response) { // ❌ Não deve conhecer HTTP
    // ...
  }
}
```

#### Use Cases
```typescript
// ✅ Bom: Use case orquestra múltiplos services
export class CalculateComparisonUseCase {
  constructor(
    private cashService: CashPurchaseService,
    private financedService: FinancedPurchaseService,
    private rentalService: RentalService,
    private breakEvenService: BreakEvenService
  ) {}

  execute(input: CalculationInput): CalculationResult {
    const cashResult = this.cashService.calculate(input);
    const financedResult = this.financedService.calculate(input);
    const rentalResult = this.rentalService.calculate(input);
    const breakEven = this.breakEvenService.calculate(
      input,
      this.cashService,
      this.financedService,
      this.rentalService
    );

    return { cashResult, financedResult, rentalResult, breakEven };
  }
}
```

---

## Frontend: Atomic Design

### 📁 Folder Structure

```
frontend/src/
├── components/
│   ├── atoms/                 # Componentes básicos indivisíveis
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Label/
│   │   └── Card/
│   │
│   ├── molecules/             # Combinação simples de átomos
│   │   ├── InputField/       # Label + Input + Error message
│   │   ├── FormGroup/
│   │   └── ResultCard/
│   │
│   ├── organisms/             # Componentes complexos
│   │   ├── CalculatorForm/   # Formulário completo de inputs
│   │   ├── ResultsTable/     # Tabela de comparação
│   │   ├── BreakEvenChart/   # Gráfico
│   │   └── ComparisonSummary/
│   │
│   ├── templates/             # Layouts de página
│   │   └── MainLayout/
│   │
│   └── pages/                 # Páginas completas com dados
│       └── CalculatorPage/
│
├── services/                  # Comunicação com API
│   ├── api.ts                # Axios/fetch config
│   └── calculation.service.ts
│
├── types/                     # TypeScript interfaces
│   ├── calculation.types.ts
│   └── api.types.ts
│
├── hooks/                     # Custom React hooks
│   └── useCalculation.ts
│
├── utils/                     # Helper functions
│   ├── formatters.ts         # Formato de moeda, porcentagem
│   └── validators.ts
│
├── App.tsx                    # Componente principal
└── main.tsx                   # Entry point
```

### 🧱 Component Hierarchy

```
Pages (dados + comportamento)
    ↓
Templates (layout + estrutura)
    ↓
Organisms (funcionalidade complexa)
    ↓
Molecules (combinação simples)
    ↓
Atoms (elementos básicos)
```

### 📋 Component Rules

#### Atoms (Átomos)
- **O que são:** Elementos básicos, indivisíveis, reutilizáveis
- **Exemplos:** Button, Input, Label, Icon, Card
- **Regras:**
  - Sem lógica de negócio
  - Apenas props de apresentação
  - Estilização própria
  - Máxima reutilização

```typescript
// ✅ Bom: Atom genérico e reutilizável
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  return <button className={`btn btn--${variant}`} {...props}>{children}</button>;
};
```

#### Molecules (Moléculas)
- **O que são:** Combinação de átomos com propósito específico
- **Exemplos:** InputField (Label + Input + Error), SearchBar
- **Regras:**
  - Composição de 2-5 átomos
  - Lógica simples de apresentação
  - Ainda bem reutilizáveis

```typescript
// ✅ Bom: Molecule combina átomos
interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, error }) => {
  return (
    <div className="input-field">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};
```

#### Organisms (Organismos)
- **O que são:** Componentes complexos com funcionalidade própria
- **Exemplos:** CalculatorForm, ResultsTable, BreakEvenChart
- **Regras:**
  - Podem ter estado local
  - Lógica de negócio permitida
  - Compostos de molecules/atoms
  - Menos reutilizáveis (mais específicos)

```typescript
// ✅ Bom: Organism com lógica de formulário
export const CalculatorForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const { calculate, loading, error } = useCalculation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await calculate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputField label="Valor do Carro" value={formData.carValue} onChange={...} />
      <InputField label="Aluguel Mensal" value={formData.monthlyRent} onChange={...} />
      <Button type="submit" disabled={loading}>Calcular</Button>
    </form>
  );
};
```

#### Templates & Pages
- **Templates:** Estrutura/layout sem dados
- **Pages:** Template + dados + comportamento

### 🎨 Styling Strategy

**Opção recomendada:** CSS Modules
- Scoped styles por componente
- Evita conflitos de nomes
- Type-safe com TypeScript

```typescript
import styles from './Button.module.css';

export const Button = () => <button className={styles.button}>Click</button>;
```

### 🔄 State Management

- **Props drilling:** Para dados simples (máximo 2-3 níveis)
- **Context API:** Se precisar de estado global (tema, user settings)
- **React Query:** Para estado de servidor/API (opcional, mas recomendado)

---

## 🔗 Integration: Frontend ↔ Backend

### API Communication

```typescript
// frontend/src/services/calculation.service.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000'
});

export const calculationService = {
  async calculate(input: CalculationInput): Promise<CalculationResult> {
    const response = await api.post('/api/calculate', input);
    return response.data;
  }
};
```

### Type Safety

**IMPORTANTE:** Compartilhar tipos entre frontend e backend:

**Opção 1:** Duplicar tipos (simples, projeto pequeno)
**Opção 2:** Monorepo com shared types (mais complexo)

Para este projeto: **duplicar tipos** é aceitável.

---

## 🧪 Testing Strategy

### Backend
- **Unit tests:** Services (lógica pura de cálculo)
- **Integration tests:** Controllers + routes
- **Tools:** Jest, Supertest

### Frontend
- **Unit tests:** Atoms, molecules (componentes puros)
- **Integration tests:** Organisms, pages
- **Tools:** Vitest, React Testing Library

---

## 📝 Key Principles Summary

1. **Separation of Concerns:** Cada camada tem uma responsabilidade clara
2. **Dependency Rule:** Dependências apontam para dentro (domínio)
3. **Testability:** Lógica de negócio desacoplada de infraestrutura
4. **Type Safety:** TypeScript em 100% do código
5. **Pure Functions:** Services devem ser funções puras quando possível
6. **Component Composition:** Construir do pequeno para o grande
