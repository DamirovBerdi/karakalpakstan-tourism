import { guides, hotels, transportRoutes } from '@/data/tourism';

export interface KnowledgeEntry {
  id: string;
  keywords: string[];
  en: string;
  ru: string;
  uz: string;
  kaa: string;
}

const cheapFoodText = {
  en: `Here are the best budget food options in Nukus:

• Bazaar eateries — a plate of laghman (noodle soup) or plov costs about 15,000–25,000 UZS ($1.20–$2). Look for busy stalls inside the Nukus Bazaar — high turnover means fresh food.
• Samsa stands — freshly baked meat pastries for 3,000–5,000 UZS each ($0.25–$0.40). Two or three make a filling meal.
• Choyhona (teahouses) — a bowl of shurpa (meat soup) with bread runs about 12,000–18,000 UZS ($1–$1.50). Tea is often free or 2,000 UZS.
• Street-corner non (bread) — a round of fresh tandoor bread is 3,000–4,000 UZS. Pair it with some market tomatoes and cucumber for an ultra-cheap lunch.

Don't worry if you're low on cash — you can eat very well for under $3 a day in Karakalpakstan!`,
  ru: `Вот лучшие бюджетные варианты еды в Нукусе:

• Лагунки на базаре — тарелка лагмана (лапша с супом) или плова стоит около 15,000–25,000 UZS ($1.20–$2). Ищите оживлённые лотки внутри Нукусского базара — большой поток означает свежесть.
• Самса — свежеиспечённые мясные пирожки по 3,000–5,000 UZS каждый ($0.25–$0.40). Два-три — сытный обед.
• Чайханы — миска шурпы (мясной суп) с хлебом стоит около 12,000–18,000 UZS ($1–$1.50). Чай часто бесплатный или 2,000 UZS.
• Уличный нон (хлеб) — круглый свежий тандырный хлеб за 3,000–4,000 UZS. С базарными помидорами и огурцом — супер-дешёвый обед.

Не волнуйтесь, если у вас мало денег — в Каракалпакстане можно очень вкусно поесть меньше чем за $3 в день!`,
  uz: `Nukusda eng arzon taom variantlari:

• Bozor oshxonalari — bir laganda lag'mon yoki palov narxi 15,000–25,000 UZS ($1.20–$2). Nukus bozoridagi odamlar ko'p bo'lgan joylarni tanlang — yangi taom kafolati.
• Samsa — yangi pishirilgan go'shtli piroglar 3,000–5,000 UZS ($0.25–$0.40). Ikki-uchtasi to'qlik qiladi.
• Choyxona — sho'rva va non bilan 12,000–18,000 UZS ($1–$1.50). Choy ko'pincha bepul yoki 2,000 UZS.
• Ko'chadagi non — yangi tandir noni 3,000–4,000 UZS. Bozor pomidor va bodringi bilan — arzon tushlik.

Pulingiz kam bo'lsa xavturmang — Qoraqalpog'istonda kuniga $3 dan kam ovqatlanish mumkin!`,
  kaa: `Nókiste eń arzan azıq variantları:

• Bazar ashxanaları — bir tabaq laghman yaki palov bahası 15,000–25,000 UZS ($1.20–$2). Nókis bazarında adamlar kóp bolǵan orınlardı tańlań — janı azıq kepilligi.
• Samsa — janı pisirilgen góshli piroglari 3,000–5,000 UZS ($0.25–$0.40). Eki-úshewi toqlıq qıladı.
• Shayxana — shurpa hám non menen 12,000–18,000 UZS ($1–$1.50). Shay kóbinese biypul yaki 2,000 UZS.
• Kóshedeǵi non — janı tandır nonı 3,000–4,000 UZS. Bazar pomidor hám qabıǵı menen — arzan túslik.

Pulińız az bolsa qáwiplenbesiń — Qaraqalpaqstanda kúnine $3 tan kem awqatlanıw múmkin!`,
};

const muynakTransport = {
  en: `Here's how to reach Muynak (Moynaq) on a budget:

• Shared taxi from Nukus — about 8 USD per seat, 2.5 hours. Departures at 07:00, 09:00, and 12:00 from the Nukus shared-taxi stand. This is the most convenient budget option.
• Bus Nukus → Kungrad → Muynak — about $3 total. Take a bus from Nukus to Kungrad (1.5 hrs, $3), then a shared taxi the last stretch to Muynak (~$3–4). Cheapest but slower.
• Hitchhike from Kungrad — in a pinch, trucks and locals driving to the ship graveyard sometimes pick up travelers. Always offer to pay for fuel.

Tip: the last shared taxis back to Nukus leave Muynak around 15:00 — don't miss it or you'll need to arrange a private taxi ($25+). Carry water and snacks; there's almost nothing between Kungrad and Muynak.

Don't worry if you're low on cash — the bus + shared taxi combo gets you there for under $8!`,
  ru: `Как дёшево добраться до Муйнака:

• Совместное такси из Нукуса — около $8 за место, 2.5 часа. Отправление в 07:00, 09:00 и 12:00 от нукусской стоянки такси. Самый удобный бюджетный вариант.
• Автобус Нукус → Кунград → Муйнак — около $3. Сначала автобус из Нукуса в Кунград (1.5 ч, $3), затем совместное такси до Муйнака (~$3–4). Дешевле, но дольше.
• Голосование от Кунграда — грузовики и местные жители иногда берут путешественников. Всегда предлагайте оплатить топливо.

Совет: последние совместные такси обратно в Нукус уходят из Муйнака около 15:00 — не опоздайте, иначе придётся нанимать частное такси ($25+). Берите воду и перекус — между Кунградом и Муйнаком почти ничего нет.

Не волнуйтесь, если у вас мало денег — автобус плюс такси довезут вас меньше чем за $8!`,
  uz: `Mo'ynoqqa arzon qanday borish:

• Birgalashda taksi Nukusdan — taxminan $8, 2.5 soat. Jo'nash 07:00, 09:00, 12:00. Eng qulay arzon variant.
• Avtobus Nukus → Qo'ng'irot → Mo'ynoq — taxminan $3. Nukusdan Qo'ng'irotda avtobus (1.5 soat, $3), so'ng Mo'ynoqqa taksi (~$3–4). Eng arzon, lekin sekinroq.
• Qo'ng'irotdan stop — yuk mashinalari ba'zan sayohatchilarni oladi. Yoqilg'i pulini taklif qiling.

Maslahat: Mo'ynoqdan Nukusga so'nggi taksilar 15:00 atrofida ketadi — o'tkazib yuborsangiz shaxsiy taksi ($25+) kerak. Suv va ovqat oling — Qo'ng'irot bilan Mo'ynoq orasida deyarli hech narsa yo'q.

Pulingiz kam bo'lsa xavturmang — avtobus va taksi bilan $8 dan kamda borish mumkin!`,
  kaa: `Moynaqqa arzan qalay barıw:

• Ulaspalı taksi Nókisten — shama menen $8, 2.5 saat. Ketiw 07:00, 09:00, 12:00. Eń qolay arzan variant.
• Avtobus Nókis → Qońırat → Moynaq — shama menen $3. Nókisten Qońıratqa avtobus (1.5 saat, $3), soń Moynaqqa taksi (~$3–4). Eń arzan, biraq awırıraq.
• Qońırattan stop — juk mashinaları geyde sayaxatshılardı aladı. Janar may pulın usınıń.

Maslahat: Moynaqtan Nókiske sońǵı taksiler 15:00 átirapında ketedi — qaldırıpsańız jeke taksi ($25+) kerek. Suw hám azıq alıń — Qońırat menen Moynaq arasında derlik hesh nárse joq.

Pulińız az bolsa qáwiplenbesiń — avtobus hám taksi menen $8 tan azda barıw múmkin!`,
};

