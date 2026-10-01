import { useMemo, useState, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

type IconName =
  | 'grid'
  | 'briefcase'
  | 'layers'
  | 'users'
  | 'target'
  | 'settings'
  | 'search'
  | 'bell'
  | 'plus'
  | 'arrowUp'
  | 'arrowDown'
  | 'more'
  | 'calendar'
  | 'download'
  | 'chevron'
  | 'check'
  | 'trend'
  | 'filter'
  | 'spark'
  | 'arrow'

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
  arrowUp: <><path d="m6 15 6-6 6 6" /></>,
  arrowDown: <><path d="m6 9 6 6 6-6" /></>,
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
  { label: 'Deals', icon: 'briefcase', badge: '24' },
  { label: 'Pipeline', icon: 'layers' },
  { label: 'Team', icon: 'users' },
  { label: 'Targets', icon: 'target' },
]

const deals = [
  { name: 'Autumn Studio Drop', account: 'Maison Eight', value: 82400, owner: 'Maya Chen', initials: 'MC', stage: 'Negotiation', age: '2d ago', avatar: 'ink' },
  { name: 'Core Uniforms / FW26', account: 'Northline Co.', value: 51600, owner: 'Jon Bell', initials: 'JB', stage: 'Sampling', age: '4d ago', avatar: 'stone' },
  { name: 'Retail Floor Reset', account: 'Rowan Dept.', value: 38900, owner: 'Nia Hart', initials: 'NH', stage: 'Proposal', age: '6d ago', avatar: 'mist' },
  { name: 'Nouveau Essentials', account: 'Lumen House', value: 27400, owner: 'Maya Chen', initials: 'MC', stage: 'Qualified', age: '8d ago', avatar: 'graphite' },
  { name: 'Performance Knit Run', account: 'Tactile Lab', value: 19800, owner: 'Owen Park', initials: 'OP', stage: 'Discovery', age: '11d ago', avatar: 'paper' },
]

const reps = [
  { rank: '01', name: 'Maya Chen', initials: 'MC', closed: '$128.4k', deals: '08', progress: 92, avatar: 'ink' },
  { rank: '02', name: 'Jon Bell', initials: 'JB', closed: '$96.8k', deals: '06', progress: 78, avatar: 'stone' },
  { rank: '03', name: 'Nia Hart', initials: 'NH', closed: '$82.1k', deals: '05', progress: 69, avatar: 'mist' },
  { rank: '04', name: 'Owen Park', initials: 'OP', closed: '$61.7k', deals: '04', progress: 54, avatar: 'paper' },
]

const periodData = {
  '7D': { values: [42, 49, 44, 58, 54, 72, 68], labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], total: '$246.8k', delta: '+12.4%' },
  '30D': { values: [38, 46, 42, 57, 51, 64, 61, 72, 68, 76, 73, 84], labels: ['01', '04', '07', '10', '13', '16', '19', '22', '25', '28', '30', ''], total: '$913.6k', delta: '+18.8%' },
  'Q3': { values: [32, 48, 43, 60, 57, 71, 69, 82, 78, 91, 86, 96], labels: ['Jul', '', 'Aug', '', 'Sep', '', '', '', '', '', '', ''], total: '$2.48m', delta: '+24.1%' },
}

type Period = keyof typeof periodData

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

function TrendChart({ period }: { period: Period }) {
  const chart = periodData[period]
  const width = 680
  const height = 206
  const left = 12
  const top = 18
  const innerWidth = width - 28
  const innerHeight = height - 44
  const points = chart.values.map((value, index) => {
    const x = left + (index / (chart.values.length - 1)) * innerWidth
    const y = top + ((100 - value) / 100) * innerHeight
    return { x, y, value }
  })
  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ')
  const area = `${line} L ${points[points.length - 1].x.toFixed(1)} ${height - 26} L ${points[0].x.toFixed(1)} ${height - 26} Z`

  return (
    <div className="trend-chart" aria-label={`Revenue trend for ${period}`}>
      <div className="chart-y-axis"><span>$100k</span><span>$75k</span><span>$50k</span><span>$25k</span><span>$0</span></div>
      <svg className="trend-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img">
        <defs>
          <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#111111" stopOpacity=".16" />
            <stop offset="100%" stopColor="#111111" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4].map((lineIndex) => <line key={lineIndex} x1="0" x2={width} y1={top + (lineIndex / 4) * innerHeight} y2={top + (lineIndex / 4) * innerHeight} className="chart-grid" />)}
        <path d={area} fill="url(#trendFill)" />
        <path d={line} className="trend-line" />
        {points.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="3.2" className="trend-dot"><title>{point.value}k</title></circle>)}
      </svg>
      <div className="chart-x-axis">{chart.labels.map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}</div>
    </div>
  )
}

