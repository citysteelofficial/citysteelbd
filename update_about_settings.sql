-- SQL script to add new about page columns to site_settings table

-- 1. Add columns if they do not exist
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_specialties TEXT DEFAULT 'Industrial Buildings, Warehouses, Commercial Projects, Residential Structures, Agro-Based Facilities, Exhibition Centers';

ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_quote_text TEXT DEFAULT 'Stepping forward to be the most VIRAL NAME in excellent quality with reasonable price in the Country.';

ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_quote_subtext TEXT DEFAULT 'To make our dream come true, we serve you with the best attitude and commitment. Let us be your friend and your consultant—even if you ultimately don''t choose us.';

ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_advantages JSONB DEFAULT '[
  {"icon": "Clock", "title": "Reduce Construction Time", "desc": "Due to the system approach, the use of high strength steel, optimized built-up sections, and continuous lightweight secondary steel, construction time is significantly reduced compared to conventional steel."},
  {"icon": "Cpu", "title": "Advanced Computerized Design", "desc": "PEB systems are designed using specialized computer analysis and custom details. Lightweight flexible frames offer higher resistance to seismic forces, and design time is significantly reduced."},
  {"icon": "Layers", "title": "Lighter Foundations", "desc": "Pre-engineered steel buildings are about 50% lighter than conventional steel structures. Hence, foundations are of simpler design, easier to construct, and lighter."},
  {"icon": "Hammer", "title": "LEGO-like Faster Erection", "desc": "All fabricated components are standard, accurately sized, and numbered. The on-site assembly works just like LEGO blocks, ensuring a much faster and safer erection process."},
  {"icon": "Maximize2", "title": "Flexibility of Expansion", "desc": "Buildings can be easily expanded in length by adding more bays. Expansion in width and height is also possible by pre-designing for future growth from the start."},
  {"icon": "Expand", "title": "Large Clear Spans", "desc": "Our architectural engineering allows us to supply buildings up to 90 meters of clear span, ensuring massive column-free spaces for maximum industrial utility."},
  {"icon": "Sun", "title": "Energy Efficient Systems", "desc": "Buildings can be supplied with high-density polyurethane insulated panels or premium fiberglass blanket insulation to achieve required energy-saving ''U'' values."},
  {"icon": "Coins", "title": "Up to 30% Lower Cost", "desc": "Significant savings in design, manufacturing, and erection. Secondary members and cladding nest together, reducing transportation. Elemental shapes follow stress diagrams to optimize steel weight."}
]'::jsonb;

-- 2. Update the existing row (id=1) with default values if they are currently null
UPDATE public.site_settings
SET 
  about_specialties = COALESCE(about_specialties, 'Industrial Buildings, Warehouses, Commercial Projects, Residential Structures, Agro-Based Facilities, Exhibition Centers'),
  about_quote_text = COALESCE(about_quote_text, 'Stepping forward to be the most VIRAL NAME in excellent quality with reasonable price in the Country.'),
  about_quote_subtext = COALESCE(about_quote_subtext, 'To make our dream come true, we serve you with the best attitude and commitment. Let us be your friend and your consultant—even if you ultimately don''t choose us.'),
  about_advantages = COALESCE(about_advantages, '[
    {"icon": "Clock", "title": "Reduce Construction Time", "desc": "Due to the system approach, the use of high strength steel, optimized built-up sections, and continuous lightweight secondary steel, construction time is significantly reduced compared to conventional steel."},
    {"icon": "Cpu", "title": "Advanced Computerized Design", "desc": "PEB systems are designed using specialized computer analysis and custom details. Lightweight flexible frames offer higher resistance to seismic forces, and design time is significantly reduced."},
    {"icon": "Layers", "title": "Lighter Foundations", "desc": "Pre-engineered steel buildings are about 50% lighter than conventional steel structures. Hence, foundations are of simpler design, easier to construct, and lighter."},
    {"icon": "Hammer", "title": "LEGO-like Faster Erection", "desc": "All fabricated components are standard, accurately sized, and numbered. The on-site assembly works just like LEGO blocks, ensuring a much faster and safer erection process."},
    {"icon": "Maximize2", "title": "Flexibility of Expansion", "desc": "Buildings can be easily expanded in length by adding more bays. Expansion in width and height is also possible by pre-designing for future growth from the start."},
    {"icon": "Expand", "title": "Large Clear Spans", "desc": "Our architectural engineering allows us to supply buildings up to 90 meters of clear span, ensuring massive column-free spaces for maximum industrial utility."},
    {"icon": "Sun", "title": "Energy Efficient Systems", "desc": "Buildings can be supplied with high-density polyurethane insulated panels or premium fiberglass blanket insulation to achieve required energy-saving ''U'' values."},
    {"icon": "Coins", "title": "Up to 30% Lower Cost", "desc": "Significant savings in design, manufacturing, and erection. Secondary members and cladding nest together, reducing transportation. Elemental shapes follow stress diagrams to optimize steel weight."}
  ]'::jsonb)
WHERE id = 1;
