import createFetchClient, { Middleware } from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "./api.d";
import Cookies from "js-cookie";

export const $fetchClient = createFetchClient<paths>({
  baseUrl: `https://test.shuair.space/app/`,
});

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const token = Cookies.get("auth_token");
    request.headers.set("Authorization", `Bearer ${token}`);
    return request;
  },
}

export const $protectedFetchClient = createFetchClient<paths>({
  baseUrl: "https://test.shuair.space/app/",
});
$protectedFetchClient.use(authMiddleware); 

export const $api = createClient($fetchClient);