import { pdf } from 'pdf-to-img'
import fs from 'fs/promises'
import path from 'path'

export async function convertPdfToImage(pdfPath: string, outputPath: string): Promise<void> {
  const doc = await pdf(pdfPath)
  const imageBuffer = await doc.getPage(1)
  const outputDir = path.dirname(outputPath)
  await fs.mkdir(outputDir, { recursive: true })
  await fs.writeFile(outputPath, imageBuffer)
}
