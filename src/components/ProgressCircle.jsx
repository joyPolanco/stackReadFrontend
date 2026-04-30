const ProgressCircle = ({ progress }) => {
  const size = 90;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative">
      <svg width={size} height={size}>
        {/* Fondo */}
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progreso */}
        <circle
          stroke="#059669"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />
      </svg>

      {/* Texto */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-gray-800">
          {progress}%
        </span>
      </div>
    </div>
  );
};

export default ProgressCircle