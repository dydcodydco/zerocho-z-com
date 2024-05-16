'use client';

import { useQuery } from '@tanstack/react-query';
// 클라이언트에서 실행
import { getFollowingPosts } from '@/app/(afterLogin)/_lib/getFollowingPosts';
import Post from '@/app/(afterLogin)/_component/Post';
import { Post as IPost } from '@/models/Post';


export default function FollowingPosts() {
  const { data } = useQuery<IPost[]>({
    // 쿼리 키
    queryKey: ['posts', 'followings'],
    queryFn: getFollowingPosts,
    // fresh -> stale 가는 시간
    // 60000 -> 1분동안 fresh, 즉 1분뒤에 stale로 바뀐다.
    // staleTime: infinity -> 항상 fresh
    staleTime: 60 * 1000,
    // garvage collector time 기본 5분
    // inactive = 사용자가 보는화면서 해당 데이터를 쓰고 있냐 안쓰고있냐?
    // 예: 홈에서는 post recommend쓰는데 검색페이지에선 안쓴다 그럼 inactiv상태
    // inactive상태일때 gcTime이 돌아간다.
    // 이는 데이터가 많으면 터질수가 있다.인액티브 데이터들 5분뒤면 사라지게 만든다.
    // 시간안에는 캐시에서 가져오고, 지나면 새로 불러온다.
    gcTime: 300 * 100,
    // 일반적으로 staleTime을 gcTime보다 짧게 해야한다.  무조건 staleTime < gcTime!!
  })
  return (
    data?.map((post: IPost) => (
      <Post post={post} key={post.postId} />
    ))
  )
}