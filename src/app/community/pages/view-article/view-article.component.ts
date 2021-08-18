import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CommunityService } from 'src/app/services/community-service/community.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { ArticleModel, CommentModel } from '../../../models/article.model';

@Component( {
	selector: 'app-view-article',
	templateUrl: './view-article.component.html',
	styleUrls: ['./view-article.component.scss'],
} )
export class ViewArticleComponent implements OnInit {
	article: ArticleModel;
	commentForm: FormGroup;
	postingComment: boolean;
	firstName: string;
	lastName: string;
	constructor(
		private navController: NavController,
		private router: Router,
		private formBuilder: FormBuilder,
		private communityService: CommunityService,
		private dashboardService: DashboardService
	) {
		this.commentForm = this.formBuilder.group( {
			comment: ['', [Validators.required]],
		} );
	}

	ngOnInit() {
		this.getArticle();
		this.getUserInfos();
	}

	getUserInfos() {
		this.dashboardService.getCustomerInformations().subscribe(
			( res ) => {
				this.firstName = res.givenName;
				this.lastName = res.familyName;
			},
			( err ) => { }
		);
	}

	getArticle() {
		this.article = this.router.getCurrentNavigation()?.extras?.state?.article;
	}

	goBack() {
		this.navController.pop();
	}

	postComment() {
		this.postingComment = true;
		const comment: CommentModel = {
			content: this.commentForm.value.comment,
			msisdn: this.dashboardService.getMainPhoneNumber(),
			firstName: this.firstName,
			lastName: this.lastName,
			article: this.article,
		};
		this.communityService.postComment( comment ).subscribe(
			( res ) => {
				console.log( res );
				this.postingComment = false;
			},
			( err ) => {
				console.log( err );
				this.postingComment = false;
			}
		);
	}
}
