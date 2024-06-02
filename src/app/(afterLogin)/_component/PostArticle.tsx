'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useCallback } from 'react';
import style from './post.module.scss';
import { Post } from '@/models/Post';

type Props = {
  children: ReactNode,
  post: Post
}

export default function PostArticle({ children, post }: Props) {
  const router = useRouter();
  let target = post;
  if (post.Original) {
    target = post.Original;
  }

  const onConClick = useCallback(() => {
    router.push(`/${target.User.id}/status/${target.postId}`)
  }, [router, target]);

  return (
    <article className={style.post} onClick={onConClick}>
      {children}
    </article>
  )
}