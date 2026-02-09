import mongoose from 'mongoose';

const phaseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const roadmapSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    specializations: {
      type: [String],
      validate: [v => v.length <= 2, 'specializations must have at most 2 items'],
    },
    goal: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    hash: { type: String, required: true },
    source: { type: String, required: true },
    phases: { type: [phaseSchema], default: undefined },
    createdAt: { type: Date, default: () => new Date() },
  },
  { timestamps: false }
);

export const Roadmap = mongoose.model('Roadmap', roadmapSchema);
