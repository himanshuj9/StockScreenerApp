function Navbar() {
  return (
    <nav className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <div className="text-xl font-bold text-white">
          StockScreener
        </div>

        {/* Navigation links */}
        <div className="flex items-center gap-8 text-sm text-slate-300">
          <a href="#" className="hover:text-white">
            Home
          </a>

          <a href="#" className="hover:text-white">
            Screener
          </a>

          <a href="#" className="hover:text-white">
            Markets
          </a>

          <a href="#" className="hover:text-white">
            About
          </a>
        </div>

        {/* Login button */}
        <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200">
          Login
        </button>

      </div>
    </nav>
  )
}

export default Navbar