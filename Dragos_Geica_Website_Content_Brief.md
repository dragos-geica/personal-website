# Dragoș-Andrei Geică — Personal website content brief

Prepared November 11, 2026. This Markdown file is a content source and implementation prompt for Claude. It combines the LinkedIn profile and visible post archive, résumé versions, Wesleyan and Middlebury sources, project materials, and prior work with Dragoș.

## Prompt to give Claude

Use this brief to populate my Astro personal website. Read `CONTENT_GUIDE.md`, `src/content/site.ts`, and `src/content/types.ts` first. Update the home copy, About, Research, CV, and graph item content in `src/content/site.ts`. Keep the current site design and interactions. The eight graph categories are `academics`, `research`, `projects`, `data-tools`, `music`, `reading`, `travel`, and `interests`. Put my experience in the CV and distribute the most interesting stories across the existing graph branches. Preserve existing item titles and URLs where practical, especially AirBox Bootcamp, EcoCrafting, Neo4j Demo, and Data Visualizations. Use the content and source notes below to decide what can go live. Entries marked **Verify** require my input or a public source. Entries marked **Planned** can be omitted from evergreen pages or explicitly dated as plans. Keep editorial notes and source labels out of the public copy.

Write the About and project pages in a direct, natural first person. Give each item a short title and a one- or two-sentence summary, then add sections, a small number of meaningful facts, and public links where relevant. Mention collaborators and distinguish my contribution from the team’s work. Keep the home graph selective and put the fuller chronology on the CV. Use the existing portrait and only add other images when the actual assets exist and I can use them. Use the existing `draft: true` convention for items awaiting content. Keep unverified dates and metrics out of the rendered website. Run `npm test` and `npm run check` after the content changes.

## Ready-to-use copy

**Display name** — Dragoș Geică for the home graph, or Dragoș-Andrei Geică for the CV and full bio. “Dragos Geica” is the ASCII form used in some Wesleyan records and the current site.

**Tagline** — My world, connected.

**Home intro** — I study economics, French, and data science at Wesleyan University. This is a map of the research I do, the projects I build, and the things I’m curious about.

**About** — I’m Dragoș-Andrei Geică, a Wesleyan University student from Romania studying economics and French and pursuing a certificate in data science. I work with Professor David Kuenzel on how U.S. trade remedies affect imports, and I like building tools and projects that make data easier to use. In Romania, I partnered with Alacrity Education to lead AirBox Bootcamp, where students built air-quality monitors and contributed readings to a public dataset. At Wesleyan, I also work in classroom technology and help organize programs for international students. I spent spring 2026 in Paris, where I studied monetary economics and took drawing and painting classes in French.

**Research landing page** — My current research focuses on U.S. antidumping duties, countervailing duties, and safeguards. I work with Professor David Kuenzel to understand when imports begin to change during a trade investigation and how those patterns vary by measure. Building the dataset is a large part of the work: it means linking case records to decades of detailed import data, accounting for changes in product codes, and fitting models with high-dimensional fixed effects. I’ve also worked on research in vocational education policy and analyzed the relationship between income volatility and self-reported health for a Wesleyan course.

