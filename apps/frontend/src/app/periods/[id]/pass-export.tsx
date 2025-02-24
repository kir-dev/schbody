import { ApplicationEntity } from '@/types/application-entity';
import { Document, Font, Image, Page, Text, View } from '@react-pdf/renderer';
import React from 'react';

type Props = {
  applicationData: ApplicationEntity[];
  periodName: string;
  periodId: number;
  cacheBuster: number;
  mock?: boolean;
};

Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
});

//Pass size: 7.5cm x 4.4cm
export const PassExport = ({ applicationData, periodName, periodId, cacheBuster, mock = false }: Props) => {
  const width = 7.5 * Math.ceil(applicationData.length / 14) * 28.3464567 + 10;
  return (
    <Document>
      <Page
        size={{ width, height: 1740 }}
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          fontFamily: 'Roboto',
          alignItems: 'center',
          padding: '2 2 2 2',
        }}
        wrap={false}
      >
        {applicationData.map((a) => (
          <View key={a.id}>
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/application-periods/${periodId}/pass-bg?cb=${cacheBuster}`}
              style={{ width: '7.5cm', height: '4.3cm', position: 'absolute', top: 0, left: 0, zIndex: -1 }}
            />

            <View
              style={{
                width: '7.5cm',
                height: '4.3cm',
                flexDirection: 'row',
                gap: '1.5mm',
                padding: '3mm 6mm 0 4mm',
              }}
            >
              <Image
                src={
                  mock
                    ? 'https://placehold.co/650x900/jpeg'
                    : `${process.env.NEXT_PUBLIC_API_URL}/users/${a.user.authSchId}/profile-picture`
                }
                style={{ width: '2.6cm', height: '3.5cm', borderRadius: '10px' }}
              />
              <View style={{ flexDirection: 'column' }}>
                <Text
                  style={{
                    backgroundColor: 'lightgray',
                    padding: '0 2mm 1mm 2mm',
                    fontSize: '8pt',
                    width: '37.5mm',
                    marginTop: '5mm',
                    borderRadius: '10px',
                  }}
                >
                  {a.user.fullName}
                </Text>
                <View
                  style={{
                    marginTop: '1.5mm',
                    backgroundColor: 'lightgray',
                    padding: '0mm 1mm 1mm 1mm',
                    width: '15mm',
                    borderRadius: '10px',
                  }}
                >
                  <Text style={{ fontSize: '3pt', textAlign: 'center' }}>Szobaszám</Text>
                  <Text style={{ width: '100%', fontSize: '8pt', textAlign: 'center' }}>
                    {a.user.roomNumber || 'Külsős'}
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: '1.5mm',
                    backgroundColor: 'lightgray',
                    padding: '0mm 1mm 1mm 1mm',
                    width: '15mm',
                    borderRadius: '10px',
                  }}
                >
                  <Text style={{ fontSize: '3pt', textAlign: 'center' }}>Azonosító</Text>
                  <Text style={{ width: '100%', fontSize: '8pt', textAlign: 'center' }}>{a.id}</Text>
                </View>

                <View
                  style={{
                    backgroundColor: 'lightgray',
                    marginTop: '11mm',
                    height: '9mm',
                    width: '1.6cm',
                    borderTopLeftRadius: '20px',
                    borderTopRightRadius: '20px',
                    fontSize: '8pt',
                    fontWeight: 'bold',
                    padding: '0.5mm 0 1mm 0',
                  }}
                >
                  <Text style={{ width: '100%', textAlign: 'center' }}>{periodName.split(' ')[0]}</Text>
                  <Text style={{ width: '100%', textAlign: 'center' }}>{periodName.split(' ')[1]}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};
