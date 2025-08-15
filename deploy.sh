#!/bin/bash

# KindTool AI - Firebase 배포 스크립트
# 이 스크립트는 전체 애플리케이션을 Firebase에 배포합니다.

set -e  # 오류 발생 시 스크립트 중단

echo "🚀 KindTool AI Firebase 배포 시작..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 함수 정의
print_step() {
    echo -e "${BLUE}📋 단계: $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. 필수 도구 확인
print_step "필수 도구 확인 중..."

if ! command -v firebase &> /dev/null; then
    print_error "Firebase CLI가 설치되지 않았습니다."
    echo "다음 명령어로 설치하세요: npm install -g firebase-tools"
    exit 1
fi

if ! command -v node &> /dev/null; then
    print_error "Node.js가 설치되지 않았습니다."
    echo "https://nodejs.org/ 에서 Node.js를 설치하세요."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm이 설치되지 않았습니다."
    exit 1
fi

print_success "모든 필수 도구가 설치되어 있습니다."

# 2. Firebase 로그인 확인
print_step "Firebase 로그인 확인 중..."
if ! firebase projects:list &> /dev/null; then
    print_warning "Firebase에 로그인이 필요합니다."
    firebase login
fi
print_success "Firebase 로그인 확인됨"

# 3. 프로젝트 설정
print_step "Firebase 프로젝트 설정 중..."
if [ ! -f ".firebaserc" ]; then
    print_error ".firebaserc 파일이 없습니다."
    exit 1
fi

PROJECT_ID=$(cat .firebaserc | grep -o '"default": "[^"]*"' | cut -d'"' -f4)
echo "프로젝트 ID: $PROJECT_ID"

# 4. 의존성 설치 (Functions)
print_step "Functions 의존성 설치 중..."
cd functions
if [ ! -f "package.json" ]; then
    print_error "functions/package.json 파일이 없습니다."
    exit 1
fi
npm install
print_success "Functions 의존성 설치 완료"

# 5. 환경 변수 확인
print_step "환경 변수 확인 중..."
if [ ! -f ".env" ]; then
    print_warning ".env 파일이 없습니다. .env.example을 참조하여 생성하세요."
    if [ -f ".env.example" ]; then
        echo "예시 파일 내용:"
        cat .env.example
    fi
    read -p "계속하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Firebase Functions 환경 변수 설정
if [ -f ".env" ]; then
    echo "환경 변수를 Firebase Functions에 설정 중..."
    source .env
    if [ ! -z "$APP_SESSION_SECRET" ]; then
        firebase functions:config:set app.session_secret="$APP_SESSION_SECRET" --project=$PROJECT_ID
        print_success "세션 시크릿 설정 완료"
    fi
fi

cd ..

# 6. 클라이언트 빌드
print_step "클라이언트 애플리케이션 빌드 중..."
if [ ! -f "package.json" ]; then
    print_error "package.json 파일이 없습니다."
    exit 1
fi

# Node modules 설치
npm install

# Vite로 프로덕션 빌드
npm run build
print_success "클라이언트 빌드 완료"

# 7. Functions 빌드
print_step "Functions 빌드 중..."
cd functions
npm run build
cd ..
print_success "Functions 빌드 완료"

# 8. Firebase 배포
print_step "Firebase 배포 실행 중..."

# Firestore 규칙 및 인덱스 배포
firebase deploy --only firestore --project=$PROJECT_ID
print_success "Firestore 규칙 및 인덱스 배포 완료"

# Storage 규칙 배포
firebase deploy --only storage --project=$PROJECT_ID
print_success "Storage 규칙 배포 완료"

# Functions 배포
firebase deploy --only functions --project=$PROJECT_ID
print_success "Functions 배포 완료"

# Hosting 배포
firebase deploy --only hosting --project=$PROJECT_ID
print_success "Hosting 배포 완료"

# 9. 배포 완료
print_step "배포 정보 확인 중..."
HOSTING_URL="https://$PROJECT_ID.web.app"
FUNCTIONS_URL="https://asia-northeast3-$PROJECT_ID.cloudfunctions.net"

echo ""
echo "🎉 배포가 성공적으로 완료되었습니다!"
echo ""
echo "📱 웹 애플리케이션 URL:"
echo "   $HOSTING_URL"
echo ""
echo "🔧 Functions API URL:"
echo "   $FUNCTIONS_URL/app/api/"
echo ""
echo "📊 Firebase 콘솔:"
echo "   https://console.firebase.google.com/project/$PROJECT_ID"
echo ""
echo "🔍 배포 상태 확인:"
echo "   firebase hosting:channel:list --project=$PROJECT_ID"
echo "   firebase functions:log --project=$PROJECT_ID"
echo ""

# 10. 배포 후 테스트
print_step "배포된 애플리케이션 테스트 중..."
echo "Health check 테스트..."
if curl -f -s "$FUNCTIONS_URL/app/api/health" > /dev/null; then
    print_success "API 서버가 정상적으로 응답합니다."
else
    print_warning "API 서버 응답을 확인할 수 없습니다. 수동으로 확인해주세요."
fi

echo ""
print_success "🚀 KindTool AI가 성공적으로 배포되었습니다!"
echo "웹사이트를 확인하세요: $HOSTING_URL"