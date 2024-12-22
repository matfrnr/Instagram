import React, { useState, useEffect } from 'react';
import Image from 'next/future/image';
import { useAtom } from 'jotai';
import { collection, query, getDocs, getFirestore, orderBy, startAt, endAt, limit, setDoc, doc, serverTimestamp, updateDoc, arrayUnion } from 'firebase/firestore';
import Router from 'next/router';
import CloseBtnSVG from '../svgComps/CloseBtnSVG';
import ProfilePicSVG from '../svgComps/ProfilePicSVG';
import SelectionBtnSVG from '../svgComps/SelectionBtnSVG';
import atoms, { notificationTypes } from '../../util/atoms';
import app from '../../util/firbaseConfig';

interface Props {
  setCreateChatRoom: React.Dispatch<React.SetStateAction<boolean>>;
}


function CreateChatRoom({ setCreateChatRoom }: Props) {
  const [userNotifications] = useAtom(atoms.userNotifications);

  const [search, setSearch] = useState('');
  const [, setErrorMessage] = useState('');
  const [suggestions, setSuggestions] = useState<notificationTypes[]>([]);
  const [selectedUser, setSelectedUser] = useState<notificationTypes | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    if (!selectedUser) return;

    try {
      const db = getFirestore(app);
      const chatRoomId = userNotifications.userId! + selectedUser.userId;
      const reverseChatRoomId = selectedUser.userId! + userNotifications.userId;

      // Vérifie si la conversation existe déjà
      const hasExistingChat = userNotifications.chatRoomIds?.some(
        id => id === chatRoomId || id === reverseChatRoomId
      );

      if (!hasExistingChat) {
        // Crée la nouvelle conversation
        await setDoc(
          doc(db, chatRoomId, 'users'),
          {
            createdAt: serverTimestamp(),
            [`${selectedUser.username}ChatName`]: userNotifications.username,
            [`${selectedUser.username}Avatar`]: selectedUser.avatarURL,
            [`${selectedUser.username}NewMessage`]: false,
            [`${userNotifications.username}ChatName`]: selectedUser.username,
            [`${userNotifications.username}Avatar`]: userNotifications.avatarURL,
            [`${userNotifications.username}NewMessage`]: false,
          }
        );

        await Promise.all([
          updateDoc(doc(db, 'users', userNotifications.username!), {
            chatRoomIds: arrayUnion(chatRoomId)
          }),
          updateDoc(doc(db, 'users', selectedUser.username!), {
            chatRoomIds: arrayUnion(chatRoomId)
          })
        ]);

        localStorage.setItem('openChatRoom', chatRoomId);
      } else {
        const existingChatId = userNotifications.chatRoomIds?.find(
          id => id === chatRoomId || id === reverseChatRoomId
        );
        localStorage.setItem('openChatRoom', existingChatId!);
      }

      // Fermer le modal et naviguer
      setCreateChatRoom(false);
      Router.push('/Inbox').then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error('Erreur lors de la création de la conversation:', error);
      setErrorMessage('Une erreur est survenue lors de la création de la conversation');
    }
  };

  // Déplacer searchUsers à l'intérieur du useEffect
  useEffect(() => {
    const searchUsers = async (searchTerm: string) => {
      if (searchTerm.length === 0) {
        setSuggestions([]);
        return undefined;
      }

      setIsLoading(true);
      const db = getFirestore(app);

      try {
        const usersRef = collection(db, 'users');
        const q = query(
          usersRef,
          orderBy('username'),
          startAt(searchTerm),
          endAt(`${searchTerm}\uf8ff`),
          limit(10)
        );

        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs
          .map(docSnapshot => docSnapshot.data()) 
          .filter(user => user.username !== userNotifications.username);
        console.log('Terme recherché:', searchTerm);
        console.log('Résultats trouvés:', results);

        setSuggestions(results);
        return undefined;
      } catch (error) {
        console.error('Erreur de recherche:', error);
        setErrorMessage('Une erreur est survenue lors de la recherche');
        return undefined;
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      if (search) {
        searchUsers(search);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, userNotifications.username, setErrorMessage, setSuggestions]);

  const renderSuggestionsList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center p-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0095f6] border-t-transparent" />
        </div>
      );
    }

    if (suggestions.length > 0) {
      return suggestions.map((user) => (
        <button
          key={user.userId}
          type="button"
          onClick={() => setSelectedUser(user)}
          className="w-full text-left"
        >
          <div className="flex items-center gap-3 p-4 hover:bg-gray-100 dark:hover:bg-[#131313]">
            {user.avatarURL ? (
              <Image
                className="h-11 w-11 rounded-full object-cover"
                src={user.avatarURL}
                alt={`Photo de profil de ${user.username}`}
                width="44"
                height="44"
              />
            ) : (
              <div className="h-11 w-11 rounded-full bg-[#efefef] dark:bg-[#070707]">
                <ProfilePicSVG strokeWidth="1.5" />
              </div>
            )}
            <div>
              <p className="font-semibold">{user.username}</p>
              {user.followers && (
                <p className="text-sm text-gray-500">
                  {user.followers.length} abonné{user.followers.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
            {selectedUser?.userId === user.userId && (
              <div className="ml-auto">
                <SelectionBtnSVG ticked />
              </div>
            )}
          </div>
        </button>
      ));
    }

    if (search && !isLoading) {
      return <p className="p-4 text-center text-gray-500">Aucun utilisateur trouvé</p>;
    }

    return null;


  };

  return (
    <div
      role="dialog"
      aria-label="Créer une nouvelle conversation"
      className="fixed top-0 left-0 z-50 flex h-[100vh] w-full items-center justify-center bg-[#0000008f] dark:bg-[#000000d7]"
    >
      <div className="w-[400px] rounded-xl bg-white dark:border dark:border-stone-300 dark:bg-[#000000]">
        <div className="flex items-center justify-between border-b border-stone-300 p-3 dark:border-stone-700">
          <button
            onClick={() => setCreateChatRoom(false)}
            type="button"
            aria-label="Fermer"
          >
            <CloseBtnSVG
              lightColor="#262626"
              darkColor="#f1f5f9"
              heightWidth="20"
            />
          </button>
          <p className="font-bold">Nouveau message</p>
          <button
            className={selectedUser ? 'text-[#0095f6]' : 'pointer-events-none opacity-50'}
            type="button"
            disabled={!selectedUser}
            onClick={handleNext}
          >
            Suivant
          </button>
        </div>

        <div className="mb-2 border-b border-stone-300 p-4 dark:border-stone-700">
          <div className="flex items-center">
            <div className="mr-2 text-base">À :</div>
            <input
              className="flex-1 text-sm focus:outline-none dark:bg-[#000000]"
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Rechercher un utilisateur"
            />
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {renderSuggestionsList()}
        </div>
      </div>
    </div>
  );
}

export default CreateChatRoom;