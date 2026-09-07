from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import json
ROOT=Path('/Users/gino_s/Documents/bhs-2')
OUT=ROOT/'output/brand'; TMP=ROOT/'tmp/brand'
OUT.mkdir(parents=True,exist_ok=True); TMP.mkdir(parents=True,exist_ok=True)
FONT=ROOT/'public/assets/fonts'
col={'Ink':'202925','Chalk':'F4F1EA','Olive':'4D5B4B','Stone':'D8D2C6','Clay':'A65B43','White':'FFFFFF'}
def lum(h):
    v=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    v=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in v]
    return .2126*v[0]+.7152*v[1]+.0722*v[2]
def contrast(a,b):
    a,b=sorted([lum(a),lum(b)],reverse=True); return (a+.05)/(b+.05)
ratios={a+'/'+b:contrast(col[a],col[b]) for a,b in [('Ink','Chalk'),('Olive','Chalk'),('White','Olive'),('Clay','Chalk'),('Ink','Stone'),('Stone','Chalk')]}
(TMP/'contrast.json').write_text(json.dumps(ratios,indent=2))
# Specimens render the existing licensed font files without changing the website.
img=Image.new('RGB',(1800,660),'#F4F1EA'); dr=ImageDraw.Draw(img)
def ft(size,weight='Regular'):return ImageFont.truetype(str(FONT/f'Satoshi-{weight}.otf'),size)
dr.text((60,38),'BETTER HOMES',font=ft(28,'Medium'),fill='#4D5B4B')
dr.text((55,102),'A better home.',font=ft(108,'Medium'),fill='#202925')
dr.text((55,228),'A well-managed build.',font=ft(108,'Medium'),fill='#202925')
dr.text((60,400),'Extensions, loft conversions and whole-home renovations in London.',font=ft(38),fill='#202925')
dr.text((60,477),'Aa Bb Cc  0123456789  £ & +',font=ft(50),fill='#4D5B4B')
dr.text((60,573),'Regular 400   /   Medium 500   /   Bold 700',font=ft(28),fill='#202925')
img.save(TMP/'type-specimen.png')
# Lossless format conversion for Word compatibility; original framing retained.
photo=ROOT/'public/assets/portfolio/extension-daniel-n19/daniel-home-extension-living-and-kitchen.webp'
Image.open(photo).convert('RGB').save(TMP/'n19.jpg', quality=90, optimize=True)
# Palette strip is a colour specification graphic.
im=Image.new('RGB',(1800,310),'white'); draw=ImageDraw.Draw(im)
for i,(name,hexv) in enumerate(list(col.items())[:5]):
    x=i*360; draw.rectangle((x,0,x+359,200),fill='#'+hexv)
    draw.text((x+15,222),name,font=ft(30,'Medium'),fill='#202925')
    draw.text((x+15,265),'#'+hexv,font=ft(24),fill='#202925')
im.save(TMP/'palette.png')

doc=Document(); sec=doc.sections[0]
sec.page_width=Inches(8.5);sec.page_height=Inches(11)
sec.top_margin=Inches(.7);sec.bottom_margin=Inches(.65);sec.left_margin=sec.right_margin=Inches(.75)
sec.header_distance=Inches(.28);sec.footer_distance=Inches(.28)
for name in ['Normal','Title','Subtitle','Heading 1','Heading 2','Heading 3']:
    s=doc.styles[name];s.font.name='Arial';s.font.color.rgb=RGBColor.from_string('000000')
    s.paragraph_format.space_after=Pt(8)
normal=doc.styles['Normal'];normal.font.size=Pt(11);normal.paragraph_format.line_spacing=1.14
for name,size in [('Title',39),('Subtitle',17),('Heading 1',27),('Heading 2',15),('Heading 3',12)]:
    s=doc.styles[name];s.font.size=Pt(size);s.font.bold=name!='Subtitle';s.paragraph_format.space_before=Pt(12);s.paragraph_format.keep_with_next=True
# document style is portable Arial; brand typography itself is shown in exact specimens.
h=sec.header.paragraphs[0];h.text='BETTER HOMES     /     BRAND STRATEGY AND GUIDELINES';h.style='Normal'
for r in h.runs:r.font.size=Pt(8);r.font.color.rgb=RGBColor(0,0,0)
f=sec.footer.paragraphs[0];f.text='SEPTEMBER 2026     •     EXPLORATORY DIRECTION';f.paragraph_format.space_before=Pt(0)
for r in f.runs:r.font.size=Pt(8)
f.add_run(' '*9+'BETTER HOMES     /     ').font.size=Pt(8)
fld=OxmlElement('w:fldSimple');fld.set(qn('w:instr'),'PAGE');f._p.append(fld)

def p(text='',boldlead=None,size=None):
    q=doc.add_paragraph()
    if boldlead and text.startswith(boldlead):q.add_run(boldlead).bold=True;q.add_run(text[len(boldlead):])
    else:q.add_run(text)
    if size:
        for r in q.runs:r.font.size=Pt(size)
    return q

