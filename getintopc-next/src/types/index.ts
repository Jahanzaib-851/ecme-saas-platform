export interface Software {
  slug: string;
  title: string;
  description: string;
  category: string;
  size: string;
  os: string;
  date: string;
  views: number;
  image: string;
  version?: string;
  developer?: string;
}

export interface Vlog {
  slug: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  date: string;
  views: number;
  thumbnail: string;
}
