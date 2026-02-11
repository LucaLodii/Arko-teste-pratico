import { useState, useEffect } from 'react';
import { Icon } from '../../atoms';

export interface HowToUseCardProps {
    /** Whether the card should start open (default: true for first visit) */
    defaultOpen?: boolean;
    /** Storage key for remembering user preference (default: 'howToUseCardOpen') */
    storageKey?: string;
}

/**
 * Expandable card that guides users through the calculator steps
 */
export function HowToUseCard({
    defaultOpen = true,
    storageKey = 'howToUseCardOpen',
}: HowToUseCardProps) {
    const [isOpen, setIsOpen] = useState(() => {
        // Try to load from localStorage
        const stored = localStorage.getItem(storageKey);
        if (stored !== null) {
            return stored === 'true';
        }
        return defaultOpen;
    });

    // Save preference to localStorage
    useEffect(() => {
        localStorage.setItem(storageKey, String(isOpen));
    }, [isOpen, storageKey]);

    const toggleOpen = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div className="rounded-2xl border-l-4 border-sage-400 bg-gradient-to-r from-sage-50/80 to-white/80 shadow-sm backdrop-blur-sm overflow-hidden">
            <button
                type="button"
                onClick={toggleOpen}
                aria-expanded={isOpen}
                aria-controls="how-to-use-content"
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-sage-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2"
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-400/20 text-sage-600">
                        <Icon name="lightbulb" size="md" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-olive-900">
                            Como usar esta calculadora
                        </h3>
                        <p className="text-sm text-olive-500">
                            {isOpen ? 'Clique para ocultar' : 'Siga 3 passos simples'}
                        </p>
                    </div>
                </div>
                <div
                    className={`transform transition-transform duration-300 text-sage-600 ${isOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                >
                    <Icon name="chevron-down" size="md" />
                </div>
            </button>

            {isOpen && (
                <div
                    id="how-to-use-content"
                    className="animate-slide-down-content border-t border-sage-100 px-6 pb-6 pt-5"
                    role="region"
                    aria-label="Instruções de uso"
                >
                    <div className="space-y-5">
                        {/* Step 1 */}
                        <div className="flex items-start gap-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage-400 text-sm font-bold text-white shadow-sm">
                                1
                            </div>
                            <div className="pt-0.5">
                                <div className="mb-1 flex items-center gap-2">
                                    <Icon name="clipboard-list" size="sm" className="text-sage-600" />
                                    <h4 className="font-semibold text-olive-900">
                                        Preencha os dados básicos
                                    </h4>
                                </div>
                                <p className="text-sm leading-relaxed text-olive-600">
                                    Informe o valor do carro, aluguel mensal, taxa de juros e prazos de
                                    financiamento e análise.
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-start gap-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage-400 text-sm font-bold text-white shadow-sm">
                                2
                            </div>
                            <div className="pt-0.5">
                                <div className="mb-1 flex items-center gap-2">
                                    <Icon name="adjustments" size="sm" className="text-sage-600" />
                                    <h4 className="font-semibold text-olive-900">
                                        Ajuste opções avançadas{' '}
                                        <span className="text-xs font-normal text-olive-400">(opcional)</span>
                                    </h4>
                                </div>
                                <p className="text-sm leading-relaxed text-olive-600">
                                    Personalize entrada, taxa de IPVA, seguro anual e custos de manutenção
                                    para uma análise mais precisa.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex items-start gap-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage-400 text-sm font-bold text-white shadow-sm">
                                3
                            </div>
                            <div className="pt-0.5">
                                <div className="mb-1 flex items-center gap-2">
                                    <Icon name="chart-bar" size="sm" className="text-sage-600" />
                                    <h4 className="font-semibold text-olive-900">
                                        Visualize a comparação
                                    </h4>
                                </div>
                                <p className="text-sm leading-relaxed text-olive-600">
                                    Analise gráficos detalhados comparando aluguel, compra à vista e
                                    financiamento ao longo do tempo.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
