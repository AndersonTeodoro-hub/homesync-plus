export function playSound(name: string) {
  const audio = new Audio(`/sounds/${name}.mp3`);
  audio.volume = 0.7; // volume padrão (ajustável)
  audio.play().catch(() => {});
}

export const SyncSounds = {
  activate: () => playSound("activate"),
  sleep: () => playSound("sleep"),
  success: () => playSound("success"),
  error: () => playSound("error"),
  notification: () => playSound("notification"),
  message: () => playSound("message"),
};
