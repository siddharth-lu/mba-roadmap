export type Phase = {
  title: string;
  subtitle: string;
  description: string;
};

export type RoadmapData = {
  name: string;
  city: string;
  state: string;
  specializations: string[];
  goal: string;
  slug: string;
  phases?: Phase[];
};
