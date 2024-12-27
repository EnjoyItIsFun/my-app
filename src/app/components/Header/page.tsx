'use client';

import LogOutButton from '../LogOutButton/page';

const Header = () => {
    return (
      <header className="bg-[#ffeaed] dark:bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-gray-800 dark:text-white text-2xl">⚡MyPortal⚡</h1>
          <div className="relative">
            {/* <input
              type="text"
              placeholder="Search..."
              className="pl-4 pr-8 py-2 rounded-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none"
            />
            <svg
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                width="20"
                height="20"
            >
            </svg> */}
            <LogOutButton />
          </div>
        </div>
      </header>
    );
  };
export default Header;