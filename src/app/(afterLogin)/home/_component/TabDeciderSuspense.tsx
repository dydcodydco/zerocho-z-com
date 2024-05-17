import { Suspense } from 'react';
import TabDecider from './TabDecider';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
// 서버에서 실행
import { getPostRecommends } from '@/app/(afterLogin)/_lib/getPostRecommends';

export default async function TabDeciderSuspense() {
  // 서버에서 받은 데이터를 reqct-query가 물려받는다.
  const queryClient = new QueryClient();
  // ['posts', 'recommends'] 이런 키를 갖고 있다면 getPostRecommend 함수를 실행해라.
  await queryClient.prefetchInfiniteQuery({
    queryKey: ['posts', 'recommends'],
    queryFn: getPostRecommends,
    initialPageParam: 0,
  });
  const dehydratedState = dehydrate(queryClient);
  // throw new Error('Failed to fetch data');

  // 데이터를 가져오려면 키가 문자열이 아니라 배열이다.
  // queryClient.getQueriesData(['posts', 'recommends']);
  return (
    <HydrationBoundary state={dehydratedState}>
      <TabDecider />
    </HydrationBoundary>
  )
}