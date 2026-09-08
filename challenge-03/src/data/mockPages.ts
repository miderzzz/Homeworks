export interface VisitedPage {
  url: string;
  title: string;
}

export const mockPages: VisitedPage[] = [
  { url: 'https://google.com', title: 'Google' },
  { url: 'https://github.com', title: 'GitHub' },
  { url: 'https://stackoverflow.com', title: 'Stack Overflow' },
  { url: 'https://developer.mozilla.org', title: 'MDN Web Docs' },
];