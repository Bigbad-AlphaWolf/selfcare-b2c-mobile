import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  CategoryOffreServiceModel,
  OffreService,
} from '../models/offre-service.model';
import { OperationService } from '../services/oem-operation/operation.service';

@Component({
  selector: 'app-new-services',
  templateUrl: './new-services.page.html',
  styleUrls: ['./new-services.page.scss'],
})
export class NewServicesPage implements OnInit {
  @ViewChild('slides') sliders: IonSlides;
  categories: CategoryOffreServiceModel[];
  currentSlideIndex = 0;
  slideOpts = {
    speed: 400,
    slideShadows: true,
    spaceBetween: 15,
  };
  loadingServices: boolean;
  servicesHasError: boolean;
  services: OffreService[];
  currentCategory: CategoryOffreServiceModel;
  servicesByCategoriesArray: {
    category: CategoryOffreServiceModel;
    services: OffreService[];
  }[] = [];

  constructor(private operationService: OperationService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getServices();
  }

  getServices() {
    this.loadingServices = true;
    this.servicesHasError = false;
    this.servicesByCategoriesArray = [];
    this.operationService
      .getServicesByFormule()
      .pipe(
        tap((res) => {
          this.services = res;
          const categoriesArray = res.map(
            (service) => service?.categorieOffreServices
          );
          let categories = [].concat.apply([], categoriesArray);
          categories = categories.filter(
            (category, categoryIndex, array) =>
              array.findIndex((t) => t.id === category.id) === categoryIndex
          );
          this.categories = categories;
          this.currentCategory = this.categories[0];
          this.services.forEach((service) => {
            service.categorieOffreServices = service.categorieOffreServices.map(
              (cat) => cat.id
            );
          });
          for (let category of this.categories) {
            const services = this.services.filter((service) =>
              service.categorieOffreServices.includes(category.id)
            );
            this.servicesByCategoriesArray.push({ category, services });
          }
          console.log(this.services);
          this.loadingServices = false;
        }),
        catchError((err) => {
          this.servicesHasError = true;
          this.loadingServices = false;
          return throwError(err);
        })
      )
      .subscribe();
  }

  setSlidesIndex(index) {
    this.sliders.slideTo(index);
  }

  getCurrentSlide() {
    this.sliders.getActiveIndex().then((index) => {
      this.currentSlideIndex = index;
      this.currentCategory = this.categories[index];
      console.log(this.currentCategory);
    });
  }

  containPassUsage(services: OffreService[]) {
    return services.find((service) => service.passUsage);
  }
}
