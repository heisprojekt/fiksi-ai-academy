/**
 * Helper to parse various video URLs (Google Drive, YouTube, Vimeo, Direct MP4)
 * and generate proper embed iframe / video player configurations.
 */

export interface ParsedVideo {
  type: 'gdrive' | 'youtube' | 'vimeo' | 'direct';
  embedUrl: string;
  isIframe: boolean;
}

export function parseVideoUrl(url: string = ''): ParsedVideo {
  if (!url) {
    return {
      type: 'direct',
      embedUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      isIframe: false
    };
  }

  const trimmed = url.trim();

  // 1. Google Drive Links
  // Handles:
  // - https://drive.google.com/file/d/1A2B3C4D5E/view?usp=sharing
  // - https://drive.google.com/file/d/1A2B3C4D5E/preview
  // - https://drive.google.com/open?id=1A2B3C4D5E
  // - https://drive.google.com/uc?id=1A2B3C4D5E
  if (trimmed.includes('drive.google.com')) {
    const fileIdMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || 
                        trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);

    if (fileIdMatch && fileIdMatch[1]) {
      return {
        type: 'gdrive',
        embedUrl: `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`,
        isIframe: true
      };
    }

    // Fallback replace /view with /preview
    return {
      type: 'gdrive',
      embedUrl: trimmed.replace(/\/view(\?.*)?$/, '/preview').replace(/\/edit(\?.*)?$/, '/preview'),
      isIframe: true
    };
  }

  // 2. YouTube Links
  // Handles:
  // - https://www.youtube.com/watch?v=dQw4w9WgXcQ
  // - https://youtu.be/dQw4w9WgXcQ
  // - https://www.youtube.com/embed/dQw4w9WgXcQ
  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([a-zA-Z0-9_-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return {
        type: 'youtube',
        embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
        isIframe: true
      };
    }
  }

  // 3. Vimeo Links
  if (trimmed.includes('vimeo.com')) {
    const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/);
    if (vimeoMatch && vimeoMatch[3]) {
      return {
        type: 'vimeo',
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=1`,
        isIframe: true
      };
    }
  }

  // 4. Direct MP4 / WebM / Generic Video URL
  return {
    type: 'direct',
    embedUrl: trimmed,
    isIframe: false
  };
}
