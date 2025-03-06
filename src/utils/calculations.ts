import { HEARTIAnswer, HEARTIDimension, HEARTIQuestion, ChartData } from '../types';

// Calculate scores for each dimension
export const calculateDimensionScores = (
  answers: HEARTIAnswer[],
  questions: HEARTIQuestion[]
): Record<HEARTIDimension, number> => {
  const dimensionCounts: Record<HEARTIDimension, number> = {
    humility: 0,
    empathy: 0,
    accountability: 0,
    resiliency: 0,
    transparency: 0,
    inclusivity: 0,
  };

  const dimensionScores: Record<HEARTIDimension, number> = {
    humility: 0,
    empathy: 0,
    accountability: 0,
    resiliency: 0,
    transparency: 0,
    inclusivity: 0,
  };

  // Sum the scores for each dimension
  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (question) {
      dimensionScores[question.dimension] += answer.score;
      dimensionCounts[question.dimension]++;
    }
  });

  // Calculate the average score for each dimension (out of 5)
  const dimensions: HEARTIDimension[] = [
    'humility',
    'empathy',
    'accountability',
    'resiliency',
    'transparency',
    'inclusivity',
  ];

  dimensions.forEach((dimension) => {
    if (dimensionCounts[dimension] > 0) {
      dimensionScores[dimension] = Number(
        (dimensionScores[dimension] / dimensionCounts[dimension]).toFixed(1)
      );
    }
  });

  return dimensionScores;
};

// Calculate overall score
export const calculateOverallScore = (
  dimensionScores: Record<HEARTIDimension, number>
): number => {
  const dimensions = Object.keys(dimensionScores) as HEARTIDimension[];
  const sum = dimensions.reduce((acc, dimension) => acc + dimensionScores[dimension], 0);
  return Number((sum / dimensions.length).toFixed(1));
};

// Format dimension data for radar chart
export const formatDataForRadarChart = (
  dimensionScores: Record<HEARTIDimension, number>
): ChartData => {
  return [
    { name: 'Humility', value: dimensionScores.humility, fullMark: 5 },
    { name: 'Empathy', value: dimensionScores.empathy, fullMark: 5 },
    { name: 'Accountability', value: dimensionScores.accountability, fullMark: 5 },
    { name: 'Resiliency', value: dimensionScores.resiliency, fullMark: 5 },
    { name: 'Transparency', value: dimensionScores.transparency, fullMark: 5 },
    { name: 'Inclusivity', value: dimensionScores.inclusivity, fullMark: 5 },
  ];
};

// Get dimension description
export const getDimensionDescription = (dimension: HEARTIDimension): string => {
  const descriptions: Record<HEARTIDimension, string> = {
    humility: 'The ability to recognize one\'s limitations and mistakes, and to be open to feedback and growth.',
    empathy: 'The capacity to understand and share the feelings of others, and to respond with compassion.',
    accountability: 'The willingness to take responsibility for one\'s actions and decisions, and to follow through on commitments.',
    resiliency: 'The ability to recover from setbacks, adapt to change, and keep going in the face of adversity.',
    transparency: 'The practice of being open, honest, and clear in communications and decision-making processes.',
    inclusivity: 'The commitment to creating environments where all people feel welcomed, respected, and valued.',
  };

  return descriptions[dimension];
};

// Get feedback based on score
export const getFeedback = (score: number, dimension: HEARTIDimension): string => {
  if (score >= 4.5) {
    return `Your ${dimension} score is excellent. This is a significant strength in your leadership style.`;
  } else if (score >= 3.5) {
    return `Your ${dimension} score is good. This is a positive aspect of your leadership with room for further development.`;
  } else if (score >= 2.5) {
    return `Your ${dimension} score is average. Consider focusing on developing this aspect of your leadership.`;
  } else {
    return `Your ${dimension} score is below average. This area represents an opportunity for significant growth.`;
  }
};

