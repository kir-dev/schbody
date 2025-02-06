import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Ticket from '@/components/ui/Ticket';
import { ApplicationEntity, ApplicationStatus } from '@/types/application-entity';
import { ApplicationPeriodEntity } from '@/types/application-period-entity';
import { UserEntity } from '@/types/user-entity';
import StatusBadge, { colorfx, iconfx } from '@/components/ui/StatusBadge';
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

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
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const badgeVariants = {
    hidden: (index: number) => ({
      opacity: 0,
      y: 40,
      transition: { duration: 0.3, ease: 'easeInOut', delay: Math.abs(farestIndex - index) * 0.05 + 2 }, // Opacity & position first
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
    hidden: () => ({
      width: 0,
      marginLeft: 0,
      marginRight: 0,
      transition: { duration: farestIndex * 0.07 + 0.2, ease: 'easeInOut', delay: 2 },
    }),
    visible: () => ({
      width: 'auto',
      marginLeft: 2,
      marginRight: 2,
      transition: { duration: farestIndex * 0.04 + 0.3, ease: 'easeInOut' },
    }),
  };

  const badgeExpandedVariants = {
    hidden: () => ({
      width: 0,
      opacity: 0,
      transition: { duration: 0.4, ease: 'easeInOut' },
    }),
    visible: () => ({
      width: 'auto',
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeInOut' },
    }),
  };

  const handleMouseEnter = (key: string) => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    setHoveredKey(key);
  };

  const handleMouseLeave = (key: string) => {
    hoverTimeout.current = setTimeout(() => {
      setHoveredKey(null);
    }, 1500);
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
          className='max-lg:hidden flex items-end mr-1'
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          {statusEntries.map(([key], index) => (
            <motion.div
              key={key}
              initial='hidden'
              animate={isHovered ? 'visible' : 'hidden'}
              variants={badgeVariants}
              custom={index}
            >
              <motion.div
                className='flex flex-col gap-2 items-center'
                initial='hidden'
                animate={isHovered ? 'visible' : 'hidden'}
                variants={shrinkVariants}
              >
                {(key as ApplicationStatus) === application.status && <Ticket user={user} />}
                <Badge
                  variant={colorfx(key as ApplicationStatus)}
                  hover={false}
                  className='w-fit flex items-center overflow-hidden'
                  onMouseEnter={() => handleMouseEnter(key)}
                  onMouseLeave={() => handleMouseLeave(key)}
                >
                  <div className='py-1 -mx-1'>{iconfx(key as ApplicationStatus)}</div>
                  <motion.div
                    className='whitespace-nowrap'
                    initial='hidden'
                    animate={hoveredKey && hoveredKey === key ? 'visible' : 'hidden'}
                    variants={badgeExpandedVariants}
                  >
                    <p className='ml-3'>{key as ApplicationStatus}</p>
                  </motion.div>
                </Badge>
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
