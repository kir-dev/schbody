import { Area } from 'react-easy-crop';

export default async function getCroppedImg(
  imageSrc: string | ArrayBuffer,
  mimeType: string,
  cropArea: Area
): Promise<Blob> {
  const image = await createImage(imageSrc);
  // eslint-disable-next-line no-undef
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = cropArea.width;
  canvas.height = cropArea.height;

  ctx.drawImage(
    image,
    cropArea.x * scaleX,
    cropArea.y * scaleY,
    cropArea.width * scaleX,
    cropArea.height * scaleY,
    0,
    0,
    cropArea.width,
    cropArea.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      resolve(blob);
    }, mimeType);
  });
}

function createImage(url: string | ArrayBuffer): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = typeof url === 'string' ? url : '';
  });
}
