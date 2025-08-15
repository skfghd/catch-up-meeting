# 🚀 Firebase 배포 체크리스트

## ✅ 배포 전 확인사항

### 1. Firebase 프로젝트 설정
- [ ] Firebase Console에서 새 프로젝트 생성 완료
- [ ] 프로젝트 ID: `kindtool-ai` (또는 사용자 지정)
- [ ] Firestore Database 활성화 (Native 모드)
- [ ] Firebase Hosting 활성화
- [ ] Cloud Functions 활성화
- [ ] Firebase Storage 활성화 (선택사항)

### 2. 로컬 환경 설정
- [ ] Node.js 18+ 설치 확인: `node --version`
- [ ] Firebase CLI 설치: `npm install -g firebase-tools`
- [ ] Firebase 로그인: `firebase login`
- [ ] 프로젝트 연결: `firebase use kindtool-ai`

### 3. 환경 변수 설정
- [ ] `functions/.env` 파일 생성 (.env.example 복사)
- [ ] `APP_SESSION_SECRET` 값 설정
- [ ] Firebase Functions 환경 변수 설정:
  ```bash
  firebase functions:config:set app.session_secret="your-secret-key"
  ```

### 4. 의존성 설치
- [ ] 루트 의존성: `npm install`
- [ ] Functions 의존성: `cd functions && npm install`

### 5. 빌드 테스트
- [ ] 클라이언트 빌드: `npm run build`
- [ ] Functions 빌드: `cd functions && npm run build`
- [ ] 빌드 오류 없음 확인

## 🔥 배포 실행

### 자동 배포 (권장)
```bash
./deploy.sh
```

### 수동 배포
```bash
# 1. 전체 빌드
npm run firebase:build

# 2. 배포 실행
firebase deploy

# 또는 개별 배포
firebase deploy --only firestore
firebase deploy --only functions
firebase deploy --only hosting
```

## ✅ 배포 후 확인사항

### 1. 웹사이트 접속 확인
- [ ] 메인 URL 접속: `https://kindtool-ai.web.app`
- [ ] 페이지 로딩 정상 확인
- [ ] 기본 UI 표시 확인

### 2. API 엔드포인트 확인
- [ ] Health Check: `https://asia-northeast3-kindtool-ai.cloudfunctions.net/app/api/health`
- [ ] 응답 확인: `{"status":"ok","timestamp":"..."}`

### 3. 기능 테스트
- [ ] 사용자 등록/로그인 테스트
- [ ] 조직 생성 테스트
- [ ] 아이스브레이킹 세션 생성 테스트
- [ ] 회의실 생성 테스트
- [ ] 데이터 저장/조회 테스트

### 4. 성능 확인
- [ ] 페이지 로드 시간 < 3초
- [ ] API 응답 시간 < 1초
- [ ] 모바일 반응형 확인

## 🔧 문제 해결

### 배포 실패 시
1. **빌드 오류**
   ```bash
   # 로그 확인
   npm run build 2>&1 | tee build.log
   
   # Node modules 재설치
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Functions 배포 실패**
   ```bash
   # Functions 로그 확인
   firebase functions:log
   
   # 환경 변수 확인
   firebase functions:config:get
   ```

3. **권한 오류**
   ```bash
   # Firebase 재로그인
   firebase logout
   firebase login
   
   # 프로젝트 권한 확인
   firebase projects:list
   ```

### API 오류 시
1. **401 Unauthorized**
   - 세션 설정 확인
   - 환경 변수 확인
   - CORS 설정 확인

2. **500 Internal Server Error**
   - Functions 로그 확인: `firebase functions:log`
   - Firestore 규칙 확인
   - 환경 변수 설정 확인

## 📊 모니터링 설정

### 1. Firebase Console 모니터링
- Performance: 페이지 로드 시간 모니터링
- Functions: 실행 횟수, 오류율 모니터링
- Firestore: 읽기/쓰기 작업 모니터링

### 2. 알림 설정
- 예산 알림 설정
- 오류율 알림 설정
- 사용량 알림 설정

## 💰 비용 최적화

### 무료 할당량 모니터링
- Hosting: 10GB 스토리지, 360MB/일
- Functions: 200만 호출/월
- Firestore: 50K 읽기, 20K 쓰기/일

### 비용 절약 팁
- 불필요한 Functions 호출 줄이기
- Firestore 쿼리 최적화
- 이미지 압축 및 CDN 활용

## 🎯 성공 기준

- [ ] 웹사이트 정상 접속 가능
- [ ] 모든 주요 기능 작동
- [ ] API 응답 시간 1초 이내
- [ ] 모바일 반응형 정상 작동
- [ ] 일일 활성 사용자 처리 가능
- [ ] 오류율 1% 미만

---

**배포 완료 시 다음 정보를 저장하세요:**
- 웹사이트 URL: https://kindtool-ai.web.app
- API URL: https://asia-northeast3-kindtool-ai.cloudfunctions.net/app
- Firebase Console: https://console.firebase.google.com/project/kindtool-ai
- 배포 일시: [기록하세요]