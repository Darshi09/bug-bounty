import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity duration-300"
          >
            <span className="text-xl sm:text-2xl md:text-3xl font-extrabold gradient-text">
              HackerRate
            </span>
          </Link>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            © {new Date().getFullYear()} HackerRate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
