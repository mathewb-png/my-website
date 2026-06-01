import sharp from "sharp";

const MAX_EDGE = 1600;

/** Server-side safety pass so vision always gets a consistent JPEG. */
export async function normalizeEstimateImageDataUrl(
  image: string
): Promise<string> {
  const base64 = image.includes(",") ? image.split(",")[1] : image;
  const input = Buffer.from(base64, "base64");

  const output = await sharp(input)
    .rotate()
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();

  return `data:image/jpeg;base64,${output.toString("base64")}`;
}
