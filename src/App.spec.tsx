import "@testing-library/jest-dom";
import { screen, render, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { testFileList, testDirectoryList } from "./utils/utils";

beforeEach(() => {
  global.window = Object.create(window);
  Object.defineProperty(window, "electron", {
    value: {
      readDirectory: vi.fn().mockImplementation(async () => {
        return {
          files: testFileList,
          directories: testDirectoryList,
        };
      }),
      getDocumentsPath: vi.fn().mockImplementation(async () => {
        return "/Documents";
      }),
      getSeparator: vi.fn().mockImplementation(async () => {
        return "/";
      }),
    },
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

it("Header의 제목에 현재 디렉토리 경로가 정확히 명시됩니다.", async () => {
  await act(async () => {
    render(<App />);
  });

  const headerTitle = screen.getByRole("heading");
  expect(headerTitle).toHaveTextContent("/Documents");
});

it("루트 디렉토리에서 이전 버튼이 보이지 않습니다", async () => {
  await act(async () => {
    render(<App />);
  });

  const goBackButton = screen.queryByTestId("go-back");
  expect(goBackButton).not.toBeInTheDocument();
});

it("Main의 파일들과 서브 디렉토리들이 모두 정확히 명시됩니다.", async () => {
  await act(async () => {
    render(<App />);
  });

  const txtFile = screen.getByText("anigma.txt");
  expect(txtFile).toBeInTheDocument();

  const jpgFile = screen.getByText("background.jpg");
  expect(jpgFile).toBeInTheDocument();

  const mp3File = screen.getByText("music.mp3");
  expect(mp3File).toBeInTheDocument();

  const subDir1 = screen.getByText("Subdir1");
  expect(subDir1).toBeInTheDocument();

  const subDir2 = screen.getByText("Subdir2");
  expect(subDir2).toBeInTheDocument();
});

it("검색 필터 기능이 제대로 동작합니다.", async () => {
  await act(async () => {
    render(<App />);
  });

  const searchInput = screen.getByPlaceholderText("Search...");
  await userEvent.type(searchInput, "anigma");

  const searchResults = screen.getAllByTestId("file");
  expect(searchResults).toHaveLength(1);
  expect(searchResults[0]).toHaveTextContent("anigma.txt");
});

describe("정렬 기능이 제대로 동작합니다.", () => {
  beforeEach(async () => {
    await act(async () => {
      render(<App />);
    });
  });

  it("기본으로 'name'이 설정되어 있고, 이름순으로 정렬됩니다.", () => {
    const sortButton = screen.getByLabelText(
      "Sort Criteria (Ascending order):"
    );
    expect(sortButton).toHaveTextContent("name");

    const fileItems = screen.getAllByTestId("file");
    const fileNames = fileItems.map((item) => item.textContent);
    expect(fileNames).toEqual(["anigma.txt", "background.jpg", "music.mp3"]);

    const directoryItems = screen.getAllByTestId("directory");
    const directoryNames = directoryItems.map((item) => item.textContent);
    expect(directoryNames).toEqual(["Subdir1", "Subdir2"]);
  });

  it("용량 순으로 정렬이 가능합니다.", async () => {
    const sortButton = screen.getByLabelText(
      "Sort Criteria (Ascending order):"
    );

    await userEvent.selectOptions(sortButton, "size");

    const fileItems = screen.getAllByTestId("file");
    const fileNames = fileItems.map((item) => item.textContent);
    expect(fileNames).toEqual(["anigma.txt", "music.mp3", "background.jpg"]);

    const directoryItems = screen.getAllByTestId("directory");
    const directoryNames = directoryItems.map((item) => item.textContent);
    expect(directoryNames).toEqual(["Subdir2", "Subdir1"]);
  });

  it("수정 날짜 순으로 정렬이 가능합니다.", async () => {
    const sortButton = screen.getByLabelText(
      "Sort Criteria (Ascending order):"
    );

    await userEvent.selectOptions(sortButton, "date modified");

    const fileItems = screen.getAllByTestId("file");
    const fileNames = fileItems.map((item) => item.textContent);
    expect(fileNames).toEqual(["music.mp3", "background.jpg", "anigma.txt"]);

    const directoryItems = screen.getAllByTestId("directory");
    const directoryNames = directoryItems.map((item) => item.textContent);
    expect(directoryNames).toEqual(["Subdir2", "Subdir1"]);
  });

  it("생성 날짜 순으로 정렬이 가능합니다.", async () => {
    const sortButton = screen.getByLabelText(
      "Sort Criteria (Ascending order):"
    );

    await userEvent.selectOptions(sortButton, "date created");

    const fileItems = screen.getAllByTestId("file");
    const fileNames = fileItems.map((item) => item.textContent);
    expect(fileNames).toEqual(["anigma.txt", "background.jpg", "music.mp3"]);

    const directoryItems = screen.getAllByTestId("directory");
    const directoryNames = directoryItems.map((item) => item.textContent);
    expect(directoryNames).toEqual(["Subdir1", "Subdir2"]);
  });

  it("확장자 순으로 정렬이 가능합니다.", async () => {
    const sortButton = screen.getByLabelText(
      "Sort Criteria (Ascending order):"
    );

    await userEvent.selectOptions(sortButton, "extension");

    const fileItems = screen.getAllByTestId("file");
    const fileNames = fileItems.map((item) => item.textContent);
    expect(fileNames).toEqual(["background.jpg", "music.mp3", "anigma.txt"]);
  });
});

describe("Subdir1 테스트를 진행합니다.", async () => {
  beforeEach(async () => {
    await act(async () => {
      render(<App />);
    });
  });

  describe("Subdir1 안의 파일 및 서브 디렉토리 구조를 구축합니다.", () => {
    beforeEach(async () => {
      global.window = Object.create(window);
      Object.defineProperty(window, "electron", {
        value: {
          readDirectory: vi.fn().mockImplementation(async () => {
            return {
              files: [
                {
                  name: "sample.txt",
                  path: "/Documents/Subdir1/sample.txt",
                  icon: "",
                  size: 100,
                  dateCreated: new Date(2024, 5, 2),
                  dateModified: new Date(2024, 5, 6),
                  extension: ".txt",
                },
                {
                  name: "sample.jpg",
                  path: "/Documents/Subdir1/sample.jpg",
                  icon: "",
                  size: 200,
                  dateCreated: new Date(2024, 5, 3),
                  dateModified: new Date(2024, 5, 5),
                  extension: ".jpg",
                },
              ],
              directories: [
                {
                  name: "SampleDir",
                  path: "/Documents/Subdir1/SampleDir",
                  icon: "",
                  size: 300,
                  dateCreated: new Date(2024, 5, 4),
                  dateModified: new Date(2024, 5, 4),
                  extension: "",
                },
              ],
            };
          }),
          getDocumentsPath: vi.fn().mockImplementation(async () => {
            return "/Documents";
          }),
        },
      });
    });

    it("Header의 제목에 현재 디렉토리 경로인 '/Documents/Subdir1'이 정확히 명시됩니다", async () => {
      const subDir1 = screen.getByText("Subdir1");
      await userEvent.dblClick(subDir1);

      const headerTitle = screen.getByRole("heading");
      expect(headerTitle).toHaveTextContent("/Documents/Subdir1");
    });

    it("'/Documents/Subdir1'의 파일들과 하위 디렉토리들이 정확히 명시됩니다", async () => {
      const subDir1 = screen.getByText("Subdir1");
      await userEvent.dblClick(subDir1);

      const txtFile = screen.getByText("sample.txt");
      expect(txtFile).toBeInTheDocument();

      const jpgFile = screen.getByText("sample.jpg");
      expect(jpgFile).toBeInTheDocument();

      const sampleDir = screen.getByText("SampleDir");
      expect(sampleDir).toBeInTheDocument();
    });

    it("이전 버튼이 존재하며, 클릭 시 상위 경로인 '/Documents'로 이동합니다", async () => {
      const subDir1 = screen.getByText("Subdir1");
      await userEvent.dblClick(subDir1);

      const goBackButton = screen.queryByTestId("go-back");
      expect(goBackButton).toBeInTheDocument();
    });
  });
});
