import {
  REGEX_NUMBER,
  REGEX_PASSWORD2,
  REGEX_EMAIL,
  REGEX_DIGIT,
  REGEX_NAME
} from 'src/shared';

export const registrationSteps = {
  PHONE_NUMBER: {
    stepName: 'Numéro de téléphone',
    stepAudio: 'number',
    stepInput: 'text',
    messages: [
      'Je suis Ibou, votre conseiller digital. Prêt? Nous allons commencer la création de votre compte Orange et moi. Vous pouvez activer ou désactiver ma voix en wolof en cliquant sur le bouton bleu en haut de votre écran. ',
      'Entrez votre numéro de téléphone'
    ]
  },
  WRONG_PHONE_NUMBER: {
    stepName: '',
    stepAudio: 'wrong_number',
    stepInput: 'text'
  },
  ALREADY_USED_PHONE_NUMBER: {
    stepName: '',
    stepAudio: 'used_number',
    stepInput: 'text',
    messages: [
      'Ce numéro est déjà utilisé',
      'Veuillez cliquer sur ce lien pour réinitialiser votre mot de passe.'
    ]
  },
  VALIDATION_CODE: {
    stepName: '',
    stepAudio: 'code',
    stepInput: 'number',
    messages: [
      'Vous allez recevoir un code par SMS au',
      'Merci de renseigner le code avant les prochaines'
    ]
  },
  WRONG_VALIDATION_CODE: {
    stepName: '',
    stepAudio: 'wrong_code',
    stepInput: 'text',
    messages: [
      'Le code saisi est incorrect. Il doit comporter exactement 6 chiffres. Veuillez ressaisir le code'
    ]
  },
  EXPIRED_VALIDATION_CODE: {
    stepName: '',
    stepAudio: 'expired_validation_code',
    stepInput: 'text',
    messages: [`Le code saisi n'est pas correct ou a expiré`]
  },
  FIRST_NAME: {
    stepName: 'Prénom',
    stepAudio: 'prenom',
    stepInput: 'text',
    messages: ['Veuillez saisir votre prénom']
  },
  WRONG_FIRST_NAME: {
    stepName: '',
    stepAudio: 'wrong_prenom',
    stepInput: 'text',
    messages: [
      'Le nombre de caractères doit être compris entre 2 et 20 et ne doit pas contenir de valeur numérique'
    ]
  },
  LAST_NAME: {
    stepName: 'Nom',
    stepAudio: 'nom',
    stepInput: 'text',
    messages: ['veuillez saisir votre nom de famille']
  },
  WRONG_LAST_NAME: { stepName: '', stepAudio: 'wrong_nom', stepInput: 'text' },
  USER_HAS_EMAIL: {
    stepName: '',
    stepAudio: 'hasMail',
    stepInput: 'text',
    messages: ['Voulez-vous renseigner votre adresse email ?']
  },
  EMAIL: {
    stepName: 'Email',
    stepAudio: 'mail',
    stepInput: 'email',
    messages: ['Veuillez renseigner votre adresse email']
  },
  WRONG_EMAIL: {
    stepName: '',
    stepAudio: 'wrongmail',
    stepInput: 'text',
    messages: [
      'Le mail que vous avez saisi est incorrect. Voulez-vous toujours renseigner votre mail ?'
    ]
  },
  ALREADY_USED_EMAIL: {
    stepName: '',
    stepAudio: '',
    stepInput: 'text',
    messages: ['Cet email est déjà rattaché à un compte.']
  },
  PASSWORD: {
    stepName: 'Mot de passe',
    stepAudio: 'password',
    stepInput: 'password',
    messages: [
      'Nous allons créer ensemble le mot de passe que vous allez utiliser pour Orange et Moi. Un mot de passe doit comporter au minimum 8 caractères dont une majuscule et un chiffre.',
      'Saisis le mot de passe de ton choix...'
    ]
  },
  WRONG_PASSWORD: {
    stepName: '',
    stepAudio: 'wrong_password',
    stepInput: 'password',
    messages: [
      'Un mot de passe doit comporter au minimum 8 caractères dont une majuscule et un chiffre. Veuillez réessayer'
    ]
  },
  PASSWORD_CONFIRM: {
    stepName: '',
    stepAudio: 'confirmPassword',
    stepInput: 'password',
    messages: ['Pour activer votre mot de passe, tapez le à nouveau.']
  },
  WRONG_PASSWORD_CONFIRM: {
    stepName: '',
    stepAudio: 'wrongConfirmPassword',
    stepInput: 'password',
    messages: ['Les mots de passe sasis ne sont pas identiques']
  },
  REMEMBER_ME: { stepName: '', stepAudio: 'remember_me', stepInput: 'text' },
  SUCCESS: { stepName: '', stepAudio: 'success' },
  NETWORK_PROBLEM: { stepName: '', stepAudio: '', stepInput: 'text' }
};

