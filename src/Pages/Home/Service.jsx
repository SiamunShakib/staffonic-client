import React, { useEffect, useState, useRef } from "react";

const ServicesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);

    // Floating particles
    const particlesContainer = document.querySelector(".particles-services");
    if (particlesContainer) {
      for (let i = 0; i < 30; i++) {
        createParticle(particlesContainer);
      }
    }

    // Canvas background
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      let points = [];
      const numPoints = 8;

      for (let i = 0; i < numPoints; i++) {
        points.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: Math.random() * 1 - 0.5,
          speedY: Math.random() * 1 - 0.5,
        });
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Connections
        ctx.strokeStyle = "rgba(99, 102, 241, 0.1)";
        ctx.lineWidth = 1;

        for (let i = 0; i < points.length; i++) {
          for (let j = i + 1; j < points.length; j++) {
            const dx = points[i].x - points[j].x;
            const dy = points[i].y - points[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 200) {
              ctx.beginPath();
              ctx.moveTo(points[i].x, points[i].y);
              ctx.lineTo(points[j].x, points[j].y);
              ctx.stroke();
            }
          }
        }

        // Draw points
        points.forEach((point) => {
          ctx.fillStyle = "rgba(79, 70, 229, 0.6)";
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
          ctx.fill();

          point.x += point.speedX;
          point.y += point.speedY;

          if (point.x < 0 || point.x > canvas.width) point.speedX *= -1;
          if (point.y < 0 || point.y > canvas.height) point.speedY *= -1;
        });

        requestAnimationFrame(animate);
      };

      animate();

      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const createParticle = (container) => {
    const particle = document.createElement("div");
    const size = Math.random() * 8 + 2;
    const colors = ["#3b82f6", "#6366f1", "#8b5cf6", "#ec4899"];

    particle.className = "particle";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
    particle.style.animationDelay = `${Math.random() * 5}s`;

    container.appendChild(particle);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50 flex items-center justify-center px-6 py-20 overflow-hidden relative">
      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0"></canvas>

      {/* Floating particles */}
      <div className="particles-services absolute inset-0 pointer-events-none z-1"></div>

      {/* Gradient shapes */}
      <div className="absolute -left-40 top-1/4 w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 animate-float-1"></div>
      <div className="absolute -right-32 bottom-1/3 w-64 h-64 bg-gradient-to-br from-indigo-200 to-pink-200 rounded-full opacity-20 animate-float-2"></div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Heading */}
        <h2
          className={`text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-text-shimmer transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          Our Services
        </h2>
        <p
          className={`text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto transition-all duration-1000 delay-150 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          Explore our cutting-edge solutions designed to make workforce management effortless and productive.
        </p>

        {/* Service Cards */}
        <div className="grid gap-8 md:grid-cols-3 relative z-10">
          {[
            { title: "HR Management", desc: "Streamline employee data, onboarding, and performance tracking." },
            { title: "Productivity Tools", desc: "Monitor tasks, projects, and goals with real-time insights." },
            { title: "Payroll Integration", desc: "Seamless, secure, and accurate salary distribution." },
          ].map((service, i) => (
            <div
              key={i}
              className="relative bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              <h3 className="text-2xl font-semibold text-indigo-700 mb-4">{service.title}</h3>
              <p className="text-gray-600">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes float-1 {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-20px) scale(1.05); }
          }
          @keyframes float-2 {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(20px) scale(1.05); }
          }
          @keyframes text-shimmer {
            0% { background-position: -100% 0; }
            100% { background-position: 200% 0; }
          }
          .animate-float-1 { animation: float-1 8s ease-in-out infinite; }
          .animate-float-2 { animation: float-2 10s ease-in-out infinite; }
          .animate-text-shimmer {
            background-size: 200% auto;
            animation: text-shimmer 3s linear infinite;
          }
          .particle {
            position: absolute;
            border-radius: 50%;
            opacity: 0.7;
          }
        `}
      </style>
    </div>
  );
};

export default ServicesSection;
