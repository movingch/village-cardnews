import { CATEGORY_DEFAULT_PHOTO, CATEGORY_PHOTOS } from './photos'

// photoIdx: which photo from CATEGORY_PHOTOS to use as default (0-based), undefined = use CATEGORY_DEFAULT_PHOTO
const mk = (id, category, title, desc, gradient, accentColor, mainText, subText, boxColor, boxOpacity = 82, font = 'Nanum Gothic', photoIdx) => {
  const catPhotos = CATEGORY_PHOTOS[category] || []
  const photo = photoIdx !== undefined && catPhotos[photoIdx]
    ? catPhotos[photoIdx].full
    : CATEGORY_DEFAULT_PHOTO[category] || null
  return {
    id, category, title, description: desc, gradient, accentColor,
    defaultPhoto: photo,
    defaultData: {
      mainText, subText, boxColor, boxOpacity, font,
      fontSize: 30, textColor: '#FFFFFF',
      subFontSize: 15, subTextColor: '#F0F0F0',
      bgImageUrl: null, selectedPhoto: photo,
    }
  }
}

export const templates = [
  // ── 독서모임 ──────────────────────────────────────
  mk('book-1','독서모임','북클럽 정기모임','따뜻한 독서 모임 초대장',
    'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)','#E2B96F',
    '📚 이번 달\n북클럽 모임','함께 읽고 함께 나눠요\n○월 ○일 오후 7시','#16213e',82,'Nanum Gothic',0),

  mk('book-2','독서모임','이달의 책 소개','따뜻한 책 감성 카드',
    'linear-gradient(135deg,#5C3317 0%,#8B6347 60%,#A0785A 100%)','#FFF8E7',
    '이달의 책\n함께 읽어요','좋은 책 한 권이\n삶을 바꿉니다','#4A2810',
    85,'Nanum Myeongjo',1),

  mk('book-3','독서모임','독서토론 모임','초록빛 자연 속 독서',
    'linear-gradient(135deg,#134E5E 0%,#1B7A5A 50%,#71B280 100%)','#FFF9F0',
    '독서토론\n함께해요','매월 넷째 주 토요일\n오전 10시~12시','#0D3B2E',82,'Nanum Gothic',2),

  mk('book-4','독서모임','신규 회원 모집','지적인 보라빛 분위기',
    'linear-gradient(135deg,#2D0057 0%,#4A0072 50%,#7B1FA2 100%)','#F3E5F5',
    '책이 있는\n행복한 시간','우리 마을 독서모임\n신규 회원 모집','#3A0060',
    80,'Jua',3),

  mk('book-5','독서모임','독서 챌린지','밝고 활기찬 오렌지 에너지',
    'linear-gradient(135deg,#E65100 0%,#F57C00 50%,#FF8F00 100%)','#FFF8E1',
    '독서 챌린지\n30일 프로젝트','매일 30분 함께 읽어요\n지금 참여하세요!','#BF360C',
    80,'Do Hyeon',4),

  mk('book-6','독서모임','작가와의 만남','격조 있는 다크 골드',
    'linear-gradient(135deg,#0D1B2A 0%,#1B2A4A 50%,#263660 100%)','#D4AF37',
    '작가와의\n특별한 만남','○○ 작가 초청 강연회\n○월 ○일 마을회관','#0A1628',
    88,'Nanum Myeongjo',5),

  mk('book-7','독서모임','독서일기 나눔','부드러운 로즈 감성',
    'linear-gradient(135deg,#880E4F 0%,#AD1457 50%,#E91E63 100%)','#FCE4EC',
    '독서일기\n같이 써봐요','읽은 책의 이야기를\n함께 나눠봐요','#6A0036',
    80,'Nanum Pen Script',6),

  // ── 공동체모임 ─────────────────────────────────────
  mk('comm-1','공동체모임','마을 주민 모임','열린 공동체 파란 하늘',
    'linear-gradient(135deg,#0F4C75 0%,#1565C0 50%,#1976D2 100%)','#E3F2FD',
    '마을 주민\n모두 모여요','우리 마을 이야기를\n함께 나눠봐요','#0D3A5C',82,'Nanum Gothic',0),

  mk('comm-2','공동체모임','마을 총회 안내','자연친화 초록 에너지',
    'linear-gradient(135deg,#1B5E20 0%,#2E7D32 50%,#43A047 100%)','#E8F5E9',
    '마을 총회\n안내드립니다','○월 ○일 오후 2시\n마을회관에서 만나요','#0A3D12',82,'Nanum Gothic',1),

  mk('comm-3','공동체모임','소모임 시작','따뜻한 환영 오렌지',
    'linear-gradient(135deg,#BF360C 0%,#E64A19 50%,#FF7043 100%)','#FFF3E0',
    '소모임\n시작합니다!','새로운 소모임 참여\n신청받습니다','#7F2407',
    82,'Do Hyeon',2),

  mk('comm-4','공동체모임','마을 이야기 나눔','신선한 청록 민트',
    'linear-gradient(135deg,#004D40 0%,#00695C 50%,#00897B 100%)','#E0F7FA',
    '우리 동네\n이야기 나눠요','마을 공동체 회의\n함께 참여해주세요','#003330',82,'Nanum Gothic',3),

  mk('comm-5','공동체모임','활동가 모집','활기찬 레드 코랄',
    'linear-gradient(135deg,#7F0000 0%,#B71C1C 50%,#E53935 100%)','#FFEBEE',
    '함께하면\n더 행복해요','마을공동체 활동가\n모집 중입니다','#5F0000',
    85,'Jua',4),

  mk('comm-6','공동체모임','이웃 교류 프로그램','다양성 인디고',
    'linear-gradient(135deg,#1A0070 0%,#311B92 50%,#4527A0 100%)','#EDE7F6',
    '다양한 이웃\n한 자리에','마을 교류 프로그램\n참여 신청받습니다','#120050',82,'Nanum Gothic',5),

  mk('comm-7','공동체모임','마을 카페 오픈','따뜻한 커피 갈색',
    'linear-gradient(135deg,#3E2723 0%,#4E342E 50%,#6D4C41 100%)','#EFEBE9',
    '마을 카페\n오픈합니다','우리 동네 사랑방\n매주 금요일 오전','#2C1810',
    85,'Nanum Myeongjo',6),

  // ── 행사/이벤트 ────────────────────────────────────
  mk('event-1','행사/이벤트','마을 대축제','축제 레드 골드',
    'linear-gradient(135deg,#7F0000 0%,#C62828 50%,#E53935 100%)','#FFD700',
    '🎉 마을 대축제\n여러분을 초대해요','○월 ○일 오전 10시\n○○ 공원에서 만나요','#5F0000',
    85,'Do Hyeon',0),

  mk('event-2','행사/이벤트','봄맞이 나들이','봄빛 초록 노랑',
    'linear-gradient(135deg,#1B5E20 0%,#388E3C 50%,#8BC34A 100%)','#F9FBE7',
    '🌸 봄맞이\n마을 나들이','따뜻한 봄날\n함께 걸어요','#0A3D12',
    80,'Jua',1),

  mk('event-3','행사/이벤트','플리마켓','다채로운 보라 핑크',
    'linear-gradient(135deg,#4A148C 0%,#6A1B9A 50%,#AB47BC 100%)','#FFF9C4',
    '🛍️ 플리마켓\n열립니다','우리 마을 벼룩시장\n○월 ○일 오전 10시','#2D0057',
    82,'Kirang Haerang',2),

  mk('event-4','행사/이벤트','마을 체육대회','스포츠 파란 에너지',
    'linear-gradient(135deg,#01579B 0%,#0277BD 50%,#0288D1 100%)','#E1F5FE',
    '🏃 마을\n체육대회','함께 뛰고 웃어요!\n○월 ○일 ○○ 운동장','#013A6B',
    82,'Do Hyeon',3),

  mk('event-5','행사/이벤트','문화행사','보라 마젠타 문화',
    'linear-gradient(135deg,#2C0040 0%,#6A1B9A 50%,#E040FB 100%)','#F8BBD9',
    '🎨 문화행사\n초대합니다','마을 문화예술 프로그램\n무료 참여','#1A0028',
    85,'Nanum Myeongjo',4),

  mk('event-6','행사/이벤트','나눔 한마당','따뜻한 나눔 오렌지',
    'linear-gradient(135deg,#BF360C 0%,#E64A19 50%,#FF7043 100%)','#FBE9E7',
    '🤝 나눔\n한마당','함께 나누면\n더 따뜻해요','#7F2407',
    82,'Nanum Gothic',5),

  mk('event-7','행사/이벤트','마을 음악회','우아한 인디고 실버',
    'linear-gradient(135deg,#1A237E 0%,#283593 50%,#3949AB 100%)','#C5CAE9',
    '🎵 마을\n음악회','우리 마을 음악가들의\n특별한 공연','#0D1657',
    88,'Nanum Myeongjo',6),

  // ── 발표회 ─────────────────────────────────────────
  mk('pres-1','발표회','성과 발표회','전문 네이비 화이트',
    'linear-gradient(135deg,#0D47A1 0%,#1565C0 50%,#1976D2 100%)','#E3F2FD',
    '○○년도\n성과발표회','한 해의 활동을\n함께 돌아봅니다','#0A3070',
    90,'Nanum Myeongjo',0),

  mk('pres-2','발표회','작품 발표회','예술적 슬레이트 그레이',
    'linear-gradient(135deg,#263238 0%,#37474F 50%,#546E7A 100%)','#ECEFF1',
    '🎨 작품\n발표회','마을 예술인들의\n소중한 작품을 만나요','#1A252A',
    88,'Nanum Myeongjo',1),

  mk('pres-3','발표회','학습 성과 발표','밝은 하늘 파랑',
    'linear-gradient(135deg,#0277BD 0%,#0288D1 50%,#29B6F6 100%)','#E1F5FE',
    '📖 학습\n성과 발표','배움의 결실을\n함께 나눕니다','#01579B',
    85,'Nanum Gothic',2),

  mk('pres-4','발표회','연간 활동 보고','다크 골드 격식',
    'linear-gradient(135deg,#1A1A1A 0%,#2D2D2D 50%,#424242 100%)','#FFD700',
    '연간 활동\n보고회','한 해를 돌아보는\n소중한 자리','#111111',
    90,'Nanum Myeongjo',3),

  mk('pres-5','발표회','사업계획 발표','깔끔한 초록 화이트',
    'linear-gradient(135deg,#1B5E20 0%,#2E7D32 50%,#43A047 100%)','#F1F8E9',
    '사업계획\n발표회','새로운 시작을\n함께 준비해요','#0A3D12',
    88,'Nanum Barun Gothic',4),

  mk('pres-6','발표회','연구 결과 발표','버건디 크림 학술',
    'linear-gradient(135deg,#4A0010 0%,#880E4F 50%,#AD1457 100%)','#FCE4EC',
    '연구 결과\n발표','마을공동체 연구 성과를\n공유합니다','#32000C',
    88,'Nanum Myeongjo',5),

  mk('pres-7','발표회','수료 발표회','축하 골드 화이트',
    'linear-gradient(135deg,#E65100 0%,#EF6C00 50%,#FB8C00 100%)','#FFFFFF',
    '🎓 수료\n발표회','함께한 시간의\n빛나는 결실','#8F3900',
    85,'Do Hyeon',6),

  // ── 소식알림 ───────────────────────────────────────
  mk('news-1','소식알림','긴급 공지','긴급 레드 화이트',
    'linear-gradient(135deg,#7F0000 0%,#C62828 50%,#D32F2F 100%)','#FFFFFF',
    '⚠️ 긴급 공지\n사항입니다','중요한 내용이니\n반드시 확인해주세요','#5F0000',
    90,'Do Hyeon',0),

  mk('news-2','소식알림','마을 소식지','정기 소식 네이비',
    'linear-gradient(135deg,#0D47A1 0%,#1565C0 50%,#1976D2 100%)','#E3F2FD',
    '📰 마을 공동체\n소식지','이번 달 우리 마을\n이야기를 전합니다','#0A3070',
    85,'Nanum Myeongjo',1),

  mk('news-3','소식알림','회원 모집 공고','희망찬 초록 민트',
    'linear-gradient(135deg,#1B5E20 0%,#2E7D32 50%,#4CAF50 100%)','#E8F5E9',
    '📣 회원 모집\n공고','○○ 활동에 참여할\n회원을 모집합니다','#0A3D12',
    85,'Jua',2),

  mk('news-4','소식알림','일정 변경 안내','주의 노랑 다크',
    'linear-gradient(135deg,#E65100 0%,#F57F17 50%,#F9A825 100%)','#FFF9C4',
    '📅 일정 변경\n안내','다음 모임 일정이\n변경되었습니다','#6D3600',
    85,'Nanum Gothic',3),

  mk('news-5','소식알림','감사 인사','따뜻한 핑크 로즈',
    'linear-gradient(135deg,#4A0030 0%,#880E4F 50%,#C2185B 100%)','#FCE4EC',
    '💛 감사\n인사드려요','함께해주신 모든 분들께\n진심으로 감사드립니다','#32001E',
    85,'Nanum Myeongjo',4),

  mk('news-6','소식알림','행사 결과 안내','정보형 청록 블루',
    'linear-gradient(135deg,#004D40 0%,#00695C 50%,#00897B 100%)','#E0F7FA',
    '✅ 행사 결과\n안내','참여해주신\n모든 분들 감사합니다','#003330',
    85,'Nanum Barun Gothic',5),

  mk('news-7','소식알림','새소식 알림','신선한 오렌지 크림',
    'linear-gradient(135deg,#BF360C 0%,#E64A19 50%,#FF7043 100%)','#FBE9E7',
    '🌟 새 소식\n전합니다','마을공동체의\n따뜻한 소식입니다','#7F2407',
    82,'Nanum Gothic',6),

  // ── 자율 템플릿 ────────────────────────────────────
  mk('free-1','자율 템플릿','그라디언트 블루퍼플','신비로운 블루 퍼플',
    'linear-gradient(135deg,#6A11CB 0%,#3A7BD5 50%,#2575FC 100%)','#FFFFFF',
    '제목을\n입력해주세요','내용을 자유롭게\n작성해보세요','#3A0080',82,'Nanum Gothic',0),

  mk('free-2','자율 템플릿','핑크 코랄 그라디언트','밝고 화사한 핑크',
    'linear-gradient(135deg,#f093fb 0%,#f5576c 50%,#FF6B6B 100%)','#FFFFFF',
    '제목을\n입력해주세요','내용을 자유롭게\n작성해보세요','#8B0040',82,'Jua',1),

  mk('free-3','자율 템플릿','시안 블루 그라디언트','시원한 블루 시안',
    'linear-gradient(135deg,#0077B6 0%,#00B4D8 50%,#90E0EF 100%)','#FFFFFF',
    '제목을\n입력해주세요','내용을 자유롭게\n작성해보세요','#00385A',85,'Do Hyeon',2),

  mk('free-4','자율 템플릿','에메랄드 그린','자연 에메랄드 그린',
    'linear-gradient(135deg,#134E5E 0%,#1B9454 50%,#43E97B 100%)','#FFFFFF',
    '제목을\n입력해주세요','내용을 자유롭게\n작성해보세요','#0A2E00',85,'Nanum Myeongjo',3),

  mk('free-5','자율 템플릿','선셋 그라디언트','노을빛 선셋',
    'linear-gradient(135deg,#FA709A 0%,#FE9A46 50%,#FEE140 100%)','#3D0020',
    '제목을\n입력해주세요','내용을 자유롭게\n작성해보세요','#6B0030',80,'Kirang Haerang',4),

  mk('free-6','자율 템플릿','라벤더 로즈','몽환적인 라벤더',
    'linear-gradient(135deg,#667EEA 0%,#A18CD1 50%,#FBC2EB 100%)','#FFFFFF',
    '제목을\n입력해주세요','내용을 자유롭게\n작성해보세요','#2D0060',82,'Nanum Pen Script',5),

  mk('free-7','자율 템플릿','웜 피치 그라디언트','따뜻한 피치 크림',
    'linear-gradient(135deg,#D4535A 0%,#F4845F 50%,#FFECD2 100%)','#4A1000',
    '제목을\n입력해주세요','내용을 자유롭게\n작성해보세요','#7A2000',80,'Yeon Sung',6),
]

export const CATEGORIES = ['전체', '독서모임', '공동체모임', '행사/이벤트', '발표회', '소식알림', '자율 템플릿']
