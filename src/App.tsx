import { Outlet } from "react-router-dom"

export default function App() {
  return (
    <div>
      <header className="p-2 border-b border-zinc-800">
        <h1 className="text-3xl font-bold">
          MuzArto Learning Tools
        </h1>

        <p className="text-zinc-400 mt-2">
          Music theory trainer platform
        </p>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}
