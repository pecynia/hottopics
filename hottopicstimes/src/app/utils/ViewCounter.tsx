import db from './db';

type ViewCounterProps = {
  slug: string;
};

const ViewCounter: React.FC<ViewCounterProps> = ({ slug }) => {
  // This will run on the server
  db.incrementStoryViews(slug);

  // You can return null or a view count component if you want to display the count
  return null;
};

export default ViewCounter;
