import { onRequestPost as __api_summary_ts_onRequestPost } from "C:\\Users\\harvey\\Documents\\trae_projects\\notion_blog\\functions\\api\\summary.ts"
import { onRequestPost as __api_translate_ts_onRequestPost } from "C:\\Users\\harvey\\Documents\\trae_projects\\notion_blog\\functions\\api\\translate.ts"

export const routes = [
    {
      routePath: "/api/summary",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_summary_ts_onRequestPost],
    },
  {
      routePath: "/api/translate",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_translate_ts_onRequestPost],
    },
  ]