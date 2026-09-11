import { NavLink, Outlet } from 'react-router-dom';
import styles from './Layout.module.css';

const NAV_ITEMS = [
  { to: '/', label: '홈', end: true },
  { to: '/reviews', label: '리뷰 목록' },
  { to: '/reviews/new', label: '리뷰 쓰기' },
];

function Layout() {
  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <NavLink to="/" className={styles.logo}>
            맛집<span>기록</span>
          </NavLink>

          <nav className={styles.nav} aria-label="주요 메뉴">
            {NAV_ITEMS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.navLinkActive}`
                    : styles.navLink
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer className={styles.footer}>
        <div className="container">© 2026 맛집기록 · React 학습 프로젝트</div>
      </footer>
    </>
  );
}

export default Layout;