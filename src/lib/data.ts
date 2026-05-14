import quotesYaml from '../data/quotes.yml';
import researchYaml from '../data/research.yml';
import siteYaml from '../data/site.yml';

export type SocialLinks = {
  github?: string;
  twitter?: string;
  email?: string;
};

export type SiteData = {
  name: string;
  role: string;
  location: string;
  avatar: string;
  research_oneliner: string;
  socials: SocialLinks;
  comments?: {
    giscus?: {
      repo: string;
      repo_id: string;
      category: string;
      category_id: string;
      mapping?: string;
      strict?: string;
      reactions_enabled?: string;
      emit_metadata?: string;
      input_position?: string;
      theme?: string;
      lang?: string;
      loading?: string;
    };
  };
  tiles: {
    github: boolean;
    marginalia: boolean;
    weather: boolean;
  };
};

export type ResearchData = {
  focus: string;
  abstract: string;
  tags: string[];
  updated: string;
  stale_after_days: number;
};

export type QuoteData = {
  text: string;
  source: string;
  work?: string;
  year?: number;
};

export const site = siteYaml as SiteData;
export const research = researchYaml as ResearchData;
export const quotes = quotesYaml as QuoteData[];
