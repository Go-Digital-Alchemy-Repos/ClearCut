export interface ServiceHighlight {
  slug: string;
  localBlurb: string;
}

export interface CityFAQ {
  q: string;
  a: string;
}

export interface ServiceArea {
  slug: string;
  name: string;
  county: string;
  state: string;
  metaTitle: string;
  metaDescription: string;
  heroHeadline: string;
  heroSubtext: string;
  introTitle: string;
  introParagraphs: string[];
  localContext: string;
  serviceHighlights: ServiceHighlight[];
  projectExamples: string[];
  faqs: CityFAQ[];
}

export const SERVICE_AREAS: ServiceArea[] = [
  {
    slug: "charlotte",
    name: "Charlotte",
    county: "Mecklenburg County",
    state: "NC",
    metaTitle: "Land Clearing & Forestry Mulching Charlotte NC | Clearcut Land Management",
    metaDescription: "Professional forestry mulching, brush removal, and land clearing services in Charlotte, NC. Serving Mecklenburg County with fast, affordable property clearing. Free estimates.",
    heroHeadline: "Charlotte's Trusted Land Clearing Experts",
    heroSubtext: "From SouthPark subdivisions to rural acreage off Providence Road, we help Charlotte property owners reclaim overgrown land quickly and affordably.",
    introTitle: "Professional Land Clearing Across Charlotte, NC",
    introParagraphs: [
      "Charlotte's explosive growth means more property owners are dealing with overgrown lots, neglected acreage, and land that needs preparation for development. Whether you're a homeowner in Ballantyne with a backyard consumed by privet, or a builder clearing lots in University City, Clearcut Land Management delivers fast, professional results with forestry mulching equipment that handles the job in a fraction of the time of traditional clearing methods.",
      "Mecklenburg County's mix of clay soil, deciduous hardwoods, and aggressive invasive species like kudzu and honeysuckle creates unique clearing challenges. Our operators understand Charlotte's terrain and vegetation patterns, which means fewer surprises, accurate estimates, and a cleaner finished product. We work with the city's tree ordinances and permitting requirements so your project stays compliant from start to finish."
    ],
    localContext: "Charlotte's rapid residential and commercial expansion creates constant demand for lot preparation, right-of-way clearing, and overgrown property restoration throughout Mecklenburg County's diverse neighborhoods.",
    serviceHighlights: [
      { slug: "forestry-mulching", localBlurb: "Charlotte lots often feature dense privet hedges, volunteer hardwoods, and decades of untouched understory. Our mulcher handles it all in a single pass, leaving your Mecklenburg County property clean and ready for its next chapter." },
      { slug: "trail-cutting", localBlurb: "Create usable access to Charlotte's creek-side properties, back acreage behind subdivisions, and wooded lots that have been inaccessible for years. Trail cutting turns forgotten land into connected, functional property." },
      { slug: "hillside-mulching", localBlurb: "Charlotte's rolling Piedmont terrain includes plenty of steep grades behind homes and along creek banks. We clear overgrown slopes in south Charlotte and Ballantyne without the erosion damage that bulldozing causes." },
      { slug: "brush-hogging", localBlurb: "Vacant lots and unmaintained fields across Charlotte need regular rotary mowing. We keep investor properties, estate lots, and rural acreage inside the city limits under control with efficient brush hogging." },
      { slug: "fence-line-clearing", localBlurb: "Charlotte subdivision fence lines get consumed by honeysuckle and wild grape in just a few seasons. We restore clean property boundaries and prep lines for new fence installation across Mecklenburg County neighborhoods." },
      { slug: "invasive-growth-removal", localBlurb: "Kudzu, privet, and English ivy are aggressive across Charlotte's urban tree canopy. Our targeted cut-and-treat approach removes invasive species and gives native vegetation room to recover." },
    ],
    projectExamples: [
      "3-acre residential lot clearing in Ballantyne for new construction",
      "Overgrown property restoration behind homes in Providence Plantation",
      "Vacant lot maintenance program for investor-owned parcels in University City",
    ],
    faqs: [
      { q: "Do you need a permit for land clearing in Charlotte?", a: "It depends on the scope. Charlotte-Mecklenburg has tree ordinances that may require permits for removing trees above certain diameters, especially on commercial projects. We help you navigate the requirements and can work within existing regulations. Residential brush clearing and mulching typically doesn't require a permit." },
      { q: "How quickly can you clear a lot in Charlotte?", a: "Most residential lots in Charlotte can be cleared in 1-2 days. A typical quarter-acre to half-acre lot with moderate brush is often finished in a single day with our forestry mulching equipment." },
      { q: "Do you serve all areas within Charlotte city limits?", a: "Yes. We serve every neighborhood in Charlotte from Steele Creek to University City, SouthPark to NoDa, and everywhere in between throughout Mecklenburg County." },
    ],
  },
  {
    slug: "huntersville",
    name: "Huntersville",
    county: "Mecklenburg County",
    state: "NC",
    metaTitle: "Land Clearing & Forestry Mulching Huntersville NC | Clearcut Land Management",
    metaDescription: "Forestry mulching and land clearing in Huntersville, NC. Lot prep for new construction, brush removal, and property clearing in north Mecklenburg County. Free estimates.",
    heroHeadline: "Huntersville Land Clearing & Brush Removal",
    heroSubtext: "Huntersville's growing neighborhoods need professional land clearing — from new construction prep along Gilead Road to overgrown acreage near Birkdale Village.",
    introTitle: "Land Clearing Services in Huntersville, NC",
    introParagraphs: [
      "Huntersville sits in one of the fastest-growing corridors in the Charlotte metro, with new subdivisions, commercial projects, and infrastructure constantly reshaping the landscape along the I-77 corridor. Property owners and builders throughout north Mecklenburg County rely on Clearcut Land Management to prepare lots, clear overgrown parcels, and maintain acreage that's been neglected during the development boom.",
      "The terrain around Huntersville transitions from flat commercial corridors along Highway 21 to rolling wooded acreage near Mountain Island Lake. This mix means land clearing projects here range from straightforward lot prep to complex hillside clearing with erosion considerations. Our equipment and experience handle both ends of that spectrum efficiently."
    ],
    localContext: "Huntersville's position between Charlotte and Lake Norman makes it a hotspot for both residential development and rural property management, creating steady demand for professional clearing services.",
    serviceHighlights: [
      { slug: "forestry-mulching", localBlurb: "Huntersville builders need fast lot preparation for the area's constant stream of new construction. Forestry mulching clears residential and commercial lots along the I-77 corridor without the hauling costs and delays of traditional methods." },
      { slug: "trail-cutting", localBlurb: "Rural properties around Huntersville often have wooded back acreage that's gone unused for years. Trail cutting opens access to ponds, hunting areas, and back property lines near Mountain Island Lake." },
      { slug: "hillside-mulching", localBlurb: "The terrain near Mountain Island Lake and along Huntersville's creek corridors includes slopes that require specialized clearing equipment. We handle grades that standard crews avoid." },
      { slug: "brush-hogging", localBlurb: "Huntersville's remaining rural properties and horse farms along Gilead Road need regular field maintenance. Our brush hogging service keeps pastures and open land under control year-round." },
      { slug: "fence-line-clearing", localBlurb: "New subdivision construction in Huntersville frequently requires fence line prep along newly surveyed property boundaries. We clear and prepare lines for fence contractors throughout north Mecklenburg." },
      { slug: "invasive-growth-removal", localBlurb: "Privet and honeysuckle are particularly aggressive along Huntersville's creek buffers and wooded lot edges. Our removal program targets these species before they take over entire properties." },
    ],
    projectExamples: [
      "Multi-lot subdivision clearing near Gilead Road for a regional builder",
      "Lakefront property brush removal on Mountain Island Lake",
      "Horse farm pasture restoration and fence line clearing off Beatties Ford Road",
    ],
    faqs: [
      { q: "Can you clear lots for new construction in Huntersville?", a: "Absolutely. We regularly clear residential and commercial lots throughout Huntersville for builders and developers. Our forestry mulching is faster and more cost-effective than traditional clearing, and we work within Mecklenburg County's tree ordinance requirements." },
      { q: "Do you work near Mountain Island Lake?", a: "Yes. We serve all areas around Mountain Island Lake including waterfront properties. We're experienced with the erosion control considerations that come with lakeside clearing and follow all buffer zone requirements." },
    ],
  },
  {
    slug: "concord",
    name: "Concord",
    county: "Cabarrus County",
    state: "NC",
    metaTitle: "Land Clearing & Forestry Mulching Concord NC | Clearcut Land Management",
    metaDescription: "Professional land clearing and forestry mulching in Concord, NC. Brush removal, lot clearing, and property maintenance across Cabarrus County. Free estimates.",
    heroHeadline: "Concord's Go-To Land Clearing Team",
    heroSubtext: "From commercial parcels near Concord Mills to rural acreage along Highway 49, we deliver professional land clearing throughout Cabarrus County.",
    introTitle: "Land Clearing & Property Services in Concord, NC",
    introParagraphs: [
      "Concord's growth as a commercial and residential hub northeast of Charlotte has created strong demand for professional land clearing services. The expansion around Concord Mills, the Speedway corridor, and new residential developments along Poplar Tent Road means property owners and developers need reliable, efficient clearing that meets tight construction timelines.",
      "Cabarrus County's red clay soil and mixed hardwood vegetation present specific clearing challenges that our crews handle daily. The transition from Concord's developed commercial areas to the surrounding rural farmland means we see everything from tight quarter-acre lot preps to large-scale agricultural land reclamation — and our equipment handles the full range."
    ],
    localContext: "Concord's dual identity as both a growing commercial center and an agricultural community creates diverse clearing needs, from construction lot prep to farm field reclamation and everything in between.",
    serviceHighlights: [
      { slug: "forestry-mulching", localBlurb: "Concord builders working along the Poplar Tent Road corridor and near Concord Mills need lot-ready land on tight timelines. Forestry mulching delivers cleared, construction-ready parcels faster than any traditional method." },
      { slug: "trail-cutting", localBlurb: "Cabarrus County's rural properties east of Concord often have extensive wooded acreage with no access. We cut ATV trails, hunting lanes, and equipment access paths through Concord's mixed pine and hardwood forest." },
      { slug: "hillside-mulching", localBlurb: "Creek banks and drainage corridors throughout Concord develop dense brush that creates flooding and erosion risks. Our hillside mulching clears these areas while preserving the soil structure." },
      { slug: "brush-hogging", localBlurb: "Concord's remaining agricultural properties and vacant commercial parcels need regular mowing to stay compliant with county maintenance codes. We provide both one-time resets and recurring maintenance." },
      { slug: "fence-line-clearing", localBlurb: "Farm properties and new subdivisions throughout Cabarrus County need clean fence lines. We clear vegetation along existing fences and prep boundaries for new installation." },
      { slug: "invasive-growth-removal", localBlurb: "Kudzu has a strong foothold in parts of eastern Cabarrus County. Our targeted removal program stops the spread and reclaims property that's been lost to aggressive invasive growth." },
    ],
    projectExamples: [
      "Commercial lot preparation near Concord Mills for retail development",
      "40-acre farm field reclamation east of Concord on Highway 49",
      "Residential subdivision lot clearing along Poplar Tent Road",
    ],
    faqs: [
      { q: "Do you serve all of Cabarrus County?", a: "Yes. We cover all of Cabarrus County including Concord, Harrisburg, Kannapolis, and the surrounding rural areas. Our equipment can reach remote properties throughout the county." },
      { q: "Can you handle large commercial clearing projects in Concord?", a: "Absolutely. We regularly work with commercial developers in the Concord area on multi-acre clearing projects. Our forestry mulching equipment handles large parcels efficiently and meets development timelines." },
    ],
  },
  {
    slug: "matthews",
    name: "Matthews",
    county: "Mecklenburg County",
    state: "NC",
    metaTitle: "Land Clearing & Forestry Mulching Matthews NC | Clearcut Land Management",
    metaDescription: "Professional forestry mulching and land clearing in Matthews, NC. Residential lot clearing, brush removal, and property maintenance in southeast Mecklenburg. Free estimates.",
    heroHeadline: "Matthews Property Clearing Professionals",
    heroSubtext: "Southeast Mecklenburg's established neighborhoods and growing edges both need professional clearing — Matthews homeowners trust Clearcut Land Management to get it done right.",
    introTitle: "Land Clearing Services in Matthews, NC",
    introParagraphs: [
      "Matthews blends the charm of a historic small town with the reality of suburban Charlotte growth. Properties in Matthews range from compact residential lots near downtown to multi-acre parcels along the Union County line, and many of them need professional clearing. Older neighborhoods have decades of untended growth consuming fence lines and backyards, while new development pushes into formerly wooded land that needs preparation.",
      "The dense hardwood and pine mix in southeast Mecklenburg creates thick understory growth that's nearly impossible to manage with hand tools alone. Our forestry mulching equipment cuts through Matthews' vegetation quickly and cleanly, whether it's a 5,000 square foot backyard choked with privet or a 3-acre lot being prepped for a custom home build."
    ],
    localContext: "Matthews' mix of established neighborhoods with mature tree canopy and newer development along its eastern edge creates a steady need for both residential maintenance clearing and new construction lot preparation.",
    serviceHighlights: [
      { slug: "forestry-mulching", localBlurb: "Matthews properties often have mature lots with dense understory that's grown unchecked for years. Our mulcher clears the brush while preserving the hardwoods and pines that give Matthews neighborhoods their character." },
      { slug: "trail-cutting", localBlurb: "Properties along Matthews' eastern edge near Four Mile Creek have wooded sections with no access. Trail cutting creates paths to back property lines, creek frontage, and areas you haven't been able to reach." },
      { slug: "hillside-mulching", localBlurb: "Creek banks and ravines throughout Matthews develop dangerous overgrowth. We clear slopes behind residential properties safely, leaving mulch that prevents the erosion common in Mecklenburg's clay soil." },
      { slug: "brush-hogging", localBlurb: "Estate lots and undeveloped parcels in Matthews need regular mowing to prevent code violations and maintain property values. Our brush hogging handles overgrown fields and lots efficiently." },
      { slug: "fence-line-clearing", localBlurb: "Matthews' established neighborhoods have fence lines that disappear under honeysuckle and wisteria within a few seasons. We restore clean boundaries and prep lines for replacement fencing." },
      { slug: "invasive-growth-removal", localBlurb: "English ivy and wisteria are major problems in Matthews' mature neighborhoods, climbing trees and structures and causing real damage. Our removal service targets these species specifically." },
    ],
    projectExamples: [
      "5-acre property reset for custom home construction near Weddington Road",
      "Backyard reclamation project in established Matthews neighborhood",
      "Fence line restoration for HOA community along Idlewild Road",
    ],
    faqs: [
      { q: "Can you work in tight residential backyards in Matthews?", a: "Yes. Our equipment fits through standard fence gates and can work in compact spaces. We regularly clear residential backyards in Matthews' established neighborhoods where growth has gotten out of control." },
      { q: "Do you handle HOA clearing requirements?", a: "Absolutely. Many Matthews HOAs have vegetation standards that homeowners struggle to maintain. We clear overgrown areas to meet HOA requirements and can provide documentation of the work completed." },
    ],
  },
  {
    slug: "mint-hill",
    name: "Mint Hill",
    county: "Mecklenburg County",
    state: "NC",
    metaTitle: "Land Clearing & Forestry Mulching Mint Hill NC | Clearcut Land Management",
    metaDescription: "Forestry mulching and brush clearing in Mint Hill, NC. Residential and rural property clearing, lot prep, and land maintenance. Free estimates.",
    heroHeadline: "Mint Hill Land Clearing & Brush Removal",
    heroSubtext: "Mint Hill's semi-rural character means bigger lots and more land to manage — we help property owners keep their acreage cleared and productive.",
    introTitle: "Property Clearing Services in Mint Hill, NC",
    introParagraphs: [
      "Mint Hill retains a more rural feel than much of Mecklenburg County, with larger residential lots, horse properties, and wooded acreage that give the area its distinctive character. But that extra land also means more vegetation to manage, and properties that go a few years without maintenance can quickly become overgrown with saplings, brush, and invasive species.",
      "Our forestry mulching service is especially popular in Mint Hill because of the area's larger lot sizes. Where Charlotte homeowners might need a quarter-acre cleared, Mint Hill property owners often have 2-5 acres or more that need attention. Our equipment handles this scale efficiently, and we understand the semi-rural property management needs that set Mint Hill apart from its more suburban neighbors."
    ],
    localContext: "Mint Hill's larger residential lots and remaining agricultural properties create a unique demand for land clearing that bridges the gap between urban lot prep and rural acreage management.",
    serviceHighlights: [
      { slug: "forestry-mulching", localBlurb: "Mint Hill's larger lots mean more land to clear, and forestry mulching is the most cost-effective way to reclaim multiple acres of overgrown property. We regularly handle 2-5 acre residential clearing projects throughout the area." },
      { slug: "trail-cutting", localBlurb: "Many Mint Hill properties have wooded back sections that haven't been accessed in years. We cut trails to open up this land for recreation, hunting, or simply knowing what you own." },
      { slug: "hillside-mulching", localBlurb: "The rolling terrain in Mint Hill includes slopes along creek corridors that accumulate dense brush. We clear these areas with erosion-conscious methods suited to Mecklenburg County's clay soil." },
      { slug: "brush-hogging", localBlurb: "Mint Hill's horse properties and open fields need regular mowing to prevent overgrowth. We provide one-time field resets and recurring brush hogging maintenance for properties of all sizes." },
      { slug: "fence-line-clearing", localBlurb: "Horse farm fencing, property boundary lines, and subdivision fence lines throughout Mint Hill need regular clearing to stay visible and functional. We handle all types of fence line vegetation management." },
      { slug: "invasive-growth-removal", localBlurb: "Privet and honeysuckle spread aggressively through Mint Hill's wooded lots and property edges. Our removal service stops invasive species from consuming valuable land." },
    ],
    projectExamples: [
      "4-acre residential property clearing off Brief Road for homesite preparation",
      "Horse property fence line restoration and pasture clearing",
      "Back acreage trail system on 10-acre wooded parcel near Lawyers Road",
    ],
    faqs: [
      { q: "Do you work on horse properties in Mint Hill?", a: "Yes, frequently. We handle pasture maintenance, fence line clearing, and paddock area brush removal on horse properties throughout Mint Hill. We understand the specific needs of equestrian properties and work carefully around fencing and structures." },
      { q: "How much does it cost to clear an acre in Mint Hill?", a: "Pricing varies based on vegetation density and terrain, but forestry mulching in the Mint Hill area typically ranges based on the specific conditions. Light brush on flat ground costs less than dense saplings on slopes. We provide free on-site estimates so you get an accurate price for your property." },
    ],
  },
  {
    slug: "fort-mill",
    name: "Fort Mill",
    county: "York County",
    state: "SC",
    metaTitle: "Land Clearing & Forestry Mulching Fort Mill SC | Clearcut Land Management",
    metaDescription: "Professional land clearing and forestry mulching in Fort Mill, SC. Lot prep, brush removal, and property clearing in York County just south of Charlotte. Free estimates.",
    heroHeadline: "Fort Mill Land Clearing Just South of Charlotte",
    heroSubtext: "York County's fastest-growing town needs reliable land clearing — Fort Mill builders and homeowners count on Clearcut Land Management for professional results.",
    introTitle: "Land Clearing & Brush Removal in Fort Mill, SC",
    introParagraphs: [
      "Fort Mill has transformed from a quiet mill town into one of the fastest-growing communities in the Charlotte metro, with massive residential development, new school construction, and commercial growth along the I-77 corridor. This growth creates constant demand for professional land clearing — from individual lot preparation for custom homes to multi-parcel subdivision clearing for regional builders.",
      "Fort Mill's York County location means different regulations than Mecklenburg County projects. We're familiar with York County's permitting process, tree ordinances, and development standards, which saves builders and homeowners time and prevents costly compliance issues. The terrain in Fort Mill ranges from flat commercial corridors along Gold Hill Road to heavily wooded residential areas near the Catawba River, and our equipment handles all of it."
    ],
    localContext: "Fort Mill's explosive residential growth and proximity to the South Carolina state line create a unique market where Charlotte-area clearing expertise meets York County regulations and terrain.",
    serviceHighlights: [
      { slug: "forestry-mulching", localBlurb: "Fort Mill builders clearing lots in Tega Cay, Baxter, and along Highway 160 need fast, affordable lot preparation. Forestry mulching delivers cleared parcels without the hauling delays that slow down construction timelines." },
      { slug: "trail-cutting", localBlurb: "Properties near the Catawba River and Fort Mill's remaining wooded areas benefit from trail access to waterfront, hunting land, and unused back acreage." },
      { slug: "hillside-mulching", localBlurb: "The Catawba River corridor and Fort Mill's creek drainages include steep banks that accumulate heavy brush. Our specialized equipment clears slopes that are dangerous to tackle with hand tools." },
      { slug: "brush-hogging", localBlurb: "Fort Mill's vacant parcels and undeveloped lots need regular mowing to meet York County maintenance requirements and stay attractive for development or sale." },
      { slug: "fence-line-clearing", localBlurb: "New subdivision construction in Fort Mill requires clean fence lines before installation. We prep boundary lines throughout York County's growing residential communities." },
      { slug: "invasive-growth-removal", localBlurb: "Kudzu and privet are aggressive along Fort Mill's wooded corridors and unmaintained property edges. Our targeted removal keeps invasive species from overwhelming valuable development land." },
    ],
    projectExamples: [
      "Residential lot clearing in Riverwalk subdivision near the Catawba River",
      "Commercial parcel preparation along Gold Hill Road for retail development",
      "Estate property clearing and trail system near Tega Cay",
    ],
    faqs: [
      { q: "Do you work in South Carolina?", a: "Yes. Fort Mill and York County are core parts of our service area. We're familiar with South Carolina's regulations and permitting requirements, which differ from North Carolina's. We handle both sides of the state line regularly." },
      { q: "Can you clear lots for builders in Fort Mill?", a: "Absolutely. We work with several builders in the Fort Mill area on ongoing lot clearing. Our forestry mulching is faster and more cost-effective than traditional clearing methods, which helps builders stay on timeline and budget." },
    ],
  },
  {
    slug: "belmont",
    name: "Belmont",
    county: "Gaston County",
    state: "NC",
    metaTitle: "Land Clearing & Forestry Mulching Belmont NC | Clearcut Land Management",
    metaDescription: "Forestry mulching and land clearing in Belmont, NC. Property clearing, brush removal, and lot prep in Gaston County near Charlotte. Free estimates.",
    heroHeadline: "Belmont & Gaston County Land Clearing",
    heroSubtext: "From downtown Belmont's revitalized neighborhoods to the rolling hills of western Gaston County, we clear land the right way.",
    introTitle: "Professional Land Clearing in Belmont, NC",
    introParagraphs: [
      "Belmont's renaissance as one of the Charlotte area's most desirable small towns has driven significant development and property investment. The town's mix of historic neighborhoods, new construction, and surrounding rural acreage in Gaston County means property owners face a wide range of clearing needs — from tight residential lot prep near Main Street to large-scale acreage clearing on the outskirts.",
      "Gaston County's terrain west of Charlotte is hillier than much of Mecklenburg County, with steeper grades and more varied topography. This terrain makes hillside mulching a critical service in the Belmont area. Our tracked equipment handles the slopes around South Fork River, Catawba Creek corridors, and the rolling hills between Belmont and Mount Holly safely and effectively."
    ],
    localContext: "Belmont's growing popularity and Gaston County's rolling terrain create demand for clearing services that combine small-town residential precision with the capability to handle challenging western Piedmont topography.",
    serviceHighlights: [
      { slug: "forestry-mulching", localBlurb: "Belmont's development activity means steady demand for lot clearing and property preparation. Our mulching equipment handles Gaston County's mixed hardwood and pine forest efficiently, leaving clean, buildable parcels." },
      { slug: "trail-cutting", localBlurb: "Properties along the South Fork River and in western Gaston County have wooded acreage that benefits from trail access. We create paths to waterfront, timber stands, and remote property areas." },
      { slug: "hillside-mulching", localBlurb: "Gaston County's hilly terrain is our hillside mulching specialty. We clear steep grades along river banks, behind residential properties, and on development sites that require erosion-conscious clearing." },
      { slug: "brush-hogging", localBlurb: "Rural properties between Belmont and Mount Holly need regular field maintenance to stay productive and compliant. Our brush hogging handles overgrown pastures and vacant parcels throughout western Gaston County." },
      { slug: "fence-line-clearing", localBlurb: "Belmont's mix of older properties and new construction means fence lines at every stage — from restoration on neglected boundaries to prep for brand new installation." },
      { slug: "invasive-growth-removal", localBlurb: "Kudzu and wisteria are persistent problems in Gaston County's wooded areas and along property edges. Our removal program stops the spread before invasive species take over valuable land." },
    ],
    projectExamples: [
      "Hillside clearing behind residential properties overlooking South Fork River",
      "New construction lot preparation in downtown Belmont's expanding neighborhoods",
      "Rural acreage restoration on 15-acre parcel west of Mount Holly",
    ],
    faqs: [
      { q: "Is Belmont in your service area?", a: "Yes. Belmont and all of Gaston County are within our primary service area. We work throughout the western Charlotte metro including Mount Holly, Cramerton, and surrounding areas." },
      { q: "Can you handle the hilly terrain in Gaston County?", a: "Absolutely. Gaston County's terrain is why we invested in specialized hillside equipment. We regularly clear slopes and grades throughout the area that other companies won't touch." },
    ],
  },
  {
    slug: "waxhaw",
    name: "Waxhaw",
    county: "Union County",
    state: "NC",
    metaTitle: "Land Clearing & Forestry Mulching Waxhaw NC | Clearcut Land Management",
    metaDescription: "Professional forestry mulching and land clearing in Waxhaw, NC. Horse property clearing, lot prep, and acreage management in Union County. Free estimates.",
    heroHeadline: "Waxhaw & Union County Land Clearing",
    heroSubtext: "Horse country meets suburban growth — Waxhaw property owners trust Clearcut Land Management to manage everything from pasture maintenance to new construction clearing.",
    introTitle: "Land Clearing Services in Waxhaw, NC",
    introParagraphs: [
      "Waxhaw sits at the intersection of Union County's rural heritage and Charlotte's southward suburban expansion. The area is defined by horse properties, estate lots, and multi-acre parcels that need professional land management — not just the quarter-acre lots typical of inner-ring suburbs. This scale makes Waxhaw one of our most active service areas for both forestry mulching and recurring property maintenance.",
      "Union County's well-drained sandy loam soil supports aggressive vegetation growth, which means properties that aren't actively maintained can become overgrown surprisingly fast. A pasture left unmowed for two seasons can develop sapling growth thick enough to require mulching rather than mowing. Our proactive maintenance programs help Waxhaw property owners stay ahead of the curve and protect their investment in land that often carries significant value."
    ],
    localContext: "Waxhaw's equestrian heritage and large-lot residential character create a property management environment where professional clearing services are essential, not optional.",
    serviceHighlights: [
      { slug: "forestry-mulching", localBlurb: "Waxhaw's large residential parcels and estate lots frequently need comprehensive clearing. Our mulching handles 5-10 acre properties efficiently, turning overgrown land back into the usable horse country acreage Waxhaw is known for." },
      { slug: "trail-cutting", localBlurb: "Equestrian properties throughout Waxhaw benefit from trail systems connecting paddocks, pastures, and wooded riding areas. We cut and maintain trails designed for horseback riding and farm equipment access." },
      { slug: "hillside-mulching", localBlurb: "The creek corridors throughout Union County develop steep, brushy banks that create drainage and erosion problems. We clear these areas safely, preserving the soil structure." },
      { slug: "brush-hogging", localBlurb: "Waxhaw's horse farms and hay fields need consistent mowing to stay productive. We provide monthly and seasonal brush hogging for pastures, fields, and riding areas throughout Union County." },
      { slug: "fence-line-clearing", localBlurb: "Board fencing, wire fencing, and property boundary lines on Waxhaw's horse properties need regular clearing to prevent vegetation damage. We handle all fence types and clear to the width you need." },
      { slug: "invasive-growth-removal", localBlurb: "Privet and autumn olive are encroaching on Waxhaw's pastures and woodland edges. Our removal program protects productive farmland from invasive species takeover." },
    ],
    projectExamples: [
      "10-acre horse property restoration and pasture reclamation near Marvin",
      "Estate lot clearing for custom home construction off Waxhaw-Indian Trail Road",
      "Equestrian trail system development on 25-acre wooded property",
    ],
    faqs: [
      { q: "Do you work on horse properties?", a: "Yes, extensively. Waxhaw's equestrian community is a core part of our business. We understand the specific needs of horse properties including pasture management, paddock clearing, fence line maintenance, and riding trail development." },
      { q: "Can you clear large acreage in Union County?", a: "Absolutely. We regularly handle 10+ acre clearing projects in Union County. Our forestry mulching equipment is designed for exactly this scale of work, and we price large acreage projects competitively." },
    ],
  },
  {
    slug: "indian-trail",
    name: "Indian Trail",
    county: "Union County",
    state: "NC",
    metaTitle: "Land Clearing & Forestry Mulching Indian Trail NC | Clearcut Land Management",
    metaDescription: "Land clearing, brush removal, and forestry mulching in Indian Trail, NC. Residential lot clearing and property maintenance in Union County. Free estimates.",
    heroHeadline: "Indian Trail Land Clearing Experts",
    heroSubtext: "Indian Trail's rapid growth means more lots to clear and more properties to maintain — we handle it all across western Union County.",
    introTitle: "Land Clearing & Brush Removal in Indian Trail, NC",
    introParagraphs: [
      "Indian Trail has evolved from a rural crossroads into one of Union County's largest and fastest-growing communities. The development boom along Wesley Chapel-Stouts Road and Old Monroe Road has created enormous demand for lot clearing and land preparation. Builders working on new subdivisions, homeowners with overgrown back acreage, and investors holding undeveloped parcels all need professional clearing services that can keep pace with Indian Trail's growth.",
      "What makes Indian Trail's clearing landscape unique is the transition zone between fully developed suburban neighborhoods and the remaining rural properties. A cleared subdivision can sit directly adjacent to 20 acres of untouched woods, creating a patchwork of land management needs. Our services bridge this gap, from tight residential lot prep in established neighborhoods to large-scale rural clearing on the expanding fringe."
    ],
    localContext: "Indian Trail's position as Union County's development epicenter means constant demand for land clearing services as suburban Charlotte pushes deeper into formerly rural territory.",
    serviceHighlights: [
      { slug: "forestry-mulching", localBlurb: "Indian Trail builders clearing lots for the area's continuous residential development need fast turnaround. Forestry mulching delivers cleared, graded-ready parcels in a fraction of the time traditional methods require." },
      { slug: "trail-cutting", localBlurb: "Remaining rural parcels in Indian Trail have wooded sections that new owners want to explore and use. Trail cutting provides access to back acreage, hunting areas, and property boundaries." },
      { slug: "hillside-mulching", localBlurb: "Creek corridors through Indian Trail's developing areas have brushy banks that need clearing for drainage management and erosion prevention." },
      { slug: "brush-hogging", localBlurb: "Vacant lots and undeveloped parcels throughout Indian Trail need regular mowing to meet town maintenance standards and prevent neighbor complaints." },
      { slug: "fence-line-clearing", localBlurb: "New construction fence installation in Indian Trail's subdivisions requires clean, cleared boundaries. We prep lines and clear existing overgrowth for fence contractors." },
      { slug: "invasive-growth-removal", localBlurb: "Kudzu corridors along old railways and creek buffers in Indian Trail threaten adjacent developed properties. Our targeted removal stops the spread before it reaches your land." },
    ],
    projectExamples: [
      "Multi-lot subdivision clearing off Wesley Chapel-Stouts Road",
      "Investor property vacant lot maintenance program across Indian Trail",
      "Rural-to-residential conversion clearing on 8-acre parcel near Sun Valley",
    ],
    faqs: [
      { q: "How fast can you clear a residential lot in Indian Trail?", a: "Most residential lots in Indian Trail can be cleared in a single day with our forestry mulching equipment. Larger or heavily wooded lots may take 2 days. We work with builder timelines to keep construction schedules on track." },
      { q: "Do you offer lot maintenance for property investors?", a: "Yes. We maintain vacant lots for investors throughout Indian Trail and Union County with both one-time clearing and recurring maintenance programs. Keeping lots cleared prevents code violations and maintains property value." },
    ],
  },
  {
    slug: "monroe",
    name: "Monroe",
    county: "Union County",
    state: "NC",
    metaTitle: "Land Clearing & Forestry Mulching Monroe NC | Clearcut Land Management",
    metaDescription: "Forestry mulching and land clearing in Monroe, NC. Farm clearing, brush removal, and rural property services across eastern Union County. Free estimates.",
    heroHeadline: "Monroe & Eastern Union County Land Clearing",
    heroSubtext: "Monroe's agricultural roots and growing residential areas both need professional land clearing — from farm field reclamation to subdivision lot prep.",
    introTitle: "Land Clearing Services in Monroe, NC",
    introParagraphs: [
      "Monroe anchors the eastern side of Union County with a character that's distinctly more rural than the Charlotte-adjacent communities to its west. The area's agricultural heritage means larger properties, more acreage to manage, and vegetation challenges that scale with the land. Farmers reclaiming fallow fields, landowners managing timber tracts, and developers preparing parcels for Monroe's growing residential market all rely on professional clearing services.",
      "Eastern Union County's mix of pine plantations, hardwood bottoms along the Rocky River, and open agricultural land creates diverse clearing scenarios. Our equipment and expertise handle all of them — from light brush hogging on flat fields to heavy mulching in dense pine understory. Monroe's proximity to the Charlotte metro means property values continue to rise, making land maintenance and improvement a smart investment for property owners in the area."
    ],
    localContext: "Monroe's agricultural economy and growing residential development create a market where farm-scale clearing equipment meets suburban-quality finishing standards.",
    serviceHighlights: [
      { slug: "forestry-mulching", localBlurb: "Monroe's larger rural parcels are ideal for forestry mulching. We clear 10, 20, even 50+ acre properties for timber management, pasture conversion, and development preparation across eastern Union County." },
      { slug: "trail-cutting", localBlurb: "Hunting properties and timber tracts around Monroe need trail networks for access. We cut lane systems that connect food plots, stands, and property corners through Union County's pine and hardwood forest." },
      { slug: "hillside-mulching", localBlurb: "Rocky River bottoms and creek banks throughout Monroe's drainage corridors develop heavy brush growth. Our slope clearing prevents erosion while restoring usable land along waterways." },
      { slug: "brush-hogging", localBlurb: "Monroe's agricultural properties need regular field maintenance. We mow hayfields, clear fallow pastures, and reset overgrown farmland throughout eastern Union County on any schedule you need." },
      { slug: "fence-line-clearing", localBlurb: "Farm fencing throughout Monroe requires periodic clearing as vegetation encroaches. We handle everything from barbed wire cattle fence to new subdivision boundary prep." },
      { slug: "invasive-growth-removal", localBlurb: "Autumn olive and privet are colonizing Monroe's abandoned agricultural land at an alarming rate. Our removal programs help landowners reclaim productive acreage from invasive takeover." },
    ],
    projectExamples: [
      "50-acre timber tract understory clearing east of Monroe",
      "Farm field reclamation and pasture restoration on Highway 74 corridor",
      "Hunting property trail network and food plot access on Rocky River bottomland",
    ],
    faqs: [
      { q: "Do you handle large rural properties?", a: "That's one of our specialties. Monroe and eastern Union County have some of the largest parcels in our service area, and our equipment is built for that scale. We regularly clear 20-50+ acre properties for agricultural, timber, and development purposes." },
      { q: "Can you clear land for farming?", a: "Yes. We clear overgrown fields, remove saplings from fallow land, and prepare acreage for agricultural use. Forestry mulching is especially effective because it leaves organic matter that improves soil quality rather than stripping it away like bulldozing does." },
    ],
  },
  {
    slug: "lake-norman",
    name: "Lake Norman",
    county: "Multiple Counties",
    state: "NC",
    metaTitle: "Land Clearing & Forestry Mulching Lake Norman NC | Clearcut Land Management",
    metaDescription: "Professional land clearing and forestry mulching around Lake Norman, NC. Lakefront property clearing, slope clearing, and brush removal. Free estimates.",
    heroHeadline: "Lake Norman Lakefront & Property Clearing",
    heroSubtext: "Lake Norman's valuable waterfront properties deserve expert clearing — we handle slopes, shoreline buffers, and wooded lots with care and precision.",
    introTitle: "Land Clearing Services Around Lake Norman, NC",
    introParagraphs: [
      "Lake Norman is one of the most valuable real estate markets in the Charlotte metro, with waterfront properties, estate lots, and view parcels commanding premium prices. That property value makes professional land clearing especially important — a poorly executed clearing job can damage slopes, create erosion that reaches the lake, or destroy the scenic character that makes Lake Norman properties desirable in the first place.",
      "We bring a different approach to Lake Norman clearing than what most companies offer. Our forestry mulching preserves topsoil and root systems rather than stripping them away. On lakefront slopes, we selectively clear brush while leaving stabilizing trees intact. Along shoreline buffers, we work within the vegetated buffer requirements that protect water quality. The result is cleared land that's immediately usable without the erosion, runoff, and re-grading costs that come with aggressive clearing methods."
    ],
    localContext: "Lake Norman's high-value waterfront real estate, environmentally sensitive shoreline buffers, and steep lakefront grades require specialized clearing expertise that protects both property value and water quality.",
    serviceHighlights: [
      { slug: "forestry-mulching", localBlurb: "Lake Norman properties need clearing that respects the lake environment. Our mulching preserves root systems and topsoil on lakefront lots, preventing the erosion and runoff that damage both your property and water quality." },
      { slug: "trail-cutting", localBlurb: "Create access to your Lake Norman waterfront through wooded slopes. We cut trails from homesites to docks, boat launches, and shoreline areas that have become inaccessible through overgrowth." },
      { slug: "hillside-mulching", localBlurb: "Lake Norman's signature steep shoreline grades are our hillside mulching specialty. We clear brush on lakefront slopes using equipment rated for the grades, with techniques that prevent erosion from reaching the water." },
      { slug: "brush-hogging", localBlurb: "Estate lots and open areas around Lake Norman need regular maintenance to stay presentable. We keep fields, viewsheds, and cleared areas maintained year-round for lakefront property owners." },
      { slug: "fence-line-clearing", localBlurb: "Lake Norman properties with fencing along wooded boundaries need clearing to prevent vegetation damage and maintain clean property lines." },
      { slug: "invasive-growth-removal", localBlurb: "Invasive species along Lake Norman's shoreline threaten both property aesthetics and lake ecology. Our removal program targets privet, honeysuckle, and other invasives that dominate the shoreline understory." },
    ],
    projectExamples: [
      "Lakefront slope clearing for dock access on The Peninsula",
      "Estate lot clearing and view enhancement for Lake Norman waterfront home",
      "Shoreline buffer management and invasive species removal on private cove",
    ],
    faqs: [
      { q: "Can you clear on steep Lake Norman shoreline slopes?", a: "Yes, this is one of our core capabilities. We use tracked equipment rated for steep grades and our operators are experienced with lakefront terrain. We selectively preserve stabilizing trees and vegetation to prevent erosion." },
      { q: "Are there restrictions on clearing near Lake Norman?", a: "Yes. Lake Norman has vegetated buffer requirements that restrict clearing within certain distances of the shoreline. We're familiar with these regulations and work within them. During the estimate, we'll identify any buffer zones and plan the clearing accordingly." },
      { q: "Will clearing cause erosion that reaches the lake?", a: "Not with our approach. Forestry mulching leaves a thick mulch layer that actually reduces erosion compared to the overgrown state. We also preserve root systems and strategically leave stabilizing vegetation on slopes. This is fundamentally different from bulldozing, which strips everything and creates significant erosion risk." },
    ],
  },
  {
    slug: "mooresville",
    name: "Mooresville",
    county: "Iredell County",
    state: "NC",
    metaTitle: "Land Clearing & Forestry Mulching Mooresville NC | Clearcut Land Management",
    metaDescription: "Professional forestry mulching and land clearing in Mooresville, NC. Property clearing, brush removal, and lot prep in southern Iredell County. Free estimates.",
    heroHeadline: "Mooresville & Iredell County Land Clearing",
    heroSubtext: "Race City's growth extends beyond the track — Mooresville property owners and builders rely on Clearcut Land Management for professional clearing across southern Iredell County.",
    introTitle: "Land Clearing Services in Mooresville, NC",
    introParagraphs: [
      "Mooresville combines Lake Norman lakefront living with the expanding commercial and residential development along the I-77 corridor north of Charlotte. Southern Iredell County is experiencing growth that mirrors what Huntersville saw a decade ago, with new subdivisions, commercial projects, and mixed-use developments transforming formerly rural land. This growth cycle creates strong, consistent demand for professional land clearing.",
      "The terrain in the Mooresville area is typical Piedmont — rolling hills, mixed hardwood and pine forest, and clay-based soils that require careful management during clearing. Properties near Lake Norman add steep grades and water quality considerations. Our forestry mulching approach is ideal for Mooresville's terrain because it preserves soil structure, prevents erosion, and delivers finished results that are ready for the next phase of development."
    ],
    localContext: "Mooresville's dual identity as a Lake Norman community and a growing I-77 corridor town creates diverse clearing needs from lakefront slope management to large-scale development preparation.",
    serviceHighlights: [
      { slug: "forestry-mulching", localBlurb: "Mooresville's expanding development needs efficient lot clearing. Our mulching equipment handles the mixed hardwood and pine forest common in southern Iredell County, delivering construction-ready parcels on tight timelines." },
      { slug: "trail-cutting", localBlurb: "Rural properties north of Mooresville and wooded parcels near Lake Norman benefit from trail access. We cut paths for recreation, hunting, and property management throughout Iredell County." },
      { slug: "hillside-mulching", localBlurb: "Lake Norman shoreline slopes in Mooresville require careful, specialized clearing. Our hillside mulching handles the steep grades while preserving soil stability and preventing erosion into the lake." },
      { slug: "brush-hogging", localBlurb: "Mooresville's remaining agricultural properties and vacant parcels along the I-77 corridor need regular mowing. We provide efficient brush hogging for fields and lots of any size." },
      { slug: "fence-line-clearing", localBlurb: "New construction in Mooresville's growing subdivisions requires fence line prep, and older properties need boundary clearing. We handle both throughout southern Iredell County." },
      { slug: "invasive-growth-removal", localBlurb: "Kudzu and privet are established problems in parts of Iredell County. Our removal programs protect Mooresville properties from the aggressive spread of invasive species." },
    ],
    projectExamples: [
      "Lake Norman waterfront estate clearing with slope management in Mooresville",
      "Commercial lot preparation along I-77 corridor for business park development",
      "Rural acreage clearing and trail development on 30-acre property north of Mooresville",
    ],
    faqs: [
      { q: "Do you serve all of southern Iredell County?", a: "Yes. We serve Mooresville, Troutman, Statesville, and all surrounding areas in southern Iredell County. Our service area extends throughout the northern Charlotte metro." },
      { q: "Can you clear lakefront property in Mooresville?", a: "Absolutely. Many of our Mooresville projects involve Lake Norman waterfront properties. We bring specialized hillside equipment and understand the buffer requirements and erosion control needs specific to lakefront clearing." },
    ],
  },
];

export function getServiceAreaBySlug(slug: string): ServiceArea | undefined {
  return SERVICE_AREAS.find((area) => area.slug === slug);
}

export function getServiceAreaSlugs(): string[] {
  return SERVICE_AREAS.map((area) => area.slug);
}
