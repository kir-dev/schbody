import { Card, CardTitle } from '@/components/ui/card';

export default function Rules() {
  const rules = [
    'Mindenki a saját testi épségéért felelős! Alkohol vagy drog hatása alatt a teremben tartózkodni, edzeni tilos!',
    'A konditerem csak érvényes BELÉPŐVEL és megfelelő TISZTA CIPŐBEN, ALSÓ- ÉS FELSŐRUHÁZATBAN HASZNÁLHATÓ! A félmeztelen edzés tilos! A kondi belépőnek az edzés ideje alatt végig nálad kell lennie a teremben!',
    'A teremben higiéniai okok miatt mindenkinek saját, megfelelő méretű TÖRÖLKÖZŐ HASZNÁLATA KÖTELEZŐ! Csak a kardió részleg használata esetén is kell törölköző!',
    'A terem csak tiszta, zárt, gumitalpú cipőben használható! Mezítlábas, zoknis és papucsos edzés tilos! A terembe utcai cipőben belépni tilos! Aki megfelelő ruházat nélkül edz, az edzés azonnali megszakítására, és a terem elhagyására kötelezhető.',
    'A konditerembe kizárólag olyan zárt táska hozható be, mely az öltözőszekrénybe nem fér be!',
    'A konditeremben csak edzés céljából tartózkodhatsz!',
    'A teremben étkezni, rágózni és szemetelni tilos! A terembe kizárólag vizet vihetsz be jól zárható műanyag palackban, kulacsban vagy shakerben! Minden egyéb üdítőt és turmixot hagyj a táskák tárolására szolgáló szekrény felső polcán, a HIFI szekrény mellett! A kiürült palackokat dobd ki a szemetesbe!',
    'Tarts rendet és tisztaságot! Tedd a helyére a súlyt, súlyzót, rudat, egyéb eszközöket; ne feltétlenül oda, ahonnan elvetted! Súlyt ne hagyj a rúdon, gépeken, mert a rúd meggörbülhet! Súlyt a rudakon, gépeken és a földön hagyni tilos.',
    'Az izzadtságot töröld le használat után a gépekről! A kardió gépeket minden használat után töröld át fertőtlenítő szerrel!',
    'A gépeket a rendeltetésük szerint használd, áthelyezésük tilos! Kivételt képeznek ezalól a padok! A súlyzók, súlyok és rudak dobálása tilos! Rudak végét csak olyan helyen támaszd a földnek, ahol erre alkalmas gumiborítás van (pl.: T-rudas evezés).',
    'A teremben edzők joga és kötelessége felszólítani a termet nem megfelelően használó egyéneket a házirend betartására.',
    'Akik belépővel nem rendelkező személyt engednek be a terembe, azok belépőjét azonnal visszavonjuk!',
    'A kulcs felvétele után, illetve a kulcs leadása előtt ellenőrizd, hogy minden hibamentesen működik-e, illetve keletkezett-e bármilyen kár a teremben!',
    'Amíg a te belépőd van a portán, jogod van a gépeket nem megfelelően használó embereket felszólítani a helyes használatra! Ha ez nem segít, vagy kár keletkezik a teremben, akkor haladéktalanul értesíts egy Body-köröst!',
    'Mielőtt elviszed valaki belépőjét cserére (ilyenkor kötelező átadni a belépődet, ha kérik), mindenképp kérdezd meg az illetőt, mivel a felelősség a csere után rá hárul. Mi az utolsó portán lévő belépő tulajdonosán tudjuk csak a károkat számon kérni. Más belépőjének hazavitelét fegyelmi pontokkal büntetjük.',
    'A terem nem rendeltetésszerű használatából eredő kárt a károkozóval téríttetjük meg, felelős hiányában a portán lévő belépő tulajdonosa köteles megtéríteni a kárt!',
    'Az elveszett belépő pótlása 1000 HUF, melynek elvesztését azonnal jelezni kell!',
    'Falon, illetve tükrön nyújtani, neki támaszkodni, súlyt neki támasztani szigorúan tilos! Az ablakpárkányra, illetve radiátorra ülni, támaszkodni tilos! A tükörrel való bármilyen fizikai kontaktus azonnali belépőmegvonással jár.',
    'Az öltözőszekrény kulcsának hazavitele figyelmeztetéssel jár! Amennyiben 2 napon belül nem kerül vissza a kulcs, az 5000 HUF díjú zárcserét a kulcsot hazavivő személy köteles megtéríteni!',
    'Teremben mindig a Body-Körösnek van igaza, velük való ellenkezés a belépő visszavonását vonja maga után.',
    'Szigorúan tilos mindenféle kréta-, illetve magnézia por használata!',
    'A teremben található klímaberendezések és radiátorok elállítása tilos.',
    'Az öltözőben hagyott értékekért semmilyen felelősséget nem vállal a Body-Kör.',
    'Aki a fenti pontok bármelyike ellen vét, figyelmeztetésben részesül! 3 figyelmeztetés összegyűjtése azonnali belépő visszavonással jár!',
    'Szándékos rongálás, lopás vagy kirívó házirendsértés végleges eltiltással jár!',
    'A belépő kiadás és visszavonás jogát a kör fenntartja.',
  ];

  return (
    <main>
      <CardTitle className='justify-center my-6'>Schönherz Body-Kör: Konditerem használati rendje</CardTitle>

      <div className='grid grid-cols-1 gap-4'>
        {rules.map((rule, index) => (
          <Card key={index} className='p-2 border'>
            <p>{rule}</p>
          </Card>
        ))}
      </div>
    </main>
  );
}
