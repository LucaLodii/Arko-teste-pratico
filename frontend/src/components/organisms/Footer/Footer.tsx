import { Icon } from '../../atoms';

/**
 * Application footer with project info and contact links
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-olive-100 bg-white pb-8 pt-12 md:pt-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-bold text-olive-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sage-100 text-sage-700">
                <Icon name="calculator" size="sm" />
              </span>
              Sobre o Projeto
            </h3>
            <p className="max-w-md leading-relaxed text-olive-600">
              Desenvolvido por <strong>Luca</strong> como parte de um teste prático.
              Este projeto demonstra arquitetura limpa, separação de responsabilidades
              e boas práticas de desenvolvimento full-stack com React, TypeScript e Express.
            </p>
            <div className="pt-2">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-olive-400">
                Tecnologias
              </p>
              <div className="flex flex-wrap gap-2">
                {['React 19', 'TypeScript', 'Vite 7', 'Express 5', 'Hexagonal Architecture', 'Atomic Design'].map((tech) => (
                  <span key={tech} className="rounded border border-olive-100 bg-olive-50 px-2 py-1 text-xs text-olive-600">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="md:flex md:flex-col md:items-end md:text-right">
            <h3 className="mb-4 text-lg font-bold text-olive-900">Contato</h3>
            <div className="flex flex-col gap-3 md:items-end">
              <a
                href="https://www.linkedin.com/in/seu-linkedin"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[48px] items-center gap-3 py-3 text-olive-600 transition-colors hover:text-sage-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2 rounded-lg"
                aria-label="LinkedIn"
              >
                <span className="text-sm font-medium">LinkedIn</span>
                <span className="rounded-full bg-olive-50 p-2 transition-colors group-hover:bg-sage-100">
                  <Icon name="linkedin" size="md" />
                </span>
              </a>
              <a
                href="https://github.com/seu-usuario"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[48px] items-center gap-3 py-3 text-olive-600 transition-colors hover:text-sage-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2 rounded-lg"
                aria-label="GitHub"
              >
                <span className="text-sm font-medium">GitHub</span>
                <span className="rounded-full bg-olive-50 p-2 transition-colors group-hover:bg-sage-100">
                  <Icon name="github" size="md" />
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-olive-100 pt-8 text-sm text-olive-400 md:flex-row">
          <p>© {currentYear} - Calculadora Alugar vs. Comprar Carro</p>
        </div>
      </div>
    </footer>
  );
}
