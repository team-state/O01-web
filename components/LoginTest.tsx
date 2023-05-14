'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

const LoginTest = () => {
  const { data: session } = useSession();

  return (
    <>
      <h1>로그인 테스트 페이지</h1>
      {!session && (
        <button
          type="button"
          className="border-red border-[1px] bg-blue-500"
          onClick={() => signIn('github')}
        >
          깃헙 로그인
        </button>
      )}
      <div>{`세션 여부 : ${Boolean(session)}`}</div>
      {session && (
        <button
          type="button"
          className="border-red border-[1px] bg-blue-500"
          onClick={() => signOut()}
        >
          로그아웃
        </button>
      )}
    </>
  );
};

export default LoginTest;
