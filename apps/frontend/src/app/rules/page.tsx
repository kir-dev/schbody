import React from 'react';

import Th1 from '@/components/typography/typography';
import { Card, CardContent } from '@/components/ui/card';

type Rule = {
  rule: string;
  key: string;
};
export default function Rules() {
  const rules: Rule[] = [
    {
      rule: 'Mindenki a saját testi épségéért felelős! Alkohol vagy drog hatása alatt a teremben tartózkodni, edzeni tilos!',
      key: 'personal-safety',
    },
    {
      rule: 'A konditerem csak érvényes BELÉPŐVEL és megfelelő TISZTA CIPŐBEN, ALSÓ- ÉS FELSŐRUHÁZATBAN HASZNÁLHATÓ! A félmeztelen edzés tilos! A kondi belépőnek az edzés ideje alatt végig nálad kell lennie a teremben!',
      key: 'proper-attire',
    },
    {
      rule: 'A teremben higiéniai okok miatt mindenkinek saját, megfelelő méretű TÖRÖLKÖZŐ HASZNÁLATA KÖTELEZŐ! Csak a kardió részleg használata esetén is kell törölköző!',
      key: 'towel-mandatory',
    },
    {
      rule: 'A terem csak tiszta, zárt, gumitalpú cipőben használható! Mezítlábas, zoknis és papucsos edzés tilos! A terembe utcai cipőben belépni tilos! Aki megfelelő ruházat nélkül edz, az edzés azonnali megszakítására, és a terem elhagyására kötelezhető.',
      key: 'clean-footwear',
    },
    {
      rule: 'A konditerembe kizárólag olyan zárt táska hozható be, mely az öltözőszekrénybe nem fér be!',
      key: 'bag-restriction',
    },
    {
      rule: 'A konditeremben csak edzés céljából tartózkodhatsz!',
      key: 'training-only',
    },
    {
      rule: 'A teremben étkezni, rágózni és szemetelni tilos! A terembe kizárólag vizet vihetsz be jól zárható műanyag palackban, kulacsban vagy shakerben! Minden egyéb üdítőt és turmixot hagyj a táskák tárolására szolgáló szekrény felső polcán, a HIFI szekrény mellett! A kiürült palackokat dobd ki a szemetesbe!',
      key: 'no-food-drink',
    },
    {
      rule: 'Tarts rendet és tisztaságot! Tedd a helyére a súlyt, súlyzót, rudat, egyéb eszközöket; ne feltétlenül oda, ahonnan elvetted! Súlyt ne hagyj a rúdon, gépeken, mert a rúd meggörbülhet! Súlyt a rudakon, gépeken és a földön hagyni tilos.',
      key: 'equipment-order',
    },
    {
      rule: 'Az izzadtságot töröld le használat után a gépekről! A kardió gépeket minden használat után töröld át fertőtlenítő szerrel!',
      key: 'clean-equipment',
    },
    {
      rule: 'A gépeket a rendeltetésük szerint használd, áthelyezésük tilos! Kivételt képeznek ezalól a padok! A súlyzók, súlyok és rudak dobálása tilos! Rudak végét csak olyan helyen támaszd a földnek, ahol erre alkalmas gumiborítás van (pl.: T-rudas evezés).',
      key: 'equipment-use',
    },
    {
      rule: 'A teremben edzők joga és kötelessége felszólítani a termet nem megfelelően használó egyéneket a házirend betartására.',
      key: 'trainer-authority',
    },
    {
      rule: 'Akik belépővel nem rendelkező személyt engednek be a terembe, azok belépőjét azonnal visszavonjuk!',
      key: 'unauthorized-entry',
    },
    {
      rule: 'A kulcs felvétele után, illetve a kulcs leadása előtt ellenőrizd, hogy minden hibamentesen működik-e, illetve keletkezett-e bármilyen kár a teremben!',
      key: 'check-equipment',
    },
    {
      rule: 'Amíg a te belépőd van a portán, jogod van a gépeket nem megfelelően használó embereket felszólítani a helyes használatra! Ha ez nem segít, vagy kár keletkezik a teremben, akkor haladéktalanul értesíts egy Body-köröst!',
      key: 'user-responsibility',
    },
    {
      rule: 'Mielőtt elviszed valaki belépőjét cserére (ilyenkor kötelező átadni a belépődet, ha kérik), mindenképp kérdezd meg az illetőt, mivel a felelősség a csere után rá hárul. Mi az utolsó portán lévő belépő tulajdonosán tudjuk csak a károkat számon kérni. Más belépőjének hazavitelét fegyelmi pontokkal büntetjük.',
      key: 'entry-exchange',
    },
    {
      rule: 'A terem nem rendeltetésszerű használatából eredő kárt a károkozóval téríttetjük meg, felelős hiányában a portán lévő belépő tulajdonosa köteles megtéríteni a kárt!',
      key: 'damage-liability',
    },
    {
      rule: 'Az elveszett belépő pótlása 1000 HUF, melynek elvesztését azonnal jelezni kell!',
      key: 'lost-entry',
    },
    {
      rule: 'Falon, illetve tükrön nyújtani, neki támaszkodni, súlyt neki támasztani szigorúan tilos! Az ablakpárkányra, illetve radiátorra ülni, támaszkodni tilos! A tükörrel való bármilyen fizikai kontaktus azonnali belépőmegvonással jár.',
      key: 'no-contact',
    },
    {
      rule: 'Az öltözőszekrény kulcsának hazavitele figyelmeztetéssel jár! Amennyiben 2 napon belül nem kerül vissza a kulcs, az 5000 HUF díjú zárcserét a kulcsot hazavivő személy köteles megtéríteni!',
      key: 'locker-key',
    },
    {
      rule: 'Teremben mindig a Body-Körösnek van igaza, velük való ellenkezés a belépő visszavonását vonja maga után.',
      key: 'authority-respect',
    },
    {
      rule: 'Szigorúan tilos mindenféle kréta-, illetve magnézia por használata!',
      key: 'chalk-ban',
    },
    {
      rule: 'A teremben található klímaberendezések és radiátorok elállítása tilos.',
      key: 'no-adjustment',
    },
    {
      rule: 'Az öltözőben hagyott értékekért semmilyen felelősséget nem vállal a Body-Kör.',
      key: 'locker-responsibility',
    },
    {
      rule: 'Aki a fenti pontok bármelyike ellen vét, figyelmeztetésben részesül! 3 figyelmeztetés összegyűjtése azonnali belépő visszavonással jár!',
      key: 'rule-violations',
    },
    {
      rule: 'Szándékos rongálás, lopás vagy kirívó házirendsértés végleges eltiltással jár!',
      key: 'severe-penalties',
    },
    {
      rule: 'A belépő kiadás és visszavonás jogát a kör fenntartja.',
      key: 'entry-rights',
    },
  ];

  return (
    <>
      <Th1>Konditerem használati rendje</Th1>

      <div className='flex flex-col gap-4 w-full'>
        {rules.map((rule) => (
          <Card key={rule.key}>
            <CardContent className='p-4'>
              <p>{rule.rule}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
