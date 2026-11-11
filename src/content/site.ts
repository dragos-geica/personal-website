// ─────────────────────────────────────────────────────────────────────────────
//  SITE CONTENT: edit this file to change the words and photos on the website.
//  See CONTENT_GUIDE.md (in the project folder) for step-by-step instructions.
//
//  Rules of thumb
//  • Text goes between quotes: 'like this'. To use an apostrophe inside, write \'
//    (for example 'Dragos\'s notes') or use the curly ’ instead.
//  • Every item and list entry ends with a comma.
//  • Photos go in the  public/images/  folder. Refer to them as '/images/file-name.jpg'.
//  • Run  npm run check  after editing: it points at the exact line if something is off.
// ─────────────────────────────────────────────────────────────────────────────

import type { SiteContent } from './types.ts';

const linkedIn = { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dragosgeica/' };

export const site: SiteContent = {
  // Shown at the top of the home page.
  name: 'Dragoș Geică',
  tagline: 'My world, connected.',
  intro: 'I study economics, French, and data science at Wesleyan University. This is a map of the research I do, the projects I build, and the things I’m curious about.',

  // The photo in the centre of the graph. Clicking it opens the About page.
  portrait: { src: '/images/portrait.jpg', alt: 'Portrait of Dragoș Geică' },

  // Simple pages. Each paragraph is its own entry in the list.
  pages: {
    about: {
      title: 'About',
      paragraphs: [
        'I’m Dragoș-Andrei Geică, a Wesleyan University student from Romania studying economics and French and pursuing a certificate in data science.',
        'I work with Professor David Kuenzel on how U.S. trade remedies affect imports, and I like building tools and projects that make data easier to use.',
        'In Romania, I partnered with Alacrity Education to lead AirBox Bootcamp, where students built air-quality monitors and contributed readings to a public dataset. At Wesleyan, I also work in classroom technology and help organize programs for international students.',
        'I spent spring 2026 in Paris, where I studied monetary economics and took drawing and painting classes in French.',
      ],
      links: [linkedIn],
    },
    research: {
      title: 'Research',
      paragraphs: [
        'My current research focuses on U.S. antidumping duties, countervailing duties, and safeguards. I work with Professor David Kuenzel to understand when imports begin to change during a trade investigation and how those patterns vary by measure.',
        'Building the dataset is a large part of the work: it means linking case records to decades of detailed import data, accounting for changes in product codes, and fitting models with high-dimensional fixed effects.',
        'I’ve also worked on research in vocational education policy and analyzed the relationship between income volatility and self-reported health for a Wesleyan course.',
      ],
    },

    // The CV page: sections in order, each with entries. Every field except `title` is optional.
    cv: {
      title: 'CV',
      name: 'Dragoș-Andrei Geică',
      sections: [
        {
          heading: 'Education',
          entries: [
            {
              title: 'B.A. candidate, Economics and French; Certificate in Data Science',
              org: 'Wesleyan University, Middletown, CT',
              dates: '2024–2028 (expected)',
              points: [
                'Full-ride scholarship.',
                'Selected coursework: econometrics, statistical consulting, machine learning, high-performance computing, knowledge graphs, applied data analysis, microeconomic theory.',
              ],
            },
            {
              title: 'Vassar-Wesleyan Program in Paris',
              org: 'Paris, France',
              dates: 'January–May 2026',
              points: [
                'Upper-level Monetary Economics, Banking, and Finance, taught in French at Université Paris Cité.',
                'French grammar, theater, and studio art, including drawing and painting at the Académie de la Grande Chaumière.',
              ],
            },
            {
              title: 'Oxford for Romania Summer School',
              org: 'Oxford, United Kingdom',
              dates: 'August–September 2022',
              points: ['Selected for a multidisciplinary program of seminars, workshops, and mentorship for 24 Romanian students.'],
            },
          ],
        },
        {
          heading: 'Research experience',
          entries: [
            {
              title: 'Economics Research Assistant to Professor David Kuenzel',
              org: 'Wesleyan University, Economics and Quantitative Analysis Center',
              dates: 'June 2026–present',
              points: [
                'Study how U.S. imports change before and after antidumping, countervailing-duty, and safeguard actions; began with the QAC summer apprenticeship.',
                'Linked trade-remedy cases to quarterly U.S. import records from 1990 to 2024 and estimated PPML models with high-dimensional fixed effects on 54.6 million observations in Stata and R.',
                'Presented the poster “The Trade Effects of US Temporary Trade Barriers: When Do They Start and How Long Do They Last?” in July 2026.',
              ],
              href: '/graph/experience/temporary-trade-barriers/',
            },
            {
              title: 'Research Intern',
              org: 'Romanian Center for European Policies',
              dates: 'Fall 2025',
              points: ['Compared vocational education and professional certification across five EU countries for a policy brief prepared for Romania’s Ministry of Education.'],
              href: '/graph/experience/vocational-education-policy/',
            },
          ],
        },
        {
          heading: 'Work experience',
          entries: [
            {
              title: 'Student General Manager',
              org: 'Instructional Media Services, Wesleyan University',
              dates: 'September 2025–present',
              href: '/graph/experience/instructional-media-services/',
              points: [
                'Oversee operations for a team of 30 student employees, coordinate weekly meetings, and support hiring.',
                'Replaced manual spreadsheet tracking with a survey-based classroom technology audit.',
              ],
            },
            {
              title: 'Student Technician',
              org: 'Instructional Media Services, Wesleyan University',
              dates: 'September 2024–September 2025',
              points: ['Supported classroom projectors, touchscreens, AMX controls, Macs and PCs, and set up AV for events, recordings, and Zoom conferences.'],
            },
            {
              title: 'Consultant, then Manager',
              org: 'Wesleyan Undergraduate Consulting Group',
              href: '/graph/experience/undergraduate-consulting/',
              dates: 'September 2025–present',
              points: ['For a career-center engagement project, surveyed 30+ international students, analyzed Handshake engagement data for 650+ students, identified four barriers, and briefed Career Center leadership on recommendations.'],
            },
            {
              title: 'Educational Consultant',
              org: 'Julia Boca Academy',
              dates: 'June 2024–March 2025',
              points: ['Gave free weekly one-on-one support to high-achieving, low-income scholars applying to U.S. colleges: college lists, essays, interviews, financial aid, and scholarships.'],
            },
            {
              title: 'Digital SAT English Tutor',
              org: 'Julia Boca Academy, Bucharest',
              dates: 'April–August 2024',
              points: ['Tutored 12 Romanian students with personalized English practice materials, curriculum presentations, and study strategies.'],
            },
            {
              title: 'Intern',
              org: 'Romanian Ministry of Research, Innovation and Digitalization, Bucharest',
              dates: 'July–September 2023',
              points: ['Helped develop and test the online application platform for the Henri Coandă National Research Scholarship, with weekly testing and debugging before the application cycle.'],
            },
          ],
        },
        {
          heading: 'Leadership and community',
          entries: [
            {
              title: 'Project lead, AirBox Bootcamp',
              org: 'With Alacrity Education, Romania',
              dates: '2026',
              points: ['Secured a $10,000 Projects for Peace grant and led a free STEAM bootcamp where students built and deployed air-quality monitors.'],
              href: '/projects/airbox-bootcamp/',
            },
            {
              title: 'Co-chair, International Student Advisory Board',
              org: 'Wesleyan University',
              href: '/graph/experience/international-students/',
              dates: 'September 2024–present',
              points: [
                'Led a team of 10 on the second edition of a 49-page international student handbook, designed in Figma, supporting a cohort of 95 incoming international students.',
                'Student pairing, recruitment, and collaboration with the Gordon Career Center, including an international alumni career panel in November 2026.',
              ],
            },
            {
              title: 'Co-moderator, Eastern European LGBTQ+ advocacy panel',
              org: 'Wesleyan University',
              dates: 'December 2025',
              points: ['Co-moderated a discussion with Hungarian and Romanian activists, organized by the Adelphic Educational Fund, for 20+ students and faculty.'],
            },
            {
              title: 'Founder and volunteer coordinator, Opportunup',
              org: 'Romania',
              dates: '2023–24',
              points: ['Built a platform helping young people find free programs, civic opportunities, and fully funded scholarships, and coordinated a nationwide volunteer team.'],
              href: '/projects/opportunup/',
            },
            {
              title: 'Member, National Children’s Board',
              org: 'UNICEF Romania',
              href: '/graph/experience/unicef-romania/',
              dates: 'January 2021–April 2024',
              points: [
                'Represented youth perspectives on children’s rights; served on Bucharest’s Child Friendly Cities Initiative committee in 2022–23.',
                'Contributed youth input to national children’s rights strategy discussions and spoke in TV interviews on volunteering, education, and children’s rights.',
              ],
            },
            {
              title: 'Media literacy trainer',
              org: 'Center for Independent Journalism, with UNICEF Romania',
              dates: 'January–May 2023',
              points: ['Trained 50+ young people aged 15–18 and worked with 20 teachers on fact-checking and misinformation; spoke at the “Fake or News?” media education conference.'],
            },
            {
              title: 'Youth jury member, Principal of the Year Awards',
              org: 'AVE România',
              dates: 'September 2023',
              points: ['Interviewed candidates and helped select national finalists from 72 regional finalists.'],
            },
          ],
        },
        {
          heading: 'Selected projects',
          entries: [
            { title: 'High-Performance Computing for Stata', dates: 'Fall 2026', href: '/projects/hpc-for-stata/' },
            { title: 'Neo4j trade knowledge graph', dates: 'Fall 2026', href: '/projects/neo4j-demo/' },
            { title: 'Income Volatility and Self-Reported Health', dates: 'Fall 2025', href: '/projects/income-volatility-health/' },
            { title: 'Sephora Product Review Analysis', dates: 'Spring 2025', href: '/projects/sephora-reviews/' },
            { title: 'Global Economic Indicators Analysis', dates: '2025', href: '/projects/global-economic-indicators/' },
          ],
        },
        {
          heading: 'Honors and certifications',
          entries: [
            { title: 'Projects for Peace grantee', org: 'Middlebury College', dates: '2026', points: ['$10,000 for AirBox Bootcamp.'] },
            { title: 'Third place nationally, Romanian Debate Olympiad', dates: 'May 2024' },
            { title: 'Julia Boca Academy Scholar', dates: 'August 2023–March 2024', points: ['One of two scholars selected for a fully funded U.S. college application advising program.'] },
            { title: 'Social and Behavioral Responsible Conduct of Research', org: 'CITI Program', dates: 'September 2026' },
          ],
        },
        {
          heading: 'Languages and tools',
          entries: [
            { title: 'Languages', points: ['Romanian (native), English (full professional proficiency), French (professional working proficiency).'] },
            { title: 'Tools', points: ['Stata, R, Python (pandas, NumPy, Matplotlib, seaborn), Excel and VBA, Neo4j, Linux, Bash and Slurm, Figma.'] },
          ],
        },
      ],
    },
  },

  // The three circles around the portrait. Their positions are fixed by the design;
  // here you change their names, the small word on their line, and their items.
  //
  // Each item becomes a circle when its category is opened (up to six per category),
  // and a page of its own. An item can have:
  //   title     (required) the name on the circle and the page heading. Keep it short.
  //   subtitle  optional line under the heading, e.g. 'Research assistant · 2026–present'
  //   summary   (required) the first paragraph on the page
  //   image     optional photo: { src: '/images/….jpg', alt: 'what the photo shows' }
  //   facts     optional figures shown as small cards: { value: '120+', label: 'Registrants' }
  //   sections  optional extra paragraphs with headings: { title: '…', text: '…' }
  //   links     optional links: { label: 'GitHub', href: 'https://…' }
  //   tags      optional data, tools and methods: ['Stata', 'R']. Tags on projects become
  //             filters on the Projects page, and every tag links to the projects that use it.
  //   inGraph   false keeps the item off the home graph (it still has a page and is listed)
  //   draft     true hides the page from search engines and marks it as in progress
  categories: {
    experience: {
      label: 'Experience',
      verb: 'works_in',
      items: [
        {
          title: 'Temporary Trade Barriers',
          subtitle: 'Research assistant to Professor David Kuenzel · Wesleyan Economics and QAC · 2026–present',
          summary: 'I study how U.S. imports change before and after antidumping, countervailing-duty, and safeguard actions. For my summer poster, I linked trade-remedy cases to 35 years of import records and estimated models on 54.6 million observations.',
          tags: ['Research', 'Stata', 'R', 'PPML', 'Census import data', 'Concordances'],
          facts: [
            { value: '35 years', label: 'Quarterly U.S. imports, 1990–2024' },
            { value: '54.6M', label: 'Observations in the poster regression' },
            { value: '3', label: 'Remedies: antidumping, countervailing duties, safeguards' },
          ],
          sections: [
            { title: 'The data', text: 'The project uses quarterly U.S. Census import data built from monthly files compiled by Peter Schott, linked at the exporter × product × quarter level to the World Bank’s Temporary Trade Barriers Database. To follow products across changes in the tariff code system, I use HTS10 codes grouped into Pierce–Schott concordance families.' },
            { title: 'My part', text: 'Working with Professor David Kuenzel, I built binary and count measures for the three remedies across four stages: the year before an investigation, the formal investigation, preliminary duties, and final duties. I estimated Poisson pseudo-maximum likelihood (PPML) models with exporter–product, exporter–quarter, and product–quarter fixed effects in Stata and R, and plotted the value-weighted share of imports covered by these measures, including by exporter.' },
            { title: 'What the summer poster found', text: 'In that specification, final duties were associated with 26.5% lower import values overall: 44.5% lower for countervailing duties and 27.0% lower for antidumping duties. The safeguard estimate was small and not statistically significant. I presented the poster, “The Trade Effects of US Temporary Trade Barriers: When Do They Start and How Long Do They Last?”, in July 2026.' },
            { title: 'Ongoing work', text: 'The project continues this academic year. Current work includes aggregating to HS6 products, constructing import unit values (value divided by reported quantity), and linking historical regular U.S. tariff rates to the import panel: a 1990 pilot using WITS/TRAINS data, crosswalks for trading partners, and documenting when each country’s tariff treatment changed.' },
          ],
          links: [{ label: 'Research update on LinkedIn', href: 'https://www.linkedin.com/feed/update/urn:li:activity:7502850491702304768/' }],
        },
        {
          title: 'Vocational Education Policy',
          subtitle: 'Research intern · Romanian Center for European Policies · Fall 2025',
          summary: 'I compared vocational education and professional competency certification across five EU countries, focusing on graduate employability and the move into the labor market.',
          tags: ['Research', 'Excel', 'Policy analysis'],
          facts: [
            { value: '5', label: 'EU countries compared' },
            { value: '10', label: 'Cross-country datasets synthesized' },
          ],
          sections: [
            { title: 'The work', text: 'Using Excel, I synthesized ten cross-country datasets alongside prior research for a policy brief prepared for Romania’s Ministry of Education.' },
          ],
        },
        {
          title: 'Instructional Media Services',
          subtitle: 'Student General Manager · Wesleyan University · 2024–present',
          summary: 'I started as a student technician in 2024, keeping Wesleyan’s classroom technology running, and since September 2025 I’ve managed the team of 30 student employees.',
          tags: ['Team management', 'Classroom technology', 'Survey design'],
          facts: [{ value: '30', label: 'Student employees' }],
          sections: [
            { title: 'As technician', text: 'I supported classroom projectors, touchscreens, AMX controls, Macs and PCs, and set up AV for events, recordings, and Zoom conferences.' },
            { title: 'As general manager', text: 'I oversee operations, coordinate weekly meetings, and support hiring. I replaced manual spreadsheet tracking with a survey-based audit of classroom technology.' },
          ],
        },
        {
          title: 'Undergraduate Consulting',
          subtitle: 'Consultant, then Manager · Wesleyan Undergraduate Consulting Group · 2025–present',
          summary: 'For a career-center engagement project, our team looked at why international students weren’t making more use of career support, and what could change that.',
          tags: ['Survey design', 'Engagement data', 'Consulting'],
          facts: [
            { value: '30+', label: 'International students surveyed' },
            { value: '650+', label: 'Students’ Handshake engagement analyzed' },
          ],
          sections: [
            { title: 'What we found', text: 'We identified four barriers, developed recommendations for career support and engagement, and briefed Career Center leadership.' },
          ],
        },
        {
          title: 'International Students',
          subtitle: 'Co-chair, International Student Advisory Board · Wesleyan · 2024–present',
          summary: 'I co-chair the board that helps international students settle in at Wesleyan, from the handbook they read before arriving to events once they’re here.',
          tags: ['Leadership', 'Figma', 'Event planning'],
          facts: [
            { value: '49', label: 'Pages in the handbook’s second edition' },
            { value: '95', label: 'Incoming international students supported' },
          ],
          sections: [
            { title: 'The handbook', text: 'I led a team of 10 on the second edition of the international student handbook, which I designed in Figma.' },
            { title: 'Beyond the handbook', text: 'Our work includes pairing new and current students, recruitment, and working with the Gordon Career Center, including an international alumni career panel on job searches and international career paths in November 2026.' },
          ],
        },
        {
          title: 'UNICEF Romania',
          subtitle: 'National Children’s Board · 2021–2024',
          summary: 'For three years I represented youth perspectives on children’s rights as a member of UNICEF Romania’s National Children’s Board.',
          tags: ['Advocacy', 'Public speaking', 'Media literacy'],
          sections: [
            { title: 'Policy', text: 'I served on Bucharest’s Child Friendly Cities Initiative committee in 2022–23 and contributed youth input to national discussions on children’s rights strategy.' },
            { title: 'Media literacy', text: 'In a program run by the Center for Independent Journalism and supported by UNICEF Romania, I trained 50+ young people aged 15–18 and worked with 20 teachers on fact-checking and misinformation, and spoke at the “Fake or News?” media education conference in May 2023.' },
            { title: 'Speaking', text: 'I also spoke in TV interviews about volunteering, education, and children’s rights.' },
          ],
          links: [{ label: 'Center for Independent Journalism', href: 'https://www.cji.ro/' }],
        },
      ],
    },
    projects: {
      label: 'Projects',
      verb: 'works_on',
      items: [
        {
          title: 'AirBox Bootcamp',
          subtitle: 'Project lead and Projects for Peace grantee · with Alacrity Education · 2026',
          summary: 'I partnered with Alacrity Education to run a free Romanian STEAM bootcamp where students built and deployed air-quality monitors. A $10,000 Projects for Peace grant supported the program, and the students’ readings contributed to a public air-quality dataset.',
          tags: ['Air-quality sensors', 'Environmental data'],
          facts: [
            { value: '$10,000', label: 'Projects for Peace grant' },
            { value: '120+', label: 'Registrants' },
            { value: '60', label: 'Online-phase completers' },
            { value: '12', label: 'In-person finalists' },
          ],
          sections: [
            { title: 'Why', text: 'The goal was to widen access to hands-on science and engineering and help young people collect and understand data about the air where they live. The grant project’s full title is “AirBox Bootcamp: Peace through Environmental Justice and Data Democracy.” The idea grew out of a youth-led climate advocacy training I took part in in April 2024, which got me thinking about pairing practical climate education with community data collection.' },
            { title: 'My role', text: 'I secured the grant through Projects for Peace, hosted by Middlebury College, with Wesleyan as the nominating institution. I worked with Alacrity Education on the budget, partnerships, outreach, participant selection, and running the program. Alacrity Education designed the original AirBox device.' },
            { title: 'The program', text: 'The online phase ran from June 22 to July 12 and covered programming, electronics, physics, chemistry, and science communication. The twelve finalists then spent July 24–31 in Bucharest soldering, 3D printing, assembling, testing, and deploying their monitors. Participation was free, and a recorded welcome message from Nobel laureate Kip Thorne opened the program.' },
            { title: 'Result', text: 'The students deployed their monitors, and their readings now feed a public air-quality database.' },
          ],
          links: [
            { label: 'Middlebury 2026 Projects for Peace cohort', href: 'https://www.middlebury.edu/projects-for-peace/summer-grants/2026-grantee-cohort' },
            { label: 'Launch post on LinkedIn', href: 'https://www.linkedin.com/posts/dragosgeica_im-excited-to-share-that-i-was-awarded-a-activity-7476004066859417600-zipq' },
            { label: 'Alacrity Education', href: 'https://alacrity.education/en' },
          ],
        },
        {
          title: 'Opportunup',
          subtitle: 'Founder and volunteer coordinator · Romania · 2023–24',
          summary: 'I built a platform that helped young people in Romania discover free programs, civic and volunteer opportunities, and fully funded scholarships.',
          facts: [
            { value: '100+', label: 'Civic opportunities promoted' },
            { value: '$110,000+', label: 'In scholarship opportunities promoted' },
            { value: '20,000+', label: 'People reached' },
          ],
          sections: [
            { title: 'How it worked', text: 'I coordinated a nationwide team of volunteers, ran biweekly meetings, and over time shifted the initiative toward a community-based model, where members shared opportunities with each other. Posts ranged from scholarships to local volunteering, such as supporting children with disabilities in Iași and Bucharest.' },
          ],
          links: [{ label: 'Opportunup on LinkedIn', href: 'https://www.linkedin.com/company/opportunup/' }],
        },
        {
          title: 'HPC for Stata',
          subtitle: 'High-performance computing · Wesleyan · Fall 2026',
          summary: 'I benchmarked large Stata PPML regressions on Wesleyan’s computing cluster to see how CPU counts, node allocation, and parallel execution affected runtime, and I updated a faculty guide to running Stata on the cluster.',
          tags: ['Stata', 'PPML', 'Linux', 'Bash', 'Slurm', 'Benchmarking'],
          sections: [
            { title: 'What I did', text: 'In a two-month course covering Linux, Bash, and Slurm, I compared serial and parallel configurations using job logs and measured runtimes.' },
            { title: 'What I learned', text: 'Allocating more computing resources did not reliably shorten a run. Measuring before scaling up turned out to matter more than asking for more cores.' },
          ],
          links: [{ label: 'Benchmark post on LinkedIn', href: 'https://www.linkedin.com/feed/update/urn:li:activity:7526015913842810881/' }],
        },
        {
          title: 'Neo4j Demo',
          subtitle: 'U.S. trade knowledge graph · Fall 2026',
          summary: 'I built an exploratory graph database of U.S. import data, to see what trade looks like when you explore it through relationships rather than tables.',
          tags: ['Neo4j', 'Graph databases', 'Census import data'],
          sections: [
            { title: 'Design', text: 'My first design represented exporter countries, detailed products, quarters, and trade-remedy stages as nodes. The working prototype is simpler: countries and broad industries (HS2 chapters) are nodes, linked by exports, with import value stored on each relationship. The simpler model also fit the relationship limits of the available Neo4j plan.' },
            { title: 'An example question', text: 'One query the prototype answers directly: what are China’s total U.S. import values by HS2 industry?' },
          ],
        },
        {
          title: 'Income Volatility & Health',
          subtitle: 'Course research project · QAC 201 · Fall 2025',
          summary: 'Using the U.S. National Financial Well-Being Survey, I explored how income volatility, self-reported health, and living arrangements are related among non-retired respondents.',
          tags: ['Research', 'Stata', 'Logistic regression', 'Figma'],
          facts: [{ value: '6,394', label: 'Survey observations' }],
          sections: [
            { title: 'Method', text: 'I cleaned and recoded the data in Stata, used chi-square tests and multivariable logistic regression, and designed the poster in Figma.' },
            { title: 'What I found', text: 'High income volatility was more common among respondents reporting poor health. In a separate model of living arrangements, moderate volatility was associated with higher odds of living with someone, while high volatility showed no association. These are associations, not causal effects.' },
          ],
          links: [{ label: 'Poster and abstract', href: 'https://adatapostersfall2025.research.wesleyan.edu/2025/11/25/the-association-between-income-volatility-and-perceived-levels-of-health-among-non-retired-individuals-living-alone-and-living-with-someone-else/' }],
        },
        {
          title: 'Sephora Reviews',
          subtitle: 'Data analysis · Wesleyan · Spring 2025',
          summary: 'I analyzed 5,000+ Sephora product reviews to explore how ratings vary with brand, product category, and price.',
          tags: ['Python', 'pandas', 'NumPy', 'seaborn', 'Matplotlib'],
          facts: [{ value: '5,000+', label: 'Product reviews analyzed' }],
          sections: [
            { title: 'Method', text: 'I used Python with pandas and NumPy for the analysis, and seaborn and Matplotlib to visualize the comparisons, including by reported skin tone and skin type where reviewers gave them. The result was a report with tables and graphics describing patterns in the ratings.' },
          ],
        },
        {
          title: 'Global Economic Indicators',
          subtitle: 'Excel and VBA analysis · Wesleyan · 2025',
          summary: 'I used Excel and VBA to explore 2014–2023 data from 150+ countries, comparing macroeconomic, governance, and social indicators.',
          tags: ['Excel', 'VBA'],
          facts: [{ value: '150+', label: 'Countries, 2014–2023' }],
          sections: [
            { title: 'Method', text: 'I built charts and correlation analyses on topics such as trade flows and governance. In the course dataset, imports and exports moved closely together, as did government effectiveness and political stability.' },
          ],
          inGraph: false,
        },
        {
          title: 'Data Visualizations',
          subtitle: 'A gallery in progress',
          summary: 'A collection of figures from my work, from runtime benchmarks to trade-remedy coverage charts. The images will be added here as I prepare them for the web.',
          tags: ['Stata', 'R', 'Python', 'Figma'],
          sections: [
            { title: 'Coming here', text: 'The Stata runtime comparison from my high-performance computing project, the income-volatility poster, charts of the share of U.S. imports covered by trade remedies, and figures from my Sephora review and economic indicators analyses.' },
          ],
          links: [
            { label: 'Income volatility poster', href: 'https://adatapostersfall2025.research.wesleyan.edu/2025/11/25/the-association-between-income-volatility-and-perceived-levels-of-health-among-non-retired-individuals-living-alone-and-living-with-someone-else/' },
            { label: 'Stata runtime comparison on LinkedIn', href: 'https://www.linkedin.com/feed/update/urn:li:activity:7526015913842810881/' },
          ],
          inGraph: false,
          draft: true,
        },
        {
          title: 'EcoCrafting',
          subtitle: 'Outreach with Alacrity Education · Planned for November 14–December 20, 2026',
          summary: 'A free workshop series planned in Bucharest for students aged 14–19, who will turn plant ash into ceramic glazes, experiment in a lab, decorate clay pieces, and show their work in a public exhibition. I’m helping with outreach to schools.',
          links: [{ label: 'Alacrity Education', href: 'https://alacrity.education/en' }],
          inGraph: false,
          draft: true,
        },
      ],
    },
    interests: {
      label: 'Other Interests',
      verb: 'curious_about',
      items: [
        {
          title: 'Debate',
          summary: 'I placed third nationally at the Romanian Debate Olympiad in May 2024.',
        },
        {
          title: 'Studio Art',
          summary: 'In Paris I took drawing and painting classes at the Académie de la Grande Chaumière, a very different way of learning from economics and data.',
        },
        {
          title: 'Alphabet Systems',
          summary: 'I’m curious about writing systems and linguistics: how alphabets work and how they differ. More here soon.',
          draft: true,
        },
        {
          title: 'Retro Game Emulation',
          summary: 'I like getting old video games running again through emulation. More here soon.',
          draft: true,
        },
      ],
    },
  },
};
