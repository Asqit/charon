export const typeLookup: Record<
  string,
  { value: string; description: string }[]
> = {
  image: [
    {
      value: "png",
      description: "Lossless compression, supports transparency",
    },
    { value: "jpg", description: "Lossy compression, widely used for photos" },
    {
      value: "bmp",
      description: "Uncompressed, large file size, no transparency",
    },
    {
      value: "gif",
      description: "Lossless, supports animations but limited to 256 colors",
    },
    {
      value: "tiff",
      description: "Lossless, used for high-quality images (scanners, photos)",
    },
    {
      value: "webp",
      description: "Lossy and lossless, supports transparency, web-optimized",
    },
    {
      value: "pbm",
      description: "Portable Bitmap format, black and white image",
    },
    { value: "pgm", description: "Portable Graymap format, grayscale images" },
    {
      value: "ppm",
      description: "Portable Pixmap format, simple color image format",
    },
    {
      value: "sgi",
      description: "Silicon Graphics image format, used by SGI workstations",
    },
    {
      value: "tga",
      description: "Uncompressed format, often used for images in games",
    },
  ],

  video: [
    {
      value: "mp4",
      description: "Popular container for video, supports lossy compression",
    },
    {
      value: "mkv",
      description: "Flexible container, supports high-quality video and audio",
    },
    { value: "webm", description: "Open video format optimized for web use" },
    {
      value: "mov",
      description: "Apple’s video format, often used in macOS applications",
    },
    {
      value: "avi",
      description: "Older video container, less efficient compression",
    },
    {
      value: "flv",
      description: "Flash video format, often used in web streaming",
    },
    {
      value: "wmv",
      description: "Microsoft’s proprietary video format, used in Windows",
    },
    {
      value: "mpeg",
      description: "Common video format with lossy compression",
    },
    {
      value: "3gp",
      description: "Mobile video format, optimized for low file sizes",
    },
    {
      value: "ts",
      description: "Transport Stream, used for broadcast and streaming",
    },
  ],

  audio: [
    {
      value: "mp3",
      description: "Popular lossy audio format, balanced quality and file size",
    },
    {
      value: "aac",
      description:
        "Advanced Audio Coding, higher quality than MP3 at the same bitrate",
    },
    {
      value: "wav",
      description: "Uncompressed, high-quality audio format (large file size)",
    },
    {
      value: "flac",
      description: "Lossless compression, preserves audio quality",
    },
    {
      value: "ogg",
      description: "Open-source lossy audio format, often used for streaming",
    },
    {
      value: "m4a",
      description:
        "AAC audio in an MP4 container, high quality, often used for music",
    },
    {
      value: "opus",
      description: "Highly efficient codec for speech and music",
    },
    { value: "wma", description: "Microsoft’s proprietary audio format" },
    {
      value: "alac",
      description:
        "Apple Lossless Audio Codec, used in iTunes and Apple devices",
    },
    { value: "aiff", description: "Uncompressed audio format used by Apple" },
  ],
};
