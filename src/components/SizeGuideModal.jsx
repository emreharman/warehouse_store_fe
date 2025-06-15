import { useState } from "react";

const SizeGuideModal = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    "/regular-size.jpeg",
    "/oversize-size.jpeg",
    "/buyuk-size.jpeg",
    "/hoodie-size.jpeg",
    "/cocuk-size.jpeg",
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <h2 className="text-lg font-semibold mb-4">Beden Rehberi</h2>
        <div className="relative">
          <img
            src={images[currentSlide]}
            alt={`Slide ${currentSlide + 1}`}
            className="rounded w-full"
          />
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-white shadow rounded-l">
                ‹
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-white shadow rounded-r">
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
