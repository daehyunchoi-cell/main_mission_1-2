import styles from './StateMessage.module.css';
import Button from './Button';

function ErrorState({
  title = '요청에 실패했습니다',
  message = '잠시 후 다시 시도해 주세요.',
  onRetry,
}) {
  return (
    <div className={`${styles.wrap} ${styles.error}`} role="alert">
      <span className={styles.icon} aria-hidden="true">
        ⚠
      </span>
      <p className={styles.title}>{title}</p>
      <p className={styles.description}>{message}</p>

      {onRetry && (
        <div className={styles.action}>
          <Button variant="secondary" onClick={onRetry}>
            다시 시도
          </Button>
        </div>
      )}
    </div>
  );
}

export default ErrorState;