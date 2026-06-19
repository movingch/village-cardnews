import React from 'react'
import { CATEGORIES } from '../data/templates'

export default function Header({ activeFilter, setActiveFilter }) {
  return (
    <header className="header">
      <div className="header-top">
        <div className="header-logo">
          <span className="logo-icon">🏘️</span>
          <div>
            <div className="logo-title">마을공동체 카드뉴스 스튜디오</div>
            <div className="logo-sub">마을공동체 활동가를 위한 카드뉴스 제작 도구</div>
          </div>
        </div>
      </div>
      <div className="filter-bar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
            onClick={() => setActiveFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </header>
  )
}
