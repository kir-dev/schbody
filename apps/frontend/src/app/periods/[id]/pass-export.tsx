import { Document, Font, Image, Page, Text, View } from '@react-pdf/renderer';

import { ApplicationEntity } from '@/types/application-entity';

type Props = {
  applicationData: ApplicationEntity[];
  periodName: string;
};

Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
});

export const PassExport = ({ applicationData, periodName }: Props) => (
  <Document>
    <Page
      size='A4'
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        fontFamily: 'Roboto',
      }}
    >
      {applicationData.map((a) => (
        <View key={a.id}>
          <Image
            src={process.env.NEXT_PUBLIC_PASS_BACKGROUND_URL}
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
            {/* TODO use profileImage */}
            <Image src='https://placehold.co/650x900/jpeg' style={{ width: '2.6cm', height: '3.5cm' }} />
            <View style={{ flexDirection: 'column' }}>
              <Text
                style={{
                  backgroundColor: 'lightgray',
                  padding: '0 2mm 1mm 2mm',
                  fontSize: '8pt',
                  width: '37.5mm',
                  borderRadius: '20%',
                  marginTop: '5mm',
                }}
              >
                {a.user.fullName}
              </Text>
              <Text style={{ fontSize: '3pt', marginTop: '1mm' }}>Szobaszám</Text>
              <Text
                style={{
                  marginTop: '0.5mm',
                  backgroundColor: 'lightgray',
                  padding: '0 5mm 1mm 5mm',
                  fontSize: '8pt',
                  width: '15mm',
                  borderRadius: '20%',
                }}
              >
                {a.user.roomNumber}
              </Text>
              <Text style={{ fontSize: '3pt', marginTop: '1mm' }}>Azonosító</Text>
              <Text
                style={{
                  marginTop: '0.5mm',
                  backgroundColor: 'lightgray',
                  padding: '0 5mm 1mm 5mm',
                  fontSize: '8pt',
                  width: '15mm',
                  borderRadius: '20%',
                }}
              >
                {a.id}
              </Text>
              <View
                style={{
                  backgroundColor: 'lightgray',
                  marginTop: '11mm',
                  height: '9mm',
                  width: '1.6cm',
                  borderTopLeftRadius: '20%',
                  borderTopRightRadius: '20%',
                  fontSize: '8pt',
                  fontWeight: 'bold',
                  padding: '1mm 0 1mm 0',
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
