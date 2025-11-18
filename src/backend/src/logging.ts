import chalk from "chalk";
import type { NextFunction, Response } from "express";
import type { ExtendedRequest } from "./middlewares";

const locale = process.env.LOCALE || "iso";

// RFC 5424
export enum LogLevel {
  Emergency,
  Alert,
  Critical,
  Error,
  Warning,
  Notice,
  Informational,
  Debug,
}

let logLevel = LogLevel.Informational;

export function setLogLevel(level: LogLevel): void {
  logLevel = level;
}

function colorStatusCode(statusCode: number): string {
  let text;
  if (statusCode >= 600) text = `${statusCode}`;
  else if (statusCode >= 500) text = chalk.redBright(statusCode);
  else if (statusCode >= 400) text = chalk.red(statusCode);
  else if (statusCode >= 300) text = chalk.yellow(statusCode);
  else if (statusCode >= 200) text = chalk.green(statusCode);
  else if (statusCode >= 100) text = chalk.blue(statusCode);
  else text = `${statusCode}`;
  return text;
}

function colorLogLevel(level: LogLevel): string {
  let text;
  switch (level) {
    case LogLevel.Emergency:
      text = chalk.redBright("emerg");
      break;
    case LogLevel.Alert:
      text = chalk.redBright.bold("alert");
      break;
    case LogLevel.Critical:
      text = chalk.red("crit");
      break;
    case LogLevel.Error:
      text = chalk.red.bold("error");
      break;
    case LogLevel.Warning:
      text = chalk.yellow("warning");
      break;
    case LogLevel.Notice:
      text = chalk.green("notice");
      break;
    case LogLevel.Informational:
      text = chalk.blue("info");
      break;
    case LogLevel.Debug:
      text = chalk.magenta("debug");
      break;
    default:
      text = "*";
  }
  return text;
}

export type LogOpts = {
  excludeTimestamp?: boolean;
  label?: string;
  reqId?: string;
};

function log(messsage: string, level: LogLevel, opts?: LogOpts): void {
  if (level > logLevel) return;
  const messageArray: string[] = [];
  if (!opts?.excludeTimestamp)
    messageArray.push(
      new Date().toLocaleString(locale, {
        hour12: false,
        year: "2-digit",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        fractionalSecondDigits: 3,
      }),
    );
  messageArray.push(colorLogLevel(level));
  if (opts?.label?.length) messageArray.push(`[${opts.label}]`);
  if (opts?.reqId?.length) messageArray.push(`{${opts.reqId}}`);
  messageArray.push(messsage);
  const finalMessage = messageArray.join(" ");
  console.info(finalMessage);
}

export function error(messsage: string, opts?: LogOpts | object): void {
  log(messsage, LogLevel.Error, opts);
}

export function warning(messsage: string, opts?: LogOpts | object): void {
  log(messsage, LogLevel.Warning, opts);
}

export function notice(messsage: string, opts?: LogOpts | object): void {
  log(messsage, LogLevel.Notice, opts);
}

export function info(messsage: string, opts?: LogOpts | object): void {
  log(messsage, LogLevel.Informational, opts);
}

export function debug(messsage: string, opts?: LogOpts | object): void {
  log(messsage, LogLevel.Debug, opts);
}

export function json(
  message: object,
  level: LogLevel,
  opts?: LogOpts | object,
): void {
  const stringMessage = JSON.stringify(message, null, 2);
  log(stringMessage, level, opts);
}

export function middlewareHTTP(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): void {
  const startTime = Date.now();
  // :date[iso] :remote-addr :method :url :status :response-time ms
  const remoteAddr = req.ip;
  const method = req.method;
  const url = req.url;
  // const httpVersion = req.httpVersion;
  // const userAgent = req.get("User-Agent");
  // const body = req.body;
  res.on("finish", () => {
    const finishTime = Date.now();
    const status = res.statusCode;
    const totalTime = finishTime - startTime;
    const logging = [
      chalk.blue(remoteAddr),
      chalk.yellow(method),
      chalk.yellow(url),
      colorStatusCode(status),
      `${totalTime} ms`,
    ];
    info(logging.join(" "), {
      label: "HTTP",
      reqId: req._requestId,
    });
    // debug(`HTTP/${httpVersion} ${userAgent}`, { label: "HTTP" });
    // json(body, LogLevel.Debug);
  });
  next();
}
