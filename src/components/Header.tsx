"use client";
import React, { ReactElement } from 'react';
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const Header = (): ReactElement => {
  return (
    <>
      
      <header className="fixed top-0 left-0 w-full z-50 p-4 flex justify-between items-center text-white">
        <div className="flex items-center p-4">
          <h1 className="text-4xl font-bold text-black dark:text-white">
            MySelfImprovementPortal
          </h1>
        </div>
        <nav className="ml-auto p-0">
          <ul className="flex space-x-6">
            <li className="font-bold">
              <Link href="#home" className="hover:underline">
                Home
              </Link>
            </li>
            <li className="font-bold">
              <Link href="#dashboard" className="hover:underline">
                Dashboard
              </Link>
            </li>
            <li className="font-bold">
              <Link href="#challenges" className="hover:underline">
                Challenges
              </Link>
            </li>
          </ul>
        </nav>
        <ThemeToggle />
      </header>

      <div className="h-20"></div>
      <div className="relative w-full h-[40vh]">
        <img
          src="/header.png"
          alt="Header Banner"
          className="w-full h-full object-cover"
        />
      </div>
    </>
  );
};

export default Header;