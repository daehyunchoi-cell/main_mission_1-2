import styles from './Loading.module.css';

function Loading({ message = '불러오는 중입니다...' }) {
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true" />
      <p className={styles.message}>{message}</p>
    </div>
  );
}

export default Loading;