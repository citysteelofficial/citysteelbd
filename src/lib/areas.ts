/**
 * Service-area landing pages: /steel-building/{slug}
 *
 * Each page lists the real projects whose `location` matches one of `match`
 * (case-insensitive), so it stays current as projects are added in /admin.
 * Keep the copy factual: only areas where City Steel has delivered work.
 */
export type Area = {
  slug: string;
  name: string;
  match: string[];
  seoTitle: string;
  seoDescription: string;
  intro: string[];
  industries: string[];
  faqs: Array<{ q: string; a: string }>;
};

const QUOTE_FAQ = (name: string) => ({
  q: `How do I get a steel building quote in ${name}?`,
  a: `Use the cost calculator on our website for an instant approximate price, or call +880 1711-787556. Our engineer will visit your site in ${name}, check the layout and loads, and send a detailed quotation.`,
});

export const AREAS: Area[] = [
  {
    slug: 'gazipur',
    name: 'Gazipur',
    match: ['gazipur', 'tongi'],
    seoTitle: 'Steel Building & PEB Factory Construction in Gazipur',
    seoDescription: 'PEB factory, warehouse and steel shed construction in Gazipur — design, fabrication and erection by City Steel Corporation. See our Gazipur projects.',
    intro: [
      'Gazipur is one of the busiest industrial districts in Bangladesh, home to a large share of the country’s garment, knitwear and textile factories around Tongi, Konabari, Kashimpur and Sreepur. New units and expansions here need wide, column-free floors that can be built quickly.',
      'City Steel Corporation has delivered several steel structure factory buildings in Gazipur, from Tongi to Nayanpur and Monipur Bazar. Our fabrication factory in Hemayatpur, Savar, is close enough for fast delivery of columns, rafters, purlins and roof sheets to any site in the district.',
    ],
    industries: ['Garment and knitwear factories', 'Textile and dyeing units', 'Warehouses and stores', 'Factory extensions and mezzanine floors'],
    faqs: [
      { q: 'Does City Steel build PEB factories in Gazipur?', a: 'Yes. We have completed steel structure factory buildings in Gazipur for clients such as Vintage Garments, Paramount Textile, Bengal Hurricane, Axis Knitwear, Axis Village and Arabi Fashion, as well as a building for Japan Tobacco International in Tongi.' },
      { q: 'How much does a steel shed cost in Gazipur?', a: 'As a guide, a standard PEB shed with steel structure and roof sheet costs about ৳400–550 per sq ft, a mezzanine floor with deck sheet about ৳500–750 per sq ft, and civil works/foundation about ৳400–550 per sq ft. The final price is confirmed after a site visit and structural design.' },
      QUOTE_FAQ('Gazipur'),
    ],
  },
  {
    slug: 'savar-ashulia',
    name: 'Savar & Ashulia',
    match: ['savar', 'ashulia', 'hemayatpur', 'jamgora'],
    seoTitle: 'Steel Structure & PEB Building Company in Savar, Ashulia',
    seoDescription: 'Steel structure and PEB building construction in Savar and Ashulia from our own fabrication factory in Hemayatpur. Factories, warehouses and sheds.',
    intro: [
      'Savar and Ashulia sit on Dhaka’s main industrial corridor, with dense clusters of garment factories, the Dhaka EPZ and a growing number of warehouses. Projects here often need to go up fast with minimum disruption to running operations.',
      'Our own fabrication factory is in Hemayatpur, Savar. That means short delivery distances, quick site visits, and the ability to fabricate and dispatch steel members to Savar and Ashulia sites on tight schedules.',
    ],
    industries: ['Garment and export factories', 'Engineering workshops', 'Warehouses and logistics sheds', 'Rooftop and extension structures'],
    faqs: [
      { q: 'Where is City Steel’s factory?', a: 'Our fabrication factory is in Hemayatpur, Savar, Dhaka. Our corporate office is at 7/6 Garden Street, Ring Road, Shyamoli, Dhaka-1207.' },
      { q: 'Which projects has City Steel done in Savar and Ashulia?', a: 'Recent work includes a steel structure factory building for Kalyar Replica Limited in Ashulia and a steel building for Best Dwell Engineering at Jamgora, Ashulia.' },
      QUOTE_FAQ('Savar and Ashulia'),
    ],
  },
  {
    slug: 'narayanganj',
    name: 'Narayanganj',
    match: ['narayanganj', 'araihazar'],
    seoTitle: 'Steel Building & PEB Construction in Narayanganj',
    seoDescription: 'PEB and steel structure industrial buildings in Narayanganj, including Araihazar. Design, fabrication and erection by City Steel Corporation.',
    intro: [
      'Narayanganj is a long-established industrial and trading hub, with knitwear, textile and manufacturing units spread from the city to Araihazar, Rupganj and Sonargaon. Many sites need large-span sheds and warehouses that can be expanded later.',
      'City Steel Corporation delivered a steel structure industrial building for Singer Bangladesh Ltd at Araihazar, handling the structural design, fabrication at our Savar factory and on-site erection.',
    ],
    industries: ['Manufacturing and assembly plants', 'Knitwear and textile units', 'Warehouses', 'Industrial sheds'],
    faqs: [
      { q: 'Has City Steel worked in Narayanganj?', a: 'Yes. We built a steel structure industrial building for Singer Bangladesh Ltd at Araihazar, Narayanganj.' },
      { q: 'Can an existing factory in Narayanganj be extended with steel?', a: 'Usually yes. A steel frame can be added beside or above an existing structure if the foundations and loads allow it. Our engineers check this during the site visit.' },
      QUOTE_FAQ('Narayanganj'),
    ],
  },
  {
    slug: 'narsingdi',
    name: 'Narsingdi',
    match: ['narsingdi', 'narshindi'],
    seoTitle: 'Steel Shed & PEB Factory Construction in Narsingdi',
    seoDescription: 'Steel shed and PEB factory construction in Narsingdi for textile, apparel and warehouse projects. Built by City Steel Corporation, Savar factory.',
    intro: [
      'Narsingdi is known for its textile and weaving industry, centred around Madhabdi and Baburhat, and for a growing number of apparel and storage facilities. Steel sheds suit these sites because they give open floor space and can be built quickly.',
      'City Steel Corporation completed a steel structure factory building for Adhuri Apparels Ltd in Narsingdi, delivered from design to erection by our own team.',
    ],
    industries: ['Textile and weaving mills', 'Apparel factories', 'Warehouses and godowns'],
    faqs: [
      { q: 'Has City Steel built factories in Narsingdi?', a: 'Yes. We completed a steel structure factory building for Adhuri Apparels Ltd in Narsingdi.' },
      QUOTE_FAQ('Narsingdi'),
    ],
  },
  {
    slug: 'dhaka',
    name: 'Dhaka',
    match: ['dhaka', 'gulshan', 'baridhara', 'purbachal'],
    seoTitle: 'Steel Structure Company in Dhaka — Design, Fabrication, Erection',
    seoDescription: 'Steel structure works in Dhaka for institutions, towers and government projects: rooftop structures, canopies, stairs and steel buildings by City Steel.',
    intro: [
      'In Dhaka city, steel structure work is often about speed and minimum disruption: rooftop extensions, canopies, stairs, walkways and add-on structures for towers, campuses and public buildings, where concrete work would be slow or too heavy.',
      'City Steel Corporation is based in Shyamoli, Dhaka. We have delivered steel structure works for the University of Dhaka, East West University, Dhaka North City Corporation, Nest Evana Tower in Gulshan, Borak Tower in Baridhara, and the Bangladesh Army at Purbachal 300 Feet.',
    ],
    industries: ['Universities and institutions', 'Commercial towers', 'Government and defence projects', 'Rooftop and add-on structures'],
    faqs: [
      { q: 'Where is City Steel’s office in Dhaka?', a: 'Our corporate office is at 7/6 Garden Street, Ring Road, Shyamoli, Dhaka-1207, and our fabrication factory is in Hemayatpur, Savar.' },
      { q: 'Does City Steel take government and institutional projects?', a: 'Yes. Our Dhaka projects include work for the University of Dhaka, East West University, Dhaka North City Corporation and the Bangladesh Army.' },
      QUOTE_FAQ('Dhaka'),
    ],
  },
];

export function getArea(slug: string) {
  return AREAS.find((a) => a.slug === slug);
}
