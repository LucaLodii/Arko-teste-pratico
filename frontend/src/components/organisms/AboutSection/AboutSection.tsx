import { Icon } from '../../atoms';

/**
 * About section with project info and technologies used
 */
export function AboutSection() {
    return (
        <div className="flex h-full w-full flex-col justify-between items-start text-left pl-8 md:pl-10">
            <div>
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-sage-100 text-sage-600">
                    <Icon name="calculator" size="xl" />
                </div>

                <h2 className="mb-6 text-3xl font-bold text-olive-900 md:text-4xl">
                    Sobre o Projeto
                </h2>

                <div className="max-w-xl space-y-4 text-lg text-olive-600 mb-8">
                    <p className="leading-relaxed">
                        Desenvolvido por <strong>Luca</strong> como parte de um teste prático.
                    </p>
                    <p className="leading-relaxed">
                        Esta calculadora compara a viabilidade financeira entre alugar, comprar à vista ou financiar um carro, com análise de depreciação, custo de oportunidade e ponto de equilíbrio.
                    </p>
                </div>
            </div>

            <div className="mt-auto w-full max-w-xl pt-8 border-t border-olive-200">
                <p className="mb-4 text-sm font-bold uppercase tracking-wider text-olive-400">
                    Tecnologias Utilizadas
                </p>
                <div className="flex flex-wrap gap-3">
                    {['React 19', 'TypeScript', 'Vite 7', 'Express 5', 'Hexagonal Architecture', 'Atomic Design'].map((tech) => (
                        <span key={tech} className="rounded-full border border-olive-100 bg-white px-4 py-2 text-sm font-medium text-olive-700 transition-colors hover:border-sage-200 hover:bg-sage-50">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
