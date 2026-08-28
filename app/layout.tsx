import type {Metadata} from 'next';
import {Geist} from 'next/font/google';
import './globals.css';
import {AuthProvider} from './components/AuthProvider';
const geist=Geist({variable:'--font-geist-sans',subsets:['latin']});
export const metadata:Metadata={metadataBase:new URL('https://adrentuary.com'),title:{default:'Adrentuary Gaming',template:'%s | Adrentuary Gaming'},description:'Gaming guides, tools, creative resources, and accessibility-minded projects from Adrentuary.',openGraph:{title:'Adrentuary Gaming',description:'Gaming guides, tools, creative resources, and accessibility-minded projects from Adrentuary.',images:[{url:'/og.png',width:1200,height:630,alt:'Adrentuary Gaming'}]},twitter:{card:'summary_large_image',title:'Adrentuary Gaming',description:'Gaming guides, tools, creative resources, and accessibility-minded projects from Adrentuary.',images:['/og.png']}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body className={geist.variable}><AuthProvider>{children}</AuthProvider></body></html>}
