// 'use client';

// import { useTheme } from "../Contexts/ThemeContext";
// import logo from "../../public/images/brand.png"; // Your logo

// const Footer = () => {
//   const { theme } = useTheme();

//   return (
//     <footer className={`w-full transition-colors duration-300
//       ${theme === 'dark' ? 'bg-gray-950 text-gray-300' : 'bg-gray-900 text-gray-200'}`}
//     >
//       {/* Newsletter Section - From Image 2 */}
//       <div className={`py-16 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-700'}`}>
//         <div className="max-w-4xl mx-auto px-6 text-center">
//           <h2 className="text-4xl font-bold text-white mb-4">
//             Subscribe to our newsletter
//           </h2>
//           <p className="text-lg text-gray-400 mb-8 max-w-md mx-auto">
//             Sign up today and get a free sample up to 100 records.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
//             <div className="relative w-full sm:w-96">
//               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
//                 ✉️
//               </div>
//               <input
//                 type="email"
//                 placeholder="Enter your email address"
//                 className="w-full bg-gray-800 border border-gray-700 rounded-full py-4 pl-12 pr-6 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
//               />
//             </div>
//             <button className="bg-white text-black font-semibold px-8 py-4 rounded-full hover:bg-gray-200 transition whitespace-nowrap">
//               Get started
//             </button>
//           </div>

//           <p className="text-sm text-gray-500 mt-6 flex items-center justify-center gap-3">
//             Our experts are ready to help!
//             <span className="flex -space-x-2">
//               <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="" className="w-7 h-7 rounded-full border-2 border-gray-900 object-cover" />
//               <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="" className="w-7 h-7 rounded-full border-2 border-gray-900 object-cover" />
//               <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="" className="w-7 h-7 rounded-full border-2 border-gray-900 object-cover" />
//             </span>
//           </p>
//         </div>
//       </div>

//       {/* Main Footer Content - Inspired by Image 1 */}
//       <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
//         <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
//           {/* Company Info */}
//           <div className="md:col-span-5">
//             <div className="flex items-center gap-3 mb-6">
//               <img 
//                 src={logo} 
//                 alt="Company Logo" 
//                 className="h-10 w-auto"
//               />
//               <span className="text-2xl font-bold text-white">YourCompany</span>
//             </div>

//             <div className="text-sm leading-relaxed text-gray-400">
//               <p>20619 Terrence Chapel Rd</p>
//               <p>Suite 116 #1040</p>
//               <p>Cornelius, NC 28031</p>
//               <p>United States</p>
//             </div>

//             <div className="mt-8 text-sm">
//               <p className="flex items-center gap-2">
//                 <span className="text-gray-500">Phone:</span> 
//                 <a href="tel:1-800-201-1019" className="hover:text-white">1-800-201-1019</a>
//               </p>
//               <p className="flex items-center gap-2 mt-1">
//                 <span className="text-gray-500">Email:</span> 
//                 <a href="mailto:support@yourcompany.com" className="hover:text-white">support@yourcompany.com</a>
//               </p>
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div className="md:col-span-2">
//             <h4 className="font-semibold text-white mb-5">Quick Links</h4>
//             <ul className="space-y-3 text-sm">
//               <li><a href="#" className="hover:text-white transition">Pricing</a></li>
//               <li><a href="#" className="hover:text-white transition">Resources</a></li>
//               <li><a href="#" className="hover:text-white transition">About us</a></li>
//               <li><a href="#" className="hover:text-white transition">FAQ</a></li>
//               <li><a href="#" className="hover:text-white transition">Contact us</a></li>
//             </ul>
//           </div>

//           {/* Social */}
//           <div className="md:col-span-2">
//             <h4 className="font-semibold text-white mb-5">Social</h4>
//             <ul className="space-y-3 text-sm">
//               <li><a href="#" className="hover:text-white transition">Facebook</a></li>
//               <li><a href="#" className="hover:text-white transition">Instagram</a></li>
//               <li><a href="#" className="hover:text-white transition">LinkedIn</a></li>
//               <li><a href="#" className="hover:text-white transition">Twitter</a></li>
//               <li><a href="#" className="hover:text-white transition">Youtube</a></li>
//             </ul>
//           </div>

//           {/* Legal */}
//           <div className="md:col-span-3">
//             <h4 className="font-semibold text-white mb-5">Legal</h4>
//             <ul className="space-y-3 text-sm">
//               <li><a href="#" className="hover:text-white transition">Terms of service</a></li>
//               <li><a href="#" className="hover:text-white transition">Privacy policy</a></li>
//               <li><a href="#" className="hover:text-white transition">Cookie policy</a></li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Copyright Bar */}
//       <div className={`py-6 border-t text-center text-sm text-gray-500
//         ${theme === 'dark' ? 'border-gray-800' : 'border-gray-700'}`}
//       >
//         © 2026 YourCompany. All rights reserved.
//       </div>
//     </footer>
//   );
// };

// export default Footer;




'use client';

import React from 'react';
 import { useTheme } from "../Contexts/ThemeContext";
 import logo from "../../public/images/brand.png"; // Your logo

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className={`w-full ${theme === 'dark' ? 'bg-[#0a0a0a] text-gray-300' : 'bg-gray-900 text-gray-200'}`}>
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Left Section - Company Info (Left-Bottom aligned as requested) */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={logo} 
                alt="Company Logo" 
                className="h-9 w-auto"
              />
              <span className="text-2xl font-bold tracking-tight text-white">YourCompany</span>
            </div>

            <div className="space-y-1 text-sm text-gray-400">
              <p>20619 Terrence Chapel Rd</p>
              <p>Suite 116 #1040</p>
              <p>Cornelius, NC 28031</p>
              <p>United States</p>
            </div>

            <div className="mt-10 text-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-500">Phone number</span>
                <a href="tel:1-800-201-1019" className="hover:text-white transition">1-800-201-1019</a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Email</span>
                <a href="mailto:support@yourcompany.com" className="hover:text-white transition">support@yourcompany.com</a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="text-white font-medium mb-5">Quick links</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition">Resources</a></li>
              <li><a href="#" className="hover:text-white transition">About us</a></li>
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition">Contact us</a></li>
            </ul>
          </div>

          {/* Social */}
          <div className="md:col-span-2">
            <h4 className="text-white font-medium mb-5">Social</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition">Facebook</a></li>
              <li><a href="#" className="hover:text-white transition">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition">Youtube</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-3">
            <h4 className="text-white font-medium mb-5">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition">Terms of service</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy policy</a></li>
              <li><a href="#" className="hover:text-white transition">Cookie policy</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Section - Moved to Bottom Left as requested */}
      <div className={`border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-700'}`}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-md">
              <h3 className="text-2xl font-semibold text-white mb-3">
                Subscribe to our newsletter
              </h3>
              <p className="text-gray-400">
                Sign up today and get a free sample up to 100 records.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-1 min-w-[280px]">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">✉️</div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full bg-gray-800 border border-gray-700 rounded-full py-4 pl-12 pr-6 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <button className="bg-white hover:bg-gray-100 transition text-black font-semibold px-10 py-4 rounded-full whitespace-nowrap">
                Get started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className={`py-6 border-t text-center text-xs text-gray-500
        ${theme === 'dark' ? 'border-gray-800' : 'border-gray-700'}`}
      >
        © 2026 YourCompany. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;