// Get dimension report content based on status (strength, vulnerability, or neutral)
export function getDimensionReportContent(
  dimension: HEARTIDimension, 
  status: 'strength' | 'vulnerability' | 'neutral',
  userName: string
) {
  const content = {
    statusContent: '',
    description: '',
    levels: '',
    tips: ''
  };
  
  // Set the content based on dimension and status
  switch (dimension) {
    case 'inclusivity':
      if (status === 'strength') {
        content.statusContent = `<p class="mb-4"><strong>Congratulations!</strong> ${userName}, your HEARTI:Leader strength is Inclusivity. You are a champion for differences. Inclusive leaders understand that diverse teams drive more significant innovation and better results.</p>`;
      } else if (status === 'vulnerability') {
        content.statusContent = `<p class="mb-4">${userName}, an area of growth for you is Inclusivity. Inclusive leaders are champions for differences, understanding that diverse teams drive more significant innovation and better results.</p>`;
      } else {
        content.statusContent = `<p class="mb-4">Inclusive leaders are champions for differences, understanding that diverse teams drive more significant innovation and better results.</p>`;
      }
      
      content.description = `
        <p class="mb-4">Being an inclusive leader is about understanding the dynamics associated with belonging, hearing all voices, considering all ideas, and granting recognition to anyone deserving.</p>
        <p class="mb-4">Successful leaders design authentic 21st-century workplaces with diversity as a foundation. However, it's not uncommon to find teams that resemble one another in life experience, style, life stage, race, ethnicity, and gender. While homogeneous groups are more comfortable, research shows they may lack the innovation, creativity, and performance of other more diverse teams.</p>
        <p class="mb-4">HEARTI leaders are champions of inclusivity because it's better for the business. They are diversity and inclusion advocates driving change in the culture and systems within their organizations—and throughout the world.</p>
      `;
      
      content.levels = `
        <p class="mb-2"><strong>Best in Class:</strong> Champions of belonging advocate to create a workplace where diversity, equity, and inclusion are foundational and supported by systems, processes, and culture, including individual and team accountability.</p>
        <p class="mb-2"><strong>Evolving:</strong> Evolving leaders are aware that diversity, equity, and inclusion are essential—but lack advocacy and individual and team accountability.</p>
        <p class="mb-2"><strong>Unready:</strong> Unready leaders are scarcity-driven. They may recognize that unconscious bias exists; however, they lack advocacy and basic systems, processes, and culture that track progress.</p>
      `;
      
      content.tips = `
        <ul class="list-disc pl-5 space-y-2">
          <li>Read Jennifer Brown's book, How to Be An Inclusive Leader: Your Role in Creating Cultures of Belonging Where Everyone Can Thrive.</li>
          <li>Give yourself 10 minutes a day to become more informed about race and build your anti-racist insights and skills by visiting JusticeinJune.org.</li>
          <li>Understand your privilege and recognize the privilege (or lack of privilege) in others. Take it a step further by doing a virtual "Privilege Walk."</li>
          <li>Read Good Guys: How Men Can Be Better Allies for Women in the Workplace, by Professors David Smith and Brad Johnson.</li>
        </ul>
      `;
      break;
      
    case 'humility':
      if (status === 'strength') {
        content.statusContent = `<p class="mb-4"><strong>Congratulations!</strong> ${userName}, your HEARTI:Leader strength is Humility. You are aware of your weaknesses, eager to improve yourself, appreciative of others' strengths, and focused on goals beyond your own self-interest.</p>`;
      } else if (status === 'vulnerability') {
        content.statusContent = `<p class="mb-4">${userName}, an area of growth for you is Humility. Humble leaders are aware of their weaknesses, eager to improve themselves, appreciative of others' strengths, and are focused on goals beyond their own self-interest.</p>`;
      } else {
        content.statusContent = `<p class="mb-4">Humble leaders are aware of their weaknesses, eager to improve themselves, appreciative of others' strengths, and are focused on goals beyond their own self-interest.</p>`;
      }
      
      content.description = `
        <p class="mb-4">When it comes to leading in the new world of work, being humble means being comfortable that you don't have all the answers, but you possess the courage to learn. This capability is vital for working through diversity, inclusion, equity, and belonging issues. The key here is to start by knowing where you are (and where you aren't...yet).</p>
        <p class="mb-4"><strong>4 Core Elements to Being a Humble Leader:</strong></p>
        <ul class="list-disc pl-5 mb-4">
          <li>Having an awareness of your limitations</li>
          <li>Understanding that the success of your teams or employees enhance your success</li>
          <li>Operating with a service mindset</li>
          <li>Being driven by a higher purpose</li>
        </ul>
      `;
      
      content.levels = `
        <p class="mb-2"><strong>Best-In-Class:</strong> Humble leaders focus on all stakeholders' needs, asking, "What have I done for others?"</p>
        <p class="mb-2"><strong>Evolving:</strong> Individuals evolving their humble leadership prioritize the company's needs but may not understand the link to stakeholders. They may ask themselves, "What have I done for the organization?"</p>
        <p class="mb-2"><strong>Unready:</strong> Leaders who are unready in humility are self- and personal career-minded, asking, "What have I done for me?"</p>
      `;
      
      content.tips = `
        <p class="mb-2">Being a humble leader requires overcoming a belief in scarcity and replacing it with a growth mindset. To become more familiar with a growth mindset, read Stanford University Professor Carol Dweck's book, Mindset: The New Psychology of Success, or you can watch her TEDTalk.</p>
        <p class="mb-2">Put Dweck's work into practice by adding the word "yet" to every negative statement. For example:</p>
        <ul class="list-disc pl-5 mb-2">
          <li>"I'm not good at using PowerPoint...yet."</li>
          <li>"I'm not good at public speaking...yet."</li>
          <li>"I'm not good at asking for help...yet."</li>
        </ul>
        <p class="mb-2">If you struggle with micro-managing and perfectionism, enlist your colleagues and/or manager to help identify when you are being overly perfectionistic. Develop a code word or some way to lightly acknowledge the behaviors so you can better recognize patterns and can collaborate to change them.</p>
        <p>Get clear on your "why" when it comes to work and life—having a higher purpose and providing your team with insights into your "why" can enlist them as allies in your goal. Understand their "why," too.</p>
      `;
      break;
      
    case 'transparency':
      if (status === 'strength') {
        content.statusContent = `<p class="mb-4"><strong>Congratulations!</strong> ${userName}, your HEARTI:Leader strength is Transparency. You understand that sharing information is vital to individual and team success and that communication is the foundation for building trust. You are not afraid to share information that might be uncomfortable or represent an opposing point of view. While you understand the criticality of being open and honest, you also understand what level of information-sharing is appropriate and what should remain confidential because it may compromise a business situation or an individual. You do not withhold information to maintain power.</p>`;
      } else if (status === 'vulnerability') {
        content.statusContent = `<p class="mb-4">${userName}, an area of growth for you is Transparency. Transparent leaders understand that sharing information is vital to individual and team success. They know that communication is the foundation for building trust and are not afraid to share information that might be uncomfortable or represent an opposing point of view. While transparent leaders understand the criticality of being open and honest, they also understand what level of information-sharing is appropriate and what should remain confidential because it may compromise a business situation or an individual. Transparent leaders do not withhold information to maintain power.</p>`;
      } else {
        content.statusContent = `<p class="mb-4">Transparent leaders understand that sharing information is vital to individual and team success. They know that communication is the foundation for building trust and are not afraid to share information that might be uncomfortable or represent an opposing point of view. While transparent leaders understand the criticality of being open and honest, they also understand what level of information-sharing is appropriate and what should remain confidential because it may compromise a business situation or an individual. Transparent leaders do not withhold information to maintain power.</p>`;
      }
      
      content.description = `
        <p class="mb-4">As a HEARTI leader, your objective in sharing information is to inspire and align your team, provide critical information that keeps your organization running, and help others understand your decisions. Transparent leaders are in tune with their feelings and know their position on an issue. They align their organization and teams around vision, goals, policies, and even appropriate and inappropriate behaviors. They communicate with openness and are not afraid to explain their decisions. They dare to advocate for themselves and others. They are also good listeners, make themselves available to others to get feedback, and use this feedback to improve their communications in the future continuously.</p>
      `;
      
      content.levels = `
        <p class="mb-2"><strong>Best-in-Class:</strong> Transparent leaders understand that clear communications are vital and are comfortable knowing what and when to share information. They communicate openly and honestly without compromising the company or individuals. They have implemented processes to facilitate individual, team, cross-team, and organizational communications better.</p>
        <p class="mb-2"><strong>Evolving:</strong> Individuals evolving their transparent leadership understand that communication is essential and have adopted processes to support it. However, their communications may be inconsistent across teams and organizations, and they may be uncomfortable knowing what to share and when.</p>
        <p class="mb-2"><strong>Unready:</strong> Leaders who are unready in transparency may withhold communication to preserve status, hierarchy, or perceived control. They may also withhold information because they are unsure what or when to share.</p>
      `;
      
      content.tips = `
        <ul class="list-disc pl-5 space-y-2">
          <li>Read Unleashed: The Unapologetic Leader's Guide to Empowering Everyone Around You or watch Frances Freis's TEDTalk, "How to Build (and Rebuild) Trust."</li>
          <li>Adopt an open-door policy to be accessible and encourage employees to bring in topics of concern or opportunities for recognition.</li>
          <li>Get to know your employees personally through skip-level 1:1s or small group sessions.</li>
          <li>Be honest. Always.</li>
          <li>Address difficult situations in a timely manner. Avoiding problems that everyone can see erodes trust and morale.</li>
        </ul>
      `;
      break;
      
    case 'empathy':
      if (status === 'strength') {
        content.statusContent = `<p class="mb-4"><strong>Congratulations!</strong> ${userName}, your HEARTI:Leader strength is Empathy. You can understand the feelings, needs, and motivations of others. Grounded in curiosity and learning, you also tend to be good at active listening and enjoy helping others grow and develop.</p>`;
      } else if (status === 'vulnerability') {
        content.statusContent = `<p class="mb-4">${userName}, an area of growth for you is Empathy. Empathetic leaders can understand the feelings, needs, and motivations of others. Grounded in curiosity and learning, you also tend to be good at active listening and enjoy helping others grow and develop.</p>`;
      } else {
        content.statusContent = `<p class="mb-4">Empathetic leaders can understand the feelings, needs, and motivations of others. Grounded in curiosity and learning, you also tend to be good at active listening and enjoy helping others grow and develop.</p>`;
      }
      
      content.description = `
        <p class="mb-4">At its core, empathy is about truly understanding the needs of others. Understanding your own needs and feelings is a required prerequisite to understanding others. There are three types of empathy: cognitive, emotional, and compassionate. Understanding these can help you to build your skills as an empathetic leader.</p>
        <ul class="list-disc pl-5 mb-4">
          <li><strong>Cognitive Empathy:</strong> An ability to see another person's perspective by understanding their emotional needs</li>
          <li><strong>Emotional Empathy:</strong> An ability to feel another's emotion</li>
          <li><strong>Compassionate Empathy:</strong> An ability to recognize another's pain through healthy boundaries and support them through allyship</li>
        </ul>
        <p class="mb-4">Empathy is also about a leader's ability to build and maintain rapport with others effectively. Utilizing compassionate empathy, a leader helps others' ability to take steps forward without getting consumed by others' emotions or taking inappropriate 'rescuing' actions.</p>
      `;
      
      content.levels = `
        <p class="mb-2"><strong>Best-in-Class:</strong> Best-in-class empathetic leaders are accountable for effectively connecting with others. They are in tune with their own emotions and able to communicate with others on an emotional level. They employ measurement tools to gain feedback to understand better their ability to listen to and develop followers.</p>
        <p class="mb-2"><strong>Evolving:</strong> Individuals developing their empathy recognize it as valuable but may not truly understand how to connect with others authentically—sometimes, they will demonstrate rescue behaviors instead. They are not likely to ask for feedback or employ performance measures.</p>
        <p class="mb-2"><strong>Unready:</strong> Leaders who are unready in empathy do not recognize the value of empathic behaviors.</p>
      `;
      
      content.tips = `
        <p class="mb-2">Leadership expert Andrew Sobel has outlined eight ways you can increase your empathy. Here are a few you can try this week:</p>
        <ul class="list-disc pl-5 space-y-2">
          <li><strong>Challenge yourself.</strong> Undertake experiences that push you outside your comfort zone. Learn new skills like playing a musical instrument or practicing a foreign language. Develop a new professional competency. Doing things like this will humble you, and humility is a true enabler of empathy.</li>
          <li><strong>Seek feedback.</strong> Ask for feedback about your relationship skills (e.g., listening) from family, friends, and colleagues—and then check in with them periodically to see how you're doing.</li>
          <li><strong>Cultivate your sense of curiosity.</strong> What can you learn from a very young "inexperienced colleague?" What can you learn from a client you view as "narrow"? Curious people ask lots of questions leading them to develop a different understanding of the people around them.</li>
          <li><strong>Ask better questions.</strong> Bring three or four thoughtful—even provocative—questions to every conversation with clients or colleagues. Questions that start with "what" or "how" typically can't be answered with a yes or no. They're more likely to elicit more information. Don't forget to be an active listener, pausing to truly "hear" what is said.</li>
        </ul>
      `;
      break;
      
    case 'accountability':
      if (status === 'strength') {
        content.statusContent = `<p class="mb-4"><strong>Congratulations!</strong> ${userName}, your HEARTI:Leader strength is Accountability. You dare to make unpopular decisions and have the willingness to hold yourself and others accountable for actions and decisions. You communicate what you will do, collaborate with others to get buy-in and deliver as promised. You often operate with the code of "Leader's Intent"—which simply means you set clear goals and are flexible on the path.</p>`;
      } else if (status === 'vulnerability') {
        content.statusContent = `<p class="mb-4">${userName}, an area of growth for you is Accountability. Accountable leaders dare to make unpopular decisions and the willingness to hold themselves and others accountable for their actions and decisions. They communicate what they will do, collaborate with others to get buy-in and deliver as promised. They often operate with the code of "Leader's Intent"—which simply means they set clear goals and are flexible on the path.</p>`;
      } else {
        content.statusContent = `<p class="mb-4">Accountable leaders dare to make unpopular decisions and the willingness to hold themselves and others accountable for their actions and decisions. They communicate what they will do, collaborate with others to get buy-in and deliver as promised. They often operate with the code of "Leader's Intent"—which simply means they set clear goals and are flexible on the path.</p>`;
      }
      
      content.description = `
        <p class="mb-4">Accountable leaders succeed because they build trust with stakeholders, including employees, colleagues, co-workers, customers, and their community.</p>
      `;
      
      content.levels = `
        <p class="mb-2"><strong>Best-In-Class:</strong> Best-in-class accountable leaders utilize tools such as strategic plans and cascading goals that outline individual and team accountability. They also take the opportunity to check in regularly with followers.</p>
        <p class="mb-2"><strong>Evolving:</strong> Individuals evolving their accountable leadership may work with individuals and their team to clearly define role clarity and organizational objectives but may not be consistent in holding individuals and/or the team accountable.</p>
        <p class="mb-2"><strong>Unready:</strong> Leaders who are unready in accountability are focused on the individual. They may lack understanding of cross-team interdependence, have unclear objectives and measurements, and practice inconsistent decision-making.</p>
      `;
      
      content.tips = `
        <p class="mb-2">Trust builds accountability. In her book Braving the Wilderness, Brené Brown explains that trust is composed of seven key elements:</p>
        <ul class="list-disc pl-5 mb-2">
          <li><strong>B:</strong> Boundaries—you're clear on what is ok and what is not ok</li>
          <li><strong>R:</strong> Reliability—you do what you say you are going to do</li>
          <li><strong>A:</strong> Accountability—you own your mistakes</li>
          <li><strong>V:</strong> Vault—you don't share information or experiences that aren't yours to share</li>
          <li><strong>I:</strong> Integrity—you practice your values rather than just profess them</li>
          <li><strong>N:</strong> Non-judgmental—you are confident enough to ask for what you need and allow others to do the same</li>
          <li><strong>G:</strong> Generosity—you are generous of spirit and assume positive intent</li>
        </ul>
        <p class="mb-2">Consider how you are holding yourself accountable and start BRAVING to lead. Then, start measuring what matters. Accountability is foundational to business; we set goals and keep our teams accountable to those goals. As Andy Grove, past CEO of Intel, once said, "What gets measured, gets done."</p>
        <p>Evaluate your governance programs and policies, including your approach to pay equity, your hiring and retention of diverse talent, and your employees' experience. Accountable leaders don't stop with their immediate priorities but also focus outward to ensure they create inclusive cultures within their organizations toward a more just and equitable world.</p>
      `;
      break;
      
    case 'resiliency':
      if (status === 'strength') {
        content.statusContent = `<p class="mb-4"><strong>Congratulations!</strong> ${userName}, your HEARTI:Leader strength is Resiliency. You can persevere and respond with agility when faced with challenges, and you inspire others to continue towards a common purpose. You are strategic and leapfrog competition through an agile response to challenges. You also understand that perseverance may not always be the answer—you know when to stop and are willing to pivot.</p>`;
      } else if (status === 'vulnerability') {
        content.statusContent = `<p class="mb-4">${userName}, an area of growth for you is Resiliency. Resilient leaders can persevere and respond with agility when faced with challenges, and they inspire others to continue towards a common purpose. They are strategic and can leapfrog competition through agile responses to challenges. They also understand that perseverance may not always be the answer—they know when to stop and are willing to pivot.</p>`;
      } else {
        content.statusContent = `<p class="mb-4">Resilient leaders can persevere and respond with agility when faced with challenges, and they inspire others to continue towards a common purpose. They are strategic and can leapfrog competition through an agile response to challenges. They also understand that perseverance may not always be the answer—they know when to stop and are willing to pivot.</p>`;
      }
      
      content.description = `
        <p class="mb-4">In his TED Talk on resilient leadership, clinical psychologist Raphael Rose details the core attributes of resilient leaders. They are:</p>
        <ul class="list-disc pl-5 mb-4">
          <li>More likely to experience positive emotions</li>
          <li>Open to new experiences</li>
          <li>Able to acknowledge a challenge while not allowing it to consume them</li>
          <li>Socially connected and not afraid to lean on others or ask for help</li>
        </ul>
        <p class="mb-4">Resilient leaders are realistic optimists who don't let the shiny new object distract them and can plot a course for practical and aspirational success. They are driven by more than personal gain and can use their fundamental belief in purpose to create a context for today's challenges.</p>
        <p class="mb-4">Having leaders with resilience who can navigate during times of uncertainty is critical. The Covid-19 pandemic tested companies in more ways than one, and those with resilient teams managed to pivot and find new ways to lead amid the chaos. This agility is core to resilience.</p>
      `;
      
      content.levels = `
        <p class="mb-2"><strong>Best-In-Class:</strong> Best-in-class resilient leaders cultivate and value resiliency in their followers and teams. They hire for this skill and nurture resilience by rewarding teams, not just individuals, for innovative thinking and failure.</p>
        <p class="mb-2"><strong>Evolving:</strong> Individuals developing their resilient leadership recognize the need for resilience but may not have performance measures and processes to capture learnings.</p>
        <p class="mb-2"><strong>Unready:</strong> Leaders who are unready in resilience may punish individuals for team shortcomings. They may lack team rewards and processes to capture learnings from successes and failures.</p>
      `;
      
      content.tips = `
        <ul class="list-disc pl-5 space-y-2">
          <li>Practice mindfulness. Mindful journaling, yoga, and other spiritual practices like prayer can help people build connections and hope.</li>
          <li>Take small risks. Challenge yourself to try one new thing each month.</li>
          <li>Acknowledge challenges. Practice naming them with a team and create a process to break down the challenge into smaller goals and objectives.</li>
          <li>Celebrate small successes toward the larger goal.</li>
          <li>Build a support system of individuals who can provide an outside perspective.</li>
        </ul>
      `;
      break;
  }
  
  return content;
}
