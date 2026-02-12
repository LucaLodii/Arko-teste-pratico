import { Icon } from '../../atoms';

/**
 * Application footer with project info and contact links
 */
export function Footer() {
  return (
    <div className="flex h-full flex-col justify-start md:items-end md:text-right pr-8 md:pr-10">
      <h3 className="mb-4 text-lg font-bold text-olive-900">Contato</h3>
      <div className="flex flex-col gap-3 md:items-end">
        <a
          href="https://www.linkedin.com/in/luca-guimarães-lodi-752981356/"
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
          href="https://github.com/LucaLodii"
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
        <a
          href="mailto:luca.lodi.ll53@gmail.com"
          className="group flex min-h-[48px] items-center gap-3 py-3 text-olive-600 transition-colors hover:text-sage-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2 rounded-lg"
          aria-label="Email"
        >
          <span className="text-sm font-medium">Email</span>
          <span className="rounded-full bg-olive-50 p-2 transition-colors group-hover:bg-sage-100">
            <Icon name="email" size="md" />
          </span>
        </a>
      </div>
    </div>
  );
}

export function Copyright() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-olive-200 pt-8 text-sm text-olive-500 md:flex-row">
      <p>© {currentYear} - Car Calc</p>
    </div>
  );
}
