import { UserSign } from '@/model/dto/sign.dto';
import { PDFDocument } from 'pdf-lib';
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
export const attachFileSignToDocument = async (
  pathDocument: string,
  file: UserSign[],
) => {
  const existingPdfBytes = await fetch(pathDocument).then((res) =>
    res.arrayBuffer(),
  );

  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  await file.forEach(async (item) => {
    const signImage = await pdfDoc.embedPng(item.signature.buffer);
    const numberPage = item.number_page;
    const currentPage = pdfDoc.getPages()[numberPage - 1];
    await currentPage.drawImage(signImage, {
      x: parseFloat(`${(item.x * 3) / 4}`),
      y:
        currentPage.getSize().height -
        parseFloat(`${(item.y * 3) / 4}`) -
        (item.height * 3) / 4,
      width: parseFloat(`${(item.width * 3) / 4}`),
      height: parseFloat(`${(item.height * 3) / 4}`),
    });
  });

  const pdfBytes = await pdfDoc.save();

  return pdfBytes;
};
