'use client';
import axios from 'axios';
import { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';

import Th1 from '@/components/typography/typography';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import getCroppedImg from '@/lib/cropImage';

export default function Page() {
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

      const response = await axios.post('/users/me', croppedImageBlob);

      if (response.status === 200) {
        alert('Image uploaded successfully!');
      } else {
        alert('Failed to upload the image.');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to process the image.');
    }
  };

  return (
    <Card className='m-auto p-8 gap-4 flex h-96'>
      <div className='h-full flex flex-col justify-between'>
        <Th1 className='m-0'>Profil kép feltöltése</Th1>
        <Input type='file' onChange={handleFileChange} accept='image/*' />
        <Button onClick={handleUpload}>Feltöltés</Button>
      </div>
      <div className='w-96 h-full'>
        {imageSrc && (
          <div className='relative'>
            <Cropper
              classes={{ containerClassName: 'w-full h-80 rounded' }}
              image={imageSrc.toString()}
              crop={crop}
              zoom={zoom}
              aspect={650 / 900}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
