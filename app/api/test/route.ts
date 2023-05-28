/* eslint-disable @typescript-eslint/no-unused-vars */
import { withResponse, prisma } from '@libs/server';

const testFunc = async () => {
  const res = await prisma.user.findMany();
  return res;
};

export async function GET() {
  return withResponse(testFunc);
}
