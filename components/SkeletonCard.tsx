import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-md flex flex-col border overflow-hidden">
      <div className="relative bg-gray-200 h-52 w-full overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent -translate-x-full animate-shimmer"></div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="flex items-center justify-between mt-2">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="h-6 bg-gray-200 rounded w-20 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-lg w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
