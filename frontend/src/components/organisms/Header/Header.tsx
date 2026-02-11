import { Icon } from '../../atoms';

/**
 * Application header with title - Premium redesign with enhanced visuals
 */
export function Header() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-olive-900 via-olive-900 to-olive-800 text-white shadow-soft">
      {/* Decorative orbs - multiple layers for depth */}
      <div className="pointer-events-none absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-sage-500 opacity-10 blur-3xl animate-pulse-slow" />
      <div className="pointer-events-none absolute left-0 bottom-0 -ml-32 -mb-32 h-80 w-80 rounded-full bg-sage-400 opacity-5 blur-3xl" />
      <div className="pointer-events-none absolute right-1/3 top-1/2 h-48 w-48 rounded-full bg-olive-600 opacity-8 blur-2xl" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 py-10 md:px-8 md:py-14">
        <div className="max-w-3xl space-y-4">
          {/* Title with gradient - no icon */}
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
            Calculadora de{' '}
            <span className="bg-gradient-to-r from-sage-400 to-sage-300 bg-clip-text text-transparent">
              Aquisição de Veículo
            </span>
          </h1>

          {/* Subtitle with highlighted keywords */}
          <p className="text-lg leading-relaxed text-sage-200">
            Compare os custos reais entre{' '}
            <strong className="font-semibold text-white">
              comprar à vista, financiar ou assinar
            </strong>{' '}
            um carro. Tome decisões baseadas em{' '}
            <strong className="font-semibold text-sage-300">dados</strong>, não em palpites.
          </p>

          {/* Stats badges */}
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex items-center gap-2 rounded-lg border border-sage-500/20 bg-olive-800/40 px-3 py-2 backdrop-blur-sm">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-sage-500/20">
                <Icon name="check" size="sm" className="text-sage-400" />
              </div>
              <span className="text-sm font-medium text-sage-200">3 Opções de Aquisição</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-sage-500/20 bg-olive-800/40 px-3 py-2 backdrop-blur-sm">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-sage-500/20">
                <Icon name="chart-bar" size="sm" className="text-sage-400" />
              </div>
              <span className="text-sm font-medium text-sage-200">Análise Completa</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
