import { Info, Criteria } from "../types/types";

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

export const sortByCriteria = (list: Info[], criteria: keyof Criteria) => {
  return list.sort((a, b) => {
    if (criteria === "name" || criteria === "extension") {
      return a[criteria].localeCompare(b[criteria], "ko-KR", {
        sensitivity: "base",
      });
    } else if (criteria === "size") {
      return a[criteria] - b[criteria];
    } else {
      return new Date(a[criteria]).getTime() - new Date(b[criteria]).getTime();
    }
  });
};
