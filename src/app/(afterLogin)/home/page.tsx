import style from './home.module.scss'
import Tab from "@/app/(afterLogin)/home/_component/Tab";
import TabProvider from "@/app/(afterLogin)/home/_component/TabProvider";
import PostForm from "@/app/(afterLogin)/home/_component/PostForm";
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import TabDecider from "@/app/(afterLogin)/home/_component/TabDecider";
// 서버에서 실행
import { getPostRecommends } from '@/app/(afterLogin)/_lib/getPostRecommends';

export default async function Home() {
  // 서버에서 받은 데이터를 reqct-query가 물려받는다.
  const queryClient = new QueryClient();
  // ['posts', 'recommends'] 이런 키를 갖고 있다면 getPostRecommend 함수를 실행해라.
  await queryClient.prefetchInfiniteQuery({
    queryKey: ['posts', 'recommends'],
    queryFn: getPostRecommends,
    initialPageParam: 0,
  });
  const dehydratedState = dehydrate(queryClient);

  // 데이터를 가져오려면 키가 문자열이 아니라 배열이다.
  // queryClient.getQueriesData(['posts', 'recommends']);

  return (
    <main className={style.main}>
      <HydrationBoundary state={dehydratedState}>
        <TabProvider>
          <Tab />
          <PostForm />
          <TabDecider />
        </TabProvider>
      </HydrationBoundary>
    </main>
  );
}