def title(n,name):
    k=p(f'{n:02d}   /   BETTER HOMES');k.paragraph_format.page_break_before=True;k.paragraph_format.space_after=Pt(5)
    for r in k.runs:r.font.size=Pt(9)
    doc.add_heading(name,1)
def sub(name):doc.add_heading(name,2)
def note(t):q=p(t,size=9);q.paragraph_format.space_before=Pt(7);return q
def image(path,width=7):
    q=doc.add_paragraph();q.add_run().add_picture(str(path),width=Inches(width));q.paragraph_format.space_after=Pt(7)
    for d in q._p.xpath('.//wp:docPr'):d.set('descr', 'Better Homes brand specification' if 'specimen' in str(path) or 'palette' in str(path) else 'Better Homes N19 rear extension and whole-home renovation from the existing portfolio')
    return q

def table(headers,rows,widths):
    t=doc.add_table(rows=1,cols=len(headers));t.alignment=WD_TABLE_ALIGNMENT.CENTER;t.autofit=False
    for c,w in zip(t.columns,widths):c.width=Inches(w)
    for i,tx in enumerate(headers):t.rows[0].cells[i].text=tx
    for row in rows:
        cells=t.add_row().cells
        for i,tx in enumerate(row):cells[i].text=str(tx)
    for ri,row in enumerate(t.rows):
        trpr=row._tr.get_or_add_trPr();cs=OxmlElement('w:cantSplit');trpr.append(cs)
        if ri==0:
            rpt=OxmlElement('w:tblHeader');trpr.append(rpt)
        for ci,c in enumerate(row.cells):
            c.width=Inches(widths[ci]);c.vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER
            pr=c._tc.get_or_add_tcPr()
            sh=OxmlElement('w:shd');sh.set(qn('w:fill'),'303A35' if ri==0 else ('F5F5F3' if ri%2==0 else 'FFFFFF'));pr.append(sh)
            borders=OxmlElement('w:tcBorders')
            for edge in ['top','left','bottom','right']:
                el=OxmlElement('w:'+edge);el.set(qn('w:val'),'single');el.set(qn('w:sz'),'4');el.set(qn('w:color'),'D9D9D9');borders.append(el)
            pr.append(borders)
            mar=OxmlElement('w:tcMar')
            for edge in ['top','left','bottom','right']:
                el=OxmlElement('w:'+edge);el.set(qn('w:w'),'100');el.set(qn('w:type'),'dxa');mar.append(el)
            pr.append(mar)
            for q in c.paragraphs:
                q.paragraph_format.space_after=Pt(2);q.paragraph_format.space_before=Pt(2);q.paragraph_format.line_spacing=1.08
                for r in q.runs:r.font.name='Arial';r.font.size=Pt(10);r.font.bold=ri==0;r.font.color.rgb=RGBColor.from_string('FFFFFF' if ri==0 else '202925')
    p().paragraph_format.space_after=Pt(1)
    return t

def link(label,url):
    q=doc.add_paragraph();q.paragraph_format.space_after=Pt(5)
    hyp=OxmlElement('w:hyperlink');hyp.set(qn('r:id'),q.part.relate_to(url,'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink',is_external=True))
    run=OxmlElement('w:r');rp=OxmlElement('w:rPr');co=OxmlElement('w:color');co.set(qn('w:val'),'4D5B4B');rp.append(co);sz=OxmlElement('w:sz');sz.set(qn('w:val'),'19');rp.append(sz);run.append(rp);te=OxmlElement('w:t');te.text=label+'  |  '+url;run.append(te);hyp.append(run);q._p.append(hyp)

p('BRAND STRATEGY  /  VERSION 1.0',size=9)
doc.add_paragraph('Better Homes\nBrand guidelines',style='Title')
doc.add_paragraph('A modern construction company for London homes',style='Subtitle')
p('Build the brand around a beautifully finished home and a well-managed building experience. Use calm, architectural design to make the quality visible, and specific evidence to make the service credible.')
image(TMP/'n19.jpg')
note('Existing Better Homes portfolio image • Rear extension and whole-home renovation in N19 [L5]')
p('Prepared for Better Homes • 7 September 2026',size=10)
p('Scope: positioning, ideal clients, visual identity, typography, colour, language, customer experience, competitor research and website priorities. Recommendations are exploratory; no website changes have been made.',size=10)

title(1,'The brand to build')
p('Better Homes should be the construction company that design-conscious London homeowners trust to manage a substantial renovation with care. The premium is earned through visible workmanship and disciplined delivery, expressed in a warm, contemporary identity.')
sub('Positioning statement')
p('For London homeowners extending, converting or renovating a home they intend to enjoy for years, Better Homes delivers carefully built spaces through clear pricing, reliable project management and close coordination with the right design professionals.')
sub('The promise')
p('A better home. A well-managed build.',boldlead='A better home. A well-managed build.')
p('This is the recommended messaging line, not a guarantee of a disruption-free project. The brand should explain how decisions, costs, progress and aftercare are managed.')
table(['Pillar','What the customer gains','Evidence to show'],[
('Careful delivery','Confidence that the work is being managed','Named project lead, programme, weekly update example'),
('Clear commercial decisions','Understanding of scope and changing costs','Itemised quote, inclusions, exclusions, written variation process'),
('Quality that can be seen','A home finished to a considered standard','Real project details, construction photographs, snagging record'),
('Support after handover','A clear route for questions and defects','Scope-specific workmanship terms and aftercare contact')],[1.45,2.2,3.35])
sub('The boundaries')
p('Lead with extensions, loft conversions and whole-home renovations. Kitchens and bathrooms support these larger projects. Do not present new-build experience or standalone interior design as Better Homes services. Architectural services are delivered by external professionals, not an employed in-house architect.')
note('Basis: owner brief; current site and implementation reviewed on 7 September 2026. Pillars and service practices are recommendations unless already substantiated.')

