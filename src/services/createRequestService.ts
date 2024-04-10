import { jwtDecode } from "jwt-decode";
interface IRequestParams {
  url: string;
  method?: string;
  body?: any;
  queryString?: any;
  multipart?: boolean;
  page?: number;
  perPage?: number;
  search?: string;
  headers?: { [key: string]: string };
}
type HeadersType = Record<string, string>;
interface IRequest {
  method: string;
  body?: any;
  headers: HeadersType;
}
function createRequestService({
  lskey,
  authheader,
  bearer = true,
}: {
  lskey: string;
  authheader: string;
  bearer?: boolean;
}) {
  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem(lskey) ?? "null");
    } catch (e) {
      return null;
    }
  };
  const setUser = (user: any) => {
    localStorage.setItem(lskey, JSON.stringify(user));
  };

  // to hold the failed requests.
  let accessTokenPromise: Promise<any> | null = null;
  //to ensure that only one token refresh request is made at a time.
  let isRefreshingAccessToken = false;

  const decodeToken = (user: any) => {
    let decodedToken = { exp: 0 };
    if (user && user.token && user.token.length > 10) {
      decodedToken = jwtDecode(user.token);
    }
    return decodedToken;
  };

  const handleSuccessfulTokenRefresh = async (user: any): Promise<any> => {
    if (!isRefreshingAccessToken) {
      isRefreshingAccessToken = true;
      accessTokenPromise = refreshToken(user).finally(() => {
        isRefreshingAccessToken = false;
        accessTokenPromise = null;
      });
      await accessTokenPromise;
    } else {
      // Если уже выполняется обновление токена, возвращаем промис, который разрешится после обновления
      return accessTokenPromise?.then();
    }
  };

  const send = async (data: IRequestParams) => {
    const user = getUser();
    const decodedToken = decodeToken(user);
    if (decodedToken.exp - 20 < Date.now() / 1000 && decodedToken.exp !== 0) {
      try {
        await handleSuccessfulTokenRefresh(user);
      } catch (error) {
        console.error("Failed to refresh token:", error);
        accessTokenPromise = null;
        setUser(null);
        window.location.href = "/";
        throw error;
        // clear the old promise so that the next request can start trying to update the token again
      }
    }
    const { url, request } = getUrlAndRequest(data);

    try {
      const response = await fetch(url, request);
      if (response.status < 300) {
        try {
          //console.log(response);
          const d = await response.json();
          return d;
        } catch (error) {
          console.log(error);
          throw error;
        }
      } else {
        const err = await response?.json();
        throw err;
      }
    } catch (err: any) {
      console.log(err);
      throw err;
    }
  };

  const refreshToken = async (user: any) => {
    const { VITE_PROJECTID: PROJECTID, VITE_SSOSERVERURL: SSOSERVERURL } =
      import.meta.env;
    const headers: HeadersType = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const request: IRequest = {
      method: "PUT",
      headers: headers,
    };
    if (user && user.refreshToken && user.refreshToken.length > 10) {
      request.headers["x-refresh-token"] = `${user.refreshToken}`;
      request.headers["app-Key"] = `${PROJECTID}`;
    }
    let url = `${SSOSERVERURL}/api/project-auth/refresh-tokens`;

    try {
      const response = await fetch(url, request);
      if (response.status < 300) {
        try {
          const d = await response.json();
          const u = getUser() || {};
          setUser({
            ...u,
            token: d.token,
            accessToken: d.accessToken,
            email: d.email,
          });
          //setUser(d);
        } catch (error) {
          console.log(error);
          throw error;
        }
      } else {
        const err = await response?.json();
        throw err;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getUrlAndRequest = (data: IRequestParams) => {
    const headers: HeadersType = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...data.headers,
    };
    const request: IRequest = {
      method: data.method ? data.method.toUpperCase() : "GET",
      headers: headers,
    };

    if (data.multipart) {
      delete request.headers["Content-Type"];
    }

    if (data.method && data.method.toUpperCase() !== "GET" && data.body) {
      request["body"] = data.multipart ? data.body : JSON.stringify(data.body);
    }
    const user = getUser();

    if (
      user &&
      user.token &&
      user.token.length > 10 &&
      !request.headers[authheader]
    ) {
      request.headers[authheader] = bearer
        ? `Bearer ${user.token}`
        : user.token;
    }
    let params = "";
    if (data.queryString) {
      params = "?queryString=" + JSON.stringify(data.queryString);
    }
    if (typeof data.page !== "undefined") {
      const addChar = params ? "&" : "?";
      params += `${addChar}page=${data.page}`;
    }
    if (data.perPage) {
      const addChar = params ? "&" : "?";
      params += `${addChar}perPage=${data.perPage}`;
    }
    if (data.search) {
      const addChar = params ? "&" : "?";
      params += `${addChar}search=${data.search}`;
    }
    let url = data.url + params;
    return { url, request };
  };

  return {
    sendRequest: send,
  };
}
export default createRequestService;
