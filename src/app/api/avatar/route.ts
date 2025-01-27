import sharp from 'sharp';

function getRandomColor() {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
    alpha: 1,
  };
}

function generateSymmetricalPattern(size: number, pixelSize: number) {
  const pixels = size / pixelSize;
  const pattern: number[][] = [];

  // Generate a random pattern for one half and mirror it
  for (let y = 0; y < pixels; y++) {
    const row: number[] = [];
    for (let x = 0; x < Math.ceil(pixels / 2); x++) {
      // Add more creative logic here
      if (y === x || y === pixels - x - 1) {
        row.push(1); // Diagonal symmetry
      } else {
        row.push(Math.random() > 0.5 ? 1 : 0); // Randomly assign 1 or 0
      }
    }
    // Mirror the row for symmetry
    const mirroredRow = [
      ...row,
      ...row.slice(0, Math.floor(pixels / 2)).reverse(),
    ];
    pattern.push(mirroredRow);
  }

  return pattern;
}

function generateAvatar(size: number, pixelSize: number) {
  const primaryColor = getRandomColor();
  const secondaryColor = getRandomColor();
  const pixels = size / pixelSize;

  const pixelPattern: number[][] = generateSymmetricalPattern(size, pixelSize);

  const image = sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: secondaryColor,
    },
  });

  const pixelData = Buffer.alloc(size * size * 4);
  for (let y = 0; y < pixels; y++) {
    for (let x = 0; x < pixels; x++) {
      const color = pixelPattern[y][x] === 1 ? primaryColor : secondaryColor;
      for (let py = 0; py < pixelSize; py++) {
        for (let px = 0; px < pixelSize; px++) {
          const pos = ((y * pixelSize + py) * size + (x * pixelSize + px)) * 4;
          pixelData[pos] = color.r;
          pixelData[pos + 1] = color.g;
          pixelData[pos + 2] = color.b;
          pixelData[pos + 3] = Math.floor(color.alpha * 255);
        }
      }
    }
  }

  return image
    .composite([
      { input: pixelData, raw: { width: size, height: size, channels: 4 } },
    ])
    .png({ quality: 100 })
    .toBuffer();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const size = Number.parseInt(searchParams.get('size') ?? '256');
  const pixelSize = Number.parseInt(searchParams.get('pixelSize') ?? '32');

  const avatarBuffer = await generateAvatar(size, pixelSize);

  return new Response(avatarBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': 'inline; filename="avatar.png"',
    },
  });
}
