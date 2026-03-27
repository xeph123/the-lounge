import { useParams, Link } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { BentoCard } from "@/components/bento-card"
import { LayoutGrid, List, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Post {
  id: number | string
  title: string
  content: string
  thumbnail?: string
  author?: { name: string }
  createdAt: string
  category?: { name: string, slug: string }
}

export default function CategoryPage() {
  const { slug } = useParams()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 12
  
  const observerTarget = useRef<HTMLDivElement>(null)

  const handleViewModeChange = (mode: "grid" | "list") => {
    if (mode === viewMode) return
    setViewMode(mode)
    setCurrentPage(1)
    setPosts([])
  }

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`/api/posts?category=${slug}&page=${currentPage}&limit=${limit}`)
        const responseData = response.data
        
        const data = Array.isArray(responseData.data) ? responseData.data : responseData.data?.posts || []
        const totalCount = responseData.meta?.totalCount || responseData.data?.totalCount || responseData.data?.meta?.totalCount || data.length
        
        setTotalPages(Math.max(1, Math.ceil(totalCount / limit)))

        const stripHtml = (html: string) => {
          const tmp = document.createElement("DIV")
          tmp.innerHTML = html
          return tmp.textContent || tmp.innerText || ""
        }
        
        const formattedPosts = data.map((post: Post) => {
          const plainTextDescription = post.content ? stripHtml(post.content) : "No description available."
          return {
            id: post.id,
            title: post.title,
            description: plainTextDescription.length > 100 ? plainTextDescription.substring(0, 100) + "..." : plainTextDescription,
            category: post.category?.name || String(slug).toUpperCase(),
            thumbnail: post.thumbnail,
            author: post.author?.name || "Unknown Author",
            date: new Date(post.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }),
            size: "md"
          }
        })

        if (viewMode === 'grid' && currentPage > 1) {
          setPosts(prev => [...prev, ...formattedPosts])
        } else {
          setPosts(formattedPosts)
        }
      } catch (error) {
        console.error(`Failed to fetch posts for category: ${slug}`, error)
      } finally {
        setLoading(false)
        if (viewMode === 'list' || currentPage === 1) {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }
    }

    if (slug) {
      fetchCategoryPosts()
    }
  }, [slug, currentPage, viewMode])

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

  // 카테고리가 변경되면 페이지를 1로 리셋
  useEffect(() => {
    setCurrentPage(1)
    setPosts([])
  }, [slug])

  return (
    <div className="space-y-12 pb-24 min-h-screen">
      <section className="flex flex-col gap-6 pt-12 pb-8 border-b border-border">
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter font-serif italic">
          {slug}
        </h1>
        <div className="flex items-end justify-between mt-4">
          <p className="text-sm md:text-base font-sans tracking-[0.3em] uppercase opacity-60 ml-1">
            THE LOUNGE : {slug} STORIES
          </p>
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
          Loading {slug} stories...
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
            <div className="flex flex-col border-t border-border mt-8">
              {posts.map((post) => (
                <Link key={post.id} to={`/post/${post.id}`} className="group flex flex-col md:flex-row md:items-start gap-6 md:gap-12 py-10 border-b border-border/50 hover:border-primary transition-colors">
                  <div className="w-32 flex-shrink-0 flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">{post.category}</span>
                    <span className="text-xs font-sans text-secondary/60">{post.date}</span>
                  </div>
                  <div className="flex-1 max-w-3xl">
                    <h3 className="font-serif text-3xl md:text-4xl font-bold mb-4 transition-all duration-300 text-foreground group-hover:text-primary leading-tight">{post.title}</h3>
                    <p className="text-base font-sans text-secondary/80 leading-relaxed line-clamp-2">{post.description}</p>
                    <span className="inline-block mt-6 text-[10px] font-bold uppercase tracking-widest text-secondary/40">by {post.author}</span>
                  </div>
                  {post.thumbnail && (
                    <div className="w-full md:w-56 h-40 md:h-40 aspect-video flex-shrink-0 overflow-hidden bg-surface mt-6 md:mt-0 border border-border">
                      <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
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
          이 카테고리에는 아직 작성된 이야기가 없습니다.
        </div>
      )}
    </div>
  )
}
