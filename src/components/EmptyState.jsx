import { Link } from 'react-router-dom';
import styles from './StateMessage.module.css';

function EmptyState({
  title = '표시할 데이터가 없습니다',
  description = '아직 등록된 항목이 없습니다.',
  actionLabel,
  actionTo,
}) {
  return (
    <div className={styles.wrap}>
      <span className={styles.icon} aria-hidden="true">
        🍽
      </span>
      <p className={styles.title}>{title}</p>
      <p className={styles.description}>{description}</p>

      {actionLabel && actionTo && (
        <div className={styles.action}>
          <Link
            to={actionTo}
            style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 14 }}
          >
            {actionLabel} →
          </Link>
        </div>
      )}
    </div>
  );
}

export default EmptyState;