'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Dumbbell, Play, Image as ImageIcon } from 'lucide-react';
import { Button } from './button';

interface ExerciseImageProps {
  src?: string;
  alt: string;
  className?: string;
  showVideo?: boolean;
  videoUrl?: string;
  images?: string[];
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rounded?: boolean;
  showPlayButton?: boolean;
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-48 h-48'
};

export function ExerciseImage({
  src,
  alt,
  className,
  showVideo = false,
  videoUrl,
  images = [],
  size = 'md',
  rounded = true,
  showPlayButton = true
}: ExerciseImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  // Determinar a imagem atual
  const currentImage = images.length > 0 ? images[currentImageIndex] : src;
  const hasMultipleImages = images.length > 1;
  const hasVideo = videoUrl && showVideo;

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  const nextImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const toggleVideo = () => {
    setShowVideoPlayer(!showVideoPlayer);
  };

  return (
    <div className={cn(
      'relative overflow-hidden bg-muted flex items-center justify-center',
      sizeClasses[size],
      rounded && 'rounded-lg',
      className
    )}>
      {/* Vídeo Player */}
      {showVideoPlayer && hasVideo ? (
        <div className="absolute inset-0 z-20">
          <video
            src={videoUrl}
            controls
            autoPlay
            className="w-full h-full object-cover"
            onEnded={() => setShowVideoPlayer(false)}
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
            onClick={() => setShowVideoPlayer(false)}
          >
            ✕
          </Button>
        </div>
      ) : (
        <>
          {/* Imagem */}
          {currentImage && !imageError ? (
            <>
              <img
                src={currentImage}
                alt={alt}
                className={cn(
                  'w-full h-full object-cover transition-opacity duration-200',
                  isLoading && 'opacity-0'
                )}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
              
              {/* Loading Spinner */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              )}
            </>
          ) : (
            /* Fallback quando não há imagem ou erro */
            <div className="flex flex-col items-center justify-center text-muted-foreground p-2">
              <Dumbbell className="h-6 w-6 mb-1" />
              <span className="text-xs text-center">{alt}</span>
            </div>
          )}

          {/* Controles de Navegação para Múltiplas Imagens */}
          {hasMultipleImages && !imageError && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 h-6 w-6 p-0"
                onClick={prevImage}
              >
                ‹
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 h-6 w-6 p-0"
                onClick={nextImage}
              >
                ›
              </Button>
              
              {/* Indicador de Imagens */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      'w-1.5 h-1.5 rounded-full transition-colors',
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    )}
                  />
                ))}
              </div>
            </>
          )}

          {/* Botão de Play para Vídeo */}
          {hasVideo && showPlayButton && !imageError && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-1 right-1 bg-black/50 text-white hover:bg-black/70 h-6 w-6 p-0"
              onClick={toggleVideo}
            >
              <Play className="h-3 w-3" />
            </Button>
          )}
        </>
      )}
    </div>
  );
}

// Componente para galeria de imagens
interface ExerciseImageGalleryProps {
  images: string[];
  alt: string;
  videoUrl?: string;
  className?: string;
}

export function ExerciseImageGallery({
  images,
  alt,
  videoUrl,
  className
}: ExerciseImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Imagem Principal */}
      <div className="relative">
        {showVideo && videoUrl ? (
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-full"
              onEnded={() => setShowVideo(false)}
            />
          </div>
        ) : (
          <ExerciseImage
            src={images[selectedIndex]}
            alt={alt}
            size="xl"
            className="w-full aspect-video"
            showVideo={false}
          />
        )}
        
        {/* Botão de Vídeo */}
        {videoUrl && (
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4"
            onClick={() => setShowVideo(!showVideo)}
          >
            {showVideo ? <ImageIcon className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {showVideo ? 'Ver Imagem' : 'Ver Vídeo'}
          </Button>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedIndex(index);
                setShowVideo(false);
              }}
              className={cn(
                'flex-shrink-0 border-2 rounded-lg overflow-hidden transition-colors',
                selectedIndex === index ? 'border-primary' : 'border-transparent'
              )}
            >
              <ExerciseImage
                src={image}
                alt={`${alt} - Imagem ${index + 1}`}
                size="sm"
                showVideo={false}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}