export function validateNumber(phoneNumber: string) {
  return REGEX_NUMBER.test(phoneNumber);
}

export function validatePassword(password: string) {
  return REGEX_PASSWORD2.test(password);
}

export function validateEmail(email: string) {
  return REGEX_EMAIL.test(email);
}

export function validateName(name: string) {
  if (
    name.length < 2 ||
    name.length > 20 ||
    REGEX_DIGIT.test(name) ||
    !REGEX_NAME.test(name)
  ) {
    return false;
  }
  return REGEX_NAME.test(name);
}

export function isOTPValid(code: string) {
  console.log(code);
  return String(code).length === 6;
}

export const captchaSiteKey = '6Lee1KAUAAAAAIwaBjYgxXgKgiAauUO3mQcyuVh6';

export function userFriendlyTime(seconds: number): string {
  let hh: number;
  let mn: number;
  let ss: number;
  let time = '';
  hh = Math.floor(seconds / 3600);
  seconds = seconds % 3600;
  if (hh !== 0) {
    time = time + '' + hh + ' heures ';
  }

  mn = Math.floor(seconds / 60);
  seconds = seconds % 60;
  if (mn !== 0) {
    time = time + '' + mn + ' minutes ';
  }

  if (seconds < 60 && seconds !== 0) {
    if (!mn && hh > 0) {
      time = time + '' + 0 + ' minutes ';
    }
    ss = seconds;
    time = time + '' + ss + ' secondes';
  }
  return time;
}

