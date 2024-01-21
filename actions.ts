'use server';

export const srvLog = async (msg:string, ...args:any) => {
  console.log(msg, ...args)
}