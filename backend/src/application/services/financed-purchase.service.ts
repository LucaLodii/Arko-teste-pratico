/**
 * Financed Purchase Service
 *
 * Calculates the total cost of purchasing a car through financing over a
 * specified analysis period. Uses Sistema Price for installment calculation,
 * ownership costs (IPVA, insurance, maintenance) on depreciated values,
 * and opportunity cost on down payment only.
 *
 * Reference: .cursor/rules/financial-formulas.md § 2 (Compra Financiada)
 */

import type {
  CalculationInput,
  FinancedPurchaseResult,
} from '../../domain/types';
import { OpportunityCostService } from './opportunity-cost.service';

const DEFAULT_DEPRECIATION_RATES = [0.2, 0.15, 0.15, 0.1, 0.1];
const DEFAULT_MAINTENANCE_ANNUAL = 2000;
const DEFAULT_INSURANCE_RATE_ANNUAL = 0.06;
const DEFAULT_IPVA_RATE = 0.04;

export class FinancedPurchaseService {
  constructor(private readonly opportunityCostService: OpportunityCostService) {}

  /**
   * Calculates the total cost of a financed car purchase over the analysis period.
   *
   * @param input - Calculation input
   * @returns FinancedPurchaseResult with totalCost, parcela, totalJuros, and breakdown
   */
  calculate(input: CalculationInput): FinancedPurchaseResult {
    const carValue = input.carValue;
    const analysisPeriodMonths = input.analysisPeriodMonths;
    const anos = Math.floor(analysisPeriodMonths / 12);
    const taxas = input.depreciationRate ?? DEFAULT_DEPRECIATION_RATES;

    // Down payment and financed amount
    const downPaymentPercent = input.downPaymentPercent ?? 0.25;
    const entrada = carValue * downPaymentPercent;
    const valorFinanciado = carValue - entrada;

    // Sistema Price installment
    const i = input.interestRateMonth;
    const n = input.financingTermMonths;

    let parcela: number;
    if (i === 0) {
      parcela = valorFinanciado / n;
    } else {
      parcela =
        valorFinanciado *
        (i * Math.pow(1 + i, n)) /
        (Math.pow(1 + i, n) - 1);
    }

    // Installments paid during analysis period
    const parcelasPagas = Math.min(
      analysisPeriodMonths,
      input.financingTermMonths
    );
    const totalParcelas = parcela * parcelasPagas;
    const principalPaid = valorFinanciado * (parcelasPagas / n);
    const totalJuros = totalParcelas - principalPaid;

    // Build year-by-year values for depreciation, IPVA, and insurance
    let valorAtual = carValue;
    const valoresInicioAno: number[] = [valorAtual];

    for (let ano = 0; ano < anos; ano++) {
      const taxa = taxas[ano] ?? taxas[taxas.length - 1];
      valorAtual *= 1 - taxa;
      valoresInicioAno.push(valorAtual);
    }

    const valorResidual = valorAtual;
    const depreciacao = carValue - valorResidual;

    // IPVA: valor at start of each year × rate
    const ipvaRate = input.ipvaRate ?? DEFAULT_IPVA_RATE;
    let ipva = 0;
    for (let ano = 0; ano < anos; ano++) {
      ipva += valoresInicioAno[ano] * ipvaRate;
    }

    // Insurance: valor at start of each year × rate
    const insuranceRate =
      input.insuranceRateAnnual ?? DEFAULT_INSURANCE_RATE_ANNUAL;
    let seguro = 0;
    for (let ano = 0; ano < anos; ano++) {
      seguro += valoresInicioAno[ano] * insuranceRate;
    }

    // Maintenance: fixed annual × complete years
    const manutencao =
      (input.maintenanceAnnual ?? DEFAULT_MAINTENANCE_ANNUAL) * anos;

    // Opportunity cost: down payment only
    const custoOportunidade = this.opportunityCostService.calculate(
      entrada,
      anos
    );

    const totalCost =
      entrada +
      totalParcelas +
      ipva +
      seguro +
      manutencao +
      depreciacao +
      custoOportunidade;

    return {
      totalCost,
      parcela,
      totalJuros,
      breakdown: {
        totalParcelas,
        totalJuros,
        ipva,
        seguro,
        manutencao,
        custoOportunidade,
      },
    };
  }
}
