import styles from './Icon.module.css';

export interface IconProps {
  name: 'error' | 'info' | 'warning';
}

export function Icon({ name }: IconProps) {
  const icons = {
    error: '⚠',
    info: 'ℹ',
    warning: '⚠',
  };
  return <span className={styles.icon} aria-hidden>{icons[name]}</span>;
}
