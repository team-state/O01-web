import React from 'react';
import { getServerSession } from 'next-auth';
import ImageUploadForm from '@components/ImageUploadForm';
import LoginTest from '@components/LoginTest';
import { authOptions } from '@libs/server';

const Login = async () => {
  const session = await getServerSession(authOptions);
  return (
    <main>
      <LoginTest />
      <div>{`서버 세션 여부 : ${JSON.stringify(session)}`}</div>
      <ImageUploadForm />
    </main>
  );
};

export default Login;
