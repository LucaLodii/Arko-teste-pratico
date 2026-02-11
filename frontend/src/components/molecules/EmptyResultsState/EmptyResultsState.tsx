import { Icon } from '../../atoms';

export interface EmptyResultsStateProps {
    /** Optional custom message to display */
    message?: string;
}

/**
 * Empty state component shown when no calculation results are available yet
 */
export function EmptyResultsState({ message }: EmptyResultsStateProps) {
    const defaultMessage =
        'Preencha o formulário acima e clique em "Calcular Comparação" para visualizar a análise completa';

    return (
        <div
            className="animate-fade-in rounded-2xl border border-dashed border-olive-200 bg-white/60 p-12 text-center backdrop-blur-sm"
            role="status"
            aria-live="polite"
        >
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-sage-50 to-sage-100 text-sage-400">
                <Icon name="chart-pie-empty" size="xl" className="h-12 w-12" />
            </div>
            <h3 className="text-h3 mb-3 text-olive-600">Seus resultados aparecerão aqui</h3>
            <p className="mx-auto max-w-md text-olive-400 leading-relaxed">
                {message || defaultMessage}
            </p>
        </div>
    );
}
