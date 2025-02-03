import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Ticket from '@/components/ui/Ticket';
import { ApplicationEntity, ApplicationStatus } from '@/types/application-entity';
import { ApplicationPeriodEntity } from '@/types/application-period-entity';
import { UserEntity } from '@/types/user-entity';
import StatusBadge from '@/components/ui/StatusBadge';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

type Props = {
  user: UserEntity;
  application: ApplicationEntity;
  currentPeriod?: ApplicationPeriodEntity;
};
export default function SubmittedApplicationBannerCard({ user, application, currentPeriod }: Props) {
  const statusEntries = Object.entries(ApplicationStatus);
  const activeIndex = statusEntries.findIndex(([key]) => key === application.status);
  const farestIndex = Math.max(statusEntries.length - 1 - activeIndex, activeIndex);
  const [isHovered, setIsHovered] = useState(false);

  const badgeVariants = {
    hidden: (index: number) => ({
      opacity: 0,
      y: 40,
      transition: { duration: 0.3, ease: 'easeInOut', delay: Math.abs(farestIndex - index) * 0.05 }, // Opacity & position first
    }),
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeInOut',
        delay: Math.abs(activeIndex - index) * 0.05 + farestIndex * 0.02,
      },
    }),
  };

  const shrinkVariants = {
    hidden: (index: number) => ({
      width: 0,
      margin: 0,
      transition: { duration: farestIndex * 0.07 + 0.2, ease: 'easeInOut' },
    }),
    visible: (index: number) => ({
      width: 'auto',
      marginLeft: 2,
      marginRight: 2,
      transition: { duration: farestIndex * 0.04 + 0.3, ease: 'easeInOut' },
    }),
  };

  return (
    <Card className='w-full overflow-hidden'>
      <CardHeader className='md:flex-row max-md:flex-col justify-between gap-2 md:items-start p-2'>
        {!currentPeriod && <CardTitle className='m-4'>Utolsó jelentkezésed</CardTitle>}
        {currentPeriod && (
          <div className='flex flex-col gap-4 justify-start m-4'>
            <CardTitle> Leadott jelentkezés </CardTitle>
            <p>
              A most zajló, <span className='font-bold'>{currentPeriod.name}</span> időszakra már sikeresen
              jelentkeztél!
            </p>
          </div>
        )}
        <motion.div
          className='max-lg:hidden flex items-end'
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          {statusEntries.map(([key], index) => (
            <motion.div
              key={key}
              initial='hidden'
              animate={isHovered || key === application.status ? 'visible' : 'hidden'}
              variants={badgeVariants}
              custom={index}
            >
              <motion.div
                className='flex flex-col gap-2 items-center'
                initial='hidden'
                animate={isHovered || key === application.status ? 'visible' : 'hidden'}
                variants={shrinkVariants} // Separate width animation
              >
                {(key as ApplicationStatus) === application.status && <Ticket user={user} />}
                <StatusBadge
                  status={key as ApplicationStatus}
                  short={(key as ApplicationStatus) !== application.status}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
        <div className='lg:hidden flex flex-col gap-2 items-center mb-2 mr-1'>
          <Ticket user={user} />
          <StatusBadge status={application.status} />
        </div>
      </CardHeader>
    </Card>
  );
}
