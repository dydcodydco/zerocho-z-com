'use client';

import style from '@/app/(beforeLogin)/_component/signup.module.scss';
import { useRouter } from 'next/navigation';
import { ChangeEventHandler, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

// 정확한 타입을 useForm에 명시
interface FormValues {
	id: string;
	nickname: string;
	password: string;
	image: FileList;
}

export default function SignupModal() {
	const [image, setImage] = useState('');
	const [imageFile, setImageFile] = useState<File>();
	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isDirty },
	} = useForm<FormValues>();

	const router = useRouter();
	const onClickClose = () => {
		router.back();
		// TODO: 뒤로가기가 /home이 아니면 /home으로 보내기
	};

	const onChangeImageFile: ChangeEventHandler<HTMLInputElement> = (e) => {
		e.target.files && setImageFile(e.target.files[0]);
	};

	const onSubmit: SubmitHandler<FormValues> = (formValues) => {
		console.log(formValues);
		const { id, nickname, password, image } = formValues;
		return;
		// fetch('http://localhost:9090/api/users', {
		// 	method: 'post',
		// 	body: JSON.stringify({
		// 		id,
		// 		nickname,
		// 		image,
		// 		password,
		// 	}),
		// 	credentials: 'include',
		// })
		// 	.then((response: Response) => {
		// 		console.log(response.status);
		// 		if (response.status === 200) {
		// 			router.replace('/home');
		// 		}
		// 	})
		// 	.catch((err) => {
		// 		console.error(err);
		// 	});
	};

	return (
		<>
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
						<div>계정을 생성하세요.</div>
					</div>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className={style.modalBody}>
							<div className={style.inputDiv}>
								<label className={style.inputLabel} htmlFor='id'>
									아이디
								</label>
								<input
									id='id'
									className={style.input}
									type='text'
									placeholder=''
									{...register('id', { required: '아이디를 입력해주세요.', minLength: { value: 3, message: '아이디 최소 3자리' } })}
								/>
								{errors.id && <p>{errors.id.message}</p>}
							</div>
							<div className={style.inputDiv}>
								<label className={style.inputLabel} htmlFor='nickname'>
									닉네임
								</label>
								<input
									id='nickname'
									className={style.input}
									type='text'
									placeholder=''
									{...register('nickname', { required: '닉네임을 입력해주세요', minLength: { value: 3, message: '닉네임 최소 3자리' } })}
								/>
								{errors.nickname && <p>{errors.nickname.message}</p>}
							</div>
							<div className={style.inputDiv}>
								<label className={style.inputLabel} htmlFor='password'>
									비밀번호
								</label>
								<input
									id='password'
									className={style.input}
									type='password'
									placeholder=''
									{...register('password', { required: '비밀번호를 입력해주세요', minLength: { value: 3, message: '비밀번호 최소 3자리' } })}
								/>
								{errors.password && <p>{errors.password.message}</p>}
							</div>
							<div className={style.inputDiv}>
								<label className={style.inputLabel} htmlFor='image'>
									프로필
								</label>
								<input
									id='image'
									className={style.input}
									type='file'
									accept='image/*'
									// onChange={onChangeImageFile}
									{...register('image', {
										required: '프로필 이미지는 필수입니다.',
									})}
								/>
								{errors.image && <p>{errors.image.message}</p>}
							</div>
						</div>
						<div className={style.modalFooter}>
							<button className={style.actionButton} disabled={!isDirty || !isValid}>
								가입하기
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
