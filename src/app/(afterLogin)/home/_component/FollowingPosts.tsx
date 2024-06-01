'use client';

import { InfiniteData, useQuery, useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
// 클라이언트에서 실행
import { getFollowingPosts } from '@/app/(afterLogin)/home/_lib/getFollowingPosts';
import Post from '@/app/(afterLogin)/_component/Post';
import { Post as IPost } from '@/models/Post';
import { useInView } from 'react-intersection-observer';
import { Fragment, useEffect } from 'react';

export default function FollowingPosts() {
  const {
    data,
    isPending,
    isError,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery<IPost[], Object, InfiniteData<IPost[]>, [_1: string, _2: string], number>({
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
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.at(-1)?.postId,
  })

  const { ref, inView } = useInView({
    // 문턱, 즉 ref가 보이고나서 몇 px정도에 이벤트 호출해줄껀가?  0 --> 보이자마자 호출할꺼다.
    threshold: 0,
    // ref가 보이고나서 몇초후에 이벤트 호출할껀가?
    delay: 0,
  });

  useEffect(() => {
    // console.log('inView', inView);
    // console.log('isFetching', isFetching);
    // console.log('hasNextPage', hasNextPage);
    if (inView) {
      // 화면에 ref가 보였을때, inView가 true일때 작동하는 코드
      // hasNextPage(다음페이지)가 존재해야 호출
      // isFetching = 리액트쿼리가 데이터를 가져오는 순간, 이게 false일때 즉, 가져오고있지 않을때 호출해야한다.
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (isError) {
    return 'postRecommends 에러 발생'
  }

  return (
    <>
      {data?.pages.map((pages: IPost[], index: number) => (
        <Fragment key={index}>
          {pages.map((post: IPost) => <Post post={post} key={post.postId} />)}  
        </Fragment>
      ))}
      {hasNextPage && <div ref={ref} style={{ height: 50 }}></div>}
    </>
  )
}