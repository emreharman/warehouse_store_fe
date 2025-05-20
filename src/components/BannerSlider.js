import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

const banners = [
  { id: 1, image: "/banner1.png", alt: "Yeni sezon ürünleri" },
  { id: 2, image: "/banner2.png", alt: "Yaza özel indirimler" },
];

function AutoplayPlugin(slider) {
  let timeout;
  const clearNextTimeout = () => clearTimeout(timeout);
  const nextTimeout = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      slider.next();
    }, 3000);
  };

  slider.on("created", () => {
    nextTimeout();
    slider.container.addEventListener("mouseover", clearNextTimeout);
    slider.container.addEventListener("mouseout", nextTimeout);
  });

  slider.on("dragStarted", clearNextTimeout);
  slider.on("animationEnded", nextTimeout);
  slider.on("updated", nextTimeout);
}

export default function BannerSlider() {
  const [sliderRef] = useKeenSlider(
    {
      loop: true,
      slides: { perView: 1 },
      duration: 1000,
    },
    [AutoplayPlugin] // plugin burada
  );

  return (
    <div
      ref={sliderRef}
      className="keen-slider rounded-xl overflow-hidden mb-6"
    >
      {banners.map((banner) => (
        <div
          key={banner.id}
          className="keen-slider__slide relative aspect-[3/1] w-full"
        >
          <img
            src={banner.image}
            alt={banner.alt}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