**Public contact** — [LinkedIn](https://www.linkedin.com/in/dragosgeica/). The profile publicly lists the Wesleyan email `dgeica@wesleyan.edu`. Use it only if a public contact field is wanted. A downloadable CV would need a web-ready PDF with personal phone and mailing details removed.

## Research and analytical projects

### U.S. Temporary Trade Barriers | Wesleyan Economics and QAC

**Role and dates.** Economics Research Assistant with Professor David Kuenzel, June 2026–present as of the brief. Began with the June–July 2026 Quantitative Analysis Center summer apprenticeship and continued in the 2026–27 academic year.

**Suggested item summary.** I study how U.S. imports change before and after antidumping, countervailing-duty, and safeguard actions. For my summer poster, I linked trade-remedy cases to 35 years of import records and estimated models on 54.6 million observations.

- **Data.** Quarterly U.S. Census imports, 1990Q1–2024Q4, using monthly files compiled by Peter Schott. Linked exporter × product × quarter observations to the World Bank Temporary Trade Barriers Database. The summer poster uses HTS10 source codes and Pierce–Schott concordance families to follow products across coding changes.
- **Contribution.** Built binary and count measures for three remedies across four stages: the four-quarter pre-investigation window, formal investigation, preliminary duties, and final duties. Worked in Stata and R. Estimated Poisson pseudo-maximum likelihood (PPML) with exporter–product, exporter–quarter, and product–quarter fixed effects. Produced descriptive plots of the value-weighted share of imports covered by the measures, including views by exporter.
- **Poster findings.** The July 2026 poster reports final duties associated with 26.5% lower import values overall, 44.5% lower for countervailing duties, and 27.0% lower for antidumping. Its safeguard estimate was small and statistically insignificant. The 54,646,489 observations are for the poster regression. Treat these as estimates from that specification and use the poster for the public numbers.
- **Ongoing work.** Workstreams discussed include HS6 aggregation, using value and quantity to construct import unit values, and incorporating regular tariff rates. Keep ongoing analysis labeled as such. Possible technical material for a methods page includes explicit zero-trade observations, concordances, EU membership coding, and comparing Stata `ppmlhdfe` with R `fixest::fepois`. Describe unit values as value divided by reported quantity.
- **Artifact.** Summer poster, *The Trade Effects of US Temporary Trade Barriers: When Do They Start and How Long Do They Last?* Presented July 24, 2026. Add a public PDF only if a shareable copy is available. [LinkedIn research continuation post](https://www.linkedin.com/feed/update/urn:li:activity:7502850491702304768/).

### Regular U.S. tariffs and historical data coverage | Ongoing RA work

Investigated how historical U.S. tariff schedules can be linked to the import panel. Work has included a 1990 WITS/TRAINS pilot, partner expansion and crosswalks, comparing U.S. Column 2 country treatment with the tariff data’s N21 grouping, and documenting date intervals for changes in tariff treatment. A reusable data-engineering detail is to put the reference year in generated output filenames so work can expand across years. Use a short methods section on the trade project or a Data & Tools note. Working tables and meeting notes are internal source material. Do not describe the full 1990–2023/24 tariff panel as complete.

### High-Performance Computing for Stata | Wesleyan, fall 2026

**Suggested item summary.** I benchmarked large Stata PPML regressions on Wesleyan’s computing cluster to see how CPU counts, node allocation, and parallel execution affected runtime. I also updated a faculty guide to running Stata on the cluster.

- Two-month course covering Linux, Bash, and Slurm. Compared serial and parallel configurations using job logs and measured runtimes. One practical finding was that allocating more computing resources did not reliably shorten a run.
- The LinkedIn post includes a runtime comparison graphic. ChatGPT helped turn the measured results into a comparison table. If using the graphic, retrieve the approved original `stata_runtime_comparison.png` or link to the post. Keep exact runtimes and speedup figures tied to the original benchmark.
- Related skills: shell scripting, cluster job submission, computational benchmarking, interpreting logs, and technical documentation. [LinkedIn benchmark post](https://www.linkedin.com/feed/update/urn:li:activity:7526015913842810881/).

### Income Volatility and Self-Reported Health | QAC 201, fall 2025

Analyzed 6,394 observations from the U.S. National Financial Well-Being Survey to explore how income volatility, self-reported health, and living arrangements are related among non-retired respondents. Cleaned and recoded data in Stata, used chi-square tests and multivariable logistic regression, and presented the results in a poster designed in Figma.

The public abstract reports that high income volatility was more common among respondents reporting poor health. In a separate model of living arrangements, moderate volatility was associated with higher odds of living with someone, while high volatility showed no association. Describe these as associations in a course research project. [Wesleyan QAC 201 poster and abstract](https://adatapostersfall2025.research.wesleyan.edu/2025/11/25/the-association-between-income-volatility-and-perceived-levels-of-health-among-non-retired-individuals-living-alone-and-living-with-someone-else/).

### Romanian Center for European Policies | Research intern, fall 2025

Compared vocational education and professional competency certification across five EU countries, with a focus on graduate employability and labor-market transitions. Used Excel and synthesized ten cross-country datasets alongside prior research for a policy brief prepared for Romania’s Ministry of Education. Good fit for CV and Research. Exact end month differs between LinkedIn and résumé. **Verify** before using a month-level date or publishing the underlying report.

### Neo4j Demo | U.S. trade knowledge graph, fall 2026

Built an exploratory graph using U.S. import data. The initial design represented exporter countries, detailed products, quarters, and trade-remedy stages. A simpler working prototype uses country and broad industry (HS2) nodes linked by exports, with import value stored on relationships. The simpler design fit the relationship limits of the available Neo4j plan. China’s import-value totals by HS2 provide a concrete example query. The prototype can illustrate how trade data looks when explored through relationships. **Verify** the current state of value-based node sizing and whether a public demo, screenshot, or query notebook is available.

### Sephora Product Review Analysis | Wesleyan, spring 2025

Analyzed 5,000+ product reviews to explore patterns between ratings and brand, product category, and price. Used Python, pandas and NumPy for analysis, plus seaborn and Matplotlib to visualize comparisons, including reported skin tone and skin type where available. Produced a report with tables and graphics. Avoid causal language. [Colab notebook linked from LinkedIn](https://colab.research.google.com/drive/14sMF4l6LSnk9PotrFig9pIZXsmPqeLmE?usp=sharing). Check the notebook’s anonymous access before linking publicly.

### Global Economic Indicators Analysis | Wesleyan, early 2025

Used Excel and VBA to explore 2014–2023 data from 150+ countries, comparing macroeconomic, governance, and social indicators. Built charts and correlation analyses covering topics such as trade flows and the relationship between government effectiveness and political stability. In the course dataset, reported examples included correlations around 0.9 between imports and exports and 0.8 between government effectiveness and political stability. The report can be summarized without coefficients if the underlying workbook is unavailable.

### Data Visualizations | Existing graph node

Use this as a gallery for actual work: the Stata runtime comparison, the income-volatility poster, selected trade-remedy coverage charts, and one or two figures from the Sephora or macroeconomic projects. Link back to the corresponding item or source. Publish images when source files are available, with alt text describing the comparison each figure makes. The only existing photo in the site’s public images folder is the portrait.

## Projects and community work

### AirBox Bootcamp | Project lead and Projects for Peace grantee, 2026

**Suggested item summary.** I partnered with Alacrity Education to run a free Romanian STEAM bootcamp where students built and deployed air-quality monitors. A $10,000 Projects for Peace grant supported the program, and the students’ readings contributed to a public air-quality dataset.

- **Purpose.** Expand access to hands-on science and engineering and help young people collect and understand local environmental data. The official grant project title is *AirBox Bootcamp: Peace through Environmental Justice and Data Democracy*.
- **Role.** Secured the grant through the Projects for Peace program hosted by Middlebury College, with Wesleyan University as nominating institution. Worked with Alacrity Education on budget, partnerships, outreach, participant selection, and program delivery. Credit Alacrity Education with designing the original AirBox device.
- **Program.** 120+ applications or registrations, 60 online-phase completers, and 12 in-person finalists. The online phase ran June 22–July 12 and covered programming, electronics, physics, chemistry, and science communication. The in-person phase ran July 24–31 in Bucharest and included soldering, 3D printing, assembly, testing, and deployment. The program covered participation costs. Prior project notes mention four scholarships and travel reimbursement. Confirm what the scholarship count refers to before using it.
- **Result.** Students deployed monitors and the project launched a public database. A recorded welcome message from Nobel laureate Kip Thorne opened the program. Keep that description specific to the video. LinkedIn also lists an Antena 3 interview about AirBox/Alacrity. **Verify** the final public video URL and who appeared before featuring the interview.
- **Links.** [Middlebury 2026 grantee cohort](https://www.middlebury.edu/projects-for-peace/summer-grants/2026-grantee-cohort) · [AirBox launch post](https://www.linkedin.com/posts/dragosgeica_im-excited-to-share-that-i-was-awarded-a-activity-7476004066859417600-zipq) · [Alacrity Education](https://alacrity.education/en). The project-record URL for the public database is `https://airbox.bootcamp.ro/`. Availability could not be confirmed during research. Verify before adding it as a live link.

### Opportunup | Founder and volunteer coordinator, 2023–24

Built a platform helping young people in Romania discover free programs, civic and volunteer opportunities, and fully funded scholarships. Coordinated a nationwide volunteer team, facilitated biweekly meetings, and shifted the initiative toward a community-based model. One older LinkedIn post promoted a volunteering opportunity in Iași and Bucharest supporting children with disabilities.

- 100+ civic opportunities promoted, $110,000+ in scholarship opportunities promoted, and 20,000+ people reached. LinkedIn lists 28 volunteers, about 500,000 impressions, and 1,600+ community members. A résumé rounds the volunteer team to 30 and reports 1,500+ followers. Describe reach, impressions, and community size as separate metrics. Use “promoted $110,000+ in scholarship opportunities” unless direct awards to participants can be documented.
- LinkedIn and the résumé disagree about exact start and end months. Use 2023–24 on the public site. [Opportunup on LinkedIn](https://www.linkedin.com/company/opportunup/) · [Example opportunity post](https://www.linkedin.com/feed/update/urn:li:ugcPost:7085552246461014016/).

### EcoCrafting | Alacrity Education outreach, November 2026

**Planned as of November 11.** Helped with school outreach for a free workshop series in Bucharest for ages 14–19, scheduled November 14–December 20, 2026. The planned program teaches students to turn plant ash into ceramic glazes, experiment in a lab, decorate clay pieces, and show their work in a public exhibition. Describe Dragoș’s contribution as outreach and promotion. **Verify** outcomes, final dates, and a direct public program link before converting the existing draft page into a completed project. [Alacrity Education](https://alacrity.education/en).

### UNICEF Romania | National Children’s Board, January 2021–April 2024

Represented youth perspectives on children’s rights as a member of UNICEF Romania’s National Children’s Board. Participated in Bucharest’s Child Friendly Cities Initiative committee in 2022–23 and contributed youth input to national children’s rights strategy discussions. Spoke in TV interviews on volunteering, education, and children’s rights. LinkedIn reports a combined audience of 2 million+; use that figure only with attribution or corroboration. **Verify** the official strategy title and dates before naming it. The 30-member board figure comes from prior conversations.

### Media literacy and “Fake or News?” | Center for Independent Journalism, January–May 2023

Trained 50+ young people aged 15–18 and worked with 20 teachers in a program coordinated by Romania’s Center for Independent Journalism (CJI) and supported by UNICEF Romania. Covered fact-checking, misleading content, and misinformation, and helped teachers prepare classroom materials. Spoke at the “Fake or News?” media education conference in May 2023. This training also appears in the UNICEF entry. Count the participants once if the two roles are displayed together. [Center for Independent Journalism](https://www.cji.ro/).

### Principal of the Year Awards | AVE România, September 2023

Served on the jury for AVE România’s Principal of the Year Awards, representing a youth perspective. Interviewed candidates and helped select national finalists from a pool of 72 regional finalists. If using LinkedIn’s €147,887 figure, label it as total grants associated with the awards program and verify the amount with AVE. [AVE’s LinkedIn announcement](https://www.linkedin.com/feed/update/urn:li:ugcPost:7105941146022871040/).

### Youth-led climate advocacy training | April 2024

Participated as a Romanian youth representative in Youth-Led Advocacy for Climate Change training led by Fabio Friscia. The training helped shape the idea of pairing practical climate education with community-based data collection, later implemented through AirBox Bootcamp. Good as part of the AirBox story. **Verify** the organizer, location, and formal program title before creating a separate item. [AirBox launch post](https://www.linkedin.com/posts/dragosgeica_im-excited-to-share-that-i-was-awarded-a-activity-7476004066859417600-zipq).

## Work and campus leadership

| Activity | Dates and public-ready scope |
| --- | --- |
| Wesleyan Instructional Media Services — Student General Manager | September 2025–present per LinkedIn. Oversees operations for 30 student employees, coordinates weekly meetings, and supports hiring and operations. Replaced manual spreadsheet tracking with a survey-based classroom technology audit. LinkedIn reports a 50% reduction in audit time, 25% improvement in audit accuracy, and zero faculty complaints about student staff performance in fall 2025 and spring 2026. Attribute metrics to internal tracking or use only the process and team size. |
| Wesleyan Instructional Media Services — Student Technician | September 2024–September 2025 per LinkedIn. Provided classroom support for projectors, touchscreens, AMX controls, Macs and PCs, and handled AV setups for events, recordings, and Zoom conferences. |
| International Student Advisory Board (ISAB) — Co-chair | September 2024–present per résumé. Led a team of 10 on the second edition of a 49-page international student handbook, designed it in Figma, and helped support a cohort of 95 incoming international students. Other work includes student pairing, recruitment, and collaboration with the Gordon Career Center. |
| International Alumni Career Panel | November 5, 2026. Helped organize a Gordon Career Center and ISAB panel about job searches and international career paths. The event materials describe four invited alumni from Hungary, Greece, Poland, and Nigeria. A résumé describes a panel with five alumni and 40+ attendees. Confirm whether the records refer to the same event before using counts. |
| International Student Orientation | Listed on Wesleyan’s Office of International Student Affairs student staff page. Can describe as supporting incoming international students. **Verify** appointment title and semester or year. [Wesleyan OISA staff page](https://www.wesleyan.edu/oisa/student-leadership-opportunities/iso-orientation-student-staff.html). |
| Wesleyan Undergraduate Consulting Group (WUCG) | Consultant from September 2025 per résumé and manager by fall 2026 per LinkedIn and prior work. For a career-center engagement project, surveyed 30+ international students and analyzed Handshake engagement data for 650+ students. Identified four barriers, developed recommendations for career support and engagement, and briefed Career Center leadership. Use summary figures only. |
| Consulting Pathways Club | Board member, listed on LinkedIn under Wesleyan. **Verify** dates and responsibilities before adding detailed copy. |
| Wesleyan International Speakers Program (WISP) | Listed on LinkedIn and by Wesleyan OISA. Use as an affiliation until role, activities, and dates are confirmed. |
| Wesleyan Investment Group | Appears in an older résumé discussion. **Verify** role, dates, and level of involvement before publishing. |
| Eastern European LGBTQ advocacy panel | Co-moderated a December 4, 2025 discussion with Cecilia Földessy-Stiegemeier at Wesleyan, featuring Hella Zsirka, Iulian Dițiu, and Alina Dumitriu. The Adelphic Educational Fund organized the event, which drew 20+ students and faculty. Good as a campus leadership or speaking item. The linked article is press coverage by Akari Ikeda. [The Wesleyan Argus](https://wesleyanargus.com/2025/12/05/hungarian-and-romanian-lgbtqia-activists-bring-cross-cultural-conversations-to-campus/). |
| Campus residential health coverage | The Wesleyan Argus quoted Dragoș in February 2025 about the return of paper towels to residence halls. Optional “In the press” mention. **Verify** the full account before assigning a campaign title, role, or policy outcome. [The Wesleyan Argus](https://wesleyanargus.com/2025/02/14/paper-towels-return-to-residences-amid-norovirus-spike/). |
| Immigration/F-1 town hall | **Planned.** ISAB planning and speaker outreach for a December 2026 campus event. Wait for the public announcement or completed event before adding an event page. Leave private scheduling, correspondence, and individual consultation arrangements out of public copy. |
| Julia Boca Academy — Educational Consultant | June 2024–March 2025. Provided free weekly one-on-one support to high-achieving, low-income scholars applying to U.S. colleges, including college lists, essays, interviews, financial aid, and scholarship applications. |
| Julia Boca Academy — Digital SAT English Tutor | April–August 2024, Bucharest. Tutored 12 Romanian students using personalized English practice materials, curriculum presentations, and study strategies. If mentioning the reported 1300s–1500s scores, describe them as students’ overall scores and avoid implying a measured tutoring effect. |
| Julia Boca Academy — Scholar | August 2023–March 2024. Selected as one of two scholars for a fully funded U.S. college application advising program. LinkedIn values the package at $5,000 and describes support for applications to 20 colleges. Use the value only if needed. |
| Romanian Ministry of Research, Innovation and Digitalization — Intern | July–September 2023, Bucharest. Helped develop and test an online application platform for the Henri Coandă National Research Scholarship, with weekly testing and debugging before the application cycle. LinkedIn gives the program value as $440,000. Verify amount and currency against the official program before including them. |

## Education, honors, interests, and travel

- **Wesleyan University, 2024–2028 expected.** B.A. candidate, Economics and French, with a Certificate in Data Science. Full-ride scholarship. Selected coursework includes econometrics, statistical consulting, machine learning, high-performance computing, knowledge graphs, applied data analysis, and microeconomic theory. GPA varies by source and date. Use a current transcript or omit the number. [Wesleyan OISA profile](https://www.wesleyan.edu/oisa/student-leadership-opportunities/iso-orientation-student-staff.html).
- **Vassar-Wesleyan Program in Paris, spring 2026.** Studied abroad January–May. Took an upper-level Monetary Economics, Banking, and Finance course in French at Université Paris Cité, with lecture and discussion sections. Also studied French grammar and took theater and studio art. LinkedIn lists drawing and painting at the Académie de la Grande Chaumière. Describe Paris Cité as study-abroad coursework. A short travel entry could connect Paris to learning economics in French and trying a different kind of classroom in the studio.
- **Oxford for Romania Summer School, August–September 2022.** Selected for a multidisciplinary program in Oxford for 24 Romanian students, featuring seminars, workshops, and mentorship. It is an Oxford for Romania program. Verify before using LinkedIn’s reported 5% acceptance rate or describing the University of Oxford’s role.
- **Romanian Debate Olympiad, May 2024.** Third nationally, described in prior notes as an individual speaker ranking. Add as an honor and as a detail on a debate interest page. Prior résumé discussion mentions coaching approximately 40 students annually. **Verify** the exact award category, coaching organization, and time period before using the coaching metric.
- **2026 Projects for Peace grantee.** $10,000 for AirBox Bootcamp. Link back to the project and official Middlebury cohort listing.
- **CITI Program.** Social and Behavioral Responsible Conduct of Research, issued September 2026, listed as expiring September 2029. Credential ID is unnecessary for the public page.
- **Brattle sophomore program.** Previously attended per prior conversations. **Verify** program name, year, and format before adding it to the CV. Describe it as program participation.
- **Languages.** Romanian (native), English (fluent or full professional proficiency), French (professional working proficiency). LinkedIn shows four entries but only English and French were visible in the profile summary. **Verify** the remaining profile entries before naming a fourth language or adding a formal proficiency level.
- **Other interests.** Alphabet systems and linguistics, retro video game emulation, debate, and painting/drawing. The first three appear on the résumé. Build from these specific interests and add firsthand examples when Dragoș supplies them.
- **Music.** Wesleyan’s orientation bio names “Hot” by INNA as a favorite summer song. This is enough for a small personal detail or one item. Confirm other artists or playlists before adding them. [Wesleyan OISA profile](https://www.wesleyan.edu/oisa/student-leadership-opportunities/iso-orientation-student-staff.html).
- **Reading.** A research reading list could use references from the public-facing trade poster, such as Pierce and Schott on concording product codes, Besedeš and Prusa on antidumping, and Bown on safeguards. Label the list as research references. Leave personal favorites as draft until Dragoș provides titles.
- **Geography.** Romania and Bucharest anchor the community work, Middletown anchors Wesleyan, Paris anchors study abroad, and Oxford anchors the summer school. Use dates and relevant experiences in place of an exhaustive travel list.

## Suggested graph map

| Existing branch | Good initial items | Additional material |
| --- | --- | --- |
| Academics | Wesleyan University, Study Abroad in Paris | Coursework, Oxford for Romania, research ethics training |
| Research | U.S. Temporary Trade Barriers, Income Volatility and Health | Vocational Education Policy, historical tariffs as a subsection |
| Projects | AirBox Bootcamp, Opportunup, Neo4j Demo, Data Visualizations | EcoCrafting as a dated draft, Sephora, Global Economic Indicators |
| Data & Tools | High-Performance Computing for Stata, Trade Data and Concordances | Python, R and Stata workflows, Excel and VBA, Figma visualization |
| Music Taste | INNA as a single confirmed detail | Add approved playlists and current favorites later |
| Reading | Research References | Keep personal reading in draft pending titles |
| Travel | Paris, Bucharest, Oxford | Optional Middletown entry about Wesleyan life |
| Other Interests | Debate, Alphabet Systems, Retro Game Emulation, Studio Art | A campus leadership or community work item if space allows |

For the CV, lead with Wesleyan and study abroad, then research and professional experience, leadership and community work, selected projects, and honors. Use the long inventory for coverage and bring the flagship stories to the front: trade research, AirBox, HPC, and Opportunup.

## Source and publication notes

- **LinkedIn.** [Profile](https://www.linkedin.com/in/dragosgeica/) and [activity archive](https://www.linkedin.com/in/dragosgeica/recent-activity/all/) were reviewed directly. Profile sections supplied role titles, dates, projects, awards, and education. Posts supplied the research continuation, HPC work, AirBox origin story, AVE jury reference, and an Opportunup example. Metrics from a profile are self-reported unless a separate source is cited.
- **Résumé and poster.** November 2026 `dgeica_resume_2.pdf`, September 2026 `ALL Resume_DragosGeica-3.pdf`, and the July 2026 QAC summer poster `dgeica_poster.pdf` supplemented LinkedIn. In case of conflict, this brief uses the LinkedIn technician/manager split for IMS, broader dates for the Romanian Center for European Policies and Opportunup, and the poster’s reported regression for public research numbers.
- **Prior work.** Conversations and project notes supplied fall 2026 RA workstreams, ISAB event planning, EcoCrafting outreach, AirBox program details, and the Neo4j prototype. Keep work in progress distinct from completed deliverables and confirm names, dates, credits, or links where flagged.
- **Media to source.** AirBox deployment photos and a press clip, the HPC comparison graphic, Neo4j screenshots, an approved CV PDF, and a shareable summer poster. Use photos of participants only when approved for this website. Preserve caption credits. Public references in this brief can remain as external links where useful.
