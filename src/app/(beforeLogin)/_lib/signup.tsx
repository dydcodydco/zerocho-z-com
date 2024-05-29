'use server';

import { signIn } from '@/auth';
import { redirect } from 'next/navigation';

const onSubmit = async (prevState: any, formData: FormData) => {
  if (!formData.get('id') || !(formData.get('id') as string).trim()) {
    return { message: 'no_id' };
  }
  if (!formData.get('name') || !(formData.get('name') as string).trim()) {
    return { message: 'no_name' };
  }
  if (!formData.get('password') || !(formData.get('password') as string).trim()) {
    return { message: 'no_password' };
  }
  if (!formData.get('image')) {
    return { message: 'no_image' };
  }

  formData.set('nickname', formData.get('name') as string);

  let shouldRedirect = false;
  try {
    console.log('-------------------------signup start');
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
      method: 'post',
      body: formData,
      // 회원가입할때 credentials: includes 필수!!
      // 세션 쿠키를 브라우저에 등록하기 위해서 필요하다.
      credentials: 'include', // cookie 전달 위해서
    });
    // console.log(response);
    console.log(response.status, '-------------------------signup status');

    if (response.status === 403) {
      return { message: 'user_exists' };
    }

    const user = await response.json();
    console.log(user, '-------------------------signup');

    shouldRedirect = true;
    // 회원가입 성공하고 로그인 시도
    await signIn("credentials", {
      id: formData.get('id'),
      password: formData.get('password'),
      redirect: true,
      callbackUrl: '/home',
    })
  } catch (error) {
    console.error(error, '------------signup error');
    return { message: null };
  }

  if (shouldRedirect) {
    redirect('/home'); // redirect는 try/catch문에서 쓰면 안된다.
  }
}

export default onSubmit;