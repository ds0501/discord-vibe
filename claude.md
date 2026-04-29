@AGENTS.md

# Discord-vibe 프로젝트

## 기술 스택
- Framework: Next.js 15 (App Router)
- Database: Supabase (PostgreSQL) + Realtime
- ORM: Prisma
- Auth: Kinde Auth
- UI: Tailwind CSS + shadcn/ui + Lucide React

## 절대 규칙
1. params, searchParams는 반드시 await로 비동기 처리
2. Server/Client Component 엄격히 분리
3. 모든 코드 TypeScript로 작성
4. DATABASE_URL(Transaction) / DIRECT_URL(Direct) 구분
5. postinstall: prisma generate 추가
6. Windows 환경이므로 cross-env 사용
7. Prisma 6 사용 (7 아님)

## DB 모델
- User: id(Kinde), email, name, username, image
- Server: id, name, imageUrl, inviteCode(unique), ownerId→User
- Member: id, userId→User, serverId→Server, role(ADMIN/MODERATOR/GUEST)
- Channel: id, name, serverId→Server, createdAt
- Message: id, content, imageUrl, userId→User, channelId→Channel, deleted, createdAt

## 실시간 전략
- 메시지: postgres_changes (DB 저장, 기록 유지)
- 타이핑 알림: Broadcast (휘발성)
- 온라인 상태: Presence

## 레이아웃
3단 중첩 구조: Server Sidebar → Channel Sidebar → Chat Area → Member Sidebar