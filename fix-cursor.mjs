import sharp from 'sharp';

async function fixCursor(inFile, outFile) {
  try {
    const { data, info } = await sharp(inFile)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // White background detection (with a threshold for anti-aliasing)
      if (r > 220 && g > 220 && b > 220) {
        // Compute transparency based on how close to white it is
        // 255 -> 0 alpha, 220 -> some alpha for smoother edges
        const avg = (r + g + b) / 3;
        if (avg > 250) {
            data[i + 3] = 0;
        } else {
            // simple edge blending
            const alpha = Math.floor((250 - avg) * 5);
            data[i + 3] = Math.min(a, Math.max(0, alpha));
        }
      } else if (r === 0 && g === 0 && b === 0) {
        // Sometimes black is also added as background
        data[i+3] = 0;
      }
    }

    await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
      .png()
      .toFile(outFile);
    console.log(`Processed ${inFile}`);
  } catch (err) {
    console.error(`Error processing ${inFile}:`, err);
  }
}

async function main() {
  await fixCursor('public/cursor-default.png', 'public/cursor-default.png');
  await fixCursor('public/cursor-pointer.png', 'public/cursor-pointer.png');
}

main();
