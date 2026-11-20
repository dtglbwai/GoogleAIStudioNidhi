
import React, { useState } from 'react';

const ContactCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="bg-gray-50 rounded-lg p-6 flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-primary-light text-primary rounded-full flex items-center justify-center">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <div className="text-sm text-gray-600 mt-1 space-y-1">
                {children}
            </div>
        </div>
    </div>
);

const SalesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const SupportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9 12l.01 0M12 9l.01 0M15 12l.01 0M12 15l.01 0M5.636 5.636l3.536 3.536m5.656 0l3.536-3.536m-5.656 5.656l-3.536 3.536" /></svg>;
const OfficeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;

const ContactUs: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000); // Reset after 5 seconds
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h2>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                <div className="lg:col-span-3">
                    <div className="bg-white p-8 rounded-xl shadow-md">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">Get in Touch</h3>
                        <p className="text-gray-500 mb-6">We'd love to hear from you. Please fill out this form.</p>
                        {submitted ? (
                            <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center">
                                <h4 className="font-bold">Thank you!</h4>
                                <p>Your message has been sent successfully. We will get back to you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                        <input type="text" id="name" required className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                        <input type="email" id="email" required className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                                    </div>
                                </div>
                                 <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                    <input type="tel" id="phone" className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                                    <select id="subject" required className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white">
                                        <option>Sales Inquiry</option>
                                        <option>Technical Support</option>
                                        <option>General Question</option>
                                        <option>Partnership</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                    <textarea id="message" rows={5} required className="mt-1 w-full p-2 border border-gray-300 rounded-md"></textarea>
                                </div>
                                <div>
                                    <button type="submit" className="w-full py-3 px-4 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-colors">
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <ContactCard title="Sales Inquiries" icon={<SalesIcon />}>
                        <p>For questions about features, trials, and pricing.</p>
                        <a href="mailto:sales@ifincaplen.com" className="text-primary font-semibold hover:underline">sales@ifincaplen.com</a>
                    </ContactCard>
                    <ContactCard title="Technical Support" icon={<SupportIcon />}>
                        <p>Get help with technical issues or report a bug.</p>
                        <a href="mailto:support@ifincaplen.com" className="text-primary font-semibold hover:underline">support@ifincaplen.com</a>
                    </ContactCard>
                    <ContactCard title="Head Office" icon={<OfficeIcon />}>
                        <p>123 Tech Park, Koramangala,<br />Bangalore, Karnataka 560034</p>
                        <p>(+91) 80 1234 5678</p>
                    </ContactCard>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
