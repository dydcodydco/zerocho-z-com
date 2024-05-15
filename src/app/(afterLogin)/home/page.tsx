import { useContext } from 'react';
import style from './home.module.scss'
import Tab from "@/app/(afterLogin)/home/_component/Tab";
import TabProvider from "@/app/(afterLogin)/home/_component/TabProvider";
import PostForm from "@/app/(afterLogin)/home/_component/PostForm";
import Post from "@/app/(afterLogin)/_component/Post";
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';

// 서버에서 실행
async function getPostRecommend() {
  const res = await fetch('http://localhost:9090/api/postRecommends', {
    next: {
      // 데이터를 업데이트할 때 필요한 태그만 revalidate는 관련된거 전체
      tags: ['posts', 'recommends'],
    },
    // 캐싱 안하는 값, 너무 캐싱이 강하면 데이터를 새로 불러오지 못한다.
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  // 받아온 데이터 자동 저장 (서버에서 캐싱한다)
  return res.json();
}

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
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
        </TabProvider>
      </HydrationBoundary>
    </main>
  );
}