title(2,'Ideal customer profile')
p('The primary client is a high-income London homeowner who values a modern, well-resolved home and wants professional help managing the work. Interpret “relaxed” as collaborative and comfortable delegating once trust is earned. Calmness is partly a result of a good process, not a qualification to demand from a client.')
table(['Dimension','Primary client','Secondary client'],[
('Project','Extension or loft with wider alterations','Whole-home renovation after purchase or before moving in'),
('Motivation','Stay in a loved area; improve space, light and everyday living','Make an existing property work as a coherent long-term home'),
('Decision style','Thoughtful, quality-aware; values a clear recommendation','Time-constrained; wants coordination and a manageable decision schedule'),
('Main anxieties','Cost drift, delays, disruption and finish quality','Who is accountable, missing scope and decisions made too late'),
('Best reassurance','Comparable local project plus detailed delivery explanation','Named lead, scope breakdown, agreed communication and aftercare')],[1.25,2.85,2.9])
sub('Geographic focus')
p('Core coverage: Central, North and East London; selected South London projects. Suggested campaign clusters are Islington and Highbury, Crouch End and Muswell Hill, Hackney and Stoke Newington, and Wanstead and Leytonstone. These are targeting hypotheses, not assertions of completed work in every area. Prioritise places where access, project economics and actual references support delivery.')
sub('Qualify by project readiness')
p('Ask about postcode, project type, ownership or purchase stage, drawings and approvals, investment range, intended start window and who will make decisions. Confirm whether the budget covers construction alone or also professional fees, VAT, finishes and contingency. Offer a route for clients who do not yet know their budget.')
p('No minimum project value was provided. Set service-specific qualification bands using recent accepted quotes, gross margin, crew capacity and lead conversion before publishing a threshold. Do not replace the current prices with invented premium figures.')
note('These customer profiles are strategic hypotheses derived from the owner brief, not survey or CRM findings. Review against the next 20 qualified enquiries.')

title(3,'Design and build with clarity')
p('Keep the convenience of a coordinated service while making the professional relationships explicit. The current “One team. One contract.” wording may be appropriate for some contractual arrangements, but the supplied operating model alone does not establish that promise. [L1, L2]')
sub('Recommended public wording')
p('“We build extensions, loft conversions and whole-home renovations across London. If you need an architect, we can introduce one we recommend and coordinate closely with them throughout the project.”')
p('“Already have an architect? We can work with your existing team.” Use this second sentence only if Better Homes accepts this route operationally.')
table(['Stage','Better Homes role','Design professional role'],[
('Brief and feasibility','Discuss scope, construction route and initial budget assumptions','Assess design options and professional scope if appointed'),
('Design and approvals','Coordinate buildability, cost input and information needed for construction','Provide agreed drawings and submissions under their appointment'),
('Preconstruction','Develop scope, exclusions, programme and quotation','Resolve design information within their agreed scope'),
('Construction','Manage site delivery, sequencing, updates and changes','Answer design queries and inspect if their appointment includes it'),
('Handover','Snagging, records and agreed workmanship aftercare','Supply relevant professional documents within their appointment')],[1.22,2.86,2.92])
sub('Explain this before a client commits')
p('The proposal should name each appointed party, who pays them, what they deliver and how decisions travel between the client, architect and builder. Confirm responsibility for structural design and specialist surveys too. Do not imply architects, surveyors or engineers are employees.')
p('Until the contractual model is confirmed, use “construction and design coordination” or “design and build with recommended architects”. Avoid “everything in-house”, “our architects” and universal claims of one contract or no handoffs.')
note('This is brand and service communication guidance. The actual appointments govern responsibilities; this document does not define or amend contract terms.')

