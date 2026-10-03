import Navbar from '../../components/Navbar/Navbar'
import MarketMarquee from '../../components/MarketMarquee/MarketMarquee'
import Hero from '../../components/Hero/Hero'

function Home() {
  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <Navbar />
      <MarketMarquee />
      <Hero />
    </div>
  )
}

export default Home
