import { MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';
import * as mime from 'mime';
import * as sharp from 'sharp';

export const ImageParserPipe = new ParseFilePipe({
  validators: [new MaxFileSizeValidator({ maxSize: 2_000_000 })], // 2mb
});

export const optimizeImage = async (source: Buffer, resize: boolean): Promise<{ image: Buffer; mimeType: string }> => {
  let image = sharp(source).jpeg({ mozjpeg: true });
  if (resize) {
    image = image.resize(650, 900, { fit: 'cover' });
  }
  const metadata = await image.metadata();
  const mimeType = mime.lookup(metadata.format, 'image/jpeg');
  return { mimeType, image: await image.toBuffer() };
};
