/*
  # Seed Sample Articles

  1. Sample Data
    - Insert sample articles with proper source references
    - Covers all categories with realistic content
    - Uses proper timestamps and metadata

  2. Data Quality
    - All articles have proper summaries and content
    - Realistic read times and publication dates
    - High-quality image URLs from Pexels
*/

-- Insert sample articles
INSERT INTO articles (
  title, 
  summary, 
  content, 
  author, 
  source_id, 
  published_at, 
  image_url, 
  category, 
  read_time
) VALUES 
(
  'Federal Reserve Signals Potential Rate Cuts Amid Economic Uncertainty',
  'The Federal Reserve indicated it may consider lowering interest rates in response to slowing economic growth and persistent inflation concerns. Chair Powell emphasized the need for careful monitoring of economic indicators.',
  'The Federal Reserve signaled a potential shift in monetary policy during its latest meeting, suggesting that interest rate cuts may be on the horizon as economic indicators point to slowing growth. Federal Reserve Chair Jerome Powell emphasized the central bank''s commitment to achieving price stability while supporting maximum employment.

Economic data from the past quarter shows mixed signals, with unemployment remaining historically low but GDP growth decelerating. Inflation has shown signs of cooling, though it remains above the Fed''s 2% target. The central bank''s decision-making process will heavily depend on upcoming employment reports and consumer price index data.

Market analysts predict that any rate adjustments would be gradual and data-dependent. The Fed''s dual mandate requires balancing employment objectives with price stability, making timing crucial for any policy changes. Financial markets have already begun pricing in potential rate cuts, with bond yields reflecting increased volatility.

The implications for consumers could be significant, potentially affecting mortgage rates, credit card interest, and savings account yields. Businesses are closely watching for signals about the Fed''s long-term strategy, as borrowing costs directly impact investment decisions and expansion plans.',
  'Sarah Mitchell',
  (SELECT id FROM news_sources WHERE name = 'Wall Street Journal'),
  '2024-01-15T10:30:00Z',
  'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=800',
  'business',
  4
),
(
  'AI Revolution: OpenAI Announces Breakthrough in Multimodal Language Processing',
  'OpenAI unveiled its latest advancement in artificial intelligence, demonstrating significant improvements in processing text, images, and audio simultaneously. The technology promises to transform how humans interact with AI systems.',
  'OpenAI has announced a groundbreaking advancement in artificial intelligence technology, unveiling a new multimodal language model that can seamlessly process and generate text, images, and audio content. This development represents a significant leap forward in AI capabilities and could fundamentally change how humans interact with artificial intelligence systems.

The new model demonstrates unprecedented ability to understand context across different media types, enabling more natural and intuitive conversations. During the demonstration, the AI successfully analyzed complex documents containing charts, images, and text, providing comprehensive summaries and answering detailed questions about the content.

Industry experts believe this advancement could accelerate AI adoption across various sectors, from education and healthcare to creative industries. The technology''s ability to process multiple input types simultaneously opens new possibilities for automated content creation, data analysis, and human-computer interaction.

The announcement has sparked discussions about the pace of AI development and its implications for the job market. While the technology promises increased productivity and new capabilities, it also raises questions about the need for workforce adaptation and regulatory frameworks.

OpenAI plans to gradually roll out access to the new model, starting with research institutions and select enterprise partners. The company emphasized its commitment to responsible AI development and safety measures throughout the deployment process.',
  'Michael Chen',
  (SELECT id FROM news_sources WHERE name = 'TechCrunch'),
  '2024-01-15T14:20:00Z',
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
  'technology',
  5
),
(
  'Global Climate Summit Reaches Historic Agreement on Carbon Reduction',
  'World leaders at the Climate Summit 2024 have reached a landmark agreement committing to unprecedented carbon emission reductions. The accord includes binding targets and financial mechanisms for developing nations.',
  'World leaders have reached a historic agreement at Climate Summit 2024, committing to the most ambitious carbon reduction targets in international climate policy history. The accord, signed by representatives from 195 countries, establishes binding emission reduction targets and comprehensive financial support mechanisms for developing nations.

The agreement mandates a 50% reduction in global carbon emissions by 2030, with developed nations leading the effort through immediate implementation of clean energy initiatives. A newly established Climate Adaptation Fund will provide $100 billion annually to support developing countries in their transition to sustainable energy systems.

Key provisions include accelerated phase-out of fossil fuel subsidies, mandatory renewable energy quotas for major economies, and enhanced international cooperation on climate technology transfer. The agreement also establishes a global carbon pricing mechanism designed to create market incentives for emission reductions.

Environmental groups have praised the agreement as a crucial step forward, while acknowledging the significant challenges in implementation. The success of the accord will depend on national governments'' ability to translate international commitments into effective domestic policies and regulations.

Business leaders from major corporations have expressed support for the agreement, citing the importance of policy certainty for long-term investment decisions. Many companies have already begun adjusting their strategies to align with the new international framework.',
  'Elena Rodriguez',
  (SELECT id FROM news_sources WHERE name = 'Reuters'),
  '2024-01-15T09:15:00Z',
  'https://images.pexels.com/photos/9324434/pexels-photo-9324434.jpeg?auto=compress&cs=tinysrgb&w=800',
  'politics',
  6
),
(
  'Breakthrough in Quantum Computing: IBM Achieves 1000-Qubit Milestone',
  'IBM researchers have successfully developed a 1000-qubit quantum processor, marking a significant milestone in quantum computing development. The achievement brings practical quantum applications closer to reality.',
  'IBM Research has achieved a major breakthrough in quantum computing with the successful development of a 1000-qubit quantum processor, representing the most powerful quantum computer built to date. This milestone brings the technology significantly closer to practical applications in drug discovery, financial modeling, and cryptography.

The new quantum processor, named "Quantum Condor," demonstrates unprecedented stability and coherence times, essential factors for performing complex calculations. The system maintains quantum states for extended periods, enabling more sophisticated algorithms and problem-solving capabilities than previously possible.

Researchers successfully demonstrated quantum advantage in several benchmark problems, including molecular simulation and optimization tasks that would be computationally intractable for classical computers. The breakthrough required innovations in quantum error correction, control systems, and cryogenic engineering.

The implications for various industries are profound. Pharmaceutical companies could accelerate drug discovery processes, financial institutions could improve risk modeling, and cybersecurity applications could revolutionize encryption methods. However, practical deployment still requires additional advances in quantum software and algorithms.

IBM plans to make the quantum system available to researchers and enterprise partners through its quantum cloud platform. The company emphasized that widespread commercial applications may still be several years away, but this milestone represents crucial progress toward practical quantum computing.',
  'David Kim',
  (SELECT id FROM news_sources WHERE name = 'Bloomberg'),
  '2024-01-15T11:45:00Z',
  'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=800',
  'technology',
  5
),
(
  'Electric Vehicle Sales Surge 40% as Infrastructure Expands Nationwide',
  'Electric vehicle adoption has accelerated dramatically with 40% year-over-year growth in sales. The expansion of charging infrastructure and new model releases are driving increased consumer interest.',
  'Electric vehicle sales have surged by 40% year-over-year, marking the strongest growth period in the industry''s history. The dramatic increase in adoption is attributed to expanding charging infrastructure, competitive pricing, and a broader range of available models across different vehicle categories.

Major automakers have reported record-breaking quarterly sales figures, with electric vehicles now representing 15% of total new car sales nationwide. Tesla continues to lead in market share, but traditional manufacturers like Ford, GM, and Volkswagen are rapidly gaining ground with new model launches.

The federal government''s investment in charging infrastructure has resulted in a 60% increase in public charging stations over the past year. This expansion has addressed one of the primary concerns preventing consumers from switching to electric vehicles: range anxiety and charging accessibility.

Battery technology improvements have also contributed to increased adoption, with new models offering ranges exceeding 400 miles on a single charge. Manufacturing costs have decreased significantly, allowing automakers to offer electric vehicles at price points competitive with traditional internal combustion engines.

Industry analysts predict that electric vehicles could represent 30% of new car sales by 2030, driven by continued technological improvements, regulatory support, and changing consumer preferences toward sustainable transportation options.',
  'Robert Thompson',
  (SELECT id FROM news_sources WHERE name = 'Wall Street Journal'),
  '2024-01-15T16:00:00Z',
  'https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg?auto=compress&cs=tinysrgb&w=800',
  'business',
  4
)
ON CONFLICT DO NOTHING;