const aralSeaHistory = {
  en: `Welcome to the Aral Sea — one of the world's greatest environmental tragedies. I'm your virtual guide, standing here with you in spirit.

The Aral Sea was once the fourth-largest lake on Earth, covering 68,000 km². It was so vast that local fishermen called it "a sea." Towns like Muynak were thriving fishing ports, shipping thousands of tons of fish across the Soviet Union.

What happened? In the 1960s, Soviet engineers diverted the Amu Darya and Syr Darya rivers to irrigate massive cotton fields in the desert. The water stopped reaching the Aral. Year by year, the sea shrank. By the 1980s, Muynak's fishing fleet was stranded kilometers from the water. Today the sea has lost over 90% of its original volume.

What you can see now:
• The retreating shoreline left behind vast salt flats — the "Aralkum" desert, a new man-made desert.
• Rusting fishing boats lie where the harbor once was — silent monuments to a lost way of life.
• Toxic dust storms from the dry seabed blow salt and pesticides across the region.

Yet there's hope: the North Aral Sea (in Kazakhstan) has been partially restored by a dam, and fish are returning. Stand here, feel the wind, and remember — this place tells a story the whole world needs to hear. Take your time. I'm here if you want to hear more.`,
  ru: `Добро пожаловать на Аральское море — место одной из величайших экологических трагедий мира. Я ваш виртуальный гид, стоящий здесь с вами духом.

Аральское море когда-то было четвёртым по величине озером планеты, занимая 68,000 км². Оно было настолько огромным, что местные рыбаки называли его "морем". Города вроде Муйнака были процветающими рыбными портами, отправлявшими тысячи тонн рыбы по всему СССР.

Что произошло? В 1960-х годах советские инженеры отвели реки Амударья и Сырдарья для орошения огромных хлопковых полей в пустыне. Вода перестала поступать в Арал. Год за годом море усыхало. К 1980-м годам рыболовецкий флот Муйнака оказался в километрах от воды. Сегодня море потеряло более 90% своего первоначального объёма.

Что вы видите сейчас:
• Отступающая береговая линия оставила обширные солончаки — пустыню "Аралкум", новую рукотворную пустыню.
• Ржавые рыболовные суда лежат там, где когда-то была гавань — немые памятники утраченному образу жизни.
• Токсичные пыльные бури с сухого морского дна разносят соль и пестициды по региону.

Но есть надежда: Северное Аральское море (в Казахстане) было частично восстановлено плотиной, и рыба возвращается. Постойте здесь, почувствуйте ветер и помните — это место рассказывает историю, которую весь мир должен услышать. Не торопитесь. Я здесь, если хотите узнать больше.`,
  uz: `Orol dengiziga xush kelibsiz — dunyodagi eng katta ekologik fojialardan biri. Men sizning virtual gidingizman, ruhan yoningga turganman.

Orol dengizi bir vaqtlar Yerdagi to'rtinchi eng katta ko'l bo'lib, 68,000 km² maydonni egallagan. Shunchalik katta ediki, mahalliy baliqchilar uni "dengiz" deb atagan. Mo'ynoq kabi shaharlar gullab-yashnagan baliq ovlash portlari bo'lib, butun SSSR bo'ylab minglab tonna baliq yuborgan.

Nima bo'ldi? 1960-yillarda sovet muhandislari Amudaryo va Sirdaryo daryolarini cho'ldagi katta paxta maydonlarini sug'orishga burib yubordi. Suv Orolga yetmay qoldi. Yildan yilga dengiz kichraydi. 1980-yillarga kelib, Mo'ynoqning baliq ovlash floti suvdan kilometrlar uzoqda qoldi. Bugungi kunda dengiz dastlabki hajmning 90% dan ko'prog'ini yo'qotgan.

Hozir nima ko'rasiz:
• Chekingan qirg'oq chizig'i katta sho'rxoklarni qoldirdi — "Orolqum" cho'li, yangi sun'iy cho'l.
• Zanglagan baliq ovlash kemalari bir paytlar port bo'lgan joyda yotadi — yo'qolgan turmush tarzining so'nggi ramzlari.
• Quruq tubdan zaharli chang bo'ronlari mintaqa bo'ylab tuz va pestitsidlarni sochadi.

Ammo umid bor: Shimoliy Orol dengizi (Qozog'istonda) to'g'on bilan qisman tiklangan va baliqlar qaytmoqda. Shu yerda turing, shamolni his qiling va eslang — bu joy butun dunyo eshitishi kerak bo'lgan hikoyani so'zlaydi. Shoshilmasdan. Ko'proq bilmoqchi bo'lsangiz, men shu yerdaman.`,
  kaa: `Aral teńizine xosh keldińiz — dúnyadaǵı eń ulıwma ekologiyalıq qıyınıshlıqlardan biri. Men sizdiń virtual gidińizman, ruhan jańında turǵanman.

Aral teńizi bir waqıtları Jerdegi tórtinshi eń úlken kól bolıp, 68,000 km² maydandı iyelegen. Sonshalıq úlken bolǵanlıqtan, jergilikli balıqshılar onı "teńiz" dep ataǵan. Moynaq sıyaqlı qalalar gúllep-jasnap atırǵan balıq awlaw portları bolıp, pútkin SSSR boyınsha mıńlaǵan tonna balıq jibergen.

Nede boldı? 1960-jıllarda sovet injenerleri Ámiwdárya hám Sırdárya dáryaların shóldagi úlken paxta maydanların suǵarıwǵa burıp jiberdi. Suw Aralǵa jetpey qaldı. Jıldan-jılǵa teńiz kishireydi. 1980-jıllarga kelip, Moynaq balıq awlaw flotı suwdan kilometrlar uzaqlıqta qaldı. Búgin teńiz dáslepki muǵdardıń 90% inen kóbin joǵaltqan.

Házir ne kóresiz:
• Shegingen qıyaq sızıǵı úlken shorlaqlardı qaldırdı — "Aralqum" shóli, jańa jasalma shól.
• Qarawǵan balıq awlaw kemeleri bir waqıtları port bolǵan jerde jatat — joǵalǵan turmıs tarzınıń únsiz estelikleri.
• Qurǵaq astinan zaharlı chang dawılları aymaq boyınsha tuz hám pestitsidlerdi shashadı.

Biraq umıt bar: Arqa Aral teńizi (Qazaqstanda) toǵan menen qisman tiklengen hám balıqlar qaytmaqta. Shu jerde turiń, samaldı seziń hám esleń — bul orın pútkin dúnya esitiwi kerek bolǵan gúpanı sóyleydi. Asıǵıńız. Kóbirek bilmekshi bolsanız, men shu jerdeman.`,
};

