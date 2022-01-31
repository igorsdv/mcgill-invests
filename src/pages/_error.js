import NextError from 'next/error';

export default class Error extends NextError {}

Error.getLayout = function getLayout(page) {
  return page;
};
