import { parseCookies, setCookie as setNpmCookie, destroyCookie } from "nookies";

// 쿠키 설정 함수
export const setCookie = (name: string, value: string, maxAge = 3600) => {
  setNpmCookie(null, name, value, {
    path: "/",
    maxAge,
    httpOnly: false, // 클라이언트에서 접근 가능
  });
};

// 쿠키 가져오는 함수
export const getCookie = (name: string) => {
  const cookies = parseCookies();
  return cookies[name] ? { value: cookies[name] } : null;
};

// 쿠키 삭제 함수
export const removeCookie = (name: string) => {
  destroyCookie(null, name);
};