export const CGU = [
  {
    title: 'INTRODUCTION',
    content: [
      {
        subtitle: '',
        text:
          'Sonatel SA, société anonyme, ayant un capital de 50 000 000 000, enregistré au Registre du Commerce de Dakar sous le numéro N° SN DKR 7461/B, et dont le siège social est situé au siège social 64, voie de dégagement nord ("SONATEL") fournit à l’utilisateur (l’“Utilisateur”)  \n L’accès et l’utilisation de l’application mobile et des services qu’elle propose sont soumis aux présentes conditions générales d’utilisation (les “CGU”) que l’Utilisateur déclare avoir lu et accepte en utilisant l’application mobile et les services proposés.<br />Le sitewww.orangeetmoi.sn est ouvert à toute personne physique disposant d’un terminal compatible et d’une offre de communication mobile, intégrant des services internet mobile, auprès d’un fournisseur de services mobiles et qui souhaite l’utiliser  pour ses propres besoins dans le contexte d’une utilisation personnelle, non commerciale.'
      }
    ]
  },
  {
    title: 'DÉFINITIONS',
    content: [
      {
        subtitle: '',
        text:
          'Dans les présentes CGU, les termes suivants ont, sauf indication contraire, les significations qui leur sont données dans cet article :<br />Application : Orange et Moi est application Web, permettant aux utilisateurs de suivre leur consommation en temps réel, contacter l’assistance, acheter des pass et du crédit et gérer leurs offres.<br />Utilisateur : Désigne une personne physique majeure utilisant le Service,' +
          ' pour ses propres besoins, dans le cadre d’une utilisation non commerciale strictement personnelle.'
      }
    ]
  },
  {
    title: 'OBJET',
    content: [
      {
        subtitle: '',
        text:
          'Le but des présentes CGU est de définir les conditions dans lesquelles :<br />  • L’application mobile est mise à la disposition des Utilisateurs ;<br />  • Les Utilisateurs peuvent utiliser l’application mobile.'
      }
    ]
  },
  {
    title: 'EXIGENCES TECHNIQUES ET CONSOMMATION DE DONNÉES',
    content: [
      {
        subtitle: '',
        text:
          'L’utilisation de l’application web ne nécessite pas de consommation de données grâce au blanchiment de l’url impliquée.'
      }
    ]
  },
  {
    title: 'DESCRIPTION DU SERVICE',
    content: [
      {
        subtitle: '',
        text:
          'L’application web est un service accessible depuis tout  navigateur sur internet qui permet aux clients particuliers de Sonatel SA de suivre leur consommation en temps réel, contacter l’assistance, acheter des pass et du crédit, et gérer leurs offres. '
      }
    ]
  },
  {
    title: 'TARIFS',
    content: [
      {
        subtitle: '',
        text:
          'Le service est gratuit mais  nécessite un accès à internet mais la navigation n’est pas facturée.'
      }
    ]
  },
  {
    title: 'RESPONSABILITÉ ET GARANTIES DE L’UTILISATEUR',
    content: [
      {
        subtitle: '',
        text:
          'L’Utilisateur s’engage à informer SONATEL SA de toute utilisation non autorisée du Site ou de tout autre manquement à sa sécurité.<br />L’Utilisateur s’engage à utiliser le Service conformément au but pour lequel il a été défini. Le détournement d’usage est interdit, en particulier l’utilisation commerciale du Service. Il s’agit notamment des cas d’utilisation inappropriée du Service tels que :<br />Les contributions (textes, photos, etc.) qui sont contraires à l’ordre public, aux bonnes mœurs et à la législation en vigueur, et qui portent atteinte aux droits des tiers sont interdites, notamment : ' +
          '<br />  • les contributions qui sont menaçantes, insultantes, diffamatoires, pornographiques, racistes, xénophobes, homophobes, sexistes, antisémites ou islamophobes;<br />  • les contributions susceptibles d’inciter à la violence ou d’encourager des pratiques dangereuses;<br />  • les contributions qui ne respectent pas la vie privée selon la législation relative à la protection des données à caractère personnel, telles que la publication de l’adresse e-mail, l’adresse postale ou du numéro de téléphone d’une personne ou d’une photographie représentant des personnes reconnaissables sans notamment le ' +
          'consentement des celles-ci;<br />  • les contributions dont l’utilisateur n’est pas titulaire de tous les droits de propriété intellectuelle, par exemple la publication de documents protégés par un copyright ou droit d’auteur;<br />  • les contributions qui contiennent des liens vers d’autres sites web ou forums au contenu illégal.<br />  • les contributions qui ont un contenu publicitaire, promotionnel, commercial ou qui contiennent des liens vers des sites web ayant un tel contenu, ainsi que les contributions qui sont publiées à des fins de recrutement ou à des fins d’enquête.<br />  • les contributions qui s’apparentent à du spamming.'
      }
    ]
  },
  {
    title: 'RESPONSABILITÉ ET GARANTIES DE L’APPLICATION MOBILE',
    content: [
      {
        subtitle: '',
        text:
          'Sonatel SA met en place les moyens nécessaires au bon fonctionnement du site, à la maintenance et à la continuité du site et s’engage à faire ses meilleurs efforts pour rendre le Service accessible 7J/7 24H24 sous réserve des éventuelles pannes et interventions de maintenance nécessaires au bon fonctionnement du Site et du Service et sauf dans l’hypothèse d’un cas de force majeure et/ou d’un événement hors du contrôle de SONATEL SA  et/ou des défaillances d’un Service de Tiers. Sonatel SA ne saurait être responsable en cas de mauvais fonctionnement d’un Service de Tiers pour lequel ledit tiers sera directement responsable auprès de l’Utilisateur en tant qu’éditeur dudit service.<br />La responsabilité de SONATEL SA envers l’Utilisateur ne peut être engagée qu’en cas de faute ou de négligence de SONATEL SA  dûment prouvée et uniquement imputable à SONATEL, en particulier en cas de non-respect de ses obligations en vertu des présentes CGU.'
      }
    ]
  },
  {
    title: 'MODIFICATION',
    content: [
      {
        subtitle: '',
        text:
          'SONATEL SA se réserve le droit de faire évoluer le Service, notamment en mettant à disposition des Utilisateurs de nouvelles fonctionnalités et/ou en modifiant et/ou supprimant certaines fonctionnalités, et de modifier les présentes CGU.  L’Utilisateur sera informé de toute modification des présentes CGU.  Dans telle hypothèse, si l’Utilisateur souhaite continuer à utiliser le Service, l’Utilisateur s’engage à prendre connaissance des nouvelles CGU et à les accepter.'
      }
    ]
  },
  {
    title: 'RÉSILIATION',
    content: [
      {
        subtitle: 'Résiliation par l’Utilisateur',
        text: 'L’Utilisateur peut résilier les présentes  CGU à tout moment.'
      },
      {
        subtitle: 'Résiliation par SONATEL SA',
        text:
          'SONATEL SA est libre de résilier le  Service à tout moment. Dans ce cas,  SONATEL SA préviendra dans les meilleurs délais l’Utilisateur avant qu’il ne soit mis fin au Service. '
      }
    ]
  },
  {
    title: 'DISPOSITIONS CONCERNANT LA PREUVE',
    content: [
      {
        subtitle: '',
        text:
          'Il est expressément convenu que  SONATEL SA et l’Utilisateur pourront communiquer par voie électronique pour les besoins des CGU, à condition que des mesures techniques de sécurité soient prises pour assurer la confidentialité des données échangées.<br />SONATEL SA  et l’Utilisateur conviennent que l’échange électronique entre elles représente valablement le contenu de leurs échanges et, le cas échéant, de leurs engagements.'
      }
    ]
  },
  {
    title: 'CESSION',
    content: [
      {
        subtitle: '',
        text:
          'Il est interdit à l’Utilisateur de céder à un tiers les droits ou obligations qu’il détient en vertu des présentes CGU. En cas de violation de cette interdiction, outre le blocage de l’accès, la responsabilité de l’Utilisateur peut être engagée en raison du contenu ou d’autres données affichées en ligne.'
      }
    ]
  },
  {
    title: 'DONNÉES  PERSONNELLES',
    content: [
      {
        subtitle: '',
        text:
          'Les données à caractère personnel traitées lors de l’utilisation du Service sont traitées par Sonatel SA qui est alors responsable de traitement.<br />La base juridique de ces traitements est l’exécution du contrat. Pour les finalités liées à l’amélioration des services, la base juridique des traitements est l’intérêt légitime.  <br />Les destinataires des données personnelles traitées sont les équipes de Sonatel SA et de ses sous-traitants et Partenaires en charge du Service.<br />Les données collectées sont susceptibles d’être traitées hors du Sénégal. Dans ce cas, Sonatel SA prend les dispositions nécessaires avec ses sous-traitants ' +
          'et partenaires pour garantir un niveau de protection de vos données adéquat et ce en toute conformité avec la règlementation applicable.<br />Si les sous-traitants et partenaires concernés ne sont pas adhérents à l’accord Privacy Shield s’agissant de transferts vers les États-Unis d’Amérique ou du RGPD s’agissant des pays membres de l’UE, ou ne sont pas situés dans un pays disposant d’une législation considérée comme offrant une protection adéquate, ils seront soumis à des Règles internes contraignantes approuvées par les autorités. <br />L’Utilisateur dispose d’un droit d’accès et de rectification, d’effacement, de limitation du traitement, ainsi que le droit à la portabilité de ses données. L’Utilisateur peut également émettre des directives sur la conservation, la suppression ou la communication de ses données après son décès.'
      }
    ]
  },
  {
    title: 'PROPRIÉTÉ INTELLECTUELLE',
    content: [
      {
        subtitle: '',
        text:
          'SONATEL SA est et demeure le propriétaire de son Service, du site, du logiciel, des applications logicielles, des graphiques, marques, logos, conceptions, technologies, logiciels, bases de données et contenus mis à la disposition des Utilisateurs.<br />L’Utilisateur reconnaît qu’il n’acquiert aucun droit de propriété intellectuelle sur des éléments appartenant à SONATEL SA. Il est également interdit de les utiliser dans un autre contexte que celui exclusivement prévu dans les présentes CGU.<br />Toutes les mises à niveau, mises à jour, dérivés, développements, créés ou développés par SONATEL SA en relation avec le Service sont et resteront la propriété de SONATEL SA, et l’Utilisateur reconnaît et accepte expressément que toute contribution sous forme de services, suggestion, idée, rapport, identification ou défaut, les dépenses ou toute autre contribution apportée par l’Utilisateur, ne confère aucun droit, titre ou intérêt sur l’un des éléments ou composants du Service.'
      }
    ]
  },
  {
    title: 'DROIT APPLICABLE  - DISPOSITIONS GÉNÉRALES ',
    content: [
      {
        subtitle: '',
        text:
          'Si une ou plusieurs dispositions du présent contrat sont considérées comme non valides ou sont déclarées comme telles par la loi ou un règlement ou par suite d’une décision judiciaire prise par une autorité judiciaire compétente, les autres dispositions demeurent pleinement en vigueur.<br />Les dispositions déclarées nulles et non valables seront alors remplacées par des dispositions qui se rapprocheront le plus étroitement du contenu des dispositions initialement convenues.<br />SONATEL SA ' +
          'et l’Utilisateur ne seront pas tenus pour responsables ou considérées comme ayant violé les présentes CGU en cas de retard ou de non-exécution si la cause du retard ou de la non-exécution est due à un cas de force majeure.<br />Sauf disposition contraire de la loi applicable, les CGU entre Utilisateurs et SONATEL SA  sont soumises au droit sénégalais.<br />Tout litige ou réclamation en vertu des présentes CGU entre les Utilisateurs et SONATEL SA, ou violation, résiliation ou invalidité des présentes, sera soumis exclusivement aux tribunaux compétents.'
      }
    ]
  },
  {
    title: 'CONTACT - RÉCLAMATIONS',
    content: [
      {
        subtitle: '',
        text:
          'Toute réclamation ou litige concernant l’Application, le Service ou un Service de Tiers devra être notifié par e-mail à l’adresse : serviceclient@orange-sonatel.comCe qui précède n’exclut pas le droit de l’Utilisateur de porter sa réclamation à l’égard SONATEL SA  devant les tribunaux.'
      }
    ]
  }
];
