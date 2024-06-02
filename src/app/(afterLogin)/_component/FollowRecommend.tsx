'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import style from './followRecommend.module.scss';
import { User } from '@/models/User';
import { MouseEventHandler, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { produce } from 'immer';
import cx from 'classnames';
import Link from 'next/link';

export default function FollowRecommend({ user }: { user: User }) {
  const { data: session } = useSession();
  const followed = !!user.Followers?.find(d => d.id === session?.user?.email);
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

  const onFollow: MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    if (followed) {
      unfollow.mutate(user.id);
    } else {
      follow.mutate(user.id);
    }
  }, [followed, follow, unfollow, user.id]);
  return (
    <Link href={`/${user.id}`} className={style.container}>
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
        <button onClick={onFollow}>{followed ? '팔로잉' : '팔로우'} {user._count.Followers}</button>
      </div>
    </Link>
  )
}