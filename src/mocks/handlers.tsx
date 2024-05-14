import { HttpResponse, http } from 'msw';

export const handlers = [
  http.post('/api/login', () => {
    return HttpResponse.json(
      {
        userId: 1,
        nickname: '찜찜',
        id: 'zzimzzim',
        image: '/5Udwvqim.jpg'
      },
      {
        headers: {
          // http해더로 쿠키 설정하는 방법
          'Set-Cookie': 'connect.sid=msw-cookie;HttpOnly;Path=/'
        }
      }) 
  }),
  http.post('/api/logout', () => {
    return new HttpResponse(null, {
      headers: {
        // http해더로 쿠키 지우는 방법
        'Set-Cookie': 'connect.sid=;HttpOnly;Path=/;Max-Age=0'
      },
    })
  }),
  http.post('/api/users', () => {
    console.log('회원가입');
    return HttpResponse.text(JSON.stringify('user_exists'), {
      status: 403,
    });

    // return HttpResponse.text(JSON.stringify('ok'), {
    //   headers: {
    //     'Set-Cookie': 'connect.sid=msw-cookie;HttpOnly;Path=/;Max-Age=0'
    //   }
    // });
  })
]
