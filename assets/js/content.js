/* =====================================================================
   ALL OF YOUR CONTENT LIVES IN THIS FILE.
   To add a paper, video, script or note: copy an existing block,
   paste it at the TOP of the same list, and change the text.

   Text that should be translated is written like this:
       { en: "English", uz: "Oʻzbekcha", ru: "Русский" }
   If you leave out uz or ru, the English text is shown instead.

   ===================================================================== */
window.SITE = {

  /* ---------- Basic information ---------- */
  siteName: "UnitCell",                   // the name shown next to the logo and in the browser tab
  name: { en: "Avazkhon Azamjonov", uz: "Avazxon Azamjonov", ru: "Авазхон Азамжонов" },
  tagline: { en: "Computational materials science", uz: "Hisoblash materialshunosligi", ru: "Вычислительное материаловедение" },
  role: {
    en: "Research Fellow, Institute of Materials Science, Uzbekistan Academy of Sciences, Tashkent",
    uz: "Ilmiy xodim, O‘zbekiston Fanlar akademiyasi Materialshunoslik instituti, Toshkent",
    ru: "Научный сотрудник, Институт материаловедения Академии наук Узбекистана, Ташкент"
  },
  lead: {
    en: "I use computer simulations and machine learning to understand materials at the atomic scale and to design new ones. On this site I share my research, video tutorials, scripts and short notes.",
    uz: "Men kompyuter modellashtirish va mashinaviy oʻqitish yordamida materiallarni atomar darajada oʻrganaman va yangi materiallarni loyihalayman. Bu saytda tadqiqotlarim, videodarslar, skriptlar va qisqa qaydlarim bilan boʻlishaman.",
    ru: "С помощью компьютерного моделирования и машинного обучения я изучаю материалы на атомном уровне и проектирую новые. На этом сайте я делюсь исследованиями, видеоуроками, скриптами и короткими заметками."
  },
  lastUpdated: "2026-11-13",

  contact: {
    email: "a.azamjonov@imssolar.uz",
    location: { en: "Tashkent, Uzbekistan", uz: "Toshkent, Oʻzbekiston", ru: "Ташкент, Узбекистан" },
    links: [                                 // leave url empty ("") to hide a link
      { label: "Google Scholar", url: "" },
      { label: "ORCID", url: "https://orcid.org/0009-0008-0733-8000" },
      { label: "GitHub", url: "" },
      { label: "YouTube: DFT Lab", url: "" }       // TODO: paste the channel link here
    ]
  },

  interests: [
    { en: "Density functional theory", uz: "Zichlik funksionali nazariyasi", ru: "Теория функционала плотности" },
    { en: "MXenes and 2D materials", uz: "MXenlar va 2D materiallar", ru: "MXene и 2D-материалы" },
    { en: "Machine learning for materials discovery", uz: "Materiallarni kashf etishda mashinaviy oʻqitish", ru: "Машинное обучение для поиска материалов" },
    { en: "Photocatalysis", uz: "Fotokataliz", ru: "Фотокатализ" },
    { en: "Surface adsorption", uz: "Sirt adsorbsiyasi", ru: "Адсорбция на поверхности" },
    { en: "Heterostructures and interfaces", uz: "Geterostrukturalar va sirt yuzalari", ru: "Гетероструктуры и границы раздела" },
    { en: "Work function and band alignment", uz: "Chiqish ishi va zona chetlari", ru: "Работа выхода и согласование зон" },
    { en: "Doping and strain effects", uz: "Dopirlash va deformatsiya ta'siri", ru: "Эффекты допирование и деформация" },
    { en: "Electronic and optical properties", uz: "Elektron va optik xossalar", ru: "Электронные и оптические свойства" }
  ],

  /* ---------- Research overview (shown at the top of the Research page) ---------- */
  dissertation: {
    year: "2026",
    image: "assets/img/heterostructure.svg",
    caption: { en: "The three building blocks: a reduced graphene oxide (rGO) sheet, Ti₃C₂Tₓ MXene and anatase TiO₂. Light is absorbed and electrons move across the interfaces.", uz: "Uchta asosiy qism: qaytarilgan grafen oksidi (rGO) qatlami, Ti₃C₂Tₓ MXene va anataz TiO₂. Yorugʻlik yutiladi, elektronlar esa chegara sirtlari orqali oʻtadi.", ru: "Три составляющие: лист восстановленного оксида графена (rGO), MXene Ti₃C₂Tₓ и анатаз TiO₂. Свет поглощается, а электроны переходят через границы раздела." },
    title: {
      en: "Interface-driven electronic and optical properties of graphene–MXene–metal oxide heterostructures",
      uz: "Grafen–MXene–metall oksid asosli geterostrukturalarning interfeys taʼsirida yuzaga keladigan elektron va optik xossalari",
      ru: "Электронные и оптические свойства гетероструктур на основе графен–MXene–оксид металла, обусловленные влиянием интерфейса"
    },
    facts: [
      { en: "Institute of Materials Science, Uzbekistan Academy of Sciences", uz: "Oʻzbekiston Respublikasi Fanlar akademiyasi Materialshunoslik instituti", ru: "Институт материаловедения Академии наук Республики Узбекистан" }
    ],
    summary: {
      en: "Most energy devices are limited by their interfaces, the few ångströms where two different materials meet. Using first-principles calculations in one consistent protocol, this work shows how doping, strain and surface termination control the electronic and optical properties of anatase TiO₂, Ti₃C₂ MXene, reduced graphene oxide (rGO) and the contacts between them. Thirteen atomistic models are compared on the same footing.",
      uz: "Koʻpgina energetik qurilmalarning imkoniyatini ularning chegara sirtlari, yaʼni ikki xil material uchrashadigan bir necha angstremlik soha belgilaydi. Birinchi prinsiplar asosidagi hisoblashlar yagona protokol doirasida bajarilib, legirlash, deformatsiya va sirt terminatsiyasi anataz TiO₂, Ti₃C₂ MXene, qaytarilgan grafen oksidi (rGO) va ular orasidagi kontaktlarning elektron hamda optik xossalarini qanday boshqarishi koʻrsatildi. Jami 13 ta atomistik model bir xil sharoitda taqqoslangan.",
      ru: "Возможности большинства энергетических устройств ограничены их границами раздела: несколькими ангстремами, где встречаются два разных материала. Расчётами из первых принципов в рамках единого протокола показано, как легирование, деформация и поверхностное терминирование управляют электронными и оптическими свойствами анатаза TiO₂, MXene Ti₃C₂, восстановленного оксида графена (rGO) и контактов между ними. В одинаковых условиях сопоставлены 13 атомистических моделей."
    },
    findings: [
      {
        en: "In Cu- and Ag-doped anatase TiO₂ the two dopants are told apart by the Wannier spread, not by the band gap. Ag disturbs the host lattice less, and under 5 % compression the electron mobility reaches about 750 cm²·V⁻¹·s⁻¹.",
        uz: "Cu va Ag bilan legirlangan anataz TiO₂ da legirlovchilarni taqiqlangan zona emas, balki Vanye yoyilishi ajratib beradi. Ag asosiy panjarani kamroq bezovta qiladi va 5 % siqilishda elektron harakatchanligi taxminan 750 sm²·V⁻¹·s⁻¹ ga yetadi.",
        ru: "В анатазе TiO₂, легированном Cu и Ag, примеси различает не ширина запрещённой зоны, а разброс функций Ванье. Ag возмущает матрицу слабее, и при сжатии 5 % подвижность электронов достигает примерно 750 см²·В⁻¹·с⁻¹."
      },
      {
        en: "The termination of Ti₃C₂ selects the type of its contact with TiO₂(001): oxygen termination gives a Schottky barrier of 1.88 eV for electrons, while hydroxyl termination gives an ohmic contact and transfers electrons into the oxide.",
        uz: "Ti₃C₂ terminatsiyasi uning TiO₂(001) bilan kontakt turini tanlaydi: O-terminatsiya elektronlar uchun 1,88 eV li Shottki toʻsigʻini hosil qiladi, OH-terminatsiya esa omik kontakt beradi va oksidga elektron oʻtkazadi.",
        ru: "Терминирование Ti₃C₂ выбирает тип его контакта с TiO₂(001): O-терминирование даёт барьер Шоттки 1,88 эВ для электронов, а OH-терминирование даёт омический контакт и переносит электроны в оксид."
      },
      {
        en: "Termination switches the binding of Ti₃C₂ to rGO between two mechanisms: chemisorption on the bare surface (1.90 J·m⁻² at 1.92 Å) and dispersion binding on the terminated surfaces (0.96 and 1.18 J·m⁻²). On the bare surface, oxygen atoms move from rGO to the carbide.",
        uz: "Terminatsiya Ti₃C₂ ning rGO bilan bogʻlanishini ikki mexanizm orasida almashtiradi: toza sirtda xemosorbsiya (1,90 J·m⁻², 1,92 Å), terminatsiyalangan sirtlarda esa dispersion kuchlar orqali bogʻlanish (0,96 va 1,18 J·m⁻²). Toza sirtda kislorod atomlari rGO dan karbidga koʻchadi.",
        ru: "Терминирование переключает связывание Ti₃C₂ с rGO между двумя механизмами: хемосорбцией на нетерминированной поверхности (1,90 Дж·м⁻², 1,92 Å) и дисперсионным связыванием на терминированных поверхностях (0,96 и 1,18 Дж·м⁻²). На нетерминированной поверхности атомы кислорода переходят от rGO к карбиду."
      },
      {
        en: "The work function of the rGO/Ti₃C₂Tₓ system can be tuned over about 1.9 eV (3.93 to 5.86 eV) by changing a single atomic layer, and the stack absorbs 57 to 69 % less visible light than the sum of its layers.",
        uz: "rGO/Ti₃C₂Tₓ tizimining chiqish ishini bitta atom qatlamini almashtirish orqali taxminan 1,9 eV oraligʻida (3,93–5,86 eV) boshqarish mumkin, geterostrukturaning koʻrinuvchi diapazondagi yutilishi esa tashkil etuvchilar yigʻindisidan 57–69 % past.",
        ru: "Работу выхода системы rGO/Ti₃C₂Tₓ можно менять примерно на 1,9 эВ (от 3,93 до 5,86 эВ) заменой одного атомного слоя, а поглощение гетероструктуры в видимом диапазоне на 57–69 % ниже суммы поглощений её слоёв."
      }
    ],
    tags: ["Quantum ESPRESSO", "PBE + D3(BJ)", "GGA+U", "Wannier functions", "Dipole correction", "UBER fit", "Charge-density difference"]
  },

  /* ---------- Research projects ----------
     status: "ongoing", "published" or "thesis" (a completed result, shown as "Completed").
     image: optional picture from the folder assets/img/, with a caption.   */
  projects: [
    {
      title: { en: "How surface termination binds MXene to reduced graphene oxide", uz: "Sirt terminatsiyasi MXene ni qaytarilgan grafen oksidi bilan qanday bogʻlaydi", ru: "Как поверхностное терминирование связывает MXene с восстановленным оксидом графена" },
      status: "published",
      image: "assets/img/rgo-mxene-binding.png",
      caption: { en: "Binding energy against interlayer distance for rGO on bare, O-terminated and OH-terminated Ti₃C₂.", uz: "rGO ning toza, O- va OH-terminatsiyali Ti₃C₂ bilan bogʻlanish energiyasining qatlamlararo masofaga bogʻliqligi.", ru: "Энергия связи rGO с нетерминированным, O- и OH-терминированным Ti₃C₂ в зависимости от межслоевого расстояния." },
      text: {
        en: "The same rGO sheet (C/O = 5) is placed on three Ti₃C₂ surfaces in one supercell with only 0.20 % lattice mismatch. The bare surface binds it chemically and takes oxygen from it; the O- and OH-terminated surfaces hold it by dispersion forces at about 3.6–3.7 Å. Oxygen groups on the carbon sheet roughly double the adhesion compared with pristine graphene.",
        uz: "Bitta rGO qatlami (C/O = 5) panjara nomutanosibligi atigi 0,20 % boʻlgan yagona superyacheykada uchta Ti₃C₂ sirtiga joylashtirildi. Toza sirt uni kimyoviy bogʻlaydi va undan kislorodni oladi; O- va OH-terminatsiyali sirtlar esa taxminan 3,6–3,7 Å masofada dispersion kuchlar orqali ushlab turadi. Uglerod qatlamidagi kislorodli guruhlar adgeziyani sof grafenga nisbatan taxminan ikki barobar oshiradi.",
        ru: "Один и тот же лист rGO (C/O = 5) размещён на трёх поверхностях Ti₃C₂ в одной суперъячейке с несоответствием решёток всего 0,20 %. Нетерминированная поверхность связывает его химически и забирает у него кислород; O- и OH-терминированные поверхности удерживают его дисперсионными силами на расстоянии около 3,6–3,7 Å. Кислородные группы на углеродном листе увеличивают адгезию примерно вдвое по сравнению с чистым графеном."
      },
      tags: ["rGO", "Ti₃C₂Tₓ", "Adhesion energy", "UBER", "Work function"]
    },
    {
      title: { en: "MXene contacts on anatase TiO₂(001): Schottky or ohmic", uz: "Anataz TiO₂(001) dagi MXene kontaktlari: Shottki yoki omik", ru: "Контакты MXene на анатазе TiO₂(001): Шоттки или омический" },
      status: "thesis",
      image: "assets/img/mxene-tio2-band-diagram.png",
      caption: { en: "Band diagrams of the Ti₃C₂O₂/TiO₂(001) and Ti₃C₂(OH)₂/TiO₂(001) contacts.", uz: "Ti₃C₂O₂/TiO₂(001) va Ti₃C₂(OH)₂/TiO₂(001) kontaktlarining zona diagrammalari.", ru: "Зонные диаграммы контактов Ti₃C₂O₂/TiO₂(001) и Ti₃C₂(OH)₂/TiO₂(001)." },
      text: {
        en: "Commensurate interfaces of O- and OH-terminated Ti₃C₂ with anatase TiO₂(001) are relaxed and analysed with a dipole correction, so each face of the slab has its own vacuum level. Oxygen termination leaves the Fermi level inside the oxide gap, which gives a barrier for electrons. Hydroxyl termination puts it at the conduction-band edge and fills the oxide with electrons. The oxide bands move by 1.8–2.0 eV without any change in the gap.",
        uz: "O- va OH-terminatsiyali Ti₃C₂ ning anataz TiO₂(001) bilan mos chegara sirtlari relaksatsiya qilindi va dipol tuzatmasi bilan tahlil qilindi, shunda plastinaning har bir yuzasi oʻz vakuum sathiga ega boʻladi. O-terminatsiyada Fermi sathi oksidning taqiqlangan zonasi ichida qoladi va elektronlar uchun toʻsiq hosil boʻladi. OH-terminatsiyada u oʻtkazuvchanlik zonasi chegarasiga tushadi va oksid elektronlar bilan toʻladi. Oksid zonalari taqiqlangan zona oʻzgarmagan holda 1,8–2,0 eV ga siljiydi.",
        ru: "Соразмерные границы раздела O- и OH-терминированного Ti₃C₂ с анатазом TiO₂(001) релаксированы и проанализированы с дипольной поправкой, поэтому у каждой стороны пластины свой уровень вакуума. При O-терминировании уровень Ферми остаётся внутри запрещённой зоны оксида, что даёт барьер для электронов. При OH-терминировании он оказывается на краю зоны проводимости, и оксид заполняется электронами. Зоны оксида смещаются на 1,8–2,0 эВ без изменения ширины запрещённой зоны."
      },
      tags: ["Ti₃C₂O₂", "Ti₃C₂(OH)₂", "TiO₂(001)", "Band alignment", "Dipole correction"]
    },
    {
      title: { en: "Strain-modulated hybridization in Cu- and Ag-doped anatase TiO₂", uz: "Cu va Ag bilan legirlangan anataz TiO₂ da deformatsiya bilan boshqariladigan gibridlanish", ru: "Гибридизация, управляемая деформацией, в анатазе TiO₂, легированном Cu и Ag" },
      status: "published",
      image: "assets/img/ag-tio2-wannier.png",
      caption: { en: "Maximally localized Wannier functions on the Ag dopant in anatase TiO₂.", uz: "Anataz TiO₂ dagi Ag legirlovchisida maksimal lokallashgan Vanye funksiyalari.", ru: "Максимально локализованные функции Ванье на примеси Ag в анатазе TiO₂." },
      text: {
        en: "Doping narrows the band gap of anatase from about 3.2 eV to 3.1 eV (Ag) and 3.0 eV (Cu). Maximally localized Wannier functions show that Cu perturbs the electronic states more strongly than Ag, and that compressive strain strengthens dopant–host hybridization. Ag-doped TiO₂ under compression has the lighter electrons and the higher mobility. Published in Next Materials (2026).",
        uz: "Legirlash anatazning taqiqlangan zonasini taxminan 3,2 eV dan 3,1 eV (Ag) va 3,0 eV (Cu) gacha toraytiradi. Maksimal lokallashgan Vanye funksiyalari Cu elektron holatlarni Ag ga qaraganda kuchliroq bezovta qilishini, siqilish deformatsiyasi esa legirlovchi va panjara orasidagi gibridlanishni kuchaytirishini koʻrsatadi. Siqilgan Ag-legirlangan TiO₂ da elektronlar yengilroq va harakatchanlik yuqoriroq. Next Materials jurnalida chop etilgan (2026).",
        ru: "Легирование сужает запрещённую зону анатаза примерно с 3,2 эВ до 3,1 эВ (Ag) и 3,0 эВ (Cu). Максимально локализованные функции Ванье показывают, что Cu возмущает электронные состояния сильнее, чем Ag, а сжатие усиливает гибридизацию примеси с матрицей. В сжатом TiO₂, легированном Ag, электроны легче, а подвижность выше. Опубликовано в Next Materials (2026)."
      },
      tags: ["DFT+U", "Wannier functions", "TiO₂", "Strain", "Carrier mobility"]
    },
    {
      title: { en: "Adsorption of small molecules on transition-metal surfaces", uz: "Oʻtish metallari sirtida kichik molekulalar adsorbsiyasi", ru: "Адсорбция малых молекул на поверхностях переходных металлов" },
      status: "published",
      image: "assets/img/water-on-pt.png",
      caption: { en: "A water molecule on the on-top site of a platinum surface.", uz: "Platina sirtidagi atom ustida joylashgan suv molekulasi.", ru: "Молекула воды над атомом поверхности платины." },
      text: {
        en: "Spin-polarized DFT study of a single water molecule on the (100) and (110) surfaces of Co, Ni, Pd and Pt. Cobalt binds water most strongly and platinum most weakly, the on-top site is the most favourable, and two spin-resolved d-band centres are needed to describe the magnetic metals. Published in Physica E (2026). Related conference work covers O₂ and CO₂ on platinum facets.",
        uz: "Co, Ni, Pd va Pt ning (100) va (110) sirtlarida bitta suv molekulasi adsorbsiyasini spin-qutblangan DFT yordamida oʻrganish. Kobalt suvni eng kuchli, platina esa eng kuchsiz bogʻlaydi, eng qulay holat atom ustidagi oʻrin, magnit metallarni tavsiflash uchun esa spin boʻyicha ajratilgan ikkita d-zona markazi kerak boʻladi. Physica E jurnalida chop etilgan (2026). Konferensiya ishlarida platina sirtlarida O₂ va CO₂ adsorbsiyasi ham koʻrib chiqilgan.",
        ru: "Спин-поляризованное DFT-исследование одиночной молекулы воды на поверхностях (100) и (110) Co, Ni, Pd и Pt. Кобальт связывает воду сильнее всего, платина слабее всего, наиболее выгодно положение над атомом, а для описания магнитных металлов нужны два спин-разрешённых центра d-зоны. Опубликовано в Physica E (2026). В докладах конференций рассмотрена также адсорбция O₂ и CO₂ на гранях платины."
      },
      tags: ["Spin-polarized DFT", "d-band centre", "Co, Ni, Pd, Pt", "H₂O, O₂, CO₂"]
    },
    {
      title: { en: "Machine-learning-guided discovery of Janus MXenes", uz: "Mashinaviy oʻqitish yordamida Janus MXenlarni izlash", ru: "Поиск Janus MXene с помощью машинного обучения" },
      status: "ongoing",
      text: {
        en: "I build candidate Janus MXene structures from a prototype, screen them with materials descriptors and ensemble machine-learning models, and then check the most promising ones with spin-polarized DFT. The aim is to find stable candidates for photocatalytic water splitting and hydrogen adsorption.",
        uz: "Prototip asosida nomzod Janus MXene tuzilmalarini yarataman, ularni material deskriptorlari va ansambl mashinaviy oʻqitish modellari bilan saralayman, soʻng eng istiqbollilarini spin-qutblangan DFT bilan tekshiraman. Maqsad — suvni fotokatalitik parchalash va vodorod adsorbsiyasi uchun barqaror nomzodlarni topish.",
        ru: "Я строю кандидатные структуры Janus MXene на основе прототипа, отбираю их с помощью дескрипторов и ансамблевых моделей машинного обучения, а затем проверяю самые перспективные спин-поляризованным DFT. Цель — найти стабильные кандидаты для фотокаталитического разложения воды и адсорбции водорода."
      },
      tags: ["Matminer", "Random Forest", "Gradient boosting", "GNN", "pymatgen", "DFT"]
    }
  ],

  /* ---------- Publications (newest first) ----------
     type: "journal" or "conference".  details: volume, pages or article number.  */
  publications: [
    {
      year: 2026, type: "journal",
      title: "Strain-modulated hybridization and electronic dispersion in Cu- and Ag-doped anatase TiO₂: A Wannier-function perspective",
      authors: "A.A. Azamjonov, L. Khoroshko, O. Ruzimuradov, Sh.I. Mamatkulov",
      venue: "Next Materials", details: "12, 102202",
      doi: "10.1016/j.nxmate.2026.102202",
      pdf: ""                                 // e.g. "files/papers/tio2-strain.pdf"
    },
    {
      year: 2026, type: "journal",
      title: "DFT study: mechanism of adsorption of a single water molecule on transition metal surfaces",
      authors: "A.A. Azamjonov, Kh.T. Butanov, Sh.I. Mamatkulov",
      venue: "Physica E: Low-dimensional Systems and Nanostructures", details: "182, 116580",
      doi: "10.1016/j.physe.2026.116580",
      pdf: ""
    },
    {
      year: 2026, type: "journal",
      title: "First-principles investigation of Ti₃C₂Tₓ/rGO heterostructures: effect of surface termination on electronic and optical properties",
      authors: "A.A. Azamjonov, D.G. Khajibaev",
      venue: "Journal of Fundamental and Applied Research", details: "6(3), 20260304",
      doi: "10.35938/JFAR-2026-3-00004",
      pdf: ""
    },
    {
      year: 2026, type: "journal",
      title: "Electronic and optical properties of graphene and Ti₃C₂ MXene systems",
      authors: "A.A. Azamjonov, A.A. Narzullayev",
      venue: "NamDU ilmiy axborotnomasi (Scientific Bulletin of Namangan State University)", details: "No. 4, 29–33",
      doi: "",
      pdf: ""
    },
    {
      year: 2025, type: "journal",
      title: "Theoretical study of the electronic and optical properties of Cu-doped anatase TiO₂ using DFT",
      authors: "A.A. Azamjonov, Sh.I. Mamatkulov",
      venue: "Uzbek Journal of Modern Physics", details: "2(2), 12–17",
      doi: "",
      pdf: ""
    },
    {
      year: 2025, type: "conference",
      title: "CO₂ monomer adsorption on Pt(100) and Pt(110) facets: a spin-polarized DFT and d-band analysis",
      authors: "A.A. Azamjonov",
      venue: "Jahon miqyosida yashil iqtisodiyot va toʻrtinchi sanoat inqilobi doirasida qayta tiklanuvchi energetikaning roli, international scientific-practical conference, TDTU, Tashkent, 3–4 October", details: "34–38",
      doi: "",
      pdf: ""
    },
    {
      year: 2025, type: "conference",
      title: "Oxygen adsorption on Pt(100) and Pt(111): distance-scan and coverage effects from spin-polarized DFT",
      authors: "A.A. Azamjonov",
      venue: "New horizons of low-carbon development in the world and in Uzbekistan, II International Scientific-Technical Conference, Tashkent, 25–26 September", details: "204–207",
      doi: "",
      pdf: ""
    },
    {
      year: 2024, type: "conference",
      title: "The electronic structure modification and photocatalytic ability improvement of titanium dioxide doped with silver and copper atoms",
      authors: "A.A. Azamjonov, L.S. Khoroshko, Sh.I. Mamatkulov",
      venue: "Компьютерное проектирование в электронике (EDA Conference 2024), BSUIR, Minsk, 28 November", details: "87–91",
      doi: "",
      pdf: ""
    },
    {
      year: 2024, type: "conference",
      title: "Enhancing the electronic structure of Cu-doped TiO₂ based on DFT calculations",
      authors: "A.A. Azamjonov",
      venue: "Proceedings of the Uzbek–Chinese Scientific Forum on New Materials, Tashkent–Parkent, 3–4 May", details: "52–53",
      doi: "",
      pdf: ""
    }
  ],

  /* ---------- Tutorial videos (newest first) ----------
     youtube: the video ID, i.e. the part after "v=" in the link.
     For https://www.youtube.com/watch?v=abc123XYZ  write  "abc123XYZ".
     Leave it empty ("") to show "Video coming soon".                 */
  videoTopics: {
    qe: { en: "Quantum ESPRESSO", uz: "Quantum ESPRESSO", ru: "Quantum ESPRESSO" },
    ml: { en: "Machine learning", uz: "Mashinaviy oʻqitish", ru: "Машинное обучение" },
    basics: { en: "DFT basics", uz: "DFT asoslari", ru: "Основы DFT" }
  },
  videos: [
    {
      topic: "qe",
      date: "2026-11-01",
      youtube: "",
      title: { en: "Your first SCF calculation in Quantum ESPRESSO", uz: "Quantum ESPRESSO’da birinchi SCF hisoblash", ru: "Первый SCF-расчёт в Quantum ESPRESSO" },
      text: { en: "Writing the input file, running pw.x and reading the output.", uz: "Kirish faylini yozish, pw.x ni ishga tushirish va natijani oʻqish.", ru: "Пишем входной файл, запускаем pw.x и читаем результат." }
    },
    {
      topic: "basics",
      date: "2026-10-20",
      youtube: "",
      title: { en: "Converging the cutoff energy and k-points", uz: "Kesish energiyasi va k-nuqtalar boʻyicha yaqinlashish", ru: "Сходимость по энергии обрезания и k-точкам" },
      text: { en: "Why convergence tests matter and how to do them step by step.", uz: "Yaqinlashish testlari nima uchun muhim va ularni bosqichma-bosqich qanday bajarish.", ru: "Зачем нужны тесты сходимости и как выполнять их шаг за шагом." }
    },
    {
      topic: "ml",
      date: "2026-10-05",
      youtube: "",
      title: { en: "Pre-relaxing structures with MACE before DFT", uz: "DFT dan oldin tuzilmalarni MACE bilan dastlabki relaksatsiya qilish", ru: "Предварительная релаксация структур в MACE перед DFT" },
      text: { en: "Saving DFT time by starting from a geometry relaxed with a machine-learning potential.", uz: "Mashinaviy oʻqitish potensiali bilan relaksatsiya qilingan geometriyadan boshlab DFT vaqtini tejash.", ru: "Экономим время DFT, начиная с геометрии, релаксированной ML-потенциалом." }
    }
  ],

  /* ---------- Scripts and downloads ----------
     file: put the script in the folder files/scripts/ and write its path here.
     Leave it empty ("") to show "File coming soon".                    */
  scripts: [
    {
      name: "make_heterostructure.py",
      language: "Python",
      file: "files/scripts/make_heterostructure.py",
      source: "",
      text: { en: "Builds an MXene/anatase TiO₂(001) interface from two CIF files: finds a commensurate supercell pair, stacks the slabs and writes Quantum ESPRESSO inputs for the interface and for both reference calculations. Needs ASE and NumPy.", uz: "Ikkita CIF fayldan MXene/anataz TiO₂(001) chegara sirtini quradi: mos superyacheyka juftini topadi, plastinalarni ustma-ust joylashtiradi hamda chegara sirti va ikkala tayanch hisob uchun Quantum ESPRESSO kirish fayllarini yozadi. ASE va NumPy kerak.", ru: "Строит границу раздела MXene/анатаз TiO₂(001) из двух CIF-файлов: находит соразмерную пару суперъячеек, складывает пластины и записывает входные файлы Quantum ESPRESSO для границы раздела и двух опорных расчётов. Нужны ASE и NumPy." }
    },
    {
      name: "make_dipole_scf.py",
      language: "Python",
      file: "files/scripts/make_dipole_scf.py",
      source: "",
      text: { en: "Turns a finished relaxation into a dipole-corrected SCF input for work-function calculations. It takes the final coordinates, keeps every other setting, and adds tefield and dipfield with an automatically placed dipole layer. The scripts below import it, so keep them in the same folder.", uz: "Tugallangan relaksatsiyani chiqish ishini hisoblash uchun dipol tuzatmali SCF kirish fayliga aylantiradi. Yakuniy koordinatalarni oladi, qolgan sozlamalarni oʻzgartirmaydi va dipol qatlamini avtomatik joylashtirib, tefield hamda dipfield ni qoʻshadi. Quyidagi skriptlar uni import qiladi, shuning uchun ularni bitta papkada saqlang.", ru: "Превращает завершённую релаксацию во входной файл SCF с дипольной поправкой для расчёта работы выхода. Берёт конечные координаты, сохраняет остальные настройки и добавляет tefield и dipfield с автоматически размещённым дипольным слоем. Скрипты ниже импортируют его, поэтому держите их в одной папке." }
    },
    {
      name: "phi_two_faces.py",
      language: "Python",
      file: "files/scripts/phi_two_faces.py",
      source: "",
      text: { en: "Reads the planar-averaged potential from average.x and reports the work function of both faces of an asymmetric slab, with checks of vacuum flatness, forces and convergence.", uz: "average.x dan tekislik boʻyicha oʻrtachalangan potensialni oʻqiydi va nosimmetrik plastinaning ikkala yuzasi uchun chiqish ishini beradi; vakuum sathining tekisligi, kuchlar va yaqinlashishni ham tekshiradi.", ru: "Читает усреднённый по плоскости потенциал из average.x и выдаёт работу выхода обеих сторон несимметричной пластины, проверяя плоскость вакуумного уровня, силы и сходимость." }
    },
    {
      name: "make_post_inputs.py",
      language: "Python",
      file: "files/scripts/make_post_inputs.py",
      source: "",
      text: { en: "Writes all post-processing inputs for a converged interface SCF: pp.x and average.x for the potential, projwfc.x for the PDOS, and the two fragment reference runs in the same cell.", uz: "Yaqinlashgan chegara sirti SCF hisobi uchun barcha keyingi ishlov kirish fayllarini yozadi: potensial uchun pp.x va average.x, PDOS uchun projwfc.x hamda oʻsha yacheykadagi ikkita fragment tayanch hisobi.", ru: "Записывает все входные файлы постобработки для сошедшегося SCF границы раздела: pp.x и average.x для потенциала, projwfc.x для PDOS и два опорных расчёта фрагментов в той же ячейке." }
    },
    {
      name: "adhesion.py",
      language: "Python",
      file: "files/scripts/adhesion.py",
      source: "",
      text: { en: "Computes the adhesion energy (work of separation) of an interface from three SCF outputs, and refuses to give a number if the runs are not comparable.", uz: "Uchta SCF natijasidan chegara sirtining adgeziya energiyasini (ajratish ishini) hisoblaydi; hisoblar oʻzaro taqqoslanadigan boʻlmasa, natija bermaydi.", ru: "Вычисляет энергию адгезии (работу разделения) границы раздела по трём выходным файлам SCF и отказывается выдавать число, если расчёты несопоставимы." }
    },
    {
      name: "charge_transfer.py",
      language: "Python",
      file: "files/scripts/charge_transfer.py",
      source: "",
      text: { en: "Integrates the plane-averaged charge-density difference to give the number of electrons transferred across the interface, with an optional plot.", uz: "Tekislik boʻyicha oʻrtachalangan zaryad zichligi ayirmasini integrallab, chegara sirti orqali oʻtgan elektronlar sonini beradi; grafik ham chizishi mumkin.", ru: "Интегрирует усреднённую по плоскости разность зарядовой плотности и даёт число электронов, перенесённых через границу раздела; может построить график." }
    },
    {
      name: "fragment_pdos.py",
      language: "Python",
      file: "files/scripts/fragment_pdos.py",
      source: "",
      text: { en: "Sums projwfc.x output into a projected density of states for each fragment and element of an interface, and saves it as CSV files.", uz: "projwfc.x natijalarini chegara sirtining har bir fragmenti va elementi boʻyicha holatlar zichligiga yigʻadi va CSV fayllarga saqlaydi.", ru: "Суммирует вывод projwfc.x в проектированную плотность состояний для каждого фрагмента и элемента границы раздела и сохраняет её в CSV." }
    },
    {
      name: "interface_contacts.py",
      language: "Python",
      file: "files/scripts/interface_contacts.py",
      source: "",
      text: { en: "Lists the shortest atomic contacts across an interface in a pw.x input, including periodic images in the plane.", uz: "pw.x kirish faylidagi chegara sirti orqali eng qisqa atomlararo masofalarni, tekislikdagi davriy tasvirlarni ham hisobga olgan holda, roʻyxat qiladi.", ru: "Перечисляет кратчайшие межатомные контакты через границу раздела во входном файле pw.x с учётом периодических образов в плоскости." }
    },
    {
      name: "check_qe_input.py",
      language: "Python",
      file: "",                               // e.g. "files/scripts/check_qe_input.py"
      source: "",                             // optional link to the code on GitHub
      text: { en: "Checks a Quantum ESPRESSO input file for common mistakes before you start a run.", uz: "Hisoblashni boshlashdan oldin Quantum ESPRESSO kirish faylini keng tarqalgan xatolarga tekshiradi.", ru: "Проверяет входной файл Quantum ESPRESSO на типичные ошибки перед запуском." }
    },
    {
      name: "mace_prerelax.py",
      language: "Python",
      file: "",
      source: "",
      text: { en: "Pre-relaxes one structure with the MACE-MP-0 potential so the DFT relaxation starts closer to the answer.", uz: "Bitta tuzilmani MACE-MP-0 potensiali bilan dastlabki relaksatsiya qiladi, shunda DFT relaksatsiyasi javobga yaqinroq nuqtadan boshlanadi.", ru: "Предварительно релаксирует структуру потенциалом MACE-MP-0, чтобы DFT-релаксация стартовала ближе к ответу." }
    },
    {
      name: "mace_batch_relax.py",
      language: "Python",
      file: "",
      source: "",
      text: { en: "Runs the MACE pre-relaxation over a whole folder of .in files, with several relaxation modes, and writes final energies and lattice parameters to a CSV file.", uz: "Butun papkadagi .in fayllar uchun MACE dastlabki relaksatsiyasini bir nechta rejimda bajaradi hamda yakuniy energiyalar va panjara parametrlarini CSV faylga yozadi.", ru: "Запускает предварительную релаксацию MACE для целой папки .in-файлов в нескольких режимах и записывает конечные энергии и параметры решётки в CSV." }
    },
    {
      name: "run_aimd_workflow.sh",
      language: "Bash",
      file: "",
      source: "",
      text: { en: "Runs a list of AIMD input files one after another in priority order.", uz: "AIMD kirish fayllari roʻyxatini ustuvorlik tartibida ketma-ket ishga tushiradi.", ru: "Запускает список входных файлов AIMD один за другим в порядке приоритета." }
    }
  ],

  /* ---------- Notes (newest first) ----------
     id: a short name with only small letters, digits and hyphens. It must start with "note-".
     body: the text of the note, written in simple HTML (<p>, <h2>, <pre><code>, <ul><li>). */
  notes: [
    {
      id: "note-dipole-correction-work-function",
      date: "2026-11-13",
      title: { en: "Work function of an asymmetric slab: use a dipole correction", uz: "Nosimmetrik plastinaning chiqish ishi: dipol tuzatmasidan foydalaning", ru: "Работа выхода несимметричной пластины: используйте дипольную поправку" },
      summary: { en: "When the two faces of a slab are different, each face has its own vacuum level. Here is how to get both from one Quantum ESPRESSO run.", uz: "Plastinaning ikki yuzasi turlicha boʻlsa, har birining oʻz vakuum sathi boʻladi. Ikkalasini bitta Quantum ESPRESSO hisobidan qanday olish mumkin.", ru: "Если две стороны пластины разные, у каждой свой уровень вакуума. Как получить оба из одного расчёта Quantum ESPRESSO." },
      body: {
        en: `
<p>An interface slab such as MXene on TiO₂ has two different faces, so it carries a dipole and the electrostatic potential in the vacuum is not the same on both sides. I first tried <code>assume_isolated='2D'</code>. It needs a cell more than twice as tall as the slab, and in a shorter cell the vacuum potential never becomes flat, so the work function you read is wrong.</p>
<p>A dipole correction needs no extra vacuum. It puts a thin compensating layer in the middle of the vacuum, and each face then gets its own flat plateau.</p>
<h2>Step 1. Change the input</h2>
<p>Start from the relaxed coordinates and change only this:</p>
<pre><code>&amp;CONTROL
  calculation = 'scf', tprnfor = .true.
  tefield = .true., dipfield = .true.
/
&amp;SYSTEM
  edir = 3, emaxpos = 0.95, eopreg = 0.05, eamp = 0.0
/</code></pre>
<p>Remove <code>assume_isolated</code>. Choose <code>emaxpos</code> so that the dipole layer sits in the middle of the vacuum, at least 6 Å from the nearest atom on both sides. The script <code>make_dipole_scf.py</code> on the Scripts page does all of this automatically.</p>
<h2>Step 2. Run the SCF and get the potential</h2>
<pre><code>mpirun -np 16 pw.x -in slab_dip.scf.in > slab_dip.scf.out
pp.x -in slab_dip.pp.in          # plot_num = 11
average.x &lt; slab_dip.avg.in</code></pre>
<h2>Step 3. Read the two work functions</h2>
<p>For each face, average the potential over a window that starts a few ångströms outside the outermost atom and stops before the dipole layer. The work function of that face is the window mean minus the Fermi energy. The script <code>phi_two_faces.py</code> does this and also checks that the plateau is flat.</p>
<h2>Step 4. Check the result</h2>
<ul>
<li>The potential is flat in both vacuum windows.</li>
<li>The forces in the new SCF are still small. If they are not, relax again with the correction switched on.</li>
<li>The step between the two vacuum levels agrees with the dipole moment printed by pw.x.</li>
</ul>`,
        uz: `
<p>TiO₂ ustidagi MXene kabi chegara sirtli plastinaning ikki yuzasi turlicha, shuning uchun u dipol momentiga ega va vakuumdagi elektrostatik potensial ikki tomonda bir xil emas. Avval <code>assume_isolated='2D'</code> ni sinab koʻrdim. U plastinadan ikki barobardan ortiq baland yacheykani talab qiladi, qisqaroq yacheykada esa vakuum potensiali tekislanmaydi va oʻqilgan chiqish ishi notoʻgʻri boʻladi.</p>
<p>Dipol tuzatmasi qoʻshimcha vakuum talab qilmaydi. U vakuum oʻrtasiga yupqa kompensatsiyalovchi qatlam qoʻyadi va har bir yuza oʻzining tekis sathiga ega boʻladi.</p>
<h2>1-qadam. Kirish faylini oʻzgartiring</h2>
<p>Relaksatsiyadan oʻtgan koordinatalardan boshlang va faqat quyidagilarni oʻzgartiring:</p>
<pre><code>&amp;CONTROL
  calculation = 'scf', tprnfor = .true.
  tefield = .true., dipfield = .true.
/
&amp;SYSTEM
  edir = 3, emaxpos = 0.95, eopreg = 0.05, eamp = 0.0
/</code></pre>
<p><code>assume_isolated</code> ni olib tashlang. <code>emaxpos</code> ni shunday tanlangki, dipol qatlami vakuum oʻrtasida, ikkala tomondagi eng yaqin atomdan kamida 6 Å uzoqlikda boʻlsin. Skriptlar sahifasidagi <code>make_dipole_scf.py</code> bularning barchasini avtomatik bajaradi.</p>
<h2>2-qadam. SCF ni ishga tushiring va potensialni oling</h2>
<pre><code>mpirun -np 16 pw.x -in slab_dip.scf.in > slab_dip.scf.out
pp.x -in slab_dip.pp.in          # plot_num = 11
average.x &lt; slab_dip.avg.in</code></pre>
<h2>3-qadam. Ikkala chiqish ishini oʻqing</h2>
<p>Har bir yuza uchun potensialni eng chetki atomdan bir necha angstrem tashqarida boshlanib, dipol qatlamidan oldin tugaydigan oraliqda oʻrtachalang. Shu yuzaning chiqish ishi oraliqdagi oʻrtacha qiymatdan Fermi energiyasini ayirganga teng. <code>phi_two_faces.py</code> skripti buni bajaradi va sathning tekisligini ham tekshiradi.</p>
<h2>4-qadam. Natijani tekshiring</h2>
<ul>
<li>Potensial ikkala vakuum oraligʻida tekis.</li>
<li>Yangi SCF dagi kuchlar hali ham kichik. Aks holda tuzatmani yoqqan holda qayta relaksatsiya qiling.</li>
<li>Ikki vakuum sathi orasidagi sakrash pw.x chiqargan dipol momentiga mos keladi.</li>
</ul>`,
        ru: `
<p>У пластины с границей раздела, например MXene на TiO₂, две разные стороны, поэтому она несёт дипольный момент, и электростатический потенциал в вакууме с двух сторон разный. Сначала я попробовал <code>assume_isolated='2D'</code>. Ему нужна ячейка более чем вдвое выше пластины, а в более короткой ячейке потенциал в вакууме не выходит на плато, и считанная работа выхода неверна.</p>
<p>Дипольной поправке дополнительный вакуум не нужен. Она помещает тонкий компенсирующий слой в середину вакуума, и у каждой стороны появляется своё ровное плато.</p>
<h2>Шаг 1. Измените входной файл</h2>
<p>Возьмите релаксированные координаты и измените только это:</p>
<pre><code>&amp;CONTROL
  calculation = 'scf', tprnfor = .true.
  tefield = .true., dipfield = .true.
/
&amp;SYSTEM
  edir = 3, emaxpos = 0.95, eopreg = 0.05, eamp = 0.0
/</code></pre>
<p>Удалите <code>assume_isolated</code>. Подберите <code>emaxpos</code> так, чтобы дипольный слой находился в середине вакуума, не ближе 6 Å к ближайшему атому с обеих сторон. Скрипт <code>make_dipole_scf.py</code> на странице «Скрипты» делает всё это автоматически.</p>
<h2>Шаг 2. Запустите SCF и получите потенциал</h2>
<pre><code>mpirun -np 16 pw.x -in slab_dip.scf.in > slab_dip.scf.out
pp.x -in slab_dip.pp.in          # plot_num = 11
average.x &lt; slab_dip.avg.in</code></pre>
<h2>Шаг 3. Считайте две работы выхода</h2>
<p>Для каждой стороны усредните потенциал в окне, которое начинается в нескольких ангстремах за крайним атомом и заканчивается перед дипольным слоем. Работа выхода этой стороны равна среднему по окну минус энергия Ферми. Скрипт <code>phi_two_faces.py</code> делает это и заодно проверяет, что плато ровное.</p>
<h2>Шаг 4. Проверьте результат</h2>
<ul>
<li>Потенциал ровный в обоих вакуумных окнах.</li>
<li>Силы в новом SCF по-прежнему малы. Если нет, повторите релаксацию с включённой поправкой.</li>
<li>Скачок между двумя уровнями вакуума согласуется с дипольным моментом, который печатает pw.x.</li>
</ul>`
      }
    },
    {
      id: "note-crlf-line-endings",
      date: "2026-11-10",
      title: { en: "Why a Quantum ESPRESSO input written on Windows can fail on Linux", uz: "Windows’da yozilgan Quantum ESPRESSO kirish fayli nega Linux’da ishlamasligi mumkin", ru: "Почему входной файл Quantum ESPRESSO, написанный в Windows, может не работать в Linux" },
      summary: { en: "Hidden line-ending characters are a common cause of strange input errors. Here is how to find and remove them.", uz: "Koʻrinmas qator oxiri belgilari gʻalati kirish xatolarining keng tarqalgan sababi. Ularni qanday topish va olib tashlash mumkin.", ru: "Скрытые символы конца строки — частая причина странных ошибок ввода. Как их найти и убрать." },
      body: {
        en: `
<p>Windows and Linux end each line of a text file differently. Windows writes two hidden characters (called CRLF), Linux writes one (LF). If you write an input file in a Windows editor and run it under Linux or WSL, the extra hidden character can end up inside a keyword or a file name, and the program stops with an error that seems to make no sense.</p>
<h2>Step 1. Check the file</h2>
<pre><code>file scf.in</code></pre>
<p>If the answer contains <code>with CRLF line terminators</code>, the file has Windows line endings.</p>
<h2>Step 2. Convert it</h2>
<pre><code>dos2unix scf.in</code></pre>
<p>If <code>dos2unix</code> is not installed, this does the same job:</p>
<pre><code>sed -i 's/\\r$//' scf.in</code></pre>
<h2>Step 3. Prevent it next time</h2>
<p>Set your editor to save files with LF line endings. In VS Code, click <code>CRLF</code> in the bottom-right corner and choose <code>LF</code>.</p>`,
        uz: `
<p>Windows va Linux matnli fayldagi har bir qatorni turlicha tugatadi. Windows ikkita koʻrinmas belgi (CRLF) yozadi, Linux esa bitta (LF). Agar kirish faylini Windows muharririda yozib, Linux yoki WSL’da ishga tushirsangiz, ortiqcha koʻrinmas belgi kalit soʻz yoki fayl nomi ichiga tushib qolishi mumkin va dastur tushunarsiz xato bilan toʻxtaydi.</p>
<h2>1-qadam. Faylni tekshiring</h2>
<pre><code>file scf.in</code></pre>
<p>Agar javobda <code>with CRLF line terminators</code> yozuvi boʻlsa, faylda Windows qator oxirlari bor.</p>
<h2>2-qadam. Faylni oʻzgartiring</h2>
<pre><code>dos2unix scf.in</code></pre>
<p>Agar <code>dos2unix</code> oʻrnatilmagan boʻlsa, quyidagi buyruq ham xuddi shu ishni bajaradi:</p>
<pre><code>sed -i 's/\\r$//' scf.in</code></pre>
<h2>3-qadam. Keyingi safar oldini oling</h2>
<p>Muharriringizni fayllarni LF qator oxiri bilan saqlaydigan qilib sozlang. VS Code’da pastki oʻng burchakdagi <code>CRLF</code> yozuvini bosing va <code>LF</code> ni tanlang.</p>`,
        ru: `
<p>Windows и Linux по-разному заканчивают строки в текстовом файле. Windows записывает два скрытых символа (CRLF), Linux — один (LF). Если написать входной файл в редакторе Windows и запустить его в Linux или WSL, лишний скрытый символ может попасть внутрь ключевого слова или имени файла, и программа остановится с непонятной ошибкой.</p>
<h2>Шаг 1. Проверьте файл</h2>
<pre><code>file scf.in</code></pre>
<p>Если в ответе есть <code>with CRLF line terminators</code>, в файле окончания строк Windows.</p>
<h2>Шаг 2. Преобразуйте его</h2>
<pre><code>dos2unix scf.in</code></pre>
<p>Если <code>dos2unix</code> не установлен, то же самое делает команда:</p>
<pre><code>sed -i 's/\\r$//' scf.in</code></pre>
<h2>Шаг 3. Чтобы это не повторялось</h2>
<p>Настройте редактор на сохранение файлов с окончаниями LF. В VS Code нажмите <code>CRLF</code> в правом нижнем углу и выберите <code>LF</code>.</p>`
      }
    }
  ],

  /* ---------- About page ---------- */
  about: {
    bio: {
      en: [
        "I am a computational materials scientist based in Tashkent. I hold an MSc in Physics from the National University of Uzbekistan and work as a Junior Research Fellow at the National Scientific Research Institute of Renewable Energy Sources.",
        "My work combines first-principles DFT calculations with machine learning to search for new materials for photocatalysis and energy applications. I also have laboratory experience: for my Master's thesis I synthesised ZnO nanostructures by the hydrothermal method and characterised them with UV-Vis, XRD and SEM.",
        "At the Institute of Materials Science of the Uzbekistan Academy of Sciences I study the interfaces between graphene, MXenes and metal oxides.",
        "Alongside research I teach physics and translate physics texts."
      ],
      uz: [
        "Men Toshkentda faoliyat yurituvchi hisoblash materialshunosiman. Oʻzbekiston Milliy universitetida fizika boʻyicha magistr darajasini olganman va Qayta tiklanuvchi energiya manbalari milliy ilmiy-tadqiqot institutida kichik ilmiy xodim boʻlib ishlayman.",
        "Ishimda fotokataliz va energetika uchun yangi materiallarni izlashda birinchi tamoyillarga asoslangan DFT hisoblashlarini mashinaviy oʻqitish bilan birlashtiraman. Laboratoriya tajribam ham bor: magistrlik ishimda ZnO nanotuzilmalarini gidrotermal usulda sintez qilib, ularni UV-Vis, XRD va SEM yordamida tavsiflaganman.",
        "Oʻzbekiston Respublikasi Fanlar akademiyasi Materialshunoslik institutida grafen, MXene va metall oksidlari orasidagi chegara sirtlarini oʻrganaman.",
        "Tadqiqot bilan bir qatorda fizikadan dars beraman va fizikaga oid matnlarni tarjima qilaman."
      ],
      ru: [
        "Я специалист по вычислительному материаловедению из Ташкента. Имею степень магистра физики Национального университета Узбекистана и работаю младшим научным сотрудником в Национальном научно-исследовательском институте возобновляемых источников энергии.",
        "В работе я сочетаю DFT-расчёты из первых принципов с машинным обучением для поиска новых материалов для фотокатализа и энергетики. У меня есть и лабораторный опыт: в магистерской работе я синтезировал наноструктуры ZnO гидротермальным методом и исследовал их методами UV-Vis, XRD и SEM.",
        "В Институте материаловедения Академии наук Республики Узбекистан я изучаю границы раздела между графеном, MXene и оксидами металлов.",
        "Помимо исследований я преподаю физику и перевожу тексты по физике."
      ]
    },
    positions: [
      {
        what: { en: "Junior Research Fellow", uz: "Kichik ilmiy xodim", ru: "Младший научный сотрудник" },
        where: { en: "National Scientific Research Institute of Renewable Energy Sources, Tashkent", uz: "Qayta tiklanuvchi energiya manbalari milliy ilmiy-tadqiqot instituti, Toshkent", ru: "Национальный научно-исследовательский институт возобновляемых источников энергии, Ташкент" },
        when: ""                              // TODO: e.g. "2024 – present"
      }
    ],
    education: [
      {
        what: { en: "MSc in Physics", uz: "Fizika boʻyicha magistr", ru: "Магистр физики" },
        where: { en: "National University of Uzbekistan", uz: "Oʻzbekiston Milliy universiteti", ru: "Национальный университет Узбекистана" },
        when: ""                              // TODO: e.g. "2020 – 2022"
      }
    ],
    skills: ["Quantum ESPRESSO", "CASTEP", "Wannier90", "DFT+U", "Dipole correction", "ASE", "MACE-MP-0", "Python", "pymatgen", "Matminer", "Materials Project API", "Random Forest", "Graph neural networks", "XRD", "SEM", "UV-Vis"]
  }
};
