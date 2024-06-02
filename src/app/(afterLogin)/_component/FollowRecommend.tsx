'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import style from './followRecommend.module.scss';
import { User } from '@/models/User';
import { useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { produce } from 'immer';
import cx from 'classnames';

export default function FollowRecommend({ user }: { user: User }) {
  const { data: session } = useSession();
  const followed = !!user.Followers?.find(d => d.userId === session?.user?.email);
  const queryClient = useQueryClient();

  const follow = useMutation({
    mutationFn: (userId: string) => {
      return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}/follow`, {
        credentials: 'include',
        method: 'post',
      });
    },
    onMutate(userId: string) {
      const value: User[] | undefined = queryClient.getQueryData(['users', 'followRecommends']);
      if (value) {
        const index = value.findIndex(v => v.id === userId);
        const shallow = produce(value, draft => {
          draft[index].Followers = [...draft[index].Followers, {userId: session?.user?.email as string}];
          draft[index]._count.Followers += 1;
        });
        queryClient.setQueryData(['users', 'followRecommends'], shallow);
      }
    },
    onError(error) {
      console.log(error);
    }
  })
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
        const shallow = produce(value, draft => {
          draft[index].Followers = draft[index].Followers.filter(d => d.userId !== session?.user?.email);
          draft[index]._count.Followers -= 1;
        });
        queryClient.setQueryData(['users', 'followRecommends'], shallow);
      }
    },
    onError(error) {
      console.log(error);
    }
  })
  const onFollow = useCallback(() => {
    if (followed) {
      unfollow.mutate(user.id);
    } else {
      follow.mutate(user.id);
    }
  }, [followed, follow, unfollow, user.id]);
  return (
    <div className={style.container}>
      <div className={style.userLogoSection}>
        <div className={style.userLogo}>
          <img src={user.image} alt={user.id} />
        </div>
      </div>
      <div className={style.userInfo}>
        <div className={style.title}>{user.nickname}</div>
        <div className={style.count}>@{user.id}</div>
      </div>
      <div className={cx(style.followButtonSection, followed && style.followed)}>
        <button onClick={onFollow}>{followed ? '팔로잉' : '팔로우'}</button>
      </div>
    </div>
  )
}