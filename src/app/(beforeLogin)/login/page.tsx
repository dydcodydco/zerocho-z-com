'use client';
import { useRouter } from 'next/navigation';
import Main from '@/app/(beforeLogin)/_component/Main';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function Login() {
	const router = useRouter();
	const {data: session} = useSession();
	useEffect(() => {
		if (session?.user) {
			console.log(session.user, '----------------------login page');
			router.replace('/home');
			// return null;
		} else {
			router.replace('/i/flow/login');
		}

	}, [router, session]);

	return <Main />;
}

// import { redirect } from 'next/navigation'

// export default function Login() {
//   redirect('/i/flow/login');
// }
