import styles from './Header.module.css';

/**
 * Application header with title
 */
export function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Calculadora: Alugar ou Comprar Carro</h1>
    </header>
  );
}
