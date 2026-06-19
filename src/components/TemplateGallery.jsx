import React from 'react'
import TemplateCard from './TemplateCard'

export default function TemplateGallery({ templates, onSelect }) {
  if (templates.length === 0) {
    return (
      <div className="gallery-empty">
        <span>😊</span>
        <p>해당 카테고리의 템플릿이 없습니다.</p>
      </div>
    )
  }
  return (
    <div className="gallery-grid">
      {templates.map(template => (
        <TemplateCard
          key={template.id}
          template={template}
          onSelect={() => onSelect(template)}
        />
      ))}
    </div>
  )
}
