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
          Images: [{ imageId: 1, link: faker.image.urlLoremFlickr({ category: 'animals' }) }],
          createdAt: generateDate(),
        },
        {
          postId: cursor + 2,
          User: User[0],
          content: `${cursor + 2} ${faker.lorem.paragraph()}`,
          Images: [
            { imageId: 1, link: faker.image.urlLoremFlickr({ category: 'animals' }) },
            { imageId: 2, link: faker.image.urlLoremFlickr({ category: 'animals' }) },
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
            { imageId: 1, link: faker.image.urlLoremFlickr({ category: 'animals' }) },
            { imageId: 2, link: faker.image.urlLoremFlickr({ category: 'animals' }) },
            { imageId: 3, link: faker.image.urlLoremFlickr({ category: 'animals' }) },
            { imageId: 4, link: faker.image.urlLoremFlickr({ category: 'animals' }) },
          ],
          createdAt: generateDate(),
        },
        {
          postId: cursor + 5,
          User: User[0],
          content: `${cursor + 5} ${faker.lorem.paragraph()}`,
          Images: [
            { imageId: 1, link: faker.image.urlLoremFlickr({ category: 'animals' }) },
            { imageId: 2, link: faker.image.urlLoremFlickr({ category: 'animals' }) },
            { imageId: 3, link: faker.image.urlLoremFlickr({ category: 'animals' }) },
          ],
          createdAt: generateDate(),
        },
      ]
    );
  }),
  http.get('/api/followingPosts', async ({ request }) => {
    console.log('----------------------------------handlers /api/followingPosts');
    await delay(3000);
    const url = new URL(request.url)
    const cursor = parseInt(url.searchParams.get('cursor') as string) || 0;
    return HttpResponse.json(
      [
        {
          postId: cursor + 1,
          User: User[0],
          content: `${cursor + 1} followingPosts ${faker.lorem.paragraph()}`,
          Images: [{ imageId: 1, link: faker.image.urlLoremFlickr({ category: 'animals' }) }],
          createdAt: generateDate(),
        },
        {
          postId: cursor + 2,
          User: User[0],
          content: `${cursor + 2} followingPosts ${faker.lorem.paragraph()}`,
          Images: [
            { imageId: 1, link: faker.image.urlLoremFlickr({ category: 'animals' }) },
            { imageId: 2, link: faker.image.urlLoremFlickr({ category: 'animals' }) },
          ],
          createdAt: generateDate(),
        },
        {
          postId: cursor + 3,
          User: User[0],
          content: `${cursor + 3} followingPosts ${faker.lorem.paragraph()}`,
          Images: [],
          createdAt: generateDate(),
        },
        {
          postId: cursor + 4,
          User: User[0],
          content: `${cursor + 4} followingPosts ${faker.lorem.paragraph()}`,
          Images: [
            { imageId: 1, link: faker.image.urlLoremFlickr({ category: 'animals' }) },
            { imageId: 2, link: faker.image.urlLoremFlickr({ category: 'animals' }) },
            { imageId: 3, link: faker.image.urlLoremFlickr({ category: 'animals' }) },
            { imageId: 4, link: faker.image.urlLoremFlickr({ category: 'animals' }) },
          ],
          createdAt: generateDate(),
        },
        {
          postId: cursor + 5,
          User: User[0],
          content: `${cursor + 5} followingPosts ${faker.lorem.paragraph()}`,
          Images: [
            { imageId: 1, link: faker.image.urlLoremFlickr({ category: 'animals' }) },
            { imageId: 2, link: faker.image.urlLoremFlickr({ category: 'animals' }) },
            { imageId: 3, link: faker.image.urlLoremFlickr({ category: 'animals' }) },
          ],
          createdAt: generateDate(),
        },
      ]
    );
  }),
  http.get('/api/search/:tag', async ({ request, params }) => {
    console.log('----------------------------------handlers /api/search');
    const { tag } = params;
    await delay(3000);
    return HttpResponse.json(
      [
        {
          postId: 1,
          User: User[0],
          content: `검색 결과 ${tag}`,
          Images: [{ imageId: 1, link: faker.image.urlLoremFlickr({ category: 'animals' }) }],
          createdAt: generateDate(),
        },
        {
          postId: 2,
          User: User[0],
          content: `검색 결과 ${tag} **${faker.lorem.paragraph()}`,
          Images: [
            { imageId: 1, link: faker.image.urlLoremFlickr({ category: 'animals' }) },
            { imageId: 2, link: faker.image.urlLoremFlickr({ category: 'animals' }) },
          ],
          createdAt: generateDate(),
        },
        {
          postId: 3,
          User: User[0],
          content: `검색 결과 ${tag} **${faker.lorem.paragraph()}`,
          Images: [],
          createdAt: generateDate(),
        },
        {
          postId: 4,
          User: User[0],
          content: `검색 결과 ${tag} **${faker.lorem.paragraph()}`,
          Images: [
            { imageId: 1, link: faker.image.urlLoremFlickr({ category: 'animals' }) },
            { imageId: 2, link: faker.image.urlLoremFlickr({ category: 'animals' }) },
            { imageId: 3, link: faker.image.urlLoremFlickr({ category: 'animals' }) },
            { imageId: 4, link: faker.image.urlLoremFlickr({ category: 'animals' }) },
          ],
          createdAt: generateDate(),
        },
        {
          postId: 5,
          User: User[0],
          content: `검색 결과 ${tag} **${faker.lorem.paragraph()}`,
          Images: [
            { imageId: 1, link: faker.image.urlLoremFlickr({ category: 'animals' }) },
            { imageId: 2, link: faker.image.urlLoremFlickr({ category: 'animals' }) },
            { imageId: 3, link: faker.image.urlLoremFlickr({ category: 'animals' }) },
          ],
          createdAt: generateDate(),
        },
      ]
    );
  }),
  // 특정 사용자의 정보
  http.get('/api/users/:userId', ({ request, params }) => {
    const { userId } = params;
    const found = User.find(v => v.id === userId);
    if (found) {
      return HttpResponse.json(found);
    }
    return HttpResponse.json({ message: 'no_such_user' }, {status: 404});    
  }),
  // 특정 사용자의 게시글들
  http.get('/api/users/:userId/posts', async ({ request, params }) => {
    console.log('----------------------------------handlers /api/users/:userId/posts');
    const {userId} = params;
    await delay(3000);
    return HttpResponse.json(
      [
        {
          postId: 1,
          User: User[0],
          content: `${userId}의 게시글 입니다.`,
          Images: [{imageId: 1, link: faker.image.urlLoremFlickr({ category: 'animals' })}],
          createdAt: generateDate(),
        },
        {
          postId: 2,
          User: User[0],
          content: `${userId}의 게시글 입니다.`,
          Images: [
            {imageId: 1, link: faker.image.urlLoremFlickr({ category: 'animals' })},
            {imageId: 2, link: faker.image.urlLoremFlickr({ category: 'animals' })},
          ],
          createdAt: generateDate(),
        },
        {
          postId: 3,
          User: User[0],
          content: `${userId}의 게시글 입니다.`,
          Images: [],
          createdAt: generateDate(),
        },
        {
          postId: 4,
          User: User[0],
          content: `${userId}의 게시글 입니다.`,
          Images: [
            {imageId: 1, link: faker.image.urlLoremFlickr({ category: 'animals' })},
            {imageId: 2, link: faker.image.urlLoremFlickr({ category: 'animals' })},
            {imageId: 3, link: faker.image.urlLoremFlickr({ category: 'animals' })},
            {imageId: 4, link: faker.image.urlLoremFlickr({ category: 'animals' })},
          ],
          createdAt: generateDate(),
        },
        {
          postId: 5,
          User: User[0],
          content: `${userId}의 게시글 입니다.`,
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
  // 특정 사용자의 특정 게시글 하나
  http.get('/api/users/:userId/posts/:postId', async ({ request, params }) => {
    console.log('----------------------------------handlers /api/users/:userId/posts/:postId/comments');
    const {userId, postId} = params;
    await delay(3000);
    return HttpResponse.json(
      [
        {
          postId: 1,
          User: User[0],
          content: `${userId}의 게시글 ${postId} 게시글 입니다.`,
          Images: [{imageId: 1, link: faker.image.urlLoremFlickr({ category: 'animals' })}],
          createdAt: generateDate(),
        },
        {
          postId: 2,
          User: User[0],
          content: `${userId}의 게시글 ${postId} 게시글 입니다.`,
          Images: [
            {imageId: 1, link: faker.image.urlLoremFlickr({ category: 'animals' })},
            {imageId: 2, link: faker.image.urlLoremFlickr({ category: 'animals' })},
          ],
          createdAt: generateDate(),
        },
        {
          postId: 3,
          User: User[0],
          content: `${userId}의 게시글 ${postId} 게시글 입니다.`,
          Images: [],
          createdAt: generateDate(),
        },
        {
          postId: 4,
          User: User[0],
          content: `${userId}의 게시글 ${postId} 게시글 입니다.`,
          Images: [
            {imageId: 1, link: faker.image.urlLoremFlickr({ category: 'animals' })},
            {imageId: 2, link: faker.image.urlLoremFlickr({ category: 'animals' })},
            {imageId: 3, link: faker.image.urlLoremFlickr({ category: 'animals' })},
            {imageId: 4, link: faker.image.urlLoremFlickr({ category: 'animals' })},
          ],
          createdAt: generateDate(),
        },
        {
          postId: 5,
          User: User[0],
          content: `${userId}의 게시글 ${postId} 게시글 입니다.`,
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
  // 특정 사용자의 특정 게시글 하나의 답글들
  http.get('/api/users/:userId/posts/:postId/comments', async ({ request, params }) => {
    console.log('----------------------------------handlers /api/users/:userId/posts/:postId/comments');
    const {userId, postId} = params;
    await delay(3000);
    return HttpResponse.json(
      [
        {
          postId: 1,
          User: User[0],
          content: `${userId}의 게시글 ${postId}의 답글 입니다.`,
          Images: [{imageId: 1, link: faker.image.urlLoremFlickr({ category: 'animals' })}],
          createdAt: generateDate(),
        },
        {
          postId: 2,
          User: User[0],
          content: `${userId}의 게시글 ${postId}의 답글 입니다.`,
          Images: [
            {imageId: 1, link: faker.image.urlLoremFlickr({ category: 'animals' })},
            {imageId: 2, link: faker.image.urlLoremFlickr({ category: 'animals' })},
          ],
          createdAt: generateDate(),
        },
        {
          postId: 3,
          User: User[0],
          content: `${userId}의 게시글 ${postId}의 답글 입니다.`,
          Images: [],
          createdAt: generateDate(),
        },
        {
          postId: 4,
          User: User[0],
          content: `${userId}의 게시글 ${postId}의 답글 입니다.`,
          Images: [
            {imageId: 1, link: faker.image.urlLoremFlickr({ category: 'animals' })},
            {imageId: 2, link: faker.image.urlLoremFlickr({ category: 'animals' })},
            {imageId: 3, link: faker.image.urlLoremFlickr({ category: 'animals' })},
            {imageId: 4, link: faker.image.urlLoremFlickr({ category: 'animals' })},
          ],
          createdAt: generateDate(),
        },
        {
          postId: 5,
          User: User[0],
          content: `${userId}의 게시글 ${postId}의 답글 입니다.`,
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
  // 팔로우 추천
  http.get('/api/followRecommends', async ({ request, params }) => {
    return HttpResponse.json(User);
  }),
  // 트렌드 정보
  http.get('/api/trends', async ({request, params}) => {
    return HttpResponse.json([
      {tagId: 1, title: '제로초', count: 1264},
      {tagId: 2, title: '원초', count: 1264},
      {tagId: 3, title: '투초', count: 1264},
      {tagId: 4, title: '쓰리초', count: 1264},
      {tagId: 5, title: '포초', count: 1264},
      {tagId: 6, title: '파이브초', count: 1264},
      {tagId: 7, title: '식스초', count: 1264},
      {tagId: 8, title: '세븐초', count: 1264},
      {tagId: 9, title: '나인초', count: 1264},
    ]);
  })
]
