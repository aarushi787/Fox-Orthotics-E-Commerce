import React from 'react';
import { UsersIcon, ShieldCheckIcon, CertificateIcon } from './icons';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-brand-blue-dark text-white text-center py-24">
        <div 
            className="absolute inset-0 bg-cover bg-center opacity-10" 
            style={{backgroundImage: "url('https://images.unsplash.com/photo-1580281657527-38f4497136d6?q=80&w=2940&auto=format&fit=crop')"}}>
        </div>
        <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">About Fox Orthotics Industries</h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
                Your trusted partner in premium orthopedic solutions, dedicated to enhancing mobility and comfort since 2010.
            </p>
        </div>
      </div>
      
      {/* Our Mission Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm font-bold uppercase text-brand-accent">Our Mission</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">Empowering Movement, Enhancing Lives</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              At Fox Orthotics, our mission is to develop and provide high-quality, innovative orthopedic products that empower individuals to live healthier, more active lives. We believe that everyone deserves to move without pain and limitation.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We are committed to continuous research and development, working closely with healthcare professionals to create solutions that are not only effective but also comfortable and easy to use. Our focus is on patient outcomes and customer satisfaction.
            </p>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1516942459795-f54249358151?q=80&w=2864&auto=format&fit=crop"
              alt="Healthcare professional assisting a patient" 
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
      
      {/* Core Values Section */}
      <div className="bg-slate-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md border">
              <div className="bg-brand-accent-light text-brand-accent rounded-full p-3 inline-block mb-4">
                <CertificateIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality & Excellence</h3>
              <p className="text-gray-600">
                We adhere to the highest standards of quality, certified by ISO 13485, ensuring every product is safe, reliable, and effective.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md border">
              <div className="bg-brand-accent-light text-brand-accent rounded-full p-3 inline-block mb-4">
                <UsersIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer-Centric</h3>
              <p className="text-gray-600">
                Our customers are at the heart of everything we do. We strive to exceed their expectations through exceptional service and support.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md border">
              <div className="bg-brand-accent-light text-brand-accent rounded-full p-3 inline-block mb-4">
                <ShieldCheckIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Integrity & Trust</h3>
              <p className="text-gray-600">
                We conduct our business with unwavering integrity, building lasting relationships with our partners and customers based on trust and transparency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
