import type { AmendAcceptItem } from '@/types/amendAccept'
import Mock from 'mockjs'

const amendAcceptItems: AmendAcceptItem[] = [
  { seqNo: 1, isAccepted: null, amendNoticeNo: 'AN2026001', lcNo: 'CDSD116000001', lcType: '即期', issueDate: '2026/01/05', applicant: '多樂股份有限公司', beneficiary: '中國鋼鐵股份有限公司', notifyBank: '華南銀行台北分行' },
  { seqNo: 2, isAccepted: null, amendNoticeNo: 'AN2026002', lcNo: 'CDSD116000002', lcType: '遠期', issueDate: '2026/01/08', applicant: '大同股份有限公司', beneficiary: '中龍鋼鐵股份有限公司', notifyBank: '華南銀行中正分行' },
  { seqNo: 3, isAccepted: null, amendNoticeNo: 'AN2026003', lcNo: 'CDSD116000003', lcType: '即期', issueDate: '2026/01/12', applicant: '宏碁股份有限公司', beneficiary: '台灣電子股份有限公司', notifyBank: '華南銀行信義分行' },
  { seqNo: 4, isAccepted: null, amendNoticeNo: 'AN2026004', lcNo: 'CDSD116000004', lcType: '即期', issueDate: '2026/01/15', applicant: '聯合貿易股份有限公司', beneficiary: '鴻海集團股份有限公司', notifyBank: '華南銀行松山分行' },
  { seqNo: 5, isAccepted: null, amendNoticeNo: 'AN2026005', lcNo: 'CDSD116000005', lcType: '遠期', issueDate: '2026/01/18', applicant: '南山人壽股份有限公司', beneficiary: '富邦金控股份有限公司', notifyBank: '華南銀行內湖分行' },
  { seqNo: 6, isAccepted: null, amendNoticeNo: 'AN2026006', lcNo: 'CDSD116000006', lcType: '即期', issueDate: '2026/01/22', applicant: '中華電信股份有限公司', beneficiary: '台積電股份有限公司', notifyBank: '華南銀行南港分行' },
  { seqNo: 7, isAccepted: null, amendNoticeNo: 'AN2026007', lcNo: 'CDSD116000007', lcType: '遠期', issueDate: '2026/01/25', applicant: '聯發科技股份有限公司', beneficiary: '日月光半導體製造股份有限公司', notifyBank: '華南銀行新竹分行' },
  { seqNo: 8, isAccepted: null, amendNoticeNo: 'AN2026008', lcNo: 'CDSD116000008', lcType: '即期', issueDate: '2026/01/28', applicant: '統一超商股份有限公司', beneficiary: '味全食品工業股份有限公司', notifyBank: '華南銀行台中分行' },
  { seqNo: 9, isAccepted: null, amendNoticeNo: 'AN2026009', lcNo: 'CDSD116000009', lcType: '遠期', issueDate: '2026/02/02', applicant: '台塑石化股份有限公司', beneficiary: '南亞科技股份有限公司', notifyBank: '華南銀行高雄分行' },
  { seqNo: 10, isAccepted: null, amendNoticeNo: 'AN2026010', lcNo: 'CDSD116000010', lcType: '即期', issueDate: '2026/02/05', applicant: '遠東新世紀股份有限公司', beneficiary: '台化股份有限公司', notifyBank: '華南銀行板橋分行' },
  { seqNo: 11, isAccepted: null, amendNoticeNo: 'AN2026011', lcNo: 'CDSD116000011', lcType: '即期', issueDate: '2026/02/08', applicant: '永豐餘造紙股份有限公司', beneficiary: '中華紙漿股份有限公司', notifyBank: '華南銀行三重分行' },
  { seqNo: 12, isAccepted: null, amendNoticeNo: 'AN2026012', lcNo: 'CDSD116000012', lcType: '遠期', issueDate: '2026/02/11', applicant: '台灣水泥股份有限公司', beneficiary: '亞泥股份有限公司', notifyBank: '華南銀行桃園分行' },
  { seqNo: 13, isAccepted: null, amendNoticeNo: 'AN2026013', lcNo: 'CDSD116000013', lcType: '即期', issueDate: '2026/02/14', applicant: '中鋼結構股份有限公司', beneficiary: '東和鋼鐵股份有限公司', notifyBank: '華南銀行中壢分行' },
  { seqNo: 14, isAccepted: null, amendNoticeNo: 'AN2026014', lcNo: 'CDSD116000014', lcType: '遠期', issueDate: '2026/02/17', applicant: '台灣玻璃工業股份有限公司', beneficiary: '信義玻璃股份有限公司', notifyBank: '華南銀行新莊分行' },
  { seqNo: 15, isAccepted: null, amendNoticeNo: 'AN2026015', lcNo: 'CDSD116000015', lcType: '即期', issueDate: '2026/02/20', applicant: '國泰金控股份有限公司', beneficiary: '新光金控股份有限公司', notifyBank: '華南銀行土城分行' },
  { seqNo: 16, isAccepted: null, amendNoticeNo: 'AN2026016', lcNo: 'CDSD116000016', lcType: '即期', issueDate: '2026/02/23', applicant: '元大金控股份有限公司', beneficiary: '玉山金控股份有限公司', notifyBank: '華南銀行汐止分行' },
  { seqNo: 17, isAccepted: null, amendNoticeNo: 'AN2026017', lcNo: 'CDSD116000017', lcType: '遠期', issueDate: '2026/02/26', applicant: '開發金控股份有限公司', beneficiary: '第一金控股份有限公司', notifyBank: '華南銀行基隆分行' },
  { seqNo: 18, isAccepted: null, amendNoticeNo: 'AN2026018', lcNo: 'CDSD116000018', lcType: '即期', issueDate: '2026/03/01', applicant: '台灣大哥大股份有限公司', beneficiary: '遠傳電信股份有限公司', notifyBank: '華南銀行宜蘭分行' },
  { seqNo: 19, isAccepted: null, amendNoticeNo: 'AN2026019', lcNo: 'CDSD116000019', lcType: '遠期', issueDate: '2026/03/04', applicant: '亞太電信股份有限公司', beneficiary: '台灣之星電信股份有限公司', notifyBank: '華南銀行花蓮分行' },
  { seqNo: 20, isAccepted: null, amendNoticeNo: 'AN2026020', lcNo: 'CDSD116000020', lcType: '即期', issueDate: '2026/03/07', applicant: '廣達電腦股份有限公司', beneficiary: '仁寶電腦工業股份有限公司', notifyBank: '華南銀行台東分行' },
  { seqNo: 21, isAccepted: null, amendNoticeNo: 'AN2026021', lcNo: 'CDSD116000021', lcType: '遠期', issueDate: '2026/03/10', applicant: '緯創資通股份有限公司', beneficiary: '英業達股份有限公司', notifyBank: '華南銀行嘉義分行' },
  { seqNo: 22, isAccepted: null, amendNoticeNo: 'AN2026022', lcNo: 'CDSD116000022', lcType: '即期', issueDate: '2026/03/13', applicant: '大立光電股份有限公司', beneficiary: '玉晶光電股份有限公司', notifyBank: '華南銀行台南分行' },
  { seqNo: 23, isAccepted: null, amendNoticeNo: 'AN2026023', lcNo: 'CDSD116000023', lcType: '遠期', issueDate: '2026/03/16', applicant: '研華股份有限公司', beneficiary: '研揚科技股份有限公司', notifyBank: '華南銀行屏東分行' },
  { seqNo: 24, isAccepted: null, amendNoticeNo: 'AN2026024', lcNo: 'CDSD116000024', lcType: '即期', issueDate: '2026/03/19', applicant: '正崴精密工業股份有限公司', beneficiary: '台達電子工業股份有限公司', notifyBank: '華南銀行彰化分行' },
  { seqNo: 25, isAccepted: null, amendNoticeNo: 'AN2026025', lcNo: 'CDSD116000025', lcType: '遠期', issueDate: '2026/03/22', applicant: '光寶科技股份有限公司', beneficiary: '士電股份有限公司', notifyBank: '華南銀行雲林分行' },
]

Mock.mock('/api/amendAccept/list', 'post', (options: any) => {
  const body = options.body ? JSON.parse(options.body) : {}
  const { page, itemsPerPage } = body as { page: number, itemsPerPage: number }
  console.log('Received payload for /api/amendAccept/list:', { page, itemsPerPage })
  return {
    code: 200,
    message: 'success',
    data: amendAcceptItems,
    total: amendAcceptItems.length,
  }
})
