/**
 * Application footer component
 */

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <p className="text-center text-sm text-gray-500">
          Tournament Bracket Visualizer © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
