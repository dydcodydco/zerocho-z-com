
import { User } from '@/models/User';
import { QueryFunction } from '@tanstack/react-query';
import { cookies } from 'next/headers';

export const getUserServer = async ({ queryKey }: { queryKey: [string, string] }) => {
  const [_1, username] = queryKey;
  const res = await fetch(`http://localhost:9090/api/users/${username}`, {
    // 리액트 쿼리가 아니라 넥스트 서버에서 별도로 관리하는 캐싱
    next: {
      // 데이터를 업데이트할 때 필요한 태그만 revalidate는 관련된거 전체
      tags: ['users', username],
    },
    // 캐싱 안하는 값, 너무 캐싱이 강하면 데이터를 새로 불러오지 못한다.
    // 이걸 넣어도 서버(서버 컴포넌트) 실행될때에는 쿠키가 브라우저에 전달 안되는 문제가 있다.
    // 쿠키를 브라우저에 넣으려면 직접적으로 넣어줘야한다.
    cache: 'no-store',
    // 데이터를 가져오는 함수가 서버, 클라이언트 컴포넌트 모두에서 쓰이면 문제가 있다.
    // 서버에서 쓰이면 쿠키 못 가져오고, headers로 쓰자니 에러 발생한다.
    headers: {Cookie: cookies().toString()}, // 클라이언트 컴포넌트에선 못 쓴다.
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  // 받아온 데이터 자동 저장 (서버에서 캐싱한다)
  return res.json();
}