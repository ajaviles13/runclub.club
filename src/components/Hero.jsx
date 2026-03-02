export default function Hero() {
  return (
    <header className="hero">
      <div className="hero-bg">
        <img
          src="/images/RunClubImage_1.jpeg"
          alt=""
          className="hero-image"
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.nextElementSibling?.classList.add('visible')
          }}
        />
        <div className="hero-placeholder" />
      </div>
      <div className="hero-content">
        <h1 className="hero-domain">runclub.club</h1>
        <p className="hero-tagline">A premium domain for running communities</p>
        <p className="hero-desc">This domain is available for purchase. If you're building something for runners, reach out.</p>
        <a href="#contact" className="hero-cta">Get in touch</a>
      </div>
      <div className="hero-gradient" />
    </header>
  )
}
