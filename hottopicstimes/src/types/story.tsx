export type Story = {
  _id: string;
  slug: string;
  title: string;
  content: string;
  views: number;
};

export type StoryPageProps = {
  story: Story | null;
};

