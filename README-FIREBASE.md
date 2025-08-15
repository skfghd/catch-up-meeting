# 🔥 KindTool AI - Firebase 배포 가이드

이 가이드는 KindTool AI를 Firebase에 완전히 배포하는 방법을 설명합니다.

## 📋 사전 준비사항

### 필수 도구 설치
```bash
# Firebase CLI 설치
npm install -g firebase-tools

# Node.js 18+ 설치 확인
node --version  # v18.0.0 이상이어야 함
```

### Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/) 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름: `kindtool-ai` (또는 원하는 이름)
4. Google Analytics 설정 (선택사항)

### Firebase 서비스 활성화
Firebase Console에서 다음 서비스들을 활성화하세요:
- **Firestore Database** (Native 모드)
- **Firebase Hosting**
- **Cloud Functions**
- **Firebase Storage** (선택사항)

## 🚀 자동 배포 (권장)

### 1단계: 배포 스크립트 실행
```bash
# 실행 권한 부여
chmod +x deploy.sh

# 자동 배포 시작
./deploy.sh
```

스크립트가 다음 작업들을 자동으로 수행합니다:
- Firebase 로그인 확인
- 의존성 설치
- 환경 변수 설정
- 클라이언트 빌드
- Functions 빌드 및 배포
- Hosting 배포
- Firestore 규칙 적용

## 🛠️ 수동 배포

자동 배포가 실패하는 경우 수동으로 진행하세요.

### 1단계: Firebase 로그인
```bash
firebase login
```

### 2단계: 프로젝트 설정
```bash
# .firebaserc 파일의 프로젝트 ID 확인
firebase use kindtool-ai  # 또는 본인의 프로젝트 ID
```

### 3단계: 환경 변수 설정
```bash
# functions/.env 파일 생성 (.env.example 참조)
cp functions/.env.example functions/.env

# 환경 변수 편집
nano functions/.env

# Firebase Functions에 환경 변수 설정
firebase functions:config:set app.session_secret="your-super-secret-key"
```

### 4단계: 의존성 설치 및 빌드
```bash
# 루트 의존성 설치
npm install

# Functions 의존성 설치
cd functions
npm install
cd ..

# 클라이언트 빌드
npm run build

# Functions 빌드
cd functions
npm run build
cd ..
```

### 5단계: 배포
```bash
# 전체 배포
firebase deploy

# 또는 개별 배포
firebase deploy --only firestore    # Firestore 규칙
firebase deploy --only functions    # Cloud Functions
firebase deploy --only hosting      # 웹 호스팅
```

## 🔧 주요 설정 파일

### `firebase.json`
- Firebase 서비스 설정
- 호스팅 rewrites 규칙
- Functions 리전 설정 (asia-northeast3, 서울)

### `firestore.rules`
- Firestore 보안 규칙
- 현재: 모든 사용자에게 읽기/쓰기 허용 (개발용)
- 프로덕션: 적절한 인증 규칙 구현 필요

### `functions/src/index.ts`
- Express 서버를 Firebase Functions로 변환
- 기존 API 엔드포인트 모두 유지
- PostgreSQL → Firestore 변환

## 📊 Firestore 데이터 구조

기존 PostgreSQL 테이블들이 다음과 같이 Firestore 컬렉션으로 변환됩니다:

```
/appUsers/{userId}
/organizations/{orgId}
/organizationMembers/{memberId}
/icebreakingSessions/{sessionId}
/icebreakingParticipants/{participantId}
/meetingRooms/{roomId}
/teams/{teamId}
/teamMembers/{memberId}
/meetings/{meetingId}
/meetingParticipants/{participantId}
/meetingFeedback/{feedbackId}
```

## 🌐 배포 후 URL

배포 완료 후 다음 URL들을 사용할 수 있습니다:

### 웹 애플리케이션
```
https://kindtool-ai.web.app
```

### API 엔드포인트
```
https://asia-northeast3-kindtool-ai.cloudfunctions.net/app/api/
```

### Firebase Console
```
https://console.firebase.google.com/project/kindtool-ai
```

## 🔍 문제 해결

### 일반적인 오류

1. **"Firebase CLI not found"**
   ```bash
   npm install -g firebase-tools
   ```

2. **"Permission denied"**
   ```bash
   firebase login
   firebase projects:list  # 권한 확인
   ```

3. **"Build failed"**
   ```bash
   # Node.js 버전 확인 (18+ 필요)
   node --version
   
   # 의존성 재설치
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **"Functions deployment failed"**
   ```bash
   # Functions 로그 확인
   firebase functions:log
   
   # 환경 변수 확인
   firebase functions:config:get
   ```

### 로그 확인
```bash
# Functions 로그
firebase functions:log

# 실시간 로그
firebase functions:log --follow

# 특정 Function 로그
firebase functions:log --only app
```

## 🔒 보안 설정

### Firestore 보안 규칙 (프로덕션용)
현재는 개발용으로 모든 접근을 허용하고 있습니다. 프로덕션 배포 시 `firestore.rules`를 다음과 같이 수정하세요:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 인증된 사용자만 접근 가능
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 환경 변수 관리
민감한 정보는 Firebase Functions config에서 관리:

```bash
# 환경 변수 설정
firebase functions:config:set someservice.key="THE API KEY"

# 환경 변수 확인
firebase functions:config:get
```

## 📈 모니터링 및 분석

### Firebase Console에서 확인 가능한 지표:
- **Hosting**: 트래픽, 대역폭 사용량
- **Functions**: 실행 횟수, 오류율, 응답 시간
- **Firestore**: 읽기/쓰기 작업 수, 스토리지 사용량

### Google Analytics 연동
Firebase Console → Analytics → 설정에서 Google Analytics 연동 가능

## 💰 비용 관리

### Firebase 무료 할당량:
- **Hosting**: 10GB 스토리지, 360MB/일 전송
- **Functions**: 200만 호출/월, 400GB-초 컴퓨팅/월
- **Firestore**: 50K 읽기, 20K 쓰기, 20K 삭제/일

### 비용 알림 설정:
Firebase Console → 프로젝트 설정 → 사용량 및 결제 → 예산 알림

---

## 🆘 지원

문제가 발생하면 다음을 확인하세요:
1. [Firebase 공식 문서](https://firebase.google.com/docs)
2. [Firebase 상태 페이지](https://status.firebase.google.com/)
3. 이 프로젝트의 로그: `firebase functions:log`

배포 성공을 축하합니다! 🎉