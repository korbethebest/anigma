import { Info } from "../types/types";
import { checkExtension, sortByCriteria } from "./utils";

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

const testList: Info[] = [
  {
    name: "anigma.txt",
    path: "",
    icon: "",
    size: 100,
    dateCreated: new Date(2024, 5, 3),
    dateModified: new Date(2024, 5, 3),
    extension: ".txt",
  },
  {
    name: "background-image.jpg",
    path: "",
    icon: "",
    size: 200,
    dateCreated: new Date(2024, 5, 1),
    dateModified: new Date(2024, 5, 5),
    extension: ".jpg",
  },
  {
    name: "sample.mp4",
    path: "",
    icon: "",
    size: 150,
    dateCreated: new Date(2024, 5, 4),
    dateModified: new Date(2024, 5, 4),
    extension: ".mp4",
  },
];

test("sortByCriteria 함수는 이름을 기준으로 오름차순으로 정렬되어야 합니다", () => {
  const sortedList = sortByCriteria(testList, "name");
  expect(sortedList.map((item) => item.name)).toEqual([
    "anigma.txt",
    "background-image.jpg",
    "sample.mp4",
  ]);
});

test("sortByCriteria 함수는 용량을 기준으로 오름차순으로 정렬되어야 합니다", () => {
  const sortedList = sortByCriteria(testList, "size");
  expect(sortedList.map((item) => item.size)).toEqual([100, 150, 200]);
});

test("sortByCriteria 함수는 생성 날짜를 기준으로 오름차순으로 정렬되어야 합니다", () => {
  const sortedList = sortByCriteria(testList, "dateCreated");
  expect(sortedList.map((item) => item.dateCreated)).toEqual([
    new Date(2024, 5, 1),
    new Date(2024, 5, 3),
    new Date(2024, 5, 4),
  ]);
});

test("sortByCriteria 함수는 수정 날짜를 기준으로 오름차순으로 정렬되어야 합니다", () => {
  const sortedList = sortByCriteria(testList, "dateModified");
  expect(sortedList.map((item) => item.dateModified)).toEqual([
    new Date(2024, 5, 3),
    new Date(2024, 5, 4),
    new Date(2024, 5, 5),
  ]);
});

test("sortByCriteria 함수는 확장자를 기준으로 오름차순으로 정렬되어야 합니다", () => {
  const sortedList = sortByCriteria(testList, "extension");
  expect(sortedList.map((item) => item.extension)).toEqual([
    ".jpg",
    ".mp4",
    ".txt",
  ]);
});
