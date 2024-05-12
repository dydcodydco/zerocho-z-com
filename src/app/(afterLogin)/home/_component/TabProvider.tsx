'use client';

import { ReactNode, createContext, useContext, useMemo, useState } from 'react';

export const TabContext = createContext({
  tab: 'rec',
  setTab: (value: 'rec' | 'fol') => {}
})

type Props = { children: ReactNode };

export default function TabProvider({children}: Props) {
  const [tab, setTab] = useState('rec');
  const contextValue = useMemo(() => ({ tab, setTab }), [tab, setTab])
  return (
    <TabContext.Provider value={contextValue}>
      {children}
    </TabContext.Provider>
  )
}