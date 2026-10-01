import { useMemo, useState, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

type IconName = 'grid' | 'briefcase' | 'layers' | 'users' | 'target' | 'settings' | 'search' | 'bell' | 'plus' | 'arrowUp' | 'arrowDown' | 'more' | 'calendar' | 'download' | 'chevron' | 'check' | 'trend' | 'filter' | 'spark' | 'arrow'

const iconPaths: Record<IconName, ReactNode> = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>,
  users: <><path d="M16 20v-1.5a4.5 4.5 0 0 0-4.5-4.5h-5A4.5 4.5 0 0 0 2 18.5V20" /><circle cx="9" cy="7" r="4" /><path d="M16 4.5a4 4 0 0 1 0 7.75M22 20v-1.5a4.5 4.5 0 0 0-3-4.25" /></>,
  target: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2" /></>,
  settings: <><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.64 5.64l1.42 1.42M16.94 16.94l1.42 1.42M18.36 5.64l-1.42 1.42M7.06 16.94l-1.42 1.42" /><circle cx="12" cy="12" r="4" /></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  arrowUp: <path d="m6 15 6-6 6 6" />,
  arrowDown: <path d="m6 9 6 6 6-6" />,
  more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
  calendar: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 9h18" /></>,
  download: <><path d="M12 3v12M7 10l5 5 5-5M4 21h16" /></>,
  chevron: <path d="m7 9 5 5 5-5" />,
  check: <path d="m5 12 4 4L19 6" />,
  trend: <><path d="M3 17 9 11l4 4 8-9" /><path d="M15 6h6v6" /></>,
  filter: <><path d="M4 6h16M7 12h10M10 18h4" /></>,
  spark: <><path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></>,
  arrow: <><path d="M5 12h13M14 7l5 5-5 5" /></>,
}

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return <svg aria-hidden="true" className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{iconPaths[name]}</svg>
}

const navItems: { label: string; icon: IconName; badge?: string }[] = [
  { label: 'Overview', icon: 'grid' },
  { label: 'Sales', icon: 'target', badge: '124' },
  { label: 'Inventory', icon: 'layers', badge: '03' },
  { label: 'Job Orders', icon: 'briefcase', badge: '08' },
  { label: 'Production', icon: 'settings' },
  { label: 'Back Jobs', icon: 'arrowDown', badge: '06' },
  { label: 'Reports', icon: 'trend' },
]

const jobOrders = [
  { name: 'JO-26091', product: 'Everyday Rib Top / Black', quantity: '240 pcs', owner: 'Maya Chen', initials: 'MC', stage: 'Sewing', age: 'Due today', avatar: 'ink' },
  { name: 'JO-26088', product: 'Essential Tank / White', quantity: '180 pcs', owner: 'Jon Bell', initials: 'JB', stage: 'Cutting', age: 'Due Oct 03', avatar: 'stone' },
  { name: 'JO-26084', product: 'Soft Lounge Set / Oat', quantity: '120 pcs', owner: 'Nia Hart', initials: 'NH', stage: 'QC', age: 'Due Oct 04', avatar: 'mist' },
  { name: 'JO-26077', product: 'Daily Crop Top / Charcoal', quantity: '300 pcs', owner: 'Maya Chen', initials: 'MC', stage: 'Finishing', age: 'Due Oct 05', avatar: 'graphite' },
  { name: 'JO-26072', product: 'Classic Tee / Navy', quantity: '160 pcs', owner: 'Owen Park', initials: 'OP', stage: 'Trimming', age: 'Due Oct 07', avatar: 'paper' },
]

const sewers = [
  { rank: '01', name: 'Liza Cruz', initials: 'LC', output: '482 pcs', backJobs: '02', progress: 92, avatar: 'ink' },
  { rank: '02', name: 'Ana Velasquez', initials: 'AV', output: '436 pcs', backJobs: '03', progress: 82, avatar: 'stone' },
  { rank: '03', name: 'Rico Santos', initials: 'RS', output: '392 pcs', backJobs: '01', progress: 74, avatar: 'mist' },
  { rank: '04', name: 'Mila Reyes', initials: 'MR', output: '348 pcs', backJobs: '04', progress: 65, avatar: 'paper' },
]

const salesData = {
  ALL: { values: [38, 46, 42, 57, 51, 64, 61, 72, 68, 76, 73, 84], total: '₱913.6k', delta: '+18.8%' },
  TIKTOK: { values: [32, 41, 38, 49, 45, 61, 54, 66, 63, 71, 68, 78], total: '₱598.2k', delta: '+21.4%' },
  SHOPEE: { values: [19, 26, 24, 33, 28, 36, 39, 43, 38, 47, 44, 53], total: '₱315.4k', delta: '+13.6%' },
}

