import { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
	return (
		<div>
			홈 레이아웃
			{children}
		</div>
	);
}
