import { Icon } from '../../atoms';

/**
 * Application header with title
 */
export function Header() {
  return (
    <header className="relative overflow-hidden bg-olive-900 text-white shadow-soft">
      <div className="pointer-events-none absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-sage-500 opacity-10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 py-10 md:px-8 md:py-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-olive-700 bg-olive-800/50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-sage-300">
              <Icon name="calculator" size="sm" />
              <span>Planejamento Financeiro</span>
            </div>

            <h1 className="text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
              Calculadora de <span className="text-sage-400">Aquisição de Veículo</span>
            </h1>

            <p className="text-lg leading-relaxed text-olive-200">
              Compare os custos reais entre comprar à vista, financiar ou assinar um carro.
              Tome decisões baseadas em dados, não em palpites.
            </p>
          </div>

          <div className="hidden max-w-xs rounded-xl border border-olive-700/50 bg-olive-800/30 p-4 backdrop-blur-sm md:block">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-sage-500/20 p-2 text-sage-300">
                <Icon name="info" size="md" />
              </div>
              <div>
                <p className="text-sm font-medium text-sage-200">Como funciona?</p>
                <p className="mt-1 text-xs text-olive-300">
                  Consideramos depreciação, custo de oportunidade (CDI), seguro, IPVA e manutenções para calcular o Custo Efetivo Total.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
