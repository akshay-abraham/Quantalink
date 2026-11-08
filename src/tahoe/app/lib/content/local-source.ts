import { ContentSource } from "./source";
import { parsePortfolio } from "./schema";
import localContent from "../../../data/portfolio.json";

export class LocalContentSource implements ContentSource {
  async load() {
    return parsePortfolio(localContent);
  }
}
