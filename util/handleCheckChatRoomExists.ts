import React from 'react';
import { getFirestore, getDocs, query, where, collection } from 'firebase/firestore';
import app from './firbaseConfig';
import { notificationTypes } from './atoms';

interface Props {
  e: any;
  search: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setSearchedUser: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchedUserData: any;
  userNotifications: notificationTypes;
}

async function handleCheckChatRoomExists({
  e,
  search,
  setError,
  setSearchedUser,
  setSearchedUserData,
  userNotifications,
}: Props) {
  e.preventDefault();
  const db = getFirestore(app);
  const usersRef = collection(db, 'users');

  if (search === '') {
    setError('Veuillez entrer un nom d\'utilisateur');
    setSearchedUser(false);
    return;
  } 

  if (search === userNotifications.username) {
    setError('Vous ne pouvez pas créer une conversation avec vous-même');
    setSearchedUser(false);
    return;
  }

  try {
    // On utilise la recherche sur le tableau usernameQuery
    const q = query(
      usersRef,
      where('usernameQuery', 'array-contains', search.toLowerCase())
    );

    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => doc.data());

    if (results.length === 0) {
      setError('Aucun utilisateur trouvé');
      setSearchedUser(false);
      return;
    }

    // Si on trouve des résultats, on prend le premier utilisateur qui correspond
    setSearchedUserData(results[0]);
    setSearchedUser(true);
    setError('');

  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    setError('Une erreur est survenue lors de la recherche');
    setSearchedUser(false);
  }
}

export default handleCheckChatRoomExists;