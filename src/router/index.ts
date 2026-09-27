import { createRouter, createWebHistory } from 'vue-router';

const HomeView = () => import('@/views/HomeView.vue');
const FeedView = () => import('@/views/FeedView.vue');
const NewsDetailView = () => import('@/views/NewsDetailView.vue');
const TrendingView = () => import('@/views/TrendingView.vue');
const LegalView = () => import('@/views/LegalView.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/feed', name: 'feed', component: FeedView },
    { path: '/trending', name: 'trending', component: TrendingView },
    { path: '/news/:id', name: 'news-detail', component: NewsDetailView, props: true },
    { path: '/legal', name: 'legal', component: LegalView },
  ],
});

export default router;
