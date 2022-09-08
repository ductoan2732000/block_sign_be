export const getFileNameFromDirectoryPath = (directoryPath: string) => {
  const pathFile = directoryPath.replace(/\\/g, '/');
  const arrayPath = pathFile.split('/');
  const fullFileName = arrayPath[arrayPath.length - 1];
  const fileName = fullFileName.split('.')[0];
  return {
    fullFileName: fullFileName,
    fileName: fileName,
  } as { fullFileName: string; fileName: string };
};
