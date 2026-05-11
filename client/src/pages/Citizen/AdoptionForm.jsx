import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout';

export default function AdoptionForm() {
  const { petName } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  if (isSubmitted) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="bg-[#DED9C4] p-16 rounded-sm border-2 border-black text-center max-w-lg">
            <div className="text-7xl mb-6 text-green-600">✔</div>
            <h2 className="text-3xl font-bold text-[#6A1B9A] mb-4 uppercase tracking-tighter">Application Submitted!</h2>
            <p className="text-[#C2185B] mb-10 font-bold leading-relaxed">Thank you for offering a loving home. <br /> A registered NGO in your area has been notified and will review your application shortly.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button onClick={() => navigate('/')} className="bg-[#C2185B] text-white px-8 py-3 border-2 border-black font-bold hover:-translate-y-0.5 active:translate-y-0 transition-all uppercase tracking-widest text-xs">Return Home</button>
              <button onClick={() => navigate('/')} className="bg-white text-black px-8 py-3 border-2 border-black font-bold hover:-translate-y-0.5 active:translate-y-0 transition-all uppercase tracking-widest text-xs">Adopt Another</button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#EDEFD7] p-8 rounded-sm border-2 border-black text-center max-w-sm">
            <div className="text-orange-500 text-5xl mb-4">⚠</div>
            <h3 className="text-xl font-bold text-[#C2185B] mb-2">Submit this Adoption Form?</h3>
            <p className="mb-6">Once submitted, your request will be sent to registered NGO in your area.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowConfirm(false)} className="bg-red-400 px-6 py-1 border-2 border-black">No, Go Back</button>
              <button onClick={() => setIsSubmitted(true)} className="bg-green-300 px-6 py-1 border-2 border-black">Yes, Submit</button>
            </div>
          </div>
        </div>
      )}

      <div className="p-8">
        <h1 className="text-3xl font-bold text-[#6A1B9A] mb-8">Adoption Form</h1>
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#C2185B]">Adopt {petName}</h2>
            <p className="text-gray-600">Ragdoll - 3 months</p>
            <p className="text-gray-600 font-bold">Lahore</p>
          </div>
          <img src="https://placecats.com/150/100" className="rounded-sm border-2 border-black shadow-md" alt="pet" />
        </div>

        {/* Form Container */}
        <div className="bg-[#DED9C4] p-8 border-2 border-black rounded-sm max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-black ${step >= 1 ? 'bg-[#C2185B] text-white' : 'bg-gray-300'}`}>1</div>
            <div className="h-[2px] w-20 bg-gray-400"></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-black ${step >= 2 ? 'bg-[#C2185B] text-white' : 'bg-gray-300'}`}>2</div>
            <div className="h-[2px] w-20 bg-gray-400"></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-black ${step >= 3 ? 'bg-[#C2185B] text-white' : 'bg-gray-300'}`}>3</div>
          </div>

          {step === 1 && (
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="font-bold text-lg text-[#6A1B9A] uppercase tracking-wider border-b-2 border-black pb-1 inline-block">Your Information</h3>
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Full Name *</label>
                    <input type="text" className="w-full border-2 border-black p-3 bg-white/50 focus:bg-white outline-none focus:ring-2 focus:ring-[#C2185B]/20 transition-all" placeholder="Enter your full name..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Contact Number *</label>
                    <input type="text" className="w-full border-2 border-black p-3 bg-white/50 focus:bg-white outline-none" defaultValue="+923337564321" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email Address *</label>
                    <input type="email" className="w-full border-2 border-black p-3 bg-white/50 focus:bg-white outline-none" defaultValue="khansarah@gmail.com" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#6A1B9A] uppercase tracking-wider border-b-2 border-black pb-1 inline-block mb-6">Address/Residency</h3>
                <div className="bg-[#EDEFD7] h-52 border-2 border-black relative">
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-gray-400">MAP UI COMPONENT</div>
                </div>
                <input type="text" className="w-full border-2 border-black p-3 mt-6 bg-white/50 focus:bg-white outline-none" placeholder="Or Enter Address Manually..." />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <h3 className="font-bold text-xl text-[#6A1B9A] uppercase tracking-wider border-b-2 border-black pb-1 inline-block mb-4">Living Situation</h3>

              <div className="grid grid-cols-2 gap-x-20 gap-y-8">
                {/* House Type */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-gray-500">House Type *</label>
                  <select className="w-full border-2 border-black p-3 bg-white/50 appearance-none cursor-pointer font-bold focus:bg-white outline-none">
                    <option>Apartment</option>
                    <option>House</option>
                    <option>Studio</option>
                  </select>
                </div>

                {/* Children at home? */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-gray-500">Children at home? *</label>
                  <div className="flex gap-10 mt-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="radio" name="children" className="w-5 h-5 accent-[#C2185B]" />
                      <span className="font-bold text-sm">Yes</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="radio" name="children" className="w-5 h-5 accent-[#C2185B]" defaultChecked />
                      <span className="font-bold text-sm">No</span>
                    </label>
                  </div>
                </div>

                {/* Other Pets at home? */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-gray-500">Other Pets? *</label>
                  <select className="w-full border-2 border-black p-3 bg-white/50 font-bold focus:bg-white outline-none">
                    <option>None</option>
                    <option>Dog</option>
                    <option>Cat</option>
                  </select>
                </div>

                {/* Pet Hours Alone Per Day */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-gray-500">Hours Alone? *</label>
                  <select className="w-full border-2 border-black p-3 bg-white/50 font-bold focus:bg-white outline-none">
                    <option>1-2 hours</option>
                    <option>3-5 hours</option>
                    <option>6+ hours</option>
                  </select>
                </div>

                {/* Monthly Income */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-gray-500">Monthly Income *</label>
                  <select className="w-full border-2 border-black p-3 bg-white/50 font-bold focus:bg-white outline-none">
                    <option>Under Rs. 20,000</option>
                    <option>Rs. 20,000 - 50,000</option>
                    <option>Over Rs. 50,000</option>
                  </select>
                </div>

                {/* Budget Allocated for Pet Care */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-gray-500">Care Budget *</label>
                  <select className="w-full border-2 border-black p-3 bg-white/50 font-bold focus:bg-white outline-none">
                    <option>Under Rs. 1000</option>
                    <option>Rs. 1000 - 3000</option>
                    <option>Over Rs. 3000</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="font-bold text-xl text-[#6A1B9A] uppercase tracking-wider border-b-2 border-black pb-1 inline-block">Adoption Motivation</h3>
              <div className="pt-2">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-3">Why do you want to adopt {petName}? *</label>
                <textarea className="w-full h-44 border-2 border-black p-5 bg-white/50 focus:bg-white outline-none transition-all resize-none font-medium leading-relaxed" placeholder="Tell us your reason for adopting..."></textarea>
              </div>
            </div>
          )}

          {/* Nav Buttons */}
          <div className="flex justify-end gap-4 mt-12">
            {step > 1 && (
              <button onClick={prevStep} className="bg-white px-8 py-2 border-2 border-black rounded-sm font-bold">← Back</button>
            )}
            {step < 3 ? (
              <button onClick={nextStep} className="bg-[#C2185B] text-white px-8 py-2 border-2 border-black rounded-sm font-bold">Next →</button>
            ) : (
              <button onClick={() => setShowConfirm(true)} className="bg-[#C2185B] text-white px-8 py-2 border-2 border-black rounded-sm font-bold">Submit</button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}