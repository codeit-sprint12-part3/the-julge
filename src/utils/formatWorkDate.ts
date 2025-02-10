import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.locale("ko");
dayjs.extend(relativeTime);

export const formatWorkDate = (startsAt: string, workhour: number) => {
  const start = dayjs(startsAt);
  const end = start.add(workhour, "hour");

  return `${start.format("YYYY-MM-DD HH:mm")} ~ ${end.format("HH:mm")} (${workhour}시간)`;
};
