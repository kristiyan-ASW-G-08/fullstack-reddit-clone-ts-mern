import url from 'url';
const getUrl = (protocol: string, host: string | undefined): string =>
  url.format({
    protocol,
    host,
  });

export default getUrl;
