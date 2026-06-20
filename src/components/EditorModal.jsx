import React, { useState, useRef, useCallback } from 'react'
import { generateText } from '../utils/textGenerator'
import { CATEGORY_PHOTOS } from '../data/photos'

const FONTS = [
  { label: '나눔고딕', value: 'Nanum Gothic' },
  { label: '나눔명조', value: 'Nanum Myeongjo' },
  { label: '나눔바른고딕', value: 'Nanum Barun Gothic' },
  { label: '나눔손글씨펜', value: 'Nanum Pen Script' },
  { label: '배민 도현체', value: 'Do Hyeon' },
  { label: '배민 주아체', value: 'Jua' },
  { label: '배민 연성체', value: 'Yeon Sung' },
  { label: '배민 기랑해랑체', value: 'Kirang Haerang' },
]

function hexToRgba(hex, alpha) {
  const clean = (hex || '#000000').replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function initCard(defaultData, category) {
  return {
    mainText: defaultData.mainText,
    subText: defaultData.subText,
    font: defaultData.font,
    fontSize: defaultData.fontSize,
    textColor: defaultData.textColor,
    subFontSize: defaultData.subFontSize,
    subTextColor: defaultData.subTextColor,
    boxEnabled: true,
    boxColor: defaultData.boxColor,
    boxOpacity: defaultData.boxOpacity,
    bgImageUrl: null,
    selectedPhoto: defaultData.selectedPhoto || null,
    tag: category,
  }
}

function CardThumb({ card, gradient, index, isCurrent, onClick }) {
  const bg = card.selectedPhoto || card.bgImageUrl
    ? { backgroundImage: `url(${card.selectedPhoto || card.bgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: gradient }
  return (
    <div className={`card-thumb ${isCurrent ? 'active' : ''}`} onClick={onClick} style={bg} title={`카드 ${index + 1}`}>
      <span className="card-thumb-num">{index + 1}</span>
      {isCurrent && <span className="card-thumb-cur">편집 중</span>}
    </div>
  )
}

// Inline-editable tag badge
function TagEditor({ tag, onChange }) {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef(null)

  if (editing) {
    return (
      <input
        ref={inputRef}
        className="canvas-tag canvas-tag-input"
        value={tag}
        onChange={e => onChange(e.target.value)}
        onBlur={() => setEditing(false)}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); setEditing(false) } }}
        autoFocus
        maxLength={20}
      />
    )
  }
  return (
    <div className="canvas-tag canvas-tag-editable" onClick={() => setEditing(true)} title="클릭하여 태그 편집">
      {tag || '+ 태그'}
      <span className="canvas-tag-edit-icon">✏</span>
    </div>
  )
}

export default function EditorModal({ template, onClose }) {
  const { category, title, gradient, accentColor, defaultData } = template
  const canvasRef = useRef(null)
  const categoryPhotos = CATEGORY_PHOTOS[category] || CATEGORY_PHOTOS['자율 템플릿']

  const [cardCount, setCardCount] = useState(1)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [cards, setCards] = useState(() => [initCard(defaultData, category)])
  const [instagram, setInstagram] = useState({ text: '', hashtags: '', visible: false })
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showPhotos, setShowPhotos] = useState(false)
  // genKey forces contentEditable elements to remount when AI generates new text
  const [genKey, setGenKey] = useState(0)

  const card = cards[currentIdx]

  const set = useCallback((key, val) => {
    setCards(prev => prev.map((c, i) => i === currentIdx ? { ...c, [key]: val } : c))
  }, [currentIdx])

  const handleCardCount = useCallback((n) => {
    setCardCount(n)
    setCards(prev => {
      if (n > prev.length)
        return [...prev, ...Array.from({ length: n - prev.length }, () => initCard(defaultData, category))]
      return prev.slice(0, n)
    })
    setCurrentIdx(i => Math.min(i, n - 1))
  }, [defaultData, category])

  const handleUpload = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    set('bgImageUrl', URL.createObjectURL(file))
    set('selectedPhoto', null)
  }, [set])

  const handlePhoto = useCallback((url) => {
    set('selectedPhoto', url)
    set('bgImageUrl', null)
    setShowPhotos(false)
  }, [set])

  const handleGenerate = useCallback(async () => {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 600))
    const result = generateText(category)
    setCards(prev => prev.map((c, i) => i === currentIdx ? { ...c, mainText: result.mainText, subText: result.subText } : c))
    setInstagram({ text: result.instagramText, hashtags: result.hashtags, visible: true })
    setGenKey(k => k + 1) // remount contentEditable so new text appears
    setGenerating(false)
  }, [category, currentIdx])

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(`${instagram.text}\n\n${instagram.hashtags}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [instagram])

  const handleSave = useCallback(async () => {
    if (!canvasRef.current) return
    setSaving(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(canvasRef.current, {
        scale: 2, useCORS: true, allowTaint: true, backgroundColor: null, logging: false,
      })
      const a = document.createElement('a')
      a.download = `${title}-카드${currentIdx + 1}.png`
      a.href = canvas.toDataURL('image/png')
      a.click()
    } catch { alert('저장 중 오류가 발생했습니다.') }
    setSaving(false)
  }, [title, currentIdx])

  const bgStyle = card.selectedPhoto || card.bgImageUrl
    ? { backgroundImage: `url(${card.selectedPhoto || card.bgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: gradient }

  const showBox = card.boxEnabled && card.boxOpacity > 0
  const boxBg = showBox ? hexToRgba(card.boxColor, card.boxOpacity / 100) : 'transparent'

  // Key for contentEditable remounting
  const editKey = `${currentIdx}-${genKey}`

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <span className="modal-cat-badge">{category}</span>
            <span className="modal-title-text">{title}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">

          {/* ══ LEFT: Controls ══════════════════════════════ */}
          <div className="controls-panel">

            {/* AI */}
            <section className="ctrl-section ai-section">
              <button className="btn-ai" onClick={handleGenerate} disabled={generating}>
                {generating ? '⏳ 생성 중...' : `✨ 마케팅 문구 자동 완성`}
              </button>
              {instagram.visible && (
                <div className="instagram-box">
                  <div className="instagram-label">📱 인스타그램 텍스트 & 해시태그</div>
                  <textarea className="instagram-text" rows={6}
                    value={`${instagram.text}\n\n${instagram.hashtags}`}
                    onChange={e => {
                      const v = e.target.value, last = v.lastIndexOf('\n\n')
                      last !== -1
                        ? setInstagram({ text: v.slice(0, last), hashtags: v.slice(last + 2), visible: true })
                        : setInstagram(ig => ({ ...ig, text: v }))
                    }}
                  />
                  <button className="btn-copy" onClick={handleCopy}>
                    {copied ? '✅ 복사됨!' : '📋 클립보드에 복사'}
                  </button>
                </div>
              )}
            </section>

            {/* Font & Text Style */}
            <section className="ctrl-section">
              <div className="ctrl-section-title">✍ 글꼴 & 스타일</div>
              <div style={{ marginBottom: 12 }}>
                <span className="ctrl-lbl">폰트</span>
                <select className="ctrl-select" value={card.font} onChange={e => set('font', e.target.value)}
                  style={{ fontFamily: `'${card.font}', sans-serif` }}>
                  {FONTS.map(f => (
                    <option key={f.value} value={f.value} style={{ fontFamily: `'${f.value}', sans-serif` }}>{f.label}</option>
                  ))}
                </select>
              </div>
              <div className="style-rows">
                <div className="style-row">
                  <span className="style-row-lbl">메인 텍스트</span>
                  <div className="style-row-controls">
                    <span className="ctrl-lbl-inline">{card.fontSize}px</span>
                    <input type="range" min="16" max="60" value={card.fontSize}
                      onChange={e => set('fontSize', Number(e.target.value))} className="ctrl-slider style-slider" />
                    <div className="ctrl-color-wrap">
                      <input type="color" value={card.textColor} onChange={e => set('textColor', e.target.value)} className="ctrl-color" />
                    </div>
                  </div>
                </div>
                <div className="style-row">
                  <span className="style-row-lbl">서브 텍스트</span>
                  <div className="style-row-controls">
                    <span className="ctrl-lbl-inline">{card.subFontSize}px</span>
                    <input type="range" min="10" max="30" value={card.subFontSize}
                      onChange={e => set('subFontSize', Number(e.target.value))} className="ctrl-slider style-slider" />
                    <div className="ctrl-color-wrap">
                      <input type="color" value={card.subTextColor} onChange={e => set('subTextColor', e.target.value)} className="ctrl-color" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Background photo */}
            <section className="ctrl-section">
              <div className="ctrl-section-title">🖼 배경 이미지</div>
              <label className="btn-upload-block">
                <span>📁 내 PC에서 이미지 업로드</span>
                <input type="file" accept="image/*" onChange={handleUpload} hidden />
              </label>

              <button
                className={`btn-photo-toggle ${showPhotos ? 'open' : ''}`}
                onClick={() => setShowPhotos(v => !v)}
              >
                📸 샘플 사진 선택 {showPhotos ? '▲' : '▼'}
              </button>

              {showPhotos && (
                <div className="photo-grid">
                  <div
                    className={`photo-cell no-bg ${!card.selectedPhoto && !card.bgImageUrl ? 'sel' : ''}`}
                    onClick={() => { set('selectedPhoto', null); set('bgImageUrl', null) }}
                  >
                    <span>🎨</span>
                    <small>그라디언트</small>
                  </div>
                  {categoryPhotos.map((p, i) => (
                    <div
                      key={i}
                      className={`photo-cell ${card.selectedPhoto === p.full ? 'sel' : ''}`}
                      onClick={() => handlePhoto(p.full)}
                      title={p.label}
                    >
                      <img src={p.thumb} alt={p.label} loading="lazy" onError={e => e.target.parentNode.style.display = 'none'} />
                      {card.selectedPhoto === p.full && <div className="photo-check">✓</div>}
                      <div className="photo-lbl">{p.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {(card.selectedPhoto || card.bgImageUrl) && (
                <button className="btn-reset-bg" onClick={() => { set('selectedPhoto', null); set('bgImageUrl', null) }}>
                  ✕ 배경 제거 (그라디언트로)
                </button>
              )}
            </section>

            {/* Overlay box */}
            <section className="ctrl-section">
              <div className="ctrl-section-title-row">
                <span className="ctrl-section-title">🔲 가독성 박스</span>
                <label className="toggle-label">
                  <input type="checkbox" checked={card.boxEnabled} onChange={e => set('boxEnabled', e.target.checked)} />
                  <span>사용</span>
                </label>
              </div>
              {card.boxEnabled && (
                <div className="overlay-controls">
                  <div className="ctrl-row2">
                    <div>
                      <span className="ctrl-lbl">색상</span>
                      <div className="ctrl-color-wrap">
                        <input type="color" value={card.boxColor} onChange={e => set('boxColor', e.target.value)} className="ctrl-color" />
                        <span className="ctrl-color-val">{card.boxColor}</span>
                      </div>
                    </div>
                    <div>
                      <span className="ctrl-lbl">투명도 {card.boxOpacity}%</span>
                      <div className="slider-row">
                        <input type="range" min="0" max="100" value={card.boxOpacity}
                          onChange={e => set('boxOpacity', Number(e.target.value))} className="ctrl-slider" />
                        <span className="slider-val">{card.boxOpacity}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>

          </div>

          {/* ══ RIGHT: Canvas ═══════════════════════════════ */}
          <div className="canvas-side">

            {/* Edit hint */}
            <div className="canvas-edit-hint">
              ✏️ 카드 위의 텍스트를 직접 클릭하여 편집하세요
            </div>

            {/* Card count */}
            <div className="card-count-bar">
              <span className="card-count-lbl">📄 카드 수</span>
              <div className="card-count-btns">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} className={`card-count-btn ${cardCount === n ? 'active' : ''}`}
                    onClick={() => handleCardCount(n)}>{n}장</button>
                ))}
              </div>
              <span className="card-count-info"><strong>{currentIdx + 1}</strong> / {cardCount}</span>
            </div>

            {/* Canvas */}
            <div className="canvas-preview" ref={canvasRef} style={bgStyle}>
              {(card.selectedPhoto || card.bgImageUrl) && (
                <div className="canvas-photo-overlay" />
              )}
              <div className="canvas-deco" style={{ background: accentColor }} />

              {cardCount > 1 && (
                <div className="canvas-card-badge">{currentIdx + 1}/{cardCount}</div>
              )}

              {/* Tag + Text box */}
              <div className="canvas-content-wrap">
                <TagEditor tag={card.tag} onChange={val => set('tag', val)} />

                <div className="canvas-box" style={{ background: boxBg }}>
                  {/* Directly editable main text */}
                  <div
                    key={`main-${editKey}`}
                    className="canvas-maintext canvas-editable"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={e => set('mainText', e.currentTarget.innerText)}
                    dangerouslySetInnerHTML={{ __html: card.mainText.replace(/\n/g, '<br>') }}
                    style={{
                      fontFamily: `'${card.font}', sans-serif`,
                      fontSize: `${card.fontSize}px`,
                      color: card.textColor,
                    }}
                  />
                  {/* Directly editable sub text */}
                  <div
                    key={`sub-${editKey}`}
                    className="canvas-subtext canvas-editable"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={e => set('subText', e.currentTarget.innerText)}
                    dangerouslySetInnerHTML={{ __html: card.subText.replace(/\n/g, '<br>') }}
                    style={{
                      fontFamily: `'${card.font}', sans-serif`,
                      fontSize: `${card.subFontSize}px`,
                      color: card.subTextColor,
                    }}
                  />
                </div>
              </div>

              <div className="canvas-bottom-bar" style={{ background: accentColor }} />
            </div>

            {/* Navigation */}
            {cardCount > 1 && (
              <div className="card-nav">
                <button className="card-nav-btn" disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}>← 이전</button>
                <button className="card-nav-btn primary" disabled={currentIdx === cardCount - 1}
                  onClick={() => setCurrentIdx(i => Math.min(cardCount - 1, i + 1))}>다음 →</button>
              </div>
            )}

            {/* Thumbnails */}
            {cardCount > 1 && (
              <div className="thumb-strip">
                {cards.map((c, i) => (
                  <CardThumb key={i} card={c} gradient={gradient} index={i}
                    isCurrent={i === currentIdx} onClick={() => setCurrentIdx(i)} />
                ))}
              </div>
            )}

            {/* Save */}
            <button className="btn-save" onClick={handleSave} disabled={saving}>
              {saving ? '⏳ 저장 중...' : `💾 카드 ${currentIdx + 1} 저장 (PNG)`}
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}
