import {BehaviorSubject} from "rxjs";
import {Image} from "image-js";

export type UiStateMode = "move" | "draw";

class UiStateStore {
  public mode = new BehaviorSubject("draw");

  public zoom = new BehaviorSubject(1);
  public pan = new BehaviorSubject({x: 0, y: 0});

  public image = new BehaviorSubject<HTMLImageElement | null>(null);
  public imageMeta = new BehaviorSubject<{ resolution: string; colorSpace: string; bitDepth: number, imageFormat: string } | null>(null);

  setMode(mode: UiStateMode) {
    this.mode.next(mode);
    console.log("mode", mode);
  }

  setZoom(zoomUpdater: (previousZoom: number) => number) {
    const newZoom = zoomUpdater(this.zoom.value);

    if (newZoom < 0.1) return;

    this.zoom.next(newZoom);
  }

  getZoom() {
    return this.zoom.value;
  }

  setPan(panUpdater: (previousPan: { x: number; y: number }) => { x: number; y: number }) {
    this.pan.next(panUpdater(this.pan.value));
  }

  getPan() {
    return this.pan.value;
  }

  async setImage(image: HTMLImageElement) {
    this.image.next(image);

    const im = await Image.load(image.src);
    const resolution = `${im.width} x ${im.height}`;
    const colorSpace = im.colorModel;
    const bitDepth = im.bitDepth;

    const getImageFormat = (src: string) => {
      const match = src.match(/data:image\/(\w+);base64,/);

      if (match) {
        return match[1];
      }

      return 'unknown format';
    }

    const imageFormat = getImageFormat(image.src);

    const imageMeta = {
      resolution,
      colorSpace,
      bitDepth,
      imageFormat,
    };

    this.imageMeta.next(imageMeta);
  }
}

export const uiStateStore = new UiStateStore();
