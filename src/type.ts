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
