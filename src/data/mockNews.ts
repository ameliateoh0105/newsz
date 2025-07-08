import { Article, NewsSource } from '../types/news';

export const newsSources: NewsSource[] = [
  {
    id: 'wsj',
    name: 'Wall Street Journal',
    description: 'Business and financial news',
    url: 'https://wsj.com',
    category: 'business'
  },
  {
    id: 'bloomberg',
    name: 'Bloomberg',
    description: 'Financial and business news',
    url: 'https://bloomberg.com',
    category: 'business'
  },
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    description: 'Technology startup news',
    url: 'https://techcrunch.com',
    category: 'technology'
  },
  {
    id: 'reuters',
    name: 'Reuters',
    description: 'Global news and business',
    url: 'https://reuters.com',
    category: 'politics'
  }
];

export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Federal Reserve Signals Potential Rate Cuts Amid Economic Uncertainty',
    summary: 'The Federal Reserve indicated it may consider lowering interest rates in response to slowing economic growth and persistent inflation concerns. Chair Powell emphasized the need for careful monitoring of economic indicators.',
    content: `The Federal Reserve signaled a potential shift in monetary policy during its latest meeting, suggesting that interest rate cuts may be on the horizon as economic indicators point to slowing growth. Federal Reserve Chair Jerome Powell emphasized the central bank's commitment to achieving price stability while supporting maximum employment.

    Economic data from the past quarter shows mixed signals, with unemployment remaining historically low but GDP growth decelerating. Inflation has shown signs of cooling, though it remains above the Fed's 2% target. The central bank's decision-making process will heavily depend on upcoming employment reports and consumer price index data.

    Market analysts predict that any rate adjustments would be gradual and data-dependent. The Fed's dual mandate requires balancing employment objectives with price stability, making timing crucial for any policy changes. Financial markets have already begun pricing in potential rate cuts, with bond yields reflecting increased volatility.

    The implications for consumers could be significant, potentially affecting mortgage rates, credit card interest, and savings account yields. Businesses are closely watching for signals about the Fed's long-term strategy, as borrowing costs directly impact investment decisions and expansion plans.`,
    author: 'Sarah Mitchell',
    source: 'Wall Street Journal',
    publishedAt: '2024-01-15T10:30:00Z',
    imageUrl: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'business',
    readTime: 4
  },
  {
    id: '2',
    title: 'AI Revolution: OpenAI Announces Breakthrough in Multimodal Language Processing',
    summary: 'OpenAI unveiled its latest advancement in artificial intelligence, demonstrating significant improvements in processing text, images, and audio simultaneously. The technology promises to transform how humans interact with AI systems.',
    content: `OpenAI has announced a groundbreaking advancement in artificial intelligence technology, unveiling a new multimodal language model that can seamlessly process and generate text, images, and audio content. This development represents a significant leap forward in AI capabilities and could fundamentally change how humans interact with artificial intelligence systems.

    The new model demonstrates unprecedented ability to understand context across different media types, enabling more natural and intuitive conversations. During the demonstration, the AI successfully analyzed complex documents containing charts, images, and text, providing comprehensive summaries and answering detailed questions about the content.

    Industry experts believe this advancement could accelerate AI adoption across various sectors, from education and healthcare to creative industries. The technology's ability to process multiple input types simultaneously opens new possibilities for automated content creation, data analysis, and human-computer interaction.

    The announcement has sparked discussions about the pace of AI development and its implications for the job market. While the technology promises increased productivity and new capabilities, it also raises questions about the need for workforce adaptation and regulatory frameworks.

    OpenAI plans to gradually roll out access to the new model, starting with research institutions and select enterprise partners. The company emphasized its commitment to responsible AI development and safety measures throughout the deployment process.`,
    author: 'Michael Chen',
    source: 'TechCrunch',
    publishedAt: '2024-01-15T14:20:00Z',
    imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'technology',
    readTime: 5
  },
  {
    id: '3',
    title: 'Global Climate Summit Reaches Historic Agreement on Carbon Reduction',
    summary: 'World leaders at the Climate Summit 2024 have reached a landmark agreement committing to unprecedented carbon emission reductions. The accord includes binding targets and financial mechanisms for developing nations.',
    content: `World leaders have reached a historic agreement at Climate Summit 2024, committing to the most ambitious carbon reduction targets in international climate policy history. The accord, signed by representatives from 195 countries, establishes binding emission reduction targets and comprehensive financial support mechanisms for developing nations.

    The agreement mandates a 50% reduction in global carbon emissions by 2030, with developed nations leading the effort through immediate implementation of clean energy initiatives. A newly established Climate Adaptation Fund will provide $100 billion annually to support developing countries in their transition to sustainable energy systems.

    Key provisions include accelerated phase-out of fossil fuel subsidies, mandatory renewable energy quotas for major economies, and enhanced international cooperation on climate technology transfer. The agreement also establishes a global carbon pricing mechanism designed to create market incentives for emission reductions.

    Environmental groups have praised the agreement as a crucial step forward, while acknowledging the significant challenges in implementation. The success of the accord will depend on national governments' ability to translate international commitments into effective domestic policies and regulations.

    Business leaders from major corporations have expressed support for the agreement, citing the importance of policy certainty for long-term investment decisions. Many companies have already begun adjusting their strategies to align with the new international framework.`,
    author: 'Elena Rodriguez',
    source: 'Reuters',
    publishedAt: '2024-01-15T09:15:00Z',
    imageUrl: 'https://images.pexels.com/photos/9324434/pexels-photo-9324434.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'politics',
    readTime: 6
  },
  {
    id: '4',
    title: 'Breakthrough in Quantum Computing: IBM Achieves 1000-Qubit Milestone',
    summary: 'IBM researchers have successfully developed a 1000-qubit quantum processor, marking a significant milestone in quantum computing development. The achievement brings practical quantum applications closer to reality.',
    content: `IBM Research has achieved a major breakthrough in quantum computing with the successful development of a 1000-qubit quantum processor, representing the most powerful quantum computer built to date. This milestone brings the technology significantly closer to practical applications in drug discovery, financial modeling, and cryptography.

    The new quantum processor, named "Quantum Condor," demonstrates unprecedented stability and coherence times, essential factors for performing complex calculations. The system maintains quantum states for extended periods, enabling more sophisticated algorithms and problem-solving capabilities than previously possible.

    Researchers successfully demonstrated quantum advantage in several benchmark problems, including molecular simulation and optimization tasks that would be computationally intractable for classical computers. The breakthrough required innovations in quantum error correction, control systems, and cryogenic engineering.

    The implications for various industries are profound. Pharmaceutical companies could accelerate drug discovery processes, financial institutions could improve risk modeling, and cybersecurity applications could revolutionize encryption methods. However, practical deployment still requires additional advances in quantum software and algorithms.

    IBM plans to make the quantum system available to researchers and enterprise partners through its quantum cloud platform. The company emphasized that widespread commercial applications may still be several years away, but this milestone represents crucial progress toward practical quantum computing.`,
    author: 'David Kim',
    source: 'Bloomberg',
    publishedAt: '2024-01-15T11:45:00Z',
    imageUrl: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'technology',
    readTime: 5
  },
  {
    id: '5',
    title: 'Major Healthcare Reform Bill Passes Congressional Committee',
    summary: 'A comprehensive healthcare reform bill has passed the House Committee on Energy and Commerce, proposing significant changes to prescription drug pricing and insurance coverage requirements.',
    content: `The House Committee on Energy and Commerce has approved a comprehensive healthcare reform bill that could reshape the American healthcare system. The legislation addresses prescription drug pricing, insurance coverage requirements, and healthcare accessibility across different income levels.

    Key provisions of the bill include allowing Medicare to negotiate prescription drug prices directly with pharmaceutical companies, a measure that could reduce costs for millions of seniors. The legislation also expands subsidies for health insurance premiums and reduces out-of-pocket maximums for essential medications.

    The bill proposes strengthening protections for individuals with pre-existing conditions and expanding mental health coverage requirements. Healthcare providers would face new requirements for price transparency, making it easier for patients to understand treatment costs before receiving care.

    Pharmaceutical industry representatives have expressed concerns about the pricing provisions, arguing that reduced revenues could impact research and development investments. However, patient advocacy groups have strongly supported the legislation, citing the urgent need for affordable healthcare access.

    The bill now moves to the full House for consideration, where it faces an uncertain path given current political dynamics. Supporters are optimistic about bipartisan support for certain provisions, particularly those addressing prescription drug costs and mental health coverage.`,
    author: 'Jennifer Martinez',
    source: 'Reuters',
    publishedAt: '2024-01-15T13:30:00Z',
    imageUrl: 'https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'politics',
    readTime: 4
  },
  {
    id: '6',
    title: 'Electric Vehicle Sales Surge 40% as Infrastructure Expands Nationwide',
    summary: 'Electric vehicle adoption has accelerated dramatically with 40% year-over-year growth in sales. The expansion of charging infrastructure and new model releases are driving increased consumer interest.',
    content: `Electric vehicle sales have surged by 40% year-over-year, marking the strongest growth period in the industry's history. The dramatic increase in adoption is attributed to expanding charging infrastructure, competitive pricing, and a broader range of available models across different vehicle categories.

    Major automakers have reported record-breaking quarterly sales figures, with electric vehicles now representing 15% of total new car sales nationwide. Tesla continues to lead in market share, but traditional manufacturers like Ford, GM, and Volkswagen are rapidly gaining ground with new model launches.

    The federal government's investment in charging infrastructure has resulted in a 60% increase in public charging stations over the past year. This expansion has addressed one of the primary concerns preventing consumers from switching to electric vehicles: range anxiety and charging accessibility.

    Battery technology improvements have also contributed to increased adoption, with new models offering ranges exceeding 400 miles on a single charge. Manufacturing costs have decreased significantly, allowing automakers to offer electric vehicles at price points competitive with traditional internal combustion engines.

    Industry analysts predict that electric vehicles could represent 30% of new car sales by 2030, driven by continued technological improvements, regulatory support, and changing consumer preferences toward sustainable transportation options.`,
    author: 'Robert Thompson',
    source: 'Wall Street Journal',
    publishedAt: '2024-01-15T16:00:00Z',
    imageUrl: 'https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'business',
    readTime: 4
  }
];