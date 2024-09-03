'use client';
import { ChangeEvent, useCallback, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';

import api from '@/components/network/apiSetup';
import Th1 from '@/components/typography/typography';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import getCroppedImg from '@/lib/cropImage';
import { useToast } from '@/lib/use-toast';

export default function Page() {
  const { toast } = useToast();
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
    }
  };

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const mimeType = 'image/jpeg';
      const croppedImageBlob = await getCroppedImg(imageSrc, mimeType, croppedAreaPixels);

      const data = new FormData();
      data.append('image', croppedImageBlob);
      const response = await api.post('/users/me/profile-picture', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status >= 200 && response.status < 300) {
        toast({ title: 'Profilkép sikeresen feltöltve!' });
      } else {
        toast({ title: 'Profilkép feltöltése sikertelen!' });
      }
    } catch (e) {
      console.error(e);
      toast({ title: 'Hiba a kép feldolgozása közben!' });
    }
  };

  return (
    <Card className='m-auto p-8 gap-4 flex h-96'>
      <div className='h-full flex flex-col justify-between'>
        <Th1 className='m-0'>Profil kép feltöltése</Th1>
        <Input type='file' onChange={handleFileChange} accept='image/*' />
        <Button onClick={handleUpload}>Feltöltés</Button>
      </div>
      {/*https://valentinh.github.io/react-easy-crop/*/}
      <div className='h-full w-96'>
        {imageSrc && (
          <div className='relative'>
            <Cropper
              classes={{
                containerClassName: 'w-full h-80 rounded ',
              }}
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
