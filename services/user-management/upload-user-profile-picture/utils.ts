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

export const getUrl = ({ key }: { key: string }): { url: string } => {
  const url = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return { url };
};
