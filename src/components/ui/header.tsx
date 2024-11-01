import { Button } from "../ui/button";
import { MapIcon, MenuIcon, Globe, ShoppingCart } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b md:px-8">
      <div className="flex items-center space-x-2">
        <MapIcon className="h-5 w-5 text-pink-600" />
        <span className="text-xl font-bold text-pink-600">RestroMap</span>
      </div>
      <div className="flex items-center space-x-4 max-sm:hidden">
        <Link to="/login">
          <Button variant="ghost" className="text-pink-600">
            Log in
          </Button>
        </Link>
        <Link to="/register">
          <Button variant="default" className="bg-pink-600 text-white">
            Sign up
          </Button>
        </Link>
        <div className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-pink-600" />
          <span className="text-pink-600">EN</span>
        </div>
        <ShoppingCart className="h-5 w-5 text-pink-600" />
      </div>
      <div className="flex items-center space-x-4 lg:hidden">
        <Button
          variant="ghost"
          className="text-pink-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 p-4 space-y-4 shadow-lg lg:hidden">
          <Button
            variant="ghost"
            className="text-pink-600"
            onClick={() => setIsMenuOpen(false)}
          >
            Close
          </Button>
          <Link to="/login">
            <Button variant="ghost" className="text-pink-600 w-full">
              Log in
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="default" className="bg-pink-600 text-white w-full">
              Sign up
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-pink-600" />
            <span className="text-pink-600">EN</span>
          </div>
          <ShoppingCart className="h-5 w-5 text-pink-600" />
        </div>
      )}
    </header>
  );
};

export default Header;
