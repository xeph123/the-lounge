import { Link, useNavigate } from "react-router-dom"
import { Menu, Search, User, LogOut, X } from "lucide-react"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"
import { SearchOverlay } from "./SearchOverlay"

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [userRole, setUserRole] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")
    if (token && userStr) {
      setIsLoggedIn(true)
      try {
        const user = JSON.parse(userStr)
        setUserName(user.name)
        setUserId(user.id)
        setUserRole(user.role)
      } catch (e) {
        console.error("User parsing failed", e)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    navigate("/login")
  }

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b bg-white/70 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-serif text-3xl font-black tracking-tighter text-primary">
            THE LOUNGE
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/category/notice" className="hover:text-accent transition-colors font-sans">NOTICE</Link>
            <Link to="/category/lounge" className="hover:text-accent transition-colors font-sans">LOUNGE</Link>
            <Link to="/category/tech" className="hover:text-accent transition-colors font-sans">TECH</Link>
            <Link to="/category/idea" className="hover:text-accent transition-colors font-sans">IDEA</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {userRole === 'ADMIN' && (
                <Button variant="outline" className="hidden md:flex font-serif text-sm font-bold tracking-widest rounded-none border-secondary text-secondary hover:bg-secondary hover:text-white transition-colors mr-2" asChild>
                  <Link to="/admin/users">USER ADMIN</Link>
                </Button>
              )}
              <Button variant="outline" className="hidden md:flex font-serif text-sm font-bold tracking-widest rounded-none border-primary text-primary hover:bg-primary hover:text-white transition-colors mr-2" asChild>
                <Link to="/post/create">글 작성하기</Link>
              </Button>
              <Link to={`/user/${userId}`} className="hidden md:flex flex-col items-end mr-2 hover:opacity-80 transition-opacity cursor-pointer group">
                <span className="text-[10px] font-sans text-secondary tracking-widest uppercase group-hover:text-accent transition-colors">Member</span>
                <span className="text-sm font-sans font-bold text-primary group-hover:text-accent transition-colors">{userName}</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="icon" asChild title="Login">
              <Link to="/login">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* 모바일 메뉴 오버레이 */}
      {isMobileMenuOpen && (
        <div 
          className="absolute top-20 left-0 w-full h-[calc(100vh-5rem)] bg-black/20 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div className="md:hidden z-50 border-t bg-white absolute w-full left-0 p-6 flex flex-col gap-6 shadow-xl animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-4 text-base font-medium">
            <Link to="/category/notice" className="hover:text-accent transition-colors font-sans" onClick={() => setIsMobileMenuOpen(false)}>NOTICE</Link>
            <Link to="/category/lounge" className="hover:text-accent transition-colors font-sans" onClick={() => setIsMobileMenuOpen(false)}>LOUNGE</Link>
            <Link to="/category/tech" className="hover:text-accent transition-colors font-sans" onClick={() => setIsMobileMenuOpen(false)}>TECH</Link>
            <Link to="/category/idea" className="hover:text-accent transition-colors font-sans" onClick={() => setIsMobileMenuOpen(false)}>IDEA</Link>
            
            {isLoggedIn && (
              <div className="flex flex-col gap-4 pt-4 border-t mt-2">
                <Link to="/post/create" className="text-primary font-bold font-serif hover:opacity-80 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>글 작성하기</Link>
                {userRole === 'ADMIN' && (
                  <Link to="/admin/users" className="text-secondary font-bold font-serif hover:opacity-80 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>USER ADMIN</Link>
                )}
                <Link to={`/user/${userId}`} className="text-secondary font-sans hover:opacity-80 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>마이페이지 ({userName})</Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
    <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
