// 링크 정보 타입
export interface Link {
  rel: string;
  description: string;
  method: string;
  href: string;
}

// 가게 정보 타입
export interface ShopItem {
  id: string;
  name: string;
  category: string;
  address1: string;
  address2: string;
  description: string;
  imageUrl: string;
  originalHourlyPay: number;
}

// 가게 정보의 래퍼 타입
export interface Shop {
  item: ShopItem;
  href: string;
}

// 공고 아이템 타입
export interface NoticeItem {
  id: string;
  hourlyPay: number;
  startsAt: string;
  workhour: number;
  description: string;
  closed: boolean;
  shop: Shop;
}

// 공고 아이템 래퍼 타입
export interface NoticeWrapper {
  item: NoticeItem;
  links: Link[];
}

// API 응답 타입
export interface NoticeResponse {
  offset: number;
  limit: number;
  address: string[];
  count: number;
  hasNext: boolean;
  items: NoticeWrapper[];
  links: Link[];
}

// 공고 요청 파라미터 타입
export interface NoticeRequestParams {
  limit?: number;
  offset?: number;
  sort?: "pay" | "time" | "hour" | "shop";
  address?: string; // 주소 검색을 위한 배열
}

// 사용자 정보 타입
export interface UserItem {
  id: string;
  email: string;
  type: string;
  name: string;
  phone: string;
  address: string;
  bio: string;
}

// 사용자 정보 래퍼 타입
export interface User {
  item: UserItem;
  href: string;
}

// 지원서 아이템 타입
export interface ApplicationItem {
  id: string;
  status: string;
  createdAt: string;
  user: User;
  shop: Shop;
  notice: NoticeWrapper;
}

// 지원서 아이템 래퍼 타입
export interface ApplicationWrapper {
  item: ApplicationItem;
  links: Link[];
}

// 지원서 API 응답 타입
export interface ApplicationResponse {
  offset: number;
  limit: number;
  count: number;
  hasNext: boolean;
  items: ApplicationWrapper[];
  links: Link[];
}
