import React from 'react';
import { getServerSession } from 'next-auth';
import LoginTest from '@components/LoginTest';
import authOptions from '@libs/server/auth';

const Login = async () => {
  const session = await getServerSession(authOptions);
  return (
    <main>
      <LoginTest />
      <div>{`서버 세션 여부 : ${JSON.stringify(session)}`}</div>
    </main>
  );
};

export default Login;
