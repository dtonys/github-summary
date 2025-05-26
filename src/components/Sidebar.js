import Link from 'next/link';
import { HomeIcon, BeakerIcon, DocumentTextIcon, CreditCardIcon, Cog6ToothIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Sidebar({ isOpen, onToggle }) {
  return (
    <div className="relative flex">
      <div className={`${isOpen ? 'w-60' : 'w-0'} h-screen flex flex-col border-r border-gray-200 bg-white transition-all duration-300 overflow-hidden`}>
        {/* Title Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">GitHub Summary</h1>
        </div>

        {/* User Section */}
        <div className="px-3 pt-4">
          <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-600">T</span>
            </div>
            <span className="text-sm text-gray-700">Personal</span>
            <svg className="w-4 h-4 ml-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 mt-6 space-y-1">
          <Link 
            href="/dashboards" 
            className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 group"
          >
            <HomeIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-500" />
            Overview
          </Link>

          <Link 
            href="/playground" 
            className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 group"
          >
            <BeakerIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-500" />
            API Playground
          </Link>

          <Link 
            href="/use-cases" 
            className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 group"
          >
            <DocumentTextIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-500" />
            Use Cases
          </Link>

          <Link 
            href="/billing" 
            className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 group"
          >
            <CreditCardIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-500" />
            Billing
          </Link>

          <Link 
            href="/settings" 
            className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 group"
          >
            <Cog6ToothIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-500" />
            Settings
          </Link>
        </nav>
      </div>

      {/* Toggle Button - Now with conditional positioning */}
      <button
        onClick={onToggle}
        className={`absolute top-6 ${isOpen ? '-right-3' : 'left-3'} bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:bg-gray-50`}
      >
        {isOpen ? (
          <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronRightIcon className="w-4 h-4 text-gray-600" />
        )}
      </button>
    </div>
  );
} 