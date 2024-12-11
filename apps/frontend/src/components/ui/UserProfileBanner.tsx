'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiEdit2, FiLogOut, FiSave } from 'react-icons/fi';
import { RiVerifiedBadgeLine } from 'react-icons/ri';
import { useSWRConfig } from 'swr';

import { Th2, TTitle } from '@/components/typography/typography';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import RoleBadge from '@/components/ui/RoleBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserTimeStampsBlock } from '@/components/ui/UserTimeStampsBlock';
import { useMyApplications } from '@/hooks/useMyApplications';
import { UserEntity } from '@/types/user-entity';

import PictureUploadDialog from './PictureUploadDialog';

export default function UserProfileBanner(props: {
  user: UserEntity | undefined;
  editingIsOn: boolean;
  setEditingIsOn: (e: boolean) => void;
  onSubmit: () => void;
}) {
  const router = useRouter();
  const [cacheBuster, setCacheBuster] = useState(Date.now());
  const { mutate } = useSWRConfig();
  //const [applications, setApplications] = useState<ApplicationPeriodEntity[] | undefined>(undefined);
  const { data: applications } = useMyApplications();

  /*  useEffect(() => {
    if (!applications) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/application`, {
        method: 'GET',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch applications');
          }
          console.log(response.json());
        })
        .catch((error) => console.error('Error fetching applications:', error));
    }
  }, []);*/

  const handleProfilePictureUpload = async () => {
    setCacheBuster(Date.now());
  };
  const onLogout = () => {
    fetch('/auth/logout').then(() => {
      mutate(() => true, undefined, { revalidate: false });
      router.refresh();
      router.push('/');
    });
  };

  const getVerifiedBadge = () => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <RiVerifiedBadgeLine size={36} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className='font-sans'>Igazolt VIK hallgató</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  if (!props.user) return null;
  return (
    <Card className='flex max-md:flex-col md:flex-row max-md:items-center  relative'>
      <div className='min-w-44 min-h-44 md:w-1/5 max-md:w-44 h-full relative'>
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/users/${props.user.authSchId}/profile-picture?cb=${cacheBuster}`}
          alt='PROFIL KEP'
          className='md:rounded-l max-md:rounded-xl max-md:my-4'
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = 'default_pfp.jpg';
          }}
        />
        <div className='w-full absolute flex bottom-2'>
          <PictureUploadDialog
            aspectRatio={650 / 900}
            modalTitle='Profilkép feltöltése'
            onChange={handleProfilePictureUpload}
            endpoint='/users/me/profile-picture'
          >
            <Button className='m-auto w-fit' variant='secondary'>
              Kép szerkesztése
            </Button>
          </PictureUploadDialog>
        </div>
      </div>
      <CardContent className='w-full md:ml-4'>
        <div className='flex md:flex-row max-md:flex-col max-md:items-center max-md:gap-4 mt-10 justify-between '>
          <div className='max-md:flex max-md:flex-col max-md:items-center'>
            <div className='flex gap-2 items-start'>
              <TTitle className='mt-0'>{props.user!.fullName}</TTitle>
              {props.user.isActiveVikStudent && getVerifiedBadge()}
            </div>
            <div className='flex md:flex-row max-md:flex-col max-md:items-center max-md:gap-4 min-md:gap-2'>
              <RoleBadge role={props.user!.role} hover={false} />
              <div className='mb-4 mr-5' />
              <Th2>{props.user!.neptun}</Th2>
            </div>
            <div className='mb-4 mr-5' />
            {/* Render the applications data in a table */}
            <div className='overflow-y-auto border border-gray-300 max-h-64 rounded-md shadow-md mb-8'>
              <h3 className='text-lg font-semibold mb-2'>Aktív jelentkezési időszakok:</h3>
              <table className='table-auto w-full text-left'>
                <thead className='bg-gray-100 sticky top-0 z-10'>
                  <tr>
                    <th className='px-4 py-2'>Jelentkezett</th>
                    <th className='px-4 py-2'>Lejár</th>
                  </tr>
                </thead>
                <tbody>
                  {applications &&
                    [applications].map((app) => (
                      <tr key={app.id} className='odd:bg-white even:bg-gray-50'>
                        <td className='px-4 py-2'>
                          {new Date(app.applicationPeriod.applicationPeriodStartAt).toLocaleDateString()}
                        </td>
                        {/*todo plusz hat honap*/}
                        <td className='px-4 py-2'>
                          {new Date(app.applicationPeriod.applicationPeriodEndAt).toLocaleDateString()}
                        </td>
                        <td>
                          <StatusBadge status={app.status} />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className='flex gap-4 max-lg:flex-col lg:flex-row max-md:w-full'>
            {!props.editingIsOn && (
              <>
                <Button variant='secondary' onClick={() => props.setEditingIsOn(true)}>
                  <FiEdit2 />
                  Adatok szerkesztése
                </Button>
                <Button variant='destructive' onClick={onLogout}>
                  <FiLogOut />
                  Kijelentkezés
                </Button>
              </>
            )}
            {props.editingIsOn && (
              <>
                <Button type='submit'>
                  <FiSave />
                  Mentés
                </Button>
                <Button variant='destructive' onClick={() => props.setEditingIsOn(false)}>
                  Mégse
                </Button>
              </>
            )}
          </div>
        </div>
        <UserTimeStampsBlock user={props.user} />
      </CardContent>
    </Card>
  );
}
