'use client';

import { useQuery } from '@tanstack/react-query';
// 클라이언트에서 실행
import { getPostRecommend } from '@/app/(afterLogin)/_lib/getPostRecommends';
import Post from '@/app/(afterLogin)/_component/Post';
import { Post as IPost } from '@/models/Post';


export default function PostRecommends() {
  const { data } = useQuery<IPost[]>({
    queryKey: ['posts', 'recommends'],
    queryFn: getPostRecommend,
    // fresh -> stale 가는 시간
    // 60000 -> 1분동안 fresh
    // infinity -> 항상 새롭다
    staleTime: 60 * 1000,
    // garvage collector time 기본 5분
    // inactive = 사용자가 보는화면 어떤 api안쓰면 
    gcTime: 300 * 100,
  })
  return (
    data?.map((post: IPost) => (
      <Post post={post} key={post.postId} />
    ))
  )
}