import { Outlet } from "react-router-dom"
import { Navbar } from "./navbar"

export function Layout() {
  return (
    <div className="min-h-screen bg-paper font-sans antialiased text-primary">
      <Navbar />
      <main className="container mx-auto px-6 py-6 lg:max-w-[1280px]">
        <Outlet />
      </main>
      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="font-serif text-2xl font-black tracking-tighter opacity-50">THE LOUNGE</p>
          <p className="mt-4 text-xs text-muted-foreground uppercase tracking-widest">
            © 2026 THE LOUNGE. Editorial Modernism.
          </p>
        </div>
      </footer>
    </div>
  )
}
