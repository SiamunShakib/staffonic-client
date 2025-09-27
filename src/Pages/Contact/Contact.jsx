import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaUsers, FaShieldAlt } from "react-icons/fa";

const Contact = () => {
  const contactCards = [
    {
      icon: FaPhone,
      title: "Call Us",
      details: ["+1 (555) 123-4567", "+1 (555) 123-4568"],
      description: "Mon-Fri: 9:00 AM - 6:00 PM",
      color: "bg-blue-50 text-blue-600",
      borderColor: "border-blue-200"
    },
    {
      icon: FaEnvelope,
      title: "Email Us",
      details: ["support@hrportal.com", "careers@hrportal.com"],
      description: "Response within 2 hours",
      color: "bg-green-50 text-green-600",
      borderColor: "border-green-200"
    },
    {
      icon: FaMapMarkerAlt,
      title: "Visit Us",
      details: ["123 Business Plaza", "Suite 400", "New York, NY 10001"],
      description: "Headquarters Location",
      color: "bg-purple-50 text-purple-600",
      borderColor: "border-purple-200"
    },
    {
      icon: FaClock,
      title: "Office Hours",
      details: ["Monday - Friday: 9AM-6PM", "Saturday: 10AM-4PM", "Sunday: Closed"],
      description: "Eastern Time Zone",
      color: "bg-orange-50 text-orange-600",
      borderColor: "border-orange-200"
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-12">
      <div className="container max-w-7xl px-3 md:px-5 mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Get in <span className="text-blue-600">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Reach out to our HR team. We're here to support your workforce management needs.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactCards.map((card, index) => (
            <div 
              key={index}
              className={`bg-white rounded-2xl p-6 border-2 ${card.borderColor} hover:shadow-lg transition-all duration-300`}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${card.color} mb-4`}>
                <card.icon className="text-xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{card.title}</h3>
              <div className="space-y-1 mb-3">
                {card.details.map((detail, i) => (
                  <p key={i} className="text-gray-700 text-sm">{detail}</p>
                ))}
              </div>
              <p className="text-xs text-gray-500">{card.description}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <FaMapMarkerAlt className="text-red-500 text-xl" />
                <h2 className="text-xl font-bold text-gray-900">Our Location</h2>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden mb-4">
                <iframe
                  title="HR Solutions Office"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.9503398796587!2d-74.00594948459418!3d40.71272807932785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a1e1c2e0b0f%3A0x5d0e6a9c1a0a0a0a!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbd!4v1678901234567!5m2!1sen!2sbd"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="space-y-1 text-gray-700 text-sm">
                <p className="font-semibold">HR Solutions Headquarters</p>
                <p>123 Business Plaza, Suite 400</p>
                <p>New York, NY 10001</p>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
              <div className="flex items-center gap-3 mb-3">
                <FaShieldAlt className="text-red-600 text-xl" />
                <h3 className="text-lg font-bold text-gray-900">Emergency Contact</h3>
              </div>
              <p className="text-gray-700 text-sm mb-3">
                For urgent HR matters outside business hours:
              </p>
              <div className="bg-white rounded-lg p-3 border border-red-200">
                <p className="text-red-600 font-bold text-lg">+1 (555) 911-HR00</p>
                <p className="text-xs text-gray-600">Available 24/7 for critical issues</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 p-4 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-600 text-sm">
            Professional HR Support • Fast Response Times • Confidential & Secure
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;