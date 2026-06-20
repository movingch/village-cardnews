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

function TagEditor({ tag, onChange }) {
  const [editing, setEditing] = useState(false)
  if (editing) {
    return (
      <input
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
    setGenKey(k => k + 1)
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

        {/* AI strip — full width */}
        <div className="panel-ai-strip">
          <button className="btn-ai" onClick={handleGenerate} disabled={generating}>
            {generating ? '⏳ 생성 중...' : `✨ 마케팅 문구 자동 완성`}
          </button>
          {instagram.visible && (
            <div className="instagram-box">
              <div className="instagram-label">📱 인스타그램 텍스트 & 해시태그</div>
              <textarea className="instagram-text" rows={4}
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
        </div>

        {/* ── 상단 바: 힌트 + 카드 수 (3컬럼 위) ── */}
        <div className="panel-top-bar">
          <div className="canvas-edit-hint">✏️ 카드 위의 텍스트를 직접 클릭하여 편집하세요</div>
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
        </div>

        {/* ── 3-column main area ── */}
        <div className="panel-main-row">

          {/* ── LEFT: 글꼴 & 스타일 ── */}
          <div className="panel-side panel-left">
            <div className="panel-side-title">✍ 글꼴 & 스타일</div>

            <div className="side-group">
              <span className="side-lbl">폰트</span>
              <select className="side-select" value={card.font} onChange={e => set('font', e.target.value)}
                style={{ fontFamily: `'${card.font}', sans-serif` }}>
                {FONTS.map(f => (
                  <option key={f.value} value={f.value} style={{ fontFamily: `'${f.value}', sans-serif` }}>{f.label}</option>
                ))}
              </select>
            </div>

            <div className="side-group txt-size-group">
              <div className="txt-col">
                <span className="txt-col-head">메인 글자</span>
                <span className="txt-col-sub">크기 <strong>{card.fontSize}px</strong></span>
                <input type="range" orient="vertical" min="16" max="60" value={card.fontSize}
                  onChange={e => set('fontSize', Number(e.target.value))} className="v-slider" />
                <span className="txt-col-sub" style={{marginTop:10}}>글자 색상</span>
                <input type="color" value={card.textColor} onChange={e => set('textColor', e.target.value)} className="eq-color" title="메인 색상" />
              </div>
              <div className="txt-divider" />
              <div className="txt-col">
                <span className="txt-col-head">서브 글자</span>
                <span className="txt-col-sub">크기 <strong>{card.subFontSize}px</strong></span>
                <input type="range" orient="vertical" min="10" max="30" value={card.subFontSize}
                  onChange={e => set('subFontSize', Number(e.target.value))} className="v-slider" />
                <span className="txt-col-sub" style={{marginTop:10}}>글자 색상</span>
                <input type="color" value={card.subTextColor} onChange={e => set('subTextColor', e.target.value)} className="eq-color" title="서브 색상" />
              </div>
            </div>
          </div>

          {/* ── CENTER: Card ── */}
          <div className="panel-center">
            {/* Canvas */}
            <div className="canvas-preview" ref={canvasRef} style={bgStyle}>
              {(card.selectedPhoto || card.bgImageUrl) && <div className="canvas-photo-overlay" />}
              <div className="canvas-deco" style={{ background: accentColor }} />
              {cardCount > 1 && <div className="canvas-card-badge">{currentIdx + 1}/{cardCount}</div>}

              <div className="canvas-content-wrap">
                <TagEditor tag={card.tag} onChange={val => set('tag', val)} />
                <div className="canvas-box" style={{ background: boxBg }}>
                  <div
                    key={`main-${editKey}`}
                    className="canvas-maintext canvas-editable"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={e => set('mainText', e.currentTarget.innerText)}
                    dangerouslySetInnerHTML={{ __html: card.mainText.replace(/\n/g, '<br>') }}
                    style={{ fontFamily: `'${card.font}', sans-serif`, fontSize: `${card.fontSize}px`, color: card.textColor }}
                  />
                  <div
                    key={`sub-${editKey}`}
                    className="canvas-subtext canvas-editable"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={e => set('subText', e.currentTarget.innerText)}
                    dangerouslySetInnerHTML={{ __html: card.subText.replace(/\n/g, '<br>') }}
                    style={{ fontFamily: `'${card.font}', sans-serif`, fontSize: `${card.subFontSize}px`, color: card.subTextColor }}
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
            {cardCount > 1 && (
              <div className="thumb-strip">
                {cards.map((c, i) => (
                  <CardThumb key={i} card={c} gradient={gradient} index={i}
                    isCurrent={i === currentIdx} onClick={() => setCurrentIdx(i)} />
                ))}
              </div>
            )}

            {/* 배경 이미지 — 가로 바 */}
            <div className="bg-bar">
              <span className="bg-bar-lbl">🖼 배경</span>
              <label className="bg-bar-btn">
                <span>📁 업로드</span>
                <input type="file" accept="image/*" onChange={handleUpload} hidden />
              </label>
              <button className={`bg-bar-btn ${showPhotos ? 'active' : ''}`} onClick={() => setShowPhotos(v => !v)}>
                📸 샘플 사진 {showPhotos ? '▲' : '▼'}
              </button>
              {(card.selectedPhoto || card.bgImageUrl) && (
                <button className="bg-bar-btn danger" onClick={() => { set('selectedPhoto', null); set('bgImageUrl', null) }}>
                  ✕ 배경 제거
                </button>
              )}
            </div>
            {showPhotos && (
              <div className="photo-grid photo-grid-wide">
                <div className={`photo-cell no-bg ${!card.selectedPhoto && !card.bgImageUrl ? 'sel' : ''}`}
                  onClick={() => { set('selectedPhoto', null); set('bgImageUrl', null) }}>
                  <span>🎨</span><small>그라디언트</small>
                </div>
                {categoryPhotos.map((p, i) => (
                  <div key={i} className={`photo-cell ${card.selectedPhoto === p.full ? 'sel' : ''}`}
                    onClick={() => handlePhoto(p.full)} title={p.label}>
                    <img src={p.thumb} alt={p.label} loading="lazy" onError={e => e.target.parentNode.style.display='none'} />
                    {card.selectedPhoto === p.full && <div className="photo-check">✓</div>}
                    <div className="photo-lbl">{p.label}</div>
                  </div>
                ))}
              </div>
            )}

            <button className="btn-save" onClick={handleSave} disabled={saving}>
              {saving ? '⏳ 저장 중...' : `💾 카드 ${currentIdx + 1} 저장 (PNG)`}
            </button>
          </div>

          {/* ── RIGHT: 가독성 박스 ── */}
          <div className="panel-side panel-right">
            <div className="panel-side-title">🔲 가독성 박스</div>
            <div className="side-group">
              <label className="side-check">
                <input type="checkbox" checked={card.boxEnabled} onChange={e => set('boxEnabled', e.target.checked)} />
                <span>박스 사용하기</span>
              </label>
            </div>
            {card.boxEnabled && (
              <>
                <div className="side-group">
                  <span className="side-lbl">박스 색상</span>
                  <input type="color" value={card.boxColor} onChange={e => set('boxColor', e.target.value)} className="side-color-swatch" />
                </div>
                <div className="side-group">
                  <span className="side-lbl">투명도</span>
                  <div className="eq-group" style={{justifyContent:'center', paddingTop:4}}>
                    <div className="eq-col">
                      <span className="eq-val">{card.boxOpacity}%</span>
                      <input type="range" orient="vertical" min="0" max="100" value={card.boxOpacity}
                        onChange={e => set('boxOpacity', Number(e.target.value))} className="v-slider" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>{/* end panel-main-row */}
      </div>
    </div>
  )
}
