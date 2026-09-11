import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '64px 0' }}>
      <p style={{ fontSize: 48, fontWeight: 700 }}>404</p>
      <h1 style={{ fontSize: 20, marginBottom: 8 }}>페이지를 찾을 수 없습니다</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
        주소가 잘못되었거나 삭제된 페이지입니다.
      </p>
      <Link to="/" style={{ color: 'var(--accent)', fontWeight: 600 }}>
        홈으로 돌아가기
      </Link>
    </div>
  );
}

export default NotFoundPage;