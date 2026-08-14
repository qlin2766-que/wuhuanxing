import React, { useState } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: string;
  containerClassName?: string;
  placeholderColor?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  aspectRatio,
  placeholderColor = 'transparent',
  onLoad,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad(e);
    }
  };

  return (
    <div
      className={`relative overflow-hidden ${containerClassName}`}
      style={{
        aspectRatio: aspectRatio || undefined,
        backgroundColor: isLoaded ? 'transparent' : placeholderColor,
      }}
    >
      <img
        src={src}
        alt={alt || ''}
        onLoad={handleImageLoad}
        referrerPolicy="no-referrer"
        className={`transition-opacity duration-300 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...props}
      />
    </div>
  );
};