title(4,'Current website and code audit')
p('The website contains the ingredients of a credible premium brand, but several systems and messages compete. Preserve the useful evidence and tools while simplifying the presentation. Desktop pages were inspected visually; the code review focused on public brand surfaces, not application security or a full technical audit.')
table(['Observed now','Effect on the brand','Recommended change'],[
('Satoshi body; Inter imported on the root element [L3]','Two font sources complicate consistency','Use Satoshi deliberately across public pages; remove redundant loading after route checks'),
('Blue #266BF1, purple #7421FC and violet text #100B47 [L2–L4]','Feels promotional and visually fragmented','Adopt one semantic palette and shared component styles'),
('Heavy heading weights, pills, shadowed floating navigation [L4]','A busy first impression competes with the work','Use medium-weight headings, flatter navigation and quieter controls'),
('Five equal service cards, including kitchens and bathrooms [L1]','Smaller work dilutes the three core offers','Lead with extensions, lofts and whole-home renovation'),
('Project photos and linked reviews already exist [L5, L6]','Strong foundation for trust','Bring two relevant projects and one specific review earlier'),
('Generic Twitter destination; old brand email in config [L2, L7]','Inconsistent identity at contact touchpoints','Validate destinations and standardise public display names and email routes')],[2.15,2.02,2.83])
sub('Correct factual consistency before visual polish')
p('The homepage extension card starts at £50,000 while its FAQ says around £80,000; kitchen and bathroom starting figures also differ. The hero says “10-year guarantee”, but the guarantee component separates 10 years for extensions and lofts, 2 for kitchens and bathrooms, and 1 for decorating. Align each statement with current scope and terms. [L1, L8]')
p('Review “500+ projects”, the exact insurance description and all star ratings against source records. A statement being in the code or on the website is not independent verification.')

title(5,'Direct competitor comparison')
p('The strongest public presences in this reviewed set combine attractive work with useful decision support. The table compares four direct London competitors. “Strongest” is an editorial assessment of visible presentation, project evidence, service clarity and enquiry support; it is not a ranking of revenue, traffic, search share or build quality.')
table(['Competitor and fit','Visible brand and online strengths','Lesson for Better Homes'],[
('Plus Rooms\nplusrooms.co.uk\nExtensions and lofts\nBest overall extension benchmark [S1]','Immersive project imagery; restrained wordmark with red accent; location-labelled portfolio, cost calculator, ideas library and linked social channels.','Build project-led service and location journeys. Show the completed home early and keep cost planning available without letting it dominate the first impression.'),
('We Love Build\nwelovebuild.co.uk\nRenovations, extensions and lofts\nBest premium visual benchmark [S2, S3]','Minimal emblem and navigation; large residential photography; dedicated Method page, local project stories and an active-looking editorial section.','Pair architectural photography with a clear delivery method. Distinguish Better Homes through concrete project-management evidence rather than broad transparency language.'),
('Build Team\nbuildteam.com\nExtensions and lofts\nBest decision-support benchmark [S4]','Light wordmark, oversized type and project imagery; calculator, design packages, case-study downloads, house tours and 3D tours.','Keep the calculators and add credible project walkthroughs. Avoid the intrusive consultation overlay observed during this visit.'),
('Simply Extend\nsimplyextend.co.uk\nHouse and kitchen extensions\nStrong specialist conversion benchmark [S5]','Red graphic identity; service and area content, local case studies, enquiry routes, warranty message and a route for clients with existing plans. Links to sister brand Simply Loft.','Make project routes and client responsibilities easy to understand. Borrow service clarity while using a quieter visual treatment suited to the desired premium audience.')],[1.8,2.6,2.6])
note('Research snapshot: 7 September 2026. Competitor statements are self-published. Social links were observed; follower counts, engagement, paid media and independent review totals were not audited. Sources are linked in the reference section.')

title(6,'What to learn from the best')
sub('Lead with Plus Rooms and We Love Build')
p('Plus Rooms is the clearest reference for presenting an extension portfolio as the centre of the brand. We Love Build is the closest visual reference for the warm, modern renovation company Better Homes wants to become. Neither visual polish nor their stated delivery approach proves commercial performance. [S1–S3]')
sub('Use Build Team for practical reassurance')
p('Build Team provides several ways to understand a project before enquiring, including tours and tools. Better Homes already has calculators, so the next investment should be improving continuity between an estimate, a comparable project and a consultation. More tools are not automatically the priority. [S4; L1]')
sub('An adjacent premium benchmark')
table(['Brand','Why include it','What to borrow and avoid'],[
('Huntsmore\nhuntsmore.com [S6]','Adjacent rather than like-for-like: architecture, interiors and project management for period homes, with tightly defined West London neighbourhoods.','Borrow material-focused photography, a restrained wordmark and precise geographic positioning. Avoid implying Better Homes offers the same professional services. A visible technical warning at the top of its homepage weakened an otherwise polished impression.')],[1.4,2.7,2.9])
sub('The opportunity for Better Homes')
p('“Transparent”, “managed” and “design and build” are common promises across this group. Better Homes can make those promises more tangible by showing the actual weekly update, the process for agreeing changes, named responsibility and scope-specific aftercare. Couple that evidence with equally strong photography.')
sub('Avoid copying category habits')
p('Large images should not hide what you do. Rotating heroes, thin white text over photographs, repeated “leading” claims and layers of pop-ups create friction. Prefer a stable hero, a readable message and one clear next action. These are design recommendations based on the reviewed pages, not conversion-test results.')


