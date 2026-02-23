import api from '@/components/network/apiSetup';

export const exportProfilePictures = async (userIds?: string[]) => {
  const response = await api.post(
    'users/profile-pictures/export',
    { userIds: userIds ?? [] },
    { responseType: 'blob' }
  );
  const objectUrl = URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }));
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = 'profile-pictures.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
};
