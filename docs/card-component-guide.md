# 카드 컴포넌트 가이드

> 리빙크래프트 프로젝트의 카드 컴포넌트 디자인 가이드입니다.

## 개요

카드 컴포넌트는 콘텐츠를 그룹화하여 표시하는 UI 요소입니다. 일관된 사용자 경험을 위해 아래 가이드를 **반드시** 준수해야 합니다.

> ⚠️ **중요**: 카드의 margin, radius, spacing, color는 가이드를 꼭 지켜주세요.

## 디자인 스펙

### 1. Margin (마진)

카드 외부 여백은 충분한 공간을 확보해야 합니다.

- **기본 권장 마진**: `10px` 이상
- **특수 케이스** (예: Mobile_BottomCTA): `20px` 여백 권장
- 카드는 컨테이너 내에서 충분한 숨 쉴 공간을 가져야 합니다

### 2. Radius (모서리 반경)

카드의 높이에 따라 적절한 radius를 적용합니다.

- **카드 높이 > 60px일 때**: `20px`
- **카드 높이 2개 또는 3개 행일 때**: `18px`
- **작은 카드**: `16px` 또는 `14px`

> 💡 **현재 ServiceCard 구현**: `12px` 사용 중 → 가이드 재검토 필요

### 3. Spacing (내부 간격)

카드 내부 요소들 간의 간격은 일관성을 유지해야 합니다.

- **상하 간격 (Vertical)**: `10px`
- **좌우 간격 (Horizontal)**: `8px`
- **표준 Padding/Margin**: `12px`, `24px`, `32px` 중 선택

### 4. Color (색상)

TDS(토스 디자인 시스템) 색상 팔레트를 사용합니다.

| 색상 타입 | 색상 코드 | 용도 |
|---------|---------|-----|
| **CardBg-White** | `#FFFFFF` | 밝은 배경 (권장) |
| **CardBg-Grey** | Grey 계열 | 회색 배경 카드 |
| **텍스트** | `#191F28` (Grey900) | 본문 텍스트 |

> ⚠️ TDS 색상 팔레트 외 색상 사용 금지

### 5. Border & Shadow (보더 및 그림자)

- **그림자**: `Common_Shadow` 사용 (TDS 표준 그림자)
- **보더**: 가이드에 명시된 스타일만 사용
- **금지 사항**: 임의의 그림자 스타일 적용 금지

## 타이포그래피

### 폰트 시스템

- **기본 폰트**: Toss Product Sans OTF (또는 TDS 기본 폰트)
- **제목**: Bold(700) 16-18px
- **본문**: Regular(400) 13-14px
- **설명**: Regular(400) 12-13px

### 제목 스타일 (t1)

- **폰트**: Toss Product Sans OTF
- **굵기**: Bold (700)
- **크기**: 30px
- **행간**: 1.33em
- **용도**: 카드 제목, 중요 메시지

## 현재 구현 상태

### ServiceCard 컴포넌트 (`shared/ui/service-card/ServiceCard.tsx`)

| 항목 | 현재 값 | 가이드 권장 값 | 상태 |
|-----|--------|------------|------|
| **Border Radius** | 12px | 18-20px | ⚠️ 조정 필요 |
| **배경색** | white | #FFFFFF | ✅ 준수 |
| **마진** | marginBottom: 16px | 10px 이상 | ✅ 준수 |
| **패딩** | 16px | 표준 간격 사용 | ✅ 준수 |
| **그림자** | shadow 스타일 적용 | Common_Shadow | ✅ 준수 |

## 개발자 가이드라인

### ✅ 준수해야 할 사항

1. **카드 기본 스펙**
   - 배경색: 항상 `#FFFFFF` (CardBg-White) 사용
   - 마진: 최소 `10px` 이상 유지
   - 텍스트 색상: `#191F28` (Grey900) 사용

2. **간격 시스템**
   - 상하 간격: `10px`
   - 좌우 간격: `8px`
   - 표준 Padding/Margin: `12px`, `24px`, `32px` 중 선택

3. **Border Radius 규칙**
   ```
   높이 > 60px        → 20px
   높이 2~3개 행      → 18px
   작은 카드          → 16px 또는 14px
   ```

4. **타이포그래피**
   - TDS 기본 폰트 사용
   - 제목: Bold(700) 16-18px
   - 본문: Regular(400) 13-14px

5. **색상 시스템**
   - TDS 색상 팔레트 필수
   - CardBg-White 또는 CardBg-Grey 사용
   - 임의의 색상 사용 금지

### ⛔ 금지 사항

1. 임의의 그림자 스타일 적용 금지
2. 표준 radius 값 외 사용 금지
3. TDS 색상 팔레트 외 색상 사용 금지
4. 표준 간격 시스템 외 값 사용 자제

## 검수 체크리스트

카드 컴포넌트를 구현하거나 수정할 때 다음 사항을 확인하세요:

- [ ] Border radius가 가이드 스펙인가? (14px, 16px, 18px, 20px 중 하나)
- [ ] 배경색이 `#FFFFFF` (CardBg-White)인가?
- [ ] 텍스트 색상이 `#191F28` (Grey900)인가?
- [ ] 마진이 최소 10px 이상인가?
- [ ] 내부 간격이 표준 시스템(상하 10px, 좌우 8px)을 따르는가?
- [ ] 타이포그래피가 TDS 스타일을 사용하는가?
- [ ] 그림자가 Common_Shadow인가?

## 사용 예시

```tsx
// 카드 컴포넌트 기본 구조
<Card
  style={{
    backgroundColor: '#FFFFFF',
    borderRadius: 20, // 높이에 따라 조정
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 16,
  }}
>
  {/* 카드 내용 */}
  <CardTitle style={{ fontSize: 18, fontWeight: '700' }}>
    제목
  </CardTitle>

  <CardContent style={{ marginTop: 10 }}>
    {/* 콘텐츠 */}
  </CardContent>
</Card>
```

## 관련 컴포넌트

카드와 함께 사용할 수 있는 디자인 시스템 컴포넌트:

- **Mobile_ListRow**: 리스트 형태의 카드 내용
- **Mobile_ListHeader**: 카드 헤더
- **Mobile_Top**: 상단 바
- **Mobile_Text**: 텍스트 요소

## Figma 참조

- **파일 이름**: [제휴사명] 리빙크래프트
- **컴포넌트 ID**: `4019:2264`
- **노드 ID**: `4042-9491`
- **컴포넌트 이름**: 🌈 Card (가이드)
- **가이드 이미지**: `card_guide.png` (프로젝트 루트)

---

*이 문서는 Figma 디자인 가이드를 기반으로 작성되었습니다.*
*최종 업데이트: 2025-11-21*
