import { useState, useRef, useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ImagePlus, X } from "lucide-react"
import ReactQuill from "react-quill-new"
import "react-quill-new/dist/quill.snow.css"

export default function PostCreatePage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categorySlug, setCategorySlug] = useState("lounge") // 기본값
  const fileInputRef = useRef<HTMLInputElement>(null)
  const quillRef = useRef<ReactQuill>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      alert("로그인이 필요한 서비스입니다.")
      navigate("/login")
    }

    if (isEditMode) {
      const fetchPost = async () => {
        try {
          const response = await api.get(`/posts/${id}`)
          const post = response.data.data
          setTitle(post.title)
          setContent(post.content)
          setThumbnailUrl(post.thumbnail)
          setCategorySlug(post.category.slug)
        } catch (error) {
          console.error("Failed to fetch post", error)
          alert("게시글을 불러오는데 실패했습니다.")
          navigate("/")
        }
      }
      fetchPost()
    }
  }, [id, isEditMode, navigate])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("image", file)

    try {
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const url = response.data.url
      if (url) {
        setThumbnailUrl(url)
      }
    } catch (error) {
      console.error("Image upload failed:", error)
      alert("이미지 업로드에 실패했습니다.")
    } finally {
      setIsUploading(false)
    }
  }

  const modules = useMemo(() => {
    const imageHandler = () => {
      const input = document.createElement("input")
      input.setAttribute("type", "file")
      input.setAttribute("accept", "image/*")
      input.style.display = "none"
      document.body.appendChild(input) // iOS 사파리 대응 (DOM에 추가되어 있어야 click 이벤트가 정상 작동함)
      input.click()

      input.onchange = async () => {
        document.body.removeChild(input) // 정상적으로 파일 선택 시 제거
        const file = input.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append("image", file)

        try {
          const response = await api.post("/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          const url = response.data.url

          if (url && quillRef.current) {
            const editor = quillRef.current.getEditor()
            const range = editor.getSelection()
            editor.insertEmbed(range ? range.index : 0, "image", url)
          }
        } catch (error) {
          console.error("Image upload to editor failed:", error)
          alert("에디터 이미지 업로드에 실패했습니다.")
        }
      }
    }

    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }
  }, [])

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || content === "<p><br></p>") {
      alert("제목과 내용을 입력해주세요.")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      alert("로그인이 필요합니다.")
      navigate("/login")
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        title,
        content,
        thumbnail: thumbnailUrl,
        categorySlug,
      }

      if (isEditMode) {
        await api.put(`/posts/${id}`, payload)
        navigate(`/post/${id}`)
      } else {
        await api.post("/posts", payload)
        navigate("/")
      }
    } catch (error: any) {
      console.error("Post operation failed:", error)
      alert(error.response?.data?.error || `포스트 ${isEditMode ? '수정' : '발행'}에 실패했습니다.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-8 bg-paper min-h-[85vh] flex flex-col font-sans">
      <div className="flex items-center justify-between mb-16 border-b border-border pb-6">
        <div className="flex gap-4">
          {["notice", "lounge", "tech", "idea"].map((slug) => (
            <button
              key={slug}
              onClick={() => setCategorySlug(slug)}
              className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all pb-1 border-b-2 ${categorySlug === slug ? "text-primary border-primary" : "text-secondary/40 border-transparent hover:text-secondary"}`}
            >
              {slug}
            </button>
          ))}
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-secondary/60 font-serif italic">
          Drafting New Story
        </p>
      </div>

      <div className="flex-1 space-y-12">
        <div className="relative w-full aspect-[21/9] md:aspect-[3/1] bg-surface/50 border border-border/50 group overflow-hidden transition-all duration-500 hover:border-foreground/20">
          {thumbnailUrl ? (
            <>
              <img
                src={thumbnailUrl}
                alt="Thumbnail"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => setThumbnailUrl(null)}
                  className="bg-white/90 text-primary p-3 rounded-full hover:scale-110 transition-transform shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
            >
              <ImagePlus className="w-8 h-8 mb-4 text-secondary" strokeWidth={1.5} />
              <p className="text-sm tracking-widest uppercase text-secondary font-medium">
                {isUploading ? "Uploading..." : "썸네일을 추가해주세요"}
              </p>
              {/* 모바일 호환성을 위해 hidden 대신 투명하게 올려두는 방식을 사용 */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          )}
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="w-full text-5xl md:text-7xl font-serif font-bold bg-transparent border-none outline-none placeholder:opacity-20 tracking-tight text-foreground transition-all focus:placeholder:opacity-0"
        />

        <div className="h-px w-full bg-border/50" />

        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          placeholder="당신의 이야기를 들려주세요..."
          className="w-full min-h-[50vh] text-lg md:text-xl font-sans bg-transparent border-none outline-none resize-none placeholder:opacity-30 leading-[1.8] text-foreground/90 transition-all focus:placeholder:opacity-0"
        />
      </div>

      <div className="flex justify-end items-end gap-12 mt-24 pb-8 border-t border-border pt-12">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-sm font-sans tracking-[0.2em] uppercase opacity-50 hover:text-blackasd hover:opacity-100 transition-opacity rounded-none px-0 hover:bg-transparent border-b border-transparent hover:border-foreground pb-1 h-auto mb-2"
        >
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || isUploading}
          className="text-xl md:text-2xl font-serif italic font-bold tracking-[0.1em] uppercase px-12 py-8 bg-primary text-primary-foreground transform translate-x-4 -translate-y-4 hover:bg-primary/90 transition-all duration-500 rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:translate-x-3 hover:-translate-y-3 disabled:opacity-50 disabled:hover:translate-x-4 disabled:hover:-translate-y-4"
        >
          {isSubmitting ? (isEditMode ? "수정 중..." : "발행 중...") : (isEditMode ? "수정하기" : "발행하기")}
        </Button>
      </div>
    </div>
  )
}
