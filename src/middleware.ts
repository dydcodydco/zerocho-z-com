// auth파일 불러와서 미들웨어 역할
import { auth } from './auth';
import { NextResponse } from 'next/server';

// 아래 route로 이동시에 함수 실행
// 미들웨어 본연 기능 사용
export async function middleware() {
  const session = await auth();
  // console.log(session, '------------------------------middleware session')
  if (!session) {
    return NextResponse.redirect('http://localhost:3001/i/flow/login');
  }
}

// See 'Matching Paths' below to lean more
// 미들웨어를 적용할 라우트로 로그인을 해야하는 페이지
// 페이지 접근관리 하기 쉬워짐
export const config = {
  matcher: ['/compose/tweet', '/home', '/explore', '/messages', '/search']
}