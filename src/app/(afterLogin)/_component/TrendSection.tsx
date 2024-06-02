'use client';

import { usePathname } from 'next/navigation';
import Trend from './Trend';
import style from './trendSection.module.scss';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { getTrends } from '@/app/(afterLogin)/_lib/getTrends';
import { Hashtag } from '@/models/Hashtag';
import { Session } from 'next-auth';

type Props = {
	session: Session | null;
}

export default function TrendSection({session}: Props) {
	const pathname = usePathname();
	const { data } = useQuery<Hashtag[]>({
		queryKey: ['trends'],
		queryFn: getTrends,
    staleTime: 60 * 1000,
		gcTime: 300 * 100,
		// 로그인한 유저가 있으면 쿼리데이터를 가져온다는 옵션
		enabled: !!session?.user
	})

	console.log(data, '---------------trend data');
	if (pathname === '/explore') return null;
	if (session?.user) {
		return (
			<div className={style.trendBg}>
				<div className={style.trend}>
					<h3>나를 위한 트렌드</h3>
					{data?.map((trend: any, i: number) => <Trend key={i} trend={trend} />)}
				</div>
			</div>
		);
	}
	return (
		<div className={style.trendBg}>
			<div className={style.noTrend}>
        트렌드를 가져올 수 없습니다.
      </div>
		</div>
	);
}
