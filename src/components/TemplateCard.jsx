import React, { useState } from 'react'

function hexToRgba(hex, alpha) {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export default function TemplateCard({ template, onSelect }) {
  const { title, description, category, gradient, accentColor, defaultData, defaultPhoto } = template
  const { mainText, font, boxColor, boxOpacity } = defaultData
  const [imgError, setImgError] = useState(false)

  const bgStyle = defaultPhoto && !imgError
    ? {
        backgroundImage: `url(${defaultPhoto})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : { background: gradient }

  return (
    <div className="template-card" onClick={onSelect}>
      <div className="template-preview" style={bgStyle}>
        {/* Gradient overlay so text is always readable */}
        <div className="preview-gradient-overlay" style={{ background: gradient, opacity: defaultPhoto && !imgError ? 0.55 : 0 }} />
        {/* Decorative accent circle */}
        <div className="preview-deco" style={{ background: accentColor }} />
        {/* Hidden img tag to detect load errors */}
        {defaultPhoto && (
          <img src={defaultPhoto} alt="" style={{ display: 'none' }} onError={() => setImgError(true)} />
        )}
        {/* Text box */}
        <div
          className="preview-textbox"
          style={{ background: hexToRgba(boxColor, boxOpacity / 100) }}
        >
          <div className="preview-maintext" style={{ fontFamily: `'${font}', sans-serif` }}>
            {mainText.split('\n').map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </div>
        </div>
        <div className="preview-category-badge">{category}</div>
      </div>
      <div className="template-info">
        <div className="template-title">{title}</div>
        <div className="template-desc">{description}</div>
      </div>
    </div>
  )
}
