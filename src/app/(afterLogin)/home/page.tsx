import style from './home.module.scss'
import Tab from "@/app/(afterLogin)/home/_component/Tab";
import TabProvider from "@/app/(afterLogin)/home/_component/TabProvider";
import PostForm from "@/app/(afterLogin)/home/_component/PostForm";
import PostRecommends from "@/app/(afterLogin)/_component/PostRecommends";
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
// 서버에서 실행
import { getPostRecommend } from '@/app/(afterLogin)/_lib/getPostRecommends';

export default async function Home() {
  // const {tab, setTab} = useContext(TabContext);

  // 서버에서 받은 데이터를 reqct-query가 물려받는다.
  const queryClient = new QueryClient();
  // ['posts', 'recommends'] 이런 키를 갖고 있다면 getPostRecommend 함수를 실행해라.
  await queryClient.prefetchQuery({ queryKey: ['posts', 'recommends'], queryFn: getPostRecommend });
  const dehydratedState = dehydrate(queryClient);

  // 데이터를 가져오려면 키가 문자열이 아니라 배열이다.
  // queryClient.getQueriesData(['posts', 'recommends']);

  return (
    <main className={style.main}>
      <HydrationBoundary state={dehydratedState}>
        <TabProvider>
          <Tab />
          <PostForm />
          <PostRecommends />
        </TabProvider>
      </HydrationBoundary>
    </main>
  );
}
