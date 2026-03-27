import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Layout } from "./components/layout"
import HomePage from "./pages/home"
import LoginPage from "./pages/login"
import SignUpPage from "./pages/signup"
import ForgotPasswordPage from "./pages/forgot-password"
import CategoryPage from "./pages/category"
import PostListPage from "./pages/post-list"
import PostCreatePage from "./pages/post-create"
import PostDetailPage from "./pages/post-detail"
import ProfilePage from "./pages/profile"
import AdminUsersPage from "./pages/admin-users"

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/archive" element={<PostListPage />} />
          <Route path="/post/create" element={<PostCreatePage />} />
          <Route path="/post/edit/:id" element={<PostCreatePage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/user/:id" element={<ProfilePage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
