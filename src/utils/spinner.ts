const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export async function withSpinner<T>(message: string, task: Promise<T>): Promise<T> {
  let frame = 0;
  const timer = setInterval(() => {
    process.stdout.write(`\r${FRAMES[frame] ?? FRAMES[0]} ${message}`);
    frame = (frame + 1) % FRAMES.length;
  }, 80);

  try {
    return await task;
  } finally {
    clearInterval(timer);
    process.stdout.write("\r\x1b[K");
  }
}
