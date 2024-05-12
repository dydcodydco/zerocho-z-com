'use client';

import style from './logoutButton.module.scss';

export default function LogoutButton() {
	// 임시로 내 정보 있는것처럼
	const me = {
		id: 'zzimzzim',
		nickname: '찜찜',
		image: '/5Udwvqim.jpg',
	};

	const onLogout = () => {};

	return (
		<button className={style.logOutButton} onClick={onLogout}>
			<div className={style.logOutUserImage}>
				<img src={me.image} alt={me.id} />
			</div>
			<div className={style.logOutUserName}>
				<div>{me.nickname}</div>
				<div>@{me.id}</div>
			</div>
		</button>
	);
}
