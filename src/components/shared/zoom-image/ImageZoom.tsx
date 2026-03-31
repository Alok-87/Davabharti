// 'use client';

// import React, { useRef, useState, useEffect } from 'react';

// type PreviewPosition = 'right' | 'above' | 'inside';

// interface ImageZoomProps {
//   src: string;
//   alt?: string;
//   width?: number;
//   height?: number;
//   zoomScale?: number;
//   previewSize?: number;
//   previewPosition?: PreviewPosition;
// }

// const clamp = (v: number, a = 0, b = 100) => Math.max(a, Math.min(b, v));

// export default function ImageZoom({
//   src,
//   alt = '',
//   width = 600,
//   height = 600,
//   zoomScale = 2,
//   previewSize = 320,
//   previewPosition = 'right',
// }: ImageZoomProps) {
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const [isHover, setIsHover] = useState(false);
//   const [pos, setPos] = useState({ x: 50, y: 50 });
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 1024);
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const handleMouseMove = (e: React.MouseEvent) => {
//     const el = containerRef.current;
//     if (!el) return;
//     const rect = el.getBoundingClientRect();
//     const cx = e.clientX - rect.left;
//     const cy = e.clientY - rect.top;
//     const px = clamp((cx / rect.width) * 100, 0, 100);
//     const py = clamp((cy / rect.height) * 100, 0, 100);
//     setPos({ x: px, y: py });
//   };

//   const getPreviewStyle = (): React.CSSProperties => {
//     if (previewPosition === 'inside') {
//       return {
//         position: 'absolute',
//         inset: 0,
//         backgroundImage: `url(${src})`,
//         backgroundRepeat: 'no-repeat',
//         backgroundPosition: `${pos.x}% ${pos.y}%`,
//         backgroundSize: `${zoomScale * 100}%`,
//         borderRadius: 8,
//       };
//     }

//     if (isMobile) {
//       const size = previewSize / 2;
//       return {
//         position: 'absolute',
//         top: 8,
//         right: 8,
//         width: `${size}px`,
//         height: `${size}px`,
//         backgroundImage: `url(${src})`,
//         backgroundRepeat: 'no-repeat',
//         backgroundPosition: `${pos.x}% ${pos.y}%`,
//         backgroundSize: `${zoomScale * 100}%`,
//         boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
//         borderRadius: 8,
//         zIndex: 20,
//       };
//     }

//     return {
//       position: 'absolute',
//       top: 0,
//       left: `calc(100% + 12px)`,
//       width: `${previewSize}px`,
//       height: `${previewSize}px`,
//       backgroundImage: `url(${src})`,
//       backgroundRepeat: 'no-repeat',
//       backgroundPosition: `${pos.x}% ${pos.y}%`,
//       backgroundSize: `${zoomScale * 100}%`,
//       boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
//       borderRadius: 8,
//       zIndex: 20,
//     };
//   };

//   return (
//     <div
//       ref={containerRef}
//       onMouseEnter={() => setIsHover(true)}
//       onMouseLeave={() => setIsHover(false)}
//       onMouseMove={handleMouseMove}
//       className="relative w-full max-w-full"
//       style={{
//         width: '100%',
//         height: 'auto',
//         overflow: 'visible',
//       }}
//     >
//       {/* Main image wrapper */}
//       <div
//         className="relative w-full flex items-center justify-center bg-white"
//         style={{
//           aspectRatio: `${width} / ${height}`,
//           borderRadius: 8,
          
//         }}
//       >
//         <img
//           src={src}
//           alt={alt}
//           draggable={false}
//           style={{
//             maxWidth: '100%',
//             maxHeight: '100%',
//             objectFit: 'contain',
//             objectPosition: 'center',
//             display: 'block',
//           }}
//         />

//         {/* Lens indicator (desktop only) */}
//         {isHover && !isMobile && (
//           <div
//             className="pointer-events-none"
//             style={{
//               position: 'absolute',
//               width: 80,
//               height: 80,
//               borderRadius: 8,
//               border: '2px solid rgba(59,130,246,0.35)',
//               backgroundColor: 'rgba(59,130,246,0.06)',
//               transform: 'translate(-50%,-50%)',
//               left: `${pos.x}%`,
//               top: `${pos.y}%`,
//             }}
//           />
//         )}

//         {/* Zoom preview */}
//         {isHover && <div style={getPreviewStyle()} />}
//       </div>
//     </div>
//   );
// }

'use client';

import React, { useRef, useState, useEffect } from 'react';


type PreviewPosition = 'right' | 'above' | 'inside';

interface ImageZoomProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  zoomScale?: number;
  previewSize?: number;
  previewPosition?: PreviewPosition;
}

