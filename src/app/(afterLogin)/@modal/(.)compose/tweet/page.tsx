"use client";

import { SubmitHandler, useForm } from 'react-hook-form';
import style from './modal.module.scss';
import { ChangeEventHandler, useCallback, useRef, useState } from "react";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ReactTextareaAutosize from 'react-textarea-autosize';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { Post } from '@/models/Post';
import { produce } from 'immer';
import { useModalStore } from '@/store/modal';
import { shallow } from 'zustand/shallow';
import Link from 'next/link';

type FormValues = {
  content: string;
  imageFiles: FileList;
}

export default function TweetModal() {
  const { register, handleSubmit, reset, formState: { errors, isValid, isDirty } } = useForm<FormValues>();
  const { ref, onChange, ...rest } = register('imageFiles');
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { data: me } = useSession();
  const [preview, setPreview] = useState<Array<{ dataUrl: string, file: File } | null>>([]);
  const queryClient = useQueryClient();
  const modalStore = useModalStore();
  const parent = modalStore.data;
  const { data: session } = useSession();

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const formData = new FormData;
      formData.append('content', data.content);
      preview.forEach(d => {
        d && formData.append('images', d.file);
      });
      return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, {
        method: 'post',
        credentials: 'include',
        body: formData,
      });
    },
    onMutate: () => {
      return 123;
    },
    // context = onMutate에서 리턴한 값
    // mutateFn의 매개변수
    onSuccess: async (response, variable, context) => {
      setPreview([]);
      reset();
      const newPost = await response.json();
      const queryCache = queryClient.getQueryCache();
      const queryKeys = queryCache.getAll().map(cache => cache.queryKey);
      queryKeys.forEach((queryKey) => {
        if (queryKey[0] === 'posts') {
          console.log(queryKey[0]);
          const value: Post | InfiniteData<Post[]> | undefined = queryClient.getQueryData(queryKey);
          if (value && 'pages' in value) {
            console.log('array', value);
            const obj = value.pages.flat().find(v => v.postId === parent?.postId);
            if (obj) {
              const pageIndex = value.pages.findIndex(page => page.includes(obj));
              const index = value.pages[pageIndex].findIndex(d => d.postId === parent?.postId);
              const shallow = produce(value, draft => {
                draft.pages[0].unshift(newPost);
              });
              queryClient.setQueryData(queryKey, shallow);
            }
          }
        } 
      });
      await queryClient.invalidateQueries({
        queryKey: ['trends']
      });
    },
    onError: (error) => {
      console.error('게시물 업로드 중 에러 발생', error);
    },
    onSettled() {
      router.back();
    }
  });

  const comment = useMutation({
    mutationFn: async (data: FormValues) => {
      const formData = new FormData;
      formData.append('content', data.content);
      preview.forEach(d => {
        d && formData.append('images', d.file);
      });
      return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${parent?.postId}/comments`, {
        method: 'post',
        credentials: 'include',
        body: formData,
      });
    },
    onSuccess: async(response, variable, context) => {
      setPreview([]);
      reset();
      const newPost = await response.json();
      const queryCache = queryClient.getQueryCache();
      const queryKeys = queryCache.getAll().map(cache => cache.queryKey);
      queryKeys.forEach((queryKey) => {
        if (queryKey[0] === 'posts') {
          console.log(queryKey[0]);
          const value: Post | InfiniteData<Post[]> | undefined = queryClient.getQueryData(queryKey);
          if (value && 'pages' in value) {
            console.log('array', value);
            const obj = value.pages.flat().find(v => v.postId === parent?.postId);
            if (obj) {
              const pageIndex = value.pages.findIndex((page) => page.includes(obj));
              const index = value.pages[pageIndex].findIndex((v) => v.postId === parent?.postId);
              const shallow = produce(value, draft => {
                draft.pages[pageIndex][index].Comments = [{ userId: session?.user?.email as string }];
                draft.pages[pageIndex][index]._count.Comments += 1;
                draft.pages[0].unshift(newPost);
              });
              queryClient.setQueryData(queryKey, shallow);
            }
          } else if (value) {
            const shallow = produce(value, (draft) => {
              draft.Comments = [{ userId: session?.user?.email as string }];
              draft._count.Comments += 1;
            });
            queryClient.setQueryData(queryKey, shallow);
          }
        }
      });
      await queryClient.invalidateQueries({
        queryKey: ['trends']
      });
    },
    onError: (error) => {
      console.error('게시물 댓글 업로드 중 에러 발생', error);
    },
    onSettled() {
      modalStore.reset();
      router.back();
    }
  })

  const onClickButton = useCallback(() => {
    inputFileRef.current?.click();
  }, []);

  const onRemoveImage = useCallback((index: number) => () => {
    setPreview(prevPreview => {
        const prev = [...prevPreview];
        prev[index] = null;
        return prev;
      }
    );
  }, [])

  // 업로드한 이미지 미리보기
  const onUpload: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    e.preventDefault();
    if (e.target.files) {
      console.log('e.target.files', e.target.files);
      console.log(Array.from(e.target.files));
      Array.from(e.target.files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(prevPreview => {
            const prev = [...prevPreview];
            prev[index] = {dataUrl: reader.result as string, file};
            return prev;
          })
        }
        reader.readAsDataURL(file); // 결과값 무조건 string
      })
    }
  }, [])

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (modalStore.mode === 'new') {
      mutation.mutate(data);
    } else {
      comment.mutate(data);
    }
  };

  const onClickClose = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className={style.modalBackground}>
      <div className={style.modal}>
        <button className={style.closeButton} onClick={onClickClose}>
          <svg width={24} viewBox="0 0 24 24" aria-hidden="true"
               className="r-18jsvk2 r-4qtqp9 r-yyyyoo r-z80fyv r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-19wmn03">
            <g>
              <path
                d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
            </g>
          </svg>
        </button>
        <form className={style.modalForm} onSubmit={handleSubmit(onSubmit)}>

        {modalStore.mode === 'comment' && parent && (
            <div className={style.modalOriginal}>
              <div className={style.postUserSection}>
                <div className={style.postUserImage}>
                  <img src={parent.User.image} alt={parent.User.id}/>
                </div>
              </div>
              <div>
                {parent.content}
                <div>
                  <Link href={`/${parent.User.id}`} style={{color: 'rgb(29, 155, 240)'}}>@{parent.User.id}</Link> 님에게
                  보내는 답글
                </div>
              </div>
            </div>
          )}

          <div className={style.modalBody}>
            <div className={style.postUserSection}>
              <div className={style.postUserImage}>
                <img src={me.user.image} alt={me?.user.id} />
              </div>
            </div>
            <div className={style.inputDiv}>
              <ReactTextareaAutosize
                className={style.input}
                placeholder={modalStore.mode === 'comment' ? '답글 게시하기' : '무슨 일이 일어나고 있나요?'}
                {...register('content', {required: '내용을 입력해주세요.'})}
              />
              {errors.content && <p>{errors.content.message}</p>}
              
              <div style={{display: 'flex', flexWrap: 'wrap'}}>
                {preview.map((v, index) => (
                  v && (
                    <div style={{maxWidth: '33%'}} key={index} onClick={onRemoveImage(index)}>
                      <img style={{ display: 'block', maxWidth: '100%' }} alt='img' src={v.dataUrl} />
                    </div>)
                ))}
              </div>
            </div>
          </div>
          <div className={style.modalFooter}>
            <div className={style.modalDivider}/>
            <div className={style.footerButtons}>
              <div className={style.footerButtonLeft}>
                <input
                  type="file"
                  multiple hidden
                  accept='image/*'
                  {...rest}
                  ref={(e) => {
                    ref(e);
                    inputFileRef.current = e;
                  }}
                  onChange={onUpload}
                />
                <button className={style.uploadButton} type="button" onClick={onClickButton}>
                  <svg width={24} viewBox="0 0 24 24" aria-hidden="true">
                    <g>
                      <path
                        d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path>
                    </g>
                  </svg>
                </button>
              </div>
              <button className={style.actionButton} disabled={!isDirty || !isValid}>게시하기</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}