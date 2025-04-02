'use client';
import { useState, useRef } from 'react';

export default function OTPVerification() {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add OTP verification logic here
    console.log('OTP:', otp.join(''));
  };

  return (
    <div className="min-h-screen bg-black font-sans flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white/5 rounded-2xl border border-white/10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Enter OTP</h2>
          <p className="mt-2 text-gray-400">We sent a code to your email</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="flex justify-center space-x-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                ref={(ref) => (inputRefs.current[index] = ref)}
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                className="w-12 h-12 text-center bg-white/5 border border-white/10 rounded-lg text-white text-xl focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-full bg-white text-black hover:bg-gray-200 transition-colors"
          >
            Verify OTP
          </button>

          <p className="text-center text-sm text-gray-400">
            Didn't receive code?{' '}
            <button type="button" className="text-white hover:text-gray-200">
              Resend
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
