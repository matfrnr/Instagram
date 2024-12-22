import React, { useRef } from 'react';
import Image from 'next/future/image';
import { useAtom } from 'jotai';
import atoms from '../../util/atoms';
import useCheckNameLength from '../../hooks/useCheckNameLength';
import ViewAllStories from './ViewAllStories';
import useWindowSize from '../../hooks/useWindowSize';
import ProfilePicSVG from '../svgComps/ProfilePicSVG';
import handleWatchedStory from '../../util/handleWatchedStory';

function StoryBoardTag({ username }: { username: string }) {
  const [stories] = useAtom(atoms.stories);
  const [userDetails] = useAtom(atoms.userDetails);

  const [openStories, setOpenStories] = React.useState(false);

  const width = useWindowSize();
  const widthRef = useRef<HTMLDivElement>(null);
  const checkLength = useCheckNameLength({ widthRef });

  // Vérifions que nous obtenons bien les vues
  console.log('Views:', stories[`${username}Views`]);
  console.log('Username:', userDetails.displayName);

  // Vérifie si la story a été vue
  const hasBeenViewed = stories[`${username}Views`]?.includes(userDetails.displayName!);
  console.log('Has been viewed:', hasBeenViewed);

  return (
    <div className="ml-1 flex cursor-pointer flex-col items-start">
      {openStories && (
        <ViewAllStories
          username={username}
          setOpenStories={setOpenStories}
          width={width}
        />
      )}
      <button
        className="group relative"
        type="button"
        onClick={() => {
          setOpenStories(true);
          document.body.style.overflow = 'hidden';
          // Marquer comme vue immédiatement au clic
          handleWatchedStory({
            storyUsername: username,
            watcherUsername: userDetails.displayName!
          });
        }}
      >
        <div className="w-[74px]">
          {stories[`${username}Photo`]?.length === 0 ? (
            <div className="relative z-10 h-14 w-14 select-none rounded-full bg-[#ebebeb] object-cover dark:bg-[#1c1c1c]">
              <ProfilePicSVG strokeWidth="1" />
            </div>
          ) : (
            <div className={`relative ${hasBeenViewed ? 'opacity-50' : ''}`}>
              <Image
                className="relative z-10 h-14 w-14 select-none rounded-full bg-[#ebebeb] object-cover p-[2px] dark:bg-[#1c1c1c]"
                src={stories[`${username}Photo`]}
                alt="avatar"
                width="56"
                height="56"
              />
              <div
                className={`absolute top-[-2px] left-[-2px] z-0 h-[60px] w-[60px] rounded-full ${hasBeenViewed
                    ? 'bg-[#8e8e8e] dark:bg-[#4d4d4d]'
                    : 'bg-gradient-to-tr from-[#ffee00] to-[#d300c8]'
                  }`}
              />
            </div>
          )}
        </div>
      </button>
      <div className="relative mt-2 max-w-[74px] overflow-hidden text-xs">
        <p ref={widthRef}>{username}</p>
        {checkLength.nameWidth === 74 && (
          <div className="absolute top-0 right-0 bg-white pr-[5px] dark:bg-[#1c1c1c]">
            <p>...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StoryBoardTag;