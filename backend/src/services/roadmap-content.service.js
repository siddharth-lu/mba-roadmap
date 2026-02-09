import OpenAI from 'openai';
import { ITM_CONTEXT } from '../config/itm-context.js';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const DEFAULT_PHASES = [
  {
    title: 'Phase 1',
    subtitle: 'Your foundation',
    description:
      'Your MBA journey begins with core management fundamentals: quantitative methods, economics, organizational behavior, and business communication. At ITM, the first semester includes an induction program, foundation courses, and soft-skills training—setting you up for the specialization choices ahead. Mumbai’s ecosystem gives you early exposure to live case discussions and industry speakers that many tier-2 city colleges lack.',
  },
  {
    title: 'Phase 2',
    subtitle: 'Core curriculum & specialization core',
    description:
      'You dive into finance, marketing, operations, and strategy alongside your chosen specialization core. ITM’s curriculum is designed with industry input, so you learn tools and frameworks that employers actually use. Capstone Phase 1, NGO internship, and outbound programs add real-world texture. Compared to traditional programs that rely on textbooks, this phase blends theory with case studies, simulations, and industrial visits.',
  },
  {
    title: 'Phase 3',
    subtitle: 'Industry-integrated internship',
    description:
      'A 5-month industry internship—plus 2 weeks of NGO internship—puts you ahead of typical 2–3 month stints. You build credibility in your specialization and often convert internships into pre-placement offers. Mumbai’s concentration of corporates, startups, and BFSI firms means more quality roles and better mentorship. Many students use this period to network and narrow down their target roles.',
  },
  {
    title: 'Phase 4',
    subtitle: 'Advanced specialization & placement readiness',
    description:
      'Advanced subjects, Capstone Phase 2, and intense placement preparation (300+ hours of soft skills and interview prep at ITM) sharpen you for recruitment. With a small batch of 60 and 1-1 mentorship, monthly CEO talks, and strong industry connect, you’re not just another resume. The 35+ professional certifications included in the program give you concrete proof of skills that recruiters look for.',
  },
  {
    title: 'Phase 5',
    subtitle: 'Placement & your outcome',
    description:
      'ITM’s 100% placement record reflects both Mumbai’s job market and the program’s focus on employability. You’ll assimilate your learning through research and work experience, complete the Final Capstone, and step into roles in your specialization. Whether you’re targeting high package placement, a career switch, or entrepreneurship, the combination of location, curriculum, and industry connect positions you for the outcome you want.',
  },
];

/**
 * Generate 5 personalized roadmap card contents using OpenAI.
 * @param {{ name: string, city: string, state: string, specializations: string[], goal: string }} roadmap
 * @returns {Promise<{ title: string, subtitle: string, description: string }[]>}
 */
export async function generatePhases(roadmap) {
  if (!openai) return DEFAULT_PHASES;

  const { name, city, state, specializations, goal } = roadmap;
  const specText = specializations?.length ? specializations.join(' and ') : 'General Management';

  const systemPrompt = `You are an MBA admissions and career advisor. Generate a personalized 5-card roadmap for a prospective MBA student. Each card must be rich and descriptive so it fills the full card. Use the ITM context to compare colleges in the candidate's city with ITM, cite specific differentiators (internship length, certifications, placement, global immersion, batch size), and explain why Mumbai helps. Output valid JSON only.`;

  const userPrompt = `
CANDIDATE:
- Name: ${name}
- City: ${city}
- State: ${state}
- Specializations of interest: ${specText}
- Career goal: ${goal}

ITM CONTEXT:
${ITM_CONTEXT}

Generate exactly 5 roadmap cards. Each card must have:
- title: short label (e.g. "Phase 1")
- subtitle: clear, engaging heading (e.g. "Why ITM Fits Your Goal" or "Your Foundation in Mumbai")
- description: A full paragraph of 4-6 sentences that fills the card. Be specific: name 1-2 known MBA colleges in the candidate's city where relevant and compare them briefly with ITM (e.g. internship duration, certifications, placement support, global immersion). Mention ITM's 5-month internship, 35+ certifications, 100% placement, 60-student batch, and Mumbai's advantages. For the candidate's chosen specializations and goal, tailor the content. Use line breaks (\\n) between sentences or ideas if it improves readability. No bullet points in the description—use flowing prose. Tone: helpful, warm, and concrete.

Return a JSON object with a single key "phases" whose value is an array of exactly 5 objects, each with "title", "subtitle", "description". No other text.
Example: {"phases":[{"title":"Phase 1","subtitle":"...","description":"..."}, ...]}
`.trim();

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return DEFAULT_PHASES;

    const parsed = JSON.parse(raw);
    const phases = Array.isArray(parsed.phases) ? parsed.phases : Array.isArray(parsed) ? parsed : [];
    if (phases.length !== 5) return DEFAULT_PHASES;

    return phases.map((p, i) => ({
      title: p.title || DEFAULT_PHASES[i].title,
      subtitle: p.subtitle || DEFAULT_PHASES[i].subtitle,
      description: p.description || DEFAULT_PHASES[i].description,
    }));
  } catch (err) {
    console.warn('[generatePhases]', err.message);
    return DEFAULT_PHASES;
  }
}
