export interface ExtractedFrame {
  data: string;
  mediaType: string;
  timestamp: number;
}

export function extractFramesFromVideo(
  videoFile: File,
  maxFrames: number = 4
): Promise<ExtractedFrame[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Canvas 2D context not available"));
      return;
    }

    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;

    const url = URL.createObjectURL(videoFile);
    video.src = url;

    video.onloadedmetadata = () => {
      const duration = video.duration;
      const timestamps: number[] = [];

      if (duration <= 1) {
        timestamps.push(0);
      } else {
        for (let i = 0; i < maxFrames; i++) {
          timestamps.push((duration * i) / maxFrames);
        }
      }

      const frames: ExtractedFrame[] = [];
      let currentIndex = 0;

      const captureFrame = () => {
        if (currentIndex >= timestamps.length) {
          URL.revokeObjectURL(url);
          resolve(frames);
          return;
        }

        video.currentTime = timestamps[currentIndex];
      };

      video.onseeked = () => {
        canvas.width = Math.min(video.videoWidth, 1024);
        canvas.height = Math.min(
          video.videoHeight,
          (1024 * video.videoHeight) / video.videoWidth
        );
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, "");

        frames.push({
          data: base64Data,
          mediaType: "image/jpeg",
          timestamp: timestamps[currentIndex],
        });

        currentIndex++;
        captureFrame();
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("動画の読み込みに失敗しました"));
      };

      captureFrame();
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("動画の読み込みに失敗しました"));
    };
  });
}
