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

export const testFileList: Info[] = [
  {
    name: "anigma.txt",
    path: "/Documents/anigma.txt",
    icon: "",
    size: 100,
    dateCreated: new Date(2024, 5, 2),
    dateModified: new Date(2024, 5, 6),
    extension: ".txt",
  },
  {
    name: "background.jpg",
    path: "/Documents/background.jpg",
    icon: "",
    size: 200,
    dateCreated: new Date(2024, 5, 3),
    dateModified: new Date(2024, 5, 5),
    extension: ".jpg",
  },
  {
    name: "music.mp3",
    path: "/Documents/music.mp3",
    icon: "",
    size: 150,
    dateCreated: new Date(2024, 5, 4),
    dateModified: new Date(2024, 5, 4),
    extension: ".mp3",
  },
];

export const testDirectoryList: Info[] = [
  {
    name: "Subdir1",
    path: "/Documents/Subdir1",
    icon: "",
    size: 400,
    dateCreated: new Date(2024, 5, 4),
    dateModified: new Date(2024, 5, 7),
    extension: "",
  },
  {
    name: "Subdir2",
    path: "/Documents/Subdir2",
    icon: "",
    size: 300,
    dateCreated: new Date(2024, 5, 5),
    dateModified: new Date(2024, 5, 5),
    extension: "",
  },
];