const moynakShipCemetery = {
  en: `You're standing at the Moynak Ship Cemetery — one of the most haunting sights in Central Asia. I'm your virtual guide, right here with you.

Look around you: a fleet of rusting fishing trawlers lies stranded in the sand, some 100+ km from the current shoreline. These vessels once sailed a sea full of fish. Now they rest in a desert of salt and dust.

The story: Moynak was a prosperous fishing town. In its heyday the cannery processed up to 20,000 tons of fish per year and employed over 1,000 people. The harbor was busy with ships unloading carp, bream, and the prized Aral sturgeon. Then the sea retreated. The ships were abandoned where they lay — too expensive to move, too heavy to scrap on the spot. Decades of sun, salt, and wind have sculpted them into skeletal monuments.

What to look for:
• The largest vessels at the entrance — these were the flagship trawlers. Climb carefully for the iconic photo.
• The remnants of the harbor infrastructure — crumbling docks and winches.
• The "Moynak Aral Sea Memorial" museum nearby — it has old photographs showing the harbor full of water and ships.

Take a moment to walk among the hulls. Each rusted beam was once part of a working ship with a crew and a family. Feel the scale of what was lost. I'm here — ask me anything about this place.`,
  ru: `Вы стоите на Кладбище кораблей в Муйнаке — одном из самых впечатляющих зрелищ Центральной Азии. Я ваш виртуальный гид, прямо здесь с вами.

Оглянитесь: флот ржавеющих рыболовных траулеров лежит на песке, некоторые в 100+ км от нынешней береговой линии. Эти суда когда-то плавали по морю, полному рыбы. Теперь они покоятся в пустыне из соли и пыли.

История: Муйнак был процветающим рыбацким городом. В пору расцвета рыбоконсервный завод перерабатывал до 20,000 тонн рыбы в год и давал работу более 1,000 человек. В порту кипела работа — корабли разгружали карпа, леща и ценную аральскую осетрину. Затем море отступило. Корабли бросили там, где они стояли — слишком дорогие, чтобы перевозить, слишком тяжёлые, чтобы резать на месте. Десятилетия солнца, соли и ветра превратили их в скелетообразные памятники.

На что обратить внимание:
• Самые большие суда у входа — это флагманские траулеры. Поднимайтесь осторожно для культовой фотографии.
• Остатки портовых сооружений — разрушающиеся доки и лебёдки.
• Музей-мемориал "Муйнак и Аральское море" поблизости — там есть старые фотографии, где порт полон воды и кораблей.

Прогуляйтесь среди корпусов. Каждая ржавая балка когда-то была частью рабочего корабля с командой и семьёй. Почувствуйте масштаб утраты. Я здесь — спрашивайте о чём угодно.`,
  uz: `Siz Mo'ynoq kema qabristonidasiz — Markaziy Osiyodagi eng ta'sirli manzaralardan biri. Men sizning virtual gidingizman, shu yerda siz bilan.

Atrofga qarang: zanglagan baliq ovlash kemalari qumda yotibdi, ba'zilari hozirgi qirg'oqdan 100+ km uzoqda. Bu kemalar bir vaqtlar baliqqa to'la dengizda suzgan. Endi ular tuz va chang cho'lida dam oladi.

Tarix: Mo'ynoq gullab-yashnagan baliqchilik shahri bo'lgan. Gullash davrida konserva zavodi yiliga 20,000 tonnagacha baliq qayta ishlagan va 1,000 dan ortiq kishini ish bilan ta'minlagan. Portda kemalar sazan, chabakar va qadrlangan Orol osyotrini tushirgan. So'ng dengiz chekingan. Kemalar o'zlari turgan joyda tashlab ketilgan — tashish juda qimmat, joyida buzish juda og'ir. O'n yillar davomida quyosh, tuz va shamol ularni skelet monumentlariga aylantirgan.

Nimaga e'tibor bering:
• Kirishdagi eng katta kemalar — bular flagman trallerlar. Mashhur surat uchun ehtiyotkorlik bilan ko'tiling.
• Port infratuzilmasi qoldiqlari — yemirilayotgan doklar va chig'iriklar.
• Yaqindagi "Mo'ynoq Orol dengizi" memorial muzeyi — port suv va kemalar to'la eski fotosuratlarga ega.

Korpuslar orasida yuring. Har bir zanglagan nur bir vaqtlar jamoa va oilasi bo'lgan ishchi kemaning bir qismi bo'lgan. Yo'qolgan narsaning miqyasini his qiling. Men shu yerdaman — nima so'ralsa shuni javob beraman.`,
  kaa: `Siz Moynaq keme qábiristanındasız — Orta Aziyadaǵı eń tásirli kórinislerden biri. Men sizdiń virtual gidińizman, usı jerde siz menen.

Átraǵıńızǵa qarań: qarawǵan balıq awlaw kemeleri qumda jatat, ayırımları házirgi qıyaqtan 100+ km uzaqlıqta. Bul kemeler bir waqıtları balıqqa tolı teńizde súzgen. Endi olar tuz hám chang shólinde dem aladı.

Tariyx: Moynaq gúllep-jasnap atırǵan balıqshılıq qalası bolǵan. Gúllew dáwirinde konserva zawıdı jılına 20,000 tonnaǵa shekem balıqtı qayta islegen hám 1,000 nan kóp adamdı ish penen támiynlegen. Portta kemalar sazan, qabaq hám qadrlengen Aral osyotrin túsirgen. Soń teńiz shekingen. Kemeler ózleri turǵan jerde taslap ketilgen — tasiw júda qımbat, jerinde buzıw júda awır. On jıllar dawamında quyas, tuz hám samal olardı skelet esteliklerine aylandırgan.

Nige itibar beriń:
• Kiristegi eń úlken kemeler — bular flagman trawlerlar. Mashhur foto ushın ehtiyotshalıq penen kóteriń.
• Port infrastrukturası qaldıqları — buzılıp atırǵan dokler hám chig'irikler.
• Jaqındaǵı "Moynaq Aral teńizi" memorial muzeyi — port suw hám kemalar tolı eski fotosuratlarǵa iye.

Korpuslar arasında júriń. Hár bir qarawǵan nur bir waqıtlarda jama hám shańaraǵı bolǵan ishshi kemeniń bir bólegi bolǵan. Joǵalǵan nárseń miqyasın seziń. Men usı jerdeman — ne soralsa sonı juwap beremen.`,
};

const freeAttractions = {
  en: `Karakalpakstan has wonderful free attractions:

• Muynak Ship Cemetery — completely free to walk among the rusting ships. A small museum nearby charges a modest fee but the graveyard itself is open to all.
• Nukus Bazaar — wandering the bazaar costs nothing and is a feast for the senses. Great for photography and people-watching.
• The streets of Nukus — Soviet-era architecture and monuments are scattered around the city center, all free to explore.
• Amu Darya riverbank — a peaceful walk along the river, especially beautiful at sunset. Free.
• Ustyurt Plateau viewpoints — if you can get a ride there, the sweeping canyon views and chinks (cliffs) cost nothing to admire.
• Mizdakhan necropolis (near Kungrad) — an ancient pilgrimage site with mausoleums and legends. Free to enter; donations appreciated.

Don't worry if you're low on cash — some of the most powerful experiences here cost absolutely nothing!`,
  ru: `В Каракалпакстане есть прекрасные бесплатные достопримечательности:

• Кладбище кораблей в Муйнаке — совершенно бесплатно гулять среди ржавеющих кораблей. Небольшой музей рядом берёт скромную плату, но само кладбище открыто для всех.
• Нукусский базар — прогулка по базару ничего не стоит и настоящий праздник для чувств. Отлично для фотографий и наблюдения за людьми.
• Улицы Нукуса — советская архитектура и памятники разбросаны по центру города, всё бесплатно.
• Берег Амударьи — мирная прогулка вдоль реки, особенно красива на закате. Бесплатно.
• Смотровые площадки плато Устюрт — если доберётесь, панорамные виды каньонов и чинков (обрывов) бесплатны.
• Некрополь Миздахан (возле Кунграда) — древнее место паломничества с мавзолеями и легендами. Вход бесплатный; приветствуются пожертвования.

Не волнуйтесь, если у вас мало денег — некоторые из самых сильных впечатлений здесь совершенно бесплатны!`,
  uz: `Qoraqalpog'istonda ajoyib bepul joylar bor:

• Mo'ynoq kema qabristoni — zanglagan kemalar orasida yurish butunlay bepul. Yaqindagi kichik muzey arzon narx oladi, lekin qabristonning o'zi hammaga ochiq.
• Nukus bozori — bozorda yurish bepul va sezgilar uchun bayram. Fotosurat va odamlarni kuzatish uchun zo'r.
• Nukus ko'chalari — sovet davri me'morchiligi va yodgorliklari shahar markazida tarqalgan, hammasi bepul.
• Amudaryo qirg'og'i — daryo bo'ylab tinch yurish, ayniqsa quyosh botishida chiroyli. Bepul.
• Ustyurt platosi ko'rinish joylari — yetib borsangiz, kanyon manzaralari va chinklari (jarliklar) bepul.
• Mizdaxan nekropoli (Qo'ng'irotda) — maqbaralar va afsonalar bilan qadimiy ziyorat joyi. Kirish bepul; ehsonlar qabul qilinadi.

Pulingiz kam bo'lsa xavturmang — ba'zi eng kuchli tajribalar bu yerda butunlay bepul!`,
  kaa: `Qaraqalpaqstanda ajayıp biypul jerler bar:

• Moynaq keme qábiristanı — qarawǵan kemeler arasında júriw pútkilley biypul. Jaqındaǵı kishi muzey arzan baxa aladı, biraq qábiristandıń ózi hámmege ashıq.
• Nókis bazarı — bazarda júriw biypul hám sezimler ushın bayram. Fotosurat hám adamlardı kóriw ushın zo'r.
• Nókis kósheleri — sovet dáwir arxitekturası hám estelikleri qala orayında tarqalǵan, hamması biypul.
• Ámiwdárya qıyaǵı — dárya boyında tınısh júriw, ásireq kún batıwında gózzal. Biypul.
• Ustyurt platosı kórinis orınları — barsańız, kanyon kórinisleri hám chinkleri (jarlar) biypul.
• Mizdaxan nekropoli (Qońıratqa jaqın) — maqbaralar hám afsonalar menen áyyemgi ziyarat orını. Kiriw biypul; ehsonlar qabıl etiledi.

Pulińız az bolsa qáwiplenbesiń — ayırım eń kúshli tájiriybeler usı jerde pútkilley biypul!`,
};

