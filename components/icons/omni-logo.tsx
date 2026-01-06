"use client"

export function OmniLogo({ className = "", color = "bg-[#C75C2E]" }: { className?: string; color?: string }) {
  // 12 dots for the outer ring
  const dots = Array.from({ length: 12 })

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: "112px", height: "112px" }}
    >
      {/* Outer Ring - Spinning Slowly */}
      <div className="absolute inset-0 animate-[spin_12s_linear_infinite]">
        {dots.map((_, i) => {
          const angle = (i * 360) / 12
          const radius = 38
          const x = Math.cos((angle * Math.PI) / 180) * radius
          const y = Math.sin((angle * Math.PI) / 180) * radius

          return (
            <div
              key={i}
              className={`absolute w-[13px] h-[13px] ${color}`}
              style={{
                left: "50%",
                top: "50%",
                borderRadius: "35%",
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle}deg)`,
              }}
            />
          )
        })}
      </div>

      {/* Inner Eyes - Complex AI Animation */}
      <div className="absolute flex gap-[16px] z-10" style={{ marginTop: "-2px" }}>
        <div className="relative">
          <div className={`w-[13px] h-[13px] ${color} animate-eye-movement`} style={{ borderRadius: "35%" }} />
          <div className="absolute inset-0 bg-[#FFFDF8] animate-blink" style={{ zIndex: 20 }} />
        </div>
        <div className="relative">
          <div className={`w-[13px] h-[13px] ${color} animate-eye-movement`} style={{ borderRadius: "35%" }} />
          <div className="absolute inset-0 bg-[#FFFDF8] animate-blink" style={{ zIndex: 20 }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes eye-movement {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(0, 0); }
          15% { transform: translate(3px, 0); }
          35% { transform: translate(3px, 0); }
          40% { transform: translate(-3px, 0); }
          60% { transform: translate(-3px, 0); }
          65% { transform: translate(0, -2px); }
          85% { transform: translate(0, -2px); }
          90% { transform: translate(0, 0); }
        }
        @keyframes blink {
          0%, 48%, 52%, 100% { height: 0; top: 50%; }
          50% { height: 100%; top: 0; }
        }
        .animate-eye-movement {
          animation: eye-movement 4s ease-in-out infinite;
        }
        .animate-blink {
          animation: blink 5s linear infinite;
        }
      `}</style>
    </div>
  )
}
