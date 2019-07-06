export default interface PostFormValues {
  title: string;
  text?: string;
  linkUrl?: string;
  image?: string;
  type: 'text' | 'image' | 'link';
}
