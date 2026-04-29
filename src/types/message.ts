import type { MemberRole } from "@prisma/client";

export interface MessageUser {
  id: string;
  name: string | null;
  image: string | null;
}

export interface MessageWithUser {
  id: string;
  content: string;
  imageUrl: string | null;
  deleted: boolean;
  userId: string;
  channelId: string;
  createdAt: string; // ISO string (Date → JSON 직렬화)
  user: MessageUser;
}

export interface TypingUser {
  userId: string;
  name: string;
}

export interface CurrentUser {
  id: string;
  name: string;
  image: string | null;
  role: MemberRole;
}
