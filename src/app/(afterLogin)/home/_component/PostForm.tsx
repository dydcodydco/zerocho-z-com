"use client"

import {ChangeEventHandler, FormEventHandler, useCallback, useRef, useState} from "react";
import style from './postForm.module.scss';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
interface FormValues {
  content: string;
  imageFiles: FileList;
}

export default function PostForm() {
  const { register, handleSubmit, formState: { errors, isValid, isDirty } } = useForm<FormValues>();
  const { ref, ...rest } = register('imageFiles');
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const { data: me } = useSession();
  console.log(me);

  const onClickButton = useCallback(() => {
    inputFileRef.current?.click();
  }, []);

  const onSubmit: SubmitHandler<FormValues> = useCallback((data) => {
    console.log(data);
  }, []);

  // const onChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
  //   setContent(e.target.value);
  // }
  return (
    <form className={style.postForm} onSubmit={handleSubmit(onSubmit)}>
      <div className={style.postUserSection}>
        <div className={style.postUserImage}>
          <img src={me?.user?.image} alt={me?.user?.id} />
        </div>
      </div>
      <div className={style.postInputSection}>
        <textarea
          placeholder="무슨 일이 일어나고 있나요?"
          {...register('content', { required: '내용을 입력해주세요.', minLength: { value: 3, message: '최소 3글자' } })} />
        {errors.content && <p>{errors.content.message}</p>}
        <div className={style.postButtonSection}>
          <div className={style.footerButtons}>
            <div className={style.footerButtonLeft}>
              <input
                type="file" multiple hidden
                {...rest}
                ref={(e) => {
                  ref(e);
                  inputFileRef.current = e;
                }}
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
      </div>
    </form>
  )
}