import React, { useState } from "react";
import { Mail } from "lucide-react";

const Subscribe = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    alert(`Subscribed with ${email}! Thank you.`);
    setEmail("");
  };

  return (
    <section className="w-full px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-green-700 rounded-xl px-5 py-4 shadow-md">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col lg:flex-row items-center gap-4"
          >
            {/* Left Content */}
            <div className="flex items-center gap-3 min-w-fit">
              <div className="w-12 h-12 bg-white/15 rounded-lg flex items-center justify-center">
                <Mail size={26} className="text-white" />
              </div>

              <div>
                <h2 className="text-white font-bold text-xl leading-tight">
                  Subscribe to our newsletter
                </h2>

                <p className="text-green-100 text-sm">
                  Sign up today and get the latest updates, tips and offers.
                </p>
              </div>
            </div>

            {/* Right Form */}
            <div className="flex flex-1 w-full gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 px-4 rounded-md border-0 bg-white text-gray-700 placeholder:text-gray-400 focus:outline-none"
                required
              />

              <button
                type="submit"
                className="h-12 px-8 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-md transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Subscribe;