'use client';

import BackButton from '@/app/(afterLogin)/_component/BackButton';
import style from '../profile.module.scss';
import { useQuery } from '@tanstack/react-query';
import { User } from '@/models/User';
import { getUser } from '@/app/(afterLogin)/[username]/_lib/getUser';

export default function UserInfo({ username }: { username: string }) {
  const { data: user, error, isLoading } = useQuery<User, Object, User, [_1:string, string]>({
    queryKey: ['users', username],
    queryFn: getUser,
    staleTime: 60 * 1000,
    gcTime: 300 * 100,
  })

  // console.log(error);
  // console.dir(error);
  if (error) {
    return (
      <>
        <div className={style.header}>
          <BackButton />
          <h3 className={style.headerTitle}>프로필</h3>
        </div>
        <div className={style.userZone}>
          <div className={style.userImage}>
          </div>
          <div className={style.userName}>
            <div>@{username}</div>
          </div>
        </div>
        <div style={{
          height: 100, alignItems: 'center', fontSize: 31, fontWeight: 'bold', display: 'flex', justifyContent: 'center'
        }}>계정이 존해하지 않을 않.</div>
      </>
    )
  }
  if (!user) return null;
  return (
    <>
      <div className={style.header}>
        <BackButton />
        <h3 className={style.headerTitle}>{user.nickname}</h3>
      </div>
      <div className={style.userZone}>
        <div className={style.userImage}>
          <img src={user.image} alt={user.id}/>
        </div>
        <div className={style.userName}>
          <div>{user.nickname}</div>
          <div>@{user.id}</div>
        </div>
        <button className={style.followButton}>팔로우</button>
      </div>
    </>
  )
}