'use client';
import {useEffect,useRef,type ReactNode} from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: 'left'|'bottom';
  /** Pass true when AnimateIn is a direct child of a CSS grid/flex container so
   *  the wrapper div uses display:contents and doesn't break layout. */
  passthrough?: boolean;
}

export function AnimateIn({children,className='',delay=0,from='bottom',passthrough=false}:Props){
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const el=ref.current;
    if(!el)return;
    el.style.transitionDelay=`${delay}ms`;
    const obs=new IntersectionObserver(([entry])=>{
      if(entry.isIntersecting){el.classList.add('ai-visible');obs.disconnect();}
    },{threshold:0.12});
    obs.observe(el);
    return()=>obs.disconnect();
  },[delay]);
  return(
    <div ref={ref} className={`ai-wrap ai-from-${from}${passthrough?' ai-passthrough':''} ${className}`}>
      {children}
    </div>
  );
}
