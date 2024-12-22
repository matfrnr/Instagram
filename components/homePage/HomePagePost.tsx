/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import Image from 'next/future/image';
import { useAtom } from 'jotai';
import Link from 'next/link';
import PostPopUp from '../PostPopUp';
import HeartHollow from '../svgComps/HeartHollow';
import HeartSVG from '../svgComps/HeartSVG';
import handleLikePost from '../../util/handleLikePost';
import CommentSVG from '../svgComps/CommentSVG';
import HomePagePostHeaderComments from './HomePagePostHeaderComments';
import PostTextArea from '../PostTextArea';
import atoms from '../../util/atoms';
import ProfilePicSVG from '../svgComps/ProfilePicSVG';
import NoPostsFiller from './NoPostsFiller';

interface Props {
  username: string;
  index: number;
}

const HomePagePost = ({ username, index }: Props) => {
  const [darkMode] = useAtom(atoms.darkMode);
  const [userDetails] = useAtom(atoms.userDetails);
  const [homePagePosts] = useAtom(atoms.homePagePosts);
  const [userNotifications] = useAtom(atoms.userNotifications);

  const [postPopUp, setPostPopUp] = React.useState(false);

  const postDetails = homePagePosts[username];

  // si aucun utilisateur suivi
  if (username === 'null') {
    return <NoPostsFiller />;
  }

  return (
    <div>
      {postDetails?.comments ? (
        <div className="my-4 overflow-hidden rounded-lg border border-stone-300 bg-white dark:border-stone-700 dark:bg-[#1c1c1c]">
          {postPopUp ? (
            <PostPopUp
              postInformation={postDetails}
              postUserDetails={postDetails.comments[0]}
              setPostPopUp={setPostPopUp}
            />
          ) : (
            ''
          )}
          <div className="ml-3 flex items-center py-3">
            <Link href={username}>
              <a>
                {postDetails.comments[0].avatarURL && postDetails.comments[0].avatarURL.length > 0 ? (
                  <Image
                    className="h-8 w-8 cursor-pointer select-none rounded-full object-cover"
                    src={postDetails.comments[0].avatarURL}
                    alt="avatar"
                    width="32"
                    height="32"
                  />
                ) : (
                  <div className="h-8 w-8 cursor-pointer select-none rounded-full">
                    <ProfilePicSVG strokeWidth="1" />
                  </div>
                )}
              </a>
            </Link>
            <Link href={username}>
              <a>
                <p className="ml-4 cursor-pointer">
                  {postDetails.comments[0].username}
                </p>
              </a>
            </Link>
          </div>
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              setPostPopUp(true);
              document.body.style.overflow = 'hidden';
            }}
          >
            {index === 0 ? (
              <Image
                className="h-auto min-h-[150px] w-full select-none bg-[#ebebeb] dark:bg-[#313131]"
                src={postDetails.imgURL}
                alt="publication"
                width="0"
                height="0"
                sizes="100vw"
                priority
              />
            ) : (
              <Image
                className="h-auto min-h-[150px] w-full select-none bg-[#ebebeb] dark:bg-[#313131]"
                src={postDetails.imgURL}
                alt="publication"
                width="0"
                height="0"
                sizes="100vw"
              />
            )}
          </div>
          <div>
            <div className="border-t border-stone-200 px-5 py-4 dark:border-stone-700">
              <div className="mb-3 flex gap-4">
                {userNotifications.likedPosts!.includes(postDetails.postID) ? (
                  <button
                    id="unlike"
                    type="button"
                    onClick={(e) =>
                      handleLikePost({
                        e,
                        userDetails,
                        postUserDetails: postDetails.comments[0],
                        postInformation: postDetails,
                      })
                    }
                  >
                    <div className="group">
                      <div className="sm:group-hover:animate-bounce">
                        <HeartSVG fillColor="#ed4956" height="24" width="24" />
                      </div>
                    </div>
                  </button>
                ) : (
                  <button
                    id="like"
                    type="button"
                    onClick={(e) =>
                      handleLikePost({
                        e,
                        userDetails,
                        postUserDetails: postDetails.comments[0],
                        postInformation: postDetails,
                      })
                    }
                  >
                    <div className="group">
                      <div className="sm:group-hover:animate-bounce">
                        <HeartHollow />
                      </div>
                    </div>
                  </button>
                )}
                <button
                  type="button"
                  className="h-6 w-6 cursor-pointer"
                  onClick={() => {
                    setPostPopUp(true);
                    document.body.style.overflow = 'hidden';
                  }}
                >
                  <div className="group">
                    <div className="sm:group-hover:animate-bounce">
                      <CommentSVG
                        outline={darkMode ? '#f1f5f9' : '#262626'}
                        height="24"
                        width="24"
                        fill="none"
                      />
                    </div>
                  </div>
                </button>
              </div>
              <div className="flex text-sm">
                <p>
                  Aimé par{' '}
                  <b>
                    {postDetails.likes.length > 0 ? (
                      <Link href={postDetails.likes[0]}>
                        <a>{postDetails.likes[0]}</a>
                      </Link>
                    ) : (
                      ''
                    )}
                  </b>{' '}
                </p>
                {postDetails.likes.length === 1 ? (
                  ''
                ) : (
                  <div className="pl-1">
                    {postDetails.likes.length > 0 ? 'et' : ''}{' '}
                    <b>
                      {postDetails.likes.length} autre
                      {postDetails.likes.length === 1 ? '' : 's'}
                    </b>
                  </div>
                )}
              </div>
              <div className="max-h-[260px] overflow-hidden">
                <HomePagePostHeaderComments postDetails={postDetails} />
              </div>
              <button
                className="mt-3 text-xs text-[#a5a5a5]"
                type="button"
                onClick={() => {
                  setPostPopUp(true);
                  document.body.style.overflow = 'hidden';
                }}
              >
                {postDetails.comments.length === 1 &&
                  postDetails.comments[0].text === '' ? (
                  <div>Pas de commentaires</div>
                ) : (
                  <div>
                    {postDetails.comments.length === 2 ? (
                      <p>Voir le 1er commentaire</p>
                    ) : (
                      <p>Voir les {postDetails.comments.length - 1} commentaires</p>
                    )}
                  </div>
                )}
              </button>
              <p className="pt-2 text-xs text-[#a5a5a5]">
                {new Date(postDetails.createdAt.seconds * 1000).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>

            </div>
            <PostTextArea
              postInformation={postDetails}
              postUserDetails={postDetails.comments[0]}
            />
          </div>
        </div>
      ) : (
        <picture>
          <img
            className="h-0 w-0 opacity-0"
            src="/instagramLoading.png"
            alt="avatar"
          />
        </picture>
      )}
    </div>
  );
};

export default HomePagePost;