const chartLabels = ['01', '04', '07', '10', '13', '16', '19', '22', '25', '28', '30', '']
type Channel = keyof typeof salesData

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-PH').format(value)
}

function SalesChart({ channel }: { channel: Channel }) {
  const chart = salesData[channel]
  const width = 680
  const height = 206
  const left = 12
  const top = 18
  const innerWidth = width - 28
  const innerHeight = height - 44
  const points = chart.values.map((value, index) => ({ x: left + (index / (chart.values.length - 1)) * innerWidth, y: top + ((100 - value) / 100) * innerHeight, value }))
  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ')
  const area = `${line} L ${points[points.length - 1].x.toFixed(1)} ${height - 26} L ${points[0].x.toFixed(1)} ${height - 26} Z`
  return <div className="trend-chart" aria-label={`${channel} Shop sales trend`}><div className="chart-y-axis"><span>₱100k</span><span>₱75k</span><span>₱50k</span><span>₱25k</span><span>₱0</span></div><svg className="trend-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img"><defs><linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#111111" stopOpacity=".16" /><stop offset="100%" stopColor="#111111" stopOpacity="0" /></linearGradient></defs>{[0, 1, 2, 3, 4].map((lineIndex) => <line key={lineIndex} x1="0" x2={width} y1={top + (lineIndex / 4) * innerHeight} y2={top + (lineIndex / 4) * innerHeight} className="chart-grid" />)}<path d={area} fill="url(#trendFill)" /><path d={line} className="trend-line" />{points.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="3.2" className="trend-dot"><title>{point.value}k</title></circle>)}</svg><div className="chart-x-axis">{chartLabels.map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}</div></div>
}

function LogoMark() { return <div className="logo-mark" aria-label="MERA logo"><span></span><span></span></div> }
function Avatar({ initials, tone = 'ink' }: { initials: string; tone?: string }) { return <div className={`avatar avatar-${tone}`}>{initials}</div> }
function SectionTitle({ eyebrow, title, detail, action }: { eyebrow: string; title: string; detail?: string; action?: ReactNode }) { return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{detail && <p className="section-detail">{detail}</p>}</div>{action}</div> }

