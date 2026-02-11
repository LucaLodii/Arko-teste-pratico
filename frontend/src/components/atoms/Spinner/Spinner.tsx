import styles from './Spinner.module.css';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export function Spinner({ size = 'md' }: SpinnerProps) {
  return (
    <div className={`${styles.spinner} ${styles[`spinner--${size}`]}`}>
      <div className={styles.spinnerCircle} />
    </div>
  );
}
