import { useState } from "react";

const SizeGuideModal = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const imagess = [
    {
      img: "/regular-size.jpeg",
      title: "Regular",
    },
    {
      img: "/oversize-size.jpeg",
      title: "Oversize",
    },
    {
      img: "/buyuk-size.jpeg",
      title: "Büyük Beden",
    },
    {
      img: "/hoodie-size.jpeg",
      title: "Hoodie",
    },
    {
      img: "/cocuk-size.jpeg",
      title: "Çocuk",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % imagess.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + imagess.length) % imagess.length);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Beden Rehberi
        </h2>

        <div className="relative">
          <img
            src={imagess[currentSlide].img}
            alt={imagess[currentSlide].title}
            className="rounded w-full mb-2"
          />
          <div className="text-center text-sm font-medium text-gray-700 mb-2">
            {imagess[currentSlide].title}
          </div>

          {imagess.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-white shadow rounded-l text-xl">
                ‹
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-white shadow rounded-r text-xl">
                ›
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 w-full">
          Kapat
        </button>
      </div>
    </div>
  );
};

export default SizeGuideModal;