function App() {
  const [activeNav, setActiveNav] = useState('Overview')
  const [channel, setChannel] = useState<Channel>('ALL')
  const [query, setQuery] = useState('')
  const [stage, setStage] = useState('All stages')
  const [toast, setToast] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)

  const filteredOrders = useMemo(() => jobOrders.filter((job) => `${job.name} ${job.product} ${job.owner}`.toLowerCase().includes(query.toLowerCase()) && (stage === 'All stages' || job.stage === stage)), [query, stage])
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2600) }

  const exportSales = () => {
    const rows = [['Channel', 'Month to date', 'Top product'], ['TikTok Shop', '₱598,200', 'Everyday Rib Top / Black'], ['Shopee', '₱315,400', 'Essential Tank / White']]
    const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    link.download = 'mera-sales-report.csv'
    link.click()
    notify('Sales report exported')
  }

  return <div className="app-shell">
    <aside className="sidebar"><div className="brand-lockup"><LogoMark /><div><div className="brand-name">MERA <span>ISIMS</span></div><div className="brand-subtitle">SALES + INVENTORY MONITORING</div></div></div><div className="sidebar-rule" /><div className="rail-label">Workspace</div><nav className="main-nav" aria-label="Primary navigation">{navItems.map((item) => <button key={item.label} className={`nav-item ${activeNav === item.label ? 'active' : ''}`} onClick={() => { setActiveNav(item.label); notify(`${item.label} view selected`) }}><Icon name={item.icon} size={17} /><span>{item.label}</span>{item.badge && <span className="nav-badge">{item.badge}</span>}</button>)}</nav><div className="sidebar-lower"><div className="rail-label">System</div><button className="nav-item" onClick={() => notify('Settings are ready for your workspace')}><Icon name="settings" size={17} /><span>Settings</span></button><div className="sync-card"><div className="sync-icon"><Icon name="check" size={14} /></div><div><p>Records synced</p><span>Last update 2 min ago</span></div><span className="live-dot" /></div></div><div className="sidebar-footer"><div className="profile"><Avatar initials="AL" tone="graphite" /><div><strong>Avery Lane</strong><span>Management access</span></div></div><button className="icon-button small" aria-label="Open account menu" onClick={() => notify('Account menu opened')}><Icon name="more" size={17} /></button></div></aside>

    <main className="main-content"><header className="topbar"><div className="breadcrumb"><span>MERA ISIMS</span><Icon name="chevron" size={13} /><strong>{activeNav}</strong></div><div className="topbar-actions"><label className="search-box"><Icon name="search" size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders, products..." aria-label="Search orders, products" /><kbd>⌘ K</kbd></label><button className="icon-button notification-button" aria-label="Show alerts" onClick={() => setShowNotifications((value) => !value)}><Icon name="bell" size={17} /><span className="notification-dot" /></button><button className="avatar-button" aria-label="Open profile menu" onClick={() => notify('Profile menu opened')}><Avatar initials="AL" tone="graphite" /></button></div>{showNotifications && <div className="notification-popover"><p className="eyebrow">Inventory alert</p><strong>3 finished goods are at minimum stock</strong><span>Review and manually create a Job Order.</span></div>}</header>

      <div className="content-wrap"><section className="hero-row"><div><div className="hero-kicker"><span className="status-pill"><span className="live-dot" />MERA live records</span><span className="mono-note">/ OCT 01, 2026</span></div><h1>Good morning, Avery<span className="soft-dot">.</span></h1><p className="hero-subtitle">Sales are moving. Here’s what needs attention across MERA today.</p></div><div className="hero-actions"><button className="button button-secondary" onClick={exportSales}><Icon name="download" size={15} />Sales report</button><button className="button button-dark" onClick={() => notify('New Job Order draft opened')}><Icon name="plus" size={16} />New Job Order</button></div></section>

        <section className="kpi-grid" aria-label="MERA operating indicators"><article className="kpi-card kpi-dark"><div className="kpi-top"><span className="kpi-label">Monthly Sales</span><span className="kpi-index">01</span></div><div className="kpi-value">₱913.6<span>k</span></div><div className="kpi-footer"><span className="trend-positive"><Icon name="arrowUp" size={12} />18.8%</span><span>vs last month</span><div className="mini-bars dark-bars">{[30, 48, 40, 62, 54, 82, 68, 96].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></div></article><article className="kpi-card"><div className="kpi-top"><span className="kpi-label">Low-stock Alerts</span><span className="kpi-index">02</span></div><div className="kpi-value">03<span> SKUs</span></div><div className="kpi-footer"><span className="trend-negative"><Icon name="arrowDown" size={12} />2 new</span><span>at minimum level</span><button className="mini-action" onClick={() => { setActiveNav('Inventory'); notify('Inventory view selected') }}>Review</button></div></article><article className="kpi-card"><div className="kpi-top"><span className="kpi-label">Active Job Orders</span><span className="kpi-index">03</span></div><div className="kpi-value">08<span> J.O.s</span></div><div className="kpi-footer"><span className="trend-positive"><Icon name="arrowUp" size={12} />02</span><span>started this week</span><div className="mini-bars">{[34, 45, 38, 55, 60, 66, 58, 78].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></div></article><article className="kpi-card"><div className="kpi-top"><span className="kpi-label">QC Back Jobs</span><span className="kpi-index">04</span></div><div className="kpi-value">06<span> items</span></div><div className="kpi-footer"><span className="trend-positive"><Icon name="arrowDown" size={12} />03</span><span>pending correction</span><div className="ring-progress"><span>93%</span></div></div></article></section>

        <section className="chart-grid"><article className="panel trend-panel"><div className="panel-heading"><SectionTitle eyebrow="Sales / 01" title="Sales over time" detail="Month-to-date gross sales" action={<div className="period-tabs" role="tablist" aria-label="Sales channel">{(['ALL', 'TIKTOK', 'SHOPEE'] as Channel[]).map((option) => <button key={option} className={channel === option ? 'selected' : ''} onClick={() => setChannel(option)}>{option === 'ALL' ? 'ALL' : option === 'TIKTOK' ? 'TIKTOK SHOP' : 'SHOPEE'}</button>)}</div>} /></div><div className="trend-summary"><div><strong>{salesData[channel].total}</strong><span><Icon name="arrowUp" size={12} />{salesData[channel].delta} <em>vs previous month</em></span></div><span className="chart-caption"><span className="legend-dot" />{channel === 'ALL' ? 'TikTok Shop + Shopee' : `${channel === 'TIKTOK' ? 'TikTok Shop' : 'Shopee'} sales`}</span></div><SalesChart channel={channel} /></article><article className="panel funnel-panel"><SectionTitle eyebrow="Production / 02" title="Production flow" detail="Active output by stage" action={<button className="icon-button" aria-label="More production options" onClick={() => notify('Production options opened')}><Icon name="more" size={17} /></button>} /><div className="funnel-list">{[{ name: 'Cutting', count: '760 pcs', value: '08 J.O.s', width: 100 }, { name: 'Sewing', count: '612 pcs', value: '06 J.O.s', width: 82 }, { name: 'Trimming', count: '488 pcs', value: '05 J.O.s', width: 64 }, { name: 'Quality Control', count: '352 pcs', value: '04 J.O.s', width: 48 }, { name: 'Finishing', count: '214 pcs', value: '02 J.O.s', width: 32 }].map((item, index) => <div className="funnel-row" key={item.name}><div className="funnel-meta"><span><i className="funnel-number">0{index + 1}</i>{item.name}</span><strong>{item.count}</strong><small>{item.value}</small></div><div className="funnel-track"><span style={{ width: `${item.width}%` }} /></div></div>)}</div><div className="funnel-footer"><span><Icon name="spark" size={14} /> 28% still in production</span><button onClick={() => { setActiveNav('Production'); notify('Production view selected') }}>View production <Icon name="arrow" size={14} /></button></div></article></section>

        <section className="lower-grid"><article className="panel deals-panel"><div className="panel-heading"><SectionTitle eyebrow="Job Orders / 03" title="Production in motion" detail={`${filteredOrders.length} of 08 active Job Orders`} action={<div className="panel-actions"><select value={stage} onChange={(event) => setStage(event.target.value)} aria-label="Filter Job Orders by production stage"><option>All stages</option><option>Cutting</option><option>Sewing</option><option>Trimming</option><option>QC</option><option>Finishing</option></select><button className="icon-button" aria-label="Filter Job Orders" onClick={() => notify('Job Order filters are active')}><Icon name="filter" size={16} /></button></div>} /></div><div className="table-scroll"><table><thead><tr><th>Job order / product</th><th>Quantity</th><th>Owner</th><th>Stage</th><th>Timing</th><th aria-label="Actions" /></tr></thead><tbody>{filteredOrders.length ? filteredOrders.map((job) => <tr key={job.name}><td><div className="deal-cell"><span className="deal-marker" /><div><strong>{job.name}</strong><span>{job.product}</span></div></div></td><td className="money-cell">{job.quantity}</td><td><div className="owner-cell"><Avatar initials={job.initials} tone={job.avatar} /><span>{job.owner}</span></div></td><td><span className={`stage-pill stage-${job.stage.toLowerCase().replace(' ', '-')}`}>{job.stage}</span></td><td className="muted-cell">{job.age}</td><td><button className="row-more" aria-label={`More actions for ${job.name}`} onClick={() => notify(`${job.name} actions opened`)}><Icon name="more" size={16} /></button></td></tr>) : <tr><td colSpan={6}><div className="empty-state"><Icon name="search" size={19} />No matching Job Orders. Try another search or stage.</div></td></tr>}</tbody></table></div><div className="table-footer"><span>Showing {filteredOrders.length} results</span><button onClick={() => { setActiveNav('Job Orders'); notify('Job Orders view selected') }}>View all Job Orders <Icon name="arrow" size={14} /></button></div></article><article className="panel leaderboard-panel"><SectionTitle eyebrow="Production / 04" title="Sewer productivity" detail="Recorded output + back jobs" action={<button className="icon-button" aria-label="More productivity options" onClick={() => notify('Productivity options opened')}><Icon name="more" size={17} /></button>} /><div className="leaderboard-list">{sewers.map((sewer) => <div className="rep-row" key={sewer.name}><span className="rep-rank">{sewer.rank}</span><Avatar initials={sewer.initials} tone={sewer.avatar} /><div className="rep-main"><div className="rep-line"><strong>{sewer.name}</strong><span>{sewer.output}</span></div><div className="rep-progress"><span style={{ width: `${sewer.progress}%` }} /></div><small>{sewer.backJobs} back jobs <em>· {sewer.progress}% of daily target</em></small></div></div>)}</div><button className="full-width-button" onClick={() => { setActiveNav('Production'); notify('Sewer productivity view selected') }}>View productivity report <Icon name="arrow" size={14} /></button></article></section>

        <section className="workflow-strip"><div className="workflow-copy"><span className="eyebrow">Operations / 05</span><h2>Clean handoffs, <i>fewer</i> surprises.</h2><p>Track each garment from Job Order to finished inventory with a clear next step.</p></div><div className="workflow-steps">{['Job order', 'Cutting', 'Sewing', 'Trimming', 'QC', 'Finishing'].map((step, index) => <div className={`workflow-step ${index < 3 ? 'complete' : ''}`} key={step}><span>{index < 3 ? <Icon name="check" size={12} /> : `0${index + 1}`}</span><small>{step}</small>{index < 5 && <b>→</b>}</div>)}</div><button className="workflow-cta" onClick={() => { setActiveNav('Inventory'); notify('Inventory monitor opened') }}><span>Review inventory</span><Icon name="arrow" size={15} /></button></section><footer className="page-footer"><span>MERA / ISIMS / SALES + INVENTORY</span><span>Records refreshed 2 min ago <i className="live-dot" /></span></footer>
      </div></main>{toast && <div className="toast"><span className="toast-check"><Icon name="check" size={13} /></span>{toast}</div>}
  </div>
}

export default App
createRoot(document.getElementById('root')!).render(<App />)
