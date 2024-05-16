import style from './profile.module.scss';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import UserPosts from '@/app/(afterLogin)/[username]/_component/UserPosts';
import UserInfo from '@/app/(afterLogin)/[username]/_component/UserInfo';
import { getUserPosts } from '@/app/(afterLogin)/[username]/_lib/getUserPosts';
import { getUser } from '@/app/(afterLogin)/[username]/_lib/getUser';

type Props = {
  params: {username: string}
}

export default async function Page({ params }: Props) {
  const { username } = params;
  const queryClient = new QueryClient();
  
  // ['posts', 'recommends'] 이런 키를 갖고 있다면 getPostRecommend 함수를 실행해라.
  await queryClient.prefetchQuery({ queryKey: ['users', username], queryFn: getUser });
  await queryClient.prefetchQuery({ queryKey: ['posts', 'users', username], queryFn: getUserPosts });
  const dehydratedState = dehydrate(queryClient);

  return (
    <main className={style.main}>
      <HydrationBoundary state={dehydratedState}>
        <UserInfo username={username} />
        <div>
          <UserPosts username={username} />
        </div>
      </HydrationBoundary>
    </main>
  )
}