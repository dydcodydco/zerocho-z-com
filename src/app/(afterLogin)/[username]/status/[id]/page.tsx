import BackButton from "@/app/(afterLogin)/_component/BackButton";
import style from './singlePost.module.scss';
import CommentForm from "@/app/(afterLogin)/[username]/status/[id]/_component/CommentForm";
import SinglePost from '@/app/(afterLogin)/[username]/status/[id]/_component/SinglePost';
import Comments from '@/app/(afterLogin)/[username]/status/[id]/_component/Comments';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { getComments } from '@/app/(afterLogin)/[username]/status/[id]/_lib/getComments';
import { getUserServer } from '../../_lib/getUserServer';
import { User } from '@/models/User';
import { getSinglePostServer } from './_lib/getSinglePostServer';
import { Post } from '@/models/Post';

export async function generateMetadata({params}: Props) {
  const user: User = await getUserServer({ queryKey: ["users", params.username] });
  const post: Post = await getSinglePostServer({ queryKey: ["posts", params.id] });
  return {
    title: `Z에서 ${user.nickname} 님 : ${post.content}`,
    description: post.content,
  }
}

type Props = {
  params: { id: string, username: string }
}

export default async function Pasge({ params }: Props) {
  console.log('----------------------------- single post params', params);
  const { id } = params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ['posts', id], queryFn: getSinglePostServer });
  await queryClient.prefetchQuery({ queryKey: ['posts', id, 'comments'], queryFn: getComments });
  const dehydratedState = dehydrate(queryClient);
  return (
    <div className={style.main}>
      <HydrationBoundary state={dehydratedState}>
        <div className={style.header}>
          <BackButton/>
          <h3 className={style.headerTitle}>게시하기</h3>
        </div>
        <SinglePost id={id} />
        <CommentForm id={id} />
        <div>
          <Comments id={id} />
        </div>
      </HydrationBoundary>
    </div>
  )
}