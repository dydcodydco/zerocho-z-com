'use client';

import { useQuery } from '@tanstack/react-query';
// 클라이언트에서 실행
import { getPostRecommend } from '@/app/(afterLogin)/_lib/getPostRecommends';
import Post from '@/app/(afterLogin)/_component/Post';
import { Post as IPost } from '@/models/Post';


export default function PostRecommends() {
  const {data} = useQuery<IPost[]>({queryKey: ['posts', 'recommends'], queryFn: getPostRecommend})
  return (
    data?.map((post: IPost) => (
      <Post post={post} key={post.postId} />
    ))
  )
}