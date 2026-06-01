const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.9;
const MAX_BYTES = 4 * 1024 * 1024;

/**
 * Normalize photos before vision API calls:
 * - fixes orientation from mobile EXIF via browser decode
 * - downscales huge camera images to a vision-friendly size
 * - converts to JPEG to reduce payload without losing detail
 */
export async function prepareEstimateImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please upload a JPG, PNG, or WebP image.");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Image must be 10 MB or smaller.");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Could not process this image in your browser.");
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let quality = JPEG_QUALITY;
  let dataUrl = canvas.toDataURL("image/jpeg", quality);

  while (dataUrl.length > MAX_BYTES && quality > 0.55) {
    quality -= 0.05;
    dataUrl = canvas.toDataURL("image/jpeg", quality);
  }

  return dataUrl;
}
