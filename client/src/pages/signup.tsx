import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, Eye, EyeOff } from "lucide-react"
import api from "@/lib/api"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [name, setName] = useState("")
  const [department, setDepartment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || !name) return

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }

    setIsLoading(true)
    try {
      await api.post("/auth/signup", {
        email,
        password,
        name,
        department
      })
      alert("회원가입이 완료되었습니다. 로그인해주세요.")
      navigate("/login")
    } catch (error: any) {
      console.error("Signup failed:", error)
      alert(error.response?.data?.error || "회원가입에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] w-full grid grid-cols-12 gap-4 md:gap-8 px-4 sm:px-8 py-12 md:py-20 relative bg-paper text-foreground overflow-hidden">
      <div className="col-span-12 md:col-start-6 md:col-span-6 lg:col-start-7 lg:col-span-5 relative z-10">

        <div className="mb-[60px] md:mb-[80px] animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.02em] leading-[1.4] mb-4">
            Create<br />
            <span className="italic font-medium">an Object.</span>
          </h1>
          <p className="font-sans text-secondary tracking-[-0.01em] leading-[1.5]">
            The Lounge의 새로운 구성원으로 합류하세요.
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 ease-out fill-mode-both">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 relative">
              <label className="block text-xs font-sans font-bold uppercase tracking-widest text-secondary mb-2">이름</label>
              <Input
                type="text"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface border-border border px-[24px] py-[20px] rounded-none focus-visible:ring-0 focus-visible:border-accent text-lg font-sans transition-colors"
                required
              />
            </div>
            <div className="space-y-2 relative">
              <label className="block text-xs font-sans font-bold uppercase tracking-widest text-secondary mb-2">소속 부서</label>
              <Input
                type="text"
                placeholder="개발 1팀"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-surface border-border border px-[24px] py-[20px] rounded-none focus-visible:ring-0 focus-visible:border-accent text-lg font-sans transition-colors"
              />
            </div>
          </div>

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
            <label className="block text-xs font-sans font-bold uppercase tracking-widest text-secondary mb-2">비밀번호</label>
            <div className="relative flex items-center">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface border-border border px-[24px] py-[20px] rounded-none focus-visible:ring-0 focus-visible:border-accent text-lg font-sans transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-secondary hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2 relative">
            <label className="block text-xs font-sans font-bold uppercase tracking-widest text-secondary mb-2">비밀번호 확인</label>
            <div className="relative flex items-center">
              <Input
                type={showPasswordConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full bg-surface border-border border px-[24px] py-[20px] rounded-none focus-visible:ring-0 focus-visible:border-accent text-lg font-sans transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-4 text-secondary hover:text-primary transition-colors"
              >
                {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="pt-8 md:pt-12 relative flex justify-end">
            <div className="transform md:translate-x-[24px] md:-translate-y-[12px]">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative bg-transparent border-none outline-none cursor-pointer flex items-center gap-4 disabled:opacity-50"
              >
                <span className="font-serif text-[24px] font-bold italic uppercase transition-all duration-500 ease-in-out group-hover:tracking-[0.1em] text-primary">
                  <span className="text-3xl">S</span>ign Up
                </span>
                <div className="w-12 h-12 flex items-center justify-center border border-primary rounded-none group-hover:bg-primary group-hover:text-surface transition-colors duration-500">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            </div>
          </div>

        </form>

        <div className="mt-20 pt-8 border-t border-border flex justify-between items-center text-xs font-sans tracking-widest text-secondary animate-in fade-in duration-1000 delay-300 fill-mode-both">
          <span>이미 계정이 있으신가요?</span>
          <Button variant="link" className="font-serif text-sm uppercase tracking-widest text-primary hover:text-accent rounded-none p-0 h-auto" onClick={() => navigate("/login")}>
            Sign In
          </Button>
        </div>

      </div>

      <div className="hidden md:block absolute top-0 left-0 w-1/3 h-full border-r border-border opacity-50 pointer-events-none" />
      <div className="hidden md:block absolute top-[20%] left-[10%] w-[1px] h-[60%] bg-border pointer-events-none" />
    </div>
  )
}
