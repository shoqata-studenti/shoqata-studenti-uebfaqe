import type { UpcomingPost } from "@/components/upcoming-section";
import type { Locale } from "@/lib/i18n/config";

export type LocalPreviewPost = UpcomingPost & {
  content: Record<Locale, string>;
  detailCoverSrc?: string;
};

const MEET_STUDENTI_ID = -300;
const ACTIVITY_FAIR_ID = -301;
const VJETORI_25_ID = -400;

const meetStudentiContent = {
  sq: `Takohu, lidhu, inspirohu në Meet Studenti!\n\nNjë semestër i ri, mundësi të reja!\nPër ta nisur sa më bukur, ju ftojmë në eventin „Meet Studenti“, një mbrëmje ku mund të njiheni me Shoqatën Studenti, të lidheni me studentë të tjerë dhe të frymëzoheni nga idetë dhe projektet që na presin këtë vit.\n\nKjo është mundësia perfekte për të njohur studentë të ETHZ, UZH dhe ZHAW, për të ndarë përvoja dhe për të zbuluar aktivitetet e ardhshme duke u bërë pjesë e një komuniteti që ju mbështet gjatë gjithë studimeve.\n\n📅 Kur: e martë, 29.09.2026, ora 19:00\n📍 Ku: KO2-F-152, Karl-Schmid-Strasse 4, 8006 Cyrih\n\nEjani me shokë, shoqe dhe buzëqeshje sepse së bashku krijojmë një atmosferë të paharrueshme!\n\nJu presim me kënaqësi,\nShoqata Studenti`,
  de: `Ein neues Semester, neue Chancen!\nDamit ihr gleich gut loslegt, laden wir euch herzlich zum „Meet Studenti“ ein – ein Abend voller Begegnungen, Gespräche und Inspiration. Hier könnt ihr die „Shoqata Studenti“ kennenlernen, neue Kontakte knüpfen und erfahren, welche spannenden Projekte und Events dieses Semester geplant sind.\n\nDabei habt ihr die perfekte Gelegenheit, Studierende der ETHZ, UZH und ZHAW kennenzulernen, Erfahrungen auszutauschen und Teil einer Community zu werden, die euch während des Studiums unterstützt.\n\n📅 Wann: Dienstag, 29.09.2026, um 19:00 Uhr\n📍 Wo: KO2-F-152, Karl-Schmid-Strasse 4, 8006 Zürich\n\nKommt vorbei – bringt gute Laune, Freunde und Neugier mit – gemeinsam schaffen wir eine unvergessliche Atmosphäre!\n\nWir freuen uns auf euch,\nShoqata Studenti`,
  en: `A new semester, new opportunities!\nTo help you get off to a great start, we warmly invite you to „Meet Studenti“ – an evening full of encounters, conversations and inspiration. Get to know „Shoqata Studenti“, make new connections and discover the exciting projects and events planned for this semester.\n\nThis is the perfect opportunity to meet students from ETHZ, UZH and ZHAW, exchange experiences and become part of a community that supports you throughout your studies.\n\n📅 When: Tuesday, 29.09.2026, at 19:00\n📍 Where: KO2-F-152, Karl-Schmid-Strasse 4, 8006 Zürich\n\nCome by with friends, good spirits and curiosity – together we will create an unforgettable atmosphere!\n\nWe look forward to seeing you,\nShoqata Studenti`,
} satisfies Record<Locale, string>;

