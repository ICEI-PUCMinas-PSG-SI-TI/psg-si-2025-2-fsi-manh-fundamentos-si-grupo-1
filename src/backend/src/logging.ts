import chalk from "chalk";
import type { NextFunction, Request, Response } from "express";

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

function colorLogLevel(level: LogLevel) {
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

function log(
  messsage: string,
  level: LogLevel,
  opts?: { excludeTimestamp?: boolean; label?: string }
) {
  let messageArray: string[] = [];
  opts?.excludeTimestamp ? "" : messageArray.push(new Date().toISOString());
  messageArray.push(colorLogLevel(level));
  opts?.label?.length ? messageArray.push(`[${opts.label}]`) : undefined;
  messageArray.push(messsage);
  const finalMessage = messageArray.join(" ");
  console.log(finalMessage);
}

export function info(
  messsage: string,
  opts?: { excludeTimestamp?: boolean; label?: string }
) {
  log(messsage, LogLevel.Informational, opts);
}

export function debug(
  messsage: string,
  opts?: { excludeTimestamp?: boolean; label?: string }
) {
  log(messsage, LogLevel.Debug, opts);
}

export function error(
  messsage: string,
  opts?: { excludeTimestamp?: boolean; label?: string }
) {
  log(messsage, LogLevel.Error, opts);
}

export function json(
  message: {},
  level: LogLevel,
  opts?: { excludeTimestamp?: boolean; label?: string }
) {
  const stringMessage = JSON.stringify(message, null, 2);
  log(stringMessage, level, opts);
}

export function middlewareHTTP(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const startTime = Date.now();
  // :date[iso] :remote-addr :method :url :status :response-time ms
  const remote_addr = req.ip;
  const method = req.method;
  const url = req.url;
  // const httpVersion = req.httpVersion;
  // const userAgent = req.get("User-Agent");
  // const body = req.body;
  res.on("finish", () => {
    const finishTime = Date.now();
    const status = res.statusCode;
    const totalTime = finishTime - startTime;
    let logging = [
      chalk.blue(remote_addr),
      chalk.yellow(method),
      chalk.yellow(url),
      colorStatusCode(status),
      `${totalTime} ms`,
    ];
    info(logging.join(" "), { label: "HTTP" });
    // debug(`HTTP/${httpVersion} ${userAgent}`, { label: "HTTP" });
    // json(body, LogLevel.Debug);
  });
  next();
}
