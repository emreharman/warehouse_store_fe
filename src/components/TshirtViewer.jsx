export default function TshirtViewer({ color = "#fff", children }) {
    return (
      <div className="relative w-[300px] h-[400px]">
        <svg
          viewBox="0 0 300 400"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M50,50 L250,50 L270,100 L230,120 L230,350 L70,350 L70,120 L30,100 Z"
            fill={color}
            stroke="#333"
            strokeWidth={2}
          />
        </svg>
  
        {children}
      </div>
    );
  }
  