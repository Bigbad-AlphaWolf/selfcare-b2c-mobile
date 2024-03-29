import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ItemOfferPlanComponent } from './item-offer-plan/item-offer-plan.component';
import { ItemPassIllimixComponent } from './item-pass-illimix/item-pass-illimix.component';
import { ItemPassInternetComponent } from './item-pass-internet/item-pass-internet.component';
import { ItemRechargeCreditComponent } from './item-recharge-credit/item-recharge-credit.component';
import { ItemRattachedNumberComponent } from './item-rattached-number/item-rattached-number.component';
import { RattachNumberModalComponent } from '../pages/rattached-phones-number/components/rattach-number-modal/rattach-number-modal.component';
import { RattachNumberByIdCardComponent } from '../pages/rattached-phones-number/components/rattach-number-by-id-card/rattach-number-by-id-card.component';
import { RattachNumberByClientCodeComponent } from '../pages/rattached-phones-number/components/rattach-number-by-client-code/rattach-number-by-client-code.component';
import { DalalCardItemComponent } from 'src/shared/dalal-card-item/dalal-card-item.component';
import { DashboardHeaderComponent } from 'src/shared/dashboard-header/dashboard-header.component';
import { CardRapidoNameModalComponent } from './card-rapido-name-modal/card-rapido-name-modal.component';
import { ItemIlliflexComponent } from 'src/shared/illiflex-item/item-illiflex/item-illiflex.component';
import { IdentifiedNumbersListComponent } from '../pages/rattached-phones-number/components/identified-numbers-list/identified-numbers-list.component';
import { ChooseRattachementTypeModalComponent } from '../pages/rattached-phones-number/components/choose-rattachement-type-modal/choose-rattachement-type-modal.component';
import { ItemHistorikDetailsInfosComponent } from '../details-conso/components/item-historik-details-infos/item-historik-details-infos.component';
import { IonicImageLoader } from 'ionic-image-loader';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../pipes/pipes.module';
import { MaterialComponentsModule } from '../material-components/material-components.module';
import { IonicModule } from '@ionic/angular';
import { ItemTransfertOmComponent } from './item-transfert-om/item-transfert-om.component';
import { SlideBanniereDashboardComponent } from './slide-banniere-dashboard/slide-banniere-dashboard.component';
import { TakePictureComponent } from './take-picture/take-picture.component';
import { HistorikTransactionByTypeModalComponent } from './historik-transaction-by-type-modal/historik-transaction-by-type-modal.component';
import { ItemOmUserStatusCardInfosComponent } from './item-om-user-status-card-infos/item-om-user-status-card-infos.component';
import { ListPreviewStoriesComponent } from './list-preview-stories/list-preview-stories.component';
import { VisualizeStoriesComponent } from './visualize-stories/visualize-stories.component';
import { StoriesProgressBarComponent } from './stories-progress-bar/stories-progress-bar.component';
import { VisualizeStoryComponent } from './visualize-story/visualize-story.component';
import { SwiperModule } from 'swiper/angular';
import { VisualizeStoriesByCategoriesComponent } from './visualize-stories-by-categories/visualize-stories-by-categories.component';
import { LazyLoadDirective } from '../directives/lazy-load-img/lazy-load-image.directive';
import { CardXeweulNameModalComponent } from './card-xeweul-name-modal/card-xeweul-name-modal.component';
import { RattachByOtpCodeComponent } from '../pages/rattached-phones-number/components/rattach-by-otp-code/rattach-by-otp-code.component';
import { ItemPassWidoComponent } from './item-pass-wido/item-pass-wido.component';
import { ItemFavoritePassComponent } from './item-favorite-pass/item-favorite-pass.component';
import { InfosLigneFixeComponent } from 'src/shared/infos-ligne-fixe/infos-ligne-fixe.component';
import { SuiviConsoLigneComponent } from 'src/shared/suivi-conso-ligne/suivi-conso-ligne.component';
@NgModule({
  declarations: [
    ItemOfferPlanComponent,
    ItemPassIllimixComponent,
    ItemPassInternetComponent,
    ItemRechargeCreditComponent,
    ItemRattachedNumberComponent,
    RattachNumberModalComponent,
    RattachNumberByIdCardComponent,
    RattachNumberByClientCodeComponent,
    DalalCardItemComponent,
    DashboardHeaderComponent,
    CardRapidoNameModalComponent,
    CardXeweulNameModalComponent,
    ItemIlliflexComponent,
    IdentifiedNumbersListComponent,
    ChooseRattachementTypeModalComponent,
    ItemHistorikDetailsInfosComponent,
    SlideBanniereDashboardComponent,
    HistorikTransactionByTypeModalComponent,
    TakePictureComponent,
    ItemTransfertOmComponent,
    ItemOmUserStatusCardInfosComponent,
    ListPreviewStoriesComponent,
    VisualizeStoriesComponent,
    StoriesProgressBarComponent,
    VisualizeStoryComponent,
    VisualizeStoriesByCategoriesComponent,
    LazyLoadDirective,
    RattachByOtpCodeComponent,
    ItemPassWidoComponent,
    ItemFavoritePassComponent,
		InfosLigneFixeComponent,
		SuiviConsoLigneComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    MaterialComponentsModule,
    IonicModule,
    IonicImageLoader,
    SwiperModule,
  ],
  exports: [
    ItemOfferPlanComponent,
    ItemPassIllimixComponent,
    ItemPassInternetComponent,
    ItemRechargeCreditComponent,
    ItemRattachedNumberComponent,
    RattachNumberModalComponent,
    RattachNumberByIdCardComponent,
    RattachNumberByClientCodeComponent,
    DalalCardItemComponent,
    DashboardHeaderComponent,
    CardRapidoNameModalComponent,
    CardXeweulNameModalComponent,
    ItemIlliflexComponent,
    IdentifiedNumbersListComponent,
    ChooseRattachementTypeModalComponent,
    ItemHistorikDetailsInfosComponent,
    SlideBanniereDashboardComponent,
    HistorikTransactionByTypeModalComponent,
    TakePictureComponent,
    ItemTransfertOmComponent,
    ItemOmUserStatusCardInfosComponent,
    ListPreviewStoriesComponent,
    VisualizeStoriesComponent,
    StoriesProgressBarComponent,
    VisualizeStoryComponent,
    SwiperModule,
    VisualizeStoriesByCategoriesComponent,
    LazyLoadDirective,
    RattachByOtpCodeComponent,
    ItemPassWidoComponent,
    ItemFavoritePassComponent,
		InfosLigneFixeComponent,
		SuiviConsoLigneComponent
  ],
  entryComponents: [HistorikTransactionByTypeModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}
