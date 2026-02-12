import { useState } from 'react';
import { Icon } from '../../atoms';

export interface MethodologySectionProps {
    // No props needed - self-contained component
}

/**
 * Premium methodology section explaining how calculations work
 * Positioned between results and footer with dark green background
 */
export function MethodologySection() {
    const [showTechnical, setShowTechnical] = useState(false);

    return (
        <section className="relative overflow-hidden bg-olive-900 py-16 md:py-20">
            {/* Decorative orbs */}
            <div className="pointer-events-none absolute left-0 top-0 -ml-20 -mt-20 h-64 w-64 rounded-full bg-sage-500 opacity-10 blur-3xl" />
            <div className="pointer-events-none absolute right-0 bottom-0 -mr-20 -mb-20 h-48 w-48 rounded-full bg-sage-400 opacity-5 blur-3xl" />

            {/* Container */}
            <div className="relative z-10 mx-auto max-w-[1200px] px-4 md:px-8">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h2 className="mb-4 flex items-center justify-center gap-3 text-3xl font-bold text-white md:text-4xl">
                        <Icon name="search" size="lg" className="text-sage-400" />
                        Como Calculamos os Resultados?
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg leading-relaxed text-sage-200">
                        Entenda a metodologia por trás dos números e tome decisões financeiras informadas
                    </p>
                </div>

                {/* Methodology Cards Grid */}
                <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Card 1 - Depreciation */}
                    <div className="rounded-2xl border border-sage-500/20 bg-olive-800/50 p-6 backdrop-blur-sm transition-all hover:border-sage-500/40 hover:bg-olive-800/60">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sage-500/20 text-sage-300">
                                <Icon name="trending-down" size="xl" />
                            </div>
                            <h3 className="text-xl font-bold text-sage-50">Depreciação</h3>
                        </div>
                        <p className="mb-4 text-sm leading-relaxed text-sage-200">
                            Calculamos a perda de valor do veículo usando taxas decrescentes ao longo de 5 anos:
                        </p>
                        <ul className="space-y-1 text-sm text-olive-200">
                            <li>• Ano 1: <span className="font-semibold text-sage-300">20%</span></li>
                            <li>• Ano 2: <span className="font-semibold text-sage-300">15%</span></li>
                            <li>• Ano 3: <span className="font-semibold text-sage-300">15%</span></li>
                            <li>• Ano 4: <span className="font-semibold text-sage-300">10%</span></li>
                            <li>• Ano 5: <span className="font-semibold text-sage-300">10%</span></li>
                        </ul>
                        <p className="mt-4 text-xs italic text-olive-300">
                            Reflete a realidade: carros perdem mais valor nos primeiros anos.
                        </p>
                    </div>

                    {/* Card 2 - Opportunity Cost */}
                    <div className="rounded-2xl border border-sage-500/20 bg-olive-800/50 p-6 backdrop-blur-sm transition-all hover:border-sage-500/40 hover:bg-olive-800/60">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sage-500/20 text-sage-300">
                                <Icon name="trending-up" size="xl" />
                            </div>
                            <h3 className="text-xl font-bold text-sage-50">Custo de Oportunidade</h3>
                        </div>
                        <p className="mb-4 text-sm leading-relaxed text-sage-200">
                            O rendimento que você deixa de ganhar ao usar o dinheiro para comprar o carro em
                            vez de investi-lo.
                        </p>
                        <div className="mb-4 rounded-lg bg-olive-900/30 p-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-sage-300">
                                Taxa padrão
                            </p>
                            <p className="text-lg font-bold text-white">13,75% a.a.</p>
                            <p className="text-xs text-olive-300">(CDI/Selic)</p>
                        </div>
                        <p className="text-xs italic text-olive-300">
                            Calculado com juros compostos sobre o valor total (compra à vista) ou entrada
                            (financiamento).
                        </p>
                    </div>

                    {/* Card 3 - IPVA, Insurance, Maintenance */}
                    <div className="rounded-2xl border border-sage-500/20 bg-olive-800/50 p-6 backdrop-blur-sm transition-all hover:border-sage-500/40 hover:bg-olive-800/60">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sage-500/20 text-sage-300">
                                <Icon name="building" size="xl" />
                            </div>
                            <h3 className="text-xl font-bold text-sage-50">IPVA, Seguro e Manutenção</h3>
                        </div>
                        <p className="mb-4 text-sm leading-relaxed text-sage-200">
                            Custos recorrentes da propriedade do veículo:
                        </p>
                        <ul className="space-y-2 text-sm text-olive-200">
                            <li className="flex items-center justify-between">
                                <span>• IPVA:</span>
                                <span className="font-semibold text-sage-300">4% a.a.</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span>• Seguro:</span>
                                <span className="font-semibold text-sage-300">6% a.a.</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span>• Manutenção:</span>
                                <span className="font-semibold text-sage-300">R$ 2.000/ano</span>
                            </li>
                        </ul>
                        <p className="mt-4 text-xs italic text-olive-300">
                            Todos calculados sobre o valor depreciado para maior precisão.
                        </p>
                    </div>
                </div>

                {/* Technical Details Section (Expandable) */}
                <div className="rounded-2xl border border-sage-500/20 bg-olive-800/30 overflow-hidden backdrop-blur-sm">
                    <button
                        type="button"
                        onClick={() => setShowTechnical(!showTechnical)}
                        aria-expanded={showTechnical}
                        aria-controls="technical-details"
                        className="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-olive-800/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2 focus-visible:ring-offset-olive-900"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sage-500/20 text-sage-300">
                                <Icon name="calculator" size="lg" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-sage-50">
                                    Fórmulas e Cálculos Detalhados
                                </h3>
                                <p className="text-sm text-olive-300">
                                    {showTechnical ? 'Clique para ocultar' : 'Ver detalhes técnicos'}
                                </p>
                            </div>
                        </div>
                        <div
                            className={`transform transition-transform duration-300 text-sage-300 ${showTechnical ? 'rotate-180' : 'rotate-0'
                                }`}
                        >
                            <Icon name="chevron-down" size="md" />
                        </div>
                    </button>

                    {showTechnical && (
                        <div
                            id="technical-details"
                            className="animate-slide-down-content border-t border-sage-500/20 p-6"
                            role="region"
                            aria-label="Detalhes técnicos"
                        >
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Sistema Price */}
                                <div className="rounded-lg bg-olive-900/40 p-4">
                                    <h4 className="mb-3 font-bold text-sage-200">Sistema Price (Financiamento)</h4>
                                    <div className="mb-3 overflow-x-auto rounded bg-olive-900/60 p-3 font-mono text-xs text-sage-100">
                                        <p>Parcela = P × [i × (1 + i)^n] / [(1 + i)^n - 1]</p>
                                    </div>
                                    <div className="space-y-1 text-xs text-olive-200">
                                        <p>
                                            <span className="font-semibold text-sage-300">P</span> = Principal (valor
                                            financiado)
                                        </p>
                                        <p>
                                            <span className="font-semibold text-sage-300">i</span> = Taxa de juros
                                            mensal
                                        </p>
                                        <p>
                                            <span className="font-semibold text-sage-300">n</span> = Número de parcelas
                                        </p>
                                    </div>
                                </div>

                                {/* Depreciation */}
                                <div className="rounded-lg bg-olive-900/40 p-4">
                                    <h4 className="mb-3 font-bold text-sage-200">Depreciação Exponencial</h4>
                                    <div className="mb-3 overflow-x-auto rounded bg-olive-900/60 p-3 font-mono text-xs text-sage-100">
                                        <p>Valor_Ano_N = Valor_Inicial × (1 - taxa_N)</p>
                                    </div>
                                    <p className="text-xs text-olive-200">
                                        Aplicado sequencialmente para cada ano usando as taxas especificadas (20%,
                                        15%, 15%, 10%, 10%).
                                    </p>
                                </div>

                                {/* Opportunity Cost */}
                                <div className="rounded-lg bg-olive-900/40 p-4">
                                    <h4 className="mb-3 font-bold text-sage-200">Custo de Oportunidade</h4>
                                    <div className="mb-3 overflow-x-auto rounded bg-olive-900/60 p-3 font-mono text-xs text-sage-100">
                                        <p>CO = Principal × [(1 + taxa)^anos - 1]</p>
                                    </div>
                                    <p className="text-xs text-olive-200">
                                        Calculado com juros compostos usando a taxa Selic/CDI (13,75% a.a. padrão).
                                    </p>
                                </div>

                                {/* Break-even */}
                                <div className="rounded-lg bg-olive-900/40 p-4">
                                    <h4 className="mb-3 font-bold text-sage-200">Ponto de Equilíbrio</h4>
                                    <div className="mb-3 overflow-x-auto rounded bg-olive-900/60 p-3 font-mono text-xs text-sage-100">
                                        <p>Custo_Acumulado_Aluguel = Custo_Total_Compra</p>
                                    </div>
                                    <p className="text-xs text-olive-200">
                                        Mês em que o custo acumulado do aluguel iguala o custo total da compra (à
                                        vista ou financiada).
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
