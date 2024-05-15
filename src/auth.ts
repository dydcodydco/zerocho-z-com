import NextAuth from "next-auth"
// import CredentialsProvider from "next-auth/providers/credentials"
import Credentials from "next-auth/providers/credentials"
import { NextResponse } from 'next/server';

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
  //   // 로그인 필요한 페이지에서 로그인 안돼어있으면 막기
  //   async authorized({ auth }) {
  //     if (!auth) {
  //       return NextResponse.redirect('http://localhost:3001/i/flow/login');
  //     }
  //     return true;
  //   }
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
        const authResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        })
        
        // console.log('authResponse-----------------------------------', authResponse);
        // 로그인 실패
        if (!authResponse.ok) {
          return null
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