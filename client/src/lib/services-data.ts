import { SERVICE_IMAGES } from "./stock-images";

export interface ServiceFAQ {
  q: string;
  a: string;
}

export interface ServiceInfo {
  slug: string;
  title: string;
  shortDesc: string;
  description: string;
  features: string[];
  image: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  overview: string;
  bestFor: string[];
  whatsIncluded: string[];
  typicalProjects: string[];
  pricingFactors: string;
  faqs: ServiceFAQ[];
  relatedSlugs: string[];
}

export const SERVICES: ServiceInfo[] = [
  {
    slug: "forestry-mulching",
    title: "Forestry Mulching",
    shortDesc: "Single-pass land clearing that grinds brush, saplings, and undergrowth into natural mulch on-site.",
    description:
      "Forestry mulching is the fastest, most efficient way to reclaim overgrown land in the Charlotte area. Our mulcher head chews through dense brush, saplings, and understory in a single pass — no hauling, no burn piles, no mess. The result is a clean, walkable surface with a natural mulch layer that prevents erosion and returns nutrients to the soil.",
    features: [
      "Single-pass clearing with no debris hauling",
      "Selective clearing to preserve mature trees",
      "Natural mulch layer for erosion control",
      "Minimal ground disturbance and soil compaction",
      "Handles saplings up to 6\u20138 inches in diameter",
    ],
    image: SERVICE_IMAGES["forestry-mulching"],
    metaTitle: "Forestry Mulching Charlotte NC | Land Clearing | Clearcut Land Management",
    metaDescription: "Professional forestry mulching in Charlotte, NC and Mecklenburg County. Single-pass clearing for overgrown lots, dense brush, and saplings. No hauling, no burn piles. Free estimates.",
    h1: "Forestry Mulching Services in Charlotte, NC",
    intro: "One machine. One pass. Brush, saplings, and understory ground into clean mulch — no burning, no hauling, no topsoil damage.",
    overview: "Forestry mulching uses a single machine — a skid steer fitted with a high-speed mulching head — to grind brush, saplings, and undergrowth directly into the soil. Unlike chainsaws, bulldozers, and burn piles, it handles everything in one pass with zero debris to haul away. The mulching head shreds vegetation into wood chips that suppress weeds, retain moisture, and prevent erosion.\n\nProperty owners across Mecklenburg, Union, and Cabarrus Counties choose forestry mulching because it's typically 30–50% less expensive than traditional clearing. No burn permits, no topsoil loss, no hauling crews. Our operators can selectively clear around mature trees, structures, and features you want to keep — transforming overgrown land into usable property in a fraction of the time.",
    bestFor: [
      "Dense brush and sapling overgrowth",
      "Neglected properties needing a full reset",
      "Acreage cleanup without soil destruction",
      "Clearing for future construction or landscaping",
    ],
    whatsIncluded: [
      "Full mulching of brush, vines, and saplings to ground level",
      "Selective clearing around trees you want to keep",
      "Clean, walkable finish with natural mulch layer",
      "Post-clearing walkthrough to confirm scope completion",
    ],
    typicalProjects: [
      "5-acre overgrown property reset in Matthews and Mint Hill",
      "Residential lot reclamation in south Charlotte subdivisions",
      "Acreage clearing for builders near Huntersville and Mooresville",
    ],
    pricingFactors: "Forestry mulching is typically priced by the acre based on vegetation density, terrain difficulty, and accessibility. Because there's no hauling or disposal, it's often 30-50% less expensive than traditional clearing. Densely wooded areas with larger saplings cost more than light brush. Request a free on-site estimate for accurate pricing on your Charlotte-area property.",
    faqs: [
      { q: "How is forestry mulching different from bulldozing or traditional clearing?", a: "Bulldozing strips the topsoil, destroys root systems, and creates massive debris piles that need to be hauled or burned. Forestry mulching grinds everything in place — no hauling trucks, no burn permits, no topsoil loss. The mulch left behind actually improves soil health and prevents erosion. It's faster, cleaner, and usually cheaper." },
      { q: "What size trees can your mulcher handle?", a: "Our forestry mulcher head handles saplings and trees up to approximately 6\u20138 inches in diameter. Larger trees can be felled first, then the stumps and slash are mulched. We'll assess your specific vegetation during the free estimate and plan the right approach." },
      { q: "Can you clear around specific trees I want to keep?", a: "Absolutely. Selective clearing is one of the biggest advantages of forestry mulching over bulldozing. We can work precisely around any trees, structures, or features you want to preserve. Just walk us through your priorities during the estimate." },
      { q: "How long does forestry mulching take?", a: "Most residential projects in the Charlotte area are completed in 1\u20132 days. A typical half-acre lot with moderate brush can often be finished in a single day. Larger acreage projects are scheduled based on density and terrain. We'll give you a timeline during your estimate." },
    ],
    relatedSlugs: ["trail-cutting", "hillside-mulching", "brush-hogging"],
  },
  {
    slug: "trail-cutting",
    title: "Trail Cutting",
    shortDesc: "Custom access lanes, hunting trails, and paths cut through wooded and overgrown property.",
    description:
      "Stop losing usable land to overgrowth. Our trail cutting service creates functional access lanes, hunting trails, and pond access paths through wooded and brushy terrain. We cut to your specified width and clear clean edges so you can actually use the back half of your property.",
    features: [
      "Custom-width trails from walking paths to vehicle access",
      "Clean edge trimming for a finished look",
      "Pond, creek, and fence line access paths",
      "Hunting trail and food plot access lanes",
      "Equipment access for future projects",
    ],
    image: SERVICE_IMAGES["trail-cutting"],
    metaTitle: "Trail Cutting & Access Lanes Charlotte NC | Clearcut Land Management",
    metaDescription: "Professional trail cutting in Union and Cabarrus County near Charlotte, NC. Hunting trails, pond access, back acreage paths. Custom widths, clean edges. Free estimates.",
    h1: "Trail Cutting & Access Lane Services Near Charlotte, NC",
    intro: "We cut clean access lanes, hunting trails, and property paths through dense brush so you can actually use your land.",
    overview: "Trail cutting clears defined pathways through wooded or overgrown terrain to create usable access routes. Whether you need a 4-foot walking path to a back pond or a 12-foot lane for truck access, we transform inaccessible land into connected, functional acreage. The process involves clearing vegetation and brush along your designated route, then finishing the edges for a clean, professional appearance.\n\nHunters use trail systems to connect food plots and stands without disturbing game patterns. Landowners use access lanes to reach ponds, fence lines, and timber. Real estate investors create trails to showcase back acreage buyers would never see otherwise. We plan routes that follow natural terrain — ridgelines, dry ground, and logical connection points — cut to your specified width with clean edges throughout.",
    bestFor: [
      "Hunting trail and food plot access",
      "Pond and creek access paths",
      "Back acreage and fence line access",
      "Recreational trails for ATVs and walking",
    ],
    whatsIncluded: [
      "Trail clearing to your specified width and route",
      "Edge trimming for a clean, maintained appearance",
      "Mulching or cut-and-pile based on your preference",
      "GPS marking of completed trail routes on request",
    ],
    typicalProjects: [
      "Hunting trail network on 20-acre property in Indian Trail",
      "Pond access lane through wooded acreage near Monroe",
      "ATV trail system on rural property in Concord and Cabarrus County",
    ],
    pricingFactors: "Trail cutting is priced by linear foot or by the project based on trail width, vegetation density, and terrain. A narrow walking trail through light brush costs significantly less than a wide vehicle access lane through dense timber. Hilly or rocky terrain adds complexity. Contact us for a free estimate specific to your Union or Cabarrus County property.",
    faqs: [
      { q: "How wide can you cut a trail?", a: "We cut trails from narrow 4-foot walking paths up to 12+ foot vehicle access lanes. The width depends on your intended use — foot traffic, ATV, truck access, or equipment access. We'll recommend the right width based on how you plan to use the trail." },
      { q: "Can you cut trails on hilly or uneven ground?", a: "Yes. Our equipment handles rough terrain, slopes, and uneven ground. We evaluate the terrain during the estimate and plan routes that work with the natural contours of your land rather than fighting them." },
      { q: "Will the trail be usable immediately after cutting?", a: "In most cases, yes. After clearing and mulching, the trail surface is walkable and typically driveable for ATVs and lighter vehicles. For heavy truck access, you may need gravel or additional grading, which we can coordinate." },
      { q: "Can you cut trails to connect to existing paths or roads?", a: "Absolutely. We frequently tie new trails into existing driveways, farm roads, or established paths. We'll walk the route with you beforehand so the final product connects exactly where you need it." },
    ],
    relatedSlugs: ["forestry-mulching", "hillside-mulching", "brush-hogging"],
  },
  {
    slug: "hillside-mulching",
    title: "Hillside Mulching",
    shortDesc: "Specialized brush clearing on steep slopes and uneven terrain where standard equipment can't go.",
    description:
      "Steep hills and rough terrain don't stop overgrowth — and they shouldn't stop you from clearing it. Our hillside mulching service uses specialized equipment and techniques to clear brush on slopes, banks, and uneven terrain that standard crews won't touch. We handle the grades so you don't have to worry about erosion or access problems.",
    features: [
      "Clearing on steep grades and embankments",
      "Erosion-conscious approach with mulch retention",
      "Equipment rated for slopes and uneven terrain",
      "Bank stabilization through selective clearing",
      "Access creation on difficult hillside properties",
    ],
    image: SERVICE_IMAGES["hillside-mulching"],
    metaTitle: "Hillside Mulching & Slope Clearing Charlotte NC | Clearcut Land Management",
    metaDescription: "Hillside mulching and slope clearing in Gaston and Lincoln County near Charlotte, NC. Steep grades, erosion-prone hills, difficult terrain. Specialized equipment. Free estimates.",
    h1: "Hillside Mulching & Slope Clearing Near Charlotte, NC",
    intro: "Steep slopes, rough banks, tough terrain — we clear where other crews won't, leaving a protective mulch layer that fights erosion.",
    overview: "Hillside mulching is specialized land clearing for steep slopes, embankments, and terrain where conventional equipment can't safely operate. Across Gaston County, Lincoln County, and the Lake Norman shoreline, overgrown slopes create real problems — trapped moisture accelerates erosion, dense brush becomes a fire hazard, and hidden gullies undermine hillside stability. Bulldozing is especially destructive on slopes, stripping away the topsoil and root networks that hold the hill together.\n\nOur approach uses tracked equipment rated for steep grades with mulching heads that grind vegetation in place, preserving soil structure and root systems. The mulch layer acts as a natural erosion blanket — absorbing rainfall and slowing runoff. We selectively preserve anchor trees for critical slope stability, leaving a cleared hillside that's actually more resistant to erosion than before. This is especially valuable for lakefront properties and residential lots with significant grade changes.",
    bestFor: [
      "Steep grades and embankments overgrown with brush",
      "Erosion-prone hillsides needing controlled clearing",
      "Slopes with difficult or limited equipment access",
      "Roadside and highway bank vegetation management",
    ],
    whatsIncluded: [
      "Mulching brush and saplings on slopes up to 35+ degrees",
      "Erosion-conscious clearing with mulch layer retention",
      "Selective clearing to preserve stabilizing root systems",
      "Post-clearing assessment of slope condition",
    ],
    typicalProjects: [
      "Hillside clearing behind residential properties in Belmont and Mount Holly",
      "Embankment brush removal along roads in Gaston County",
      "Slope restoration on lakefront properties near Lake Norman",
    ],
    pricingFactors: "Hillside mulching pricing reflects the added complexity of working on slopes. Factors include the grade of the slope, density of vegetation, accessibility for equipment staging, and total area. Steeper grades and limited access points increase the cost. We provide free on-site estimates so we can assess the terrain firsthand before quoting your Gaston or Lincoln County project.",
    faqs: [
      { q: "How steep of a slope can you clear?", a: "We regularly work on slopes of 30\u201335+ degrees using equipment and techniques designed for hillside work. During the estimate, we assess the specific grade, soil conditions, and access points to determine the safest and most effective approach for your property." },
      { q: "Won't clearing a hillside cause erosion?", a: "Not when it's done right. Forestry mulching leaves a thick layer of ground mulch that actually protects the soil and reduces erosion compared to the overgrown state. We also selectively preserve root systems and vegetation that provide slope stability. The result is a cleaner hillside with better erosion control." },
      { q: "Why do other companies turn down hillside work?", a: "Most land clearing companies use equipment that isn't rated for slopes, or their operators aren't trained for it. Working on grades requires specialized attachments, different techniques, and experience reading terrain. We've invested in the equipment and training specifically for this type of work." },
      { q: "Can you clear a hillside without damaging the slope?", a: "Yes. That's the core advantage of mulching over bulldozing on slopes. We grind vegetation in place without disturbing the soil structure or removing stabilizing root systems. The mulch layer we leave behind further protects the slope surface from water runoff." },
    ],
    relatedSlugs: ["forestry-mulching", "trail-cutting", "invasive-growth-removal"],
  },
  {
    slug: "brush-hogging",
    title: "Brush Hogging",
    shortDesc: "Heavy-duty rotary mowing for overgrown fields, pastures, and open areas.",
    description:
      "When a regular mower can't handle it, you need a brush hog. Our rotary mower service cuts through tall grass, weeds, light brush, and overgrown fields that haven't been maintained in months or years. It's the fastest way to reclaim open land and keep fields, pastures, and vacant lots under control.",
    features: [
      "Heavy-duty rotary mowing for tall grass and weeds",
      "Field and pasture maintenance on any schedule",
      "Vacant lot and right-of-way clearing",
      "Light brush and sapling cutting up to 2\u20133 inches",
      "Large area coverage with efficient equipment",
    ],
    image: SERVICE_IMAGES["brush-hogging"],
    metaTitle: "Brush Hogging Charlotte NC | Field Mowing | Clearcut Land Management",
    metaDescription: "Professional brush hogging and field mowing in the rural Charlotte, NC area. Overgrown fields, pastures, vacant lots. Heavy-duty rotary mowing. Free estimates.",
    h1: "Brush Hogging & Field Mowing in the Charlotte Area",
    intro: "Heavy-duty rotary mowing that chews through waist-high grass, thick weeds, and light brush your riding mower can't touch.",
    overview: "Brush hogging is a heavy-duty mowing service for overgrown fields, pastures, and open land that's grown beyond what any standard mower can handle. Our rotary cutter powers through waist-high grass, dense weeds, blackberry canes, and light saplings up to 2–3 inches in diameter. It's the go-to solution for property owners across the rural Charlotte area who need large open areas under control quickly and affordably.\n\nUnlike forestry mulching, which targets dense woody vegetation, brush hogging is designed for grass-dominant growth on open terrain — faster and more cost-effective for the right application. We commonly serve horse farms in Waxhaw, investor properties in Indian Trail, and rural acreage near Mooresville. Recurring schedules — monthly or quarterly — keep fields maintained year-round with reduced rates for maintenance contracts.",
    bestFor: [
      "Overgrown fields and pastures needing a reset",
      "Vacant lot maintenance for owners and investors",
      "Tall grass and weed control on large properties",
      "Seasonal field maintenance on a recurring schedule",
    ],
    whatsIncluded: [
      "Heavy-duty rotary mowing of entire designated area",
      "Edge cleanup along driveways, tree lines, and structures",
      "Cut height adjustment based on your goals",
      "Recurring maintenance scheduling available",
    ],
    typicalProjects: [
      "5-acre pasture reset on horse property in Waxhaw",
      "Vacant lot maintenance for investor properties in Indian Trail",
      "Annual field mowing on rural acreage near Mooresville and Lake Norman",
    ],
    pricingFactors: "Brush hogging is typically priced by the acre based on the height and density of growth, terrain flatness, and any obstacles in the field. A field with waist-high grass on flat ground costs less than one with 6-foot weeds on uneven terrain. Recurring maintenance contracts offer reduced per-visit pricing. Request a free estimate for your Charlotte-area property.",
    faqs: [
      { q: "What's the difference between brush hogging and forestry mulching?", a: "Brush hogging uses a rotary mower to cut grass, weeds, and light brush at ground level — think of it as heavy-duty mowing. Forestry mulching uses a grinding head to chew through saplings, small trees, and dense brush, turning them into mulch. If your land is mostly open with tall grass and weeds, brush hogging is the right tool. If it's thick with saplings and woody growth, you need forestry mulching." },
      { q: "How tall can the grass and weeds be?", a: "Our brush hog handles growth of any height — from knee-high grass to 6+ foot weeds and light saplings up to 2\u20133 inches in diameter. If the growth is primarily woody brush or larger saplings, we may recommend forestry mulching instead." },
      { q: "Can you set up recurring mowing for my property?", a: "Yes. We offer monthly, quarterly, and seasonal brush hogging schedules for property owners who want to keep fields and lots maintained without the hassle. Recurring contracts get priority scheduling and reduced per-visit rates." },
      { q: "Do you mow around obstacles like fence posts and trees?", a: "Yes. We carefully work around fence posts, trees, utility poles, and other obstacles in the field. We'll walk the property with you before the first cut to identify anything that needs to be avoided." },
    ],
    relatedSlugs: ["forestry-mulching", "fence-line-clearing", "invasive-growth-removal"],
  },
  {
    slug: "fence-line-clearing",
    title: "Fence Line Clearing",
    shortDesc: "Vegetation removal along property boundaries, fence lines, and easements.",
    description:
      "Overgrown fence lines create property disputes, hide boundary markers, and make fence installation impossible. Our fence line clearing service cuts back vegetation along property boundaries, existing fences, and easements — giving you clean, visible, maintainable property lines.",
    features: [
      "Clearing along existing fences without damage",
      "Property boundary vegetation removal",
      "Fence installation prep and post clearing",
      "Easement and right-of-way access restoration",
      "Neighbor-friendly clearing with clean edges",
    ],
    image: SERVICE_IMAGES["fence-line-clearing"],
    metaTitle: "Fence Line Clearing Charlotte NC | Property Line | Clearcut Land Management",
    metaDescription: "Fence line clearing and property boundary vegetation removal in Mecklenburg County and Charlotte, NC. Prep for fence installation, maintain property lines. Free estimates.",
    h1: "Fence Line Clearing & Property Boundary Services in Charlotte, NC",
    intro: "Reclaim your property boundaries — we clear overgrown fence lines, restore visibility, and prep for new fence installation.",
    overview: "Fence line clearing removes vegetation that has encroached on property boundaries, existing fences, easements, and rights-of-way. Across Mecklenburg County, south Charlotte, Matthews, and Mint Hill, overgrown fence lines are one of the most common sources of neighbor disputes and maintenance headaches. Privet, honeysuckle, and wild grape grow unchecked until they consume fences, obscure survey markers, and create disputed boundaries.\n\nWe cut back vegetation to a specified width on each side of the property line, carefully working around existing fence structures and removing vine growth woven through the fencing. This service is also essential for fence installation prep — contractors need 4–6 feet of clear ground before they can begin. We handle any length, from a 50-foot backyard boundary to miles of pasture fencing, with clean professional edges throughout.",
    bestFor: [
      "Fence installation prep along overgrown boundaries",
      "Existing fence line maintenance and vine removal",
      "Property line disputes requiring visible boundaries",
      "HOA compliance for boundary vegetation standards",
    ],
    whatsIncluded: [
      "Clearing vegetation 3\u20136 feet on either side of fence line",
      "Careful work around existing fence structures",
      "Vine and invasive growth removal from fence fabric",
      "Clean edge finish for a maintained appearance",
    ],
    typicalProjects: [
      "Subdivision fence line clearing in south Charlotte and Ballantyne",
      "Property boundary restoration in Matthews and Mint Hill",
      "Fence installation prep for new construction in Huntersville",
    ],
    pricingFactors: "Fence line clearing is priced by linear foot based on the density of growth, width of clearing needed, and proximity to structures or existing fences. Heavy vine growth wrapped through chain link costs more than clearing light brush along an open boundary. We provide free on-site estimates for Mecklenburg County properties.",
    faqs: [
      { q: "Can you clear along my fence without damaging it?", a: "Yes. We use the right tools and approach to clear right up to existing fences without damaging posts, rails, or fabric. We'll assess your fence type and condition during the estimate so there are no surprises. If a section of fence is already compromised by growth, we'll let you know before we start." },
      { q: "My neighbor's side is overgrown too — can you clear both sides?", a: "We can clear your side of the property line without issue. If your neighbor wants their side cleared as well, we're happy to do both — but we need permission from the property owner on each side. Many of our fence line jobs in Mecklenburg County end up as shared projects between neighbors." },
      { q: "How far back from the fence line do you clear?", a: "The standard clearing width is 3\u20136 feet on each side of the fence line, but we adjust based on your needs. For fence installation prep, contractors typically want 4\u20136 feet of clear space on each side. For maintenance clearing, 3 feet may be sufficient." },
      { q: "Can you remove vines that have grown into the fence?", a: "Yes. We remove vines, honeysuckle, wisteria, and other growth that wraps through fence fabric. In severe cases, the vine growth may have damaged the fence structure — we'll identify any damage during clearing so you can plan repairs." },
    ],
    relatedSlugs: ["forestry-mulching", "invasive-growth-removal", "brush-hogging"],
  },
  {
    slug: "invasive-growth-removal",
    title: "Invasive Growth Removal",
    shortDesc: "Targeted removal of kudzu, privet, honeysuckle, wisteria, and other invasive species choking your property.",
    description:
      "Invasive species don't just look bad — they kill native trees, destroy fences, and reduce property value. Our invasive growth removal targets the worst offenders in the Charlotte metro: kudzu, privet, honeysuckle, wisteria, and English ivy. We cut, mulch, and treat invasive growth to give your property a fighting chance at recovery.",
    features: [
      "Targeted removal of kudzu, privet, and honeysuckle",
      "Wisteria and English ivy extraction from trees and structures",
      "Cut-and-treat methodology to prevent regrowth",
      "HOA compliance clearing for invasive species violations",
      "Ecological restoration for native plant recovery",
    ],
    image: SERVICE_IMAGES["invasive-growth-removal"],
    metaTitle: "Invasive Species Removal Charlotte NC | Kudzu & Privet | Clearcut Land Management",
    metaDescription: "Invasive growth removal in Charlotte, NC metro. Kudzu, privet, honeysuckle, wisteria removal. HOA compliance, ecological restoration. Cut-and-treat methods. Free estimates.",
    h1: "Invasive Growth Removal Services in Charlotte, NC",
    intro: "Targeted cut-and-treat removal of kudzu, privet, and invasive vines — we don't just cut it back, we stop it from coming back.",
    overview: "Invasive species removal targets non-native plants aggressively overtaking properties across the Charlotte metro. The Piedmont region hosts some of the Southeast's worst offenders — kudzu, privet, honeysuckle, wisteria, and English ivy. Kudzu grows up to a foot per day, covering tree canopies and collapsing structures. Privet forms impenetrable thickets. Honeysuckle and wisteria strangle mature hardwoods worth thousands of dollars.\n\nBeyond ecological damage, invasive growth creates real financial consequences — HOA violations, lower appraisals, and higher insurance risk. Our integrated approach combines mechanical clearing with targeted cut-stump treatment to kill root systems and prevent regrowth. Simply cutting without treating is a temporary fix, as most species regenerate from root networks within weeks. We identify, map, remove, and treat every invasive species on your property.",
    bestFor: [
      "Kudzu, privet, honeysuckle, and wisteria takeover",
      "HOA violation notices for overgrown invasive species",
      "Native tree rescue from vine strangulation",
      "Ecological restoration on residential and commercial properties",
    ],
    whatsIncluded: [
      "Identification and mapping of invasive species on your property",
      "Mechanical removal via cutting and mulching",
      "Targeted treatment of cut stumps to prevent regrowth",
      "Follow-up recommendations for long-term management",
    ],
    typicalProjects: [
      "Kudzu removal and recovery on residential property in Fort Mill",
      "Privet and honeysuckle clearing for HOA compliance in Ballantyne",
      "Wisteria extraction from mature trees in Concord neighborhoods",
    ],
    pricingFactors: "Invasive growth removal pricing depends on the species, severity of infestation, total area affected, and whether treatment is needed to prevent regrowth. A small patch of honeysuckle along a fence costs far less than a full-property kudzu remediation. Treatment adds cost but dramatically reduces regrowth. Request a free estimate for your Charlotte metro property.",
    faqs: [
      { q: "Will the invasive species grow back after removal?", a: "Without treatment, many invasive species will regrow from root systems. That's why we use cut-and-treat methodology — we cut the growth mechanically, then apply targeted treatment to the cut stumps to kill the root system. This dramatically reduces regrowth. We also provide follow-up recommendations for monitoring and maintenance." },
      { q: "What invasive species are most common in Charlotte?", a: "The Charlotte metro's biggest offenders are kudzu, Chinese privet, Japanese honeysuckle, wisteria, and English ivy. All five are aggressive growers that smother native plants, damage structures, and reduce property values. If you're not sure what's growing on your property, we'll identify it during the estimate." },
      { q: "My HOA sent a violation for invasive overgrowth — can you help?", a: "Yes. HOA invasive species violations are one of our most common calls in Mecklenburg County. We can clear the growth, document the work with photos for your HOA, and provide a maintenance recommendation to keep you in compliance going forward." },
      { q: "Can you save trees that are being strangled by vines?", a: "In many cases, yes. If the tree hasn't been completely girdled or structurally compromised, removing the vine and treating the cuts gives the tree a strong chance of recovery. We assess each tree during the estimate and give you an honest evaluation of what can be saved." },
    ],
    relatedSlugs: ["forestry-mulching", "fence-line-clearing", "hillside-mulching"],
  },
];

export function getServiceBySlug(slug: string): ServiceInfo | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
