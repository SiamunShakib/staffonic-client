import React, { useEffect, useState, useRef } from 'react';
import { FiArrowRight } from 'react-icons/fi';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    
    // Set up the floating particles
    const particlesContainer = document.querySelector('.particles');
    if (particlesContainer) {
      for (let i = 0; i < 40; i++) {
        createParticle(particlesContainer);
      }
    }

    // Set up the canvas animation
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
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
          speedY: Math.random() * 1 - 0.5
        });
      }
      
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw connections
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
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
        
        // Draw points and update positions
        points.forEach(point => {
          ctx.fillStyle = 'rgba(79, 70, 229, 0.6)';
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
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const createParticle = (container) => {
    const particle = document.createElement('div');
    const size = Math.random() * 8 + 2;
    const colors = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'];
    
    particle.className = 'particle';
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
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12 overflow-hidden relative">
      {/* Canvas background animation */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0"></canvas>
      
      {/* Floating particles */}
      <div className="particles absolute inset-0 pointer-events-none z-1"></div>
      
      {/* Geometric shapes with gradients */}
      <div className="absolute -left-40 top-1/4 w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 animate-float-1"></div>
      <div className="absolute -right-32 bottom-1/3 w-64 h-64 bg-gradient-to-br from-indigo-200 to-pink-200 rounded-full opacity-20 animate-float-2"></div>
      
      {/* Main content */}
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Animated Main Heading with special effects */}
        <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <span className="relative block mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-text-shimmer">
              Staffonic
            </span>
          </span>
          <span className="block text-3xl md:text-4xl text-gray-700 font-normal mt-2">
            Workforce Management Reimagined
          </span>
        </h1>
        
        {/* Animated Subheading */}
        <p className={`text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 ease-out delay-150 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          The next generation platform for HR management, productivity tracking, and seamless payroll integration.
        </p>
        
        {/* Special CTA Button with advanced effects */}
        <div className={`transition-all duration-1000 ease-out delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <button className="magic-button group px-8 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold text-lg inline-flex items-center justify-center transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 relative overflow-hidden">
            <span className="relative z-10 flex items-center">
              Join with Staffonic
              <FiArrowRight className="ml-3 transform group-hover:translate-x-2 transition-transform duration-300" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <span className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-10 group-hover:animate-pulse-shine"></span>
          </button>
        </div>
      </div>

      {/* Central animated element */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="relative w-96 h-96">
          {/* Rotating gradient rings */}
          <div className="absolute inset-0 rounded-full border-8 border-blue-200 opacity-30 animate-rotate-slow"></div>
          <div className="absolute inset-8 rounded-full border-8 border-indigo-200 opacity-40 animate-rotate-medium reverse"></div>
          <div className="absolute inset-16 rounded-full border-8 border-purple-200 opacity-50 animate-rotate-fast"></div>
          
          {/* Pulsing center with gradient */}
          <div className="absolute inset-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 animate-pulse-center">
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 animate-ping-slow"></div>
          </div>
        </div>
      </div>

      {/* Add custom animation keyframes */}
      <style>
        {`
          @keyframes rotate-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes rotate-medium {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(-360deg); }
          }
          @keyframes rotate-fast {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(720deg); }
          }
          @keyframes pulse-center {
            0%, 100% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.05); opacity: 0.9; }
          }
          @keyframes text-shimmer {
            0% { background-position: -100% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes pulse-shine {
            0% { left: -100%; }
            100% { left: 100%; }
          }
          @keyframes float-1 {
            0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
            50% { transform: translateY(-20px) rotate(5deg) scale(1.05); }
          }
          @keyframes float-2 {
            0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
            50% { transform: translateY(20px) rotate(-5deg) scale(1.05); }
          }
          @keyframes float-particle {
            0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.7; }
            25% { transform: translateY(-20px) translateX(10px) rotate(5deg); opacity: 0.9; }
            50% { transform: translateY(-35px) translateX(-5px) rotate(10deg); opacity: 0.7; }
            75% { transform: translateY(-15px) translateX(-10px) rotate(5deg); opacity: 0.8; }
          }
          .animate-rotate-slow {
            animation: rotate-slow 25s linear infinite;
          }
          .animate-rotate-medium {
            animation: rotate-medium 20s linear infinite;
          }
          .animate-rotate-fast {
            animation: rotate-fast 15s linear infinite;
          }
          .animate-pulse-center {
            animation: pulse-center 4s ease-in-out infinite;
          }
          .animate-text-shimmer {
            background-size: 200% auto;
            animation: text-shimmer 3s linear infinite;
          }
          .animate-pulse-shine {
            animation: pulse-shine 1.5s ease-in-out;
          }
          .animate-float-1 {
            animation: float-1 8s ease-in-out infinite;
          }
          .animate-float-2 {
            animation: float-2 10s ease-in-out infinite;
          }
          .animate-pulse-slow {
            animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          .animate-ping-slow {
            animation: ping 5s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          .particle {
            position: absolute;
            border-radius: 50%;
            opacity: 0.7;
            animation: float-particle 20s ease-in-out infinite;
          }
          .magic-button:hover {
            box-shadow: 0 0 25px rgba(99, 102, 241, 0.6), 0 0 45px rgba(99, 102, 241, 0.4);
          }
          .reverse {
            animation-direction: reverse;
          }
        `}
      </style>
    </div>
  );
};

export default HeroSection;