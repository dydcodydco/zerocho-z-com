'use client';

import { useCallback } from 'react';
import style from './logoutButton.module.scss';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import { useQueryClient } from '@tanstack/react-query';

type Props = {
	me: Session | null
}

export default function LogoutButton({me}: Props) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const onLogout = useCallback(async () => {
		queryClient.invalidateQueries({
			queryKey: ['posts'],
		});
		queryClient.invalidateQueries({
			queryKey: ['users'],
		});
		await signOut({ redirect: false });
		fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/logout`, {
			method: 'post',
			credentials: 'include',
		})
		router.replace('/');
	}, [router, queryClient]);

	console.log(me, '-------------logout button me');
	if (!me?.user) {
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
