import { Link, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Badge } from "./ui/badge"
import { Edit2, Trash2 } from "lucide-react"
import api from "@/lib/api"
import { useEffect, useState } from "react"

interface BentoCardProps {
  id: number | string
  title: string
  description: string
  category: string
  thumbnail?: string
  author: string
  date: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function BentoCard({
  id,
  title,
  category,
  thumbnail,
  className,
  size = "md",
}: BentoCardProps) {
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(false)

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

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    navigate(`/post/edit/${id}`)
  }

  const handleDelete = async (e: React.MouseEvent) => {
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
    <Link
      to={`/post/${id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden border bg-surface transition-all hover:shadow-2xl hover:-translate-y-1 duration-500",
        size === "lg" ? "col-span-2 row-span-2" : size === "md" ? "col-span-1 row-span-2" : "col-span-1 row-span-1",
        className
      )}
    >
      {isAdmin && (
        <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleEdit}
            className="p-2 bg-white/80 backdrop-blur-sm text-primary hover:text-accent rounded-full shadow-sm hover:scale-110 transition-all"
            title="Edit Post"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-2 bg-white/80 backdrop-blur-sm text-destructive hover:text-red-600 rounded-full shadow-sm hover:scale-110 transition-all"
            title="Delete Post"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
      {thumbnail && (
        <div className="relative h-48 w-full overflow-hidden bg-muted sm:h-auto sm:grow">
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Enhanced Scrim for Readability: Multi-step gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
        </div>
      )}
      <div className={cn(
        "flex flex-col p-6 md:p-8 transition-all duration-500",
        thumbnail ? "absolute bottom-0 w-full text-white" : "grow justify-end"
      )}>
        <div>
          <Badge variant={thumbnail ? "secondary" : "default"} className="mb-4 md:mb-6 uppercase tracking-widest text-[10px]">
            {category}
          </Badge>
          <h3 className={cn(
            "font-serif font-black leading-[1.2] tracking-tight",
            // Dynamic Font Sizing & Extended Line Clamping
            size === "lg" ? "text-3xl md:text-5xl line-clamp-5" : 
            size === "md" ? "text-2xl md:text-4xl line-clamp-4" : 
            "text-xl md:text-2xl line-clamp-3", 
            !thumbnail && "text-primary"
          )}>
            {title}
          </h3>
        </div>
      </div>
    </Link>
  )
}