const budgetTransport = {
  en: `Budget transport options around Karakalpakstan:

• Shared taxis (marshrutka-style) — the backbone of regional travel. Nukus → Kungrad ~$3, Nukus → Moynaq ~$8. Split the cost with other passengers.
• Buses — cheapest option. Nukus → Kungrad ~$3 (1.5 hrs). Less frequent to Moynaq; check the Nukus bus station.
• Train Tashkent → Nukus — overnight, about $15 for a kupe (4-berth sleeper) berth. 18 hours but you save a night's accommodation.
• Walking + hitchhiking — for the truly broke traveler, hitchhiking between Kungrad and Moynak is feasible. Offer to chip in for fuel.
• Rent a bicycle in Nukus — some guesthouses rent bikes for ~$5/day. Great for exploring the city and nearby villages.

Avoid private "tour" taxis unless sharing with others — a solo private taxi to the Aral Sea can run $120+. Team up with fellow backpackers to split 4x4 jeep costs.

Don't worry if you're low on cash — buses and shared taxis make almost everything reachable on a shoestring!`,
  ru: `Бюджетный транспорт по Каракалпакстану:

• Совместные такси (маршрутки) — основа региональных поездок. Нукус → Кунград ~$3, Нукус → Муйнак ~$8. Делите стоимость с другими пассажирами.
• Автобусы — самый дешёвый вариант. Нукус → Кунград ~$3 (1.5 ч). До Муйнака реже; уточняйте на автовокзале Нукуса.
• Поезд Ташкент → Нукус — ночной, около $15 за место в купе (4-местное). 18 часов, но экономите ночь в отеле.
• Пешком + автостоп — для совсем стеснённых в средствах, автостоп между Кунградом и Муйнаком возможен. Предлагайте доплатить за топливо.
• Аренда велосипеда в Нукусе — некоторые гостевые дома сдают велосипеды за ~$5/день. Отлично для города и окрестных сёл.

Избегайте частных "туристических" такси, если не делите с другими — соло-такси до Аральского моря может стоить $120+. Объединяйтесь с бэкпекерами, чтобы разделить costs джипа 4x4.

Не волнуйтесь, если у вас мало денег — автобусы и совместные такси делают почти всё доступным за копейки!`,
  uz: `Qoraqalpog'iston bo'ylab arzon transport variantlari:

• Birgalashda taksilar (marshrutka usulida) — mintaqaviy sayohatning asosi. Nukus → Qo'ng'irot ~$3, Nukus → Mo'ynoq ~$8. Boshqa yo'lovchilar bilan bo'ling.
• Avtobuslar — eng arzon variant. Nukus → Qo'ng'irot ~$3 (1.5 soat). Mo'ynoqqa kamroq; Nukus avtovokzalidan tekshiring.
• Poyezd Toshkent → Nukus — tunu kun, kupe (4 o'rinli) joyi taxminan $15. 18 soat, lekin bir tun mehmonxonani tejasangiz.
• Piyoda + stop — haqiqatan kam pul bilan, Qo'ng'irot va Mo'ynoq orasida stop mumkin. Yoqilg'i pulini taklif qiling.
• Nukusda velosiped ijarasi — ba'zi mehmon uylari velosipedni ~$5/kunga beradi. Shahar va qishloqlarni o'rganish uchun zo'r.

Yakka "turistik" taksilardan qoching, boshqalar bilan bo'lmasangiz — Aral dengiziga yakka taksi $120+ bo'lishi mumkin. Boshqa sayohatchilar bilan 4x4 jeep narxini bo'ling.

Pulingiz kam bo'lsa xavturmang — avtobuslar va birgalashda taksilar hamma narsani arzon qiladi!`,
  kaa: `Qaraqalpaqstan boyınsha arzan transport variantları:

• Ulaspalı taksiler (marshrutka usılında) — regionlıq sayaxattıń tiykarı. Nókis → Qońırat ~$3, Nókis → Moynaq ~$8. Basqa jolawshılar menen bóliń.
• Avtobuslar — eń arzan variant. Nókis → Qońırat ~$3 (1.5 saat). Moynaqqa azıraq; Nókis avtovokzalınan tekseriń.
• Poezd Tashkent → Nókis — tunú kún, kupe (4 orınlı) ornı shama menen $15. 18 saat, biraq bir tún miymanxananı únemleysiz.
• Piyada + stop — haqıyqatanda az pul menen, Qońırat hám Moynaq arasında stop múmkin. Janar may pulın usınıń.
• Nókiste velosiped iyjarası — ayırım miyman úyleri velosipedti ~$5/kúnge beredi. Qala hám awıllardı izertlew ushın zo'r.

Jeke "turistik" taksilerden qashıń, basqalar menen bólmeseńiz — Aral teńizine jeke taksi $120+ bolıwı múmkin. Basqa sayaxatshılar menen 4x4 jeep bahasın bóliń.

Pulińız az bolsa qáwiplenbesiń — avtobuslar hám ulaspalı taksiler hamma nárse arzin qıladı!`,
};

