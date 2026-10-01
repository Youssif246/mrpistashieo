export interface ArticleContentBlock {
  type: 'paragraph' | 'heading' | 'image' | 'list';
  text?: string;
  src?: string;
  alt?: string;
  items?: string[];
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  coverImage: string;
  seo: {
    title: string;
    description: string;
  };
  content: ArticleContentBlock[];
}
