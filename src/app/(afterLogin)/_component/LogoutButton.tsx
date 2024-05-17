'use client';

import { useCallback } from 'react';
import style from './logoutButton.module.scss';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LogoutButton({user}: {user?: any}) {
	const router = useRouter();
	const { data } = useSession();
	
	const me = data?.user || user;

	const onLogout = useCallback(async () => {
		await signOut({ redirect: false });
		router.replace('/');
	}, [router]);

	if (!data?.user && !user) {
		return null;
	}

	return (
		<button className={style.logOutButton} onClick={onLogout}>
      <div className={style.logOutUserImage}>
				<img src={me?.image!} alt={me?.email!}/>
      </div>
      <div className={style.logOutUserName}>
        <div>{me?.name}</div>
        <div>@{me?.email}</div>
      </div>
    </button>
	);
}
