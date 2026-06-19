import React, { useState, useMemo } from 'react'
import Header from './components/Header'
import TemplateGallery from './components/TemplateGallery'
import EditorModal from './components/EditorModal'
import { templates } from './data/templates'

export default function App() {
  const [activeFilter, setActiveFilter] = useState('전체')
  const [editingTemplate, setEditingTemplate] = useState(null)

  const filtered = useMemo(() =>
    activeFilter === '전체' ? templates : templates.filter(t => t.category === activeFilter),
    [activeFilter]
  )

  return (
    <div className="app">
      <Header activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      <main className="main">
        <div className="gallery-header">
          <span className="gallery-count">
            {activeFilter === '전체' ? '전체' : activeFilter} 템플릿 {filtered.length}개
          </span>
          <span className="gallery-hint">템플릿을 클릭하면 편집할 수 있어요 ✏️</span>
        </div>
        <TemplateGallery templates={filtered} onSelect={setEditingTemplate} />
      </main>
      {editingTemplate && (
        <EditorModal
          template={editingTemplate}
          onClose={() => setEditingTemplate(null)}
        />
      )}
    </div>
  )
}
