'use client';

import { useCallback, useContext, useReducer, useState } from 'react';
import style from './tab.module.scss'
import { TabContext } from './TabProvider';

export default function Tab() {
  const {tab, setTab} = useContext(TabContext);

  const onclickRec = useCallback(() => {
    setTab('rec');
  }, [setTab]);
  
  const onclickFol = useCallback(() => {
    setTab('fol');
  }, [setTab]);
  return (
    <div className={style.homeFixed}>
      <div className={style.homeText}>홈</div>
      <div className={style.homeTab}>
        <div onClick={onclickRec}>
          추천
          <div className={style.tabIndicator} hidden={tab === 'fol'}></div>
        </div>
        <div onClick={onclickFol}>
          팔로우 중
          <div className={style.tabIndicator} hidden={tab === 'rec'}></div>
        </div>
      </div>

    </div>
  )
}