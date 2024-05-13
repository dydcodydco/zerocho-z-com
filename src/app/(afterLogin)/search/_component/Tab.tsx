"use client";

import style from '../search.module.scss';
import {useCallback, useState} from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Tab() {
  const [current, setCurrent] = useState('hot');
  const router = useRouter();
  const searchParams = useSearchParams();

  const onClickHot = useCallback(() => {
    setCurrent('hot');
    console.log(searchParams);
    console.log(searchParams.get('q'));
    router.replace(`/search?q=${searchParams.get('q')}`)
  }, [router, searchParams])
  const onClickNew = useCallback(() => {
    setCurrent('new');
    console.log(searchParams);
    console.log(searchParams.toString());
    router.replace(`/search?${searchParams.toString()}&f=live`)
  }, [router, searchParams])

  return (
    <div className={style.homeFixed}>
      <div className={style.homeTab}>
        <div onClick={onClickHot}>
          인기
          <div className={style.tabIndicator} hidden={current === 'new'}></div>
        </div>
        <div onClick={onClickNew}>
          최신
          <div className={style.tabIndicator} hidden={current === 'hot'}></div>
        </div>
      </div>
    </div>
  );
}