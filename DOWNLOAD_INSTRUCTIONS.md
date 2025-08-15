# 📦 Firebase 배포 패키지 다운로드 안내

## 🎯 포함된 내용

이 ZIP 파일에는 KindTool AI를 Firebase에 배포하기 위한 모든 파일이 포함되어 있습니다:

### 🔧 Firebase 설정 파일
- `firebase.json` - Firebase 서비스 설정
- `.firebaserc` - 프로젝트 설정
- `firestore.rules` - Firestore 보안 규칙
- `firestore.indexes.json` - 데이터베이스 인덱스
- `storage.rules` - 스토리지 보안 규칙

### ⚙️ 서버 코드 (Functions)
- `functions/src/index.ts` - Express 서버를 Firebase Functions로 변환
- `functions/package.json` - Functions 의존성
- `functions/tsconfig.json` - TypeScript 설정
- `functions/.env.example` - 환경 변수 예시

### 💻 클라이언트 소스코드
- `client/` - React 애플리케이션 전체
- `shared/` - 공유 타입 및 스키마
- `public/` - 정적 파일 및 SEO 최적화된 HTML

### 🚀 자동 배포 스크립트
- `deploy.sh` - 원클릭 Firebase 배포 스크립트
- `package.json` - 루트 빌드 설정
- `vite.config.ts` - Vite 설정

### 💰 Google AdSense 설정
- `GOOGLE_ADSENSE_SETUP.md` - 수익화 설정 가이드
- `public/index.html` - AdSense 스크립트 포함

### 📚 상세 가이드 문서
- `README-FIREBASE.md` - 완전한 배포 가이드
- `DEPLOYMENT_CHECKLIST.md` - 단계별 체크리스트
- `GOOGLE_ADSENSE_SETUP.md` - AdSense 설정 방법

### 🔗 외부 앱 통합
- `kindtool-header.js` - 외부 앱용 헤더 스크립트

## 🚀 빠른 시작

### 1단계: 압축 해제
```bash
tar -xzf kindtool-firebase-deploy.tar.gz
cd kindtool-firebase-deploy
```

### 2단계: Firebase 설정
```bash
# Firebase CLI 설치 (아직 없다면)
npm install -g firebase-tools

# Firebase 로그인
firebase login

# 프로젝트 설정 (프로젝트 ID 수정 필요시)
firebase use kindtool-ai
```

### 3단계: 원클릭 배포
```bash
# 실행 권한 부여
chmod +x deploy.sh

# 자동 배포 실행
./deploy.sh
```

## 📖 자세한 가이드

더 자세한 설정 및 배포 방법은 다음 문서를 참조하세요:

1. **📋 단계별 가이드**: `DEPLOYMENT_CHECKLIST.md`
2. **🔧 상세 매뉴얼**: `README-FIREBASE.md`  
3. **💰 수익화 설정**: `GOOGLE_ADSENSE_SETUP.md`

## ⚠️ 주의사항

### 환경 변수 설정
배포 전에 반드시 다음을 설정하세요:
1. `functions/.env` 파일 생성 (`.env.example` 복사)
2. `APP_SESSION_SECRET` 값 설정
3. Firebase Functions 환경 변수 설정

### 프로젝트 ID 변경
`kindtool-ai` 외의 다른 프로젝트 ID를 사용하려면:
1. `.firebaserc` 파일에서 프로젝트 ID 수정
2. `deploy.sh` 스크립트에서 프로젝트 ID 수정

## 🆘 문제 해결

배포 중 문제가 발생하면:
1. `README-FIREBASE.md`의 문제 해결 섹션 확인
2. Firebase Functions 로그 확인: `firebase functions:log`
3. 공식 Firebase 문서 참조

## ✅ 성공 확인

배포 성공 시 다음 URL에서 애플리케이션을 확인할 수 있습니다:
- **웹사이트**: `https://your-project-id.web.app`
- **API**: `https://asia-northeast3-your-project-id.cloudfunctions.net/app/api/health`

---

**🎉 성공적인 Firebase 배포를 위해 포함된 모든 가이드를 따라주세요!**