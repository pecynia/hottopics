import db from '@/app/[lang]/utils/db';

type ViewCounterProps = {
  slug: string;
};

const ViewCounter: React.FC<ViewCounterProps> = ({ slug }) => {
  db.incrementStoryViews(slug);
  return null;
};

export default ViewCounter;
