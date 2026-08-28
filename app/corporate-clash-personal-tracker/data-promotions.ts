export interface PromoCog { name: string; levels: { level: number; cost: string }[] }
export interface PromoSuit { name: string; color: string; accent: string; currency: string; cogs: PromoCog[] }

export const PROMOTIONS: PromoSuit[] = [
  {
    name: 'Sellbot', color: '#4a1a2a', accent: '#c0567a', currency: 'MERITS',
    cogs: [
      { name: 'Cold Caller', levels: [{level:1,cost:'20'},{level:2,cost:'30'},{level:3,cost:'40'},{level:4,cost:'50'},{level:5,cost:'200'}] },
      { name: 'Telemarketer', levels: [{level:2,cost:'40'},{level:3,cost:'50'},{level:4,cost:'60'},{level:5,cost:'70'},{level:6,cost:'300'}] },
      { name: 'Name Dropper', levels: [{level:3,cost:'60'},{level:4,cost:'80'},{level:5,cost:'100'},{level:6,cost:'120'},{level:7,cost:'500'}] },
      { name: 'Glad Hander', levels: [{level:4,cost:'100'},{level:5,cost:'130'},{level:6,cost:'160'},{level:7,cost:'190'},{level:8,cost:'800'}] },
      { name: 'Mover & Shaker', levels: [{level:5,cost:'160'},{level:6,cost:'210'},{level:7,cost:'260'},{level:8,cost:'310'},{level:9,cost:'360'},{level:10,cost:'1300'}] },
      { name: 'Two-Face', levels: [{level:6,cost:'260'},{level:7,cost:'340'},{level:8,cost:'420'},{level:9,cost:'500'},{level:10,cost:'580'},{level:11,cost:'660'},{level:12,cost:'2100'}] },
      { name: 'Mingler', levels: [{level:7,cost:'420'},{level:8,cost:'550'},{level:9,cost:'680'},{level:10,cost:'810'},{level:11,cost:'940'},{level:12,cost:'1070'},{level:13,cost:'1200'},{level:14,cost:'1330'},{level:15,cost:'3400'}] },
      { name: 'Mr. Hollywood', levels: [{level:8,cost:'680'},{level:9,cost:'890'},{level:10,cost:'1100'},{level:11,cost:'1310'},{level:12,cost:'1520'},{level:13,cost:'1730'},{level:14,cost:'5500'},{level:15,cost:'680'},{level:16,cost:'890'},{level:17,cost:'1100'},{level:18,cost:'1310'},{level:19,cost:'5500'},{level:20,cost:'680'},{level:21,cost:'890'},{level:22,cost:'1100'},{level:23,cost:'1310'},{level:24,cost:'1520'},{level:25,cost:'1730'},{level:26,cost:'1940'},{level:27,cost:'2150'},{level:28,cost:'2360'},{level:29,cost:'5500'},{level:30,cost:'680'},{level:31,cost:'890'},{level:32,cost:'1100'},{level:33,cost:'1310'},{level:34,cost:'1520'},{level:35,cost:'1730'},{level:36,cost:'1940'},{level:37,cost:'2150'},{level:38,cost:'2360'},{level:39,cost:'5500'},{level:40,cost:'680'},{level:41,cost:'890'},{level:42,cost:'1100'},{level:43,cost:'1310'},{level:44,cost:'1520'},{level:45,cost:'1730'},{level:46,cost:'1940'},{level:47,cost:'2150'},{level:48,cost:'2360'},{level:49,cost:'5500'},{level:50,cost:'MAXED'}] },
    ],
  },
  {
    name: 'Cashbot', color: '#1a3a1a', accent: '#4caf50', currency: 'COGBUCKS',
    cogs: [
      { name: 'Short Change', levels: [{level:1,cost:'40'},{level:2,cost:'50'},{level:3,cost:'60'},{level:4,cost:'70'},{level:5,cost:'300'}] },
      { name: 'Penny Pincher', levels: [{level:2,cost:'60'},{level:3,cost:'80'},{level:4,cost:'100'},{level:5,cost:'120'},{level:6,cost:'500'}] },
      { name: 'Tightwad', levels: [{level:3,cost:'100'},{level:4,cost:'130'},{level:5,cost:'160'},{level:6,cost:'190'},{level:7,cost:'800'}] },
      { name: 'Bean Counter', levels: [{level:4,cost:'160'},{level:5,cost:'210'},{level:6,cost:'260'},{level:7,cost:'310'},{level:8,cost:'1300'}] },
      { name: 'Number Cruncher', levels: [{level:5,cost:'260'},{level:6,cost:'340'},{level:7,cost:'420'},{level:8,cost:'500'},{level:9,cost:'580'},{level:10,cost:'2100'}] },
      { name: 'Money Bags', levels: [{level:6,cost:'420'},{level:7,cost:'550'},{level:8,cost:'680'},{level:9,cost:'810'},{level:10,cost:'940'},{level:11,cost:'1070'},{level:12,cost:'3400'}] },
      { name: 'Loan Shark', levels: [{level:7,cost:'680'},{level:8,cost:'890'},{level:9,cost:'1100'},{level:10,cost:'1310'},{level:11,cost:'1520'},{level:12,cost:'1730'},{level:13,cost:'1940'},{level:14,cost:'2150'},{level:15,cost:'5500'}] },
      { name: 'Robber Baron', levels: [{level:8,cost:'1100'},{level:9,cost:'1440'},{level:10,cost:'1780'},{level:11,cost:'2120'},{level:12,cost:'2460'},{level:13,cost:'2800'},{level:14,cost:'8900'},{level:15,cost:'1100'},{level:16,cost:'1440'},{level:17,cost:'1780'},{level:18,cost:'2120'},{level:19,cost:'8900'},{level:20,cost:'1100'},{level:21,cost:'1440'},{level:22,cost:'1780'},{level:23,cost:'2120'},{level:24,cost:'2460'},{level:25,cost:'2800'},{level:26,cost:'3140'},{level:27,cost:'3480'},{level:28,cost:'3820'},{level:29,cost:'8900'},{level:30,cost:'1100'},{level:31,cost:'1440'},{level:32,cost:'1780'},{level:33,cost:'2120'},{level:34,cost:'2460'},{level:35,cost:'2800'},{level:36,cost:'3140'},{level:37,cost:'3480'},{level:38,cost:'3820'},{level:39,cost:'8900'},{level:40,cost:'1100'},{level:41,cost:'1440'},{level:42,cost:'1780'},{level:43,cost:'2120'},{level:44,cost:'2460'},{level:45,cost:'2800'},{level:46,cost:'3140'},{level:47,cost:'3480'},{level:48,cost:'3820'},{level:49,cost:'8900'},{level:50,cost:'MAXED'}] },
    ],
  },
  {
    name: 'Lawbot', color: '#1a1a3a', accent: '#6070cc', currency: 'PATENTS',
    cogs: [
      { name: 'Bottom Feeder', levels: [{level:1,cost:'60'},{level:2,cost:'80'},{level:3,cost:'100'},{level:4,cost:'120'},{level:5,cost:'500'}] },
      { name: 'Bloodsucker', levels: [{level:2,cost:'100'},{level:3,cost:'130'},{level:4,cost:'160'},{level:5,cost:'190'},{level:6,cost:'800'}] },
      { name: 'Double Talker', levels: [{level:3,cost:'160'},{level:4,cost:'210'},{level:5,cost:'260'},{level:6,cost:'310'},{level:7,cost:'1300'}] },
      { name: 'Ambulance Chaser', levels: [{level:4,cost:'260'},{level:5,cost:'340'},{level:6,cost:'420'},{level:7,cost:'500'},{level:8,cost:'2100'}] },
      { name: 'Back Stabber', levels: [{level:5,cost:'420'},{level:6,cost:'550'},{level:7,cost:'680'},{level:8,cost:'810'},{level:9,cost:'940'},{level:10,cost:'3400'}] },
      { name: 'Spin Doctor', levels: [{level:6,cost:'680'},{level:7,cost:'890'},{level:8,cost:'1100'},{level:9,cost:'1310'},{level:10,cost:'1520'},{level:11,cost:'1730'},{level:12,cost:'5500'}] },
      { name: 'Legal Eagle', levels: [{level:7,cost:'1100'},{level:8,cost:'1440'},{level:9,cost:'1780'},{level:10,cost:'2120'},{level:11,cost:'2460'},{level:12,cost:'2800'},{level:13,cost:'3140'},{level:14,cost:'3480'},{level:15,cost:'8900'}] },
      { name: 'Big Wig', levels: [{level:8,cost:'1780'},{level:9,cost:'2330'},{level:10,cost:'2880'},{level:11,cost:'3430'},{level:12,cost:'3980'},{level:13,cost:'4530'},{level:14,cost:'14400'},{level:15,cost:'1780'},{level:16,cost:'2330'},{level:17,cost:'2880'},{level:18,cost:'3430'},{level:19,cost:'14400'},{level:20,cost:'1780'},{level:21,cost:'2330'},{level:22,cost:'2880'},{level:23,cost:'3430'},{level:24,cost:'3980'},{level:25,cost:'4530'},{level:26,cost:'5080'},{level:27,cost:'5630'},{level:28,cost:'6180'},{level:29,cost:'14400'},{level:30,cost:'1780'},{level:31,cost:'2330'},{level:32,cost:'2880'},{level:33,cost:'3430'},{level:34,cost:'3980'},{level:35,cost:'4530'},{level:36,cost:'5080'},{level:37,cost:'5630'},{level:38,cost:'6180'},{level:39,cost:'14400'},{level:40,cost:'1780'},{level:41,cost:'2330'},{level:42,cost:'2880'},{level:43,cost:'3430'},{level:44,cost:'3980'},{level:45,cost:'4530'},{level:46,cost:'5080'},{level:47,cost:'5630'},{level:48,cost:'6180'},{level:49,cost:'14400'},{level:50,cost:'MAXED'}] },
    ],
  },
  {
    name: 'Bossbot', color: '#3a1a0a', accent: '#cc7040', currency: 'STOCK OPTIONS',
    cogs: [
      { name: 'Flunky', levels: [{level:1,cost:'100'},{level:2,cost:'130'},{level:3,cost:'160'},{level:4,cost:'190'},{level:5,cost:'800'}] },
      { name: 'Pencil Pusher', levels: [{level:2,cost:'160'},{level:3,cost:'210'},{level:4,cost:'260'},{level:5,cost:'310'},{level:6,cost:'1300'}] },
      { name: 'Yesman', levels: [{level:3,cost:'260'},{level:4,cost:'340'},{level:5,cost:'420'},{level:6,cost:'500'},{level:7,cost:'2100'}] },
      { name: 'Micromanager', levels: [{level:4,cost:'420'},{level:5,cost:'550'},{level:6,cost:'680'},{level:7,cost:'810'},{level:8,cost:'3400'}] },
      { name: 'Downsizer', levels: [{level:5,cost:'680'},{level:6,cost:'890'},{level:7,cost:'1100'},{level:8,cost:'1310'},{level:9,cost:'1520'},{level:10,cost:'5500'}] },
      { name: 'Head Hunter', levels: [{level:6,cost:'1100'},{level:7,cost:'1440'},{level:8,cost:'1780'},{level:9,cost:'2120'},{level:10,cost:'2460'},{level:11,cost:'2800'},{level:12,cost:'8900'}] },
      { name: 'Corporate Raider', levels: [{level:7,cost:'1780'},{level:8,cost:'2330'},{level:9,cost:'2880'},{level:10,cost:'3430'},{level:11,cost:'3890'},{level:12,cost:'4350'},{level:13,cost:'4810'},{level:14,cost:'5270'},{level:15,cost:'14400'}] },
      { name: 'Big Cheese', levels: [{level:8,cost:'2880'},{level:9,cost:'3770'},{level:10,cost:'4660'},{level:11,cost:'5550'},{level:12,cost:'6440'},{level:13,cost:'7330'},{level:14,cost:'23300'},{level:15,cost:'2880'},{level:16,cost:'3770'},{level:17,cost:'4660'},{level:18,cost:'5550'},{level:19,cost:'23300'},{level:20,cost:'2880'},{level:21,cost:'3770'},{level:22,cost:'4660'},{level:23,cost:'5550'},{level:24,cost:'6440'},{level:25,cost:'7330'},{level:26,cost:'8220'},{level:27,cost:'9110'},{level:28,cost:'10000'},{level:29,cost:'23300'},{level:30,cost:'2880'},{level:31,cost:'3770'},{level:32,cost:'4660'},{level:33,cost:'5550'},{level:34,cost:'6440'},{level:35,cost:'7330'},{level:36,cost:'8220'},{level:37,cost:'9110'},{level:38,cost:'10000'},{level:39,cost:'23300'},{level:40,cost:'2880'},{level:41,cost:'3770'},{level:42,cost:'4660'},{level:43,cost:'5550'},{level:44,cost:'6440'},{level:45,cost:'7330'},{level:46,cost:'8220'},{level:47,cost:'9110'},{level:48,cost:'10000'},{level:49,cost:'23300'},{level:50,cost:'MAXED'}] },
    ],
  },
];
