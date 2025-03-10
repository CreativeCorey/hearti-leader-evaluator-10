
import { HEARTIQuestion } from '../types';

// HEARTI Assessment Questions
export const questions: HEARTIQuestion[] = [
  // Humility
  { id: 1, dimension: 'humility', text: 'I acknowledge when I don\'t know the answer.' },
  { id: 2, dimension: 'humility', text: 'I ask for feedback.' },
  { id: 3, dimension: 'humility', text: 'If people express criticism, I implement what I learn.' },
  { id: 4, dimension: 'humility', text: 'I publicly give credit and publicly amplify the success of others.' },
  { id: 5, dimension: 'humility', text: 'Partnering with others is foundational to my success.' },
  { id: 6, dimension: 'humility', text: 'I get frustrated when I don\'t get recognition.', reverseScored: true },
  { id: 7, dimension: 'humility', text: 'I\'ve been told I\'m a micromanager.', reverseScored: true },
  { id: 8, dimension: 'humility', text: 'I let my team figure out how to get work done.' },
  { id: 9, dimension: 'humility', text: 'I listen more than I talk.' },
  
  // Empathy
  { id: 10, dimension: 'empathy', text: 'I seek to understand situations from another person\'s point of view by asking questions and being curious.' },
  { id: 11, dimension: 'empathy', text: 'I reach out and express my support when I see that others are struggling.' },
  { id: 13, dimension: 'empathy', text: 'When making an important decision, I deliberately consult with those who think differently than me.' },
  { id: 14, dimension: 'empathy', text: 'I can recognize when others struggle without asking them.' },
  { id: 15, dimension: 'empathy', text: 'I learn from the different views and opinions of others.' },
  { id: 16, dimension: 'empathy', text: 'I strive to keep everyone happy, sometimes to a fault.', reverseScored: true },
  { id: 17, dimension: 'empathy', text: 'I understand the best way to communicate feedback to each team member.' },
  { id: 18, dimension: 'empathy', text: 'I prioritize delivering results even when there is a cost to the well-being of my team.', reverseScored: true },
  { id: 19, dimension: 'empathy', text: 'When I am talking with someone, I often think about what I am going to say next.', reverseScored: true },
  
  // Accountability
  { id: 20, dimension: 'accountability', text: 'I hold others accountable for their behaviors to create a workplace of belonging.' },
  { id: 21, dimension: 'accountability', text: 'I take ownership of my decisions and the consequences of mistakes.' },
  { id: 22, dimension: 'accountability', text: 'My colleagues trust me to get the job done.' },
  { id: 23, dimension: 'accountability', text: 'I give individuals on my team the authority to make critical decisions.' },
  { id: 24, dimension: 'accountability', text: 'I communicate when I can\'t meet a deadline.' },
  { id: 25, dimension: 'accountability', text: 'When making decisions, I prefer to keep my options open.', reverseScored: true },
  { id: 26, dimension: 'accountability', text: 'I hold others accountable for completing their assignments accurately and on time.' },
  { id: 27, dimension: 'accountability', text: 'I hold others accountable even if it makes me feel uncomfortable.' },
  { id: 28, dimension: 'accountability', text: 'My team tells me when they are behind on goals.' },
  
  // Resiliency
  { id: 29, dimension: 'resiliency', text: 'Unexpected obstacles present opportunities.' },
  { id: 30, dimension: 'resiliency', text: 'I have a hard time giving up on a goal.' },
  { id: 31, dimension: 'resiliency', text: 'When I fail, I am able to adapt and try an alternative approach.' },
  { id: 32, dimension: 'resiliency', text: 'I struggle to get over mistakes I made.', reverseScored: true },
  { id: 33, dimension: 'resiliency', text: 'I gain wisdom from my failures.' },
  { id: 34, dimension: 'resiliency', text: 'I achieve my goals.' },
  { id: 35, dimension: 'resiliency', text: 'I have a positive outlook on life.' },
  { id: 36, dimension: 'resiliency', text: 'I reach out to others for support when I am under stress.' },
  { id: 37, dimension: 'resiliency', text: 'I practice self-care to avoid burn out.' },
  { id: 38, dimension: 'resiliency', text: 'My team feels burned out.', reverseScored: true },
  
  // Transparency
  { id: 39, dimension: 'transparency', text: 'I share information that allows my team to do their jobs more effectively.' },
  { id: 40, dimension: 'transparency', text: 'I avoid difficult conversations.', reverseScored: true },
  { id: 41, dimension: 'transparency', text: 'I am comfortable being vulnerable about my shortcomings and challenges.' },
  { id: 42, dimension: 'transparency', text: 'I explain my decisions so others understand why.' },
  { id: 43, dimension: 'transparency', text: 'I believe that information should be shared only on a need to know basis.', reverseScored: true },
  { id: 44, dimension: 'transparency', text: 'I ensure my communications are relevant and appropriate to each audience.' },
  { id: 45, dimension: 'transparency', text: 'I am willing to take a public stand on controversial issues.' },
  { id: 46, dimension: 'transparency', text: 'I share my vision and purpose so others can better understand what motivates me.' },
  { id: 47, dimension: 'transparency', text: 'I prioritize my time for important conversations.' },
  { id: 48, dimension: 'transparency', text: 'When the news is bad, I don\'t try to gloss over the truth.' },
  { id: 49, dimension: 'transparency', text: 'People tell me I am easy to talk to.' },
  
  // Inclusivity
  { id: 50, dimension: 'inclusivity', text: 'I hire, refer, and recommend BIPOC candidates.' },
  { id: 51, dimension: 'inclusivity', text: 'I seek out and participate in training that mentions microaggressions, anti-racism, or white privilege.' },
  { id: 52, dimension: 'inclusivity', text: 'I provide corrective feedback to people who behave in a sexist, racist, or homophobic manner.' },
  { id: 53, dimension: 'inclusivity', text: 'There are people from different generations who are my close confidants at work.' },
  { id: 54, dimension: 'inclusivity', text: 'I find it hard to recognize or understand the issues around DEI.', reverseScored: true },
  { id: 55, dimension: 'inclusivity', text: 'Diversity and inclusion are a distraction from pressing business problems.', reverseScored: true },
  { id: 56, dimension: 'inclusivity', text: 'I initiate conversations about challenging diversity and inclusion topics.' },
  { id: 57, dimension: 'inclusivity', text: 'I actively sponsor people from underrepresented communities.' },
  { id: 58, dimension: 'inclusivity', text: 'I ask BIPOC and LGBTQ+ colleagues about their experience in our work environment.' },
  { id: 59, dimension: 'inclusivity', text: 'I collaborate with diverse talent to ensure our workplace programs and policies are inclusive.' },
];
