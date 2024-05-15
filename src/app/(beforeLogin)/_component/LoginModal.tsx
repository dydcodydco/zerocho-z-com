'use client';

import style from '@/app/(beforeLogin)/_component/login.module.scss';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
// import { signIn } from '@/auth'; // 서버환경일 때
import { signIn } from 'next-auth/react'; // 클라이언트일 때

type formProps = {
	id: string, password: string,
}

export default function LoginModal() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<formProps>();
	const router = useRouter();
	const onClickClose = () => {
		router.back();
		// TODO: 뒤로가기가 /home이 아니면 /home으로 보내기
	};

	const onSubmit: SubmitHandler<formProps> = async (data: formProps) => {
		console.log(data);
		try {
			await signIn('credentials', { ...data, redirect: false });
			router.replace('/home');
		} catch(error) {
			console.error(error);
			console.log('아이디와 비밀번호가 일치히자 않습니다.');
		}
	};

	return (
		<div className={style.modalBackground}>
			<div className={style.modal}>
				<div className={style.modalHeader}>
					<button className={style.closeButton} onClick={onClickClose}>
						<svg width={24} viewBox='0 0 24 24' aria-hidden='true' className='r-18jsvk2 r-4qtqp9 r-yyyyoo r-z80fyv r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-19wmn03'>
							<g>
								<path d='M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z'></path>
							</g>
						</svg>
					</button>
					<div>로그인하세요.</div>
				</div>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className={style.modalBody}>
						<div className={style.inputDiv}>
							<label className={style.inputLabel} htmlFor='id'>
								아이디
							</label>
							<input id='id' className={style.input} type='text' placeholder='' {...register('id', { required: '아이디를 입력해주세요.' })} />
							{errors.id?.message && typeof errors.id.message === 'string' && <p>{errors.id.message}</p>}
						</div>
						<div className={style.inputDiv}>
							<label className={style.inputLabel} htmlFor='password'>
								비밀번호
							</label>
							<input id='password' className={style.input} type='password' placeholder='' {...register('password', { required: '비밀번호를 입력해주세요.' })} />
							{errors.password?.message && typeof errors.password.message === 'string' && <p>{errors.password.message}</p>}
						</div>
					</div>
					<div className={style.modalFooter}>
						<button className={style.actionButton}>로그인하기</button>
					</div>
				</form>
			</div>
		</div>
	);
}
