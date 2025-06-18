/**
 * Application header component
 */

import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-sm flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Tournament Bracket
            </h1>
            <p className="mt-1 text-sm text-gray-300">
              Visualize and manage your tournament brackets
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
