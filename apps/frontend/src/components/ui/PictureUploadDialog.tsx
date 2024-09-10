'use client';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { AxiosError } from 'axios';
import { ChangeEvent, PropsWithChildren, useCallback, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import getCroppedImg from '@/lib/cropImage';
import { useToast } from '@/lib/use-toast';

import api from '../network/apiSetup';

type Props = {
  onChange: () => void;
  endpoint: string;
  modalTitle: string;
  aspectRatio: number;
} & PropsWithChildren;

export default function PictureUploadDialog({ children, aspectRatio, onChange, endpoint, modalTitle }: Props) {
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { toast } = useToast();

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
      const response = await api.post(endpoint, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status >= 200 && response.status < 300) {
        toast({ title: 'Profilkép sikeresen feltöltve!' });
        onChange();
        setIsOpen(false);
      } else {
        toast({ title: 'Profilkép feltöltése sikertelen!' });
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        toast({
          title: 'Valami nincs rendben!',
          description:
            'Előfordulhat, hogy a kép mérete túl nagy. Nagyíts bele jobban, méretezd le, vagy válassz másik képet!',
        });
      } else {
        toast({ title: 'Hiba a kép feldolgozása közben!' });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className='max-w-screen sm:max-w-[425px]'>
        <DialogHeader className='h-fit'>
          <div className='h-full flex-col justify-between items-center gap-4'>
            <DialogTitle>{modalTitle}</DialogTitle>
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
                  aspect={aspectRatio}
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
