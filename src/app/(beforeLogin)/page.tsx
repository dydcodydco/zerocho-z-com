import Main from '@/app/(beforeLogin)/_component/Main';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
	console.log('--------------before login home');
	const session = await auth();
	if (session?.user) {
		redirect('/home');
		return null;
	}
	return (
		<>
			<Main />
		</>
	);
}
