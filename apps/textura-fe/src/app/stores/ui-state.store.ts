import {BehaviorSubject} from "rxjs";

export type UiStateMode = "move" | "draw";

class UiStateStore {
  public mode = new BehaviorSubject("draw");

  public zoom = new BehaviorSubject(1);
  public pan = new BehaviorSubject({x: 0, y: 0});

  public image = new BehaviorSubject<HTMLImageElement | null>(null);

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

  setPan(panUpdater: (previousPan: {x: number; y: number}) => {x: number; y: number}) {
    this.pan.next(panUpdater(this.pan.value));
  }

  getPan() {
    return this.pan.value;
  }

  setImage(image: HTMLImageElement) {
    this.image.next(image);
  }
}

export const uiStateStore = new UiStateStore();
