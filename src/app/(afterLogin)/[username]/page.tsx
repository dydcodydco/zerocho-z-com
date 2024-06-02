import style from './profile.module.scss';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import UserPosts from '@/app/(afterLogin)/[username]/_component/UserPosts';
import UserInfo from '@/app/(afterLogin)/[username]/_component/UserInfo';
import { getUserPosts } from '@/app/(afterLogin)/[username]/_lib/getUserPosts';
import { getUserServer } from '@/app/(afterLogin)/[username]/_lib/getUserServer';
import { auth } from '@/auth';
import { Metadata } from 'next';
import { User } from '@/models/User';

type Props = {
  params: {username: string}
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user: User = await getUserServer({ queryKey: ["users", params.username] });
  return {
    title: `${user.nickname} (${user.id}) / Z`,
    description: `${user.nickname} (${user.id}) 프로필`
  }
}

export default async function Page({ params }: Props) {
  const { username } = params;
  const queryClient = new QueryClient();
  const session = await auth();
  
  // ['posts', 'recommends'] 이런 키를 갖고 있다면 getPostRecommend 함수를 실행해라.
  await queryClient.prefetchQuery({ queryKey: ['users', username], queryFn: getUserServer });
  await queryClient.prefetchQuery({ queryKey: ['posts', 'users', username], queryFn: getUserPosts });
  const dehydratedState = dehydrate(queryClient);

  return (
    <main className={style.main}>
      <HydrationBoundary state={dehydratedState}>
        <UserInfo session={session} username={username} />
        <div>
          <UserPosts username={username} />
        </div>
      </HydrationBoundary>
    </main>
  )
}