<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>DermInsight — Administration</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<style>
  :root {
    --teal:        #0eb89a;
    --teal-light:  #e6f9f6;
    --teal-dark:   #0a9880;
    --bg:          #f4f7f9;
    --white:       #ffffff;
    --sidebar-bg:  #ffffff;
    --text-dark:   #1a2332;
    --text-mid:    #4a5568;
    --text-soft:   #8898aa;
    --border:      #e8edf2;
    --danger:      #f87171;
    --warning:     #fbbf24;
    --success:     #34d399;
    --shadow-sm:   0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
    --shadow-md:   0 4px 16px rgba(0,0,0,.08);
    --shadow-lg:   0 8px 32px rgba(0,0,0,.10);
    --radius:      12px;
    --radius-sm:   8px;
    --sidebar-w:   260px;
    --font:        'DM Sans', sans-serif;
    --font-mono:   'DM Mono', monospace;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: var(--font);
    background: var(--bg);
    color: var(--text-dark);
    display: flex;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── SIDEBAR ─────────────────────────────────────── */
  .sidebar {
    width: var(--sidebar-w);
    background: var(--sidebar-bg);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 100;
    transition: transform .3s ease;
  }

  .sidebar-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 24px 20px 20px;
    border-bottom: 1px solid var(--border);
  }

  .brand-icon {
    width: 40px; height: 40px;
    background: linear-gradient(135deg, var(--teal), var(--teal-dark));
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 18px;
    box-shadow: 0 4px 12px rgba(14,184,154,.35);
  }

  .brand-text h2 { font-size: 16px; font-weight: 700; color: var(--text-dark); }
  .brand-text p  { font-size: 11px; color: var(--text-soft); font-weight: 400; margin-top: 1px; }

  .sidebar-nav {
    flex: 1;
    padding: 16px 12px;
    overflow-y: auto;
  }

  .nav-section {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--text-soft);
    padding: 12px 8px 6px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    color: var(--text-mid);
    font-size: 14px;
    font-weight: 500;
    transition: all .2s;
    margin-bottom: 2px;
    text-decoration: none;
  }

  .nav-item:hover { background: var(--teal-light); color: var(--teal); }
  .nav-item.active { background: var(--teal); color: white; box-shadow: 0 4px 12px rgba(14,184,154,.3); }

  .nav-item svg { width: 18px; height: 18px; flex-shrink: 0; }
  .nav-badge {
    margin-left: auto;
    background: var(--danger);
    color: white;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 20px;
  }
  .nav-item.active .nav-badge { background: rgba(255,255,255,.3); }

  .sidebar-footer {
    padding: 16px 12px;
    border-top: 1px solid var(--border);
  }

  .sidebar-footer .nav-item { color: var(--text-mid); }
  .sidebar-footer .nav-item:hover { background: var(--teal-light); color: var(--teal); }

  .logout-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    color: #f87171;
    font-size: 14px;
    font-weight: 500;
    transition: all .2s;
    margin-top: 4px;
  }
  .logout-item:hover { background: #fff1f1; }
  .logout-item svg { width: 18px; height: 18px; }

  /* ── MAIN ─────────────────────────────────────────── */
  .main {
    margin-left: var(--sidebar-w);
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  /* ── TOPBAR ───────────────────────────────────────── */
  .topbar {
    background: var(--white);
    border-bottom: 1px solid var(--border);
    padding: 0 32px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }

  .topbar-left h1 { font-size: 20px; font-weight: 700; color: var(--text-dark); }
  .topbar-left p  { font-size: 13px; color: var(--text-soft); margin-top: 1px; }

  .topbar-right { display: flex; align-items: center; gap: 12px; }

  .topbar-btn {
    width: 38px; height: 38px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--white);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--text-mid);
    position: relative;
    transition: all .2s;
  }
  .topbar-btn:hover { border-color: var(--teal); color: var(--teal); }
  .topbar-btn svg { width: 18px; height: 18px; }

  .notif-dot {
    position: absolute; top: 6px; right: 6px;
    width: 8px; height: 8px;
    background: var(--danger);
    border-radius: 50%;
    border: 2px solid white;
  }

  .avatar {
    width: 38px; height: 38px;
    background: linear-gradient(135deg, var(--teal), var(--teal-dark));
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: white;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
  }

  /* ── PAGE CONTENT ─────────────────────────────────── */
  .page { display: none; padding: 32px; animation: fadeIn .3s ease; }
  .page.active { display: block; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  /* ── STAT CARDS ───────────────────────────────────── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 28px;
  }

  .stat-card {
    background: var(--white);
    border-radius: var(--radius);
    padding: 24px;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    transition: box-shadow .2s, transform .2s;
    position: relative;
    overflow: hidden;
  }
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--teal), var(--teal-dark));
    opacity: 0;
    transition: opacity .2s;
  }
  .stat-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
  .stat-card:hover::before { opacity: 1; }

  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }

  .stat-icon {
    width: 44px; height: 44px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
  }
  .stat-icon svg { width: 22px; height: 22px; }
  .stat-icon.teal   { background: var(--teal-light); color: var(--teal); }
  .stat-icon.salmon { background: #fff0ef; color: #f87171; }
  .stat-icon.green  { background: #ecfdf5; color: #059669; }
  .stat-icon.amber  { background: #fffbeb; color: #d97706; }

  .stat-trend {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 20px;
  }
  .stat-trend.up   { color: #059669; background: #ecfdf5; }
  .stat-trend.down { color: #dc2626; background: #fef2f2; }
  .stat-trend svg  { width: 12px; height: 12px; }

  .stat-value { font-size: 28px; font-weight: 700; color: var(--text-dark); line-height: 1; }
  .stat-label { font-size: 13px; color: var(--text-soft); margin-top: 4px; }

  /* ── CARDS ────────────────────────────────────────── */
  .card {
    background: var(--white);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
  }

  .card-header {
    padding: 20px 24px 16px;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-title { font-size: 15px; font-weight: 700; color: var(--text-dark); }
  .card-subtitle { font-size: 12px; color: var(--text-soft); margin-top: 2px; }

  .card-body { padding: 20px 24px; }

  /* ── DASHBOARD GRID ───────────────────────────────── */
  .dashboard-grid {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 20px;
  }

  /* ── ACTIVITY LIST ────────────────────────────────── */
  .activity-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid var(--border);
    transition: background .15s;
  }
  .activity-item:last-child { border-bottom: none; }

  .activity-avatar {
    width: 38px; height: 38px;
    border-radius: 50%;
    background: var(--teal-light);
    color: var(--teal);
    font-size: 13px;
    font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .activity-info { flex: 1; min-width: 0; }
  .activity-name { font-size: 14px; font-weight: 600; color: var(--text-dark); }
  .activity-action { font-size: 12px; color: var(--text-soft); margin-top: 2px; }
  .activity-time { font-size: 11px; color: var(--text-soft); white-space: nowrap; font-family: var(--font-mono); }

  .badge {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
  }
  .badge-teal    { background: var(--teal-light); color: var(--teal); }
  .badge-red     { background: #fff0ef; color: #f87171; }
  .badge-amber   { background: #fffbeb; color: #d97706; }
  .badge-purple  { background: #f5f3ff; color: #7c3aed; }
  .badge-green   { background: #ecfdf5; color: #059669; }
  .badge-blue    { background: #eff6ff; color: #2563eb; }
  .badge-gray    { background: #f3f4f6; color: #6b7280; }
  .badge-suspend { background: #fef2f2; color: #dc2626; }

  /* ── PATHOLOGY BARS ───────────────────────────────── */
  .patho-item {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  .patho-item:last-child { margin-bottom: 0; }
  .patho-name { font-size: 13px; font-weight: 500; width: 130px; flex-shrink: 0; }
  .patho-bar-wrap { flex: 1; height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
  .patho-bar { height: 100%; background: linear-gradient(90deg, var(--teal), var(--teal-dark)); border-radius: 3px; transition: width 1s ease; }
  .patho-count { font-size: 12px; color: var(--text-soft); white-space: nowrap; min-width: 90px; text-align: right; font-family: var(--font-mono); }

  /* ── USERS TABLE ──────────────────────────────────── */
  .toolbar {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    align-items: center;
  }

  .search-wrap {
    flex: 1;
    position: relative;
  }
  .search-wrap svg {
    position: absolute;
    left: 14px; top: 50%;
    transform: translateY(-50%);
    width: 16px; height: 16px;
    color: var(--text-soft);
  }
  .search-input {
    width: 100%;
    height: 42px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0 16px 0 40px;
    font-family: var(--font);
    font-size: 14px;
    color: var(--text-dark);
    background: var(--white);
    outline: none;
    transition: border-color .2s;
  }
  .search-input:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(14,184,154,.12); }
  .search-input::placeholder { color: var(--text-soft); }

  .btn {
    height: 42px;
    padding: 0 20px;
    border-radius: var(--radius-sm);
    font-family: var(--font);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all .2s;
  }
  .btn svg { width: 16px; height: 16px; }
  .btn-primary { background: var(--teal); color: white; box-shadow: 0 4px 12px rgba(14,184,154,.3); }
  .btn-primary:hover { background: var(--teal-dark); transform: translateY(-1px); }
  .btn-outline { background: white; color: var(--text-mid); border: 1px solid var(--border); }
  .btn-outline:hover { border-color: var(--teal); color: var(--teal); }
  .btn-sm { height: 34px; padding: 0 14px; font-size: 13px; }
  .btn-danger-outline { background: white; color: var(--danger); border: 1px solid #fecaca; }
  .btn-danger-outline:hover { background: #fef2f2; }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: var(--text-soft);
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    background: #fafbfc;
  }

  td {
    padding: 14px 16px;
    font-size: 14px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }

  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #fafbff; }

  .user-cell {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .user-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: var(--teal-light);
    color: var(--teal);
    font-size: 12px;
    font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .user-name  { font-size: 14px; font-weight: 600; color: var(--text-dark); }
  .user-email { font-size: 12px; color: var(--text-soft); }

  .action-btn {
    width: 32px; height: 32px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: white;
    cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center;
    color: var(--text-soft);
    margin-right: 4px;
    transition: all .2s;
  }
  .action-btn:hover       { border-color: var(--teal); color: var(--teal); }
  .action-btn.delete:hover{ border-color: var(--danger); color: var(--danger); }
  .action-btn svg { width: 14px; height: 14px; }

  /* ── STATISTICS ───────────────────────────────────── */
  .tabs {
    display: flex;
    gap: 4px;
    margin-bottom: 28px;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 4px;
    width: fit-content;
  }

  .tab {
    padding: 8px 20px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    color: var(--text-mid);
    border: none;
    background: none;
    font-family: var(--font);
    transition: all .2s;
  }
  .tab.active { background: var(--teal); color: white; box-shadow: 0 2px 8px rgba(14,184,154,.3); }
  .tab:hover:not(.active) { color: var(--teal); background: var(--teal-light); }

  .stats-charts-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }

  .chart-container { position: relative; height: 260px; }

  .stats-mini-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 20px;
  }

  .mini-stat {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 18px 20px;
    text-align: center;
  }
  .mini-stat-val  { font-size: 26px; font-weight: 700; color: var(--teal); }
  .mini-stat-label{ font-size: 12px; color: var(--text-soft); margin-top: 4px; }

  /* ── CONSEILS ─────────────────────────────────────── */
  .conseil-item {
    display: flex;
    gap: 16px;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
    align-items: flex-start;
    transition: background .15s;
  }
  .conseil-item:last-child { border-bottom: none; }
  .conseil-item:hover { background: #fafbff; }

  .conseil-icon {
    width: 40px; height: 40px;
    background: var(--teal-light);
    color: var(--teal);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .conseil-icon svg { width: 20px; height: 20px; }

  .conseil-body { flex: 1; }
  .conseil-title { font-size: 15px; font-weight: 700; color: var(--text-dark); }
  .conseil-desc  { font-size: 13px; color: var(--text-mid); margin: 6px 0 10px; line-height: 1.5; }
  .conseil-tags  { display: flex; gap: 6px; flex-wrap: wrap; }

  .conseil-actions { display: flex; gap: 6px; align-items: center; margin-left: auto; }

  /* ── PARAMÈTRES ───────────────────────────────────── */
  .settings-section {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    margin-bottom: 20px;
    overflow: hidden;
  }

  .settings-section-header {
    padding: 20px 24px 16px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .settings-section-icon {
    width: 36px; height: 36px;
    border-radius: 8px;
    background: var(--teal-light);
    color: var(--teal);
    display: flex; align-items: center; justify-content: center;
  }
  .settings-section-icon svg { width: 18px; height: 18px; }

  .settings-section-title    { font-size: 15px; font-weight: 700; color: var(--text-dark); }
  .settings-section-subtitle { font-size: 12px; color: var(--text-soft); }

  .settings-row {
    display: flex;
    align-items: center;
    padding: 18px 24px;
    border-bottom: 1px solid var(--border);
    gap: 16px;
  }
  .settings-row:last-child { border-bottom: none; }

  .settings-label { flex: 1; }
  .settings-label-title { font-size: 14px; font-weight: 600; color: var(--text-dark); }
  .settings-label-desc  { font-size: 12px; color: var(--text-soft); margin-top: 2px; }

  .settings-input {
    width: 320px;
    height: 40px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0 14px;
    font-family: var(--font);
    font-size: 14px;
    color: var(--text-dark);
    background: var(--white);
    outline: none;
    transition: border-color .2s;
  }
  .settings-input:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(14,184,154,.12); }

  .settings-select {
    width: 200px;
    height: 40px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0 14px;
    font-family: var(--font);
    font-size: 14px;
    color: var(--text-dark);
    background: white;
    outline: none;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238898aa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 16px;
    padding-right: 36px;
  }

  /* Toggle */
  .toggle { position: relative; width: 48px; height: 26px; }
  .toggle input { opacity: 0; width: 0; height: 0; }
  .toggle-slider {
    position: absolute; cursor: pointer;
    inset: 0;
    background: #d1d5db;
    border-radius: 13px;
    transition: .3s;
  }
  .toggle-slider::before {
    content: '';
    position: absolute;
    width: 20px; height: 20px;
    left: 3px; top: 3px;
    background: white;
    border-radius: 50%;
    transition: .3s;
    box-shadow: 0 1px 4px rgba(0,0,0,.2);
  }
  .toggle input:checked + .toggle-slider { background: var(--teal); }
  .toggle input:checked + .toggle-slider::before { transform: translateX(22px); }

  /* ── MODAL ────────────────────────────────────────── */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,.45);
    backdrop-filter: blur(4px);
    z-index: 200;
    display: none;
    align-items: center;
    justify-content: center;
  }
  .modal-overlay.open { display: flex; }

  .modal {
    background: white;
    border-radius: var(--radius);
    width: 500px;
    max-width: 95vw;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: var(--shadow-lg);
    animation: slideUp .25s ease;
  }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  .modal-header {
    padding: 24px 28px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .modal-title { font-size: 17px; font-weight: 700; }

  .modal-close {
    width: 32px; height: 32px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: white;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--text-soft);
    font-size: 18px;
    transition: all .2s;
  }
  .modal-close:hover { background: var(--danger); color: white; border-color: var(--danger); }

  .modal-body { padding: 24px 28px; }
  .modal-footer {
    padding: 16px 28px 24px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .form-group { margin-bottom: 18px; }
  .form-label { display: block; font-size: 13px; font-weight: 600; color: var(--text-dark); margin-bottom: 6px; }
  .form-input {
    width: 100%;
    height: 42px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0 14px;
    font-family: var(--font);
    font-size: 14px;
    color: var(--text-dark);
    background: white;
    outline: none;
    transition: border-color .2s;
  }
  .form-input:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(14,184,154,.12); }

  .form-select {
    width: 100%;
    height: 42px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0 14px;
    font-family: var(--font);
    font-size: 14px;
    color: var(--text-dark);
    background: white;
    outline: none;
    cursor: pointer;
  }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  textarea.form-input {
    height: auto;
    padding: 12px 14px;
    resize: vertical;
    min-height: 90px;
  }

  /* ── TOAST ────────────────────────────────────────── */
  .toast-container {
    position: fixed;
    bottom: 24px; right: 24px;
    z-index: 500;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .toast {
    background: var(--text-dark);
    color: white;
    padding: 12px 18px;
    border-radius: var(--radius-sm);
    font-size: 14px;
    font-weight: 500;
    box-shadow: var(--shadow-lg);
    display: flex;
    align-items: center;
    gap: 10px;
    animation: toastIn .3s ease;
    border-left: 4px solid var(--teal);
  }
  .toast.success { border-left-color: var(--success); }
  .toast.error   { border-left-color: var(--danger); }
  .toast svg { width: 16px; height: 16px; flex-shrink: 0; }

  @keyframes toastIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }

  /* ── PAGINATION ───────────────────────────────────── */
  .pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-top: 1px solid var(--border);
  }
  .pagination-info { font-size: 13px; color: var(--text-soft); }
  .pagination-btns { display: flex; gap: 4px; }
  .page-btn {
    width: 34px; height: 34px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: white;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-mid);
    display: flex; align-items: center; justify-content: center;
    transition: all .2s;
  }
  .page-btn:hover  { border-color: var(--teal); color: var(--teal); }
  .page-btn.active { background: var(--teal); color: white; border-color: var(--teal); }
  .page-btn svg    { width: 14px; height: 14px; }

  /* ── EMPTY STATE ──────────────────────────────────── */
  .empty-state {
    text-align: center;
    padding: 48px 24px;
  }
  .empty-state-icon {
    width: 64px; height: 64px;
    background: var(--teal-light);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px;
    color: var(--teal);
  }
  .empty-state-icon svg { width: 28px; height: 28px; }
  .empty-state h3 { font-size: 16px; font-weight: 700; color: var(--text-dark); }
  .empty-state p  { font-size: 13px; color: var(--text-soft); margin-top: 6px; }

  /* ── SCROLLBAR ────────────────────────────────────── */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #c0cdd8; }

  /* ── RESPONSIVE ───────────────────────────────────── */
  @media (max-width: 1200px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .dashboard-grid { grid-template-columns: 1fr; }
    .stats-charts-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    .sidebar { transform: translateX(-100%); }
    .main { margin-left: 0; }
    .stats-grid { grid-template-columns: 1fr; }
    .stats-mini-grid { grid-template-columns: 1fr 1fr; }
  }
</style>
</head>
<body>

<!-- ─── SIDEBAR ──────────────────────────────────────── -->
<aside class="sidebar">
  <div class="sidebar-brand">
    <div class="brand-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    </div>
    <div class="brand-text">
      <h2>DermInsight</h2>
      <p>Administration</p>
    </div>
  </div>

  <nav class="sidebar-nav">
    <div class="nav-section">Principal</div>
    <a class="nav-item active" onclick="switchPage('dashboard')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
      Tableau de bord
      <span class="nav-badge">12</span>
    </a>
    <a class="nav-item" onclick="switchPage('users')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      Utilisateurs
    </a>
    <a class="nav-item" onclick="switchPage('stats')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
      Statistiques
    </a>
    <div class="nav-section" style="margin-top:8px;">Gestion</div>
    <a class="nav-item" onclick="switchPage('conseils')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
      Conseils
    </a>
    <a class="nav-item" onclick="switchPage('settings')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/><path d="M12 2a10 10 0 0 1 0 20M2 12a10 10 0 0 0 20 0"/></svg>
      Paramètres
    </a>
  </nav>

  <div class="sidebar-footer">
    <a class="nav-item" onclick="switchPage('dashboard')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Retour à l'app
    </a>
    <div class="logout-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      Déconnexion
    </div>
  </div>
</aside>

<!-- ─── MAIN ──────────────────────────────────────────── -->
<main class="main">

  <!-- TOPBAR -->
  <header class="topbar">
    <div class="topbar-left">
      <h1 id="page-title">Tableau de bord</h1>
      <p id="page-subtitle">Vue d'ensemble de l'activité</p>
    </div>
    <div class="topbar-right">
      <button class="topbar-btn" title="Notifications">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        <span class="notif-dot"></span>
      </button>
      <button class="topbar-btn" title="Actualiser" onclick="showToast('Données actualisées', 'success')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
      </button>
      <div class="avatar">AD</div>
    </div>
  </header>

  <!-- ════════ PAGE: DASHBOARD ════════ -->
  <div class="page active" id="page-dashboard">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon teal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div class="stat-trend up">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            +12%
          </div>
        </div>
        <div class="stat-value">1 248</div>
        <div class="stat-label">Utilisateurs</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon salmon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </div>
          <div class="stat-trend up">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            +23%
          </div>
        </div>
        <div class="stat-value">87</div>
        <div class="stat-label">Analyses aujourd'hui</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <div class="stat-trend up">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            +8%
          </div>
        </div>
        <div class="stat-value">15 432</div>
        <div class="stat-label">Analyses totales</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon amber">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div class="stat-trend down">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
            -5%
          </div>
        </div>
        <div class="stat-value">12</div>
        <div class="stat-label">Cas urgents</div>
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- Recent Activity -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Activité récente</div>
            <div class="card-subtitle">Dernières actions des utilisateurs</div>
          </div>
          <button class="btn btn-outline btn-sm">Voir tout</button>
        </div>
        <div class="card-body">
          <div class="activity-item">
            <div class="activity-avatar">MC</div>
            <div class="activity-info">
              <div class="activity-name">Marie C.</div>
              <div class="activity-action">Nouvelle analyse</div>
            </div>
            <span class="badge badge-teal">Eczéma léger</span>
            <div class="activity-time">Il y a 5 min</div>
          </div>
          <div class="activity-item">
            <div class="activity-avatar">TB</div>
            <div class="activity-info">
              <div class="activity-name">Thomas B.</div>
              <div class="activity-action">Nouvelle analyse</div>
            </div>
            <span class="badge badge-red">Lésion suspecte</span>
            <div class="activity-time">Il y a 12 min</div>
          </div>
          <div class="activity-item">
            <div class="activity-avatar">SL</div>
            <div class="activity-info">
              <div class="activity-name">Sophie L.</div>
              <div class="activity-action">Inscription</div>
            </div>
            <span class="badge badge-green">Nouveau compte</span>
            <div class="activity-time">Il y a 20 min</div>
          </div>
          <div class="activity-item">
            <div class="activity-avatar">PM</div>
            <div class="activity-info">
              <div class="activity-name">Pierre M.</div>
              <div class="activity-action">Nouvelle analyse</div>
            </div>
            <span class="badge badge-amber">Acné modérée</span>
            <div class="activity-time">Il y a 35 min</div>
          </div>
          <div class="activity-item">
            <div class="activity-avatar">CD</div>
            <div class="activity-info">
              <div class="activity-name">Claire D.</div>
              <div class="activity-action">Nouvelle analyse</div>
            </div>
            <span class="badge badge-purple">Réaction allergique</span>
            <div class="activity-time">Il y a 1h</div>
          </div>
        </div>
      </div>

      <!-- Pathologies -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Pathologies détectées</div>
            <div class="card-subtitle">Répartition globale</div>
          </div>
        </div>
        <div class="card-body">
          <div class="patho-item">
            <div class="patho-name">Eczéma</div>
            <div class="patho-bar-wrap"><div class="patho-bar" style="width:35%"></div></div>
            <div class="patho-count">4 521 (35%)</div>
          </div>
          <div class="patho-item">
            <div class="patho-name">Acné</div>
            <div class="patho-bar-wrap"><div class="patho-bar" style="width:30%"></div></div>
            <div class="patho-count">3 876 (30%)</div>
          </div>
          <div class="patho-item">
            <div class="patho-name">Dermatite</div>
            <div class="patho-bar-wrap"><div class="patho-bar" style="width:16%"></div></div>
            <div class="patho-count">2 058 (16%)</div>
          </div>
          <div class="patho-item">
            <div class="patho-name">Réaction allergique</div>
            <div class="patho-bar-wrap"><div class="patho-bar" style="width:12%"></div></div>
            <div class="patho-count">1 543 (12%)</div>
          </div>
          <div class="patho-item">
            <div class="patho-name">Lésion suspecte</div>
            <div class="patho-bar-wrap"><div class="patho-bar" style="width:7%"></div></div>
            <div class="patho-count">901 (7%)</div>
          </div>
        </div>
        <!-- Donut chart mini -->
        <div style="padding:0 24px 24px; display:flex; justify-content:center;">
          <canvas id="donutChart" width="160" height="160"></canvas>
        </div>
      </div>
    </div>
  </div>

  <!-- ════════ PAGE: USERS ════════ -->
  <div class="page" id="page-users">
    <div class="toolbar">
      <div class="search-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input class="search-input" type="text" placeholder="Rechercher un utilisateur..." id="user-search" oninput="filterUsers()"/>
      </div>
      <button class="btn btn-outline" onclick="showToast('Filtres appliqués')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
        Filtrer
      </button>
      <button class="btn btn-primary" onclick="openModal('add-user-modal')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Ajouter
      </button>
    </div>

    <div class="card">
      <table>
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Âge / Sexe</th>
            <th>Analyses</th>
            <th>Statut</th>
            <th>Inscription</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="users-tbody">
          <!-- rendered by JS -->
        </tbody>
      </table>
      <div class="pagination">
        <div class="pagination-info">Affichage 1–6 sur 6 utilisateurs</div>
        <div class="pagination-btns">
          <button class="page-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg></button>
          <button class="page-btn active">1</button>
          <button class="page-btn">2</button>
          <button class="page-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></button>
        </div>
      </div>
    </div>
  </div>

  <!-- ════════ PAGE: STATISTICS ════════ -->
  <div class="page" id="page-stats">
    <div class="tabs">
      <button class="tab active" onclick="switchTab(this,'tab-overview')">Vue d'ensemble</button>
      <button class="tab" onclick="switchTab(this,'tab-patho')">Pathologies</button>
    </div>

    <div id="tab-overview">
      <div class="stats-charts-grid">
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Analyses cette semaine</div>
              <div class="card-subtitle">Nombre d'analyses par jour</div>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-container">
              <canvas id="barChart"></canvas>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Répartition par statut</div>
              <div class="card-subtitle">Utilisateurs actifs vs suspendus</div>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-container">
              <canvas id="doughnutStats"></canvas>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Croissance mensuelle</div>
          <div class="card-subtitle">Évolution sur 6 mois</div>
        </div>
        <div class="card-body">
          <div class="chart-container" style="height:220px;">
            <canvas id="lineChart"></canvas>
          </div>
        </div>
      </div>

      <div class="stats-mini-grid">
        <div class="mini-stat">
          <div class="mini-stat-val">94%</div>
          <div class="mini-stat-label">Taux de satisfaction</div>
        </div>
        <div class="mini-stat">
          <div class="mini-stat-val">2.4s</div>
          <div class="mini-stat-label">Temps moyen d'analyse</div>
        </div>
        <div class="mini-stat">
          <div class="mini-stat-val">98.7%</div>
          <div class="mini-stat-label">Disponibilité serveur</div>
        </div>
      </div>
    </div>

    <div id="tab-patho" style="display:none;">
      <div class="stats-charts-grid">
        <div class="card">
          <div class="card-header">
            <div class="card-title">Pathologies par mois</div>
          </div>
          <div class="card-body">
            <div class="chart-container">
              <canvas id="pathoBarChart"></canvas>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="card-title">Répartition pathologies</div>
          </div>
          <div class="card-body">
            <div class="chart-container">
              <canvas id="pathoPieChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ════════ PAGE: CONSEILS ════════ -->
  <div class="page" id="page-conseils">
    <div class="toolbar">
      <div class="search-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input class="search-input" type="text" placeholder="Rechercher un conseil..." oninput="filterConseils(this.value)"/>
      </div>
      <button class="btn btn-primary" onclick="openModal('add-conseil-modal')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nouveau conseil
      </button>
    </div>

    <div class="card">
      <div id="conseils-list"><!-- rendered by JS --></div>
    </div>
  </div>

  <!-- ════════ PAGE: SETTINGS ════════ -->
  <div class="page" id="page-settings">

    <!-- Général -->
    <div class="settings-section">
      <div class="settings-section-header">
        <div class="settings-section-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </div>
        <div>
          <div class="settings-section-title">Général</div>
          <div class="settings-section-subtitle">Paramètres généraux de l'application</div>
        </div>
      </div>
      <div class="settings-row">
        <div class="settings-label">
          <div class="settings-label-title">Nom de l'application</div>
          <div class="settings-label-desc">Affiché dans l'interface et les emails</div>
        </div>
        <input class="settings-input" type="text" value="DermInsight"/>
      </div>
      <div class="settings-row">
        <div class="settings-label">
          <div class="settings-label-title">Langue par défaut</div>
          <div class="settings-label-desc">Langue de l'interface utilisateur</div>
        </div>
        <select class="settings-select">
          <option>Français</option>
          <option>English</option>
          <option>العربية</option>
        </select>
      </div>
      <div class="settings-row">
        <div class="settings-label">
          <div class="settings-label-title">Fuseau horaire</div>
        </div>
        <select class="settings-select">
          <option>Europe/Paris</option>
          <option>Africa/Tunis</option>
          <option>UTC</option>
        </select>
      </div>
    </div>

    <!-- Sécurité -->
    <div class="settings-section">
      <div class="settings-section-header">
        <div class="settings-section-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div>
          <div class="settings-section-title">Sécurité</div>
          <div class="settings-section-subtitle">Sécurité et authentification</div>
        </div>
      </div>
      <div class="settings-row">
        <div class="settings-label">
          <div class="settings-label-title">Double authentification</div>
          <div class="settings-label-desc">Exiger la 2FA pour les comptes admin</div>
        </div>
        <label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label>
      </div>
      <div class="settings-row">
        <div class="settings-label">
          <div class="settings-label-title">Chiffrement des images</div>
          <div class="settings-label-desc">Chiffrer les images médicales stockées</div>
        </div>
        <label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label>
      </div>
      <div class="settings-row">
        <div class="settings-label">
          <div class="settings-label-title">Anonymisation EXIF</div>
          <div class="settings-label-desc">Supprimer les métadonnées des images</div>
        </div>
        <label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label>
      </div>
      <div class="settings-row">
        <div class="settings-label">
          <div class="settings-label-title">Durée de session</div>
          <div class="settings-label-desc">Expiration automatique de session</div>
        </div>
        <select class="settings-select">
          <option>30 minutes</option>
          <option>1 heure</option>
          <option>4 heures</option>
          <option>24 heures</option>
        </select>
      </div>
    </div>

    <!-- Notifications -->
    <div class="settings-section">
      <div class="settings-section-header">
        <div class="settings-section-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </div>
        <div>
          <div class="settings-section-title">Notifications</div>
          <div class="settings-section-subtitle">Alertes et notifications admin</div>
        </div>
      </div>
      <div class="settings-row">
        <div class="settings-label">
          <div class="settings-label-title">Alertes cas urgents</div>
          <div class="settings-label-desc">Notification email pour les lésions suspectes</div>
        </div>
        <label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label>
      </div>
      <div class="settings-row">
        <div class="settings-label">
          <div class="settings-label-title">Rapport hebdomadaire</div>
          <div class="settings-label-desc">Résumé des analyses chaque lundi</div>
        </div>
        <label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label>
      </div>
      <div class="settings-row">
        <div class="settings-label">
          <div class="settings-label-title">Nouvelles inscriptions</div>
        </div>
        <label class="toggle"><input type="checkbox"/><span class="toggle-slider"></span></label>
      </div>
      <div class="settings-row">
        <div class="settings-label">
          <div class="settings-label-title">Email admin</div>
          <div class="settings-label-desc">Adresse de réception des alertes</div>
        </div>
        <input class="settings-input" type="email" value="admin@derminsight.com"/>
      </div>
    </div>

    <!-- IA / Modèle -->
    <div class="settings-section">
      <div class="settings-section-header">
        <div class="settings-section-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        </div>
        <div>
          <div class="settings-section-title">Modèle IA</div>
          <div class="settings-section-subtitle">Configuration du moteur d'analyse</div>
        </div>
      </div>
      <div class="settings-row">
        <div class="settings-label">
          <div class="settings-label-title">Seuil de confiance minimum</div>
          <div class="settings-label-desc">Résultats sous ce seuil marqués comme incertains</div>
        </div>
        <input class="settings-input" type="number" value="75" min="0" max="100" style="width:100px;"/>
      </div>
      <div class="settings-row">
        <div class="settings-label">
          <div class="settings-label-title">Mode de détection</div>
        </div>
        <select class="settings-select">
          <option>Standard</option>
          <option>Haute précision</option>
          <option>Rapide</option>
        </select>
      </div>
    </div>

    <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:8px;">
      <button class="btn btn-outline" onclick="showToast('Modifications annulées')">Annuler</button>
      <button class="btn btn-primary" onclick="showToast('Paramètres sauvegardés !', 'success')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        Sauvegarder
      </button>
    </div>
  </div>

</main>

<!-- ─── MODALS ─────────────────────────────────────────── -->

<!-- Add User -->
<div class="modal-overlay" id="add-user-modal">
  <div class="modal">
    <div class="modal-header">
      <div class="modal-title">Ajouter un utilisateur</div>
      <button class="modal-close" onclick="closeModal('add-user-modal')">×</button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Prénom</label>
          <input class="form-input" type="text" placeholder="Marie"/>
        </div>
        <div class="form-group">
          <label class="form-label">Nom</label>
          <input class="form-input" type="text" placeholder="Dupont"/>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input class="form-input" type="email" placeholder="marie@example.com"/>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Âge</label>
          <input class="form-input" type="number" placeholder="32" min="1" max="120"/>
        </div>
        <div class="form-group">
          <label class="form-label">Sexe</label>
          <select class="form-select">
            <option value="">Sélectionner...</option>
            <option>Féminin</option>
            <option>Masculin</option>
            <option>Autre</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Statut</label>
        <select class="form-select">
          <option>Actif</option>
          <option>Suspendu</option>
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal('add-user-modal')">Annuler</button>
      <button class="btn btn-primary" onclick="addUser()">Créer l'utilisateur</button>
    </div>
  </div>
</div>

<!-- Edit User -->
<div class="modal-overlay" id="edit-user-modal">
  <div class="modal">
    <div class="modal-header">
      <div class="modal-title">Modifier l'utilisateur</div>
      <button class="modal-close" onclick="closeModal('edit-user-modal')">×</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">Nom complet</label>
        <input class="form-input" type="text" id="edit-name"/>
      </div>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input class="form-input" type="email" id="edit-email"/>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Âge</label>
          <input class="form-input" type="number" id="edit-age"/>
        </div>
        <div class="form-group">
          <label class="form-label">Sexe</label>
          <select class="form-select" id="edit-sex">
            <option>Féminin</option>
            <option>Masculin</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Statut</label>
        <select class="form-select" id="edit-status">
          <option>Actif</option>
          <option>Suspendu</option>
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal('edit-user-modal')">Annuler</button>
      <button class="btn btn-primary" onclick="saveUser()">Sauvegarder</button>
    </div>
  </div>
</div>

<!-- Add Conseil -->
<div class="modal-overlay" id="add-conseil-modal">
  <div class="modal">
    <div class="modal-header">
      <div class="modal-title">Nouveau conseil</div>
      <button class="modal-close" onclick="closeModal('add-conseil-modal')">×</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">Titre</label>
        <input class="form-input" type="text" id="new-conseil-title" placeholder="Ex: Protection solaire quotidienne"/>
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-input" id="new-conseil-desc" placeholder="Description du conseil..." rows="3"></textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Catégorie</label>
          <select class="form-select" id="new-conseil-cat">
            <option>Prévention</option>
            <option>Soin</option>
            <option>Traitement</option>
            <option>Hygiène</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Pathologie associée</label>
          <select class="form-select" id="new-conseil-patho">
            <option>Général</option>
            <option>Eczéma</option>
            <option>Acné</option>
            <option>Allergie</option>
            <option>Dermatite</option>
          </select>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal('add-conseil-modal')">Annuler</button>
      <button class="btn btn-primary" onclick="addConseil()">Créer le conseil</button>
    </div>
  </div>
</div>

<!-- Toast container -->
<div class="toast-container" id="toast-container"></div>

<script>
// ── DATA ────────────────────────────────────────────────
let users = [
  { id:1, name:'Marie Curie',    email:'marie@example.com',  age:32, sex:'F', analyses:24, status:'Actif',    date:'12 jan 2026' },
  { id:2, name:'Thomas Bernard', email:'thomas@example.com', age:45, sex:'M', analyses:15, status:'Actif',    date:'8 jan 2026'  },
  { id:3, name:'Sophie Laurent', email:'sophie@example.com', age:28, sex:'F', analyses:8,  status:'Actif',    date:'3 jan 2026'  },
  { id:4, name:'Pierre Martin',  email:'pierre@example.com', age:51, sex:'M', analyses:31, status:'Suspendu', date:'29 déc 2025' },
  { id:5, name:'Claire Dubois',  email:'claire@example.com', age:37, sex:'F', analyses:12, status:'Actif',    date:'22 déc 2025' },
  { id:6, name:'Lucas Moreau',   email:'lucas@example.com',  age:23, sex:'M', analyses:3,  status:'Actif',    date:'15 déc 2025' },
];

let conseils = [
  { id:1, title:'Protection solaire quotidienne',      desc:'Appliquez un écran solaire SPF 30+ chaque jour, même par temps nuageux. Réappliquez toutes les 2 heures.', tags:['Prévention','Général']  },
  { id:2, title:'Hydratation de la peau',              desc:'Utilisez une crème hydratante adaptée à votre type de peau matin et soir. Privilégiez les formules sans parfum.',tags:['Soin','Eczéma']       },
  { id:3, title:'Nettoyage doux',                      desc:'Nettoyez votre visage avec un nettoyant doux, non comédogène, deux fois par jour. Évitez de frotter.',        tags:['Soin','Acné']          },
  { id:4, title:'Éviter les allergènes',               desc:'Identifiez et évitez les substances qui déclenchent vos réactions allergiques. Tenez un journal des expositions.',tags:['Prévention','Allergie']},
  { id:5, title:'Alimentation anti-inflammatoire',     desc:'Privilégiez les fruits, légumes, oméga-3 et réduisez les aliments transformés pour améliorer la santé cutanée.',tags:['Prévention','Général']  },
  { id:6, title:'Consultation dermatologique annuelle',desc:'Un contrôle annuel chez le dermatologue permet de détecter précocement les lésions suspectes.',               tags:['Prévention','Général']  },
];

let editingUserId = null;

// ── NAVIGATION ──────────────────────────────────────────
const pageMeta = {
  dashboard: { title:'Tableau de bord',     subtitle:'Vue d\'ensemble de l\'activité' },
  users:     { title:'Utilisateurs',         subtitle: users.length + ' utilisateurs inscrits' },
  stats:     { title:'Statistiques',         subtitle:'Analyse de l\'activité' },
  conseils:  { title:'Gestion des conseils', subtitle: conseils.length + ' conseils configurés' },
  settings:  { title:'Paramètres',           subtitle:'Configuration de l\'application' },
};

function switchPage(p) {
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.getElementById('page-' + p).classList.add('active');
  event.currentTarget && event.currentTarget.classList.add('active');
  // find nav item
  document.querySelectorAll('.nav-item').forEach(el => {
    if (el.getAttribute('onclick') && el.getAttribute('onclick').includes("'" + p + "'")) el.classList.add('active');
  });
  document.getElementById('page-title').textContent    = pageMeta[p].title;
  document.getElementById('page-subtitle').textContent = pageMeta[p].subtitle;
  if (p === 'stats')    initCharts();
  if (p === 'users')    renderUsers(users);
  if (p === 'conseils') renderConseils(conseils);
}

// ── RENDER USERS ───────────────────────────────────────
function renderUsers(data) {
  const tbody = document.getElementById('users-tbody');
  tbody.innerHTML = '';
  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state">
      <div class="empty-state-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
      <h3>Aucun utilisateur trouvé</h3><p>Essayez un autre terme de recherche.</p>
    </div></td></tr>`;
    return;
  }
  data.forEach(u => {
    const initials = u.name.split(' ').map(n=>n[0]).join('').slice(0,2);
    const statusClass = u.status === 'Actif' ? 'badge-green' : 'badge-suspend';
    tbody.innerHTML += `
    <tr>
      <td>
        <div class="user-cell">
          <div class="user-avatar">${initials}</div>
          <div><div class="user-name">${u.name}</div><div class="user-email">${u.email}</div></div>
        </div>
      </td>
      <td>${u.age} ans · ${u.sex}</td>
      <td><strong>${u.analyses}</strong></td>
      <td><span class="badge ${statusClass}">${u.status}</span></td>
      <td style="font-size:13px;color:var(--text-soft);font-family:var(--font-mono);">${u.date}</td>
      <td>
        <button class="action-btn" onclick="editUser(${u.id})" title="Modifier">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="action-btn" onclick="toggleStatus(${u.id})" title="Changer statut">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        <button class="action-btn delete" onclick="deleteUser(${u.id})" title="Supprimer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </button>
      </td>
    </tr>`;
  });
}

function filterUsers() {
  const q = document.getElementById('user-search').value.toLowerCase();
  renderUsers(users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)));
}

function editUser(id) {
  const u = users.find(x => x.id === id);
  editingUserId = id;
  document.getElementById('edit-name').value   = u.name;
  document.getElementById('edit-email').value  = u.email;
  document.getElementById('edit-age').value    = u.age;
  document.getElementById('edit-sex').value    = u.sex === 'F' ? 'Féminin' : 'Masculin';
  document.getElementById('edit-status').value = u.status;
  openModal('edit-user-modal');
}

function saveUser() {
  const u = users.find(x => x.id === editingUserId);
  u.name   = document.getElementById('edit-name').value;
  u.email  = document.getElementById('edit-email').value;
  u.age    = parseInt(document.getElementById('edit-age').value);
  u.sex    = document.getElementById('edit-sex').value === 'Féminin' ? 'F' : 'M';
  u.status = document.getElementById('edit-status').value;
  closeModal('edit-user-modal');
  renderUsers(users);
  showToast('Utilisateur mis à jour', 'success');
}

function addUser() {
  const id   = users.length + 1;
  users.push({ id, name:'Nouvel utilisateur', email:'new@example.com', age:30, sex:'F', analyses:0, status:'Actif', date:new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'}) });
  closeModal('add-user-modal');
  renderUsers(users);
  showToast('Utilisateur créé', 'success');
}

function deleteUser(id) {
  if (confirm('Supprimer cet utilisateur ?')) {
    users = users.filter(u => u.id !== id);
    renderUsers(users);
    showToast('Utilisateur supprimé');
  }
}

function toggleStatus(id) {
  const u = users.find(x => x.id === id);
  u.status = u.status === 'Actif' ? 'Suspendu' : 'Actif';
  renderUsers(users);
  showToast(`Statut mis à jour : ${u.status}`);
}

// ── RENDER CONSEILS ────────────────────────────────────
const tagClass = { Prévention:'badge-teal', Soin:'badge-blue', Traitement:'badge-purple', Hygiène:'badge-green', Général:'badge-gray', Eczéma:'badge-amber', Acné:'badge-red', Allergie:'badge-purple', Dermatite:'badge-green' };

function renderConseils(data) {
  const list = document.getElementById('conseils-list');
  list.innerHTML = '';
  if (data.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="empty-state-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><h3>Aucun conseil trouvé</h3></div>`;
    return;
  }
  data.forEach(c => {
    const tags = c.tags.map(t => `<span class="badge ${tagClass[t]||'badge-gray'}">${t}</span>`).join('');
    list.innerHTML += `
    <div class="conseil-item">
      <div class="conseil-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
      <div class="conseil-body">
        <div class="conseil-title">${c.title}</div>
        <div class="conseil-desc">${c.desc}</div>
        <div class="conseil-tags">${tags}</div>
      </div>
      <div class="conseil-actions">
        <button class="action-btn" onclick="editConseil(${c.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="action-btn delete" onclick="deleteConseil(${c.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
        </button>
      </div>
    </div>`;
  });
}

function filterConseils(q) {
  renderConseils(conseils.filter(c => c.title.toLowerCase().includes(q.toLowerCase()) || c.desc.toLowerCase().includes(q.toLowerCase())));
}

function addConseil() {
  const title = document.getElementById('new-conseil-title').value || 'Nouveau conseil';
  const desc  = document.getElementById('new-conseil-desc').value  || 'Description du conseil.';
  const cat   = document.getElementById('new-conseil-cat').value;
  const patho = document.getElementById('new-conseil-patho').value;
  conseils.push({ id: conseils.length + 1, title, desc, tags:[cat, patho] });
  closeModal('add-conseil-modal');
  renderConseils(conseils);
  showToast('Conseil créé', 'success');
}

function editConseil(id) {
  const c = conseils.find(x => x.id === id);
  document.getElementById('new-conseil-title').value = c.title;
  document.getElementById('new-conseil-desc').value  = c.desc;
  openModal('add-conseil-modal');
}

function deleteConseil(id) {
  if (confirm('Supprimer ce conseil ?')) {
    conseils = conseils.filter(c => c.id !== id);
    renderConseils(conseils);
    showToast('Conseil supprimé');
  }
}

// ── TABS (stats) ───────────────────────────────────────
function switchTab(btn, tabId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-overview').style.display = tabId === 'tab-overview' ? '' : 'none';
  document.getElementById('tab-patho').style.display    = tabId === 'tab-patho'    ? '' : 'none';
  if (tabId === 'tab-patho') initPathoCharts();
}

// ── CHARTS ─────────────────────────────────────────────
let chartsInit = false;
let pathoInit  = false;

function initCharts() {
  if (chartsInit) return;
  chartsInit = true;

  const teal = '#0eb89a';
  const tealA = 'rgba(14,184,154,.2)';
  const cfg = { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } } };

  // Donut dashboard
  new Chart(document.getElementById('donutChart'), {
    type:'doughnut',
    data:{ labels:['Eczéma','Acné','Dermatite','Allergie','Autre'],
           datasets:[{ data:[35,30,16,12,7], backgroundColor:['#0eb89a','#34d399','#6ee7b7','#a7f3d0','#d1fae5'], borderWidth:0 }] },
    options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'right', labels:{ font:{size:11}, boxWidth:12 } } }, cutout:'65%' }
  });

  // Bar week
  new Chart(document.getElementById('barChart'), {
    type:'bar',
    data:{ labels:['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'],
           datasets:[{ data:[45,63,52,78,92,35,28], backgroundColor:teal, borderRadius:6 }] },
    options:{ ...cfg, scales:{ y:{ beginAtZero:true, grid:{color:'#f0f4f7'}, ticks:{color:'#8898aa',font:{size:11}} }, x:{ grid:{display:false}, ticks:{color:'#8898aa',font:{size:11}} } } }
  });

  // Doughnut status
  new Chart(document.getElementById('doughnutStats'), {
    type:'doughnut',
    data:{ labels:['Actifs','Suspendus'],
           datasets:[{ data:[83,17], backgroundColor:[teal,'#fecaca'], borderWidth:0 }] },
    options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ font:{size:12}, boxWidth:14 } } }, cutout:'60%' }
  });

  // Line monthly
  new Chart(document.getElementById('lineChart'), {
    type:'line',
    data:{ labels:['Oct','Nov','Déc','Jan','Fév','Mar'],
           datasets:[{ data:[2850,3100,3400,3600,3750,3820], borderColor:teal, backgroundColor:tealA, fill:true, tension:.4, pointRadius:5, pointBackgroundColor:teal, borderWidth:2.5 }] },
    options:{ ...cfg, scales:{ y:{ beginAtZero:false, grid:{color:'#f0f4f7'}, ticks:{color:'#8898aa',font:{size:11}} }, x:{ grid:{display:false}, ticks:{color:'#8898aa',font:{size:11}} } } }
  });
}

