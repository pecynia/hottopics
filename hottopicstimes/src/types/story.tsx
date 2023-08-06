import { Key } from "react";

export type Story = {
  _id: Key;
  slug: string;
  title: string;
  content: string;
  views: number;
};

export type StoryPageProps = {
  story: Story | null;
};
