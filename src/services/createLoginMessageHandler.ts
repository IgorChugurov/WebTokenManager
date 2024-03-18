// Define a TypeScript interface for the callback's parameter
export interface LoginDataFromAuth {
  _id: string;
  token: string;
  email: string;
}
const createLoginMessageHandler =
  ({
    lskey,
    ssoserverurl,
    callback,
  }: {
    lskey: string;
    ssoserverurl: string;
    callback: (data: LoginDataFromAuth) => void;
  }) =>
  (event: any) => {
    if (
      event.origin === ssoserverurl &&
      event.data &&
      event.data.type &&
      event.data.type === "userDataFromAuthServer"
    ) {
      const user = event.data.user;
      localStorage.setItem(lskey, JSON.stringify(user));
      callback(event.data);
    }
  };
export default createLoginMessageHandler;
