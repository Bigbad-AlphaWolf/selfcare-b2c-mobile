import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "distanceFormat",
})
export class DistanceFormatPipe implements PipeTransform {
  // takes distance in meters as input
  transform(dist: string): any {
    let distance = +dist;
    if (distance < 1201) {
      return `${distance} m`;
    } else {
      return `${distance / 1000} km`;
    }
    return null;
  }
}
