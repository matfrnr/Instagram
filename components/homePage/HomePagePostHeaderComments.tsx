import Link from 'next/link';
import Image from 'next/future/image';
import { postType } from '../../util/atoms';
import ProfilePicSVG from '../svgComps/ProfilePicSVG';

function HomePagePostHeaderComments({
  postDetails,
}: {
  postDetails: postType;
}) {
  return (
    <div>
      {postDetails.comments[0].text === '' ? (
        ''
      ) : (
        <div className="pt-2 text-sm flex items-center">
          <Link href={postDetails.comments[0].username}>
            <a className="mr-2">
              {postDetails.comments[0].avatarURL ? (
                <Image
                  className="h-8 w-8 cursor-pointer select-none rounded-full object-cover"
                  src={postDetails.comments[0].avatarURL}
                  alt="avatar"
                  width="32"
                  height="32"
                />
              ) : (
                <div className="h-8 w-8">
                  <ProfilePicSVG strokeWidth="1" />
                </div>
              )}
            </a>
          </Link>
          <p>
            <b>
              <Link href={postDetails.comments[0].username}>
                {postDetails.comments[0].username}
              </Link>
            </b>{' '}
            {postDetails.comments[0].text}
          </p>
        </div>
      )}
      {postDetails.comments.length > 1 ? (
        <div className="pt-2 text-sm flex items-center">
          <Link href={postDetails.comments[1].username}>
            <a className="mr-2">
              {postDetails.comments[1].avatarURL ? (
                <Image
                  className="h-8 w-8 cursor-pointer select-none rounded-full object-cover"
                  src={postDetails.comments[1].avatarURL}
                  alt="avatar"
                  width="32"
                  height="32"
                />
              ) : (
                <div className="h-8 w-8">
                  <ProfilePicSVG strokeWidth="1" />
                </div>
              )}
            </a>
          </Link>
          <p>
            <b>
              <Link href={postDetails.comments[1].username}>
                {postDetails.comments[1].username}
              </Link>
            </b>{' '}
            {postDetails.comments[1].text}
          </p>
        </div>
      ) : (
        ''
      )}
      {postDetails.comments.length > 2 &&
      postDetails.comments[0].text === '' ? (
        <div className="pt-2 text-sm flex items-center">
          <Link href={postDetails.comments[2].username}>
            <a className="mr-2">
              {postDetails.comments[2].avatarURL ? (
                <Image
                  className="h-8 w-8 cursor-pointer select-none rounded-full object-cover"
                  src={postDetails.comments[2].avatarURL}
                  alt="avatar"
                  width="32"
                  height="32"
                />
              ) : (
                <div className="h-8 w-8">
                  <ProfilePicSVG strokeWidth="1" />
                </div>
              )}
            </a>
          </Link>
          <p>
            <b>
              <Link href={postDetails.comments[2].username}>
                {postDetails.comments[2].username}
              </Link>
            </b>{' '}
            {postDetails.comments[2].text}
          </p>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default HomePagePostHeaderComments;