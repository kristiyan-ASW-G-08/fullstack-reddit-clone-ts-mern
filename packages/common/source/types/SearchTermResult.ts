interface SearchTermResult {
  data: {
    name: string;
    subscribers: number;
    _id: string;
  };
  links: {
    [key: string]: string;
  };
}
export default SearchTermResult;