const savitskyMuseum = {
  en: `The Savitsky Museum (Igor Savitsky Karakalpakstan State Art Museum) in Nukus is one of Central Asia's greatest cultural treasures — often called the "Louvre of the Desert."

The story: Igor Savitsky was a Russian painter and archaeologist who came to Karakalpakstan in the 1950s. He began collecting local folk art, then secretly rescued banned avant-garde Soviet artworks — paintings that Stalin's regime had ordered destroyed. He hid them here in remote Nukus, far from Moscow's eyes. Today the museum holds over 82,000 items, including one of the world's finest collections of Russian avant-garde art.

What to see:
• The avant-garde galleries — works by Volkov, Uralov, and others that survived nowhere else.
• Karakalpak applied art — jewelry, costumes, and embroidery showing the region's nomadic heritage.
• The archaeological hall — artifacts from ancient Khorezm, including the "Golden Warrior" reconstruction.
• Savitsky's own landscapes of the Aral region.

Entrance fee is modest (~25,000 UZS, about $2). Allow 1.5–2 hours. Photography permits cost extra. This museum alone is worth the trip to Nukus — don't miss it!`,
  ru: `Музей Савицкого (Государственный музей искусств имени Игоря Савицкого) в Нукусе — одно из величайших культурных сокровищ Центральной Азии, его часто называют "Лувром пустыни".

История: Игорь Савицкий — русский художник и археолог, приехавший в Каракалпакстан в 1950-х. Он начал собирать местное народное искусство, затем тайно спасал запрещённые авангардные советские работы — картины, которые сталинский режим приказал уничтожить. Он спрятал их здесь, в далёком Нукусе, вдали от глаз Москвы. Сегодня музей хранит более 82,000 предметов, включая одну из лучших в мире коллекций русского авангарда.

Что посмотреть:
• Галереи авангарда — работы Волкова, Уралова и других, сохранившиеся только здесь.
• Прикладное искусство Каракалпакии — украшения, костюмы и вышивка кочевого наследия.
• Археологический зал — артефакты древнего Хорезма, включая реконструкцию "Золотого воина".
• Пейзажи самого Савицкого с видами Аральского региона.

Входная плата скромная (~25,000 UZS, около $2). Запланируйте 1.5–2 часа. Фотосъёмка оплачивается дополнительно. Один этот музей стоит поездки в Нукус — не пропустите!`,
  uz: `Nukusdagi Savitskiy muzeyi (Igor Savitskiy nomidagi Qoraqalpog'iston davlat san'at muzeyi) — Markaziy Osiyodagi eng katta madaniy xazinalardan biri, ko'pincha "Cho'l Luvri" deb ataladi.

Tarix: Igor Savitskiy — 1950-yillarda Qoraqalpog'istonga kelgan rus rassomi va arxeologi. U mahalliy xalq san'atini yig'ishni boshladi, so'ng taqiqlangan avangard sovet asarlarini — Stalin rejimi yo'q qilishni buyurgan rasmlarni sirtni saqlab qoldi. Ularni Moskva ko'zidan uzoqda, Nukusda yashirdi. Bugungi kunda muzey 82,000 dan ortiq buyum saqlaydi, jumladan dunyodagi eng yaxshi rus avangard san'ati kolleksiyalaridan biri.

Nima ko'rish:
• Avangard galereyalari — Volkov, Uralov va boshqalarning asarlari.
• Qoraqalpoq amaliy san'ati — zeb-ziynat, liboslar va kashta chechish ko'chma merosni ko'rsatadi.
• Arxeologiya zali — qadimgi Xorazm artefaktlari, "Oltin jangchi" rekonstruktsiyasi.
• Savitskiyning o'zining Aral mintaqasi landshaftlari.

Kirish to'lovi arzon (~25,000 UZS, taxminan $2). 1.5–2 soat ajrating. Fotosurat uchun qo'shimcha to'lov. Bu muzey o'zi Nukusga sayohatga arziydi — o'tkazib yubormang!`,
  kaa: `Nókistegi Savitskiy muzeyi (Igor Savitskiy atındaǵı Qaraqalpaqstan mámleketlik kórkem-óner muzeyi) — Orta Aziyadaǵı eń úlken mádeniy qazınalardan biri, kóbinese "Shól Luvri" dep ataladı.

Tariyx: Igor Savitskiy — 1950-jıllarda Qaraqalpaqstanǵa kelgen oris súwretshisi hám arxeologi. Ol jergilikli xalıq kórkem-ónerin jıydı basladı, soń qadaǵalawǵan avangard sovet dóretpelerin — Stalin rejimi joq etiwdi buyırǵan suratlardı sirli saqlap qaldı. Olardı Moskva kózinen uzaqta, Nókiste jasırdı. Búgin muzey 82,000 nan kóp buyım saqlaydı, sonday-aq dúnyadaǵı eń jaqsı orıs avangard kórkem-óner kollekciyalarınan biri.

Neme kóriw:
• Avangard galereyaları — Volkov, Uralov hám basqalardıń dóretpeleri.
• Qaraqalpaq ámeliy kórkem-óner — ziynet, kiyimler hám shıyǵıslaw kóshpe miyrastı kórsetedi.
• Arxeologiya zalı — áyyemgi Xorezm artefaktları, "Altın jangchı" rekonstrukciyası.
• Savitskiydiń óziniń Aral regionı landshaftları.

Kiriw toló-arzan (~25,000 UZS, shama menen $2). 1.5–2 saat ajırıń. Fotosurat ushın qosımsha toló. Bul muzey ózi Nókiske sayaxatqa arziydı — qaldırıńız!`,
};

const ustyurtPlateau = {
  en: `The Ustyurt Plateau is a vast limestone tableland straddling the border of Uzbekistan and Kazakhstan — one of the most otherworldly landscapes on Earth.

This is a place of dramatic chinks (steep cliffs) that drop 200–300 meters from the plateau to the plains below. The plateau itself is a near-lifeless expanse of cracked white rock, but the cliff edges reveal sweeping views of canyons, salt marshes, and the distant Aral basin.

What to know before you go:
• Getting there requires a 4x4 jeep from Nukus (3–4 hours). Budget travelers can share a jeep with others (~$35–40/person split 4 ways).
• There's almost no shade, water, or food — carry everything you need for the day.
• The best viewpoints are along the western edge, facing the Aral.
• Look for the ancient meteorological markers and nomadic burial mounds scattered on the plateau.
• Stay for sunset — the light on the white rock and cliffs is unforgettable.

If you're low on cash, team up with other backpackers at your Nukus guesthouse to split a jeep. The plateau itself is free to explore once you're there!`,
  ru: `Плато Устюрт — обширное известняковое плато на границе Узбекистана и Казахстана, один из самых инопланетных пейзажей Земли.

Это место драматичных чинков (крутых обрывов), падающих на 200–300 метров с плато на равнину. Само плато — почти безжизненное пространство потрескавшейся белой породы, но края обрывов открывают панорамные виды на каньоны, солончаки и далёкий Аральский бассейн.

Что знать перед поездкой:
• Добраться можно только на джипе 4x4 из Нукуса (3–4 часа). Бюджетные путешественники могут разделить джип (~$35–40/человек при делении на 4).
• Там почти нет тени, воды и еды — берите всё необходимое на день.
• Лучшие смотровые — вдоль западного края, лицом к Аралу.
• Ищите древние метеорологические знаки и кочевые курганы на плато.
• Дождитесь заката — свет на белой породе и обрывах незабываем.

Если у вас мало денег, объединяйтесь с бэкпекерами в нукусском гостевом доме, чтобы разделить джип. Само плато бесплатно для изучения, раз уж вы там!`,
  uz: `Ustyurt platosi — O'zbekiston va Qozog'iston chegarasidagi keng ohaktosh plato, Yerdagi eng g'aroyib landshaftlardan biri.

Bu 200–300 metrlik chinklardan (tik jarliklardan) iborat dramatik joy. Platoning o'zi deyarli tirik jonliksiz oq jar qatlami, lekin jarlik chetlari kanyonlar, sho'rxoklar va uzoqdagi Aral havzasini ko'rsatadi.

Borishdan oldin biling:
• Borish uchun Nukusdan 4x4 jeep kerak (3–4 soat). Byudjet sayohatchilari jeepni bo'lishi mumkin (~$35–40/kishi 4 ga bo'linganda).
• Soyas, suv va ovqat deyarli yo'q — kunlik narsalarni oling.
• Eng yaxshi ko'rinishlar g'arbiy chekkada, Aralga qarab.
• Platosda qadimiy meteorologik belgilar va ko'chma qabrlarni qidiring.
• Quyosh botishini kuting — oq jar va jarliklarda yorug'lik unutilmas.

Pulingiz kam bo'lsa, Nukus mehmon uyida boshqa sayohatchilar bilan jeepni bo'ling. Plato o'zi yetib borgach bepul o'rganish uchun!`,
  kaa: `Ustyurt platosı — Ózbekstan hám Qazaqstan shegarasındaǵı keń aqqabaq tas platosı, Jerdegi eń g'arripa landshaftlardan biri.

Bul 200–300 metrlik chinklerden (tık jarlardan) ibarat dramatikalıq orın. Platoniń ózi derlik tirik janlıssız aq jar qatlami, biraq jar shetleri kanyonlar, shorlaqlar hám uzaqtaǵı Aral háwizin kórsetedi.

Barıwdan aldın biliń:
• Barıw ushın Nókisten 4x4 jeep kerek (3–4 saat). Byudjet sayaxatshıları jeepni bóliwi múmkin (~$35–40/kisi 4 ge bólingende).
• Saya, suw hám azıq derlik joq — kúnlik nárseńizdi alıń.
• Eń jaqsı kórinisler batıs shetinde, Aralǵa qarap.
• Platosda áyyemgi meteorologiyalıq belgiler hám kóshme qabrlardı izleń.
• Kún batıwın kútiń — aq jar hám jarlarda jarıqlıq unutilmas.

Pulińız az bolsa, Nókis miyman úyinde basqa sayaxatshılar menen jeepni bóliń. Plato ózi jetip barǵannan keyin biypul izertlew ushın!`,
};

