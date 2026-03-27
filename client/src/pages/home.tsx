import { useEffect, useState } from "react"
import { BentoCard } from "@/components/bento-card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Edit2, Trash2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

// Define a type for the post data we expect from the API
interface Post {
  id: number | string
  title: string
  content: string // We might use this for description if description doesn't exist
  thumbnailUrl?: string
  authorId?: number | string
  author?: { name: string }
  createdAt: string
  category?: string
  // Add any specific size property if it comes from the API, otherwise we'll assign it
  size?: 'sm' | 'md' | 'lg'
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const navigate = useNavigate()

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
    
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/posts?sort=popular")
        // Assuming response.data is an array of posts or { data: [...] }
        const data = Array.isArray(response.data) ? response.data : response.data.data || []

        // Helper function to strip HTML tags and get plain text for description
        const stripHtml = (html: string) => {
          const tmp = document.createElement("DIV")
          tmp.innerHTML = html
          return tmp.textContent || tmp.innerText || ""
        }

        // Asymmetric Masonry Layout Mapping
        const formattedPosts = data.slice(0, 6).map((post: any, index: number) => {
          const plainTextDescription = post.content ? stripHtml(post.content) : "No description available."
          
          // Art Gallery Asymmetric Sizing (6 pieces for optimal balance)
          // 0: Huge Portrait (Left)
          // 1: Wide Landscape (Right Top)
          // 2: Small Square (Right Middle)
          // 3: Small Square (Right Bottom)
          // 4: Medium Portrait (Bottom Left Offset)
          // 5: Typographic Only (Bottom Right)
          
          let masonryClass = ""
          let imgAspect = ""
          
          switch(index) {
            case 0: 
              masonryClass = "md:col-span-6 md:row-span-3"
              imgAspect = "aspect-[3/4]"
              break
            case 1:
              masonryClass = "md:col-span-6 md:row-span-1 mt-12 md:mt-0"
              imgAspect = "aspect-[21/9]"
              break
            case 2:
              masonryClass = "md:col-span-3 md:row-span-1 mt-12 md:mt-0"
              imgAspect = "aspect-square"
              break
            case 3:
              masonryClass = "md:col-span-3 md:row-span-1 mt-12 md:mt-0 md:mt-24" // Staggered down
              imgAspect = "aspect-square"
              break
            case 4:
              masonryClass = "md:col-span-5 md:col-start-2 md:row-span-2 mt-24 md:mt-32" // Offset left
              imgAspect = "aspect-[4/5]"
              break
            case 5:
              masonryClass = "md:col-span-5 md:col-start-8 md:row-span-2 mt-24 md:mt-12 flex flex-col justify-center relative" // Typographic focus
              imgAspect = "hidden" // Force no image for typographic layout
              break
            default:
              masonryClass = "col-span-12"
              imgAspect = "aspect-video"
          }

          return {
            id: post.id,
            title: post.title,
            description: plainTextDescription,
            category: post.category?.name || "TECH",
            thumbnail: imgAspect === "hidden" ? undefined : post.thumbnail,
            author: post.author?.name || "Unknown Author",
            date: new Date(post.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }),
            masonryClass,
            imgAspect,
            isTypographic: imgAspect === "hidden"
          }
        })

        setPosts(formattedPosts)
      } catch (error) {
        console.error("Failed to fetch posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleEdit = (e: React.MouseEvent, id: number | string) => {
    e.preventDefault()
    navigate(`/post/edit/${id}`)
  }

  const handleDelete = async (e: React.MouseEvent, id: number | string) => {
    e.preventDefault()
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      try {
        const token = localStorage.getItem("token")
        await axios.delete(`/api/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        window.location.reload()
      } catch (error) {
        console.error("Failed to delete post", error)
        alert("게시글 삭제에 실패했습니다.")
      }
    }
  }

  return (
    <div className="space-y-16 pb-24">
      <section className="flex flex-col gap-6 pt-12">
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase font-serif">
          THE <br /> LOUNGE
        </h1>
        {/* Minimalist Border Only - Removed Masthead Text for Extreme Emptiness */}
        <div className="border-b border-border mt-12 mb-8"></div>
      </section>

      <div className="flex justify-end pt-8 pb-16">
        <Link to="/post/create" className="group relative flex items-center gap-6 pb-2 border-b-2 border-transparent hover:border-primary transition-all duration-500">
          <span className="font-serif text-xl md:text-2xl font-bold italic uppercase tracking-[0.2em] group-hover:tracking-[0.3em] transition-all duration-500 ease-in-out text-primary">
            <span className="text-3xl md:text-4xl">I</span>nscribe the Silence
          </span>
          <ArrowRight className="w-6 h-6 text-primary transform group-hover:translate-x-2 transition-transform duration-500" />
        </Link>
      </div>

      <section className="flex flex-col gap-8 pt-8 pb-8">
        <div className="flex items-end justify-between border-b border-border pb-8">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase font-serif">
            Top <br /> Stories
          </h2>
          <Link to="/archive" className="group flex items-center gap-4 pb-2 border-b-2 border-transparent hover:border-primary transition-all duration-500">
            <span className="text-xl md:text-2xl font-serif italic font-bold tracking-[0.2em] group-hover:tracking-[0.3em] uppercase transition-all duration-500 text-foreground group-hover:text-primary">
              View All
            </span>
            <ArrowRight className="w-6 h-6 text-foreground group-hover:text-primary transform group-hover:translate-x-2 transition-transform duration-500" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-0 border-t border-border pt-16">
          {loading ? (
            <div className="col-span-full flex items-center justify-center p-24 text-secondary/50 font-sans uppercase tracking-widest text-sm">
              Curating stories...
            </div>
          ) : posts.length > 0 ? (
            posts.map((post: any, index: number) => (
              <Link 
                key={post.id} 
                to={`/post/${post.id}`} 
                className={`group flex flex-col relative ${post.masonryClass}`}
              >
                {isAdmin && (
                  <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={(e) => handleEdit(e, post.id)}
                      className="p-2 bg-white/80 backdrop-blur-sm text-primary hover:text-accent rounded-full shadow-sm hover:scale-110 transition-all"
                      title="Edit Post"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(e, post.id)}
                      className="p-2 bg-white/80 backdrop-blur-sm text-destructive hover:text-red-600 rounded-full shadow-sm hover:scale-110 transition-all"
                      title="Delete Post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {post.thumbnail && !post.isTypographic && (
                  <div className={`w-full ${post.imgAspect} overflow-hidden bg-surface mb-6 relative`}>
                    <img 
                      src={post.thumbnail} 
                      alt={post.title} 
                      className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                    />
                  </div>
                )}
                
                <div className={`flex flex-col ${post.isTypographic ? 'border-t border-primary pt-12' : ''}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                      {post.category}
                    </span>
                    <span className="text-[10px] font-sans text-secondary/50 uppercase tracking-widest">
                      {post.date}
                    </span>
                  </div>
                  
                  <h3 className={`font-serif font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-500 leading-[1.1] ${post.isTypographic ? 'text-5xl md:text-7xl italic line-clamp-4' : index === 0 ? 'text-4xl md:text-5xl line-clamp-4' : 'text-2xl md:text-3xl line-clamp-3'}`}>
                    {post.title}
                  </h3>
                  
                  <span className="mt-8 inline-block text-[10px] font-bold uppercase tracking-widest text-secondary/40 mb-16">
                    by {post.author}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center p-24 text-secondary/50 font-sans uppercase tracking-widest text-sm">
              No stories found.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