title(7,'Explore three visual directions')
p('A substantial change is justified, but the existing Satoshi typeface and geometric identity provide useful continuity. Explore the following routes, then develop the recommended route consistently across the website, proposals and site materials.')
table(['Direction','Visual ingredients','Fit and tradeoff'],[
('Warm architectural\nRecommended','Chalk, deep green-black, olive and a restrained clay accent. Satoshi 400/500/700. Natural daylight and honest material detail.','Balances high-end presentation with an approachable construction business. Needs strong real photography to avoid looking like a generic interiors brand.'),
('London editorial\nAlternative','Off-white, ink and stone; Satoshi with a limited Instrument Serif display accent. Generous space, captions and composed project stories.','More expressive and residential. Serif use should remain occasional so the brand still feels like a capable builder.'),
('Precise modern\nContinuity option','White, charcoal and a reduced deep-blue accent. Satoshi, strong grids and technical project details.','Retains more of the current blue identity. Easier transition, but less distinctive from service and software brands.')],[1.5,2.8,2.7])
sub('Recommended creative principle')
p('Make the home feel inviting and the company feel organised. Use a warm base, crisp alignment and quiet controls; let real spaces and careful construction details supply the character.')
image(TMP/'palette.png')
note('Proposed Warm architectural palette. These are new specifications, not colours sampled from a competitor. Satoshi is already present in the codebase. Instrument Serif is an optional exploration, not part of the recommended core system. [L3; S7, S8]')


title(8,'Colour system')
image(TMP/'palette.png')
table(['Colour','Digital value','Role and suggested share'],[
('Chalk','HEX #F4F1EA\nRGB 244 241 234','Main background; about 60% of non-photographic area'),
('Ink','HEX #202925\nRGB 32 41 37','Body text, wordmark and strong blocks; about 20%'),
('Stone','HEX #D8D2C6\nRGB 216 210 198','Supporting surfaces and quiet dividers; about 10%'),
('Olive','HEX #4D5B4B\nRGB 77 91 75','Primary buttons, selected states and small accents; about 8%'),
('Clay','HEX #A65B43\nRGB 166 91 67','Occasional editorial detail; about 2%, not a second CTA colour')],[1.05,2.1,3.85])
sub('Approved text pairings')
p('Calculated contrast ratios for solid colours: Ink on Chalk '+f"{ratios['Ink/Chalk']:.2f}"+':1; Olive on Chalk '+f"{ratios['Olive/Chalk']:.2f}"+':1; White on Olive '+f"{ratios['White/Olive']:.2f}"+':1; Ink on Stone '+f"{ratios['Ink/Stone']:.2f}"+':1. These meet the 4.5:1 minimum for normal text. [S9]')
p('Stone on Chalk is only '+f"{ratios['Stone/Chalk']:.2f}"+':1: use it decoratively, not for readable text or a control boundary that must be distinguishable. Clay on Chalk is '+f"{ratios['Clay/Chalk']:.2f}"+':1, below the normal-text minimum. Use Clay decoratively or for large text only; verify any changed pairing.')
p('Use white only where it improves function, such as input fields and reversed button labels. Add a clear focus outline and a written error message; colour alone must not carry meaning. Avoid gradients, metallic effects and gold as a shortcut for luxury.')
note('Print: HEX and RGB are the source specifications. Ask the printer to convert using the actual paper and press profile and approve a physical proof. No unverified CMYK or Pantone match is prescribed.')

title(9,'Typography')
image(TMP/'type-specimen.png')
p('Retain Satoshi as the core typeface. It already fits a modern, approachable company; the improvement is its use. Replace routine 900-weight display text with 500-weight headings and a calmer hierarchy. Reserve 700 for short emphasis and controls. [L3, L4; S7]')
table(['Role','Desktop / mobile','Weight and line height'],[
('Hero heading','64 / 40 px','500; 1.05–1.10; tracking about −0.02em'),
('Section heading','40 / 30 px','500; 1.15'),
('Card heading','24 / 22 px','500 or 700; 1.25'),
('Body and lead','18 / 17 px','400; 1.55–1.65'),
('Navigation and buttons','16 / 16 px','500 or 700; 1.25–1.4'),
('Captions and labels','14 / 14 px','400 or 500; 1.45')],[1.8,2.1,3.1])
p('Use sentence case for headings and buttons. Limit all caps to short eyebrow labels with modest letter spacing. Keep body lines around 55–75 characters. Avoid justified text, excessive bold and headings split across many short lines.')
note('Web stack: Satoshi, Arial, sans-serif. Use local WOFF2 assets with documented licence provenance and only the weights needed. Satoshi files are present but the retained licence receipt was not audited. This editable report uses Arial for portability; the image above shows the actual Satoshi fonts. Install licensed Satoshi for brand-native Word templates. [S7]')


