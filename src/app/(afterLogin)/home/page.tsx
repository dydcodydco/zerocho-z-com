import style from './home.module.scss'
import Tab from "@/app/(afterLogin)/home/_component/Tab";
import TabProvider from "@/app/(afterLogin)/home/_component/TabProvider";
import PostForm from "@/app/(afterLogin)/home/_component/PostForm";

import TabDeciderSuspense from '@/app/(afterLogin)/home//_component/TabDeciderSuspense';
import { Suspense } from 'react';
import Loading from './loading';

export default async function Home() {
  return (
    <main className={style.main}>
      <TabProvider>
        <Tab />
        <PostForm />
        {/* suspense는 서버컴포넌트여야만 한다. */}
        {/* suspense는 부모컴포넌트여야지 자식(아래)있는 컴포넌트 감지할 수 있다. */}
        <Suspense fallback={<Loading />}>
          <TabDeciderSuspense />
        </Suspense>
      </TabProvider>
    </main>
  );
}
