import React from "react";
import { Link } from "react-router-dom";
import GridShape from "../common/GridShape";
import ThemeToggler from "../common/ThemeToggler";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-4 sm:p-6 bg-white z-1 dark:bg-gray-900 lg:p-0">
      <div className="relative flex flex-col justify-center w-full min-h-screen lg:flex-row dark:bg-gray-900">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-primary dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            <GridShape />
            <div className="flex flex-col items-center max-w-xs px-4">
              <Link to="/" className="block mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-lg sm:text-xl">ML</span>
                  </div>
                  <span className="text-white font-bold text-lg sm:text-xl">MyLegalDesk</span>
                </div>
              </Link>
              <p className="text-center text-gray-300 dark:text-white/60 text-sm sm:text-base">
                Professional Legal Management System
              </p>
            </div>
          </div>
        </div>
        <div className="fixed z-50 bottom-4 right-4 sm:bottom-6 sm:right-6">
          <ThemeToggler />
        </div>
      </div>
    </div>
  );
}