const clamp = (v: number, a = 0, b = 100) => Math.max(a, Math.min(b, v));

export default function ImageZoom({
  src,
  alt = '',
  width = 600,
  height = 600,
  zoomScale = 2,
  previewSize = 320,
  previewPosition = 'right',
}: ImageZoomProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHover, setIsHover] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [isMobile, setIsMobile] = useState(false);
  const [imageSrc, setImageSrc] = useState(src); // <-- state to store image source
  const placeholderImage ="/no-image.png";
  const isPlaceholder = imageSrc === placeholderImage;

  useEffect(() => {
    setImageSrc(src); // update when src changes
  }, [src]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const px = clamp((cx / rect.width) * 100, 0, 100);
    const py = clamp((cy / rect.height) * 100, 0, 100);
    setPos({ x: px, y: py });
  };

  const getPreviewStyle = (): React.CSSProperties => {
    if (previewPosition === 'inside') {
      return {
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${imageSrc})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `${pos.x}% ${pos.y}%`,
        backgroundSize: `${zoomScale * 100}%`,
        borderRadius: 8,
      };
    }

    if (isMobile) {
      const size = previewSize / 2;
      return {
        position: 'absolute',
        top: 8,
        right: 8,
        width: `${size}px`,
        height: `${size}px`,
        backgroundImage: `url(${imageSrc})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `${pos.x}% ${pos.y}%`,
        backgroundSize: `${zoomScale * 100}%`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        borderRadius: 8,
        zIndex: 20,
      };
    }

    return {
      position: 'absolute',
      top: 0,
      left: `calc(100% + 12px)`,
      width: `${previewSize}px`,
      height: `${previewSize}px`,
      backgroundImage: `url(${imageSrc})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: `${pos.x}% ${pos.y}%`,
      backgroundSize: `${zoomScale * 100}%`,
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      borderRadius: 8,
      zIndex: 20,
    };
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onMouseMove={handleMouseMove}
      className="relative w-full max-w-full"
      style={{ width: '100%', height: 'auto', overflow: 'visible' }}
    >
      {/* Main image */}
      <div
        className="relative w-full flex items-center justify-center bg-white"
        style={{ aspectRatio: `${width} / ${height}`, borderRadius: 8 }}
      >
        <img
          src={imageSrc}
          alt={alt}
          draggable={false}
          onError={() => setImageSrc(placeholderImage)} // ✅ fallback when image fails
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            display: 'block',
          }}
        />

        {/* Lens (desktop only) */}
{isHover && !isMobile && !isPlaceholder && (
  <div
    className="pointer-events-none"
    style={{
      position: 'absolute',
      width: 80,
      height: 80,
      borderRadius: 8,
      border: '2px solid rgba(59,130,246,0.35)',
      backgroundColor: 'rgba(59,130,246,0.06)',
      transform: 'translate(-50%,-50%)',
      left: `${pos.x}%`,
      top: `${pos.y}%`,
    }}
  />
)}

{/* Zoom Preview */}
{isHover && !isPlaceholder && <div style={getPreviewStyle()} />}

      </div>
    </div>
  );
}
