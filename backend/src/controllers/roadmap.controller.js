import { Roadmap } from '../models/Roadmap.model.js';
import { generateSlug } from '../utils/slug.js';
import { generatePhases } from '../services/roadmap-content.service.js';

export async function createRoadmap(req, res) {
  try {
    const { name, city, state, specializations, goal, source } = req.body;

    const required = ['name', 'city', 'state', 'goal', 'source'];
    for (const field of required) {
      if (!(field in req.body) || (typeof req.body[field] === 'string' && !req.body[field].trim())) {
        return res.status(400).json({ success: false, error: `Missing or empty: ${field}` });
      }
    }

    if (!Array.isArray(specializations) || specializations.length > 2) {
      return res.status(400).json({
        success: false,
        error: 'specializations must be an array with at most 2 strings',
      });
    }

    const slug = generateSlug(name, city);
    const hash = slug.split('-').pop();
    const roadmapData = {
      name: name.trim(),
      city: city.trim(),
      state: state.trim(),
      specializations: specializations.map((s) => String(s).trim()).filter(Boolean),
      goal: goal.trim(),
      source: source.trim(),
    };

    const phases = await generatePhases(roadmapData);

    const roadmap = await Roadmap.create({
      ...roadmapData,
      slug,
      hash,
      phases,
    });

    return res.status(201).json({
      success: true,
      slug: roadmap.slug,
      roadmapId: roadmap._id.toString(),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, error: 'Slug already exists' });
    }
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function getRoadmapBySlug(req, res) {
  const roadmap = await Roadmap.findOne({ slug: req.params.slug }).lean();
  if (!roadmap) {
    return res.status(404).json({ error: 'Roadmap not found' });
  }
  roadmap._id = roadmap._id.toString();
  return res.json(roadmap);
}