const activityFairContent = {
  sq: `Activity Fair 2026 - Ne jemi gati! 🎉\nNa vizitoni në stendën tonë gjatë Activity Fair!\nDo të prezantojmë shoqatën tonë. Një rast i shkëlqyer për të na njohur më nga afër dhe për të bërë çdo pyetje që keni! 💬\n\nUZH\n22.09. - Lichthof Irchel, 9:30–16:30\n23.09. - Lichthof Zentrum, 9:30–16:30\nETH\n13.10. - Ndërtesa HG (Zentrum), 9:00–18:00\n\n✨ Ejani, frymëzohuni dhe bëhuni pjesë e komunitetit tonë!\nMezi presim t’ju takojmë!`,
  de: `Activity Fair 2026 - Wir freuen uns auf euch! 🎉\nSchaut bei unserem Stand auf der Activity Fair vorbei!\nWir stellen unseren Verein vor. Die perfekte Gelegenheit, uns persönlich kennenzulernen und alle eure Fragen loszuwerden. 💬\n\nUZH\n22.09.- Lichthof Irchel, 9:30–16:30\n23.09. - Lichthof Zentrum, 9:30–16:30\nETH\n13.10.- Gebäude HG (Zentrum), 9:00–18:00\n\n✨ Lasst euch inspirieren und werdet Teil unserer Community!\nWir können es kaum erwarten, euch zu treffen! 😊`,
  en: `Activity Fair 2026 - We are ready! 🎉\nCome visit our stand at the Activity Fair!\nWe will introduce our association. It is the perfect opportunity to get to know us better and ask us any questions you may have! 💬\n\nUZH\n22.09. - Irchel Lichthof, 9:30–16:30\n23.09. - Zentrum Lichthof, 9:30–16:30\nETH\n13.10. - HG Building (Zentrum), 9:00–18:00\n\n✨ Come get inspired and become part of our community!\nWe cannot wait to meet you!`,
} satisfies Record<Locale, string>;

const vjetori25Content = {
  sq: `Këtë vit festojmë një moment shumë të veçantë: 25-vjetorin e Shoqatës Studenti!\n\nPrej 25 vitesh, Shoqata Studenti bashkon studentë shqiptarë në Cyrih dhe krijon një hapësirë për angazhim, kulturë, miqësi dhe lidhje mes gjeneratave.\n\nMë 17 tetor 2026, duam ta festojmë këtë rrugëtim së bashku; me njerëzit që kanë qenë pjesë e Shoqatës ndër vite, me gjeneratën e sotme dhe me të gjithë ata që ndihen të lidhur me të. Gjatë mbrëmjes do të rikthehemi te fillimet dhe historia e Shoqatës Studenti, me një bisedë të veçantë me përfaqësues të gjeneratës së parë. Do të ndajmë kujtime dhe histori nga 25 vitet e kaluara dhe do ta festojmë këtë përvjetor me një program kulturor dhe festiv.\n\n📅 17 tetor 2026\n🕔 nga ora 17:00\n📍 Gemeindesaal Rümlang Katzenrütistrasse 6, 8153 Rümlang\n\nPër arsye organizative dhe arsyje kapaciteti të sallës, regjistrimi është i nevojshëm për personat që nuk kanë marrë një ftesë personale.\n\nMezi presim ta festojmë së bashku këtë moment të veçantë dhe të sjellim përsëri bashkë gjenerata të ndryshme të Shoqatës Studenti. 🥂 25 vite histori. 25 vite komunitet. 25 vite Shoqata Studenti. ❤️\n\nShoqata Studenti`,
  de: `Këtë vit festojmë një moment shumë të veçantë: 25-vjetorin e Shoqatës Studenti!\n\nPrej 25 vitesh, Shoqata Studenti bashkon studentë shqiptarë në Cyrih dhe krijon një hapësirë për angazhim, kulturë, miqësi dhe lidhje mes gjeneratave.\n\nMë 17 tetor 2026, duam ta festojmë këtë rrugëtim së bashku; me njerëzit që kanë qenë pjesë e Shoqatës ndër vite, me gjeneratën e sotme dhe me të gjithë ata që ndihen të lidhur me të. Gjatë mbrëmjes do të rikthehemi te fillimet dhe historia e Shoqatës Studenti, me një bisedë të veçantë me përfaqësues të gjeneratës së parë. Do të ndajmë kujtime dhe histori nga 25 vitet e kaluara dhe do ta festojmë këtë përvjetor me një program kulturor dhe festiv.\n\n📅 17 tetor 2026\n🕔 nga ora 17:00\n📍 Gemeindesaal Rümlang Katzenrütistrasse 6, 8153 Rümlang\n\nPër arsye organizative dhe arsyje kapaciteti të sallës, regjistrimi është i nevojshëm për personat që nuk kanë marrë një ftesë personale.\n\nMezi presim ta festojmë së bashku këtë moment të veçantë dhe të sjellim përsëri bashkë gjenerata të ndryshme të Shoqatës Studenti. 🥂 25 vite histori. 25 vite komunitet. 25 vite Shoqata Studenti. ❤️\n\nShoqata Studenti`,
  en: `Këtë vit festojmë një moment shumë të veçantë: 25-vjetorin e Shoqatës Studenti!\n\nPrej 25 vitesh, Shoqata Studenti bashkon studentë shqiptarë në Cyrih dhe krijon një hapësirë për angazhim, kulturë, miqësi dhe lidhje mes gjeneratave.\n\nMë 17 tetor 2026, duam ta festojmë këtë rrugëtim së bashku; me njerëzit që kanë qenë pjesë e Shoqatës ndër vite, me gjeneratën e sotme dhe me të gjithë ata që ndihen të lidhur me të. Gjatë mbrëmjes do të rikthehemi te fillimet dhe historia e Shoqatës Studenti, me një bisedë të veçantë me përfaqësues të gjeneratës së parë. Do të ndajmë kujtime dhe histori nga 25 vitet e kaluara dhe do ta festojmë këtë përvjetor me një program kulturor dhe festiv.\n\n📅 17 tetor 2026\n🕔 nga ora 17:00\n📍 Gemeindesaal Rümlang Katzenrütistrasse 6, 8153 Rümlang\n\nPër arsye organizative dhe arsyje kapaciteti të sallës, regjistrimi është i nevojshëm për personat që nuk kanë marrë një ftesë personale.\n\nMezi presim ta festojmë së bashku këtë moment të veçantë dhe të sjellim përsëri bashkë gjenerata të ndryshme të Shoqatës Studenti. 🥂 25 vite histori. 25 vite komunitet. 25 vite Shoqata Studenti. ❤️\n\nShoqata Studenti`,
} satisfies Record<Locale, string>;

