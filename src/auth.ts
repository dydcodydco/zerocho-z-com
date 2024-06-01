import NextAuth, {CredentialsSignin} from "next-auth"
// import CredentialsProvider from "next-auth/providers/credentials"
import Credentials from "next-auth/providers/credentials"
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import cookie from 'cookie';

export const {
  // api 라우트
  handlers: { GET, POST },
  // auth 함수 실행하면 로그인 유무알 수 있다.
  auth,
  // 로그인 하는 함수
  signIn
} = NextAuth({
  pages: {
    signIn: "/i/flow/login",
    newUser: '/i/flow/signup',
  },
  // callbacks: {
    // async session({ session, token }) {
    //   console.log('session callback', session, token);
    //   const authResponse = await fetch('내정보를 가져오는 서버 API');
    //   const userData = await authResponse.json();
    //   (session as any).userData = userData;
    //   return session;
    // }
  // },
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        id: {},
        password: {},
      },
      authorize: async (credentials) => {
        console.log('-------------------------------------------auth.ts');
        console.log(credentials);
        const authResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        })

        // 프론트서버에서 백엔드서버의 로그인 토큰을 받아온것. 토큰은 문자열이라서
          // cookie라이브러리로 객체로 만들어준다.
          let setCookie = authResponse.headers.get('Set-Cookie');
          console.log('set-cookie', setCookie);
          if (setCookie) {
            const parsed = cookie.parse(setCookie);
            // 브론트서버에서 브라우저에 쿠키를 심어준다.
            // 프론트서버에 쿠키를 심으면 안된다! 왜냐하면 프론트서버는 서버라서 공용이다.
            // 여러 브라우저가 전부 프론트서버르 바라본다. 개인정보 유출 문제 발생할 수 있다.
            cookies().set('connect.sid', parsed['connect.sid'], parsed); // parsed = 나머지 옵션들
          }

        // 여기 주목!!! 서버에서 에러가 발생할 때 그 에러 내용이 서버에 담겨 있을 겁니다.
        console.log(authResponse.ok, authResponse.status, authResponse.statusText)
        if (!authResponse.ok) {
          const credentialsSignin = new CredentialsSignin();
          if (authResponse.status === 404) {
            credentialsSignin.code = 'no_user';
          } else if (authResponse.status === 401) {
            credentialsSignin.code = 'wrong_password';
          }
          throw credentialsSignin;
        }
      
        // 로그인 성공
        const user = await authResponse.json();
        console.log('user', user);
 
        // return user object with the their profile data
        return {
          ...user,
          name: user.nickname,
          email: user.id,
        }
      },
    }),
  ]
})