import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReviews } from '../hooks/useReviews';
import Button from '../components/Button';
import FilterBar from '../components/FilterBar';
import ReviewCard from '../components/ReviewCard';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import styles from './ReviewListPage.module.css';

const RATING_FILTERS = [
  { value: 'all', label: '전체 평점' },
  { value: '5', label: '★5' },
  { value: '4', label: '★4 이상' },
  { value: '3', label: '★3 이상' },
];

function ReviewListPage() {
  const { reviews, status, errorMessage, reload } = useReviews();
  const [region, setRegion] = useState('all');
  const [minRating, setMinRating] = useState('all');

  // 데이터에서 지역 목록을 뽑아 필터 옵션을 만든다.
  const regionFilters = useMemo(() => {
    const unique = [...new Set(reviews.map((review) => review.region))];
    return [
      { value: 'all', label: '전체 지역' },
      ...unique.map((value) => ({ value, label: value })),
    ];
  }, [reviews]);

  // 필터를 적용한 결과.
  const visibleReviews = useMemo(() => {
    return reviews
      .filter((review) => region === 'all' || review.region === region)
      .filter(
        (review) => minRating === 'all' || review.rating >= Number(minRating)
      );
  }, [reviews, region, minRating]);

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>리뷰 목록</h1>
          {status === 'success' && (
            <p className={styles.count}>
              전체 {reviews.length}개 중 {visibleReviews.length}개 표시
            </p>
          )}
        </div>

        <Link to="/reviews/new">
          <Button>리뷰 쓰기</Button>
        </Link>
      </div>

      {status === 'loading' && <Loading message="리뷰를 불러오는 중입니다..." />}

      {status === 'error' && (
        <ErrorState message={errorMessage} onRetry={reload} />
      )}

      {status === 'success' && reviews.length === 0 && (
        <EmptyState
          title="아직 등록된 리뷰가 없습니다"
          description="첫 번째 맛집 리뷰를 남겨 보세요."
          actionLabel="리뷰 작성하기"
          actionTo="/reviews/new"
        />
      )}

      {status === 'success' && reviews.length > 0 && (
        <>
          <div className={styles.filters}>
            <FilterBar
              options={regionFilters}
              value={region}
              onChange={setRegion}
              ariaLabel="지역 필터"
            />
            <FilterBar
              options={RATING_FILTERS}
              value={minRating}
              onChange={setMinRating}
              ariaLabel="평점 필터"
            />
          </div>

          {visibleReviews.length === 0 ? (
            <EmptyState
              title="조건에 맞는 리뷰가 없습니다"
              description="필터를 바꿔서 다시 찾아보세요."
            />
          ) : (
            <div className={styles.list}>
              {visibleReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ReviewListPage;