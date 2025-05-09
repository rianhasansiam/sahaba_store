import React, { useState } from 'react';
import { Listbox } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const Contact = () => {
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [selectedDescription, setSelectedDescription] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    phone: '',
    message: ''
  });

  const purposes = [
    'General Inquiry',
    'Support',
    'Partnership',
    'Feedback'
  ];

  const descriptions = [
    'Individual',
    'Business',
    'Non-profit',
    'Educational Institution'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log({
      purpose: selectedPurpose,
      description: selectedDescription,
      ...formData
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            If you have any questions, please contact us
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            We'd love to hear from you
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-[#167389]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-lg font-medium text-gray-900">Phone</p>
                  <p className="text-gray-500">+123 45 789 000</p>
                  <p className="text-gray-500">+123 45 789 000</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-[#167389]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-lg font-medium text-gray-900">Email</p>
                  <p className="text-gray-500">Inquiry@atanaxis.ai</p>
                  <p className="text-gray-500">help@atanaxis.ai</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-[#167389]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-lg font-medium text-gray-900">Address</p>
                  <p className="text-gray-500">22th Elementary Street</p>
                  <p className="text-gray-500">New York, NY</p>
                </div>
              </div>
            </div>

            <img className='w-3/5 block mx-auto mt-8' src="https://i.ibb.co.com/kq7c3WH/pic-dp-latest.jpg" alt="Person pic" />
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a message</h2>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Listbox value={selectedPurpose} onChange={setSelectedPurpose}>
                  <Listbox.Label className="block text-sm font-medium text-gray-700">
                    Inquiry Purpose*
                  </Listbox.Label>
                  <div className="mt-1 relative">
                    <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-[#167389] focus:border-[#167389] sm:text-sm">
                      <span className="block truncate">{selectedPurpose || "Choose one option..."}</span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      {purposes.map((purpose) => (
                        <Listbox.Option
                          key={purpose}
                          value={purpose}
                          className={({ active }) =>
                            `${active ? 'text-white bg-[#167389]' : 'text-gray-900'} cursor-default select-none relative py-2 pl-3 pr-9`
                          }
                        >
                          {purpose}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>
              
              <div>
                <Listbox value={selectedDescription} onChange={setSelectedDescription}>
                  <Listbox.Label className="block text-sm font-medium text-gray-700">
                    Description that fits you*
                  </Listbox.Label>
                  <div className="mt-1 relative">
                    <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-[#167389] focus:border-[#167389] sm:text-sm">
                      <span className="block truncate">{selectedDescription || "Choose one option..."}</span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      {descriptions.map((description) => (
                        <Listbox.Option
                          key={description}
                          value={description}
                          className={({ active }) =>
                            `${active ? 'text-white bg-[#167389]' : 'text-gray-900'} cursor-default select-none relative py-2 pl-3 pr-9`
                          }
                        >
                          {description}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name..."
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#167389] focus:border-[#167389]"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address..."
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#167389] focus:border-[#167389]"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
                  Organization
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  placeholder="Enter your organization..."
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#167389] focus:border-[#167389]"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number..."
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#167389] focus:border-[#167389]"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message*
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Enter your message here..."
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#167389] focus:border-[#167389]"
                  required
                ></textarea>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#167389] hover:bg-[#135a6e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#167389] transition-colors duration-200"
                >
                  Submit Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;