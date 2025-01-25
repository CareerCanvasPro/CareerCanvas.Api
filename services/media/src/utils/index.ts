export function getContentType(extension: string): string {
  switch (extension) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".heic":
      return "image/heic";
    case ".pdf":
      return "application/pdf";
    // Add more cases for other file formats if needed
    default:
      throw new Error("Unsupported file format");
  }
}
