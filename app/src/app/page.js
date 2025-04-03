'use client';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { BarChart3, FileText, Lock, MapPin, Mail, Phone, CheckCircle, Menu, X } from "lucide-react";
import { useCountAnimation } from '../hooks/useCountAnimation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const stats = [
    { number: "10000", label: "Active Users", prefix: "" },
    { number: "2", label: "Assets Tracked", prefix: "$" },
    { number: "99.9", label: "Uptime", suffix: "%" }
  ];

  return (
    <div className="min-h-screen bg-black font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-black/90 border-b border-white/5 animate-slide-down">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-white">QFS Ledger</div>
            <div className="flex items-center gap-8">
              <div className="hidden md:flex gap-6">
                <a href="#features" className="text-gray-200 hover:text-white">Features</a>
                <a href="#pricing" className="text-gray-200 hover:text-white">Pricing</a>
                <a href="/mission" className="text-gray-200 hover:text-white">Mission</a>
                <a href="#contact" className="text-gray-200 hover:text-white">Contact</a>
              </div>
              <div className="hidden md:flex gap-4">
                <button onClick={() => router.push('/login')} className="px-4 py-2 text-sm rounded-full text-white hover:bg-white/10 transition-colors">
                  Sign In
                </button>
                <button onClick={() => router.push('/signup')} className="px-4 py-2 text-sm rounded-full bg-white text-black hover:bg-gray-200 transition-colors">
                  Sign Up
                </button>
              </div>
              <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="text-white w-6 h-6" /> : <Menu className="text-white w-6 h-6" />}
              </button>
            </div>
          </div>
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pt-4 pb-2">
              <div className="flex flex-col gap-4">
                <a href="#features" className="text-gray-200 hover:text-white py-2">Features</a>
                <a href="#pricing" className="text-gray-200 hover:text-white py-2">Pricing</a>
                <a href="/mission" className="text-gray-200 hover:text-white py-2">Mission</a>
                <a href="#contact" className="text-gray-200 hover:text-white py-2">Contact</a>
                <button onClick={() => router.push('/login')} className="py-2 text-left text-gray-200 hover:text-white">
                  Sign In
                </button>
                <button onClick={() => router.push('/signup')} className="py-2 text-left text-gray-200 hover:text-white">
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 animate-fade-in" style={{ "--delay": "300ms" }}>
            <h1 className="text-6xl font-bold mb-8 text-white">
              The Future of
              <span className="block mt-2 text-white">
                Digital Management
              </span>
            </h1>
            <p className="text-gray-300 mb-8 text-lg">
              Advanced ledger system for cryptocurrency traders. Track transactions,
              monitor performance, and generate tax reports with ease.
            </p>
            <div className="flex gap-4">
              <button onClick={() => router.push('/signup')} className="px-8 py-3 rounded-full bg-white text-black hover:bg-gray-200 transition-colors">
                Get Started
              </button>
              <button onClick={() => router.push('/secure-wallet')} className="px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors">
               Secure Now
              </button>
            </div>
          </div>
          
          <div className="md:w-1/2 mt-12 md:mt-0 animate-fade-in" style={{ "--delay": "500ms" }}>
            <div className="relative bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="h-8 w-20 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 w-16 bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-24 bg-black border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8 text-white">About QFS Ledger</h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Founded in 2024, QFS Ledger has become the go-to platform for financial portfolio management. We combine cutting-edge technology with intuitive design to provide the most comprehensive tracking solution.
              </p>
              <div className="space-y-4">
                {[
                  "Industry-leading security protocols",
                  "24/7 Expert support",
                  "Regular platform updates",
                  "Community-driven development"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <p className="text-gray-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-xl bg-white/5 p-8 border border-white/10">
                <div className="grid grid-cols-2 gap-4 h-full">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-4">
                      <div className="h-full w-full bg-gray-700 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-24 border-t border-white/5" id="features">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Real-time Tracking",
              desc: "Monitor your crypto assets across multiple wallets in real-time",
              icon: BarChart3
            },
            {
              title: "Tax Reports",
              desc: "Generate comprehensive tax reports for your crypto transactions",
              icon: FileText
            },
            {
              title: "Security First",
              desc: "Bank-grade encryption and security for your sensitive data",
              icon: Lock
            }
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 animate-fade-up"
              style={{ "--delay": `${i * 100 + 200}ms` }}
            >
              <feature.icon className="w-8 h-8 mb-4 text-white" strokeWidth={1.5} />
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="container mx-auto px-6 py-24 border-t border-white/5" id="pricing">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-white">Why Choose Us</h2>
          <p className="text-xl text-gray-400 leading-relaxed mb-12">
            Experience the next generation of cryptocurrency management with our cutting-edge platform. We provide the tools you need to succeed in the digital asset space.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Advanced Security",
                description: "Military-grade encryption and multi-layer security protocols"
              },
              {
                title: "Seamless Integration",
                description: "Connect with multiple wallets and exchanges effortlessly"
              },
              {
                title: "24/7 Support",
                description: "Round-the-clock expert assistance for all your needs"
              }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-24 bg-white border-t border-gray-100 animate-fade-in" id="contact">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-bold text-black mb-8">Get in Touch</h2>
              <p className="text-gray-600 mb-8">
                Have questions about our platform? We're here to help. Contact our team for dedicated support and solutions.
              </p>
              <div className="space-y-6">
                {[
                  { icon: MapPin, title: "Location", desc: "New York, NY 10012" },
                  { icon: Mail, title: "Email", desc: "support@cryptoledger.com" },
                  { icon: Phone, title: "Phone", desc: "+1 (555) 000-0000" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <item.icon className="w-6 h-6 text-black" strokeWidth={1.5} />
                    <div>
                      <h3 className="font-semibold text-black">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Name"
                  className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <textarea
                placeholder="Message"
                rows={4}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <button className="w-full py-3 rounded-full bg-black text-white hover:bg-gray-900 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-white/5">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">QFS Ledger</h4>
              <p className="text-gray-400">Advanced financial portfolio tracking and management system.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 text-center text-gray-400">
            © 2024 QFS Ledger. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
