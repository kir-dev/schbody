'use client';
import { DialogTrigger } from '@radix-ui/react-dialog';
import React, { ChangeEvent, useCallback, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';

import api from '@/components/network/apiSetup';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import getCroppedImg from '@/lib/cropImage';
import { useToast } from '@/lib/use-toast';

export default function ProfileImageUploadDialog({ onChange }: { onChange: () => Promise<void> }) {
  const { toast } = useToast();
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
        setIsOpen(false);
        onChange();
      } else {
        toast({ title: 'Profilkép feltöltése sikertelen!' });
      }
    } catch (e) {
      console.error(e);
      if (e.status === 413) {
        toast({
          title: 'A kép mérete túl nagy!',
          description: 'Nagyíts bele jobban, méretezd le, vagy válassz másik képet!',
        });
      } else {
        toast({ title: 'Hiba a kép feldolgozása közben!' });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild className='w-full'>
        <Button className='m-auto w-fit' variant='secondary' onClick={() => setIsOpen(true)}>
          Kép szerkesztése
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader className='h-fit w-fit'>
          <div className='h-full flex-col justify-between items-center gap-4'>
            <DialogTitle>Profilkép feltöltése</DialogTitle>
            <DialogDescription>Válassz egy képet és vágd ki a megfelelő részt!</DialogDescription>
            <Input type='file' onChange={handleFileChange} accept='image/*' className='my-8' />
            {imageSrc && (
              <div className='relative h-96 w-96'>
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
          <Button onClick={handleUpload}>Feltöltés</Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
