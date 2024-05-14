'use server';

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

  let shouldRedirect = false;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
      method: 'post',
      body: formData,
      credentials: 'include', // cookie 전달 위해서
    });
    // console.log(response);
    console.log(response.status);
    if (response.status === 403) {
      return { message: 'user_exists' };
    }
    console.log(await response.json());
    shouldRedirect = true;
  } catch (error) {
    console.error(error);
    return { message: null };
  }

  if (shouldRedirect) {
    redirect('/home'); // redirect는 try/catch문에서 쓰면 안된다.
  }
}

export default onSubmit;