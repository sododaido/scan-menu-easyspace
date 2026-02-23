/**
 * StatCard — Reusable KPI card component
 * Used across DashboardTab for both inventory and sales stats.
 * Supports glass-card styling from the luxury warm theme.
 */

import "./StatCard.css";

function StatCard({ emoji, label, value, suffix = "", subtext = "" }) {
  return (
    <div className="stat-card glass-card">
      <span className="stat-card__emoji">{emoji}</span>
      <span className="stat-card__value">
        {value}
        {suffix && <span className="stat-card__suffix">{suffix}</span>}
      </span>
      <span className="stat-card__label">{label}</span>
      {subtext && <span className="stat-card__subtext">{subtext}</span>}
    </div>
  );
}

export default StatCard;
