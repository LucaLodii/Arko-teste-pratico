/**
 * Cash Purchase Service
 *
 * Calculates the total cost of purchasing a car with cash over a specified
 * analysis period. Uses exponential depreciation, IPVA, insurance, maintenance,
 * and opportunity cost.
 *
 * Reference: .cursor/rules/financial-formulas.md § 1 (Compra à Vista)
 */

import type { CalculationInput, CashPurchaseResult } from '../../domain/types';
import { OpportunityCostService } from './opportunity-cost.service';

const DEFAULT_DEPRECIATION_RATES = [0.2, 0.15, 0.15, 0.1, 0.1];
const DEFAULT_MAINTENANCE_ANNUAL = 2000;
const DEFAULT_INSURANCE_RATE_ANNUAL = 0.06;
const DEFAULT_IPVA_RATE = 0.04;

export class CashPurchaseService {
  constructor(private readonly opportunityCostService: OpportunityCostService) {}

  /**
   * Calculates the total cost of a cash car purchase over the analysis period.
   *
   * @param input - Calculation input (carValue, analysisPeriodMonths, and optional rates)
   * @returns CashPurchaseResult with totalCost and breakdown
   */
  calculate(input: CalculationInput): CashPurchaseResult {
    const carValue = input.carValue;
    const analysisPeriodMonths = input.analysisPeriodMonths;
    const anos = Math.floor(analysisPeriodMonths / 12);
    const taxas = input.depreciationRate ?? DEFAULT_DEPRECIATION_RATES;

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
    const insuranceRate = input.insuranceRateAnnual ?? DEFAULT_INSURANCE_RATE_ANNUAL;
    let seguro = 0;
    for (let ano = 0; ano < anos; ano++) {
      seguro += valoresInicioAno[ano] * insuranceRate;
    }

    // Maintenance: fixed annual × complete years
    const manutencao =
      (input.maintenanceAnnual ?? DEFAULT_MAINTENANCE_ANNUAL) * anos;

    // Opportunity cost: capital immobilized in the car
    const custoOportunidade = this.opportunityCostService.calculate(
      carValue,
      anos
    );

    const totalCost =
      carValue -
      depreciacao +
      ipva +
      seguro +
      manutencao +
      custoOportunidade;

    return {
      totalCost,
      breakdown: {
        depreciacao,
        ipva,
        seguro,
        manutencao,
        custoOportunidade,
      },
    };
  }
}
