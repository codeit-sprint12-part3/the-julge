export interface Application {
  item: {
    id: string;
    status: string;
  };
  href: string;
}

export interface Shop {
  item: {
    id: string;
    name: string;
    category: string;
    address1: string;
    address2: string;
    description: string;
    imageUrl: string;
    originalHourlyPay: number;
  };
  href: string;
}

export interface Notice {
  item: {
    id: string;
    hourlyPay: number;
    description: string;
    startsAt: string;
    workhour: number;
    closed: boolean;
  };
  href: string;
}

export interface AlertItem {
  id: string;
  createdAt: string;
  result: string;
  read: boolean;
  application: Application;
  shop: Shop;
  notice: Notice;
}

export interface AlertResponse {
  offset: number;
  limit: number;
  count: number;
  hasNext: boolean;
  items: {
    item: AlertItem;
    links: { rel: string; description: string; method: string; href: string }[];
  }[];
  links: { rel: string; description: string; method: string; href: string }[];
}

export interface AlertsItemProps {
  data: AlertItem;
}
