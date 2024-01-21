'use client';
import { ReactNode, useRef } from "react";
import { makeStore, AppStore } from "@/lib/store";
import { Provider } from "react-redux";

const StoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<AppStore>();
  if(!storeRef.current) {
    storeRef.current = makeStore();
    console.log(`storeRef.current:`, storeRef.current);
    // console.log(`storeRef.current.getState():`, storeRef.current.getState());
  }
  
  return (
    <Provider store={storeRef.current}>{children}</Provider>
  )
}

export default StoreProvider;