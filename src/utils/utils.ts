export const checkExtension = (filePath: string) => {
  const readableExtensions = {
    image: [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    video: [".mp4", ".webm"],
    audio: [".mp3", ".wav"],
    text: [".txt"],
  };

  for (const [type, extensions] of Object.entries(readableExtensions)) {
    if (extensions.some((ext) => filePath.endsWith(ext))) {
      return type;
    }
  }

  return null;
};