title(10,'Logo photography and composition')
sub('Wordmark and mark')
p('Use the full public name Better Homes, in title case. Make a simple wordmark the primary identifier, with the existing geometric mark considered for refinement rather than discarded automatically. Its line-based form can support an architectural identity; test recognition and clarity at small sizes before commissioning a redraw.')
p('Recommended lockups: horizontal wordmark for the website and proposals; stacked Better / Homes where width is constrained; symbol-only only for established contexts such as the favicon. The descriptor “Extensions and renovations in London” is optional and should sit separately from the primary wordmark.')
p('Provisional rules for the next artwork stage: clear space at least one capital B height; full lockup at least 140 px digitally or 30 mm in print; symbol at least 24 px, with a simplified 16 px favicon tested separately. Supply Ink, Olive and reversed White versions. Do not stretch, outline the type, add shadows or place it on a busy photograph.')
sub('Photography')
p('Use completed Better Homes projects, with permission and accurate location and service labels. Prioritise daylight, room proportions, material junctions and a clear connection between old and new. Include a wide view, a human-scale view and construction details for every featured project.')
p('The N19 photograph is a useful existing asset: it shows structure, daylight and an inhabited family space. A future shoot can reduce incidental clutter through staging with the owner, while preserving the room and workmanship honestly. Do not present stock or AI-generated interiors as completed Better Homes work.')
sub('Layout and supporting graphics')
p('Start with a 12-column desktop grid, four mobile columns and an 8 px spacing unit. Use 24–32 px gutters, a 1200–1280 px content maximum, 80–112 px desktop section spacing and 48–64 px on mobile. Treat these as design defaults, then adapt to real content.')
p('Use rectangular project imagery, minimal borders, 4–8 px corner radii on controls and little or no shadow. Use consistent line icons only when they help explain a service. Keep decorative house outlines, repeated badge strips and animated accents out of the main reading path.')
note('These are production rules for a future identity rollout, not a delivered final logo suite. Final artwork needs optical adjustment, small-size testing and export in SVG and print-ready PDF.')


title(11,'Voice and copy')
p('Sound composed, clear and human. Describe the work and the process in specific terms. Use British English: programme, organise, colour, enquiry. “We” is Better Homes; “you” is the homeowner. Avoid jargon until the decision requires it.')
table(['Current habit','Recommended expression'],[
('“Without the usual builder chaos”','“A clear plan, regular updates and a named lead for your build.”'),
('“Do not fret. We got you covered!”','“Know what happens next.”'),
('“Real reviews with specifics, not vague praise”','“What our clients say.”'),
('“Industry leading” or “more value than 95%”','Describe the actual scope, process and cover; remove unsubstantiated comparisons.'),
('“No surprises”','“We explain the scope and agree changes before the related work proceeds.”'),
('Generic urgency or “limited availability”','Show an accurate, maintained start window only when there is operational evidence.')],[3.0,4.0])
sub('Homepage draft')
p('Eyebrow: Extensions, loft conversions and renovations in London',boldlead='Eyebrow:')
p('Headline: A better home. A well-managed build.',boldlead='Headline:')
p('Supporting copy: Better Homes builds extensions, loft conversions and whole-home renovations with clear pricing and careful project management. We work closely with recommended architects where design support is needed.',boldlead='Supporting copy:')
p('Primary action: Discuss your project. Secondary action: Explore our work.',boldlead='Primary action:')
sub('Short company description')
p('Better Homes is a London construction company specialising in extensions, loft conversions and whole-home renovations. We bring clear pricing, reliable project management and careful workmanship to the building process, coordinating with recommended architects when clients need design support.')
note('Draft copy should be checked against actual operating practices before publication. Existing phrases above come from local source files [L1, L2, L6, L8], not a claim that all appear in every live route.')


title(12,'The website experience')
p('Make the route from aspiration to confidence shorter. The first screen should explain the service, show the quality and provide one useful next step. Keep the existing calculators and source-linked reviews, but organise them around the three core project types.')
table(['Step','Homepage content','Purpose'],[
('1','Simple navigation, concise hero and one strong real project photograph','Communicate what Better Homes does and how it feels'),
('2','One compact, source-linked review statement','Give credible reassurance without a wall of badges'),
('3','Two or three selected projects across the core services','Demonstrate relevant experience before more claims'),
('4','Extensions, loft conversions, whole-home renovations','Help the visitor find the right project route'),
('5','How we work and how architects are involved','Make delivery responsibilities understandable'),
('6','Cost planning with assumptions and calculator links','Answer investment questions honestly'),
('7','Client experience, guarantee detail and focused FAQs','Resolve remaining objections'),
('8','Discuss your project and concise service-area information','Turn confidence into a suitable enquiry')],[.5,3.6,2.9])
sub('Navigation and enquiry')
p('Recommended main navigation: Our work, Services, How we work, Cost planning, About, Contact. Put client sign-in in a utility position and label it “Client portal” if that accurately describes the route. Keep journal content accessible without crowding the main navigation.')
p('Use one short project enquiry: name, preferred contact details, postcode, service, project stage, investment range including “not sure yet”, and a short brief. Explain what the first conversation covers. Ask for drawings later or through an optional secure upload. Do not promise an instant fixed quote.')
sub('Service and location pages')
p('Each service page needs relevant completed work, typical scope, exclusions, architect route, cost assumptions, process, proof and next step. Support location pages with real local experience; do not imply every named neighbourhood has a completed project. Avoid inventing a loft case study to fill a portfolio gap.')


