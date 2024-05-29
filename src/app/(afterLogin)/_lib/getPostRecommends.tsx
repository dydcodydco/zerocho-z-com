// export const getPostRecommend: QueryFunction<Post[], [_1: string, _2: string], number> = async ({queryKey, pageParam}) => {
export async function getPostRecommends({pageParam}: {pageParam: number}) {
  const res = await fetch(`http://localhost:9090/api/posts/recommends?cursor=${pageParam}`, {
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