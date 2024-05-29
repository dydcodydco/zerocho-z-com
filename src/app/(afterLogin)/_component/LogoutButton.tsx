'use client';

import { useCallback } from 'react';
import style from './logoutButton.module.scss';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';

type Props = {
	me: Session | null
}

export default function LogoutButton({me}: Props) {
	const router = useRouter();
	const { data } = useSession();

	const onLogout = useCallback(async () => {
		await signOut({ redirect: false });
		router.replace('/');
	}, [router]);

	if (!data?.user && me?.user) {
		return null;
	}

	return (
		<button className={style.logOutButton} onClick={onLogout}>
      <div className={style.logOutUserImage}>
				<img src={me?.user.image!} alt={me?.user.email!}/>
      </div>
      <div className={style.logOutUserName}>
        <div>{me?.user?.name}</div>
        <div>@{me?.user?.email}</div>
      </div>
    </button>
	);
}
