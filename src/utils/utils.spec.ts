import { checkExtension, sortByCriteria, testFileList } from "./utils";

it("checkExtension 함수는 유효한 파일 확장자에 대해 올바른 파일 유형을 반환해야 합니다", () => {
  expect(checkExtension("image.png")).toBe("image");
  expect(checkExtension("image.jpg")).toBe("image");
  expect(checkExtension("image.jpeg")).toBe("image");
  expect(checkExtension("image.gif")).toBe("image");
  expect(checkExtension("image.webp")).toBe("image");

  expect(checkExtension("video.mp4")).toBe("video");
  expect(checkExtension("video.webm")).toBe("video");

  expect(checkExtension("audio.mp3")).toBe("audio");
  expect(checkExtension("audio.wav")).toBe("audio");

  expect(checkExtension("text.txt")).toBe("text");
});

it("checkExtension 함수는 잘못된 파일 확장자에 대해 null을 반환해야 합니다", () => {
  expect(checkExtension("unknown")).toBe(null);
  expect(checkExtension("file.unknown")).toBe(null);
});

it("sortByCriteria 함수는 이름을 기준으로 오름차순으로 정렬되어야 합니다", () => {
  const sortedList = sortByCriteria(testFileList, "name");
  expect(sortedList.map((item) => item.name)).toEqual([
    "anigma.txt",
    "background.jpg",
    "music.mp3",
  ]);
});

it("sortByCriteria 함수는 용량을 기준으로 오름차순으로 정렬되어야 합니다", () => {
  const sortedList = sortByCriteria(testFileList, "size");
  expect(sortedList.map((item) => item.size)).toEqual([100, 150, 200]);
});

it("sortByCriteria 함수는 생성 날짜를 기준으로 오름차순으로 정렬되어야 합니다", () => {
  const sortedList = sortByCriteria(testFileList, "dateCreated");
  expect(sortedList.map((item) => item.dateCreated)).toEqual([
    new Date(2024, 5, 2),
    new Date(2024, 5, 3),
    new Date(2024, 5, 4),
  ]);
});

it("sortByCriteria 함수는 수정 날짜를 기준으로 오름차순으로 정렬되어야 합니다", () => {
  const sortedList = sortByCriteria(testFileList, "dateModified");
  expect(sortedList.map((item) => item.dateModified)).toEqual([
    new Date(2024, 5, 4),
    new Date(2024, 5, 5),
    new Date(2024, 5, 6),
  ]);
});

it("sortByCriteria 함수는 확장자를 기준으로 오름차순으로 정렬되어야 합니다", () => {
  const sortedList = sortByCriteria(testFileList, "extension");
  expect(sortedList.map((item) => item.extension)).toEqual([
    ".jpg",
    ".mp3",
    ".txt",
  ]);
});
