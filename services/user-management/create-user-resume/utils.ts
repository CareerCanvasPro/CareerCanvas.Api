export const checkContentTypeValidity = ({
  contentType,
}: {
  contentType: string;
}): { isContentTypeValid: boolean } => {
  const validContentTypes = [
    "application/pdf",
    "image/heic",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  return { isContentTypeValid: validContentTypes.includes(contentType) };
};
