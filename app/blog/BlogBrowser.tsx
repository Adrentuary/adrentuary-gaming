'use client';
import {useState} from 'react';
const categories=['All Posts','Gaming','Gaming News & Updates','Accessibility & Gaming','Tips & Tutorials','Tech & Gear','Reviews & Impressions','Adrentuary Updates','Community','Personal'];
export function BlogBrowser(){const[active,setActive]=useState('All Posts');return <><div className="category-scroller" role="group" aria-label="Filter posts by category">{categories.map(category=><button type="button" className={active===category?'active':''} onClick={()=>setActive(category)} key={category}>{category}</button>)}</div><div className="post-list"><div className="empty-filter"><p className="kicker">Nothing published here yet</p><h2>New posts are on the way.</h2><p>Try another category or check back as the library grows.</p></div></div></>}
