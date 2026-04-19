export type ProfileUiModel = {
  profile: {
    name: string;
    email: string;
    joinedAt: string;
  };
  stats: {
    totalNotes: number;
    notesThisMonth: number;
  };
  upcomingNotes: Array<{
    id: number;
    title: string;
    noteDate: string;
  }>;
};

export const PROFILE_UI_MOCKS: ProfileUiModel = {
  profile: {
    name: "Guest User",
    email: "guest@example.com",
    joinedAt: "2026-01-20",
  },
  stats: {
    totalNotes: 24,
    notesThisMonth: 7,
  },
  upcomingNotes: [
    {
      id: 4101,
      title: "Review backlog sprint",
      noteDate: "2026-05-08",
    },
    {
      id: 4102,
      title: "Susun agenda demo internal",
      noteDate: "2026-05-10",
    },
    {
      id: 4103,
      title: "Siapkan catatan release note",
      noteDate: "2026-05-12",
    },
  ],
};
