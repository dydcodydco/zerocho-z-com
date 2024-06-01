import style from './search.module.scss';
import BackButton from "@/app/(afterLogin)/_component/BackButton";
import SearchForm from "@/app/(afterLogin)/_component/SearchForm";
import Tab from '@/app/(afterLogin)/search/_component/Tab';
import SearchResult from '@/app/(afterLogin)/search/_component/SearchResult';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { getSearchResult } from './_lib/getSearchResult';

type Props = {
  searchParams: { q: string, f?: string, pf?: string };
}
export default async function Search({ searchParams }: Props) {
  // 서버에서 받은 데이터를 reqct-query가 물려받는다.
  const queryClient = new QueryClient();
  // ['posts', 'recommends'] 이런 키를 갖고 있다면 getPostRecommend 함수를 실행해라.
  await queryClient.prefetchQuery({ queryKey: ['posts', 'search', searchParams], queryFn: getSearchResult });
  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <main className={style.main}>
        <div className={style.searchTop}>
          <div className={style.searchZone}>
            <div className={style.buttonZone}>
              <BackButton/>
            </div>
            <div className={style.formZone}>
              <SearchForm q={searchParams.q} />
            </div>
          </div>
          <Tab/>
        </div>
        <div className={style.list}>
          <SearchResult searchParams={searchParams} />
        </div>
      </main>
    </HydrationBoundary>
  )
}