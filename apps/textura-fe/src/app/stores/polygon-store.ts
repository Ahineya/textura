// polygonStore.ts
import {BehaviorSubject} from 'rxjs';

export type Point = { x: number; y: number };

export type Polygon = {
  id: string;
  points: [Point, Point, Point, Point];
};

class PolygonStore {
  private static instance: PolygonStore;

  polygons$ = new BehaviorSubject<Polygon[]>([]);

  static getInstance(): PolygonStore {
    if (!PolygonStore.instance) {
      PolygonStore.instance = new PolygonStore();
    }
    return PolygonStore.instance;
  }

  addPolygon(polygon: Polygon) {
    this.polygons$.next([...this.polygons$.value, polygon]);
  }

  updatePolygon(newPolygon: Polygon) {
    const polygons = this.polygons$.value;
    const index = polygons.findIndex((polygon) => polygon.id === newPolygon.id);
    if (index === -1) return;

    polygons[index] = newPolygon;
    this.polygons$.next(JSON.parse(JSON.stringify(polygons)));
  }

  redrawPolygons() {
    this.polygons$.next(JSON.parse(JSON.stringify(this.polygons$.value)));
  }
}

export default PolygonStore.getInstance();
