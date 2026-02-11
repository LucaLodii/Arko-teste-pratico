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
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
              Calculadora de <span className="text-sage-400">Aquisição de Veículo</span>
            </h1>

            <p className="text-lg leading-relaxed text-olive-200">
              Compare os custos reais entre comprar à vista, financiar ou assinar um carro.
              Tome decisões baseadas em dados, não em palpites.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
