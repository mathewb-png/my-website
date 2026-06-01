import fs from "fs";
import path from "path";
import sharp from "sharp";

const BG = { r: 10, g: 10, b: 18, alpha: 1 };
const logoPath = "public/logo-nav-white.png";
const outDir = "src/app";

async function makeSquare(size) {
  const meta = await sharp(logoPath).metadata();
  const pad = Math.round(size * 0.12);
  const targetW = size - pad * 2;
  const targetH = Math.round(targetW * (meta.height / meta.width));
  const resized = await sharp(logoPath)
    .resize({ width: targetW, height: targetH, fit: "inside" })
    .png()
    .toBuffer();
  const resizedMeta = await sharp(resized).metadata();
  const left = Math.round((size - resizedMeta.width) / 2);
  const top = Math.round((size - resizedMeta.height) / 2);

  return sharp({
    create: { width: size, height: size, channels: 4, background: BG },
  }).composite([{ input: resized, left, top }]);
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  await (await makeSquare(512)).png().toFile(path.join(outDir, "icon.png"));
  await (await makeSquare(180)).png().toFile(path.join(outDir, "apple-icon.png"));
  await (await makeSquare(32)).png().toFile(path.join("public", "favicon.png"));

  console.log("Generated favicon assets in", outDir);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
