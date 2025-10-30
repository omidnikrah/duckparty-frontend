export const mergeImagesFromPaths = async (paths: string[]): Promise<Blob> => {
  if (!paths.length) {
    throw new Error("No image paths provided.");
  }

  const images = await Promise.all(paths.map(loadImage));

  const w = images[0].width;
  const h = images[0].height;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get 2D context.");
  }

  ctx.clearRect(0, 0, w, h);
  for (const img of images) {
    ctx.drawImage(img, 0, 0);
  }

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (!result) {
        reject(new Error("Failed to create blob from canvas."));
        return;
      }
      resolve(result);
    }, "image/png");
  });

  return blob;
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
};
