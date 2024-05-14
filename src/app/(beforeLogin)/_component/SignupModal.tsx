// "use client";

import style from '@/app/(beforeLogin)/_component/signup.module.scss';
// import BackButton from '@/app/(beforeLogin)/_component/BackButton';
import { redirect } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';

export default function SignupModal() {
	// const [state, formAction] = useFormState(onSubmit, { message: null });
	// const { pending } = useFormStatus();
	
	// 이게 server actions!!!
	const submit = async (formData: FormData) => {
		'use server';

		if (!formData.get('id')) {
			return { message: 'no_id' };
		}
		if (!formData.get('name')) {
			return { message: 'no_name' };
		}
		if (!formData.get('password')) {
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
			console.log(response);
			console.log(response.status);
			if (response.status === 403) {
				return { message: 'user_exists' };
			}
			console.log(await response.json());
			shouldRedirect = true;
		} catch (error) {
			console.error(error);
			return;
		}

		if (shouldRedirect) {
			redirect('/home'); // redirect는 try/catch문에서 쓰면 안된다.
		}
	}

	return (
    <>
      <div className={style.modalBackground}>
        <div className={style.modal}>
          <div className={style.modalHeader}>
            {/* <BackButton /> */}
            <div>계정을 생성하세요.</div>
          </div>
          <form action={submit}>
            <div className={style.modalBody}>
              <div className={style.inputDiv}>
                <label className={style.inputLabel} htmlFor="id">아이디</label>
                <input id="id" name="id" className={style.input} type="text" placeholder="" required />
              </div>
              <div className={style.inputDiv}>
                <label className={style.inputLabel} htmlFor="name">닉네임</label>
                <input id="name" name="name" className={style.input} type="text" placeholder="" required />
              </div>
              <div className={style.inputDiv}>
                <label className={style.inputLabel} htmlFor="password">비밀번호</label>
                <input id="password" name="password" className={style.input} type="password" placeholder="" required />
              </div>
              <div className={style.inputDiv}>
                <label className={style.inputLabel} htmlFor="image">프로필</label>
                <input id="image" name="image" required className={style.input} type="file" accept="image/*" />
              </div>
            </div>
            <div className={style.modalFooter}>
              <button type="submit" className={style.actionButton}>가입하기</button>
              {/* <div className={style.error}>{showMessage(state?.message)}</div> */}
            </div>
          </form>
        </div>
      </div>
    </>)
}
