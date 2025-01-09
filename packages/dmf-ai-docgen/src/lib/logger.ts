import chalk from "chalk";

chalk.level = 2;

export const logInfo = (msg: string, ...params: string[]) => {
  console.log(chalk.blue("[ DreamMF - AI Doc Gen ] - ", msg), ...params);
};

export const logWarning = (msg: string, ...params: string[]) => {
  console.warn(chalk.yellow("[ DreamMF - AI Doc Gen ] - ", msg), ...params);
};

export const logError = (msg: string, error?: Error, ...params: string[]) => {
  console.error(
    chalk.red("[ DreamMF - AI Doc Gen ] - ", msg),
    error?.message,
    ...params,
  );
};
