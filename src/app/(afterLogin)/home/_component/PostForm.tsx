"use client"

import {ChangeEventHandler, FormEventHandler, useCallback, useRef, useState} from "react";
import style from './postForm.module.scss';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Session } from 'next-auth';
import ReactTextareaAutosize from 'react-textarea-autosize';
interface FormValues {
  content: string;
  imageFiles: FileList;
}

type Props = {
  me: Session | null;
}

export default function PostForm({me}: Props) {
  const { register, handleSubmit, formState: { errors, isValid, isDirty } } = useForm<FormValues>();
  const { ref, onChange, ...rest } = register('imageFiles');
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<Array<{dataUrl: string, file: File} | null>>([]);
  const [content, setContent] = useState([]);

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

  const onUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
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
  }

  const onSubmit: SubmitHandler<FormValues> = useCallback( async (data) => {
    console.log(data);
    const formData = new FormData;
    formData.append('content', data.content);
    preview.forEach(d => {
      d && formData.append('image', d.file);
    });
    console.log(formData)
    return;
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, {
      method: 'post',
      credentials: 'include',
      body: formData,
    })
  }, [preview]);

  return (
    <form className={style.postForm} onSubmit={handleSubmit(onSubmit)}>
      <div className={style.postUserSection}>
        <div className={style.postUserImage}>
          <img src={me?.user?.image} alt={me?.user?.id} />
        </div>
      </div>
      <div className={style.postInputSection}>
        <ReactTextareaAutosize
          placeholder="무슨 일이 일어나고 있나요?"
          {...register('content', { required: '내용을 입력해주세요.', minLength: { value: 3, message: '최소 3글자' } })}
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
      </div>
    </form>
  )
}