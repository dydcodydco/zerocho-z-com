'use client';

import { Post as IPost } from '@/models/Post'
import { useQuery } from '@tanstack/react-query'
import { getSinglePost } from '@/app/(afterLogin)/[username]/status/[id]/_lib/getSinglePost';
import Post from '@/app/(afterLogin)/_component/Post';

export default function SinglePost({id, noImage}: {id: string, noImage?: boolean}) {
  const { data: post, error } = useQuery<IPost, Object, IPost, [_1: string,  _2: string]>({
    queryKey: ['posts', id],
    queryFn: getSinglePost,
    staleTime: 60 * 1000,
    gcTime: 300 * 100,
  });
  console.log(post, '--------------------------single post');
  if (error) {
    return (
      <div style={{
        height: 100, alignItems: 'center', fontSize: 31, fontWeight: 'bold', display: 'flex', justifyContent: 'center'
      }}>게시글을 찾을 수 없습니다.</div>
    )
  }
  if (!post) {
    return null;
  }
  return <Post post={post} key={post.postId} noImage={noImage} />
}