'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import Post from '@/app/(afterLogin)/_component/Post';
import { Post as IPost } from '@/models/Post';
import {getUserPosts} from '@/app/(afterLogin)/[username]/_lib/getUserPosts';


export default function UserPosts({username}: {username: string}) {
  const { data } = useQuery<IPost[], Object, IPost[], [_1: string, _2: string, string]>({
    queryKey: ['posts', 'users', username],
    queryFn: getUserPosts,
    staleTime: 60 * 1000,
    gcTime: 300 * 100,
  });
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(['users', username]);
  if (!user) return null;
  return (
  data?.map((post: IPost) => (
      <Post post={post} key={post.postId} />
    ))
  )
}