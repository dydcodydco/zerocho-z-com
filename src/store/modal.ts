import { Post } from '@/models/Post';
import { create } from 'zustand';

interface ModalState {
  mode: 'new' | 'comment';
  data: Post | null;
  setMode(mode: 'new' | 'comment'): void;
  setData(data: Post): void;
  reset(): void;
}

// set은 초기값으로 지정된 값을 바꾸는 함수
export const useModalStore = create<ModalState>((set) => ({
  // 초기값 지정
  mode: 'new',
  data: null,
  setMode(mode) {
    set({ mode });
  },
  setData(data) {
    set({ data });
  },
  reset() {
    set({
      mode: 'new',
      data: null
    })
  }
}))