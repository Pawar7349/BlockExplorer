import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <>
      <div className="w-full h-20 bg-gray-900 flex items-center justify-between px-8 shadow-lg">
        {/* Logo */}
        <div className="text-4xl text-white font-semibold flex items-center gap-2">
          <span className="text-cyan-400">Block</span>Explorer
        </div>

        {/* Navigation Links */}
        <div className="flex gap-8 items-center">
          <Link
            to="/"
            className="text-lg text-white font-medium transition-all duration-300 ease-in-out hover:text-cyan-300 transform hover:scale-105"
          >
            Block Explore
          </Link>
          <Link
            to="/nft"
            className="text-lg text-white font-medium transition-all duration-300 ease-in-out hover:text-cyan-300 transform hover:scale-105"
          >
            NFT Explore
          </Link>
          <Link
            to="/account"
            className="text-lg text-white font-medium transition-all duration-300 ease-in-out hover:text-cyan-300 transform hover:scale-105"
          >
            Account History
          </Link>
        </div>

        {/* Menu Toggle for Mobile */}
        <div className="lg:hidden">
          <button className="text-white text-2xl">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
