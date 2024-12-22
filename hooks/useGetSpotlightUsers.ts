/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useAtom } from 'jotai';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import atoms, { notificationTypes } from '../util/atoms'; // Importez notificationTypes
import app from '../util/firbaseConfig';

function useGetSpotlightedUsers() {
  const db = getFirestore(app);
  const [usersListArray] = useAtom(atoms.usersListArray);
  const [userNotifications] = useAtom(atoms.userNotifications);
  const [userDetails] = useAtom(atoms.userDetails);
  const [, setSpotlightUsers] = useAtom(atoms.spotlightUsers);

  React.useEffect(() => {
    async function loadUsers() {
      if (userNotifications.username) {
        const usersListFiltered = usersListArray.filter(
          (e) => e !== userDetails.displayName
        );

        const randomFiveUsers = usersListFiltered
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);

        // Ajout du typage pour les données Firebase
        const userPromises = randomFiveUsers.map(async (username) => {
          const docRef = doc(db, 'users', username);
          const docSnap = await getDoc(docRef);
          const userData = docSnap.data();
          // Vérifions que userData existe et convertissons-le en notificationTypes
          return userData ? userData as notificationTypes : null;
        });

        const users = (await Promise.all(userPromises)).filter((user): user is notificationTypes => user !== null);
        setSpotlightUsers(users);
      }
    }

    loadUsers();
  }, [userNotifications.username]);
}

export default useGetSpotlightedUsers;