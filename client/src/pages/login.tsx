import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowRight, Eye, EyeOff } from "lucide-react"
import axios from "axios"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setIsLoading(true)
    try {
      const response = await axios.post("/api/auth/login", { email, password })

      // Backend wraps the success response in a 'data' object.
      // So the structure is response.data = { data: { token, user } }
      const { token, user } = response.data.data || response.data

      if (!token) {
        throw new Error("Invalid response format: token missing")
      }

      // 토큰과 유저 정보 저장
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      // 메인 페이지로 이동
      navigate("/")
      window.location.reload() // 네비게이션 바 갱신을 위해 리로드
    } catch (error: any) {
      console.error("Login failed:", error)
      alert(error.response?.data?.error || "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] w-full grid grid-cols-12 gap-8 px-8 py-20 relative bg-paper text-foreground overflow-hidden">
      <div className="col-span-12 md:col-start-2 md:col-span-6 lg:col-start-2 lg:col-span-5 relative z-10">

        <div className="mb-[80px] animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-[-0.02em] leading-[1.4] mb-4 uppercase">
            Access<br />
            <span className="italic font-medium">the Silence.</span>
          </h1>
          <p className="font-sans text-secondary tracking-[-0.01em] leading-[1.5]">
            로그인
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 ease-out fill-mode-both">

          <div className="space-y-2 relative">
            <label className="block text-xs font-sans font-bold uppercase tracking-widest text-secondary mb-2">사내 이메일</label>
            <Input
              type="email"
              placeholder="m.lounge@imr.co.kr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface border-border border px-[24px] py-[20px] rounded-none focus-visible:ring-0 focus-visible:border-accent text-lg font-sans transition-colors"
              required
            />
          </div>

          <div className="space-y-2 relative">
            <div className="flex justify-between items-end mb-2">
              <label className="block text-xs font-sans font-bold uppercase tracking-widest text-secondary">비밀번호</label>
              <Link to="/forgot-password" className="text-[10px] font-sans uppercase tracking-widest text-primary opacity-50 hover:opacity-100 transition-opacity">비밀번호 찾기</Link>
            </div>
            <div className="relative flex items-center">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface border-border border px-[24px] py-[20px] rounded-none focus-visible:ring-0 focus-visible:border-accent text-lg font-sans transition-colors pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 text-secondary hover:text-primary transition-colors p-4"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="pt-12 relative flex justify-end">
            <div className="transform translate-x-[24px] -translate-y-[12px]">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative bg-transparent border-none outline-none cursor-pointer flex items-center gap-4 disabled:opacity-50"
              >
                <span className="font-serif text-[24px] font-bold italic uppercase transition-all duration-500 ease-in-out group-hover:tracking-[0.1em] text-primary">
                  <span className="text-3xl">L</span>og In
                </span>
                <div className="w-12 h-12 flex items-center justify-center border border-primary rounded-none group-hover:bg-primary group-hover:text-surface transition-colors duration-500">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            </div>
          </div>

        </form>

        <div className="mt-20 pt-8 border-t border-border flex justify-between items-center text-xs font-sans tracking-widest text-secondary animate-in fade-in duration-1000 delay-300 fill-mode-both">
          <span>아직 계정이 없으신가요?</span>
          <Button variant="link" className="text-sm uppercase tracking-widest text-primary hover:text-accent rounded-none p-0 h-auto" onClick={() => navigate("/signup")}>
            회원가입
          </Button>
        </div>

      </div>

      <div className="hidden md:block absolute top-0 right-0 w-1/3 h-full border-l border-border opacity-50 pointer-events-none" />
      <div className="hidden md:block absolute bottom-[20%] right-[10%] w-[1px] h-[40%] bg-border pointer-events-none" />
    </div>
  )
}
