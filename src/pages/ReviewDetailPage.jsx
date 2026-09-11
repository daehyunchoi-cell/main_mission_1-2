import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useReviewDetail } from '../hooks/useReviewDetail';
import { deleteReview } from '../lib/reviews';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import styles from './ReviewDetailPage.module.css';

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function ReviewDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { review, status, errorMessage, reload } = useReviewDetail(id);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  async function handleDelete() {
    setDeleting(true);
    setDeleteError('');

    try {
      await deleteReview(id);
      navigate('/reviews', { replace: true });
    } catch (error) {
      setDeleteError(error.message || '삭제에 실패했습니다.');
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  return (
    <div>
      <Link to="/reviews" className={styles.back}>
        ← 목록으로
      </Link>

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
        <>
          <article className={styles.card}>
            <h1 className={styles.title}>{review.name}</h1>

            <div className={styles.meta}>
              <span className={styles.region}>{review.region}</span>
              <span
                className={styles.rating}
                aria-label={`평점 ${review.rating}점`}
              >
                {'★'.repeat(review.rating)}
                <span style={{ color: 'var(--border)' }}>
                  {'★'.repeat(5 - review.rating)}
                </span>
              </span>
              <span className={styles.date}>{formatDate(review.created_at)}</span>
            </div>

            <p className={styles.content}>{review.content}</p>

            {deleteError && (
              <p
                role="alert"
                style={{
                  marginTop: 16,
                  color: 'var(--danger)',
                  fontSize: 14,
                }}
              >
                {deleteError}
              </p>
            )}

            <div className={styles.actions}>
              <Button
                variant="secondary"
                onClick={() => navigate(`/reviews/${review.id}/edit`)}
              >
                수정
              </Button>
              <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                삭제
              </Button>
            </div>
          </article>

          <ConfirmDialog
            open={confirmOpen}
            title="이 리뷰를 삭제할까요?"
            description="삭제한 리뷰는 복구할 수 없습니다."
            confirmLabel="삭제"
            loading={deleting}
            onConfirm={handleDelete}
            onCancel={() => setConfirmOpen(false)}
          />
        </>
      )}
    </div>
  );
}

export default ReviewDetailPage;