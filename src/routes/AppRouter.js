import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AppLayout from '../Layout/AppLayout';
import HomePage from '../pages/HomePage';
import NewsPage from '../pages/NewsPage';
import DisasterPage from '../pages/DisasterPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRouter = () => {
  return (
    <Routes>
      {/* 모든 페이지를 AppLayout으로 감싸기 */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/disaster" element={<DisasterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
