import Home from '@/app/(afterLogin)/home/page';

type Props = {
  params: { username: string, id: string, photoId: string }
}

export default function Photo({ params}: Props) {
  params.username; // elonmusk
  params.id; // 1
  params.photoId; // 1
  return (
    <>
      <div>인터셉트당한 이미지 페이지입니다.</div>
      <Home />
    </>
  )
}