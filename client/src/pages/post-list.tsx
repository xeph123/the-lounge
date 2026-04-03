import { useEffect, useState, useRef } from "react"
import { BentoCard } from "@/components/bento-card"
import api from "@/lib/api"
import { LayoutGrid, List, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"

interface Post {
  id: number | string
  title: string
  content: string
  thumbnail?: string
  author?: { name: string }
  createdAt: string
  category?: { name: string, slug: string }
}

export default function PostListPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [isAdmin, setIsAdmin] = useState(false)
  const navigate = useNavigate()

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 12 // 한 페이지에 보여줄 개수

  const observerTarget = useRef<HTMLDivElement>(null)

  const handleViewModeChange = (mode: "grid" | "list") => {
    if (mode === viewMode) return
    setViewMode(mode)
    setCurrentPage(1)
    setPosts([])
  }

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setIsAdmin(user.role === "ADMIN")
      } catch (e) {
        console.error("Failed to parse user", e)
      }
    }
  }, [])

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const response = await api.get(`/posts?page=${currentPage}&limit=${limit}`)
        const responseData = response.data

        // Handle nested data structures correctly based on previous backend findings
        const data = Array.isArray(responseData.data) ? responseData.data : responseData.data?.posts || []
        const totalCount = responseData.meta?.totalCount || responseData.data?.totalCount || responseData.data?.meta?.totalCount || data.length

        setTotalPages(Math.max(1, Math.ceil(totalCount / limit)))

        // Helper function to strip HTML tags
        const stripHtml = (html: string) => {
          const tmp = document.createElement("DIV")
          tmp.innerHTML = html
          return tmp.textContent || tmp.innerText || ""
        }

        // Safely map API data to BentoCard props
        const formattedPosts = data.map((post: Post) => {
          const plainTextDescription = post.content ? stripHtml(post.content) : "No description available."
          return {
            id: post.id,
            title: post.title,
            description: plainTextDescription.length > 100 ? plainTextDescription.substring(0, 100) + "..." : plainTextDescription,
            category: post.category?.name || "UNCATEGORIZED",
            thumbnail: post.thumbnail,
            author: post.author?.name || "Unknown Author",
            date: new Date(post.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }),
            size: "md"
          }
        });

        if (viewMode === 'grid' && currentPage > 1) {
          setPosts(prev => [...prev, ...formattedPosts])
        } else {
          setPosts(formattedPosts)
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error)
      } finally {
        setLoading(false)
        if (viewMode === 'list' || currentPage === 1) {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }
    }

    fetchPosts()
  }, [currentPage, viewMode])

  useEffect(() => {
    if (viewMode !== "grid" || loading) return

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
  }, [viewMode, loading, currentPage, totalPages])

  const handleEdit = (e: React.MouseEvent, id: number | string) => {
    e.preventDefault()
    navigate(`/post/edit/${id}`)
  }

  const handleDelete = async (e: React.MouseEvent, id: number | string) => {
    e.preventDefault()
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      try {
        await api.delete(`/posts/${id}`)
        window.location.reload()
      } catch (error) {
        console.error("Failed to delete post", error)
        alert("게시글 삭제에 실패했습니다.")
      }
    }
  }

  return (
    <div className="space-y-12 pb-24 min-h-screen">
      <section className="flex flex-col gap-6 pt-12 pb-8 mb-0 border-b border-border">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase font-serif italic">
          Archive
        </h1>
        <div className="flex items-end justify-between mt-4">
          <p className="text-sm md:text-base font-sans tracking-[0.3em] uppercase opacity-60 ml-1">
            모든 이야기의 기록
          </p>
          {/* View Toggle */}
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
        </div>
      </section>

      {loading && posts.length === 0 ? (
        <div className="flex justify-center items-center py-32 text-secondary/50 font-sans uppercase tracking-widest text-sm animate-pulse">
          Loading archive...
        </div>
      ) : posts.length > 0 ? (
        <>
          {viewMode === "grid" ? (
            <>
              <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, idx) => (
                  <BentoCard
                    key={`${post.id}-${idx}`}
                    {...post}
                    className="h-[400px] shadow-none hover:shadow-xl hover:-translate-y-1 transition-all duration-500 rounded-none border-border"
                  />
                ))}
              </div>
              <div ref={observerTarget} className="h-10 mt-8">
                {loading && currentPage > 1 && (
                  <div className="flex justify-center text-sm text-secondary">Loading more...</div>
                )}
              </div>
            </>
          ) : (
            /* Magazine Index Style List View */
            <div className="flex flex-col border-t border-border mt-8">
              {posts.map((post) => (
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
                  {isAdmin && (
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

          {/* Minimalist Pagination Controls - Only for List View */}
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
                      className={`w-8 h-8 flex items-center justify-center transition-colors ${currentPage === pageNum
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
          No records found.
        </div>
      )}
    </div>
  )
}
