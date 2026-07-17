import { useEffect, useState } from "react";

export function TransparentHand({
  src,
  className,
  ...props
}: {
  src: string;
  className?: string;
  [key: string]: any;
}) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      
      // Chroma-key out the pure black background with smooth feathering
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Use max channel value to key out any dark pixel cleanly
        const maxVal = Math.max(r, g, b);
        
        if (maxVal < 18) {
          data[i + 3] = 0; // Fully transparent
        } else if (maxVal < 70) {
          // Smooth edge transparency feathering
          const factor = (maxVal - 18) / 52;
          data[i + 3] = Math.round(data[i + 3] * factor);
        }
      }
      ctx.putImageData(imgData, 0, 0);
      setDataUrl(canvas.toDataURL());
    };
    img.src = src;
  }, [src]);

  if (!dataUrl) {
    // Return a loading state or placeholder with same className so layout is preserved
    return <div className={className} />;
  }

  return <img src={dataUrl} className={className} {...props} />;
}

export default TransparentHand;