function LogoMark() {
  return <div className="logo-mark" aria-label="PipelinePro logo"><span></span><span></span></div>
}

function Avatar({ initials, tone = 'ink' }: { initials: string; tone?: string }) {
  return <div className={`avatar avatar-${tone}`}>{initials}</div>
}

function SectionTitle({ eyebrow, title, detail, action }: { eyebrow: string; title: string; detail?: string; action?: ReactNode }) {
  return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{detail && <p className="section-detail">{detail}</p>}</div>{action}</div>
}

function App() {
  const [activeNav, setActiveNav] = useState('Overview')
  const [period, setPeriod] = useState<Period>('30D')
  const [query, setQuery] = useState('')
  const [stage, setStage] = useState('All stages')
  const [toast, setToast] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)

  const filteredDeals = useMemo(() => deals.filter((deal) => {
    const matchesQuery = `${deal.name} ${deal.account} ${deal.owner}`.toLowerCase().includes(query.toLowerCase())
    const matchesStage = stage === 'All stages' || deal.stage === stage
    return matchesQuery && matchesStage
  }), [query, stage])

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  const exportDeals = () => {
    const rows = [['Deal', 'Account', 'Value', 'Owner', 'Stage', 'Updated'], ...filteredDeals.map((deal) => [deal.name, deal.account, formatMoney(deal.value), deal.owner, deal.stage, deal.age])]
    const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'pipelinepro-active-deals.csv'
    link.click()
    URL.revokeObjectURL(url)
    notify('Active deals exported')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <LogoMark />
          <div><div className="brand-name">PIPELINE<span>PRO</span></div><div className="brand-subtitle">SALES INTELLIGENCE</div></div>
        </div>
        <div className="sidebar-rule" />
        <div className="rail-label">Workspace</div>
        <nav className="main-nav" aria-label="Primary navigation">
          {navItems.map((item) => <button key={item.label} className={`nav-item ${activeNav === item.label ? 'active' : ''}`} onClick={() => { setActiveNav(item.label); notify(`${item.label} view selected`) }}><Icon name={item.icon} size={17} /><span>{item.label}</span>{item.badge && <span className="nav-badge">{item.badge}</span>}</button>)}
        </nav>
        <div className="sidebar-lower">
          <div className="rail-label">System</div>
          <button className="nav-item" onClick={() => notify('Settings are ready for your workspace')}><Icon name="settings" size={17} /><span>Settings</span></button>
          <div className="sync-card"><div className="sync-icon"><Icon name="check" size={14} /></div><div><p>All systems live</p><span>Synced 2 min ago</span></div><span className="live-dot" /></div>
        </div>
        <div className="sidebar-footer"><div className="profile"><Avatar initials="AL" tone="graphite" /><div><strong>Avery Lane</strong><span>Sales operator</span></div></div><button className="icon-button small" aria-label="Open account menu" onClick={() => notify('Account menu opened')}><Icon name="more" size={17} /></button></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div className="breadcrumb"><span>Workspace</span><Icon name="chevron" size={13} /><strong>{activeNav}</strong></div><div className="topbar-actions"><label className="search-box"><Icon name="search" size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search deals, accounts..." aria-label="Search deals, accounts" /><kbd>⌘ K</kbd></label><button className="icon-button notification-button" aria-label="Show notifications" onClick={() => setShowNotifications((value) => !value)}><Icon name="bell" size={17} /><span className="notification-dot" /></button><button className="avatar-button" aria-label="Open profile menu" onClick={() => notify('Profile menu opened')}><Avatar initials="AL" tone="graphite" /></button></div>{showNotifications && <div className="notification-popover"><p className="eyebrow">Updates</p><strong>3 deal handoffs need review</strong><span>Last synced moments ago</span></div>}</header>

        <div className="content-wrap">
          <section className="hero-row"><div><div className="hero-kicker"><span className="status-pill"><span className="live-dot" />Live workspace</span><span className="mono-note">/ OCT 01, 2026</span></div><h1>Good morning, Avery<span className="soft-dot">.</span></h1><p className="hero-subtitle">Pipeline is moving. Here’s the shape of today’s work.</p></div><div className="hero-actions"><button className="button button-secondary" onClick={exportDeals}><Icon name="download" size={15} />Export view</button><button className="button button-dark" onClick={() => notify('New deal draft opened')}><Icon name="plus" size={16} />New deal</button></div></section>

          <section className="kpi-grid" aria-label="Key performance indicators">
            <article className="kpi-card kpi-dark"><div className="kpi-top"><span className="kpi-label">Monthly Revenue</span><span className="kpi-index">01</span></div><div className="kpi-value">$913.6<span>k</span></div><div className="kpi-footer"><span className="trend-positive"><Icon name="arrowUp" size={12} />18.8%</span><span>vs last month</span><div className="mini-bars dark-bars">{[30, 48, 40, 62, 54, 82, 68, 96].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></div></article>
            <article className="kpi-card"><div className="kpi-top"><span className="kpi-label">Win Rate</span><span className="kpi-index">02</span></div><div className="kpi-value">32<span>%</span></div><div className="kpi-footer"><span className="trend-positive"><Icon name="arrowUp" size={12} />4.6%</span><span>vs last month</span><div className="ring-progress"><span>+4.6</span></div></div></article>
            <article className="kpi-card"><div className="kpi-top"><span className="kpi-label">Deals Closed</span><span className="kpi-index">03</span></div><div className="kpi-value">24<span> deals</span></div><div className="kpi-footer"><span className="trend-positive"><Icon name="arrowUp" size={12} />12.0%</span><span>vs last month</span><div className="mini-bars">{[34, 45, 38, 55, 60, 66, 58, 78].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></div></article>
          </section>

          <section className="chart-grid">
            <article className="panel trend-panel"><div className="panel-heading"><SectionTitle eyebrow="Performance / 01" title="Revenue over time" detail="Gross revenue, USD" action={<div className="period-tabs" role="tablist" aria-label="Revenue period">{(['7D', '30D', 'Q3'] as Period[]).map((option) => <button key={option} className={period === option ? 'selected' : ''} onClick={() => setPeriod(option)}>{option}</button>)}</div>} /></div><div className="trend-summary"><div><strong>{periodData[period].total}</strong><span><Icon name="arrowUp" size={12} />{periodData[period].delta} <em>vs previous</em></span></div><span className="chart-caption"><span className="legend-dot" />Closed-won revenue</span></div><TrendChart period={period} /></article>
            <article className="panel funnel-panel"><SectionTitle eyebrow="Pipeline / 02" title="Sales funnel" detail="Current deal volume" action={<button className="icon-button" aria-label="More funnel options" onClick={() => notify('Funnel options opened')}><Icon name="more" size={17} /></button>} /><div className="funnel-list">{[{ name: 'Discovery', count: 42, value: '$182k', width: 100 }, { name: 'Qualified', count: 31, value: '$148k', width: 82 }, { name: 'Proposal', count: 18, value: '$96k', width: 62 }, { name: 'Negotiation', count: 11, value: '$74k', width: 46 }, { name: 'Closed won', count: 7, value: '$52k', width: 31 }].map((item, index) => <div className="funnel-row" key={item.name}><div className="funnel-meta"><span><i className="funnel-number">0{index + 1}</i>{item.name}</span><strong>{item.count}</strong><small>{item.value}</small></div><div className="funnel-track"><span style={{ width: `${item.width}%` }} /></div></div>)}</div><div className="funnel-footer"><span><Icon name="spark" size={14} /> 16.7% conversion</span><button onClick={() => { setActiveNav('Pipeline'); notify('Pipeline view selected') }}>View pipeline <Icon name="arrow" size={14} /></button></div></article>
          </section>

          <section className="lower-grid">
            <article className="panel deals-panel"><div className="panel-heading"><SectionTitle eyebrow="Active work / 03" title="Deals in motion" detail={`${filteredDeals.length} of 24 active opportunities`} action={<div className="panel-actions"><select value={stage} onChange={(event) => setStage(event.target.value)} aria-label="Filter deals by stage"><option>All stages</option><option>Discovery</option><option>Qualified</option><option>Proposal</option><option>Negotiation</option><option>Sampling</option></select><button className="icon-button" aria-label="Filter deals" onClick={() => notify('Deal filters are active')}><Icon name="filter" size={16} /></button></div>} /></div><div className="table-scroll"><table><thead><tr><th>Deal / account</th><th>Value</th><th>Owner</th><th>Stage</th><th>Updated</th><th aria-label="Actions" /></tr></thead><tbody>{filteredDeals.length ? filteredDeals.map((deal) => <tr key={deal.name}><td><div className="deal-cell"><span className="deal-marker" /><div><strong>{deal.name}</strong><span>{deal.account}</span></div></div></td><td className="money-cell">{formatMoney(deal.value)}</td><td><div className="owner-cell"><Avatar initials={deal.initials} tone={deal.avatar} /><span>{deal.owner}</span></div></td><td><span className={`stage-pill stage-${deal.stage.toLowerCase()}`}>{deal.stage}</span></td><td className="muted-cell">{deal.age}</td><td><button className="row-more" aria-label={`More actions for ${deal.name}`} onClick={() => notify(`${deal.name} actions opened`)}><Icon name="more" size={16} /></button></td></tr>) : <tr><td colSpan={6}><div className="empty-state"><Icon name="search" size={19} />No matching deals. Try another search or stage.</div></td></tr>}</tbody></table></div><div className="table-footer"><span>Showing {filteredDeals.length} results</span><button onClick={() => notify('All deals view selected')}>View all deals <Icon name="arrow" size={14} /></button></div></article>
            <article className="panel leaderboard-panel"><SectionTitle eyebrow="Team / 04" title="Rep leaderboard" detail="Closed revenue this month" action={<button className="icon-button" aria-label="More leaderboard options" onClick={() => notify('Leaderboard options opened')}><Icon name="more" size={17} /></button>} /><div className="leaderboard-list">{reps.map((rep) => <div className="rep-row" key={rep.name}><span className="rep-rank">{rep.rank}</span><Avatar initials={rep.initials} tone={rep.avatar} /><div className="rep-main"><div className="rep-line"><strong>{rep.name}</strong><span>{rep.closed}</span></div><div className="rep-progress"><span style={{ width: `${rep.progress}%` }} /></div><small>{rep.deals} deals closed <em>· {rep.progress}% to target</em></small></div></div>)}</div><button className="full-width-button" onClick={() => { setActiveNav('Team'); notify('Team view selected') }}>View team performance <Icon name="arrow" size={14} /></button></article>
          </section>

          <section className="workflow-strip"><div className="workflow-copy"><span className="eyebrow">Operations / 05</span><h2>Clean handoffs, <i>fewer</i> surprises.</h2><p>Inspired by the Mera flow: every deal has a next step, owner, and signal.</p></div><div className="workflow-steps">{['Job order', 'Cutting', 'Sewing', 'QC', 'Inventory'].map((step, index) => <div className={`workflow-step ${index < 3 ? 'complete' : ''}`} key={step}><span>{index < 3 ? <Icon name="check" size={12} /> : `0${index + 1}`}</span><small>{step}</small>{index < 4 && <b>→</b>}</div>)}</div><button className="workflow-cta" onClick={() => notify('Workflow monitor opened')}><span>Monitor flow</span><Icon name="arrow" size={15} /></button></section>
          <footer className="page-footer"><span>PIPELINEPRO / SALES INTELLIGENCE</span><span>Data refreshed 2 min ago <i className="live-dot" /></span></footer>
        </div>
      </main>
      {toast && <div className="toast"><span className="toast-check"><Icon name="check" size={13} /></span>{toast}</div>}
    </div>
  )
}

export default App

createRoot(document.getElementById('root')!).render(<App />)