export const LOCAL_PREVIEW_POSTS: LocalPreviewPost[] = [
  {
    id: MEET_STUDENTI_ID,
    title: "Meet Studenti",
    imageMimeType: "image/png",
    eventAt: new Date("2026-09-29T19:00:00+02:00"),
    venue: "Karl-Schmid-Strasse 4, KO2-F-152 F, 8006 Zürich",
    cardLinkPath: null,
    coverSrc: "/media/meet-studenti-post-2.png",
    detailHref: `/posts/${MEET_STUDENTI_ID}`,
    content: meetStudentiContent,
  },
  {
    id: ACTIVITY_FAIR_ID,
    title: "Activity Fair 2026",
    imageMimeType: "image/jpeg",
    eventAt: new Date("2026-10-13T09:00:00+02:00"),
    venue: "Ndërtesa HG (Zentrum)",
    cardLinkPath: null,
    coverSrc: "/evente/acivityfair_post.JPG",
    detailCoverSrc: "/media/activity-fair.png",
    detailHref: `/posts/${ACTIVITY_FAIR_ID}`,
    content: activityFairContent,
  },
  {
    id: VJETORI_25_ID,
    title: "25 Vjetori",
    imageMimeType: "image/jpeg",
    eventAt: new Date("2026-10-17T12:00:00+02:00"),
    venue: "Katzenrütistrasse 6, 8153 Rümlang",
    cardLinkPath: null,
    coverSrc: "/media/25-vjetori.jpeg",
    detailHref: `/posts/${VJETORI_25_ID}`,
    showTime: false,
    showVenue: true,
    content: vjetori25Content,
  },
];

export function getLocalPreviewPost(id: number): LocalPreviewPost | null {
  return LOCAL_PREVIEW_POSTS.find((post) => post.id === id) ?? null;
}

export function localPreviewContent(post: LocalPreviewPost, locale: Locale): string {
  return post.content[locale];
}
