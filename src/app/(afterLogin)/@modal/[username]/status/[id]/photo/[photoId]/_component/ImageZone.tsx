'use client';

import { useQuery } from '@tanstack/react-query';
import { Post as IPost } from '@/models/Post';
import style from '@/app/(afterLogin)/@modal/[username]/status/[id]/photo/[photoId]/photoModal.module.scss';
import ActionButtons from '@/app/(afterLogin)/_component/ActionButtons';
import {getSinglePost} from "@/app/(afterLogin)/[username]/status/[id]/_lib/getSinglePost";

export default function ImageZone({id}: {id: string}) {
  const { data: post, error } = useQuery<IPost, Object, IPost, [_1: string,  _2: string]>({
    queryKey: ['posts', id],
    queryFn: getSinglePost,
    staleTime: 60 * 1000,
    gcTime: 300 * 100,
  });

  if (!post?.Images[0]) return null;

  return (
    <div className={style.imageZone}>
      <img src={post.Images[0].link} alt={post.content}/>
      <div className={style.image} style={{backgroundImage: `url(${post.Images[0].link})`}}/>
      <div className={style.buttonZone}>
        <div className={style.buttonInner}>
          <ActionButtons white/>
        </div>
      </div>
    </div>
  )
}