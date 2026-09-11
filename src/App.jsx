import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ReviewListPage from './pages/ReviewListPage';
import ReviewDetailPage from './pages/ReviewDetailPage';
import ReviewNewPage from './pages/ReviewNewPage';
import ReviewEditPage from './pages/ReviewEditPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/reviews" element={<ReviewListPage />} />
          <Route path="/reviews/new" element={<ReviewNewPage />} />
          <Route path="/reviews/:id" element={<ReviewDetailPage />} />
          <Route path="/reviews/:id/edit" element={<ReviewEditPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;