import ScrollReveal from '@/components/ui/ScrollReveal';

// Fibonacci-spiral layout: blocks sized by Fibonacci sequence
// 1, 1, 2, 3, 5 → areas proportional to Fibonacci numbers
// The eye reads in a spiral: A → B → C → D → E
const photos = [
  { src: '/Production_Site/5.png', alt: 'Производство — линия сушки', span: 'col-span-3 row-span-2' },     // 5 (largest)
  { src: '/Production_Site/6.png', alt: 'Производство — фракционирование', span: 'col-span-2 row-span-2' }, // 3
  { src: '/Production_Site/1.png', alt: 'Производство — контроль качества', span: 'col-span-2 row-span-1' }, // 2
  { src: '/Production_Site/7.png', alt: 'Производство — упаковка', span: 'col-span-1 row-span-1' },          // 1
  { src: '/Production_Site/2.png', alt: 'Производство — лаборатория', span: 'col-span-1 row-span-1' },       // 1
  { src: '/Production_Site/3.png', alt: 'Производство — отгрузка', span: 'col-span-2 row-span-1' },          // 2
];

const PhotoAlbumSection = () => {
  return (
    <section className="bg-[#0a0a0a] py-4 lg:py-4">
      <div className="px-[1cm]">
        <ScrollReveal type="fade-up">
          <div className="grid grid-cols-5 grid-rows-3 gap-3 h-[calc(100vh-2cm)]">
            {photos.map((photo, i) => (
              <div
                key={i}
                className={`${photo.span} overflow-hidden rounded-lg group relative`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Hover overlay with caption */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-end">
                  <span className="text-white text-sm px-4 pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
                    {photo.alt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default PhotoAlbumSection;