function initPathoCharts() {
  if (pathoInit) return;
  pathoInit = true;
  const cfg = { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } } };

  new Chart(document.getElementById('pathoBarChart'), {
    type:'bar',
    data:{ labels:['Oct','Nov','Déc','Jan','Fév','Mar'],
           datasets:[
             { label:'Eczéma',   data:[320,410,390,460,500,521], backgroundColor:'#0eb89a', borderRadius:4 },
             { label:'Acné',     data:[280,320,350,400,430,476], backgroundColor:'#34d399', borderRadius:4 },
             { label:'Dermatite',data:[120,150,160,180,200,208], backgroundColor:'#6ee7b7', borderRadius:4 },
           ] },
    options:{ ...cfg, plugins:{legend:{display:true,position:'bottom',labels:{font:{size:11},boxWidth:12}}}, scales:{ x:{grid:{display:false},ticks:{color:'#8898aa',font:{size:11}}}, y:{grid:{color:'#f0f4f7'},ticks:{color:'#8898aa',font:{size:11}}} } }
  });

  new Chart(document.getElementById('pathoPieChart'), {
    type:'pie',
    data:{ labels:['Eczéma','Acné','Dermatite','Allergie','Lésion'],
           datasets:[{ data:[35,30,16,12,7], backgroundColor:['#0eb89a','#34d399','#6ee7b7','#a7f3d0','#d1fae5'], borderWidth:0 }] },
    options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'right', labels:{font:{size:11},boxWidth:14} } } }
  });
}

// ── MODAL ──────────────────────────────────────────────
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
});

// ── TOAST ──────────────────────────────────────────────
function showToast(msg, type='') {
  const icon = type === 'success'
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = icon + msg;
  document.getElementById('toast-container').appendChild(t);
  setTimeout(() => t.style.opacity = '0', 2800);
  setTimeout(() => t.remove(), 3200);
}

// ── INIT ───────────────────────────────────────────────
renderUsers(users);
renderConseils(conseils);
</script>
</body>
</html>