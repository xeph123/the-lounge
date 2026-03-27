import { useEffect, useState } from "react"
import axios from "axios"
import { Shield, ShieldAlert, User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

interface UserData {
  id: string
  email: string
  name: string
  role: "ADMIN" | "USER"
  department: string | null
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      // Based on the login/profile logic, the response might be { data: users } or { data: { data: users } }
      setUsers(response.data.data || response.data)
    } catch (error) {
      console.error("Failed to fetch users", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      const user = JSON.parse(userStr)
      if (user.role !== "ADMIN") {
        alert("권한이 없습니다.")
        navigate("/")
        return
      }
    } else {
      navigate("/login")
      return
    }
    fetchUsers()
  }, [])

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN"
    try {
      const token = localStorage.getItem("token")
      await axios.put(`/api/users/${userId}/role`, { role: newRole }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(u => u.id === userId ? { ...u, role: newRole as "ADMIN" | "USER" } : u)
      )

      // If the current logged in user changed their own role, update localStorage
      const loggedInUserStr = localStorage.getItem("user")
      if (loggedInUserStr) {
        const loggedInUser = JSON.parse(loggedInUserStr)
        if (loggedInUser.id === userId) {
          loggedInUser.role = newRole
          localStorage.setItem("user", JSON.stringify(loggedInUser))
          if (newRole !== "ADMIN") {
            navigate("/")
          }
        }
      }
    } catch (error) {
      console.error("Failed to update user role", error)
      alert("권한 변경에 실패했습니다.")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32 text-secondary/50 font-sans uppercase tracking-widest text-sm min-h-screen">
        Loading users...
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-6 min-h-screen">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-xs font-sans font-bold uppercase tracking-widest">Back</span>
          </button>
          <h1 className="font-serif text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-primary">
            User <span className="text-accent">Admin</span>
          </h1>
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-secondary/60 mt-4">
            Manage system access and privileges.
          </p>
        </div>
        <div className="text-right hidden md:block">
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-secondary/40 block mb-1">Total Users</span>
          <span className="text-4xl font-serif font-black italic">{users.length}</span>
        </div>
      </div>

      <div className="overflow-x-auto border border-border">
        <table className="w-full text-left border-collapse font-sans">
          <thead>
            <tr className="bg-surface border-b border-border">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">User</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">Department</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary">Role</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-secondary text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30 transition-colors group">
                <td className="px-6 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-surface border border-border flex items-center justify-center text-primary group-hover:border-primary/30 transition-colors">
                      <User className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="font-bold text-primary group-hover:text-accent transition-colors">{user.name}</div>
                      <div className="text-xs text-secondary/60 lowercase">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 text-sm text-secondary/80">
                  {user.department || "-"}
                </td>
                <td className="px-6 py-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold tracking-widest uppercase border ${
                    user.role === 'ADMIN' 
                      ? 'border-primary bg-primary text-white' 
                      : 'border-border bg-surface text-secondary'
                  }`}>
                    {user.role === 'ADMIN' ? <ShieldAlert className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-6 text-right">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="rounded-none border-primary text-primary hover:bg-primary hover:text-white text-[10px] font-bold tracking-tighter uppercase h-8 px-4"
                    onClick={() => toggleRole(user.id, user.role)}
                  >
                    Change to {user.role === 'ADMIN' ? 'USER' : 'ADMIN'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
