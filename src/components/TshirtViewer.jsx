export default function TshirtViewer({
  color = "#fff",
  productType = "t", // "t" | "h" | "c"
  side = "front",
  children,
}) {
  const renderSVG = () => {
    if (productType === "t") {
      return side === "front" ? (
        <path
          d="M3 7L6 4H9C9 4.4 9.08 4.78 9.23 5.15C9.38 5.51 9.6 5.84 9.88 6.12C10.16 6.4 10.49 6.62 10.85 6.77C11.22 6.92 11.61 7 12 7C12.39 7 12.78 6.92 13.15 6.77C13.51 6.62 13.84 6.4 14.12 6.12C14.4 5.84 14.62 5.51 14.77 5.15C14.92 4.78 15 4.4 15 4H18L21 7L20.5 12L18 10.5V26H6V10.5L3.5 12L3 7Z"
          fill={color}
          stroke="#000"
          strokeWidth="0.2"
        />
      ) : (
        <path
          d="M3 7L6 4H18L21 7L20.5 12L18 10.5V26H6V10.5L3.5 12L3 7Z"
          fill={color}
          stroke="#000"
          strokeWidth="0.2"
        />
      );
    }

    if (productType === "h") {
      return side === "front" ? (
        <>
          {/* Hoodie gövde */}
          <path
            d="M2 7L5 4H9L10 6H14L15 4H19L22 7L21 13L19 11V26H5V11L3 13L2 7Z"
            fill={color}
            stroke="#000"
            strokeWidth="0.2"
          />
          {/* Hafif şeffaf şapka */}
          <path
            d="M7.5 3.5C7.5 5 10.5 6 12 6C13.5 6 16.5 5 16.5 3.5C16.5 2.5 15.2 2 12 2C8.8 2 7.5 2.5 7.5 3.5Z"
            fill={color}
            fillOpacity="0.6"
            stroke="#000"
            strokeWidth="0.1"
          />
        </>
      ) : (
        <>
          {/* Hoodie arka */}
          <path
            d="M2 7L5 4H19L22 7L21.5 12L19 10.5V26H5V10.5L2.5 12L2 7Z"
            fill={color}
            stroke="#000"
            strokeWidth="0.2"
          />
          <path
            d="M7.5 3.5C7.5 5 10.5 6 12 6C13.5 6 16.5 5 16.5 3.5C16.5 2.5 15.2 2 12 2C8.8 2 7.5 2.5 7.5 3.5Z"
            fill={color}
            stroke="#000"
            strokeWidth="0.1"
          />
        </>
      );
    }

    if (productType === "c") {
      return side === "front" ? (
        <path
          d="M4 6L6 4H9L10 5.5H14L15 4H18L20 6L19.5 10L17 8.5V22H7V8.5L4.5 10L4 6Z"
          fill={color}
          stroke="#000"
          strokeWidth="0.2"
        />
      ) : (
        <path
          d="M4 6L6 4H18L20 6L19.5 10L17 8.5V22H7V8.5L4.5 10L4 6Z"
          fill={color}
          stroke="#000"
          strokeWidth="0.2"
        />
      );
    }

    return null;
  };

  return (
    <div className="relative w-[300px] h-[400px]">
      <svg
        viewBox="0 0 300 400"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform="scale(12.5)">{renderSVG()}</g>
      </svg>
      {children}
    </div>
  );
}
