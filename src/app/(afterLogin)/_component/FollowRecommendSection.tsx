'use client';

import { useQuery } from '@tanstack/react-query'
import { getFollowRecommends } from '@/app/(afterLogin)/_lib/getFollowRecommends'
import { User } from '@/models/User'
import FollowRecommend from '@/app/(afterLogin)/_component/FollowRecommend';

export default function FollowRecommendSection() {
  const { data } = useQuery<User[]>({
		queryKey: ['users', 'followRecommends'],
		queryFn: getFollowRecommends,
    staleTime: 60 * 1000,
		gcTime: 300 * 100,
	})
  
  return (
    data?.map((user: User) => <FollowRecommend key={user.id} user={user} />)
  )
}