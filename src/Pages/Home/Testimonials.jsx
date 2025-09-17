import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ayesha Rahman",
    role: "Employee",
    feedback:
      "Submitting my daily work and tracking salary is super easy. The dashboard keeps me productive every day.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "Tanvir Ahmed",
    role: "HR",
    feedback:
      "Verifying employees, paying salaries, and monitoring progress feels smooth and effortless. Great management system!",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Sarah Khan",
    role: "Admin",
    feedback:
      "Controlling payroll and managing roles is seamless. I love the clean UI and real-time updates.",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
  },
  {
    name: "Rafiq Hasan",
    role: "Employee",
    feedback:
      "The worksheet and payment history features are a lifesaver. Everything is transparent and easy to track.",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
];

const TestimonialSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-200 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full translate-x-1/3 translate-y-1/3 opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-4">
            Voices of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Satisfaction</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover what our users have to say about their experience with our platform.
          </p>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[EffectCoverflow, Autoplay]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={3}
          loop={true}
          speed={1000}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          coverflowEffect={{
            rotate: 0,
            stretch: -60,
            depth: 200,
            modifier: 1,
            slideShadows: false,
          }}
          className="testimonial-swiper"
          breakpoints={{
            320: {
              slidesPerView: 1,
              coverflowEffect: {
                stretch: 0,
                depth: 100,
              }
            },
            768: {
              slidesPerView: 3,
              coverflowEffect: {
                stretch: -60,
                depth: 200,
              }
            }
          }}
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="relative bg-white rounded-2xl p-8 transition-all duration-500 mx-auto shadow-xl border border-gray-100 flex flex-col h-full">
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-3 rounded-full shadow-lg">
                  <Quote size={24} />
                </div>
                <div className="flex flex-col items-center mt-4">
                  <div className="relative mb-6">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {t.role}
                    </div>
                  </div>
                  <h3 className="font-bold text-xl text-gray-800">
                    {t.name}
                  </h3>
                </div>
                <div className="mt-6 flex-grow flex items-center">
                  <p className="text-gray-600 text-md leading-relaxed italic">
                    "{t.feedback}"
                  </p>
                </div>
                <div className="mt-8 flex justify-center">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Custom Styles */}
      <style>{`
        .testimonial-swiper .swiper-slide {
          transform: scale(0.85);
          filter: blur(8px);
          opacity: 0.7;
          transition: all 0.5s ease;
        }
        .testimonial-swiper .swiper-slide-active {
          transform: scale(1) !important;
          filter: blur(0) !important;
          opacity: 1 !important;
          z-index: 10;
        }
        .testimonial-swiper .swiper-slide-prev,
        .testimonial-swiper .swiper-slide-next {
          transform: scale(0.9);
          filter: blur(4px);
          opacity: 0.8;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .testimonial-swiper .swiper-slide {
            transform: scale(1);
            filter: blur(0);
            opacity: 0.5;
          }
          .testimonial-swiper .swiper-slide-active {
            transform: scale(1) !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </section>
  );
};

export default TestimonialSection;