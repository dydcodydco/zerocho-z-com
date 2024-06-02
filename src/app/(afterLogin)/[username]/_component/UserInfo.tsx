'use client';

import BackButton from '@/app/(afterLogin)/_component/BackButton';
import style from '../profile.module.scss';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { User } from '@/models/User';
import { getUser } from '@/app/(afterLogin)/[username]/_lib/getUser';
import cx from 'classnames';
import { useSession } from 'next-auth/react';
import { MouseEventHandler, useCallback } from 'react';
import { produce } from 'immer';

export default function UserInfo({ username }: { username: string }) {
  const { data: user, error, isLoading } = useQuery<User, Object, User, [_1: string, string]>({
    queryKey: ['users', username],
    queryFn: getUser,
    staleTime: 60 * 1000,
    gcTime: 300 * 100,
  });
  const { data: session } = useSession();
  const followed = !!user?.Followers?.find((v) => v.id === session?.user?.email);
  const queryClient = useQueryClient();
  const follow = useMutation({
    mutationFn: (userId: string) => {
      return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}/follow`, {
        credentials: 'include',
        method: 'post',
      });
    },
    onMutate(userId: string) {
      console.log(session, '-------------followRecommend session');
      const value: User[] | undefined = queryClient.getQueryData(['users', 'followRecommends']);
      if (value) {
        const index = value.findIndex(v => v.id === userId);
        if (index > -1) {
          const shallow = produce(value, draft => {
            draft[index].Followers = [{ id: session?.user?.email as string }];
            draft[index]._count.Followers += 1;
          });
          queryClient.setQueryData(['users', 'followRecommends'], shallow);
        }
      }

      const value2: User | undefined = queryClient.getQueryData(['users', userId]);
      if (value2) {
        const shallow = produce(value2, draft => {
          draft.Followers = [{ id: session?.user?.email as string }];
          draft._count.Followers += 1;
        });
        queryClient.setQueryData(['users', userId], shallow);
      }
    },
    onError(error, userId: string) {
      const value: User[] | undefined = queryClient.getQueryData(['users', 'followRecommends']);
      if (value) {
        const index = value.findIndex(v => v.id === userId);
        if (index > -1) {
          const shallow = produce(value, draft => {
            draft[index].Followers = draft[index].Followers.filter(d => d.id !== session?.user?.email);
            draft[index]._count.Followers -= 1;
          });
          queryClient.setQueryData(['users', 'followRecommends'], shallow);
        }
      }

      const value2: User | undefined = queryClient.getQueryData(['users', userId]);
      if (value2) {
        const shallow = produce(value2, draft => {
          draft.Followers = draft.Followers.filter(d => d.id !== session?.user?.email);
          draft._count.Followers -= 1;
        });
        queryClient.setQueryData(['users', userId], shallow);
      }
    },
    onSettled() {
    }
  });

  const unfollow = useMutation({
    mutationFn: (userId: string) => {
      return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}/follow`, {
        credentials: 'include',
        method: 'delete',
      });
    },
    onMutate(userId: string) {
      const value: User[] | undefined = queryClient.getQueryData(['users', 'followRecommends']);
      if (value) {
        const index = value.findIndex(v => v.id === userId);
        if (index > -1) {
          const shallow = produce(value, draft => {
            draft[index].Followers = draft[index].Followers.filter(d => d.id !== session?.user?.email);
            draft[index]._count.Followers -= 1;
          });
          queryClient.setQueryData(['users', 'followRecommends'], shallow);
        }
      }

      const value2: User | undefined = queryClient.getQueryData(['users', userId]);
      if (value2) {
        const shallow = produce(value2, draft => {
          draft.Followers = draft.Followers.filter(d => d.id !== session?.user?.email);
          draft._count.Followers -= 1;
        });
        queryClient.setQueryData(['users', userId], shallow);
      }
    },
    onError(error, userId: string) {
      console.log(session, '-------------followRecommend session');
      const value: User[] | undefined = queryClient.getQueryData(['users', 'followRecommends']);
      if (value) {
        const index = value.findIndex(v => v.id === userId);
        if (index > -1) {
          const shallow = produce(value, draft => {
            draft[index].Followers = [{ id: session?.user?.email as string }];
            draft[index]._count.Followers += 1;
          });
          queryClient.setQueryData(['users', 'followRecommends'], shallow);
        }
      }

      const value2: User | undefined = queryClient.getQueryData(['users', userId]);
      if (value2) {
        const shallow = produce(value2, draft => {
          draft.Followers = [{ id: session?.user?.email as string }];
          draft._count.Followers += 1;
        });
        queryClient.setQueryData(['users', userId], shallow);
      }
    }
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
  console.log(user, '--------------userInfo');

  const onFollow: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (followed) {
      unfollow.mutate(user.id);
    } else {
      follow.mutate(user.id);
    }
  };
  
  return (
    <>
      <div className={style.header}>
        <BackButton/>
        <h3 className={style.headerTitle}>{user.nickname}</h3>
      </div>
      <div className={style.userZone}>
        <div className={style.userRow}>
          <div className={style.userImage}>
            <img src={user.image} alt={user.id}/>
          </div>
          <div className={style.userName}>
            <div>{user.nickname}</div>
            <div>@{user.id}</div>
          </div>
          {user.id !== session?.user?.email &&
            <button
              onClick={onFollow}
              className={cx(style.followButton, followed && style.followed)}>{followed ? '팔로잉' : '팔로우'}</button>}
        </div>
        <div className={style.userFollower}>
          <div>
            {user._count.Followers} 팔로워
          </div>
          &nbsp;
          <div>
            {user._count.Followings} 팔로우 중
          </div>
        </div>
      </div>
    </>
  )
}