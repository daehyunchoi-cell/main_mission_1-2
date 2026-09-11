import { Link, useNavigate } from 'react-router-dom';
import ReviewForm from '../components/ReviewForm';
import { createReview } from '../lib/reviews';
import styles from './PageHeader.module.css';

function ReviewNewPage() {
  const navigate = useNavigate();

  async function handleSubmit(payload) {
    const created = await createReview(payload);
    navigate(`/reviews/${created.id}`, { replace: true });
  }

  return (
    <div>
      <div className={styles.head}>
        <Link to="/reviews" className={styles.back}>
          ← 목록으로
        </Link>
        <h1 className={styles.title}>리뷰 쓰기</h1>
        <p className={styles.description}>
          다녀온 가게의 정보와 후기를 남겨 주세요.
        </p>
      </div>

      <ReviewForm
        submitLabel="등록하기"
        onSubmit={handleSubmit}
        onCancel={() => navigate('/reviews')}
      />
    </div>
  );
}

export default ReviewNewPage;