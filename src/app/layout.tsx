import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css'; // 전체 공통 스타일
import styles from './page.module.scss'; // 특정 페이지용
import { MSWComponent } from '@/app/_component/MSWComponent';
import AuthSession from '@/app/_component/AuthSession';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Z. 무슨 일이 일어나고 있나요? / Z',
	description: 'Z.com inspired by X.com',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<MSWComponent />
				{/* 루트 레이아웃 */}
				<AuthSession>
				{children}
				</AuthSession>
			</body>
		</html>
	);
}
