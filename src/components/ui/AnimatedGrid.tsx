'use client';

export function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-30">
      {/* Vertical lines */}
      <div className="absolute inset-0 animate-grid">
        {[...Array(20)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute h-[200%] w-px bg-gradient-to-b from-transparent via-cyan to-transparent"
            style={{
              left: `${i * 5}%`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* Horizontal lines */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan to-transparent"
            style={{
              top: `${i * 5}%`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      {/* Glowing nodes */}
      {[...Array(10)].map((_, i) => (
        <div
          key={`node-${i}`}
          className="absolute w-2 h-2 bg-cyan rounded-full animate-glow"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}
