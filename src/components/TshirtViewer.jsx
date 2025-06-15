export default function TshirtViewer({ color = "#fff", children }) {
  return (
    <div className="relative w-[300px] h-[400px]">
      <svg
        viewBox="0 0 300 400"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet">
        <g transform="scale(12.5)">
          <path
            d="
              M3 7L6 4H9
              C9 4.4 9.08 4.78 9.23 5.15
              C9.38 5.51 9.6 5.84 9.88 6.12
              C10.16 6.4 10.49 6.62 10.85 6.77
              C11.22 6.92 11.61 7 12 7
              C12.39 7 12.78 6.92 13.15 6.77
              C13.51 6.62 13.84 6.4 14.12 6.12
              C14.4 5.84 14.62 5.51 14.77 5.15
              C14.92 4.78 15 4.4 15 4H18L21 7
              L20.5 12L18 10.5V26
              H6V10.5L3.5 12L3 7Z
            "
            fill={color}
            stroke="#000"
            strokeWidth="0.2"
          />
        </g>
      </svg>
      {children}
    </div>
  );
}
