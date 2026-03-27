import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, ArrowLeft, Eye, EyeOff } from "lucide-react"
import api from "@/lib/api"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !name || !newPassword || !passwordConfirm) {
      alert("모든 필드를 입력해주세요.")
      return
    }

    if (newPassword !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }

    setIsLoading(true)
    try {
      // Assuming a PUT or POST to /api/auth/reset-password
      // This endpoint needs to be implemented on the backend if it doesn't exist
      await api.post("/auth/reset-password", { email, name, newPassword })
      alert("비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.")
      navigate("/login")
    } catch (error: any) {
      console.error("Password reset failed:", error)
      alert(error.response?.data?.error || "비밀번호 변경에 실패했습니다. 이메일과 이름을 확인해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] w-full grid grid-cols-12 gap-8 px-8 py-20 relative bg-paper text-foreground overflow-hidden">
      <div className="col-span-12 md:col-start-2 md:col-span-6 lg:col-start-2 lg:col-span-5 relative z-10">
        
        <div className="mb-[60px] animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
          <button 
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Login
          </button>
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-[-0.02em] leading-[1.4] mb-4 uppercase">
            Reset<br />
            <span className="italic font-medium">Password.</span>
          </h1>
          <p className="font-sans text-secondary tracking-[-0.01em] leading-[1.5]">
            비밀번호를 재설정합니다.
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 ease-out fill-mode-both">
          
          <div className="space-y-2 relative">
            <label className="block text-xs font-sans font-bold uppercase tracking-widest text-secondary mb-2">이메일</label>
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
            <label className="block text-xs font-sans font-bold uppercase tracking-widest text-secondary mb-2">새 비밀번호</label>
            <div className="relative flex items-center">
              <Input 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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

          <div className="pt-8 relative flex justify-end">
            <div className="transform translate-x-[24px] -translate-y-[12px]">
              <button 
                type="submit" 
                disabled={isLoading}
                className="group relative bg-transparent border-none outline-none cursor-pointer flex items-center gap-4 disabled:opacity-50"
              >
                <span className="font-serif text-[24px] font-bold italic uppercase transition-all duration-500 ease-in-out group-hover:tracking-[0.1em] text-primary">
                  <span className="text-3xl">R</span>eset
                </span>
                <div className="w-12 h-12 flex items-center justify-center border border-primary rounded-none group-hover:bg-primary group-hover:text-surface transition-colors duration-500">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            </div>
          </div>

        </form>

      </div>

      <div className="hidden md:block absolute top-0 right-0 w-1/3 h-full border-l border-border opacity-50 pointer-events-none" />
      <div className="hidden md:block absolute bottom-[20%] right-[10%] w-[1px] h-[40%] bg-border pointer-events-none" />
    </div>
  )
}
