import React from "react";

const ServicesSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-50 py-20">
      {/* ✅ Background Overlay (same style as Hero) */}
      <div className="absolute inset-0 z-0">
        {/* Gradient blobs */}
        <div className="absolute -left-40 top-1/4 w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20"></div>
        <div className="absolute -right-32 bottom-1/3 w-64 h-64 bg-gradient-to-br from-indigo-200 to-pink-200 rounded-full opacity-20"></div>
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/40 to-purple-50/30 backdrop-blur-[2px]"></div>
      </div>

      {/* ✅ Service Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center px-6">
        <h2 className="text-5xl font-bold text-gray-900 mb-8 bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          Our Services
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
          Explore our cutting-edge solutions designed to make workforce
          management effortless and productive.
        </p>

        {/* Service Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "HR Management",
              desc: "Streamline employee data, onboarding, and performance tracking.",
            },
            {
              title: "Productivity Tools",
              desc: "Monitor tasks, projects, and goals with real-time insights.",
            },
            {
              title: "Payroll Integration",
              desc: "Seamless, secure, and accurate salary distribution.",
            },
          ].map((service, i) => (
            <div
              key={i}
              className="relative bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              <h3 className="text-2xl font-semibold text-indigo-700 mb-4">
                {service.title}
              </h3>
              <p className="text-gray-600">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
