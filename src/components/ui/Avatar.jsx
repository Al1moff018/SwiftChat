import React from 'react';

const Avatar = ({ 
  src, 
  alt, 
  size = 'medium',
  className = '',
  online = false 
}) => {
  const sizes = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12',
    xlarge: 'w-14 h-14'
  };

  const baseClasses = 'rounded-full flex items-center justify-center text-white font-semibold relative';

  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full rounded-full object-cover ${baseClasses}`}
        />
      ) : (
        <div className={`${baseClasses} ${sizes[size]} bg-gradient-to-br from-blue-500 to-purple-600`}>
          {alt?.charAt(0).toUpperCase() || 'U'}
        </div>
      )}
      {online && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
      )}
    </div>
  );
};

export default Avatar;