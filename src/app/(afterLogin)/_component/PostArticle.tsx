'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useCallback } from 'react';
import style from './post.module.scss';

type Props = {
  children: ReactNode,
  post: {
    postId: number,
    User: {
      id: string,
      nickname: string,
      image: string,
    },
    content: string,
    createdAt: Date,
    Images: any[], // 나중에 제대로 바꿀것
  },
}

export default function PostArticle({ children, post }: Props) {
  const router = useRouter();
  const onConClick = useCallback(() => {
    router.push(`/${post.User.id}/status/${post.postId}`)
  }, [router, post])
  return (
    <article className={style.post} onClickCapture={onConClick}>
      {children}
    </article>
  )
}