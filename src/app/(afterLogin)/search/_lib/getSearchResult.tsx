import { Post } from '@/models/Post';
import { QueryFunction } from '@tanstack/react-query';

export const getSearchResult: QueryFunction<Post[], [_1: string, _2: string, searchParams: { q: string, f?: string, pf?: string }]>
  = async ({ queryKey }) => {
    const [_1, _2, searchParams] = queryKey;
    const urlSearchParams = new URLSearchParams(searchParams);
    const res = await fetch(`http://localhost:9090/api/posts?${urlSearchParams.toString()}`, {
      // 리액트 쿼리가 아니라 넥스트 서버에서 별도로 관리하는 캐싱
      // 넥스트 서버의 태그에는 객체가 들어갈 수 없어서, searchParams.q, 리액트 키에는 객체들어갈 수 있어서 searchParams
      next: {
        // 데이터를 업데이트할 때 필요한 태그만 revalidate는 관련된거 전체
        tags: ['posts', 'search', searchParams.q],
      },
      // 캐싱 안하는 값, 너무 캐싱이 강하면 데이터를 새로 불러오지 못한다.
      cache: 'no-store',
      credentials: 'include',
    })

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    // 받아온 데이터 자동 저장 (서버에서 캐싱한다)
    return res.json();
}