const mizdakhan = {
  en: `Mizdakhan is an ancient necropolis complex near Kungrad — one of the holiest and most mysterious sites in Karakalpakstan.

According to legend, Mizdakhan was once a great city that was swallowed by the earth as punishment for its ruler's pride. Today it's a sprawling complex of mausoleums, tombs, and pilgrimage sites on elevated ground overlooking the Amu Darya delta.

What to see:
• The Mazlumkhan Suluv mausoleum — an unusual stepped dome structure, built for a legendary queen. Pilgrims (especially women seeking fertility) come from across the region.
• The "World Clock" — a long structure that locals believe measures time until the end of the world. They say each year a piece falls off.
• Thousands of ancient tombs scattered across the hillside — some dating back over 2,000 years.
• The views over the delta plains are stunning at golden hour.

Entry is free; donations appreciated. Dress modestly — this is an active pilgrimage site. A shared taxi from Kungrad costs about $2–3. Don't worry if you're low on cash — this sacred site welcomes everyone freely!`,
  ru: `Миздахан — древний некрополь около Кунграда, одно из самых святых и загадочных мест Каракалпакстана.

По легенде, Миздахан когда-то был великим городом, поглощённым землёй в наказание за гордыню правителя. Сегодня это обширный комплекс мавзолеев, гробниц и мест паломничества на возвышенности с видом на дельту Амударьи.

Что посмотреть:
• Мавзолей Мазлумхан Сулу — необычное ступенчатое купольное сооружение, построенное для легендарной царицы. Паломники (особенно женщины, просящие о плодородии) приезжают со всего региона.
• "Мировые часы" — длинное сооружение, которое, по местным поверьям, измеряет время до конца света. Говорят, каждый год отваливается кусочек.
• Тысячи древних гробниц на склоне холма — некоторым более 2,000 лет.
• Виды на дельтовые равнины потрясают в золотой час.

Вход бесплатный; приветствуются пожертвования. Одевайтесь скромно — это действующее место паломничества. Совместное такси из Кунграда стоит около $2–3. Не волнуйтесь, если у вас мало денег — это священное место принимает всех бесплатно!`,
  uz: `Mizdaxan — Qo'ng'irot yaqinidagi qadimiy nekropol majmuasi, Qoraqalpog'istondagi eng muqaddas va sirli joylardan biri.

Rivoyatga ko'ra, Mizdaxan bir vaqtlar hukmdorining manmanligi uchun jazolanib yerga yutilgan ulkan shahar bo'lgan. Bugungi kunda u Amudaryo deltasiga qaraydigan balandlikdagi maqbaralar, qabrlar va ziyorat joylari majmuasidir.

Nima ko'rish:
• Mazlumxon Sulu maqbarasi — g'ayrioddiy pog'onali gumbazli inshoot, afsonaviy malika uchun qurilgan. Butun mintaqadan ziyoratchilar (ayniqsa farzand tilagan ayollar) keladi.
• "Jahon soati" — mahalliy e'tiqodga ko'ra, dunyo oxirigacha vaqtni o'lchaydigan uzun inshoot. Har yili bir bo'lak sinib tushadi deyiladi.
• Tepalikda minglab qadimiy qabrlar — ba'zilari 2,000 yildan o'tgan.
• Oltin soatda deltaning tekisliklari manzarasi hayratlanarli.

Kirish bepul; ehsonlar qabul qilinadi. Mosis kiyining — bu faol ziyorat joyi. Qo'ng'irotdan birgalashda taksi ~$2–3. Pulingiz kam bo'lsa xavturmang — bu muqaddas joy hammaga bepul kutiladi!`,
  kaa: `Mizdaxan — Qońıratqa jaqındaǵı áyyemgi nekropolis kompleksi, Qaraqalpaqstandaǵı eń muqaddes hám sirli orınlardan biri.

Rivayatqa qaraǵanda, Mizdaxan bir waqıtları húkimdarınıń maqtanshaqlıǵı ushın jazalanıp jerge jutılǵan úlken qala bolǵan. Búgin ol Ámiwdárya deltasına qaraytuǵın biyikliktegi maqbaralar, qabrlar hám ziyarat orınları kompleksidir.

Neme kóriw:
• Mazlumxan Sulu maqbarası — g'ayriádettegi basqıshlı gúmbezli imarat, afsonaviy malika ushın qurılǵan. Pútkin regionnan ziyaratshılar (ásireq bala tilegen ayallar) keledi.
• "Jahan saatı" — jergilikli isenim boyınsha, dúnya axırına shekem waqıttı ólsheytuǵın uzun imarat. Hár jılı bir bólek sinip túseydi deyiledi.
• Taw betinde mıńlaǵan áyyemgi qabrlar — ayırımlari 2,000 jıldan ótken.
• Altın saatda deltanıń tegislikleri kórinisi hayretlanarlı.

Kiriw biypul; ehsonlar qabıl etiledi. Mósı kiyiń — bul aktiv ziyarat orını. Qońırattan ulaspalı taksi ~$2–3. Pulińız az bolsa qáwiplenbesiń — bul muqaddes orın hémmege biypul kútilgen!`,
};

const yurtCamps = {
  en: `Staying in a yurt camp is a must-do Karakalpakstan experience — and it's more affordable than you'd think:

Budget options:
• Chimboy Guest House — $15/night. Not a yurt but the cheapest bed in the region, home-cooked meals included.
• Karakalpak Guest House (Nukus) — $18/night. Great base before heading to the desert. Bicycle rental available.
• Aral Sea Yurt Camp (Moynak) — $30/night. Real yurts with sea views, fishing, traditional meals, and 4x4 transfer included. Split with travel mates to save.
• Yurt Camp Ustyurt — $25/night. Traditional meals, stargazing, camel riding, campfire. The desert night sky here is breathtaking.

Tips for budget yurt stays:
• Book directly with the camp (not through agencies) to avoid markups.
• Share a yurt with other backpackers — yurts sleep 4–6 people.
• Meals are usually included — you'll eat plov, shurpa, and fresh bread around a communal dastarkhan.
• Bring a sleeping bag liner for comfort in summer; nights can be cool even in the desert.

Don't worry if you're low on cash — even the cheapest option gives you the authentic Karakalpak hospitality experience!`,
  ru: `Ночь в юртовом лагере — обязательный опыт в Каракалпакстане, и это доступнее, чем кажется:

Бюджетные варианты:
• Гостевой дом Чимбой — $15/ночь. Не юрта, но самая дешёвая кровать в регионе, домашняя еда включена.
• Каракалпакский гостевой дом (Нукус) — $18/ночь. Отличная база перед поездкой в пустыню. Есть аренда велосипедов.
• Юртовый лагерь Аральского моря (Муйнак) — $30/ночь. Настоящие юрты с видом на море, рыбалка, национальная еда и трансфер 4x4 включены. Делите с попутчиками.
• Юртовый лагерь Устюрт — $25/ночь. Национальная еда, звёзды, верблюжьи прогулки, костёр. Ночное небо в пустыне захватывает дух.

Советы для бюджетной ночёвки в юрте:
• Бронируйте напрямую с лагерем (не через агентства), чтобы избежать наценок.
• Делите юрту с другими бэкпекерами — юрты вмещают 4–6 человек.
• Еда обычно включена — будете есть плов, шурпу и свежий хлеб за общим дастарханом.
• Возьмите вкладыш для спальника летом; ночи в пустыне бывают прохладными.

Не волнуйтесь, если у вас мало денег — даже самый дешёвый вариант даёт настоящий опыт каракалпакского гостеприимства!`,
  uz: `Yurt lagerida qolish — Qoraqalpog'istonda albatta sinab ko'rish kerak, va o'ylagandan arzonroq:

Arzon variantlar:
• Chimboy mehmon uyi — $15/tun. Yurt emas, lekin eng arzon joy, uy taomi bilan.
• Qoraqalpoq mehmon uyi (Nukus) — $18/tun. Cho'lga borishdan oldin zo'r baza. Velosiped ijarasi bor.
• Orol dengizi yurt lageri (Mo'ynoq) — $30/tun. Haqiqiy yurtlar, dengiz manzarasi, baliq ovlash, milliy taomlar va 4x4 transfer bilan. Sayohatdoshlaringiz bilan bo'ling.
• Ustyurt yurt lageri — $25/tun. Milliy taomlar, yulduzlar, tuyaga minish, olov. Cho'l tungi osmoni hayratomuz.

Arzon yurt maslahatlari:
• Agentliklarsiz to'g'ridan-to'g'ri lager bilan bog'laning.
• Yurtani boshqa sayohatchilar bilan bo'ling — yurtalar 4–6 kishiga mos.
• Taom odatda kiritilgan — palov, sho'rva va yangi non dastaxonda.
• Yozda uxlaydigan qopqiri oling; cho'l kechasi salqin bo'lishi mumkin.

Pulingiz kam bo'lsa xavturmang — eng arzon variant ham haqiqiy qoraqalpoq mehmondo'stligini beradi!`,
  kaa: `Yurt lagerinde qalıw — Qaraqalpaqstanda álbatta sinap kóriw kerek, hám oylaǵannan arzanıraq:

Arzan variantlar:
• Chimboy miyman úyi — $15/tún. Yurt emes, biraq eń arzan orın, úy ası menen.
• Qaraqalpaq miyman úyi (Nókis) — $18/tún. Shólge barıwdan aldın zo'r baza. Velosiped iyjarası bar.
• Aral teńizi yurt lageri (Moynaq) — $30/tún. Haqıyqiy yurtlar, teńiz kórinisi, balıq awlaw, milliy azıq hám 4x4 transfer menen. Sayaxatlaslarıńız menen bóliń.
• Ustyurt yurt lageri — $25/tún. Milliy azıq, juldızlar, tuya miniw, ot. Shól tún aspanı hayretomuz.

Arzan yurt maslahatları:
• Agentliklersiz tikkeley lager menen baylanısıń.
• Yurtı basqa sayaxatshılar menen bóliń — yurtalar 4–6 kishiǵe mos.
• Azıq odatda kiritilgen — palov, shurpa hám janı non dastaxanda.
• Jazda uxlaytuǵın qapshıq alıń; shól túni salqın bolıwı múmkin.

Pulińız az bolsa qáwiplenbesiń — eń arzan variant ta haqıyqiy qaraqalpaq miymandoslıqtı beredi!`,
};

