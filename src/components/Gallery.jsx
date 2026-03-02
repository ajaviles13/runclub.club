const IMAGE_SOURCES = [
  '/images/RunClubImage_1.jpeg',
  '/images/RunClubImage_2.jpeg',
  '/images/RunClubImage_3.jpeg',
]

export default function Gallery() {
  return (
    <section className="gallery" aria-label="Gallery">
      <div className="gallery-grid">
        {IMAGE_SOURCES.map((src, i) => (
          <div key={src} className="gallery-item">
            <img
              src={src}
              alt={`Gallery ${i + 1}`}
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.parentElement.classList.add('placeholder')
              }}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

