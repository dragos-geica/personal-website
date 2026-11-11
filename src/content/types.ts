// The shape of src/content/site.ts. You should not need to edit this file.

export interface ContentImage {
  /** Path under public/, e.g. '/images/airbox.jpg'. */
  src: string;
  /** A short description of the photo for screen readers. */
  alt: string;
}

export interface ContentItem {
  title: string;
  summary: string;
  image?: ContentImage;
  facts?: readonly { value: string; label: string }[];
  sections?: readonly { title: string; text: string }[];
  links?: readonly { label: string; href: string }[];
  draft?: boolean;
}

export interface ContentCategory {
  label: string;
  verb: string;
  items: readonly ContentItem[];
}

export type CategoryId =
  | 'academics' | 'research' | 'projects' | 'data-tools' | 'music' | 'reading' | 'travel' | 'interests';

export interface ContentPage {
  title: string;
  paragraphs: readonly string[];
}

export interface SiteContent {
  name: string;
  tagline: string;
  intro: string;
  portrait: ContentImage;
  pages: { about: ContentPage; research: ContentPage; cv: ContentPage };
  categories: Record<CategoryId, ContentCategory>;
}
