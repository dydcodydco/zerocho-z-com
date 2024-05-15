import { faker } from '@faker-js/faker';
import { HttpResponse, delay, http } from 'msw';

faker.seed(123);

function generateDate() {
  const lastWeek = new Date(Date.now());
  lastWeek.setDate(lastWeek.getDate() - 7);
  return faker.date.between({
    from: lastWeek,
    to: Date.now(),
  });
}

const User = [
  {id: 'elonmusk', nickname: 'Elon Musk', image: '/yRsRRjGO.jpg'},
  {id: 'zerohch0', nickname: '제로초', image: '/5Udwvqim.jpg'},
  {id: 'leoturtle', nickname: '레오', image: faker.image.avatar()},
]

export const handlers = [
  http.post('/api/login', () => {
    console.log('----------------------------------handlers /api/login');
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
    console.log('----------------------------------handlers /api/logout');
    return new HttpResponse(null, {
      headers: {
        // http해더로 쿠키 지우는 방법
        'Set-Cookie': 'connect.sid=;HttpOnly;Path=/;Max-Age=0'
      },
    })
  }),
  http.post('/api/users', async ({ request }) => {
    console.log('----------------------------------handlers /api/users');
    // return HttpResponse.text(JSON.stringify('user_exists'), {
    //   status: 403,
    // })

    return HttpResponse.text(JSON.stringify('ok'), {
      headers: {
        'Set-Cookie': 'connect.sid=msw-cookie;HttpOnly;Path=/;Max-Age=0'
      }
    });
  }),
  http.get('/api/postRecommends', async ({ request }) => {
    console.log('----------------------------------handlers /api/postRecommends');
    await delay(3000);
    const url = new URL(request.url)
    const cursor = parseInt(url.searchParams.get('cursor') as string) || 0;
    return HttpResponse.json(
      [
        {
          postId: cursor + 1,
          User: User[0],
          content: `${cursor + 1} ${faker.lorem.paragraph()}`,
          Images: [{imageId: 1, link: faker.image.urlLoremFlickr({ category: 'animals' })}],
          createdAt: generateDate(),
        },
        {
          postId: cursor + 2,
          User: User[0],
          content: `${cursor + 2} ${faker.lorem.paragraph()}`,
          Images: [
            {imageId: 1, link: faker.image.urlLoremFlickr({ category: 'animals' })},
            {imageId: 2, link: faker.image.urlLoremFlickr({ category: 'animals' })},
          ],
          createdAt: generateDate(),
        },
        {
          postId: cursor + 3,
          User: User[0],
          content: `${cursor + 3} ${faker.lorem.paragraph()}`,
          Images: [],
          createdAt: generateDate(),
        },
        {
          postId: cursor + 4,
          User: User[0],
          content: `${cursor + 4} ${faker.lorem.paragraph()}`,
          Images: [
            {imageId: 1, link: faker.image.urlLoremFlickr({ category: 'animals' })},
            {imageId: 2, link: faker.image.urlLoremFlickr({ category: 'animals' })},
            {imageId: 3, link: faker.image.urlLoremFlickr({ category: 'animals' })},
            {imageId: 4, link: faker.image.urlLoremFlickr({ category: 'animals' })},
          ],
          createdAt: generateDate(),
        },
        {
          postId: cursor + 5,
          User: User[0],
          content: `${cursor + 5} ${faker.lorem.paragraph()}`,
          Images: [
            {imageId: 1, link: faker.image.urlLoremFlickr({ category: 'animals' })},
            {imageId: 2, link: faker.image.urlLoremFlickr({ category: 'animals' })},
            {imageId: 3, link: faker.image.urlLoremFlickr({ category: 'animals' })},
          ],
          createdAt: generateDate(),
        },
      ]
    );
  }),
]
