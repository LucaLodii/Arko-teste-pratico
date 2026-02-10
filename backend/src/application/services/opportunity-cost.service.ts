/**
 * Opportunity Cost Service
 *
 * Calculates the opportunity cost of capital using compound interest.
 * Represents how much money invested in an asset (e.g., a car) could have
 * earned if invested elsewhere (e.g., at the Selic rate).
 *
 * Reference: .cursor/rules/financial-formulas.md § 1.2 (Custo de Oportunidade)
 */

const DEFAULT_TAXA_ANUAL = 0.1375; // Selic rate 13.75% (2024)

export class OpportunityCostService {
  /**
   * Calculates the opportunity cost of capital using compound interest.
   *
   * @param capital - The amount of money invested (e.g., car value or down payment)
   * @param years - The number of years the capital is immobilized
   * @param taxaAnual - Annual interest rate (optional, defaults to Selic 13.75%)
   * @returns The opportunity cost (earnings that could have been made), not including principal
   *
   * @example
   * // R$ 50,000 for 3 years at 13.75% → R$ 23,456 opportunity cost
   * calculate(50000, 3) // ~23456
   */
  calculate(capital: number, years: number, taxaAnual?: number): number {
    const taxa = taxaAnual ?? DEFAULT_TAXA_ANUAL;
    const montanteFinal = capital * Math.pow(1 + taxa, years);
    return montanteFinal - capital;
  }
}
