import { useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import { InputField } from '../../molecules';
import { Button, Icon } from '../../atoms';
import { calculationService } from '../../../services/calculation.service';
import type { CalculationInput, CalculationResponse } from '../../../types/calculation.types';

export interface CalculatorFormProps {
  /** Callback when calculation succeeds (result and input for timeline chart) */
  onCalculate: (result: CalculationResponse, input: CalculationInput) => void;

  /** Optional callback when errors occur */
  onError?: (error: string) => void;

  /** Optional callback when loading state changes */
  onLoadingChange?: (loading: boolean) => void;

  /** Optional initial form values */
  initialValues?: Partial<CalculationInput>;
}

interface FormState {
  carValue: number;
  monthlyRent: number;
  interestRateMonth: number;
  financingTermMonths: number;
  analysisPeriodMonths: number;
  downPaymentPercent: number;
  maintenanceAnnual: number;
  insuranceRateAnnual: number;
  ipvaRate: number;
}

const TOOLTIPS = {
  ipva: 'IPVA (Imposto sobre a Propriedade de Veículos Automotores): imposto anual calculado sobre o valor depreciado do veículo.',
  custoOportunidade: 'Custo de oportunidade: o rendimento que você deixa de ganhar ao usar o dinheiro para comprar o carro em vez de investi-lo.',
  sistemaPrice: 'Sistema Price: método de amortização com parcelas fixas onde juros diminuem e amortização aumenta ao longo do tempo.',
};

const DEFAULT_VALUES: FormState = {
  carValue: 50000,
  monthlyRent: 2200,
  interestRateMonth: 1.5,
  financingTermMonths: 48,
  analysisPeriodMonths: 48,
  downPaymentPercent: 25,
  maintenanceAnnual: 2000,
  insuranceRateAnnual: 6,
  ipvaRate: 4,
};

export function CalculatorForm({ onCalculate, onError, onLoadingChange, initialValues }: CalculatorFormProps) {
  const [formState, setFormState] = useState<FormState>(() => ({
    ...DEFAULT_VALUES,
    ...(initialValues && {
      ...initialValues,
      interestRateMonth: initialValues.interestRateMonth != null
        ? initialValues.interestRateMonth * 100
        : DEFAULT_VALUES.interestRateMonth,
      downPaymentPercent: initialValues.downPaymentPercent != null
        ? initialValues.downPaymentPercent * 100
        : DEFAULT_VALUES.downPaymentPercent,
      insuranceRateAnnual: initialValues.insuranceRateAnnual != null
        ? initialValues.insuranceRateAnnual * 100
        : DEFAULT_VALUES.insuranceRateAnnual,
      ipvaRate: initialValues.ipvaRate != null
        ? initialValues.ipvaRate * 100
        : DEFAULT_VALUES.ipvaRate,
    }),
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    setFormState((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    if (formError) {
      setFormError(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formState.carValue <= 0) {
      newErrors.carValue = 'O valor do carro deve ser maior que zero';
    }

    if (formState.monthlyRent <= 0) {
      newErrors.monthlyRent = 'O aluguel mensal deve ser maior que zero';
    }

    if (formState.interestRateMonth <= 0) {
      newErrors.interestRateMonth = 'A taxa de juros deve ser maior que zero';
    } else if (formState.interestRateMonth > 100) {
      newErrors.interestRateMonth = 'A taxa de juros deve ser menor que 100%';
    }

    if (formState.financingTermMonths < 1 || formState.financingTermMonths > 120) {
      newErrors.financingTermMonths = 'O prazo deve estar entre 1 e 120 meses';
    }

    if (formState.analysisPeriodMonths < 1 || formState.analysisPeriodMonths > 120) {
      newErrors.analysisPeriodMonths = 'O período deve estar entre 1 e 120 meses';
    }

    if (formState.downPaymentPercent < 0 || formState.downPaymentPercent > 100) {
      newErrors.downPaymentPercent = 'A entrada deve estar entre 0% e 100%';
    }

    if (formState.maintenanceAnnual < 0) {
      newErrors.maintenanceAnnual = 'A manutenção não pode ser negativa';
    }

    if (formState.insuranceRateAnnual < 0 || formState.insuranceRateAnnual > 100) {
      newErrors.insuranceRateAnnual = 'A taxa de seguro deve estar entre 0% e 100%';
    }

    if (formState.ipvaRate < 0 || formState.ipvaRate > 100) {
      newErrors.ipvaRate = 'A taxa de IPVA deve estar entre 0% e 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFormError(null);

    if (!validateForm()) {
      return;
    }

    const calculationInput: CalculationInput = {
      carValue: formState.carValue,
      monthlyRent: formState.monthlyRent,
      interestRateMonth: formState.interestRateMonth / 100,
      financingTermMonths: Math.round(formState.financingTermMonths),
      analysisPeriodMonths: Math.round(formState.analysisPeriodMonths),
      downPaymentPercent: formState.downPaymentPercent / 100,
      maintenanceAnnual: formState.maintenanceAnnual,
      insuranceRateAnnual: formState.insuranceRateAnnual / 100,
      ipvaRate: formState.ipvaRate / 100,
    };

    setLoading(true);
    onLoadingChange?.(true);

    try {
      const result = await calculationService.calculate(calculationInput);
      onCalculate(result, calculationInput);
    } catch (error: unknown) {
      let errorMessage = 'Erro ao calcular. Tente novamente.';

      if (error instanceof Error) {
        const err = error as Error & { code?: string };
        if (err.code === 'ERR_NETWORK' || err.message?.includes('Network')) {
          errorMessage = 'Erro ao conectar com o servidor. Verifique sua conexão.';
        }
      }
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          const data = error.response.data as
            | { details?: Array<{ message: string }>; error?: string }
            | undefined;
          if (data?.details) {
            errorMessage = `Erro de validação: ${data.details.map((d) => d.message).join(', ')}`;
          } else if (data?.error) {
            errorMessage = data.error;
          } else {
            errorMessage = 'Dados inválidos. Verifique os campos e tente novamente.';
          }
        } else if (error.response?.status === 500) {
          errorMessage = 'Erro no servidor. Tente novamente em alguns instantes.';
        }
      }

      setFormError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-[800px] space-y-8">
      <section>
        <div className="mb-6 flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-sage-400" />
          <h2 className="text-h2 !text-xl md:!text-2xl">Dados Básicos</h2>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
          <InputField
            label="Valor do Carro"
            type="number"
            value={formState.carValue}
            onChange={handleChange('carValue')}
            error={errors.carValue}
            placeholder="50.000"
            min={0}
            step={1000}
            disabled={loading}
            required
          />

          <InputField
            label="Aluguel Mensal"
            type="number"
            value={formState.monthlyRent}
            onChange={handleChange('monthlyRent')}
            error={errors.monthlyRent}
            placeholder="2.200"
            min={0}
            step={100}
            disabled={loading}
            required
          />

          <InputField
            label="Taxa de Juros Mensal (%)"
            type="number"
            value={formState.interestRateMonth}
            onChange={handleChange('interestRateMonth')}
            error={errors.interestRateMonth}
            placeholder="1,5"
            min={0}
            max={100}
            step={0.01}
            disabled={loading}
            required
            tooltip={TOOLTIPS.sistemaPrice}
          />

          <InputField
            label="Prazo do Financiamento (meses)"
            type="number"
            value={formState.financingTermMonths}
            onChange={handleChange('financingTermMonths')}
            error={errors.financingTermMonths}
            placeholder="48"
            min={1}
            max={120}
            step={1}
            disabled={loading}
            required
          />

          <InputField
            label="Período de Análise (meses)"
            type="number"
            value={formState.analysisPeriodMonths}
            onChange={handleChange('analysisPeriodMonths')}
            error={errors.analysisPeriodMonths}
            placeholder="48"
            min={1}
            max={120}
            step={1}
            disabled={loading}
            required
          />
        </div>
      </section>

      <section className="border-t border-olive-100 pt-6">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="group flex w-full min-h-[48px] items-center gap-2 py-3 text-left font-medium text-olive-600 transition-colors hover:text-olive-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2 rounded-lg"
          aria-expanded={showAdvanced}
          aria-controls="advanced-options"
        >
          <span
            className={`transition-transform duration-300 ${showAdvanced ? 'rotate-90' : 'rotate-0'}`}
          >
            <Icon name="chevron-right" size="sm" />
          </span>
          <span className="text-lg">Opções Avançadas</span>
          <span className="ml-auto hidden text-sm font-normal text-olive-400 sm:block">
            {showAdvanced ? 'Ocultar detalhes' : 'Ajustar entrada, manutenção, taxas...'}
          </span>
        </button>

        {showAdvanced && (
          <div id="advanced-options" className="mt-6 border-t border-olive-100 pt-6">
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
              <InputField
                label="Entrada (%)"
                type="number"
                value={formState.downPaymentPercent}
                onChange={handleChange('downPaymentPercent')}
                error={errors.downPaymentPercent}
                placeholder="25"
                min={0}
                max={100}
                step={1}
                disabled={loading}
                tooltip={TOOLTIPS.custoOportunidade}
              />

              <InputField
                label="Manutenção Anual (R$)"
                type="number"
                value={formState.maintenanceAnnual}
                onChange={handleChange('maintenanceAnnual')}
                error={errors.maintenanceAnnual}
                placeholder="2.000"
                min={0}
                step={100}
                disabled={loading}
              />

              <InputField
                label="Taxa de Seguro Anual (%)"
                type="number"
                value={formState.insuranceRateAnnual}
                onChange={handleChange('insuranceRateAnnual')}
                error={errors.insuranceRateAnnual}
                placeholder="6"
                min={0}
                max={100}
                step={0.1}
                disabled={loading}
              />

              <InputField
                label="Taxa IPVA (%)"
                type="number"
                value={formState.ipvaRate}
                onChange={handleChange('ipvaRate')}
                error={errors.ipvaRate}
                placeholder="4"
                min={0}
                max={100}
                step={0.1}
                disabled={loading}
                tooltip={TOOLTIPS.ipva}
              />
            </div>
          </div>
        )}
      </section>

      {formError && (
        <div
          className="mb-6 rounded-lg border border-status-error bg-red-50 p-4 text-sm leading-relaxed text-status-error"
          role="alert"
        >
          {formError}
        </div>
      )}

      <div className="pt-4">
        <Button type="submit" variant="primary" loading={loading} fullWidth className="text-lg shadow-lg shadow-sage-400/20">
          Calcular Comparação
        </Button>
      </div>
    </form>
  );
}
