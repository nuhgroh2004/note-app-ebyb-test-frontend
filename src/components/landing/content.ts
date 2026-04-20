export type FeatureCardItem = {
  tag: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  bullets: string[];
};

export type CapabilityItem = {
  title: string;
  description: string;
  detail: string;
};

export type FaqItem = {
  question: string;
  answer: string;
  price: string;
  cta: string;
  badge?: string;
};

export const introWords = ["Your", "Space", "Ready."];

export const quickPoints = [
  {
    title: "Writers",
    description:
      "Blog drafts, podcast scripts, and daily writing rituals in one flowing workspace.",
  },
  {
    title: "Creators",
    description:
      "Ideas, production checklists, and references connected in visual boards.",
  },
  {
    title: "Product Teams",
    description:
      "Meeting notes, action items, and planning docs linked to the same context.",
  },
  {
    title: "Students",
    description:
      "Lecture notes, coursework, and exam prep built into one organized system.",
  },
  {
    title: "Operators",
    description:
      "Runbooks, task queues, and recurring workflows without bouncing between tools.",
  },
];

export const featureCards: FeatureCardItem[] = [
  {
    tag: "WRITE",
    title: "From first thought to final form",
    description:
      "Capture raw thoughts instantly, then shape them into polished docs you can share.",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80",
    alt: "Creative writing desk with notes",
    bullets: ["Templates", "Write with AI", "Publish and share"],
  },
  {
    tag: "IMAGINE",
    title: "Build with connected workflows",
    description:
      "Turn ideas into systems by connecting docs, automations, and external integrations.",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1400&q=80",
    alt: "Code and integration workflow on monitor",
    bullets: ["MCP connections", "API integrations", "Custom workflows"],
  },
  {
    tag: "PLAN",
    title: "Planning that does not feel like work",
    description:
      "Keep tasks and notes side by side so decisions and execution stay in sync.",
    image:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1400&q=80",
    alt: "Planner with schedule blocks and sticky notes",
    bullets: ["Task embeds", "Calendar context", "Daily focus"],
  },
];

export const capabilityPanels: CapabilityItem[] = [
  {
    title: "Spaces",
    description:
      "Switch between personal and work contexts without losing momentum.",
    detail: "Create dedicated spaces for each role, project, or life area.",
  },
  {
    title: "Folders & Tags",
    description:
      "Classic hierarchy meets flexible tagging for clear and fast retrieval.",
    detail: "Use folders for structure and tags for cross-cutting themes.",
  },
  {
    title: "Collections",
    description:
      "Structured tracking with rich fields, views, and reusable systems.",
    detail: "Build lightweight databases for projects, reading logs, or goals.",
  },
];

export const faqItems: FaqItem[] = [
  {
    question: "Free",
    answer:
      "Full access for occasional use each week. Start quickly with core workflows.",
    price: "IDR 0/month",
    cta: "Get Started",
    badge: "Starter",
  },
  {
    question: "Plus",
    answer:
      "Designed for daily use with deeper customization and richer collaboration flow.",
    price: "IDR 73,250/month",
    cta: "Upgrade to Plus",
    badge: "Popular",
  },
];
