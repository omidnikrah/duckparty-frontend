export const generateSocialCard = async (
  duckImage: string,
  duckName: string,
  creatorName: string,
): Promise<Blob> => {
  const maxDuckNameLength = 15;
  const maxCreatorNameLength = 10;
  const truncatedDuckName =
    duckName.length > maxDuckNameLength
      ? `${duckName.slice(0, maxDuckNameLength)}...`
      : duckName;
  const truncatedCreatorName =
    creatorName.length > maxCreatorNameLength
      ? `${creatorName.slice(0, maxCreatorNameLength)}...`
      : creatorName;

  const { primary, gray800, white } = getColors();

  const template = await loadImage("/social-placeholder.jpg");
  const duck = await loadImage(duckImage);

  const targetWidth = 1024;
  const targetHeight = 1024;

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get 2D context.");
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(template, 0, 0, targetWidth, targetHeight);

  const duckWidth = Math.min(duck.width, canvas.width * 0.4) * 2.5;
  const duckHeight = (duck.height / duck.width) * duckWidth;
  const duckX = (canvas.width - duckWidth) / 2;
  const duckY = canvas.height * 0.35 - duckHeight / 2;

  ctx.drawImage(duck, duckX, duckY, duckWidth, duckHeight);

  await loadFonts();

  ctx.fillStyle = primary;
  ctx.font = `${Math.floor(canvas.width * 0.08)}px "Modak", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const duckNameY = canvas.height * 0.62;
  ctx.fillText(truncatedDuckName, canvas.width / 2, duckNameY);

  const creatorNameFontSize = Math.floor(canvas.width * 0.035);
  const byFontSize = Math.floor(canvas.width * 0.03);
  const lineY = canvas.height * 0.7;

  ctx.font = `${byFontSize}px "Modak", sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  const byMetrics = ctx.measureText("By");
  const byTextWidth = byMetrics.width;
  const spacing = canvas.width * 0.015;

  ctx.font = `${creatorNameFontSize}px "Modak", sans-serif`;
  const creatorNameMetrics = ctx.measureText(truncatedCreatorName);
  const buttonPadding = canvas.width * 0.02;
  const buttonWidth = creatorNameMetrics.width + buttonPadding * 2;
  const buttonHeight = creatorNameFontSize * 1.5;

  const totalWidth = byTextWidth + spacing + buttonWidth;
  const centerX = canvas.width / 2;
  const startX = centerX - totalWidth / 2;
  const buttonX = startX + byTextWidth + spacing;
  const buttonY = lineY - buttonHeight / 2;

  ctx.fillStyle = gray800;
  ctx.font = `${byFontSize}px "Modak", sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("By", startX, lineY + 4);

  ctx.fillStyle = primary;
  const borderRadius = buttonHeight / 2;
  drawRoundedRect(
    ctx,
    buttonX,
    buttonY,
    buttonWidth,
    buttonHeight,
    borderRadius,
  );
  ctx.fill();

  ctx.strokeStyle = white;
  ctx.lineWidth = canvas.width * 0.003;
  drawRoundedRect(
    ctx,
    buttonX,
    buttonY,
    buttonWidth,
    buttonHeight,
    borderRadius,
  );
  ctx.stroke();

  ctx.fillStyle = white;
  ctx.textAlign = "center";
  ctx.fillText(truncatedCreatorName, buttonX + buttonWidth / 2, lineY + 4);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error("Failed to create blob from canvas."));
          return;
        }
        resolve(result);
      },
      "image/jpeg",
      1,
    );
  });

  return blob;
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    if (!src.startsWith("data:")) {
      img.crossOrigin = "anonymous";
    }

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

const loadFonts = async (): Promise<void> => {
  if (document.fonts) {
    try {
      await document.fonts.load('48px "Modak"');
    } catch (error) {
      console.warn("Failed to load fonts:", error);
    }
  }
};

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void => {
  const maxRadius = Math.min(width / 2, height / 2);
  const actualRadius = Math.min(radius, maxRadius);
  const centerY = y + height / 2;

  ctx.beginPath();

  ctx.moveTo(x + actualRadius, y);

  ctx.lineTo(x + width - actualRadius, y);

  ctx.arc(
    x + width - actualRadius,
    centerY,
    actualRadius,
    (Math.PI * 3) / 2,
    Math.PI / 2,
    false,
  );

  ctx.lineTo(x + actualRadius, y + height);

  ctx.arc(
    x + actualRadius,
    centerY,
    actualRadius,
    Math.PI / 2,
    (Math.PI * 3) / 2,
    false,
  );

  ctx.closePath();
};

export const blobToDataURL = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const blobToObjectURL = (blob: Blob): string => {
  return URL.createObjectURL(blob);
};

const getColors = () => {
  const styles = getComputedStyle(document.documentElement);
  const primary = styles.getPropertyValue("--color-primary");
  const gray800 = styles.getPropertyValue("--color-gray-800");
  const white = styles.getPropertyValue("--color-white");
  return {
    primary,
    gray800,
    white,
  };
};
