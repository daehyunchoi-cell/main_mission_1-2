import styles from './Button.module.css';

function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  loading = false,
  disabled = false,
  ...rest
}) {
  const className = `${styles.base} ${styles[size]} ${styles[variant]}`;

  return (
    <button
      type={type}
      className={className}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {children}
    </button>
  );
}

export default Button;