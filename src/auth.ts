import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const {
  // api 라우트
  handlers: { GET, POST },
  // auth 함수 실행하면 로그인 유무알 수 있다.
  auth,
  // 로그인 하는 함수
  signIn
} = NextAuth({

})