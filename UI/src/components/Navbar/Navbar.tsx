function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-6">
        <a href="/" className="flex items-center gap-3 no-underline">
          <span className="brand-mark" aria-hidden="true" />
          <div>
            <div className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">StockScreener</div>
            <div className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-700 sm:block">Indian Equity Research</div>
          </div>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {[
            ["/", "Home"],
            ["#screener", "Screener"],
            ["#markets", "Markets"],
            ["#about", "About"],
          ].map(([href, label]) => (
            <a
              key={label}
              href={href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-violet-50 hover:text-violet-800"
            >
              {label}
            </a>
          ))}
        </nav>

        <button className="rounded-xl border border-violet-200 bg-violet-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-violet-800 hover:shadow-md">
          Login
        </button>
      </div>
    </header>
  );
}

export default Navbar;
