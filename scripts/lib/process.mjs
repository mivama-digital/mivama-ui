import { execFile } from "node:child_process"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)
const defaultMaxBuffer = 16 * 1024 * 1024

export async function runCommand(
  command,
  args,
  { cwd, env = {}, maxBuffer = defaultMaxBuffer, echo = true } = {}
) {
  try {
    const result = await execFileAsync(command, args, {
      cwd,
      env: { ...process.env, ...env },
      encoding: "utf8",
      maxBuffer,
    })

    if (echo && result.stdout) process.stdout.write(result.stdout)
    if (echo && result.stderr) process.stderr.write(result.stderr)

    return result
  } catch (error) {
    if (error.stdout) process.stdout.write(error.stdout)
    if (error.stderr) process.stderr.write(error.stderr)
    throw error
  }
}

export function runNpm(args, options) {
  return runCommand("npm", args, options)
}
