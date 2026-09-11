import { Link } from 'react-router-dom';
import { useReviews } from '../hooks/useReviews';
import Button from '../components/Button';
import ReviewCard from '../components/ReviewCard';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import styles from './HomePage.module.css';

const PREVIEW_COUNT = 3;

function HomePage() {
  const { reviews, status, errorMessage, reload } = useReviews();
  const recentReviews = reviews.slice(0, PREVIEW_COUNT);

  return (
    <div>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          다녀온 맛집을
          <br />
          <em>기록</em>으로 남기세요
        </h1>
        <p className={styles.subtitle}>
          가게 이름, 지역, 평점과 함께 그날의 후기를 저장합니다.
        </p>
        <div className={styles.cta}>
          <Link to="/reviews/new">
            <Button>리뷰 쓰기</Button>
          </Link>
          <Link to="/reviews">
            <Button variant="secondary">목록 보기</Button>
          </Link>
        </div>
      </section>

      <section>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>최근 리뷰</h2>
          <Link to="/reviews" className={styles.more}>
            전체 보기 →
          </Link>
        </div>

        {status === 'loading' && <Loading />}

        {status === 'error' && (
          <ErrorState message={errorMessage} onRetry={reload} />
        )}

        {status === 'success' && recentReviews.length === 0 && (
          <EmptyState
            title="아직 등록된 리뷰가 없습니다"
            description="첫 번째 맛집 리뷰를 남겨 보세요."
            actionLabel="리뷰 작성하기"
            actionTo="/reviews/new"
          />
        )}

        {status === 'success' && recentReviews.length > 0 && (
          <div className={styles.list}>
            {recentReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;