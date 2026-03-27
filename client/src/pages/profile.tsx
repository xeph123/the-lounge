import { useParams, Link, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { BentoCard } from "@/components/bento-card"
import { 
  Settings, X, Eye, EyeOff, LayoutGrid, List, 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Edit2, Trash2 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface UserProfile {
  id: string
  name: string
  department: string | null
  role: string | null
  bio?: string | null
  posts: any[]
}

export default function ProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // View & Pagination states
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 12
  const observerTarget = useRef<HTMLDivElement>(null)

  // Profile Edit states
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [editDepartment, setEditDepartment] = useState("")
  const [editBio, setEditBio] = useState("")
  const [editPassword, setEditPassword] = useState("")
  const [editPasswordConfirm, setEditPasswordConfirm] = useState("")
  
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loggedInUserStr = localStorage.getItem("user")
  const loggedInUser = loggedInUserStr ? JSON.parse(loggedInUserStr) : null
  const isOwnProfile = loggedInUser?.id === id
  const isAdmin = loggedInUser?.role === "ADMIN"

  const handleViewModeChange = (mode: "grid" | "list") => {
    if (mode === viewMode) return
    setViewMode(mode)
    setCurrentPage(1)
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`/api/users/${id}`)
        const userData = response.data.data

        setUser(userData)
        setEditName(userData.name || "")
        setEditDepartment(userData.department || "")
        setEditBio(userData.bio || "")

        const stripHtml = (html: string) => {
          const tmp = document.createElement("DIV")
          tmp.innerHTML = html
          return tmp.textContent || tmp.innerText || ""
        }

        const formattedPosts = (userData.posts || []).map((post: any) => {
          const plainTextDescription = post.content ? stripHtml(post.content) : "No description available."
          return {
            id: post.id,
            title: post.title,
            description: plainTextDescription.length > 100 ? plainTextDescription.substring(0, 100) + "..." : plainTextDescription,
            category: post.category?.name || "UNCATEGORIZED",
            thumbnail: post.thumbnail,
            author: userData.name || "Unknown Author",
            date: new Date(post.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }),
            size: "md"
          }
        })

        setPosts(formattedPosts)
      } catch (error) {
        console.error(`Failed to fetch user profile for id: ${id}`, error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchUserProfile()
    }
  }, [id])

  // Infinite Scroll Effect for Grid Mode
  useEffect(() => {
    if (viewMode !== "grid" || loading || posts.length === 0) return

    const totalPages = Math.ceil(posts.length / limit)
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && currentPage < totalPages) {
          setCurrentPage(prev => prev + 1)
        }
      },
      { threshold: 1.0 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [viewMode, loading, currentPage, posts.length])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editPassword && editPassword !== editPasswordConfirm) {
      alert("새 비밀번호가 일치하지 않습니다.")
      return
    }

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem("token")
      const payload: any = {
        name: editName,
        department: editDepartment,
        bio: editBio,
      }
      if (editPassword) {
        payload.password = editPassword
      }

      const response = await axios.put(`/api/users/me`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const updatedUser = response.data.data
      setUser((prev) => prev ? { ...prev, name: updatedUser.name, department: updatedUser.department, bio: updatedUser.bio } : null)

      if (loggedInUser) {
        loggedInUser.name = updatedUser.name
        loggedInUser.department = updatedUser.department
        loggedInUser.bio = updatedUser.bio
        localStorage.setItem("user", JSON.stringify(loggedInUser))
      }

      setIsEditing(false)
      setEditPassword("")
      setEditPasswordConfirm("")
      window.location.reload()
    } catch (error) {
      console.error("Failed to update profile", error)
      alert("프로필 업데이트에 실패했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (e: React.MouseEvent, postId: number | string) => {
    e.preventDefault()
    navigate(`/post/edit/${postId}`)
  }

  const handleDelete = async (e: React.MouseEvent, postId: number | string) => {
    e.preventDefault()
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      try {
        const token = localStorage.getItem("token")
        await axios.delete(`/api/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setPosts(prev => prev.filter(p => p.id !== postId))
      } catch (error) {
        console.error("Failed to delete post", error)
        alert("게시글 삭제에 실패했습니다.")
      }
    }
  }

  // Client-side pagination logic
  const totalPages = Math.ceil(posts.length / limit)
  const displayPosts = viewMode === "grid" 
    ? posts.slice(0, currentPage * limit)
    : posts.slice((currentPage - 1) * limit, currentPage * limit)

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32 text-secondary/50 font-sans uppercase tracking-widest text-sm min-h-screen">
        Loading profile...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center py-32 text-secondary/50 font-sans uppercase tracking-widest text-sm min-h-screen">
        사용자를 찾을 수 없습니다.
      </div>
    )
  }

  const deptRole = [user.department, user.role].filter(Boolean).join(" / ")

  return (
    <div className="space-y-12 pb-24 min-h-screen relative">
      <section className="flex flex-col gap-6 pt-12 pb-8 border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter font-serif italic text-primary">
            {user.name}
          </h1>
          <div className="flex items-center gap-4">
            {/* View Toggle Bar */}
            <div className="flex items-center gap-2 border border-border p-1 bg-surface">
              <button 
                onClick={() => handleViewModeChange("grid")}
                className={`p-2 transition-colors ${viewMode === "grid" ? "text-primary bg-background shadow-sm" : "text-secondary/40 hover:text-primary"}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleViewModeChange("list")}
                className={`p-2 transition-colors ${viewMode === "list" ? "text-primary bg-background shadow-sm" : "text-secondary/40 hover:text-primary"}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            {isOwnProfile && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-3 text-secondary/50 hover:text-primary transition-colors hover:bg-secondary/10 hover:rotate-90 duration-500 rounded-none border border-transparent hover:border-primary/20"
                aria-label="Edit Profile"
              >
                <Settings className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {deptRole && (
            <p className="text-sm md:text-base font-sans tracking-[0.3em] uppercase opacity-60 ml-1">
              {deptRole}
            </p>
          )}
          {user.bio && (
            <p className="text-base md:text-lg font-sans ml-1 mt-4 text-primary/80 whitespace-pre-wrap leading-relaxed max-w-3xl">
              {user.bio}
            </p>
          )}
        </div>
      </section>

      {posts.length > 0 ? (
        <>
          {viewMode === "grid" ? (
            <>
              <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                {displayPosts.map((post, idx) => (
                  <BentoCard
                    key={`${post.id}-${idx}`}
                    {...post}
                    className="h-[400px] shadow-none hover:shadow-xl hover:-translate-y-1 transition-all duration-500 rounded-none border-border"
                  />
                ))}
              </div>
              <div ref={observerTarget} className="h-10 mt-8">
                {currentPage < totalPages && (
                   <div className="flex justify-center text-sm text-secondary animate-pulse">Loading more...</div>
                )}
              </div>
            </>
          ) : (
            /* Magazine Index Style List View */
            <div className="flex flex-col border-t border-border mt-8">
              {displayPosts.map((post) => (
                <Link key={post.id} to={`/post/${post.id}`} className="group relative flex flex-col md:flex-row md:items-start gap-6 md:gap-12 py-10 border-b border-border/50 hover:border-primary transition-colors">
                  <div className="w-32 flex-shrink-0 flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">{post.category}</span>
                    <span className="text-xs font-sans text-secondary/60">{post.date}</span>
                  </div>
                  <div className="flex-1 max-w-3xl pr-12">
                    <h3 className="font-serif text-3xl md:text-4xl font-bold mb-4 transition-all duration-300 text-foreground group-hover:text-primary leading-tight">{post.title}</h3>
                    <p className="text-base font-sans text-secondary/80 leading-relaxed line-clamp-2">{post.description}</p>
                    <span className="inline-block mt-6 text-[10px] font-bold uppercase tracking-widest text-secondary/40">by {post.author}</span>
                  </div>
                  {post.thumbnail && (
                    <div className="w-full md:w-56 h-40 md:h-40 aspect-video flex-shrink-0 overflow-hidden bg-surface mt-6 md:mt-0 border border-border">
                      <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                    </div>
                  )}
                  {(isOwnProfile || isAdmin) && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 md:top-10 md:translate-y-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-2 md:mr-0">
                      <button 
                        onClick={(e) => handleEdit(e, post.id)}
                        className="p-2 bg-surface border border-border text-primary hover:bg-primary hover:text-white rounded-none shadow-sm transition-all"
                        title="Edit Post"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(e, post.id)}
                        className="p-2 bg-surface border border-border text-destructive hover:bg-red-600 hover:text-white rounded-none shadow-sm transition-all"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Grouped Pagination Controls - Only for List View */}
          {viewMode === "list" && totalPages > 1 && (
            <div className="flex items-center justify-between pt-16 mt-16 border-t border-border">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="font-serif italic font-bold tracking-widest uppercase rounded-none hover:bg-transparent hover:text-primary disabled:opacity-20 px-0"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="font-serif italic font-bold tracking-widest uppercase rounded-none hover:bg-transparent hover:text-primary disabled:opacity-20 px-0 ml-2"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Prev
                </Button>
              </div>
              
              <div className="flex items-center gap-2 font-sans text-sm font-bold text-secondary">
                {Array.from({ length: 5 }).map((_, idx) => {
                  const startPage = Math.floor((currentPage - 1) / 5) * 5 + 1
                  const pageNum = startPage + idx
                  
                  if (pageNum > totalPages) return null
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 flex items-center justify-center transition-colors ${
                        currentPage === pageNum 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:text-primary hover:bg-surface"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="font-serif italic font-bold tracking-widest uppercase rounded-none hover:bg-transparent hover:text-primary disabled:opacity-20 px-0 mr-2"
                >
                  Next <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="font-serif italic font-bold tracking-widest uppercase rounded-none hover:bg-transparent hover:text-primary disabled:opacity-20 px-0"
                >
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex justify-center items-center py-32 text-secondary/50 font-sans uppercase tracking-widest text-sm">
          이 사용자는 아직 작성된 이야기가 없습니다.
        </div>
      )}

      {/* Edit Profile Overlay */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white border border-border w-full max-w-2xl p-12 md:p-16 relative transform translate-x-4 -translate-y-2 shadow-2xl my-8">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-6 right-6 p-2 text-secondary hover:text-primary hover:rotate-90 transition-all duration-300"
            >
              <X className="w-8 h-8" strokeWidth={1} />
            </button>
            <div className="mb-12">
              <h2 className="font-serif text-4xl md:text-5xl italic font-black uppercase tracking-tighter text-primary">
                프로필 수정
              </h2>
              <p className="font-sans text-xs tracking-[0.2em] uppercase text-secondary/60 mt-4">
                나만의 아이덴티티를 설정하세요.
              </p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-10">
              <div className="space-y-4">
                <label className="font-sans text-xs font-bold tracking-[0.1em] text-primary block">
                  이름
                </label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="rounded-none border-0 border-b border-border focus-visible:ring-0 focus-visible:border-primary px-0 py-6 text-xl bg-transparent transition-colors duration-300"
                  placeholder="이름을 입력하세요"
                  required
                />
              </div>
              <div className="space-y-4">
                <label className="font-sans text-xs font-bold tracking-[0.1em] text-primary block">
                  소속 부서
                </label>
                <Input
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  className="rounded-none border-0 border-b border-border focus-visible:ring-0 focus-visible:border-primary px-0 py-6 text-xl bg-transparent transition-colors duration-300"
                  placeholder="소속 부서를 입력하세요"
                />
              </div>
              <div className="space-y-4">
                <label className="font-sans text-xs font-bold tracking-[0.1em] text-primary block">
                  자기소개
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full font-sans rounded-none border-0 border-b border-border focus-visible:ring-0 focus-visible:border-primary focus-visible:outline-none px-0 py-2 text-xl bg-transparent transition-colors duration-300 resize-none min-h-[100px]"
                  placeholder="자신을 자유롭게 소개해주세요"
                />
              </div>
              <div className="space-y-4">
                <label className="font-sans text-xs font-bold tracking-[0.1em] text-primary block">
                  새 비밀번호 <span className="text-secondary/50 font-normal tracking-normal">(변경하지 않으려면 비워두세요)</span>
                </label>
                <div className="relative flex items-center">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full rounded-none border-0 border-b border-border focus-visible:ring-0 focus-visible:border-primary px-0 py-6 text-xl bg-transparent transition-colors duration-300 pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 text-secondary hover:text-primary transition-colors p-2"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="font-sans text-xs font-bold tracking-[0.1em] text-primary block">
                  새 비밀번호 확인
                </label>
                <div className="relative flex items-center">
                  <Input
                    type={showPasswordConfirm ? "text" : "password"}
                    value={editPasswordConfirm}
                    onChange={(e) => setEditPasswordConfirm(e.target.value)}
                    className="w-full rounded-none border-0 border-b border-border focus-visible:ring-0 focus-visible:border-primary px-0 py-6 text-xl bg-transparent transition-colors duration-300 pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-0 text-secondary hover:text-primary transition-colors p-2"
                  >
                    {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="pt-8 flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-none font-serif italic text-xl uppercase tracking-widest px-12 py-8 bg-primary text-white hover:bg-primary/90 hover:tracking-[0.2em] transition-all duration-500 transform translate-x-2 -translate-y-2"
                >
                  {isSubmitting ? "저장 중..." : "변경사항 저장"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
