import { Icon } from '../../atoms';
import styles from './Footer.module.css';

/**
 * Application footer with project info and contact links
 */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Sobre o Projeto</h3>
          <p className={styles.description}>
            Desenvolvido por <strong>Luca</strong> como parte de um teste prático.
            Este projeto demonstra arquitetura limpa, separação de responsabilidades
            e boas práticas de desenvolvimento full-stack com React, TypeScript e Express.
          </p>
          <p className={styles.tech}>
            <strong>Tecnologias:</strong> React 19, TypeScript, Vite 7, Express 5, Hexagonal Architecture, Atomic Design
          </p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Contato</h3>
          <div className={styles.links}>
            <a
              href="https://www.linkedin.com/in/seu-linkedin"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              aria-label="LinkedIn"
            >
              <Icon name="linkedin" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://github.com/seu-usuario"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              aria-label="GitHub"
            >
              <Icon name="github" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>

      <div className={styles.copyright}>
        <p>© {new Date().getFullYear()} - Calculadora Alugar vs. Comprar Carro</p>
      </div>
    </footer>
  );
}
