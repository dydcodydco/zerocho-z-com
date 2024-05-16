'use client';

import { Post as IPost } from '@/models/Post'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getComments } from '@/app/(afterLogin)/[username]/status/[id]/_lib/getComments';
import Post from '@/app/(afterLogin)/_component/Post';

export default function Comments({id}: {id: string}) {
  const queryClient = useQueryClient();
  const post = queryClient.getQueryData(['posts', id]);
  const { data, error } = useQuery<IPost[], Object, IPost[], [_1: string,  _2: string, _3: string]>({
    queryKey: ['posts', id, 'comments'],
    queryFn: getComments,
    staleTime: 60 * 1000,
    gcTime: 300 * 100,
    enabled: !!post,
  });

  if (!post) return null; 
  return data?.map((post) => <Post post={post} key={post.postId} />)
}