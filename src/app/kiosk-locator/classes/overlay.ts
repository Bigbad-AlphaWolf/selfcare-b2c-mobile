// export const createHTMLMapMarker = (
//   coords: google.maps.LatLng,
//   map,
//   html,
//   index?: number
// ) => {
//   class HTMLMapMarker extends google.maps.OverlayView {
//     public latlng: google.maps.LatLng;
//     public html: string;
//     public div: HTMLElement;

//     constructor(args?: {
//       latlng?: google.maps.LatLng;
//       html?: string;
//       map?: google.maps.Map;
//     }) {
//       super();
//       this.latlng = args.latlng;
//       this.html = args.html;
//       this.setMap(args.map);
//     }

//     draw() {
//       if (!this.div) {
//         this.createDiv();
//         this.appendDivToOverlay();
//       }
//       this.positionDiv();
//     }

//     remove() {
//       if (this.div) {
//         this.div.parentNode.removeChild(this.div);
//         this.div = null;
//       }
//     }

//     hide() {
//       if (this.div) {
//         this.div.style.visibility = 'hidden';
//       }
//     }

//     show() {
//       if (this.div) {
//         this.div.style.visibility = 'visible';
//       }
//     }

//     createDiv() {
//       this.div = document.createElement('div');
//       this.div.style.position = 'absolute';
//       this.div.style.zIndex = '10000';
//       if (this.html) {
//         this.div.innerHTML = this.html;
//       }
//       google.maps.event.addDomListener(this.div, 'click', (event) => {
//         google.maps.event.trigger(this, 'click');
//       });
//     }

//     removeClassCurrent() {
//       this.div.classList.remove('custom-marker-focused');
//     }

//     setClassCurrent() {
//       this.div.classList.add('custom-marker-focused');
//     }

//     appendDivToOverlay() {
//       const panes = this.getPanes().overlayMouseTarget;
//       panes.appendChild(this.div);
//     }

//     positionDiv() {
//       const point = this.getProjection().fromLatLngToDivPixel(this.latlng);
//       if (point) {
//         this.div.style.left = `${point.x - 17}px`;
//         if (html) {
//           this.div.style.top = `${point.y - 23.5}px`;
//           return;
//         }
//         this.div.style.top = `${point.y - 42}px`;
//       }
//     }
//   }
//   return new HTMLMapMarker({
//     latlng: coords,
//     map,
//     html: html
//       ? html
//       : `<div class="custom-marker"><div class="circle">${index}</div><div class="arrow-down"></div></div>`,
//   });
// };

// export default createHTMLMapMarker;
