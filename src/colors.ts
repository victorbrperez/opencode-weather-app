// Respeta la convención NO_COLOR (https://no-color.org)
const enabled = !process.env.NO_COLOR;

function paint(code: number): (text: string) => string {
  return (text) => (enabled ? `\x1b[${code}m${text}\x1b[0m` : text);
}

export const cyan = paint(36);
export const yellow = paint(33);
export const green = paint(32);
export const red = paint(31);