const safetyTips = {
  en: `Safety tips for Karakalpakstan:

• Water — drink only bottled or filtered water. Tap water is not safe for drinking.
• Desert heat — carry at least 2 liters of water per person for any desert trip, plus sunscreen and a hat. Heat exhaustion is the most common tourist issue.
• Getting lost — the desert has few landmarks. If you go off-road, hire a local guide or use GPS. The SOS button on this site can share your location.
• Cash — carry enough som for rural areas; cards rarely work outside Nukus.
• Emergency numbers — General emergency: 112, Police: 102, Ambulance: 103, Tourist Police: 1173.
• Registration — if staying more than 3 days, ensure your hotel registers you. Keep the slips.
• Photography — ask before photographing people, especially women and at religious sites.

Karakalpakstan is generally very safe and locals are hospitable. Use common sense and you'll have an amazing trip!`,
  ru: `Правила безопасности в Каракалпакстане:

• Вода — пейте только бутилированную или фильтрованную. Вода из-под крана небезопасна.
• Жара в пустыне — берите минимум 2 литра воды на человека для любой поездки в пустыню, плюс солнцезащитный крем и шляпу. Тепловой удар — самая частая проблема туристов.
• Потеряться — в пустыне мало ориентиров. Если съезжаете с дороги, наймите местного гида или используйте GPS. Кнопка SOS на этом сайте может передать ваше местоположение.
• Наличные — берите достаточно сомов для сельской местности; карты вне Нукуса почти не работают.
• Экстренные номера — Общая: 112, Полиция: 102, Скорая: 103, Туристическая полиция: 1173.
• Регистрация — если остаётесь более 3 дней, убедитесь, что отель вас зарегистрировал. Сохраняйте талоны.
• Фотосъёмка — спрашивайте перед съёмкой людей, особенно женщин и в религиозных местах.

Каракалпакстан в целом очень безопасен, а местные жители гостеприимны. Проявляйте здравый смысл — и поездка будет потрясающей!`,
  uz: `Qoraqalpog'iston uchun xavfsizlik maslahatlari:

• Suv — faqat shisha yoki filtrlangan suv iching. Kranni suvi ichishga yaroqsiz.
• Cho'l jazirasi — cho'l sayohati uchun har kishi kamida 2 litr suv, quyosh kremi va shlyapa oling. Issiqlik charchashi eng keng tarqalgan turistik muammo.
• Adashish — cho'lda belgilar kam. Yo'ldan chiqsangiz, mahalliy gid yollang yoki GPS ishlating. Ushbu saytdagi SOS tugmasi joylashuvingizni yubara oladi.
• Naqd — qishloq joylari uchun yetarli som oling; Nukusdan tashqari kartalar kam ishlaydi.
• Favqulodda raqamlar — Umumiy: 112, Politsiya: 102, Tez yordam: 103, Turist politsiyasi: 1173.
• Ro'yxatdan o'tish — 3 kundan ko'q qolsangiz, mehmonxona ro'yxatga olishini tekshiring. Varaqalarni saqlang.
• Fotosurat — odamlarni, ayniqsa ayollarni va diniy joylarda suratga olishdan oldin so'rang.

Qoraqalpog'iston umuman juda xavfsiz, mahalliy aholi mehmondo'st. Oddiy ehtiyotkorlik bilan ajoyib sayohat bo'ladi!`,
  kaa: `Qaraqalpaqstan ushın qáwipsizlik maslahatları:

• Suw — tek shısha yaki filtrlenbegen suwdı ishiń. Kranni suw ichiwge yarawsız.
• Shól jızırawı — shól sayaxatı ushın hárbir adam keminde 2 litr suw, quyas kremi hám qalpaq alıń. Issılıq sharshawı eń keń tarqalǵan turistik mashqala.
• Adasıw — shólda belgiler az. Joldan shıqsanız, jergilikli gid jallań yaki GPS isletiń. Usı sayttaǵı SOS túymesı ornıńızdı jibere aladı.
• Naqd — awıl jerleri ushın jetkilikli som alıń; Nókisten tısqarı kartalar az isleydi.
• Qáwip nomerleri — Ulıwma: 112, Policiya: 102, Tez járdem: 103, Turist policiyası: 1173.
• Dizimge alıw — 3 kúnnen artıq qalsanız, miymanxana dizimge alıwın tekseriń. Qayıqlardı saqlań.
• Fotosurat — adamlardı, ásireq ayallardı hám diniy orınlarda suratqa túsiriwden aldın sorap alıń.

Qaraqalpaqstan ulıwma júda qáwipsiz, jergilikli xalıq miymandos. Ádettegi ehtiyotshalıq penen ajayıp sayaxat boladı!`,
};

const greeting = {
  en: `Hello! I'm your free local AI guide for Karakalpakstan. I work offline — no setup needed! I can help you with:

• Budget travel tips — cheap food, transport, and accommodation
• Virtual on-site tour guiding — tell me where you are (Aral Sea, Moynak, etc.) and I'll guide you
• Practical info — safety, currency, getting around

I speak any language! Just write to me in Spanish, French, Japanese, Arabic, German, or any language you prefer, and I'll respond in kind. What would you like to know?`,
  ru: `Здравствуйте! Я ваш бесплатный местный AI-гид по Каракалпакстану. Работаю без интернета — настройка не нужна! Могу помочь с:

• Бюджетные советы — дешёвая еда, транспорт и жильё
• Виртуальные экскурсии — скажите, где вы (Арал, Муйнак и т.д.), и я проведу экскурсию
• Практическая информация — безопасность, валюта, передвижение

Я говорю на любом языке! Пишите на испанском, французском, японском, арабском, немецком или любом другом — отвечу на том же. Что хотите узнать?`,
  uz: `Salom! Men Qoraqalpog'iston uchun bepul mahalliy AI gidingizman. Internetisiz ishlayman — sozlash shart emas! Yordam bera olaman:

• Byudjet sayohat maslahatlari — arzon ovqat, transport va turar joy
• Virtual sayohat ekskursiyasi — qayerdaligingizni ayting (Orol, Mo'ynoq va h.k.), men sizni boshqalam
• Amaliy ma'lumot — xavfsizlik, valyuta, qatnov

Men har qanday tilda gaplashaman! Ispan, fransuz, yapon, arab, nemis yoki istalgan tilda yozing, shu til javob bermay. Nima bilmoqchisiz?`,
  kaa: `Sálem! Men Qaraqalpaqstan ushın biypul jergilikli AI gidińizmen. Internetsiz isleymen — sazlaw shárt emes! Járdem bere alaman:

• Byudjet sayaxat maslahatları — arzan awqat, transport hám turar joy
• Virtual sayaxat ekskursiyası — qayerde ekenińizdi aytıń (Aral, Moynaq hám t.k.), men sizdi basshılıq etem
• Ameliy maǵlıwmat — qáwipsizlik, valyuta, qatnaw

Men hár qanday tilde sóyleymen! Ispan, francuz, yapon, arab, nemis yaki qálegenińiz tilde jazıń, sol tilde juwap berem. Nede bilmekshisiz?`,
};