title(13,'Proof and customer experience')
p('The clearest way to make the positioning distinctive is to show how the work is managed. Package the following as customer-facing evidence, with client permission and confidential details removed.')
table(['Touchpoint','Recommended standard','Evidence or qualification'],[
('First conversation','Discuss fit, scope, budget assumptions and next step','A consistent discovery checklist; no invented response-time promise'),
('Proposal','Set out inclusions, exclusions, allowances and named responsibilities','A real anonymised example; explain the architect appointment'),
('Weekly update','Work completed, next steps, decisions needed, risks and cost changes','A sample with owner and due date for each action'),
('Changes','Written scope, price and programme impact before related work','A variation example reflecting the actual contract process'),
('Handover','Snagging record, documents and a clear aftercare contact','Scope-specific workmanship cover and relevant product warranties'),
('Reviews','Use accurate wording, source link and permission where required','Verify source, date, rating and review count before publishing')],[1.25,2.75,3.0])
sub('Strengthen the portfolio')
p('For each featured project record the brief, location at a suitable privacy level, service, size where verified, scope, design credits, constraints, solution, completed outcome and the source of any testimonial. Add a budget band and duration only when records and client permission support them.')
p('The local portfolio data already contains useful project structure and photographs, but its anonymous quotation for the N19 project has no review-source link in that record. Verify it or replace it with factual narrative before repeating it as a client quote. [L5]')
sub('Guarantees and trust')
p('Preserve the distinction between a workmanship guarantee, manufacturer warranty and insurance. The current site lists different workmanship periods by service. Create one maintained source for those terms and link to it from every claim. Publish award names and years only with supporting records. [L8]')


title(14,'Brand applications and channels')
sub('Proposals and customer documents')
p('Use a restrained cover, one relevant real project image, clear scope headings and readable pricing tables. Show the project address privately within the client document, the named lead, version and date. Use the same vocabulary for stages in the quote, programme, weekly update and handover pack.')
sub('Site boards workwear and vehicles')
p('Make Better Homes readable at distance: Ink or Olive background with a reversed wordmark, a short service description and bhstudio.co.uk. Keep QR codes secondary to the written address. Use one main message, durable materials and clear contact details. Any branding on safety equipment must preserve its protective and visibility function.')
sub('Digital presence')
p('Keep bhstudio.co.uk for continuity while standardising display names to Better Homes. Existing social handles may retain “studio” temporarily; use a consistent bio, avatar and website link. Do not change domains or create duplicate review profiles simply to match the shorter name.')
p('Recommended social bio: “Extensions, loft conversions and whole-home renovations in London. Clear pricing. Careful project management. Explore our work.” Confirm service coverage and link to the appropriate enquiry route.')
sub('Content with a purpose')
p('Begin with two useful posts a week if capacity allows: one completed project or detail, and one explanation of the process. Build a monthly project story for the website and reuse it in a short video, Instagram carousel and client email. Do not publish fabricated progress, stock work or generic advice solely to meet a quota.')
p('Prioritise Google Business Profile accuracy and source-backed reviews, project-led Instagram and Houzz presentation, and practical website articles tied to the three core services. Treat LinkedIn as a secondary route for architect and professional relationships. Channel priorities are recommendations, not measured attribution findings.')
sub('Asset governance')
p('Keep one approved folder for logos, colour specifications, fonts and licence records, photography rights, copy, review sources and document templates. Assign an owner for claims and a quarterly brand check. Retain the legal entity disclosure separately from the public Better Homes name.')


title(15,'Implementation priorities')
p('Sequence the work so that accuracy and evidence support the visual change. The schedule below is a suggested rollout, subject to capacity and access to project records.')
table(['When','Action and accountable role','Definition of done'],[
('Days 1–14','Owner and commercial lead: confirm service focus, architect arrangements, price assumptions and cover','One approved claim register; contradictory prices and blanket claims identified for correction'),
('Days 1–21','Owner and photographer: choose core projects and collect rights, facts and review links','Two or three complete, relevant case studies; a real loft project only if documented'),
('Weeks 3–5','Designer: develop Warm architectural identity and responsive templates','Wordmark suite, colour and type tokens, homepage, service page and case-study designs'),
('Weeks 5–8','Developer and content lead: apply templates and centralise shared content','Consistent navigation, public typography, palette, claims and enquiry copy'),
('Weeks 8–12','Owner and marketing lead: update profiles and customer materials','Matching display names, working links, proposal and weekly-update templates'),
('Monthly','Owner: assess enquiry quality and delivery evidence','Review project fit, consultation attendance, proposal conversion and reasons lost')],[1.0,3.2,2.8])
sub('Measure the intended outcome')
p('Use qualified enquiries as the main signal. Define a qualified enquiry as a project that fits service, location, investment and delivery capacity. Track the proportion of enquiries that qualify, consultation-to-proposal and proposal-to-contract conversion, and average accepted project value. Establish a baseline before setting targets.')
p('Also review client feedback about communication and handover. A quieter visual identity is successful when it supports better-fit enquiries and a consistent client experience, not merely because it looks more expensive.')
sub('Decisions still to make before rollout')
p('Confirm minimum project values by service; architect appointment model; insurance and guarantee wording; which project facts and images can be published; whether the refined existing mark or a new wordmark is selected. These decisions do not prevent use of this document as an exploratory brand foundation.')


