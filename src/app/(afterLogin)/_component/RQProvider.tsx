"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';

type Props = {
  children: ReactNode,
}

export default function RQProvider({ children }: Props) {
  const [client] = useState(
    new QueryClient({
      defaultOptions: { // react-query 전역 설정
        // 쿼리 옵션
        queries: {
          retry: false,
          retryOnMount: true,
          refetchOnReconnect: false,
          refetchOnWindowFocus: false,
        }
      }
    })
  );

  return (
    <QueryClientProvider client={client}>
      {children} 
      <ReactQueryDevtools initialIsOpen={process.env.NEXT_PUBLIC_MODE === 'local'} />
    </QueryClientProvider>
  )
}