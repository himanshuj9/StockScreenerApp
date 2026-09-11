import Navbar from '../../components/Navbar/Navbar'
import Hero from '../../components/Hero/Hero'

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main>
        <Hero />
      </main>
    </div>
  )
}

export default Home