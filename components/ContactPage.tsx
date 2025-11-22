import React from 'react';
import { PhoneIcon, MailIcon, LocationMarkerIcon } from './icons';

const ContactPage: React.FC = () => {
  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">Get In Touch</h1>
          <p className="mt-4 text-lg text-gray-600">
            We'd love to hear from you. Whether you have a question about our products, pricing, or anything else, our team is ready to answer all your questions.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-slate-50 p-8 rounded-lg border">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form action="#" method="POST" className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="name" id="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent"/>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" name="email" id="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent"/>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea id="message" name="message" rows={4} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent"></textarea>
              </div>
              <div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
                  Send Message
                </button>
              </div>
            </form>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact Information</h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-center gap-3">
                    <MailIcon className="w-6 h-6 text-brand-blue"/>
                    <a href="mailto:sales@foxorthotics.com" className="hover:text-brand-blue">sales@foxorthotics.com</a>
                </li>
                 <li className="flex items-center gap-3">
                    <PhoneIcon className="w-6 h-6 text-brand-blue"/>
                    <a href="tel:+919876543210" className="hover:text-brand-blue">+91 98765 43210</a>
                </li>
                <li className="flex items-start gap-3">
                    <LocationMarkerIcon className="w-6 h-6 text-brand-blue flex-shrink-0 mt-1"/>
                    <span>123 Ortho Lane, Medical District, New Delhi, India - 110001</span>
                </li>
              </ul>
            </div>
            
             <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Location</h3>
                 <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border">
                     {/* Placeholder for Google Map */}
                    <div className="bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500">Map loading...</p>
                    </div>
                 </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
