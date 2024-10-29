import { Button } from "./ui/button";
import { MapIcon, MenuIcon } from "lucide-react";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Link } from "react-router-dom"; // Import Link for navigation

const Header = () => {
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b md:px-8">
      <div className="flex items-center space-x-2 ">
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
          <GlobeIcon className="h-5 w-5 text-pink-600" />
          <span className="text-pink-600">EN</span>
        </div>
        <ShoppingCartIcon className="h-5 w-5 text-pink-600" />
      </div>
      <div className="flex items-center space-x-4  lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="text-pink-600">
              <MenuIcon className="h-5 w-5 " />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="p-4 space-y-4">
              <Button variant="ghost" className="text-pink-600">
                Log in
              </Button>
              <Button variant="default" className="bg-pink-600 text-white">
                Sign up
              </Button>
              <div className="flex items-center space-x-2">
                <GlobeIcon className="h-5 w-5 text-pink-600" />
                <span className="text-pink-600">EN</span>
              </div>
              <ShoppingCartIcon className="h-5 w-5 text-pink-600" />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;

function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function ShoppingCartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}