title(16,'Codebase handoff')
p('No application files were changed for this document. The following implementation map turns the brand recommendations into a concrete future brief. The inspected working tree contained existing unrelated edits; those were left intact.')
table(['Location','Recommended change'],[
('app/globals.css\napp/layout.js\ntailwind.config.js','Make the public font stack deliberate. Replace legacy raw colours with semantic tokens. Review actual uses before removing Inter or changing shared styles.'),
('config.js\napp/page.js','Align hero copy, metadata, main colour and service hierarchy. Reconcile all price and proof statements with approved source data.'),
('components/hero/Hero.js\ncomponents/hero/Hero.module.css','Reduce heavy headline styling, simplify proof pills and use shared button variants. Avoid forced line breaks and oversized navigation gaps.'),
('components/navigation/Navigation.js\ncomponents/footer/Footer.js','Simplify the main menu, clarify the portal route, validate social and contact destinations, and standardise public naming.'),
('libs/portfolio-projects.js\ncomponents/homepage/\nHomepageTestimonialStrip.js','Require factual project fields, source-linked quotes and design credits. Surface core project types first.'),
('components/Guarantee.js\nlibs/pageFaqs.js\nlibs/structuredData.js','Keep guarantees, FAQs and structured data consistent with visible approved statements. Review schema when service or brand copy changes.')],[3.0,4.0])
sub('Proposed public design tokens')
p('Background #F4F1EA  •  Surface #FFFFFF  •  Text #202925\nAction #4D5B4B  •  Subtle surface #D8D2C6  •  Accent #A65B43',size=10)
p('Use separate semantic error and focus tokens with verified contrast. Scope the initial rollout to public pages, then check the client portal before applying global changes. Preserve useful URLs and link relationships when changing navigation.')
sub('Release checks')
p('Visually check homepage, service, portfolio, cost tools, contact and guarantee pages on desktop and mobile. Verify keyboard navigation, visible focus, text resizing, readable contrast, font loading and form feedback. Check that booking and review links open the intended destination. Do not claim improved conversion until measured.')


title(17,'Sources and research notes')
p('Reviewed on 7 September 2026. Owner answers determine the service and audience brief. Live desktop inspection establishes visual observations. Local source inspection establishes implementation findings. Recommendations and rankings are the author’s assessment; public claims have not been independently certified.')
sub('Competitors and standards')
for a,b in [
('[S1] Plus Rooms homepage and portfolio navigation','https://plusrooms.co.uk/'),
('[S2] We Love Build homepage and project navigation','https://welovebuild.co.uk/'),
('[S3] We Love Build method','https://welovebuild.co.uk/method/'),
('[S4] Build Team homepage and resources','https://www.buildteam.com/'),
('[S5] Simply Extend homepage and specialist routes','https://www.simplyextend.co.uk/'),
('[S6] Huntsmore homepage and service positioning','https://huntsmore.com/'),
('[S7] Fontshare Satoshi official font page','https://www.fontshare.com/fonts/satoshi'),
('[S8] Google Fonts Instrument Serif optional exploration','https://fonts.google.com/specimen/Instrument+Serif'),
('[S9] W3C text contrast guidance','https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html'),
('[W1] Better Homes current public website','https://bhstudio.co.uk/')]:link(a,b)
sub('Local evidence register')
p('All paths below are relative to /Users/gino_s/Documents/bhs-2.',size=9)
for tx in [
'[L1] app/page.js — service cards, homepage structure and hero proof points.',
'[L2] config.js — public name, hero copy, theme colour and contact configuration.',
'[L3] app/layout.js; app/globals.css — Inter loading, Satoshi files and legacy colour variables.',
'[L4] components/hero/Hero.js; components/hero/Hero.module.css; components/navigation/Navigation.module.css — visual implementation.',
'[L5] libs/portfolio-projects.js; public/assets/portfolio/extension-daniel-n19/ — project data and photograph used in this document.',
'[L6] components/homepage/HomepageTestimonialStrip.js — review presentation and links.',
'[L7] components/footer/Footer.js — brand description, social links and legal disclosure.',
'[L8] components/Guarantee.js; app/our-guarantee/page.js; libs/pageFaqs.js — cover periods, older pricing claims and FAQs.'
]:p(tx,size=9)

props=doc.core_properties;props.title='Better Homes Brand Guidelines';props.subject='Brand strategy and visual identity recommendations';props.author='Prepared for Better Homes';props.keywords='Better Homes, London, construction, brand, extensions, loft conversions, renovations';props.comments='Exploratory brand direction based on owner brief, public website research and local source review.'
# Remove inherited title rules and decorative formatting from the base document.
for st in doc.styles:
    for el in list(st.element.iter(qn('w:pBdr'))):el.getparent().remove(el)
    if st.type == 1:
        st.paragraph_format.left_indent=Inches(0)
        st.paragraph_format.first_line_indent=Inches(0)
for q in doc.paragraphs:
    for el in list(q._p.iter(qn('w:pBdr'))):el.getparent().remove(el)
doc.styles['Subtitle'].font.italic=False
doc.styles['Title'].paragraph_format.line_spacing=1.02
doc.save(OUT/'Better-Homes-Brand-Guidelines.docx')
print(json.dumps({'docx':str(OUT/'Better-Homes-Brand-Guidelines.docx'),'contrast':ratios},indent=2))
