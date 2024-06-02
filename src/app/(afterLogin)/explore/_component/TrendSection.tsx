'use client';

import Trend from '@/app/(afterLogin)/_component/Trend';
import { useQuery } from '@tanstack/react-query';
import { getTrends } from '@/app/(afterLogin)/_lib/getTrends';
import { Hashtag } from '@/models/Hashtag';

export default function TrendSection() {
	const { data } = useQuery<Hashtag[]>({
		queryKey: ['trends'],
		queryFn: getTrends,
    staleTime: 60 * 1000,
		gcTime: 300 * 100,
	})

  return data?.map((trend: any, i: number) => <Trend key={i} trend={trend} />);
}
