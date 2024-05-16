'use client';

import { useQuery } from '@tanstack/react-query';
import Post from '@/app/(afterLogin)/_component/Post';
import { Post as IPost } from '@/models/Post';
import { getSearchResult } from '@/app/(afterLogin)/search/_lib/getSearchResult';

type Props = {
  searchParams: { q: string, f?: string, pf?: string };
}

export default function SearchResult({ searchParams }: Props) {
  const { data } = useQuery<IPost[], Object, IPost[], [_1: string, _2: string, Props['searchParams']]>({
    // 4번째 자리의 [_1: string, _2: string, Props['searchParams']]이게 queryKey에 대한 타입
    // 넥스트 서버의 태그에는 객체가 들어갈 수 없어서, searchParams.q, 리액트 키에는 객체들어갈 수 있어서 searchParams
    // searchParams 이런 잘 바뀌는건 다이나믹 쿼리키!
    queryKey: ['posts', 'search', searchParams],
    queryFn: getSearchResult,
    staleTime: 60 * 1000,
    gcTime: 300 * 100,
  })
  return (
    data?.map((post: IPost) => (
      <Post post={post} key={post.postId} />
    ))
  )
}