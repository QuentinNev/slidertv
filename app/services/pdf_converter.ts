import { pdf } from 'pdf-to-img'
import fs from 'fs/promises'
import path from 'path'

export async function convertPdfToImage(pdfPath: string, outputPath: string): Promise<void> {
  // Converts PDF to image format for TV display; TVs render static images more reliably than PDF viewers
  const doc = await pdf(pdfPath)
  // Extracts only the first page (index 1) since TV slides are single-screen content (no multi-page PDFs)
  const imageBuffer = await doc.getPage(1)
  const outputDir = path.dirname(outputPath)
  // Creates output directory if it doesn't exist to avoid write errors
  await fs.mkdir(outputDir, { recursive: true })
  await fs.writeFile(outputPath, imageBuffer)
}
