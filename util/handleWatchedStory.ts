import { getFirestore, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import app from './firbaseConfig';

function handleWatchedStory({
  storyUsername,
  watcherUsername,
}: {
  storyUsername: string;
  watcherUsername: string;
}) {
  const db = getFirestore(app);
  const userRef = doc(db, 'users', storyUsername);

  updateDoc(userRef, {
    storyViews: arrayUnion(watcherUsername)
  }).then(() => {
    console.log('Story marked as viewed');
  }).catch((error) => {
    console.error('Error marking story as viewed:', error);
  });
}

export default handleWatchedStory;
