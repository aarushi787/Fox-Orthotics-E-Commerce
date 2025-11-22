import React from 'react';
import { MailIcon, PhoneIcon, LocationMarkerIcon, CertificateIcon, ShieldCheckIcon } from './icons';
import { CATEGORIES } from '../constants';

const slugify = (text: string) => text.toLowerCase().replace(/ & /g, '-and-').replace(/\s+/g, '-');

const Footer: React.FC = () => {
    return (
        <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white mt-16">
             {/* Trust Badges */}
            <div className="bg-gray-800/50">
                <div className="container mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div className="flex items-center justify-center gap-3 text-sm text-gray-300">
                        <CertificateIcon className="w-7 h-7 text-yellow-400"/>
                        <span className="font-semibold">ISO 13485 Certified</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-sm text-gray-300">
                         <ShieldCheckIcon className="w-7 h-7 text-yellow-400"/>
                        <span className="font-semibold">FDA Approved Products</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-sm text-gray-300">
                        <div className="font-bold text-xl text-yellow-400 border-2 border-yellow-400 rounded-full w-8 h-8 flex items-center justify-center">CE</div>
                        <span className="font-semibold">CE Marked Quality</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-sm text-gray-300">
                        <span className="text-2xl font-bold text-yellow-400">10+</span>
                        <span className="font-semibold">Years of Industry Leadership</span>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* About Section */}
                    <div>
                         <a href="#/" className="flex items-center gap-2 mb-4">
                            <div className="bg-white p-1.5 rounded-full">
                               <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>
                            </div>
                            <h3 className="text-xl font-bold">Fox Orthotics</h3>
                        </a>
                        <p className="text-gray-400 text-sm mb-4">
                            Your trusted partner for premium orthopedic solutions, dedicated to enhancing mobility and comfort.
                        </p>
                         <div className="flex items-center gap-4 mt-4">
                            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-transform hover:scale-110"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.35C0 23.41.59 24 1.325 24H12.82v-9.29H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.735 0 1.325-.59 1.325-1.325V1.325C24 .59 23.41 0 22.675 0z" /></svg></a>
                            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-transform hover:scale-110"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.223.085c.645 1.956 2.51 3.375 4.73 3.415A9.87 9.87 0 010 19.53a13.9 13.9 0 007.548 2.212c9.058 0 14.01-7.502 14.01-14.013 0-.213-.005-.426-.015-.637a9.954 9.954 0 002.433-2.525z" /></svg></a>
                            <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-transform hover:scale-110"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.25V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 110-4.125 2.062 2.062 0 010 4.125zm1.775 13.019H3.562V9h3.55v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" /></svg></a>
                        </div>
                    </div>
                    
                    {/* Categories */}
                     <div>
                        <h3 className="text-lg font-semibold mb-4 border-l-4 border-yellow-400 pl-3">Top Categories</h3>
                        <ul className="space-y-2 text-sm">
                            {CATEGORIES.slice(0, 5).map(cat => (
                                <li key={cat.name}><a href={`#/category/${slugify(cat.name)}`} className="text-gray-400 hover:text-white transition-transform inline-block hover:translate-x-1">{cat.name}</a></li>
                            ))}
                             <li><a href={`#/`} className="text-gray-400 hover:text-white transition-transform inline-block hover:translate-x-1">... and more</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 border-l-4 border-yellow-400 pl-3">Contact Us</h3>
                        <ul className="space-y-3 text-sm">
                           <li className="flex items-start gap-3">
                                <LocationMarkerIcon className="w-5 h-5 mt-0.5 text-gray-400 flex-shrink-0"/>
                                <span className="text-gray-400">123 Ortho Lane, Medical District, New Delhi, India - 110001</span>
                            </li>
                             <li className="flex items-center gap-3">
                                <PhoneIcon className="w-5 h-5 text-gray-400"/>
                                <a href="tel:+919876543210" className="text-gray-400 hover:text-white">+91 98765 43210</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <MailIcon className="w-5 h-5 text-gray-400"/>
                                <a href="mailto:sales@foxorthotics.com" className="text-gray-400 hover:text-white">sales@foxorthotics.com</a>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Links & Payment */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 border-l-4 border-yellow-400 pl-3">Company</h3>
                         <ul className="space-y-2 text-sm">
                            <li><a href="#/about" className="text-gray-400 hover:text-white transition-transform inline-block hover:translate-x-1">About Us</a></li>
                            <li><a href="#/contact" className="text-gray-400 hover:text-white transition-transform inline-block hover:translate-x-1">Contact Us</a></li>
                            <li><a href="#/dealer" className="text-gray-400 hover:text-white transition-transform inline-block hover:translate-x-1">Become a Dealer</a></li>
                        </ul>
                        <h3 className="text-lg font-semibold mt-6 mb-4 border-l-4 border-yellow-400 pl-3">We Accept</h3>
                        <p className="text-gray-400 text-sm">Credit Card, Debit Card, Bank Transfer, UPI</p>
                    </div>
                </div>
            </div>
            <div className="bg-black/20 py-4">
                <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-center text-sm text-gray-400">
                    <span>&copy; {new Date().getFullYear()} Fox Orthotics Industries. All Rights Reserved.</span>
                     <div className="flex gap-4 mt-2 sm:mt-0">
                        <a href="#" className="hover:text-white">Privacy Policy</a>
                        <a href="#" className="hover:text-white">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
