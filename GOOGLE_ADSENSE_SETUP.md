# 💰 Google AdSense 설정 가이드

KindTool AI에 Google AdSense를 설정하여 수익화하는 방법을 안내합니다.

## 📋 사전 준비사항

### 1. Google AdSense 계정 생성
1. [Google AdSense](https://www.google.com/adsense/) 접속
2. "시작하기" 클릭
3. 웹사이트 URL 입력: `https://kindtool-ai.web.app`
4. 국가 선택 및 계정 정보 입력

### 2. 웹사이트 검토 준비
- 충분한 콘텐츠 (최소 10-15개 페이지)
- 개인정보처리방침 페이지 추가
- 이용약관 페이지 추가
- 연락처 정보 페이지 추가

## 🔧 AdSense 코드 구현

### 1. 기본 AdSense 코드 (이미 적용됨)
`public/index.html`에 다음 코드가 이미 포함되어 있습니다:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR-ADSENSE-ID"
     crossorigin="anonymous"></script>
```

### 2. AdSense ID 업데이트
1. Google AdSense에서 발급받은 Publisher ID 확인
2. `public/index.html`에서 `YOUR-ADSENSE-ID` 부분을 실제 ID로 교체:
   ```html
   ca-pub-1234567890123456  <!-- 예시 -->
   ```

### 3. 광고 단위 생성
AdSense 대시보드에서 다음 광고 단위들을 생성하세요:

#### 디스플레이 광고 (반응형)
```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-YOUR-ADSENSE-ID"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

#### 인피드 광고 (콘텐츠 사이)
```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-format="fluid"
     data-ad-layout-key="-fb+5w+4e-db+86"
     data-ad-client="ca-pub-YOUR-ADSENSE-ID"
     data-ad-slot="1234567890"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

## 📱 광고 배치 전략

### 1. 권장 광고 위치

#### 랜딩 페이지
- 헤더 하단 (배너형)
- 주요 콘텐츠 섹션 사이
- 푸터 상단

#### 설문/분석 페이지
- 설문 시작 전
- 결과 페이지 상단
- 사이드바 (데스크톱)

#### 회의실/세션 페이지
- 참가자 목록 하단
- 페이지 하단

### 2. 광고 컴포넌트 생성

새 파일: `client/src/components/AdSenseAd.tsx`
```tsx
import { useEffect } from 'react';

interface AdSenseAdProps {
  client: string;
  slot: string;
  format?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
}

export function AdSenseAd({ 
  client, 
  slot, 
  format = "auto", 
  responsive = true,
  style = { display: 'block' }
}: AdSenseAdProps) {
  useEffect(() => {
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={style}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
    />
  );
}

// 사용 예시
export function BannerAd() {
  return (
    <div className="my-8 text-center">
      <AdSenseAd
        client="ca-pub-YOUR-ADSENSE-ID"
        slot="1234567890"
        style={{ display: 'block', height: '90px' }}
      />
    </div>
  );
}

export function SquareAd() {
  return (
    <div className="my-4">
      <AdSenseAd
        client="ca-pub-YOUR-ADSENSE-ID"
        slot="0987654321"
        format="rectangle"
        style={{ display: 'block', width: '300px', height: '250px' }}
      />
    </div>
  );
}
```

### 3. 페이지별 광고 적용

#### 랜딩 페이지 (`client/src/pages/landing.tsx`)
```tsx
import { BannerAd } from '@/components/AdSenseAd';

// Hero 섹션 후 배너 광고 추가
<section className="py-16">
  <BannerAd />
</section>
```

#### 결과 페이지 (`client/src/pages/results.tsx`)
```tsx
import { SquareAd } from '@/components/AdSenseAd';

// 결과 표시 후 광고 추가
<div className="mt-8">
  <SquareAd />
</div>
```

## 🔍 성능 최적화

### 1. 지연 로딩 구현
```tsx
import { useState, useEffect } from 'react';

export function LazyAdSenseAd(props: AdSenseAdProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('.ad-container');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="ad-container">
      {isVisible && <AdSenseAd {...props} />}
    </div>
  );
}
```

### 2. 광고 블로커 감지
```tsx
export function AdBlockerDetector() {
  const [isAdBlocked, setIsAdBlocked] = useState(false);

  useEffect(() => {
    const adTest = document.createElement('div');
    adTest.innerHTML = '&nbsp;';
    adTest.className = 'adsbox';
    document.body.appendChild(adTest);

    setTimeout(() => {
      if (adTest.offsetHeight === 0) {
        setIsAdBlocked(true);
      }
      document.body.removeChild(adTest);
    }, 100);
  }, []);

  if (isAdBlocked) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          광고 차단기가 감지되었습니다. 서비스 개선을 위해 광고 허용을 고려해 주세요.
        </p>
      </div>
    );
  }

  return null;
}
```

## 📊 수익 최적화 전략

### 1. A/B 테스트
- 광고 위치별 성과 측정
- 광고 크기별 수익 비교
- 광고 형태별 클릭률 분석

### 2. 타겟팅 최적화
- 사용자 행동 분석
- 페이지별 광고 맞춤화
- 시간대별 광고 노출 조정

### 3. 콘텐츠 최적화
- 고품질 콘텐츠 제작
- SEO 최적화로 트래픽 증가
- 사용자 참여도 향상

## 🚀 배포 시 주의사항

### 1. AdSense 정책 준수
- 클릭 유도 금지
- 충분한 콘텐츠 확보
- 사용자 경험 우선

### 2. 성능 모니터링
- 페이지 로드 속도 확인
- 광고 로딩 시간 측정
- 사용자 이탈률 모니터링

### 3. 수익 추적
- AdSense 대시보드 정기 확인
- Google Analytics 연동
- 수익 보고서 분석

## 📈 예상 수익 계산

### 기본 지표
- RPM (Revenue per Mille): 페이지뷰 1,000회당 수익
- CTR (Click Through Rate): 광고 클릭률
- CPC (Cost per Click): 클릭당 단가

### 수익 예측 공식
```
일일 수익 = (일일 페이지뷰 × CTR × CPC) + (일일 페이지뷰 / 1000 × RPM)
```

### 목표 설정
- 초기 목표: 월 $100
- 중기 목표: 월 $500
- 장기 목표: 월 $1,000+

---

## ✅ 체크리스트

- [ ] AdSense 계정 생성 및 승인
- [ ] Publisher ID 설정
- [ ] 광고 단위 생성
- [ ] 광고 컴포넌트 구현
- [ ] 페이지별 광고 배치
- [ ] 성능 최적화 적용
- [ ] 정책 준수 확인
- [ ] 배포 및 모니터링 시작

**주의**: AdSense 승인은 보통 2-4주가 소요되며, 정책 위반 시 계정이 정지될 수 있으므로 가이드라인을 철저히 준수하세요.