import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import { AdminLayout } from './layouts/AdminLayout.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { BlogListPage } from './pages/BlogListPage.jsx'
import { BlogFormPage } from './pages/BlogFormPage.jsx'
import { HelpPage } from './pages/HelpPage.jsx'
import { MediaPage } from './pages/MediaPage.jsx'
import { AnalyticsPage } from './pages/AnalyticsPage.jsx'
import { AdminUsersPage } from './pages/AdminUsersPage.jsx'
import { RolesPage } from './pages/RolesPage.jsx'
import { ProfilePage } from './pages/ProfilePage.jsx'
import { EmailSettingsPage } from './pages/EmailSettingsPage.jsx'
import { HeroSettingsPage } from './pages/HeroSettingsPage.jsx'
import { ContactMessagesPage } from './pages/ContactMessagesPage.jsx'
import {
  FaqsPage, BlogCategoriesPage, BlogTagsPage, SuccessStoriesPage, AppReleasesPage,
  WebsiteContentPage, NavigationPage, FooterPage, LocalesPage,
  SubscribersPage, FeedbackPage, AuditLogPage,
} from './pages/resources.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="blogs" element={<BlogListPage />} />
        <Route path="blogs/:id" element={<BlogFormPage />} />
        <Route path="blog-categories" element={<BlogCategoriesPage />} />
        <Route path="blog-tags" element={<BlogTagsPage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="help/blogs/:id" element={<BlogFormPage basePath="/help/blogs" returnTo="/help?tab=blogs" />} />
        <Route path="faqs" element={<FaqsPage />} />
        <Route path="success-stories" element={<SuccessStoriesPage />} />
        <Route path="app-releases" element={<AppReleasesPage />} />
        <Route path="homepage-hero" element={<HeroSettingsPage />} />
        <Route path="website-content" element={<WebsiteContentPage />} />
        <Route path="navigation" element={<NavigationPage />} />
        <Route path="footer" element={<FooterPage />} />
        <Route path="locales" element={<LocalesPage />} />
        <Route path="media" element={<MediaPage />} />
        <Route path="subscribers" element={<SubscribersPage />} />
        <Route path="contact" element={<ContactMessagesPage />} />
        <Route path="feedback" element={<FeedbackPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="admins" element={<AdminUsersPage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="audit" element={<AuditLogPage />} />
        <Route path="email-settings" element={<EmailSettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
