import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { Calendar, User, Eye, ArrowLeft, Edit2, Trash2, Send } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

interface Post {
  id: string
  title: string
  content: string
  thumbnail: string | null
  createdAt: string
  viewCount: number
  author: {
    id: string
    name: string
    role: string
    department: string
    bio?: string | null
  }
  category: {
    name: string
    slug: string
  }
}

interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string
  }
}

export default function PostDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editingCommentContent, setEditingCommentContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const currentUserStr = localStorage.getItem("user")
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/posts/${id}`)
        setPost(response.data.data)
      } catch (error) {
        console.error("Failed to fetch post", error)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/posts/${id}/comments`)
        // Assuming API returns { data: [...] }
        setComments(response.data.data || [])
      } catch (error) {
        console.error("Failed to fetch comments", error)
      }
    }

    fetchPost()
    fetchComments()
  }, [id])

  const handlePostDelete = async () => {
    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) return
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      navigate("/")
    } catch (error: any) {
      console.error("Failed to delete post", error)
      alert(error.response?.data?.error || "게시글 삭제에 실패했습니다.")
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(`/api/posts/${id}/comments`, { content: newComment }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setComments([...comments, response.data.data || response.data])
      setNewComment("")
    } catch (error: any) {
      console.error("Failed to create comment", error)
      alert(error.response?.data?.error || "댓글 작성에 실패했습니다.")
    }
  }

  const handleCommentDelete = async (commentId: string) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`/api/posts/${id}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setComments(comments.filter(c => c.id !== commentId))
    } catch (error: any) {
      console.error("Failed to delete comment", error)
      alert(error.response?.data?.error || "댓글 삭제에 실패했습니다.")
    }
  }

  const handleCommentUpdate = async (commentId: string) => {
    if (!editingCommentContent.trim()) return
    try {
      const token = localStorage.getItem("token")
      await axios.put(`/api/posts/${id}/comments/${commentId}`, { content: editingCommentContent }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setComments(comments.map(c => c.id === commentId ? { ...c, content: editingCommentContent } : c))
      setEditingCommentId(null)
      setEditingCommentContent("")
    } catch (error: any) {
      console.error("Failed to update comment", error)
      alert(error.response?.data?.error || "댓글 수정에 실패했습니다.")
    }
  }

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <p className="font-serif italic text-2xl animate-pulse">Loading Story...</p>
    </div>
  )

  if (!post) return <div className="p-20 text-center">Post not found.</div>

  return (
    <article className="bg-paper min-h-screen">
      {/* Dynamic Header Section */}
      {post.thumbnail ? (
        <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          {/* Strengthened Scrim for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 w-full p-8 md:p-20 text-white">
            <div className="max-w-5xl mx-auto">
              <Link to={`/category/${post.category.slug}`} className="inline-block text-xs font-bold uppercase tracking-[0.3em] mb-6 border-b border-white/40 pb-1 hover:border-white transition-colors">
                {post.category.name}
              </Link>
              <h1 className="text-4xl md:text-7xl font-serif font-bold leading-[1.1] mb-8 tracking-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-sans opacity-80">
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3" />
                  <span className="font-bold">{post.author.name}</span>
                  <span className="opacity-50">/ {post.author.department || post.author.role}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-3 h-3" />
                  <span>{post.viewCount} VIEWS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Text-Only Typographic Header */
        <div className="max-w-4xl mx-auto pt-32 pb-16 px-6 md:px-0">
          <Link to={`/category/${post.category.slug}`} className="inline-block text-xs font-bold uppercase tracking-[0.3em] mb-8 border-b border-primary/20 text-secondary hover:border-primary hover:text-primary transition-colors pb-1">
            {post.category.name}
          </Link>
          <h1 className="text-5xl md:text-8xl font-serif font-black leading-[1.1] mb-12 tracking-tighter text-primary">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-sans text-secondary border-t border-border pt-8">
            <div className="flex items-center gap-2 text-primary">
              <User className="w-3 h-3" />
              <span className="font-bold">{post.author.name}</span>
              <span className="opacity-50">/ {post.author.department || post.author.role}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-3 h-3" />
              <span>{post.viewCount} VIEWS</span>
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="max-w-3xl mx-auto py-16 px-6 md:px-0">
        <div className="mb-12 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Lounge
          </Link>

          {(currentUser?.id === post.author.id || currentUser?.name === post.author.name || currentUser?.role === 'ADMIN') && (
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors rounded-none px-0 hover:bg-transparent"
                onClick={() => navigate(`/post/edit/${post.id}`)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-bold uppercase tracking-widest text-destructive hover:text-destructive/80 transition-colors rounded-none px-0 hover:bg-transparent"
                onClick={handlePostDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>

        <div
          className="prose prose-lg max-w-none prose-img:rounded-none prose-headings:font-serif prose-p:leading-[2] prose-p:font-sans prose-p:text-foreground/80"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Author Bio Section (Magazine Style) */}
        <div className="mt-32 pt-16 border-t border-border flex flex-col md:flex-row items-start gap-8">
          <Link to={`/user/${post.author.id}`} className="w-16 h-16 bg-surface border border-border flex items-center justify-center font-serif text-2xl font-bold italic text-secondary hover:bg-primary hover:text-primary-foreground transition-colors shrink-0">
            {post.author.name[0]}
          </Link>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-secondary mb-2">Written By</p>
            <Link to={`/user/${post.author.id}`} className="inline-block group">
              <h3 className="text-2xl font-serif font-bold mb-2 group-hover:text-accent transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-accent after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left pb-1">
                {post.author.name}
              </h3>
            </Link>
            <p className="text-sm font-sans text-secondary leading-relaxed max-w-md whitespace-pre-wrap">
              {post.author.bio || ""}
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-20 pt-16 border-t border-border">
          <h3 className="text-xl font-serif font-bold italic mb-8 uppercase">Comments <span className="text-secondary/50 text-sm ml-2">({comments.length})</span></h3>

          <form onSubmit={handleCommentSubmit} className="mb-12 relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Leave a comment..."
              className="w-full bg-surface border border-border px-4 py-4 min-h-[100px] resize-none focus-visible:outline-none focus-visible:border-accent font-sans text-sm transition-colors"
            />
            <Button
              type="submit"
              className="absolute bottom-4 right-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-6 uppercase tracking-widest text-xs font-bold"
              disabled={!newComment.trim()}
            >
              <Send className="w-3 h-3 mr-2" /> Post
            </Button>
          </form>

          <div className="space-y-8">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <div className="w-10 h-10 bg-surface border border-border flex-shrink-0 flex items-center justify-center font-serif text-lg font-bold italic text-secondary">
                  {comment.author.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-sm mr-2">{comment.author.name}</span>
                      <span className="text-xs text-secondary/60">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    {(currentUser?.id === comment.author.id || currentUser?.name === comment.author.name) && (
                      <div className="flex gap-4">
                        <button onClick={() => { setEditingCommentId(comment.id); setEditingCommentContent(comment.content); }} className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-secondary hover:text-primary transition-colors">
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                        <button onClick={() => handleCommentDelete(comment.id)} className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-destructive hover:text-destructive/80 transition-colors">
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {editingCommentId === comment.id ? (
                    <div className="mt-2 relative">
                      <textarea
                        value={editingCommentContent}
                        onChange={(e) => setEditingCommentContent(e.target.value)}
                        className="w-full bg-surface border border-border px-4 py-3 min-h-[80px] resize-none focus-visible:outline-none focus-visible:border-accent font-sans text-sm transition-colors"
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <Button size="sm" variant="ghost" className="text-xs rounded-none" onClick={() => setEditingCommentId(null)}>Cancel</Button>
                        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs rounded-none" onClick={() => handleCommentUpdate(comment.id)}>Save</Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm font-sans leading-relaxed text-foreground/80 whitespace-pre-wrap">{comment.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
