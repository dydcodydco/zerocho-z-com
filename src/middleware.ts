// auth파일 불러와서 미들웨어 역할
export { auth as middleware } from './auth';

// See 'Matching Paths' below to lean more
// 미들웨어를 적용할 라우트로 로그인을 해야하는 페이지
// 페이지 접근관리 하기 쉬워짐
export const config = {
  matcher: ['/compose/tweet', '/home', '/explore', '/messages', '/search']
}