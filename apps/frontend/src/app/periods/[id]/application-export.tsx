import { Document, Font, Page, Text, View } from '@react-pdf/renderer';

import { ApplicationEntity } from '@/types/application-entity';

type Props = {
  applicationData: ApplicationEntity[];
  periodName: string;
};

Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
});

export const ApplicationExport = ({ applicationData, periodName }: Props) => (
  <Document>
    <Page
      size='A4'
      style={{
        flexDirection: 'column',
        fontFamily: 'Roboto',
        fontSize: '12pt',
      }}
    >
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: '1cm' }}>
        <Text style={{ width: '100%', textAlign: 'center', fontSize: '16pt', marginTop: '1cm' }}>
          SCH-body belépők listája
        </Text>
        <Text style={{ width: '100%', textAlign: 'center', fontSize: '14pt', marginBottom: '5mm' }}>{periodName}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ width: '70%', padding: '1mm', border: '2pt solid black', textAlign: 'center' }}>
            Teljes név
          </Text>
          <Text style={{ width: '30%', padding: '1mm', border: '2pt solid black', textAlign: 'center' }}>
            NEPTUN kód
          </Text>
        </View>
        {applicationData.map((a) => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }} key={a.id}>
            <Text style={{ width: '70%', padding: '1mm', border: '1pt solid black' }}>{a.user.fullName}</Text>
            <Text style={{ width: '30%', padding: '1mm', border: '1pt solid black', textAlign: 'center' }}>
              {a.user.neptun ?? '-'}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
