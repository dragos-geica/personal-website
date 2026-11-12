// The shape of the content files in this folder (put together in site.ts). You should not need to edit this file.

export interface ContentImage {
  /** Path under public/, e.g. '/images/airbox.jpg'. */
  src: string;
  /** A short description of the photo for screen readers. Without one, the item's title is used. */
  alt?: string;
}

export interface ContentLink {
  label: string;
  href: string;
}

export interface ContentItem {
  title: string;
  /** A short line under the heading, e.g. role, place and dates. */
  subtitle?: string;
  summary: string;
  image?: ContentImage;
  facts?: readonly { value: string; label: string }[];
  sections?: readonly { title: string; text: string }[];
  links?: readonly ContentLink[];
  /** Data, tools and methods used, shown as tags. Project tags become filters on the Projects page. */
  tags?: readonly string[];
  /** true keeps the item off the home graph; it still has its page and appears on listings. */
  hideFromGraph?: boolean;
  draft?: boolean;
}

export interface ContentCategory {
  label: string;
  verb: string;
  items: readonly ContentItem[];
}

export type CategoryId = 'experience' | 'projects' | 'interests';

export interface ContentPage {
  title: string;
  paragraphs: readonly string[];
  links?: readonly ContentLink[];
}

export interface CvEntry {
  /** Role, degree or award. */
  title: string;
  /** Organisation and place. */
  org?: string;
  dates?: string;
  points?: readonly string[];
  /** Optional link, e.g. to the matching project page ('/projects/airbox-bootcamp/'). */
  href?: string;
}

export interface CvPage {
  title: string;
  /** The name shown at the top of the CV. */
  name: string;
  sections: readonly { heading: string; entries: readonly CvEntry[] }[];
}

export interface EasterEgg {
  /** Shown large, in the same style as your name. */
  title: string;
  text: string;
  /** The line just above the email address. */
  invite: string;
  email: string;
}

export interface SiteContent {
  name: string;
  tagline: string;
  intro: string;
  portrait: ContentImage;
  easterEgg: EasterEgg;
  pages: { about: ContentPage; research: ContentPage; cv: CvPage };
  categories: Record<CategoryId, ContentCategory>;
}
