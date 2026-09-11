import { Link } from 'react-router-dom';
import styles from './ReviewCard.module.css';

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function ReviewCard({ review }) {
  const { id, name, region, rating, content, created_at } = review;

  return (
    <Link to={`/reviews/${id}`} className={styles.card}>
      <div className={styles.top}>
        <h3 className={styles.name}>{name}</h3>
        <span className={styles.rating} aria-label={`평점 ${rating}점`}>
          {'★'.repeat(rating)}
          <span style={{ color: 'var(--border)' }}>{'★'.repeat(5 - rating)}</span>
        </span>
      </div>

      <span className={styles.region}>{region}</span>
      <p className={styles.content}>{content}</p>
      <p className={styles.date}>{formatDate(created_at)}</p>
    </Link>
  );
}

export default ReviewCard;