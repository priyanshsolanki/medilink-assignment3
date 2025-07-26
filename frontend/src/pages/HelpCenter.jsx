import React, { useState } from "react";
import Sidebar from "../components/Patientsidebar";
import {
  Search,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  ChevronRight,
  BookOpen,
  Video,
  Shield,
  CreditCard,
  User,
  Calendar,
} from "lucide-react";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Topics", icon: BookOpen },
    { id: "appointments", name: "Appointments", icon: Calendar },
    { id: "account", name: "Account & Profile", icon: User },
    { id: "billing", name: "Billing & Insurance", icon: CreditCard },
    { id: "privacy", name: "Privacy & Security", icon: Shield },
    { id: "technical", name: "Technical Support", icon: Video },
  ];

  const faqs = [
    {
      id: 1,
      category: "appointments",
      question: "How do I schedule a video consultation?",
      answer:
        'You can schedule a video consultation by clicking "Book Appointment" and selecting your preferred doctor and time slot.',
    },
    {
      id: 2,
      category: "appointments",
      question: "Can I reschedule my appointment?",
      answer:
        "Yes, you can reschedule appointments up to 2 hours before the scheduled time through your appointments page.",
    },
    {
      id: 3,
      category: "technical",
      question: "What do I need for a video consultation?",
      answer:
        "You need a device with a camera and microphone, stable internet connection, and a modern web browser.",
    },
    {
      id: 4,
      category: "account",
      question: "How do I update my personal information?",
      answer:
        'Go to "My Profile" in the sidebar to update your personal information, contact details, and emergency contacts.',
    },
    {
      id: 5,
      category: "billing",
      question: "How do I view my billing information?",
      answer:
        "Billing information can be accessed through your account settings or by contacting our billing department.",
    },
    {
      id: 6,
      category: "privacy",
      question: "How is my medical data protected?",
      answer:
        "We use industry-standard encryption and comply with HIPAA regulations to protect your medical information.",
    },
  ];

  const contactOptions = [
    {
      title: "Live Chat",
      description: "Chat with our support team",
      icon: MessageCircle,
      action: "Start Chat",
      available: "Available 24/7",
    },
    {
      title: "Phone Support",
      description: "Call us for immediate assistance",
      icon: Phone,
      action: "Call Now",
      available: "Mon-Fri 8AM-8PM",
    },
    {
      title: "Email Support",
      description: "Send us a detailed message",
      icon: Mail,
      action: "Send Email",
      available: "Response within 24 hours",
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Help Center</h1>
          <p className="text-gray-600">
            Find answers to common questions and get support
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-left ${
                        selectedCategory === category.id
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mr-3" />
                      <span className="text-sm">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Contact Options */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Need More Help?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {contactOptions.map((option, index) => {
                  const IconComponent = option.icon;
                  return (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center mb-3">
                        <div className="p-2 bg-blue-50 rounded-lg mr-3">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-medium text-gray-900">
                          {option.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {option.description}
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        {option.available}
                      </p>
                      <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                        {option.action}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Frequently Asked Questions
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredFaqs.length} questions found
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 mb-2">
                            {faq.question}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your search terms or browse different
                      categories.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Links
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="#"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <BookOpen className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">User Guide</h3>
                    <p className="text-sm text-gray-600">
                      Complete platform tutorial
                    </p>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <Shield className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Privacy Policy
                    </h3>
                    <p className="text-sm text-gray-600">
                      How we protect your data
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
