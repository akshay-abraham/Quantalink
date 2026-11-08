import { getHost } from "../../../lib/browser";
import { START_PAGE } from "./start-page";

export const getTabTitle = (url: string) =>
  url === START_PAGE ? "Start Page" : getHost(url);
