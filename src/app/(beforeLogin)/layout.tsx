import { ReactNode } from 'react';
import styles from '@/app/page.module.scss';

type Props = { children: ReactNode; modal: ReactNode };

export default function Layout({ children, modal }: Props) {
	return (
		<div className={styles.container}>
			비포로그인 레이아웃
			{children}
			{modal}
		</div>
	);
}
