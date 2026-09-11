import { Link, useNavigate, useParams } from 'react-router-dom';
import ReviewForm from '../components/ReviewForm';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { useReviewDetail } from '../hooks/useReviewDetail';
import { updateReview } from '../lib/reviews';
import styles from './PageHeader.module.css';

function ReviewEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { review, status, errorMessage, reload } = useReviewDetail(id);

  async function handleSubmit(payload) {
    await updateReview(id, payload);
    navigate(`/reviews/${id}`, { replace: true });
  }

  return (
    <div>
      <div className={styles.head}>
        <Link to={`/reviews/${id}`} className={styles.back}>
          ← 상세로
        </Link>
        <h1 className={styles.title}>리뷰 수정</h1>
      </div>

      {status === 'loading' && <Loading message="리뷰를 불러오는 중입니다..." />}

      {status === 'error' && (
        <ErrorState message={errorMessage} onRetry={reload} />
      )}

      {status === 'notfound' && (
        <EmptyState
          title="리뷰를 찾을 수 없습니다"
          description="삭제되었거나 존재하지 않는 리뷰입니다."
          actionLabel="목록으로 돌아가기"
          actionTo="/reviews"
        />
      )}

      {status === 'success' && review && (
        <ReviewForm
          initialValues={{
            name: review.name,
            region: review.region,
            rating: review.rating,
            content: review.content,
          }}
          submitLabel="수정 완료"
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/reviews/${id}`)}
        />
      )}
    </div>
  );
}

export default ReviewEditPage;