const fallback = {
  en: `I'm a local guide focused on Karakalpakstan travel. I can help with budget tips, transport, the Aral Sea, Moynak ship cemetery, Savitsky Museum, Ustyurt Plateau, Mizdakhan, yurt camps, and safety. Try asking me something like:

• "How do I reach Moynak cheaply?"
• "Tell me about the Aral Sea history"
• "I'm at the ship cemetery, guide me"
• "Where can I find cheap food in Nukus?"

What interests you most?`,
  ru: `Я местный гид по путешествиям в Каракалпакстан. Помогу с бюджетом, транспортом, Аральским морем, кладбищем кораблей Муйнака, музеем Савицкого, плато Устюрт, Миздаханом, юртовыми лагерями и безопасностью. Попробуйте спросить:

• "Как дёшево добраться до Муйнака?"
• "Расскажи историю Аральского моря"
• "Я на кладбище кораблей, будь моим гидом"
• "Где дешёвая еда в Нукусе?"

Что вас больше всего интересует?`,
  uz: `Men Qoraqalpog'iston sayohati bo'yicha mahalliy gidman. Byudjet, transport, Orol dengizi, Mo'ynoq kema qabristoni, Savitskiy muzeyi, Ustyurt platosi, Mizdaxan, yurt lagerlari va xavfsizlik bo'yicha yordam bera olaman. So'rab ko'ring:

• "Mo'ynoqqa arzan qanday boraman?"
• "Orol dengizi tarixini so'zlab ber"
• "Men kema qabristonidaman, meni boshqal"
• "Nukusda arzon ovqat qayerda?"

Sizni eng qiziqtirgani nima?`,
  kaa: `Men Qaraqalpaqstan sayaxatı boyınsha jergilikli gidman. Byudjet, transport, Aral teńizi, Moynaq keme qábiristanı, Savitskiy muzeyi, Ustyurt platosı, Mizdaxan, yurt lagerleri hám qáwipsizlik boyınsha járdem bere alaman. Sorap kóriń:

• "Moynaqqa arzan qalay baraman?"
• "Aral teńizi tariyxın aytıp ber"
• "Men keme qábiristanında, meni basshılıq et"
• "Nókiste arzan azıq qayerda?"

Sizdi eń qızıqtırǵanı neme?`,
};

export const knowledgeBase: KnowledgeEntry[] = [
  {
    id: 'aral-sea',
    keywords: ['aral', 'aral sea', 'aralsk', 'aral sea history', 'history of aral', 'aral sea story', 'aral sea tragedy', 'арал', 'аральск', 'аральское море', 'орол', 'орол денизи', 'aral teñizi'],
    ...aralSeaHistory,
  },
  {
    id: 'moynak-ships',
    keywords: ['moynak', 'moynaq', 'muynek', 'mujnak', 'muynak', 'ship', 'ship cemetery', 'ship graveyard', 'ships', 'boats', 'trawlers', 'корабли', 'корабл', 'кема', 'кеме', 'keme qábiristan', 'kema qabriston', 'moynaq keme', 'moynoq kema'],
    ...moynakShipCemetery,
  },
  {
    id: 'muynak-transport',
    keywords: ['reach muynak', 'get to muynak', 'reach moynak', 'get to moynak', 'moynak transport', 'moynak how', 'muynak cheap', 'moynak cheap', 'how to moynak', 'как добраться муйнак', 'муйнак как', 'mo\'ynoq qanday', 'moynaq qalay', 'reach moynaq'],
    ...muynakTransport,
  },
  {
    id: 'cheap-food',
    keywords: ['cheap food', 'budget food', 'eat cheap', 'where to eat', 'food nukus', 'nukus food', 'cheap eat', 'affordable food', 'meals', 'restaurants cheap', 'дешёвая еда', 'еда нукус', 'arzan ovqat', 'arzan azıq', 'azıq'],
    ...cheapFoodText,
  },
  {
    id: 'free-attractions',
    keywords: ['free', 'free attractions', 'free things', 'no cost', 'free places', 'бесплатно', 'бесплатные', 'bepul', 'bepul joylar', 'biypul', 'biypul jerler'],
    ...freeAttractions,
  },
  {
    id: 'budget-transport',
    keywords: ['budget transport', 'cheap transport', 'transport', 'bus', 'taxi', 'marshrutka', 'train', 'get around', 'travel around', 'транспорт', 'автобус', 'такси', 'поезд', 'transport', 'avtobus', 'taksi', 'poyezd'],
    ...budgetTransport,
  },
  {
    id: 'savitsky',
    keywords: ['savitsky', 'savitski', 'savitskiy', 'museum', 'art museum', 'louvre of desert', 'savitsky museum', 'савицкий', 'музей', 'savitskiy muzeyi', 'muzey', 'savitskiy muzeyi'],
    ...savitskyMuseum,
  },
  {
    id: 'ustyurt',
    keywords: ['ustyurt', 'ustjurt', 'ust urt', 'plateau', 'ustyurt plateau', 'chinks', 'устюрт', 'плато', 'ustyurt platosi', 'plato'],
    ...ustyurtPlateau,
  },
  {
    id: 'mizdakhan',
    keywords: ['mizdakhan', 'mizdaxon', 'mizdahhan', 'necropolis', 'mazlumkhan', 'pilgrimage', 'mausoleum', 'миздахан', 'некрополь', 'mizdaxan', 'maqbara'],
    ...mizdakhan,
  },
  {
    id: 'yurt-camps',
    keywords: ['yurt', 'yurt camp', 'yurts', 'stay', 'accommodation', 'where to stay', 'sleep', 'guesthouse', 'hotel', 'юрт', 'юртовый', 'жильё', 'отель', 'гостевой', 'yurt', 'mehmonxona', 'turar joy'],
    ...yurtCamps,
  },
  {
    id: 'safety',
    keywords: ['safety', 'safe', 'danger', 'emergency', 'health', 'water', 'lost', 'police', 'безопасность', 'опасно', 'скорая', 'полиция', 'xavfsizlik', 'xavf', 'qáwipsizlik', 'politsiya'],
    ...safetyTips,
  },
  {
    id: 'greeting',
    keywords: ['hello', 'hi', 'hey', 'salam', 'salom', 'salem', 'здравствуйте', 'привет', 'bonjour', 'hola', 'ciao', 'konnichiwa', 'namaste', 'marhaba', 'guten tag', 'olá', '你好', 'こんにちは', '안녕', 'greetings', 'good morning', 'good evening', 'assalam'],
    ...greeting,
  },
];

export function findResponse(text: string, lang: 'en' | 'ru' | 'uz' | 'kaa'): string {
  const normalized = text.toLowerCase().trim();

  let bestMatch: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (normalized.includes(keyword)) {
        score += keyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && bestScore > 0) {
    return bestMatch[lang] || bestMatch.en;
  }

  return fallback[lang] || fallback.en;
}

export function getGuideNames(): string[] {
  return guides.map((g) => g.name);
}

export function getHotelNames(): string[] {
  return hotels.map((h) => h.name);
}

export function getTransportSummary(lang: 'en' | 'ru' | 'uz' | 'kaa'): string {
  const lines = transportRoutes.map((r) => {
    const priceStr = `$${r.price}`;
    return `• ${r.from} → ${r.to}: ${r.mode} | ${r.duration} | ${priceStr}`;
  });
  const header =
    lang === 'ru'
      ? 'Текущие маршруты транспорта:'
      : lang === 'uz'
      ? 'Joriy transport yoʻnalishlari:'
      : lang === 'kaa'
      ? 'Házirgi transport baǵdarları:'
      : 'Current transport routes:';
  return `${header}\n${lines.join('\n')}`;
}
