interface IRequest {
  resource: null | string;
  id: null | string;
  verb: null | string;
}
export const route = {
  parseRequestURL: () => {
    const url = location.hash.slice(1).toLowerCase() || '/';

    const r = url.split('/');

    const request: IRequest = {
      resource: null,
      id: null,
      verb: null,
    };

    request.resource = r[1];
    request.id = r[2];
    request.verb = r[3];

    return request;
  },

  sleep: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),
};

export default route;
