import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api"
import { X } from "lucide-react"

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

interface SearchResult {
  id: string
  title: string
  category: { name: string } | null
  author: { name: string } | null
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [keyword, setKeyword] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
      setKeyword("")
      setResults([])
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  useEffect(() => {
    const fetchResults = async () => {
      if (!keyword.trim()) {
        setResults([])
        return
      }
      setIsSearching(true)
      try {
        const response = await api.get(`/posts?search=${encodeURIComponent(keyword)}`)
        // Ensure we safely extract posts array based on typical structure
        const postsData = response.data?.data?.posts || response.data?.data || []
        setResults(Array.isArray(postsData) ? postsData : [])
      } catch (error) {
        console.error("Search failed", error)
        setResults([])
      } finally {
        setIsSearching(false)
      }
    }

    const debounceTimer = setTimeout(fetchResults, 400)
    return () => clearTimeout(debounceTimer)
  }, [keyword])

  if (!isOpen) return null

  const handleResultClick = (id: string) => {
    onClose()
    navigate(`/post/${id}`)
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-white/98 backdrop-blur-xl flex flex-col items-center pt-32 px-6 overflow-y-auto w-full h-screen left-0 top-0">
      <button
        onClick={onClose}
        className="fixed top-8 right-8 p-4 text-secondary hover:text-primary hover:rotate-90 transition-all duration-500 z-[10000]"
      >
        <X className="w-10 h-10" strokeWidth={1} />
      </button>

      <div className="w-full max-w-4xl flex flex-col gap-16 relative">
        <input
          ref={inputRef}
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="SEARCH..."
          className="w-full bg-transparent border-0 border-b border-primary/20 font-serif italic font-black text-4xl md:text-6xl tracking-tighter uppercase focus:outline-none focus:ring-0 focus:border-primary placeholder:text-secondary/20 pb-4 transition-colors duration-500"
        />

        <div className="flex flex-col gap-4 min-h-[300px]">
          {isSearching ? (
            <p className="font-sans text-sm tracking-[0.2em] uppercase text-secondary/50">Searching...</p>
          ) : results.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {results.map((post) => (
                <li key={post.id}>
                  <button
                    onClick={() => handleResultClick(post.id)}
                    className="group text-left w-full flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 py-6 border-b border-border/50 hover:border-primary transition-colors"
                  >
                    <span className="font-sans text-xs tracking-widest uppercase text-secondary/60 w-32 flex-shrink-0 group-hover:text-primary transition-colors">
                      {post.category?.name || "UNCATEGORIZED"}
                    </span>
                    <span className="font-serif text-2xl md:text-3xl text-primary transition-all duration-300 line-clamp-1">
                      {post.title}
                    </span>
                    <span className="font-sans text-xs text-secondary/40 ml-auto group-hover:text-primary transition-colors">
                      by {post.author?.name || "Unknown"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : keyword.trim() ? (
            <p className="font-sans text-sm tracking-[0.2em] uppercase text-secondary/50">No results found.</p>
          ) : (
            <p className="font-sans text-sm tracking-[0.2em] uppercase text-secondary/30">Type to explore the lounge.</p>
          )}
        </div>
      </div>
    </div>
  )
}
