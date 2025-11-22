import React from 'react';
import { ShieldCheckIcon, TruckIcon, UsersIcon } from './icons';

const DealerPage: React.FC = () => {
  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">Become a Fox Orthotics Dealer</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Partner with a leading name in orthopedic solutions and bring high-quality, trusted products to your customers. Join our network of successful dealers today.
          </p>
        </div>

        <div className="mt-16 bg-slate-50 p-8 rounded-lg border grid md:grid-cols-2 gap-12">
          {/* Why Partner With Us Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefits of Partnership</h2>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="bg-brand-accent-light text-brand-accent rounded-full p-2 mt-1">
                    <ShieldCheckIcon className="w-6 h-6"/>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Premium Product Line</h3>
                  <p className="text-gray-600 text-sm">Access to our complete catalog of ISO-certified, high-demand orthopedic products.</p>
                </div>
              </li>
               <li className="flex items-start gap-4">
                 <div className="bg-brand-accent-light text-brand-accent rounded-full p-2 mt-1">
                    <TruckIcon className="w-6 h-6"/>
                 </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Competitive Pricing & Bulk Discounts</h3>
                  <p className="text-gray-600 text-sm">Enjoy exclusive dealer pricing and attractive margins on bulk orders.</p>
                </div>
              </li>
               <li className="flex items-start gap-4">
                 <div className="bg-brand-accent-light text-brand-accent rounded-full p-2 mt-1">
                    <UsersIcon className="w-6 h-6"/>
                 </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Dedicated Support</h3>
                  <p className="text-gray-600 text-sm">A dedicated account manager and marketing support to help you grow your business.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Dealer Application Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dealer Application Form</h2>
            <form action="#" method="POST" className="space-y-4">
              <div>
                <label htmlFor="company-name" className="block text-sm font-medium text-gray-700">Company Name</label>
                <input type="text" name="company-name" id="company-name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent"/>
              </div>
              <div>
                <label htmlFor="contact-person" className="block text-sm font-medium text-gray-700">Contact Person</label>
                <input type="text" name="contact-person" id="contact-person" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent"/>
              </div>
               <div>
                <label htmlFor="dealer-email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" name="dealer-email" id="dealer-email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent"/>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" name="phone" id="phone" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent"/>
              </div>
              <div>
                <label htmlFor="comments" className="block text-sm font-medium text-gray-700">Comments / Questions</label>
                <textarea id="comments" name="comments" rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent"></textarea>
              </div>
              <div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerPage;
