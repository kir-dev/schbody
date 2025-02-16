import React from 'react';
import { Body, Html, Preview, Text } from '@react-email/components';
import { ProfilePictureStatus } from '@prisma/client';
import StatusBadge from '@frontend/components/ui/StatusBadge';
import { Header } from './header';
import { Footer } from './footer';
import { ApplicationStatus } from '@frontend/types/application-entity';

export const profilePicStatusChangeEmail = (newStatus: ProfilePictureStatus, hadActiveApplication: boolean) => {
  return (
    <Html>
      <Header />
      <Preview>
        {newStatus === ProfilePictureStatus.ACCEPTED ? 'Profilképedet elfogadták' : 'Profilképed elutasításra került'}
      </Preview>
      {newStatus === ProfilePictureStatus.ACCEPTED &&
        (hadActiveApplication ? (
          <Body>
            <Text>
              SCHBody-s profilképed elfogadásra került, így mostantól aktív, elbírálás alatt álló jelentkezéseid is
              elfogadottaknak tekintjük.
            </Text>
            <div className='flex w-full justify-center'>
              <StatusBadge status={ApplicationStatus.ACCEPTED} />
            </div>
            <Text>Mostmár nincs más dolgod, mint hátradőlni és várni a belépőosztást.</Text>
          </Body>
        ) : (
          <Body>
            <Text>
              SCHBody-s profilképed elfogadásra került. Jelenleg nincs aktív, elbírálás alatt álló jelentkezésed,
              amennyiben szertnél kondibelépőt, feltétlen adj le egyet!
            </Text>
          </Body>
        ))}
      {newStatus === ProfilePictureStatus.REJECTED &&
        (hadActiveApplication ? (
          <Body>
            <Text>
              SCHBody-s profilképed elutasításra került, így az aktív, még elbírálás alatt álló jelentkezésed is
              elutasítottá vált.
            </Text>
            <div className='flex w-full justify-center'>
              <StatusBadge status={ApplicationStatus.REJECTED} />
            </div>
            <Text>
              Ahhoz, hogy a jelentkezésed újra elfogadható legyen, fel kell töltened egy új profilképet és egy adminnak
              el kell fogadnia azt. Új jelentkezést nem kell leadnod az időszakon belül.
            </Text>
            <Text>
              Figyelj arra, hogy betartsd a profilképpel kapcsolatos elvárásokat!
              <ul>
                <li>Csak te szerepelj a képen!</li>
                <li>A kivágásban csupán nagytól felfelé legyél benne!</li>
                <li>Legyél felismerhető a képen!</li>
              </ul>
            </Text>
          </Body>
        ) : (
          <Body>
            <Text>
              SCHBody-s profilképed elutasításra került. Ahhoz, hogy a későbbiekben jelentkezésed elfogadható legyen,
              tölts fel egy új profilképet!
            </Text>
            <Text>
              Figyelj arra, hogy betartsd a profilképpel kapcsolatos elvárásokat!
              <ul>
                <li>Csak te szerepelj a képen!</li>
                <li>A kivágásban csupán nagytól felfelé legyél benne!</li>
                <li>Legyél felismerhető a képen!</li>
              </ul>
            </Text>
          </Body>
        ))}
      <Footer />
    </Html>
  );
};
