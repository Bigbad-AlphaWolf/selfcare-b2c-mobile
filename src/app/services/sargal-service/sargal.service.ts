import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, of, Observable } from 'rxjs';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { environment } from 'src/environments/environment';
import { GiftSargalItem, GiftSargalCategoryItem } from 'src/shared';

const { SARGAL_SERVICE, SERVER_API_URL } = environment;

// Endpoint to get sargal balance
const sargalBalanceEndpoint = `${SERVER_API_URL}/${SARGAL_SERVICE}/api/sargal/v1/subscription-status`;
const sargalCategorieGiftEndpoint = `${SERVER_API_URL}/${SARGAL_SERVICE}/api/categorie-gifts`;
const listSargalGiftsByCategoryEndpoint = `${SERVER_API_URL}/${SARGAL_SERVICE}/api/gift-sargal`;
const listAllSargalGiftsEndpoint = `${SERVER_API_URL}/${SARGAL_SERVICE}/api/gift-sargals-by-formule`;
const convertGiftEndpoint = `${SERVER_API_URL}/${SARGAL_SERVICE}/api/sargal/v1/loyaltypoints-gift`;
const registerSargalEndpoint = `${SERVER_API_URL}/${SARGAL_SERVICE}/api/sargal/v1/suscribe`;
@Injectable({
	providedIn: 'root'
})
export class SargalService {
	private userPhoneNumber: string;

	private listGiftSargal: GiftSargalItem[] = [];

	private listCategoryGiftSargal: GiftSargalCategoryItem[] = [];

	private listGiftSargalShown: any;

	dataLoaded: boolean;

	dataLoadedSubject: Subject<any> = new Subject<any>();
	categoryDataSubject: Subject<any> = new Subject<any>();
	hasError: boolean;

	hasErrorSubject: Subject<any> = new Subject<any>();
	constructor(private http: HttpClient, private dashbService: DashboardService) {}

	getSargalBalance(msisdn: string) {
		return this.http.get(`${sargalBalanceEndpoint}/${msisdn}`);
	}

	querySargalGiftCategories() {
		return this.http.get(`${sargalCategorieGiftEndpoint}`);
	}

	setUserPhoneNumber(msisdn: string) {
		this.userPhoneNumber = msisdn;
	}
	getAllSargalCategories(listSargalGift: GiftSargalItem[]) {
		let listCategory = [];

		if (listSargalGift) {
			listCategory = [
				...new Set(
					listSargalGift.map((item: GiftSargalItem) => {
						return item.categorieGift.nom;
					})
				)
			];
		}

		return listCategory;
	}

	getAllGiftSargalUser(codeFormule: string) {
		return this.http.get(`${listAllSargalGiftsEndpoint}/${codeFormule}`);
	}
	getListCategoryGiftSargal() {
		return this.listCategoryGiftSargal;
	}
	getListGiftSargalOfUser() {
		return this.listGiftSargal;
	}
	getStatusDataLoaded() {
		return this.dataLoadedSubject.asObservable();
	}

	setListGiftSargalAndCategoryOfUserByQuery() {
		this.dataLoadedSubject.next(false);
		this.listGiftSargal = [];
		this.listCategoryGiftSargal = [];
		this.dashbService.getCodeFormuleOfMsisdn(this.userPhoneNumber).subscribe((codeFormuleMsisdn: any) => {
			if (codeFormuleMsisdn !== 'error') {
				this.getAllGiftSargalUser(codeFormuleMsisdn).subscribe(
					(resp: any[]) => {
						this.listGiftSargal = resp.filter((item: GiftSargalItem) => {
							if (item) {
								return item;
							}
						});
						// Order by asc price giftSargal by default
						this.listGiftSargal.sort((item1: GiftSargalItem, item2: GiftSargalItem) => +item1.prix - +item2.prix);
						this.querySargalGiftCategories().subscribe(
							(listCategory: GiftSargalCategoryItem[]) => {
								this.listCategoryGiftSargal = listCategory;
								this.dataLoadedSubject.next(true);
							},
							(err: any) => {}
						);
					},
					() => {
						this.dataLoadedSubject.next(true);
					}
				);
			}
		});
	}
	filterGiftItemByCategory(category: GiftSargalCategoryItem, listGiftSargal: GiftSargalItem[]) {
		let res;
		if (category) {
			res = listGiftSargal.filter((item: GiftSargalItem) => {
				return item.categorieGift.id === category.id;
			});
		}
		return res ? res : listGiftSargal;
	}

	getGiftSargalItemsByCategory(codeCategory: any, codeFormule: string, ordre: string) {
		return this.http.get(
			`${listSargalGiftsByCategoryEndpoint}/formule/${codeFormule}/categorie/${codeCategory}?ordre=${ordre}`
		);
	}

	convertToGift(gift: GiftSargalItem, numerosIllimite: string[]) {
		const msisdn = this.dashbService.getCurrentPhoneNumber();
		const numeros = numerosIllimite ? numerosIllimite.join() : null;
		return this.http.post(
			`${convertGiftEndpoint}/${msisdn}?giftId=${gift.giftId}&fellowType=${gift.fellowType}&fellowNumbers=${numeros}`,
			null
		);
	}
	registerToSargal(msisdn: string) {
		return this.http.post(`${registerSargalEndpoint}/${msisdn}`, null);
	}
}
