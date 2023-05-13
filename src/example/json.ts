import { RequestHandler, HttpMethod, DebugLevel } from "../index";

const handler = new RequestHandler({
  url: "https://jsonplaceholder.typicode.com/todos/",
  headers: {
    "Content-Type": "application/json",
  },
  mode: HttpMethod.GET, // the http mode
  debug: DebugLevel.HARD, // the debug level (soft = only one log, medium = all logs, hard = all logs + all responses and more infos)
  responseType: "json", // the response type that might needs to be converted if the response isnt the same
  maxContentLength: 100_000,
  timeout: 10_000, // the timeout in ms
  maxBodyLength: 10_000,
  validateStatus: (status: number) => status >= 200 && status < 400,
  withCredentials: true, // if you want to send cookies
});

// Send the request and log the response
handler
  .sendRequest()
  .then((response: any) => {
    console.log(response.data);
  })
  .catch((error: any) => {
    console.error(error.message);
  });
