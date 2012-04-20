/**
 * Plugin jquery : skostree
 *
 * @required : jquery
 * @required : jquery.base64, utilisé pour l'encryption du login et mot de passe
 * @optional : jquery.url, vocSid: $.url.param("vocSid") (Pour la récupération de paramètes en get, non utilisé ici)
 *
 *
 * @param o : { vocSid: '',	@required
 *							//de la forme : /ts2/TE-32989
 *
 *				user: '',	@required
 *
 *				passw: '',	@required
 *
 *				basic: '',	@required si user et passw ne sont pas définis
 *							//encodage en basic 64 de user:passw
 *
 * ------------------------------------------------------------------------------------------------------------------------
 *
 *				lang: 'fr',	@optional
 *
 *				preUrl: 'http://ida.intra.inist.fr:51021', 	@optional
 *															//adresse du site à contacter
 *
 *				postUrl: '.json?f=broader+provider&x=1',	@optional
 *															//attention, le retour doit être sous format json avec des 
 *															//broader, narrower, specific et provider
 *
 *				postUrlSubQuery: '.json?f=provider&x=1',	@optional
 *															//reduit les sous requêtes sans enlever d'élements nécessaires
 *
 *				limite: 0,	@optional 
 *							//limite: 0 correspond à une limite infinie
 *							//une limite négative n'a pas de sens (considérée comme 0)
 *
 *				img: "img",	@optional
 *							//indique le dossier des images
 *
 *				images: {	@optional
 *							//liste des images
 *
 *					cornerBottomRight: 'cornerBottomRight.gif',//--	ligne vers les accociés
 *					cornerBottomLeft: 'cornerBottomLeft.gif', //---	angle pour les specific
 *					cornerTopRight: 'cornerTopRight.gif', //-------	angle pour les broader
 *					cornerTopLeft: 'cornerTopLeft.gif', //---------	angle pour les related
 *					verticalLine: 'verticalLine.gif', //-----------	ligne verticale
 *					loading: 'loading.gif',	//---------------------	image de chargement
 *					plus: 'plus.gif', //---------------------------	plus pour savoir s'il y a des specific
 *					puceBroader: 'puceBroader.png', //-------------	puce des broader
 *					puceRelated: 'puceRelated.png', //-------------	puce des related
 *					puceNarrower: 'puceNarrower.png', //-----------	puce des narrower
 *					puceSpecific: 'puceSpecific.png', //-----------	puce des specific
 *					puceCourant: 'puceCourant.gif', //-------------------	puce selectionné pour le concepte courrant
 *					puceError: 'puceError.png', //-----------------	puce d'erreur, s'ajoutant à la puce normal
 *					vide: 'vide.gif' //----------------------------	image vide
 *				},
 *
 *				titre: '',	@optional
 *							//Affiche un titre si non vide
 *
 *				selectBroader: true,	@optional
 *										//Prend en compte les broader du provider au lieu de lui même
 *
 *
 *				legende: { 	@optional
 *							//Liste des légende et autre textes
 *
 *					titre: 'Légende', //---------------------------	Titre de la légende
 *					Courant: 'Concept courant', //--------------------	Légende du concept courant
 *					broader: 'Broader', //-------------------------	Légende du/des concepts broader
 *					specific: 'Specific', //-----------------------	Légende du/des concepts specific
 *					narrower: 'Narrower', //-----------------------	Légende du/des concepts warrower
 *					related: 'Related', //-------------------------	Légende du/des concepts related
 *					plus: 'Concept contenant un/des Specific',	//-	Légende de l'image "plus"
 *					error: 'Erreur', //----------------------------	Légende de l'image "erreur"
 *					allProvider: 'Tous les fournisseurs', //-------	Affichage du selecteur de providers
 *					minimum: false //------------------------------	Affichage de la légende minimal
 *				},
 *
 *				disp: {	@optional
 *						//Liste de ce qu'il faut afficher
 *
 *					loading: false,	// Affichage de l'image de chargement
 *					broader: true,	// Affichage des broader
 *					specific: true,	// Affichage des specific
 *					narrower: true,	// Affichage des narrower
 *					related: true,	// Affichage des related
 *				},
 *
 *				error: {	@optional
 *					prefLabel: 'Erreur : pas de skos$prefLabel : ', //---------	Message d'erreur s'il n'y a pas de skos$prefLabel au concept
 *					prefLabelTab : 'Erreur : pas de skos$prefLabel[i] : ', //--	Message d'erreur s'il n'y a pas de skos$prefLabel[i] au concept
 *					t: 'Erreur : pas de skos$prefLabel.$t : ', //--------------	Message d'erreur s'il n'y a pas de $t au skos$prefLabel
 *					tTab : 'Erreur : pas de skos$prefLabel[i].$t : ', //-------	Message d'erreur s'il n'y a pas de $t au skos$prefLabel[i]
 *					conceptNull: 'Error : skos$Concept null', //---------------	Message d'erreur s'il n'y a pas de concept
 *					courant: ' : ', //-----------------------------------------	Message d'erreur pour la requête du concept courant (entre vocSid et l'erreur retournée)
 *					specific: ' : ', //----------------------------------------	Message d'erreur pour la requête des specific (entre vocSid et l'erreur retournée)
 *					noSpecific: 'Il n\'y a pas de specific', //----------------	Message s'il n'y a pas de spécific
 *					narrower: ' : ', //----------------------------------------	Message d'erreur pour la requête des narrower (entre vocSid et l'erreur retournée)
 *					noNarrower: 'Il n\'y a pas de narrower', //----------------	Message s'il n'y a pas de narrower
 *					related: ' : ', //-----------------------------------------	Message d'erreur pour la requête des related (entre vocSid et l'erreur retournée)
 *					noRelated : 'Il n\'y a pas de related' //------------------	Message s'il n'y a pas de related
 *				},
 *
 * ------------------------------------------------------------------------------------------------------------------------
 *
 *				dispWarning: false 		@optional
 *										//Affiche des alertes de malfonction si true
 *
 *				dispAllWarning: false	@optional
 *										//affiche toutes les erreurs, même insignifiantes
 *				}
 *
 * @author Mathieu Colin (mathieu.colin@mail.com)
 */
(function($){
  
$.fn.skostree = function(o){

	//Check options
	
	var options = {
		vocSid: '',
		user: '',
		passw: '',
		basic: '',
		lang: 'fr',
		preUrl: 'http://ida.intra.inist.fr:51021', 
		//preUrl: 'http://tapis.intra.inist.fr',
		postUrl:         '.json?f=broader+provider+semCategory+scopeDomain+originDomain&x=1',
		postUrlSubQuery: '.json?f=provider+semCategory+scopeDomain+originDomain&x=1&h=2',
		limite: 0,
		img: 'img',
		titre: '',
		selectBroader: true,
		dispWarning: false,
		dispAllWarning: false,
		onChange: function(vocSid) {
			var listParam = location.search.substring(1).split('&');
			var param = '?vocSid=' + vocSid;
			var alreadyOtherParam = '';
			for (var i = 0; i<listParam.length; i++) {
				var coupleParam = listParam[i].split('=');
				if (coupleParam[0] != 'vocSid') {
					alreadyOtherParam += '&' + coupleParam[0] + '=' + coupleParam[1];
				}
			}
			return window.location.pathname + param + alreadyOtherParam;
		}
	};
	$.extend(options, o);
	
	options.images = $.extend({
		cornerBottomRight: 'cornerBottomRight.gif',
		cornerBottomLeft: 'cornerBottomLeft.gif',
		cornerTopRight: 'cornerTopRight.gif',
		cornerTopLeft: 'vide.gif',
		verticalLine: 'verticalLine.gif',
		loading: 'loading.gif',
		plus: 'plus.png',
		puceBroader: 'puceBroader.png',
		puceRelated: 'puceRelated.png',
		puceNarrower: 'puceNarrower.png',
		puceexactMatch: 'puceexactMatch.png', 
		pucecloseMatch: 'pucecloseMatch.png', 
		puceSpecific: 'puceSpecific.png',
		puceCourant: 'puceCourant.png',
		puceError: 'puceError.png',
		vide: 'vide.gif'
	}, o.images);
	
	options.legende = $.extend({
		titre: 'Légende',
		courant: 'Concept courant',
		broader: 'Broader',
		specific: 'Narrower calculé',
		narrower: 'Narrower',
		exactMatch: 'exactMatch',
    closeMatch: 'closeMatch',
		related: 'Related',
		plus: 'Concept contenant un/des Specific',
		error: 'Erreur',
		allProvider: 'Tous les fournisseurs',
		allSemCategory: 'Tous les semCategory',
		allOriginDomain: 'Tous les originDomain',
		allScopeDomain: 'Tous les scopeDomain',
		minimum: false
	}, ((o == null)? {} : o.legende));
	
	options.disp = $.extend({
		loading: false,
		broader: true,
		specific: true,
		narrower: true,
		exactMatch: true,
		closeMatch: true,
		related: true,
		errorLink: false
	}, ((o == null)? {} : o.disp));
	
	options.disp.selector = $.extend({
		provider: true,
		semCategory: true,
		originDomain: true,
		scopeDomain: true
		
	}, ((o.disp == null)? {} : o.disp.selector));
	
	options.error = $.extend({
		prefLabel: 'Erreur : pas de skos$prefLabel : ',
		prefLabelTab : 'Erreur : pas de skos$prefLabel[i] : ',
		t: 'Erreur : pas de skos$prefLabel.$t : ',
		tTab : 'Erreur : pas de skos$prefLabel[i].$t : ',
		conceptNull: 'Error : skos$Concept null',
		courant: ' : ',
		specific: ' : ',
		noSpecific: 'Il n\'y a pas de specific',
		narrower: ' : ',
		exactMatch: ' : ',
		closeMatch: ' : ',
		noNarrower: 'Il n\'y a pas de narrower',
		noexactMatch: 'Il n\'y a pas de exactMacth',
		nocloseMatch: 'Il n\'y a pas de exactMacth',
		related: ' : ',
		noRelated : 'Il n\'y a pas de related'
	}, ((o == null)? {} : o.error));

	
	
	//Eastern Egg : on peux directement mettre du basic
	//Si y'a pas de basic
	if (options.basic == '') {
		//Encode en basic64 du login:password
		options.basic = $.base64Encode(options.user + ":" + options.passw);
	}
	
	//Cheat pour IE
	var ajaxError = false;
	$.support.cors = true;
	
	//Fonction de parsage d'adresse
	function parseHREF(href) {
		if (href == null)
			return '';
		while (href.charAt(href.length-1) == '/') {
			href = href.substring(0, href.length -1);
		}
		return href;
	}
	
	//Liste des providers du select
	var listProviders = new Array();
	
	//Stockage des providers
	var description;
	


	/**
	 * Retourne les tps$semCategory, tps$originDomain et tps$scopeDomain du concept passé en param
	 *
	 * @param concept : skos$Concept auquel les providers appartiennes
	 *
	 * @param who : concept à utiliser : tps$semCategory, tps$originDomain ou tps$scopeDomain
	 *
	 */
	function otherProviderOf(concept, who) {
		if (concept == null)
			return '';
		
		if (who == 'tps$semCategory'){
			var tps = concept.tps$semCategory;
			var selector = 'skostree-selector-semCategory';
		} else if (who == 'tps$originDomain') {
			var tps = concept.tps$originDomain;
			var selector = 'skostree-selector-originDomain';
		} else if (who == 'tps$scopeDomain') {
			var tps = concept.tps$scopeDomain;
			var selector = 'skostree-selector-scopeDomain';
		} else {
			return '';
		}
		
		if (tps == null)
			return '';
		
		var otherProviderOf = '';
		
		if ($.isArray(tps)) {
			$.each(tps, function(keyTps, valTps) {
				if (valTps.skos$Concept == null)
					return true;
				
				if  (options.selectBroader) {
					if (valTps.skos$Concept.skos$broader)
						return true;
					
					if ($.isArray(valTps.skos$Concept.skos$broader)) {
						$.each(valTps.skos$Concept.skos$broader, function(keyBroader, valBroader) {
							if (valBroader.skos$Concept == null)
								return true;
							if (valBroader.skos$Concept.skos$prefLabel == null)
								return true;
							if (valBroader.skos$Concept.skos$prefLabel.$t == null)
								return true;
							
							if ($.inArray(valBroader.skos$Concept.skos$prefLabel.$t, listProviders) == -1) {
								listProviders.push(valProviderBroader.skos$Concept.skos$prefLabel.$t);
								$('select[name="' + selector + '"]').append('<option value="'+ valBroader.skos$Concept.skos$prefLabel.$t +'">'+ valBroader.skos$Concept.skos$prefLabel.$t +'</option>');
							}
							otherProviderOf += valBroader.skos$Concept.skos$prefLabel.$t + '|';
						});
					} else {
						if (valTps.skos$Concept == null)
							return true;
						if (valTps.skos$Concept.skos$broader == null)
							return true;
						if (valTps.skos$Concept.skos$broader.skos$Concept == null)
							return true;
						if (valTps.skos$Concept.skos$broader.skos$Concept.skos$prefLabel == null)
							return true;
						if (valTps.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t == null)
							return true;
						
						if ($.inArray(valTps.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t, listProviders) == -1) {
							listProviders.push(valTps.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t);
							$('select[name="' + selector + '"]').append('<option value="'+ valTps.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t +'">'+ valTps.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t +'</option>');
						}
						otherProviderOf += valTps.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t + '|';
					}
				} else {
					if (valTps.skos$Concept == null)
						return true;
					if (valTps.skos$Concept.skos$prefLabel == null)
						return true;
					if (valTps.skos$Concept.skos$prefLabel.$t == null)
						return true;
					
					if ($.inArray(valTps.skos$Concept.skos$prefLabel.$t, listProviders) == -1) {
						listProviders.push(valTps.skos$Concept.skos$prefLabel.$t);
						$('select[name="' + selector + '"]').append('<option value="'+ valTps.skos$Concept.skos$prefLabel.$t +'">'+ valTps.skos$Concept.skos$prefLabel.$t +'</option>');
					}
					otherProviderOf += valTps.skos$Concept.skos$prefLabel.$t + '|';
				}
			});
		} else {
			if (tps.skos$Concept == null)
				return '';
			
			if  (options.selectBroader) {
				if (tps.skos$Concept.skos$broader == null)
					return '';
				
				if ($.isArray(tps.skos$Concept.skos$broader)) {
					$.each(tps.skos$Concept.skos$broader, function(keyBroader, valBroader) {
						if (valBroader.skos$Concept == null)
							return true;
						if (valBroader.skos$Concept.skos$prefLabel == null)
							return true;
						if (valBroader.skos$Concept.skos$prefLabel.$t == null)
							return true;
						
						if ($.inArray(valBroader.skos$Concept.skos$prefLabel.$t, listProviders) == -1) {
							listProviders.push(valBroader.skos$Concept.skos$prefLabel.$t);
							$('select[name="' + selector + '"]').append('<option value="'+ valBroader.skos$Concept.skos$prefLabel.$t +'">'+ valBroader.skos$Concept.skos$prefLabel.$t +'</option>');
						}
						otherProviderOf += valBroader.skos$Concept.skos$prefLabel.$t + '|';
					});
				} else {
					if (tps.skos$Concept.skos$broader.skos$Concept == null)
						return '';
					if (tps.skos$Concept.skos$broader.skos$Concept.skos$prefLabel == null)
						return '';
					if (tps.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t == null)
						return '';
					
					if ($.inArray(tps.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t, listProviders) == -1) {
						listProviders.push(tps.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t);
						$('select[name="' + selector + '"]').append('<option value="'+ tps.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t +'">'+ tps.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t +'</option>');
					}
					otherProviderOf += tps.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t + '|';
				}
			} else {
				if (tps.skos$Concept.skos$prefLabel == null)
					return '';
				if (tps.skos$Concept.skos$prefLabel.$t == null)
					return '';
				
				if ($.inArray(tps.skos$Concept.skos$prefLabel.$t, listProviders) == -1) {
					listProviders.push(tps.skos$Concept.skos$prefLabel.$t);
					$('select[name="' + selector + '"]').append('<option value="'+ tps.skos$Concept.skos$prefLabel.$t +'">'+ tps.skos$Concept.skos$prefLabel.$t +'</option>');
				}
				otherProviderOf += tps.skos$Concept.skos$prefLabel.$t + '|';
			}
		}
		
		if (otherProviderOf == null)
			return '';
		
		return otherProviderOf;
	}
	//Fin otherProviderOf()
	 
	
	/**
	 * Retourne les providers (non dupliquées) du concept passé en param
	 *
	 * @param concept : skos$Concept auquel les providers appartiennes
	 *
	 * @param @optional conceptDescription : rdf$Description de la requête (overider description pour le concept courant et ses broaders (ne pas rajouter de paramètre))
	 *
	 * @return string : providers entre '<em class="skostree-provider">(' et ')</em>'
	 */
	function providerOf(concept, conceptDescriptionPar) {
		
		//conceptDescription optionnel
		var conceptDescription = conceptDescriptionPar || description;
		
		var otherProvider = otherProviderOf(concept, 'tps$semCategory') + otherProviderOf(concept, 'tps$originDomain') + otherProviderOf(concept, 'tps$scopeDomain');
		
		//Pre Check
		if (conceptDescription == null)
			return '<em class="skostree-provider">(' + otherProvider + ')</em>';
		
		//Pre : tableau d'id de prefLabel
		var regExpPrefLabel = '(';
		var listPrefLabel = new Array();
		$.each(concept.skos$prefLabel, function(keyPrefLabel, valPrefLabel){
			if ($.inArray(valPrefLabel.tps$ref, listPrefLabel)) {
				regExpPrefLabel += valPrefLabel.tps$ref + '|';
				listPrefLabel.push(valPrefLabel.tps$ref);
			}
		});
		
		//Suppression du | final
		regExpPrefLabel = regExpPrefLabel.substring(0, regExpPrefLabel.length -1);
		regExpPrefLabel += ')';
		
		//Ajout des providers
		//Appel pour les autres selecteurs
		var providerOf = '';
		
		
		var providerOfArray = [];
		if ($.isArray(conceptDescription)) {
			$.each(conceptDescription, function(key1, val1){
				if(val1.tps$provider == null || val1.rdf$about == null)
					return true;
				
				//Si c'est le bon prefLabel
				if (val1.rdf$about.match(regExpPrefLabel)){
					if ($.isArray(val1.tps$provider)) {
						$.each(val1.tps$provider, function(key, val){
							if (val.skos$Concept == null)
								return true;
							
							//Si on choisi les broader des providers
							if (options.selectBroader) {
								if (val.skos$Concept.skos$broader == null)
									return true;
								
								if ($.isArray(val.skos$Concept.skos$broader)) {
									$.each(val.skos$Concept.skos$broader, function(keyProviderBroader, valProviderBroader) {
										if (valProviderBroader.skos$Concept == null)
											return true;
										if (valProviderBroader.skos$Concept.skos$prefLabel == null)
											return true;
										if (valProviderBroader.skos$Concept.skos$prefLabel.$t == null)
											return true;
										
										if ($.inArray(valProviderBroader.skos$Concept.skos$prefLabel.$t, listProviders) == -1) {
											listProviders.push(valProviderBroader.skos$Concept.skos$prefLabel.$t);
											$('select[name="skostree-selector-providers"]').append('<option value="'+valProviderBroader.skos$Concept.skos$prefLabel.$t+'">'+valProviderBroader.skos$Concept.skos$prefLabel.$t+'</option>');
										}
										if ($.inArray(valProviderBroader.skos$Concept.skos$prefLabel.$t, providerOfArray) == -1) {
											providerOf += valProviderBroader.skos$Concept.skos$prefLabel.$t + '|';
											providerOfArray.push(valProviderBroader.skos$Concept.skos$prefLabel.$t);
										}
									});
								} else {
									if (val.skos$Concept.skos$broader.skos$Concept == null)
										return true;
									if (val.skos$Concept.skos$broader.skos$Concept.skos$prefLabel == null)
										return true;
									if (val.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t == null)
										return true;
									
									if ($.inArray(val.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t, listProviders) == -1) {
										$('select[name="skostree-selector-providers"]').append('<option value="'+val.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t+'">'+val.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t+'</option>');
										listProviders.push(val.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t);
									}
									if ($.inArray(val.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t, providerOfArray) == -1) {
										providerOf += val.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t + '|';
										providerOfArray.push(val.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t);
									}
								}
							} else {
								if (val.skos$Concept.skos$prefLabel == null)
									return true;
								if (val.skos$Concept.skos$prefLabel.$t == null)
									return true;
								
								//Pour le select
								if ($.inArray(val.skos$Concept.skos$prefLabel.$t, listProviders) == -1) {
									$('select[name="skostree-selector-providers"]').append('<option value="'+ val.skos$Concept.skos$prefLabel.$t +'">'+ val.skos$Concept.skos$prefLabel.$t +'</option>');
									listProviders.push(val.skos$Concept.skos$prefLabel.$t);
								}
								
								//Pour le concept
								if ($.inArray(val.skos$Concept.skos$prefLabel.$t, providerOfArray) == -1) {
									providerOf += val.skos$Concept.skos$prefLabel.$t + '|';
									providerOfArray.push(val.skos$Concept.skos$prefLabel.$t);
								}
							}
						});
					} else {
						if (val1.tps$provider.skos$Concept == null)
							return true;
						
						//Si on choisi les broader des providers
						if (options.selectBroader) {
							if (val1.tps$provider.skos$Concept.skos$broader == null)
								return true;
							
							if ($.isArray(val1.tps$provider.skos$Concept.skos$broader)) {
								$.each(val1.tps$provider.skos$Concept.skos$broader, function(keyProviderBroader, valProviderBroader) {
									if (valProviderBroader.skos$Concept == null)
										return true;
									if (valProviderBroader.skos$Concept.skos$prefLabel == null)
										return true;
									if (valProviderBroader.skos$Concept.skos$prefLabel.$t == null)
										return true;
									
									if ($.inArray(valProviderBroader.skos$Concept.skos$prefLabel.$t, listProviders) == -1) {
										$('select[name="skostree-selector-providers"]').append('<option value="'+ valProviderBroader.skos$Concept.skos$prefLabel.$t +'">'+ valProviderBroader.skos$Concept.skos$prefLabel.$t +'</option>');
										listProviders.push(valProviderBroader.skos$Concept.skos$prefLabel.$t);
									}
									if ($.inArray(valProviderBroader.skos$Concept.skos$prefLabel.$t, providerOfArray) == -1) {
										providerOf += valProviderBroader.skos$Concept.skos$prefLabel.$t + '|';
										providerOfArray.push(valProviderBroader.skos$Concept.skos$prefLabel.$t);
									}
								});
							} else {
								if (val1.tps$provider.skos$Concept.skos$broader.skos$Concept == null)
									return true;
								if (val1.tps$provider.skos$Concept.skos$broader.skos$Concept.skos$prefLabel == null)
									return true;
								if (val1.tps$provider.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t == null)
									return true;
								
								if ($.inArray(val1.tps$provider.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t, listProviders) == -1) {
									$('select[name="skostree-selector-providers"]').append('<option value="'+ val1.tps$provider.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t +'">'+ val1.tps$provider.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t +'</option>');
									listProviders.push(val1.tps$provider.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t);
								}
								if ($.inArray(val1.tps$provider.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t, providerOfArray) == -1) {
									providerOf += val1.tps$provider.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t + '|';
									providerOfArray.push(val1.tps$provider.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t);
								}
							}
						} else {
							if (val1.tps$provider.skos$Concept.skos$prefLabel == null)
								return true;
							if (val1.tps$provider.skos$Concept.skos$prefLabel.$t == null)
								return true;
							
							if ($.inArray(val1.tps$provider.skos$Concept.skos$prefLabel.$t, listProviders) == -1) {
								$('select[name="skostree-selector-providers"]').append('<option value="'+ val1.tps$provider.skos$Concept.skos$prefLabel.$t +'">'+ val1.tps$provider.skos$Concept.skos$prefLabel.$t +'</option>');
								listProviders.push(val1.tps$provider.skos$Concept.skos$prefLabel.$t);
							}
							if ($.inArray(val1.tps$provider.skos$Concept.skos$prefLabel.$t, providerOfArray) == -1) {
								providerOf += val1.tps$provider.skos$Concept.skos$prefLabel.$t + '|';
								providerOfArray.push(val1.tps$provider.skos$Concept.skos$prefLabel.$t);
							}
						}
					}
				}
			});
		} else {
			if(conceptDescription.tps$provider == null)
				return '<em class="skostree-provider">(' + otherProvider + ')</em>';
			if(conceptDescription.rdf$about == null)
				return '<em class="skostree-provider">(' + otherProvider + ')</em>';
			
			//Si c'est le bon prefLabel
			if (conceptDescription.rdf$about.match(regExpPrefLabel)) {
				if ($.isArray(conceptDescription.tps$provider)) {
					$.each(conceptDescription.tps$provider, function(key, val){
						if (val.skos$Concept == null)
							return true;
						
						if (options.selectBroader) {
							if (val.skos$Concept.skos$broader == null)
								return true;
							if ($.isArray(val.skos$Concept.skos$broader)) {
								$.each(val.skos$Concept.skos$broader, function(keyBroader, valBroader) {
									if (valBroader.skos$Concept == null)
										return true;
									if (valBroader.skos$Concept.skos$prefLabel == null)
										return true;
									if (valBroader.skos$Concept.skos$prefLabel.$t == null)
										return true;
									
									if ($.inArray(valBroader.skos$Concept.skos$prefLabel.$t, listProviders) == -1) {
										$('select[name="skostree-selector-providers"]').append('<option value="'+ valBroader.skos$Concept.skos$prefLabel.$t +'">'+ valBroader.skos$Concept.skos$prefLabel.$t +'</option>');
										listProviders.push(valBroader.skos$Concept.skos$prefLabel.$t);
									}
									providerOf += valBroader.skos$Concept.skos$prefLabel.$t + '|';
								});
							} else {
								if (val.skos$Concept.skos$broader == null)
									return true;
								if (val.skos$Concept.skos$broader.skos$Concept == null)
									return true;
								if (val.skos$Concept.skos$broader.skos$Concept.skos$prefLabel == null)
									return true;
								if (val.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t == null)
									return true;
								
								if ($.inArray(val.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t, listProviders) == -1) {
									$('select[name="skostree-selector-providers"]').append('<option value="'+ val.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t +'">'+ val.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t +'</option>');
									listProviders.push(val.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t);
								}
								providerOf += val.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t + '|';
							}
						} else {
							if (val.skos$Concept.skos$prefLabel == null)
								return true;
							if (val.skos$Concept.skos$prefLabel.$t == null)
								return true;
							
							if ($.inArray(val.skos$Concept.skos$prefLabel.$t, listProviders) == -1) {
								$('select[name="skostree-selector-providers"]').append('<option value="'+ val.skos$Concept.skos$prefLabel.$t +'">'+ val.skos$Concept.skos$prefLabel.$t +'</option>');
								listProviders.push(val.skos$Concept.skos$prefLabel.$t);
							}
							providerOf += val.skos$Concept.skos$prefLabel.$t + '|';
						}
					});
				} else {
					if (conceptDescription.tps$provider.skos$Concept == null)
						return '<em class="skostree-provider">(' + otherProvider + ')</em>';
					
					if (options.selectBroader) {
						if (conceptDescription.tps$provider.skos$Concept.skos$broader == null)
							return '<em class="skostree-provider">(' + otherProvider + ')</em>';
						
						if ($.isArray(conceptDescription.tps$provider.skos$Concept.skos$broader)) {
							$.each(conceptDescription.tps$provider.skos$Concept.skos$broader, function(keyBroader, valBroader) {
								if (valBroader.skos$Concept == null)
									return true;
								if (valBroader.skos$Concept.skos$prefLabel == null)
									return true;
								if (valBroader.skos$Concept.skos$prefLabel.$t == null)
									return true;
								
								if ($.inArray(valBroader.skos$Concept.skos$prefLabel.$t, listProviders) == -1) {
									$('select[name="skostree-selector-providers"]').append('<option value="'+ valBroader.skos$Concept.skos$prefLabel.$t +'">'+ valBroader.skos$Concept.skos$prefLabel.$t +'</option>');
									listProviders.push(valBroader.skos$Concept.skos$prefLabel.$t);
								}
								providerOf += valBroader.skos$Concept.skos$prefLabel.$t + '|';
							});
						} else {
							if (conceptDescription.tps$provider.skos$Concept.skos$broader == null)
								return true;
							if (conceptDescription.tps$provider.skos$Concept.skos$broader.skos$Concept == null)
								return true;
							if (conceptDescription.tps$provider.skos$Concept.skos$broader.skos$Concept.skos$prefLabel == null)
								return true;
							if (conceptDescription.tps$provider.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t == null)
								return true;
							
							if ($.inArray(conceptDescription.tps$provider.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t, listProviders) == -1) {
								$('select[name="skostree-selector-providers"]').append('<option value="'+ conceptDescription.tps$provider.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t +'">'+ conceptDescription.tps$provider.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t +'</option>');
								listProviders.push(conceptDescription.tps$provider.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t);
							}
							providerOf += conceptDescription.tps$provider.skos$Concept.skos$broader.skos$Concept.skos$prefLabel.$t + '|';
						}
						
					} else {
						if (conceptDescription.tps$provider.skos$Concept.skos$prefLabel == null)
							return '<em class="skostree-provider">(' + otherProvider + ')</em>';
						if (conceptDescription.tps$provider.skos$Concept.skos$prefLabel.$t == null)
							return '<em class="skostree-provider">(' + otherProvider + ')</em>';
						
						if ($.inArray(conceptDescription.tps$provider.skos$Concept.skos$prefLabel.$t, listProviders) == -1) {
							$('select[name="skostree-selector-providers"]').append('<option value="'+conceptDescription.tps$provider.skos$Concept.skos$prefLabel.$t +'">'+ conceptDescription.tps$provider.skos$Concept.skos$prefLabel.$t +'</option>');
							listProviders.push(conceptDescription.tps$provider.skos$Concept.skos$prefLabel.$t);
						}
						providerOf = conceptDescription.tps$provider.skos$Concept.skos$prefLabel.$t;
					}
				}
			}
		}
		
		if (providerOf == null)
			return '<em class="skostree-provider">(' + otherProvider + ')</em>';
		//Suppression du '|' final
		providerOf = providerOf.substring(0, providerOf.length - 1);
		
		//Appel pour les autres selecteurs
		return '<em class="skostree-provider">(' + otherProvider + providerOf + ')</em>';
	}
	//Fin providerOf()
	
	
// ----------------------------------------- Select (provider) --------------------------------------------------------
	
	if (options.disp.selector.provider) {
		//providers (listProviders +  barré)
		$('#skostree-selector').append('<select id="skostree-selector-providers" name="skostree-selector-providers"><option selected>'+ options.legende.allProvider +'</option></select>');
		$('#skostree-selector-providers').change(function () {
			$("#skostree-selector-providers option:selected").each(function () {
				if ($(this).text() == options.legende.allProvider) {
					$('.skostree-text').css({
						'text-decoration': 'none',
						'color': 'black'
					});
					return false;
				} else {
					$('.skostree-text').css({
						'text-decoration': 'none',
						'color': 'black'
					});
					$('.skostree-text').not($('.skostree-text:contains("'+$(this).text()+'")')).css({
						'text-decoration': 'line-through',
						'color': 'silver'
					});
					return false;
				}
				});
		});
	}
	
// ----------------------------------------- Select (semCategory) --------------------------------------------------------
	
	if (options.disp.selector.semCategory) {
		//semCategory (listProviders +  barré)
		$('#skostree-selector').append('<select id="skostree-selector-semCategory" name="skostree-selector-semCategory"><option selected>'+ options.legende.allSemCategory +'</option></select>');
		$('#skostree-selector-semCategory').change(function () {
			$("#skostree-selector-semCategory option:selected").each(function () {
				if ($(this).text() == options.legende.allSemCategory) {
					$('.skostree-text').css({
						'text-decoration': 'none',
						'color': 'black'
					});
					return false;
				} else {
					$('.skostree-text').css({
						'text-decoration': 'none',
						'color': 'black'
					});
					$('.skostree-text').not($('.skostree-text:contains("'+$(this).text()+'")')).css({
						'text-decoration': 'line-through',
						'color': 'silver'
					});
					return false;
				}
				});
		});
	}
	
// ----------------------------------------- Select (scopeDomain) --------------------------------------------------------
	
	if (options.disp.selector.scopeDomain) {
		//scopeDomain (listProviders +  barré)
		$('#skostree-selector').append('<select id="skostree-selector-scopeDomain" name="skostree-selector-scopeDomain"><option selected>'+ options.legende.allScopeDomain +'</option></select>');
		$('#skostree-selector-scopeDomain').change(function () {
			$("#skostree-selector-scopeDomain option:selected").each(function () {
				if ($(this).text() == options.legende.allScopeDomain) {
					$('.skostree-text').css({
						'text-decoration': 'none',
						'color': 'black'
					});
					return false;
				} else {
					$('.skostree-text').css({
						'text-decoration': 'none',
						'color': 'black'
					});
					$('.skostree-text').not($('.skostree-text:contains("'+$(this).text()+'")')).css({
						'text-decoration': 'line-through',
						'color': 'silver'
					});
					return false;
				}
				});
		});
	}
	
// ----------------------------------------- Select (originDomain) --------------------------------------------------------
	
	if (options.disp.selector.originDomain) {
		//originDomain (listProviders +  barré)
		$('#skostree-selector').append('<select id="skostree-selector-originDomain" name="skostree-selector-originDomain"><option selected>'+ options.legende.allOriginDomain +'</option></select>');
		$('#skostree-selector-originDomain').change(function () {
			$("skostree-selector-originDomain option:selected").each(function () {
				if ($(this).text() == options.legende.allOriginDomain) {
					$('.skostree-text').css({
						'text-decoration': 'none',
						'color': 'black'
					});
					return false;
				} else {
					$('.skostree-text').css({
						'text-decoration': 'none',
						'color': 'black'
					});
					$('.skostree-text').not($('.skostree-text:contains("'+$(this).text()+'")')).css({
						'text-decoration': 'line-through',
						'color': 'silver'
					});
					return false;
				}
				});
		});
	}
	
// ----------------------------------------- Légende --------------------------------------------------------
	
	$('#skostree-legende').append('<div id="skostree-legende-titre">' + options.legende.titre + '</div><div id="skostree-legende-body">'+
	
	'<img src="' + options.img + '/' + options.images.puceCourant + '" alt="PuceCourant" />' + options.legende.courant + '<br />'+
	
	((!options.legende.minimum || options.disp.broader)? '<img src="' + options.img + '/' + options.images.puceBroader + '" alt="PuceBroader" />' + options.legende.broader + '<br />' : '') +
	
	((!options.legende.minimum || options.disp.related)?'<img src="' + options.img + '/' + options.images.puceRelated + '" alt="PuceRelated" />' + options.legende.related + '<br />' : '') +
	
	((!options.legende.minimum || options.disp.narrower)?'<img src="' + options.img + '/' + options.images.puceNarrower + '" alt="PuceNarrower" />' + options.legende.narrower + '<br />' : '') +
	((!options.legende.minimum || options.disp.exactMatch)?'<img src="' + options.img + '/' + options.images.puceexactMatch + '" alt="PuceexactMatch" />' + options.legende.exactMatch + '<br />' : '') +
	((!options.legende.minimum || options.disp.closeMatch)?'<img src="' + options.img + '/' + options.images.pucecloseMatch + '" alt="PucecloseMatch" />' + options.legende.closeMatch + '<br />' : '') +
	
	((!options.legende.minimum || options.disp.specific)?'<img src="' + options.img + '/' + options.images.puceSpecific + '" alt="PuceSpecific" />' + options.legende.specific + '<br />' : '') +
	
	//'<img src="' + options.img + '/' + options.images.plus + '" alt="Plus" />' + options.legende.plus + '<br />'+
	
	'<img src="' + options.img + '/' + options.images.puceError + '" alt="PuceError" />' + options.legende.error + '<br />'+
	
	'</div>');
	
// ----------------------------------------- Fin Légende --------------------------------------------------------
	
		
	//Ajout du loading
	if(options.disp.loading) {
		$('#skostree').append('<div id="skostree-message"><img src="'+ options.img +'/' + options.images.loading + '" alt="Loading" style="display: none" /></div>');
		$('img[src="'+ options.img +'/' + options.images.loading + '"]').css({
			'display' : 'inline'
		});
	}
	
	//Requete ajax pour courant (vocSid passé en parram)
	$.ajax({
		url : options.preUrl + parseHREF(options.vocSid) + options.postUrl,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		method : 'GET',
		beforeSend : function(req) {
			req.setRequestHeader('Authorization', "Basic " + options.basic);
		},
		
		error: function(data){
			$('img[src="'+ options.img +'/' + options.images.loading + '"]').css({
				'display' : 'none'
			});
			if(options.dispWarning) {
				$('#skostree').append('<div id="skostree-lev0" class="skostree-lev0"><span class="skostree-error"><img src="' + options.img + '/' + options.images.puceCourant + '" alt="puceCourant" /><img src="' + options.img + '/' + options.images.puceError + '" alt="puceError" />' + o.vocSid + options.error.courant + data.responseText + '</span></div>');
			}
			ajaxError = true;
		},
		
		//Requete OK
		success: function(data) {

			//Tableau de booléen en fonction du niveau du père (pour afficher ou non les traits verticaux)
			var traitVerticaux = [];

			//Loading terminé
			$('img[src="' + options.img + '/' + options.images.loading + '"]').css({
				'display' : 'none'
			});
			
			//Append du titre
			$('#skostree').append('<div id="skostree-titre">' + options.titre + '</div>');
			var voc = "/"+options.vocSid.split("/")[options.vocSid.split("/").length-2]+"/";
			
			//Each pour placer valCourant au niveau du concept broader
			$.each(data, function(keyCourant, valCourant){
				
				//Stockage des providers
				description = valCourant.rdf$Description;
				
				//Providers de Courant
				var providerCourant = providerOf(valCourant);
        var depth = (valCourant.tps$depth != null)? "<span class='skostree-depth'> ["+valCourant.tps$depth+"] </span>": '';

				if (valCourant.skos$prefLabel != null) {
					//Si le prefLabel est un tableau
					if ($.isArray(valCourant.skos$prefLabel)) {
						//Quel prefLabel pour la langue
						var iLangCourant = 0;
						$.each(valCourant.skos$prefLabel, function(key, val) {
						   if (val.xml$lang == options.lang) {
								return false;
							}
							iLangCourant++;
						});
						
            if(iLangCourant >= valCourant.skos$prefLabel.length)
						   iLangCourant = 0;
						   
						if (valCourant.skos$prefLabel[iLangCourant] != null) {
							if (valCourant.skos$prefLabel[iLangCourant].$t != null) {
									//Append de Courant
									var titledisp=  valCourant.skos$prefLabel[iLangCourant].$t+"&#013 ( "+valCourant.rdf$about+" )";
									$('#skostree').append('<div id="skostree-lev0" class="skostree-lev0"><img src="' + options.img + '/' + options.images.puceCourant + '" alt="puceCourant" /><span title="'+titledisp+'" class="skostree-text">' + valCourant.skos$prefLabel[iLangCourant].$t + providerCourant +'</span>'+depth +'</div>');
							} else {
								if(options.dispWarning) {
									$('#skostree').append('<div id="skostree-lev0" class="skostree-lev0"><img src="' + options.img + '/' + options.images.puceCourant + '" alt="puceCourant" /><span class="skostree-text">' + options.error.tTab + options.vocSid + '</span></div>');
								}
							}
						} else {
							if(options.dispWarning) {
								$('#skostree').append('<div id="skostree-lev0" class="skostree-lev0"><img src="' + options.img + '/' + options.images.puceCourant + '" alt="puceCourant" /><span class="skostree-text">' + options.error.prefLabelTab + options.vocSid + '</span></div>');
							}
						}
					} else {
						//PrefLabel n'est pas un tableau
						if (valCourant.skos$prefLabel.$t != null) {
							//Append de Courant
							var titledisp=  valCourant.skos$prefLabel.$t+"&#013 ( "+valCourant.rdf$about+" )";
							$('#skostree').append('<div id="skostree-lev0" class="skostree-lev0"><img src="' + options.img + '/' + options.images.puceCourant + '" alt="puceCourant" /><span title="'+titledisp+'" class="skostree-text">' + valCourant.skos$prefLabel.$t + providerCourant +'</span>'+depth+'</div>');
						} else {
							if(options.dispWarning) {
								$('#skostree').append('<div id="skostree-lev0" class="skostree-lev0"><img src="' + options.img + '/' + options.images.puceCourant + '" alt="puceCourant" /><span class="skostree-text">' + options.error.t + options.vocSid + '</span></div>');
							}
						}
					}
				} else {
					if(options.dispWarning) {
						$('#skostree').append('<div id="skostree-lev0" class="skostree-lev0"><img src="' + options.img + '/' + options.images.puceCourant + '" alt="puceCourant" /><span class="skostree-text">' + options.error.prefLabel + options.vocSid + '</span></div>');
					}
				}
				
				/**
				 * Affiche les broader de lev0 (Courant) avant celui-ci
				 *
				 * Appel premier avec n=-1 et concept est un skos$Concept
				 *
				 * @param concept, skos$Concept (concept a afficher)
				 * @param n int, niveau (lev) de la div (négatif car broader)
				 */
				function afficheBroader(concept, n) {
					//Ckeck : concept = null (on ne sait jamais)
					if (concept == null) {
						if(options.dispWarning) {
							$('.skostree-lev'+(n+1) + ':last').before('<div class="skostree-lev'+n+'">' + ((options.disp.errorLink)? '<a href="' + options.onChange(parseHREF(concept.rdf$resource)) + '">' : '') + '<span class="skostree-error" >' + options.error.conceptNull + '</span>' + ((options.disp.errorLink)? '</a>' : '') + '<img src="' + options.img + '/' + options.images.puceError + '" alt="puceError" /><img src="' + options.img + '/' + options.images.puceBroader + '" alt="puce" /><img alt="cornerTopRight" src="' + options.img + '/' + options.images.cornerTopRight + '" /></div>');
							
							//Ajout des images
							for(var i = n+1; i<0; i++) {
								//Img vide ou trait
								if(traitVerticaux[i+1]) {
									$('.skostree-lev'+ n + ':last').append('<img alt="verticalLine-lev'+i+'" src="' + options.img + '/' + options.images.verticalLine + '"/>');
								} else {
									$('.skostree-lev'+ n + ':last').append('<img alt="imgVide-lev'+i+'" src="' + options.img + '/' + options.images.vide + '"/>');
								}
							}
						}
						return;
					}
					
//PRE : about -> resource
					if (concept.rdf$resource == null) {
						concept.rdf$resource = concept.rdf$about;
					}
					var idConcept = concept.rdf$about;
					
					//Sortie normale
					if (concept.rdf$resource.match('TE-00') == 'TE-00') {
						return;
					}
					
					//Limite = 0 -> limite infinie
					if (options.limite > 0) {
						//check des limites
						if (n > options.limite || n < -options.limite) {
							return;
						}
					}
					//Check si prefLabel (erreur ac POPIN)
					if (concept.skos$prefLabel == null) {
						if(options.dispWarning) {
							$('.skostree-lev'+ (n+1) + ':last').before('<div class="skostree-lev'+n+'">' + ((options.disp.errorLink)? '<a href="'+ options.onChange(parseHREF(concept.rdf$resource)) + '">' : '') + '<span class="skostree-error">' + options.error.prefLabel + concept.rdf$resource + ((options.disp.errorLink)? '</a>' : '') + '</span><img src="' + options.img + '/' + options.images.puceError + '" alt="puceError" /><img src="' + options.img + '/' + options.images.puceBroader + '" alt="puce" /><img alt="cornerTopRight" src="' + options.img + '/' + options.images.cornerTopRight + '" /></div>');
							
							//Ajout des images
							for(var i = n+1; i<0; i++) {
								//Img vide ou trait
								if(traitVerticaux[i+1]) {
									$('.skostree-lev'+ n + ':last').append('<img alt="verticalLine-lev'+i+'" src="' + options.img + '/' + options.images.verticalLine + '"/>');
								} else {
									$('.skostree-lev'+ n + ':last').append('<img alt="imgVide-lev'+i+'" src="' + options.img + '/' + options.images.vide + '"/>');
								}
							}
						}
						return;
					} else {
						//Provider
						var provider = providerOf(concept);

            //Si prelLabel est un tableau
						if($.isArray(concept.skos$prefLabel)){
							//1er de la langue choisie
							var iLang = 0;
							$.each(concept.skos$prefLabel, function(key, val) {
								if (val.xml$lang == options.lang) {
									return false;
								}
								iLang++;
							});
							if (concept.skos$prefLabel[iLang] == null) {
								if(options.dispWarning) {
									$('.skostree-lev'+ (n+1) + ':last').before('<div class="skostree-lev'+n+'">' + ((options.disp.errorLink)? '<a href="'+  options.onChange(parseHREF(concept.rdf$resource)) + '">' : '') + '<span class="skostree-error' + options.error.prefLabelTab + concept.rdf$resource + ((options.disp.errorLink)?  '</a>' : '') + '</span><img src="' + options.img + '/' + options.images.puceError + '" alt="puceError" /><img src="' + options.img + '/' + options.images.puceBroader + '" alt="puce" /><img alt="cornerTopRight" src="' + options.img + '/' + options.images.cornerTopRight + '" /></div>');
									
									//Ajout des images
									for(var i = n+1; i<0; i++) {
										//Img vide ou trait
										if(traitVerticaux[i+1]) {
											$('.skostree-lev'+ n+ + ':last').append('<img alt="verticalLine-lev'+i+'" src="' + options.img + '/' + options.images.verticalLine + '"/>');
										} else {
											$('.skostree-lev'+ n+ + ':last').append('<img alt="imgVide-lev'+i+'" src="' + options.img + '/' + options.images.vide + '"/>');
										}
									}
								}
							} else if (concept.skos$prefLabel[iLang].$t == null) {
								if(options.dispWarning) {
									$('.skostree-lev'+ (n+1) + ':last').before('<div class="skostree-lev'+n+'">' + ((options.disp.errorLink)? '<a href="'+  options.onChange(parseHREF(concept.rdf$resource)) + '">' : '') + '<span class="skostree-error">' + options.error.tTab + concept.rdf$resource + ((options.disp.errorLink)?  '</a>' : '') + '</span><img src="' + options.img + '/' + options.images.puceError + '" alt="puceError" /><img src="' + options.img + '/' + options.images.puceBroader + '" alt="puce" /><img alt="cornerTopRight" src="' + options.img + '/' + options.images.cornerTopRight + '" /></div>');
									
									//Ajout des images
									for(var i = n+1; i<0; i++) {
										//Img vide ou trait
										if(traitVerticaux[i+1]) {
											$('.skostree-lev'+ n+ + ':last').append('<img alt="verticalLine-lev'+i+'" src="' + options.img + '/' + options.images.verticalLine + '"/>');
										} else {
											$('.skostree-lev'+ n+ + ':last').append('<img alt="imgVide-lev'+i+'" src="' + options.img + '/' + options.images.vide + '"/>');
										}
									}
								}
							} else {
               
								//Affichage du broader de niveau n avant celui de niveau n+1
								var titledisp=  concept.skos$prefLabel[iLang].$t +"&#013 ( "+idConcept+" )";
								$('.skostree-lev'+(n+1) + ':last').before('<div class="skostree-lev'+n+'"><a href="'+  options.onChange(parseHREF(concept.rdf$resource)) + '" title="'+titledisp+'"><span class="skostree-text">' + concept.skos$prefLabel[iLang].$t + provider +'</span></a><img src="' + options.img + '/' + options.images.puceBroader + '" alt="puce" /><img alt="cornerTopRight" src="' + options.img + '/' + options.images.cornerTopRight + '" /></div>');
							}
						}else {
							if (concept.skos$prefLabel.$t == null) {
								if(options.dispWarning) {
									$('.skostree-lev'+ (n+1) + ':last').before('<div class="skostree-lev'+n+'">' + ((options.disp.errorLink)? '<a href="'+  options.onChange(parseHREF(concept.rdf$resource)) + '">' : '') + '<span class="skostree-error">' + options.error.t + concept.rdf$resource + ((options.disp.errorLink)?  '</a>' : '') + '</span><img src="' + options.img + '/' + options.images.puceError + '" alt="puceError" /><img src="' + options.img + '/' + options.images.puceBroader + '" alt="puce" /><img alt="cornerTopRight" src="' + options.img + '/' + options.images.cornerTopRight + '" /></div>');
									
									//Ajout des images
									for(var i = n+1; i<0; i++) {
										//Img vide ou trait
										if(traitVerticaux[i+1]) {
											$('.skostree-lev'+n + ':last').append('<img alt="verticalLine-lev'+i+'" src="' + options.img + '/' + options.images.verticalLine + '"/>');
										} else {
											$('.skostree-lev'+n + ':last').append('<img alt="imgVide-lev'+i+'" src="' + options.img + '/' + options.images.vide + '"/>');
										}
									}
								}
							} else {
								//Concept.skos$prefLabel n'est pas un tableau
								var titledisp=  concept.skos$prefLabel.$t +"&#013 ( "+idConcept+" )";
								$('.skostree-lev'+(n+1) + ':last').before('<div class="skostree-lev'+n+'"><a href="'+  options.onChange(parseHREF(concept.rdf$resource)) + '" title="'+titledisp+'"><span class="skostree-text">' + concept.skos$prefLabel.$t + provider +'</span></a><img src="' + options.img + '/' + options.images.puceBroader + '" alt="puce" /><img alt="cornerTopRight" src="' + options.img + '/' + options.images.cornerTopRight + '" /></div>');
							}
						}
					}
					//Ajout des images
					for(var i = n+1; i<0; i++) {
						//Img vide ou trait
						if(traitVerticaux[i+1]) {
							$('.skostree-lev'+n + ':last').append('<img alt="verticalLine-lev'+i+'" src="' + options.img + '/' + options.images.verticalLine + '"/>');
						} else {
							$('.skostree-lev'+n + ':last').append('<img alt="imgVide-lev'+i+'" src="' + options.img + '/' + options.images.vide + '"/>');
						}
					}
					
					//Fin de parcours si pas de broader
					if(concept.skos$broader == null){
						return;
					}
					
					//Appel pour tous les broader
					if ($.isArray(concept.skos$broader)){
						$.each(concept.skos$broader, function(key, val) {
							if (key <= concept.skos$broader.length && key > 0) {
								traitVerticaux[n] = true;
							} else {
								traitVerticaux[n] = false;
							}
							afficheBroader(val.skos$Concept, n-1);
						});
					}else {
						traitVerticaux[n] = false;
						afficheBroader(concept.skos$broader.skos$Concept, n-1);
					}
				}
				//Fin de afficheBroader(...)
				
				//So on doit afficher les broaders
				if (options.disp.broader) {
					// Ajout broader (before #skostree-lev0)
					// Appel de la fonction afficheBroader()
					if (valCourant.skos$broader != null) {
						if($.isArray(valCourant.skos$broader)) {
							$.each(valCourant.skos$broader, function(key, val) {
								if (key <= valCourant.skos$broader.length && key > 0) {
									traitVerticaux[0] = true;
								} else {
									traitVerticaux[0] = false;
								}
								afficheBroader(val.skos$Concept, -1);
							});
						}else{
							traitVerticaux[0] = false;
							afficheBroader(valCourant.skos$broader.skos$Concept, -1);
						}
					}
				}
				//Post prod : div autour des broader
				$('#skostree-titre').after('<div id="skostree-broader"></div>');
				$('#skostree-broader').append($('div[class^="skostree-lev-"]'));
				
// ----------------------------------------- Specific --------------------------------------------------------
				
				//Ajout specific (after #skostree-lev0)
				$('#skostree-lev0').after('<div id="skostree-specific"></div>');
					
				//Si on doit afficher les specifics
				if (false){ // Spécifique n'existe plus
				//if (options.disp.specific){
					
					if (valCourant.tps$specific != null) {
						$.each(valCourant.tps$specific, function(key, val){
              // Quand il n'y a qu'un spécifique
							if(typeof(key)== "string") key = 0 ;
							//Si c'est pas un tableau val = rdf$resource
							if ($.isArray(valCourant.tps$specific)) {
//PRE : about -> resource
								if(val.rdf$resource == null) {
									val.rdf$resource = val.rdf$about;
								}
								var aboutSpecific = val.rdf$resource;

							} else {
								var aboutSpecific = val;
							}

							aboutSpecific = parseHREF(aboutSpecific);
							
							//Append de la div à completer
							$('#skostree-specific').append('<div id="skostree-lev1-' + aboutSpecific.replace(/\//g, '-') + '-' + key + '" class="skostree-lev1"></div>');
							
							//Nom + provider (ajax request)
							$.ajax({
								url : options.preUrl + aboutSpecific + options.postUrlSubQuery,
								dataType:"json",
								method : 'GET',
								beforeSend : function(req) {
									req.setRequestHeader('Authorization', "Basic " + options.basic);
									
								},
								
								error: function(dataSpecific){
									if(options.dispWarning) {
										//Affichage de l'erreur
										$('div[id=skostree-lev1-' + aboutSpecific.replace(/\//g, '-') + '-' + key + ']').append('<img src="' + options.img + '/' + options.images.cornerBottomLeft + '" alt="cornerBottomLeft" /><img src="' + options.img + '/' + options.images.puceSpecific + '" alt="puce Specific" /><img src="' + options.img + '/' + options.images.puceError + '" alt="puceError" />' + ((options.disp.errorLink)? '<a href="' +  options.onChange(parseHREF(aboutSpecific)) + '">' : '') + '<span class="skostree-error" >' + aboutSpecific + options.error.specific + dataSpecific.responseText + '</span>' + ((options.disp.errorLink)? '</a>' : ''));
									}
								},
								
								//Requete OK
								success: function(dataSpecific) {
									$.each(dataSpecific, function(keySpecific, valSpecific) {
                  var depth = (valSpecific.tps$depth != null)? "<span class='skostree-depth'> ["+valSpecific.tps$depth+"] </span>": '';
//PRE : about -> resource
										if(valSpecific.rdf$resource == null) {
											valSpecific.rdf$resource = valSpecific.rdf$about;
										}
										
										
										//Plus
										var plusSpecific = (valSpecific.tps$specific != null)? depth+'<img alt="Plus" src="' + options.img + '/' + options.images.plus + '" />': '';
										
										//providers
										var providerSpecific = providerOf(valSpecific, valSpecific.rdf$Description);
										
										if (valSpecific.skos$prefLabel == null) {
											if(options.dispWarning) {
												//Affichage de l'erreur
												$('div[id=skostree-lev1-' + aboutSpecific.replace(/\//g, '-') + '-' + key + ']').append('<img src="' + options.img + '/' + options.images.cornerBottomLeft + '" alt="cornerBottomLeft" /><img src="' + options.img + '/' + options.images.puceSpecific + '" alt="puce Specific" /><img src="' + options.img + '/' + options.images.puceError + '" alt="puceError" />' + ((options.disp.errorLink)? '<a href="' +  options.onChange(parseHREF(valSpecific.rdf$resource)) + '">' : '') + '<span class="skostree-error" >' + options.error.prefLabel + aboutSpecific + '</span>' + ((options.disp.errorLink)? '</a>' : ''));
												return true;
											}
										}
										//Si prefLabel est un tableau
										if($.isArray(valSpecific.skos$prefLabel)){
										
											//1er de la langue choisie
											var iLangSpecific = 0;
											
											$.each(valSpecific.skos$prefLabel, function(key, val) {
												if (val.xml$lang == options.lang) {
													return false;
												}
												iLangSpecific++;
											});
											
											if (valSpecific.skos$prefLabel[iLangSpecific].$t == null) {
												if (options.dispWarning) {
													//Affichage de l'erreur
													$('div[id=skostree-lev1-' + aboutSpecific.replace(/\//g, '-') + '-' + key + ']').append('<img src="' + options.img + '/' + options.images.cornerBottomLeft + '" alt="cornerBottomLeft" /><img src="' + options.img + '/' + options.images.puceSpecific + '" alt="puce Specific" /><img src="' + options.img + '/' + options.images.puceError + '" alt="puceError" />' + ((options.disp.errorLink)? '<a href="' +  options.onChange(parseHREF(valSpecific.rdf$resource)) + '">' : '') + '<span class="skostree-error" >' + options.error.tTab + aboutSpecific + '</span>' + ((options.disp.errorLink)? '</a>' : ''));
												}
												return true;
											}
											//Affichage du specific
											$('div[id=skostree-lev1-' + aboutSpecific.replace(/\//g, '-') + '-' + key + ']').append('<img src="' + options.img + '/' + options.images.cornerBottomLeft + '" alt="cornerBottomLeft" /><img src="' + options.img + '/' + options.images.puceSpecific + '" alt="puce specific" /><a href="' +  options.onChange(parseHREF(valSpecific.rdf$resource)) + '"><span class="skostree-text">'+ valSpecific.skos$prefLabel[iLangSpecific].$t + providerSpecific +'</span></a>' + plusSpecific);

										}else {
										
											if (valSpecific.skos$prefLabel.$t == null) {
												if (options.dispWarning) {
													//Affichage de l'erreur
													$('div[id=skostree-lev1-' + aboutSpecific.replace(/\//g, '-') + '-' + key + ']').append('<img src="' + options.img + '/' + options.images.cornerBottomLeft + '" alt="cornerBottomLeft" /><img src="' + options.img + '/' + options.images.puceSpecific + '" alt="puce Specific" /><img src="' + options.img + '/' + options.images.puceError + '" alt="puceError" />' + ((options.disp.errorLink)? '<a href="' +  options.onChange(parseHREF(valSpecific.rdf$resource)) + '">' : '') + '<span class="skostree-error" >' + options.error.t + aboutSpecific + '</span>' + ((options.disp.errorLink)? '</a>' : ''));
												}
												return true;
											}

											//Affichage du specific
											//dataSpecific.skos$Concept.skos$prefLabel n'est pas un tableau
											
											$('div[id=skostree-lev1-' + aboutSpecific.replace(/\//g, '-') + '-' + key + ']').append('<img src="' + options.img + '/' + options.images.cornerBottomLeft + '" alt="cornerBottomLeft" /><img src="' + options.img + '/' + options.images.puceSpecific + '" alt="puce specific" /><a href="' +  options.onChange(parseHREF(valSpecific.rdf$resource)) + '"><span class="skostree-text">'+ valSpecific.skos$prefLabel.$t + providerSpecific + '</span></a>' + plusSpecific);
											return false;
										}
									});
								}
							});
							if (! $.isArray(valCourant.tps$specific))
								return false; //Pour pas boucler si 1 seul élément
						});
					} else {
						if (options.dispAllWarning)
							$('#skostree-specific').append('<div class="skostree-lev1"><span class="skostree-text-err">' + options.error.noSpecific + '</span></div>');
						else
							$('#skostree-specific').append('<div class="skostree-lev1"></div>');
					}
				}
				
// ----------------------------------------- Narrower --------------------------------------------------------

				//Ajout des narrower
				$('#skostree-specific').before('<div id="skostree-narrower"></div>');
				
				//Si on doit afficher les Narrowers
				if (options.disp.narrower) {
					//Si y'en a (des assiciés)
					
					if (valCourant.skos$narrower != null) {
					
						$.each(valCourant.skos$narrower, function(key, val){
            // Quand il n'y a qu'un spécifique
			      	if(typeof(key)== "string") key = 0 ;
              var puceNarrow = options.images.puceNarrower;
                
              if(typeof(val.tps$computed) !="undefined")
                if(val.tps$computed=="yes") puceNarrow = options.images.puceSpecific
							//Si c'est pas un tableau val = rdf$resource
							if ($.isArray(valCourant.skos$narrower)) {
                
                //PRE : about -> resource
								if(val.rdf$resource == null) {
									val.rdf$resource = val.rdf$about;
								}
								var aboutNarrower = val.rdf$resource;
							} else {
								var aboutNarrower = valCourant.skos$narrower.rdf$resource;
							}
							aboutNarrower = parseHREF(aboutNarrower);
							
							//Ajout de la div à completer
							$('#skostree-narrower').append('<div id="skostree-lev-narrower-' + aboutNarrower.replace(/.\//g, '-') + '-' + key + '" class="skostree-lev-narrower"></div>');
	
							//Nom + provider
	            //var voc = "/"+options.vocSid.split("/")[1]+"/";
	            
	            $.ajax({
								url : options.preUrl + aboutNarrower.replace("./", voc)  + options.postUrlSubQuery,
								dataType:"json",
								method : 'GET',
								beforeSend : function(req) {
									req.setRequestHeader('Authorization', "Basic " + options.basic);
									
								},
								

								error: function(dataNarrower){

									if(options.dispWarning) {
										//Affichage de l'erreur
										$('div[id=skostree-lev-narrower-' + aboutNarrower.replace(/.\//g, '-') + '-' + key + ']').append(((options.disp.errorLink)? '<img src="' + options.img + '/' + options.images.cornerBottomLeft + '" alt="cornerBottomLeft" />'+'<img src="' + options.img + '/' + options.images.puceError + '" alt="puceError" /><img src="' + options.img + '/' + puceNarrow + '" alt="Puce narrower" />'+'<a href="' +  options.onChange(parseHREF(aboutNarrower)) + '">' : '') + '<span class="skostree-error" >' + aboutNarrower + options.error.narrower + dataNarrower.responseText + '</span>' + ((options.disp.errorLink)? '</a>' : ''));
									}
								},
								
								//Requete OK
								success: function(dataNarrower) {

									$.each(dataNarrower, function(keyNarrower, valNarrower) {
                  //PRE : about -> resource
                    
										if(valNarrower.rdf$resource == null) {
											valNarrower.rdf$resource = valNarrower.rdf$about;
										}
										
										//Plus
										var plusNarrower = (valNarrower.tps$specific != null)? ' <img alt="Plus" src="' + options.img + '/' + options.images.plus + '" />': '';
										
										//provider
										var providerNarrower = providerOf(valNarrower, valNarrower.rdf$Description);
										var depth ='';
                    if(valNarrower.tps$depth != null){
                      if(valNarrower.tps$depth != 0)  depth = "<span class='skostree-depth'> ["+valNarrower.tps$depth+"] </span>"
                    }
//                    depth = (valNarrower.tps$depth != null)? "<span class='skostree-depth'> ["+valNarrower.tps$depth+"] </span>": '';

										//Affichage de l'assoc
										if($.isArray(valNarrower.skos$prefLabel)){
										
											//1er de la langue choisie
											var iLangNarrower = 0;
                      $.each(valNarrower.skos$prefLabel, function(key, val) {
											  
												if (val.xml$lang == options.lang) {
													return false;
												}
												iLangNarrower++;
											});
											if(iLangNarrower >=  valNarrower.skos$prefLabel.length)
                        iLangNarrower = 0;

											if (valNarrower.skos$prefLabel[iLangNarrower] == null) {
												if (options.dispWarning) {
													//Affichage de l'erreur
													$('div[id=skostree-lev-narrower-' + aboutNarrower.replace(/.\//g, '-') + '-' + key + ']').append(((options.disp.errorLink)?  '<img src="' + options.img + '/' + options.images.cornerBottomLeft + '" alt="cornerBottomLeft" />'+ '<img src="' + options.img + '/' + puceNarrow + '" alt="Puce narrower" />'+'<img src="' + options.img + '/' + options.images.puceError + '" alt="puceError" />'+'<a href="' +  options.onChange(parseHREF(valNarrower.rdf$resource)) + '">' : '') + '<span class="skostree-error" >' + options.error.tTab + aboutNarrower + '</span>' + ((options.disp.errorLink)? '</a>' : ''));
												}
												return true;
											}
                     
                      var titledisp= valNarrower.skos$prefLabel[iLangNarrower].$t+"&#013 ( "+aboutNarrower.replace("./", voc)+" )";
                      $('div[id=skostree-lev-narrower-' + aboutNarrower.replace(/.\//g, '-') + '-' + key + ']').append('<img src="' + options.img + '/' + options.images.cornerBottomLeft + '" alt="cornerBottomLeft" />'+'<img src="' + options.img + '/' + puceNarrow + '" alt="Puce narrower" />' + '<a href="' +  options.onChange(parseHREF(valNarrower.rdf$resource)) + '" title="'+ titledisp+'"><span class="skostree-text">'+ valNarrower.skos$prefLabel[iLangNarrower].$t + providerNarrower + '</span></a>'+plusNarrower + depth);
										}else {
											
											if (valNarrower.skos$prefLabel.$t == null) {
												if (options.dispWarning) {
													//Affichage de l'erreur
													$('div[id=skostree-lev-narrower-' + aboutNarrower.replace(/.\//g, '-') + '-' + key + ']').append(((options.disp.errorLink)? '<img src="' + options.img + '/' + options.images.cornerBottomLeft + '" alt="cornerBottomLeft" />'+'<img src="' + options.img + '/' + puceNarrow + '" alt="Puce narrower" />'+'<img src="' + options.img + '/' + options.images.puceError + '" alt="puceError" />'+'<a href="' +  options.onChange(parseHREF(valNarrower.rdf$resource)) + '">' : '') + '<span class="skostree-error" >' + options.error.t + aboutNarrower + '</span>' + ((options.disp.errorLink)? '</a>' : ''));
												}
												return true;
											}
											
											//Affichage de l'associé
											//dataSpecific.skos$Concept.skos$prefLabel n'est pas un tableau
                      var titledisp= valNarrower.skos$prefLabel.$t+"&#013 ( "+aboutNarrower.replace("./", voc)+" )";
                      $('div[id=skostree-lev-narrower-' + aboutNarrower.replace(/.\//g, '-') + '-' + key + ']').append('<img src="' + options.img + '/' + options.images.cornerBottomLeft + '" alt="cornerBottomLeft" />'+'<img src="' + options.img + '/' + puceNarrow + '" alt="Puce narrower" />'+'<a href="' +  options.onChange(parseHREF(valNarrower.rdf$resource)) + '" title="'+ titledisp+'"><span class="skostree-text">'+ valNarrower.skos$prefLabel.$t + providerNarrower +'</span></a>'+plusNarrower + depth);
										}
										return false;
									});
								}
							});
							
							//Pour pas boucler si 1 seul élément
							if (! $.isArray(valCourant.skos$narrower))
								return false;
						});
					} else {
						if (options.dispAllWarning)
							$('#skostree-narrower').append('<div class="skostree-lev-narrower"><span class="skostree-text-err">' + options.error.noNarrower + '</span></div>');
						else
							$('#skostree-narrower').append('<div class="skostree-lev-narrower"></div>');
					}
				
				}
				
// ----------------------------------------- EXACTMATCH --------------------------------------------------------

				//Ajout des narrower
				$('#skostree-specific').before('<div id="skostree-exactMatch"></div>');
				
				//Si on doit afficher les Narrowers
				if (options.disp.exactMatch) {
					//Si y'en a (des assiciés)
					if (valCourant.skos$exactMatch != null ) {
					
						$.each(valCourant.skos$exactMatch, function(key, val){
            // Quand il n'y a qu'un spécifique
			      	if(typeof(key)== "string") key = 0 ;

							//Si c'est pas un tableau val = rdf$resource
							if ($.isArray(valCourant.skos$exactMatch)) {
                //PRE : about -> resource
								if(val.rdf$resource == null) {
									val.rdf$resource = val.rdf$about;
								}
								var aboutexactMatch = val.rdf$resource;
							} else {
								var aboutexactMatch = valCourant.skos$exactMatch.rdf$resource;
							}
							aboutexactMatch = parseHREF(aboutexactMatch);
								
							//Ajout de la div à completer
              //AGO: Affichage des narrowwer incorrecte si on enleve pas les ./ des liens
							$('#skostree-exactMatch').append('<div id="skostree-lev-exactMatch-' + aboutexactMatch.replace(/.\//g, '-') + '-' + key + '" class="skostree-lev-exactMatch"></div>');
							//Nom + provider
						 // var voc = "/"+options.vocSid.split("/")[1]+"/";
						  $.ajax({
								url : options.preUrl + aboutexactMatch.replace("./", voc) + options.postUrlSubQuery,
								dataType:"json",
								method : 'GET',
								beforeSend : function(req) {
									req.setRequestHeader('Authorization', "Basic " + options.basic);
									
								},
								

								error: function(dataexactMatch){

									if(options.dispWarning) {
										//Affichage de l'erreur
										$('div[id=skostree-lev-exactMatch-' + aboutexactMatch.replace(/.\//g, '-') + '-' + key + ']').append(((options.disp.errorLink)? '<a href="' +  options.onChange(parseHREF(aboutexactMatch)) + '">' : '') + '<span class="skostree-error" >' + aboutexactMatch + options.error.exactMatch + dataexactMatch.responseText + '</span>' + ((options.disp.errorLink)? '</a>' : '') + '<img src="' + options.img + '/' + options.images.puceError + '" alt="puceError" /><img src="' + options.img + '/' + options.images.puceexactMatch + '" alt="Puce exactMatch" /><img src="' + options.img + '/' + options.images.cornerBottomRight + '" alt="cornerBottomRight" />');
									}
								},
								
								//Requete OK
								success: function(dataexactMatch) {

									$.each(dataexactMatch, function(keyexactMatch, valexactMatch) {
                  //PRE : about -> resource

										if(valexactMatch.rdf$resource == null) {
											valexactMatch.rdf$resource = valexactMatch.rdf$about;
										}
										
										//Plus
										var plusexactMatch = (valexactMatch.tps$specific != null)? ' <img alt="Plus" src="' + options.img + '/' + options.images.plus + '" />': '';
										
										//provider
										var providerexactMatch = providerOf(valexactMatch, valexactMatch.rdf$Description);
										var depth ='';
                    if(valexactMatch.tps$depth != null){
                      if(valexactMatch.tps$depth != 0)  depth = "<span class='skostree-depth'> ["+valexactMatch.tps$depth+"] </span>"
                    }
                    
										//Affichage de l'assoc
										if($.isArray(valexactMatch.skos$prefLabel)){
										
											//1er de la langue choisie
											var iLangexactMatch = 0;
                      
											$.each(valexactMatch.skos$prefLabel, function(key, val) {
												if (val.xml$lang == options.lang) {
													return false;
												}
												iLangexactMatch++;
											});
											if(iLangexactMatch >=  valexactMatch.skos$prefLabel.length)
                        iLangexactMatch = 0;
											if (valexactMatch.skos$prefLabel[iLangexactMatch] == null) {
												if (options.dispWarning) {
													//Affichage de l'erreur
													$('div[id=skostree-lev-exactMatch-' + aboutexactMatch.replace(/.\//g, '-') + '-' + key + ']').append(((options.disp.errorLink)? '<a href="' +  options.onChange(parseHREF(valexactMatch.rdf$resource)) + '">' : '') + '<span class="skostree-error" >' + options.error.tTab + aboutexactMatch + '</span>' + ((options.disp.errorLink)? '</a>' : '') + '<img src="' + options.img + '/' + options.images.puceError + '" alt="puceError" /><img src="' + options.img + '/' + options.images.puceexactMatch + '" alt="Puce exactMatch" /><img src="' + options.img + '/' + options.images.cornerBottomRight + '" alt="cornerBottomRight" />');
												}
												return true;
											}

											//Affichage de l'associé
											var titledisp= valexactMatch.skos$prefLabel[iLangexactMatch].$t+"&#013 ( "+aboutexactMatch.replace("./", voc)+" )";
											$('div[id=skostree-lev-exactMatch-' + aboutexactMatch.replace(/.\//g, '-') + '-' + key + ']').append(plusexactMatch + depth + '<a href="' +  options.onChange(parseHREF(valexactMatch.rdf$resource)) + '" title="'+titledisp+'"><span class="skostree-text">'+ valexactMatch.skos$prefLabel[iLangexactMatch].$t + providerexactMatch + '</span></a><img src="' + options.img + '/' + options.images.puceexactMatch + '" alt="Puce exactMatch" /><img src="' + options.img + '/' + options.images.cornerBottomRight + '" alt="cornerBottomRight" />');
										}else {
											
											if (valexactMatch.skos$prefLabel.$t == null) {
												if (options.dispWarning) {
													//Affichage de l'erreur
													$('div[id=skostree-lev-exactMatch-' + aboutexactMatch.replace(/.\//g, '-') + '-' + key + ']').append(((options.disp.errorLink)? '<a href="' +  options.onChange(parseHREF(valexactMatch.rdf$resource)) + '">' : '') + '<span class="skostree-error" >' + options.error.t + aboutexactMatch + '</span>' + ((options.disp.errorLink)? '</a>' : '') + '<img src="' + options.img + '/' + options.images.puceError + '" alt="puceError" /><img src="' + options.img + '/' + options.images.puceexactMatch + '" alt="Puce exactMatch" /><img src="' + options.img + '/' + options.images.cornerBottomRight + '" alt="cornerBottomRight" />');
												}
												return true;
											}
											
											//Affichage de l'associé
											//dataSpecific.skos$Concept.skos$prefLabel n'est pas un tableau
                      var titledisp= valexactMatch.skos$prefLabel.$t+"&#013 ( "+aboutexactMatch.replace("./", voc)+" )";
											$('div[id=skostree-lev-exactMatch-' + aboutexactMatch.replace(/.\//g, '-') + '-' + key + ']').append(plusexactMatch + depth+'<a href="' +  options.onChange(parseHREF(valexactMatch.rdf$resource)) + '" title="'+titledisp+'"><span class="skostree-text">'+ valexactMatch.skos$prefLabel.$t + providerexactMatch +'</span></a><img src="' + options.img + '/' + options.images.puceexactMatch + '" alt="Puce exactMatch" /><img src="' + options.img + '/' + options.images.cornerBottomRight + '" alt="cornerBottomRight" />');
										}
										return false;
									});
								}
							});
							
							//Pour pas boucler si 1 seul élément
							if (! $.isArray(valCourant.skos$exactMatch))
								return false;
						});
					} else {
						if (options.dispAllWarning)
							$('#skostree-exactMatch').append('<div class="skostree-lev-exactMatch"><span class="skostree-text-err">' + options.error.noexactMatch + '</span></div>');
						else
							$('#skostree-exactMatch').append('<div class="skostree-lev-exactMatch"></div>');
					}
				
				}
				
		// ----------------------------------------- closeMATCH --------------------------------------------------------

				//Ajout des narrower
				//$('#skostree-specific').before('<div id="skostree-exactMatch"></div>');
				
				//Si on doit afficher les Narrowers
				if (options.disp.exactMatch) {
					//Si y'en a (des assiciés)
					if (valCourant.skos$closeMatch != null ) {
					
						$.each(valCourant.skos$closeMatch, function(key, val){
            // Quand il n'y a qu'un spécifique
			      	if(typeof(key)== "string") key = 0 ;

							//Si c'est pas un tableau val = rdf$resource
							if ($.isArray(valCourant.skos$closeMatch)) {
                //PRE : about -> resource
								if(val.rdf$resource == null) {
									val.rdf$resource = val.rdf$about;
								}
								var aboutcloseMatch = val.rdf$resource;
							} else {
								var aboutcloseMatch = valCourant.skos$closeMatch.rdf$resource;
							}
							aboutcloseMatch = parseHREF(aboutcloseMatch);
							
							//Ajout de la div à completer
              //AGO: Affichage des narrowwer incorrecte si on enleve pas les ./ des liens
							$('#skostree-exactMatch').append('<div id="skostree-lev-exactMatch-' + aboutcloseMatch.replace(/.\//g, '-') + '-' + key + '" class="skostree-lev-exactMatch"></div>');
	
							//Nom + provider
							//var voc = "/"+options.vocSid.split("/")[1]+"/";
							
							$.ajax({
								url : options.preUrl + aboutcloseMatch.replace("./", voc) + options.postUrlSubQuery,
								dataType:"json",
								method : 'GET',
								beforeSend : function(req) {
									req.setRequestHeader('Authorization', "Basic " + options.basic);
									
								},
								

								error: function(datacloseMatch){

									if(options.dispWarning) {
										//Affichage de l'erreur
										$('div[id=skostree-lev-exactMatch-' + aboutcloseMatch.replace(/.\//g, '-') + '-' + key + ']').append(((options.disp.errorLink)? '<a href="' +  options.onChange(parseHREF(aboutcloseMatch)) + '">' : '') + '<span class="skostree-error" >' + aboutcloseMatch + options.error.closeMatch + datacloseMatch.responseText + '</span>' + ((options.disp.errorLink)? '</a>' : '') + '<img src="' + options.img + '/' + options.images.puceError + '" alt="puceError" /><img src="' + options.img + '/' + options.images.pucecloseMatch + '" alt="Puce closeMatch" /><img src="' + options.img + '/' + options.images.cornerBottomRight + '" alt="cornerBottomRight" />');
									}
								},
								
								//Requete OK
								success: function(datacloseMatch) {

									$.each(datacloseMatch, function(keycloseMatch, valcloseMatch) {
                  //PRE : about -> resource

										if(valcloseMatch.rdf$resource == null) {
											valcloseMatch.rdf$resource = valcloseMatch.rdf$about;
										}
										
										//Plus
										var pluscloseMatch = (valcloseMatch.tps$specific != null)? ' <img alt="Plus" src="' + options.img + '/' + options.images.plus + '" />': '';
										
										//provider
										var providercloseMatch = providerOf(valcloseMatch, valcloseMatch.rdf$Description);
										var depth ='';
                    if(valcloseMatch.tps$depth != null){
                      if(valcloseMatch.tps$depth != 0)  depth = "<span class='skostree-depth'> ["+valcloseMatch.tps$depth+"] </span>"
                    }
                    
										//Affichage de l'assoc
										if($.isArray(valcloseMatch.skos$prefLabel)){
										
											//1er de la langue choisie
											var iLangcloseMatch = 0;
                      
											$.each(valcloseMatch.skos$prefLabel, function(key, val) {
												if (val.xml$lang == options.lang) {
													return false;
												}
												iLangcloseMatch++;
											});
											if(iLangcloseMatch >=  valcloseMatch.skos$prefLabel.length)
                        iLangcloseMatch = 0;
                        
											if (valcloseMatch.skos$prefLabel[iLangcloseMatch] == null) {
												if (options.dispWarning) {
													//Affichage de l'erreur
													$('div[id=skostree-lev-exactMatch-' + aboutcloseMatch.replace(/.\//g, '-') + '-' + key + ']').append(((options.disp.errorLink)? '<a href="' +  options.onChange(parseHREF(valcloseMatch.rdf$resource)) + '">' : '') + '<span class="skostree-error" >' + options.error.tTab + aboutcloseMatch + '</span>' + ((options.disp.errorLink)? '</a>' : '') + '<img src="' + options.img + '/' + options.images.puceError + '" alt="puceError" /><img src="' + options.img + '/' + options.images.pucecloseMatch + '" alt="Puce exactMatch" /><img src="' + options.img + '/' + options.images.cornerBottomRight + '" alt="cornerBottomRight" />');
												}
												return true;
											}

											//Affichage de l'associé
											var titledisp= valcloseMatch.skos$prefLabel[iLangcloseMatch].$t+"&#013 ( "+aboutcloseMatch.replace("./", voc)+" )";
											$('div[id=skostree-lev-exactMatch-' + aboutcloseMatch.replace(/.\//g, '-') + '-' + key + ']').append(pluscloseMatch + depth + '<a href="' +  options.onChange(parseHREF(valcloseMatch.rdf$resource)) + '"  title="'+titledisp+'"><span class="skostree-text">'+ valcloseMatch.skos$prefLabel[iLangcloseMatch].$t + providercloseMatch + '</span></a><img src="' + options.img + '/' + options.images.pucecloseMatch + '" alt="Puce closeMatch" /><img src="' + options.img + '/' + options.images.cornerBottomRight + '" alt="cornerBottomRight" />');
										}else {
											
											if (valcloseMatch.skos$prefLabel.$t == null) {
												if (options.dispWarning) {
													//Affichage de l'erreur
													$('div[id=skostree-lev-exactMatch-' + aboutcloseMatch.replace(/.\//g, '-') + '-' + key + ']').append(((options.disp.errorLink)? '<a href="' +  options.onChange(parseHREF(valcloseMatch.rdf$resource)) + '">' : '') + '<span class="skostree-error" >' + options.error.t + aboutcloseMatch + '</span>' + ((options.disp.errorLink)? '</a>' : '') + '<img src="' + options.img + '/' + options.images.puceError + '" alt="puceError" /><img src="' + options.img + '/' + options.images.pucecloseMatch + '" alt="Puce closeMatch" /><img src="' + options.img + '/' + options.images.cornerBottomRight + '" alt="cornerBottomRight" />');
												}
												return true;
											}
											
											//Affichage de l'associé
											//dataSpecific.skos$Concept.skos$prefLabel n'est pas un tableau
                      var titledisp= valcloseMatch.skos$prefLabel.$t+"&#013 ( "+aboutcloseMatch.replace("./", voc)+" )";
											$('div[id=skostree-lev-exactMatch-' + aboutcloseMatch.replace(/.\//g, '-') + '-' + key + ']').append(pluscloseMatch + depth+'<a href="' +  options.onChange(parseHREF(valcloseMatch.rdf$resource)) + '" title="'+titledisp+'"><span class="skostree-text">'+ valcloseMatch.skos$prefLabel.$t + providercloseMatch +'</span></a><img src="' + options.img + '/' + options.images.pucecloseMatch + '" alt="Puce closeMatch" /><img src="' + options.img + '/' + options.images.cornerBottomRight + '" alt="cornerBottomRight" />');
										}
										return false;
									});
								}
							});
							
							//Pour pas boucler si 1 seul élément
							if (! $.isArray(valCourant.skos$closeMatch))
								return false;
						});
					} else {
						if (options.dispAllWarning)
							$('#skostree-exactMatch').append('<div class="skostree-lev-exactMatch"><span class="skostree-text-err">' + options.error.nocloseMatch + '</span></div>');
						else
							$('#skostree-exactMatch').append('<div class="skostree-lev-exactMatch"></div>');
					}
				
				}
							
// ----------------------------------------- Related --------------------------------------------------------
				
				//Ajout related (before #skostree-lev0)
				$('#skostree-lev0').before('<div id="skostree-related"></div>');

				
				if (options.disp.related) {
        	if (valCourant.skos$related != null) {
						$.each(valCourant.skos$related, function(key, val){
							if(typeof(key)== "string") key = 0 ;

							//Si c'est pas un tableau val = rdf$resource
							if ($.isArray(valCourant.skos$related)) {
//PRE : about -> resource
								if(val.rdf$resource == null) {
									val.rdf$resource = val.rdf$about;
								}
								var aboutRelated = val.rdf$resource;
							} else {
								var aboutRelated = valCourant.skos$related.rdf$resource;
							}
							aboutRelated = parseHREF(aboutRelated);

							//Append de la div à completer
							$('#skostree-related').append('<div id="skostree-related-' + aboutRelated.replace(/.\//g, '-') + '-' + key + '" class="skostree-related"></div>');
						
							//Nom + provider (ajax request)
							//var voc = "/"+options.vocSid.split("/")[1]+"/";
							$.ajax({
								url : options.preUrl + aboutRelated.replace("./", voc) + options.postUrlSubQuery,
								dataType:"json",
								method : 'GET',
								beforeSend : function(req) {
									req.setRequestHeader('Authorization', "Basic " + options.basic);
									
								},
								error: function(dataRelated){				
								  if(options.dispWarning) {
										//Affichage de l'erreur
										$('div[id=skostree-related-' + aboutRelated + '-' + key + ']').append('<img src="' + options.img + '/' + options.images.cornerTopLeft + '" alt="cornerTopLeft" /><img src="' + options.img + '/' + options.images.puceRelated + '" alt="puce related" /><img src="' + options.img + '/' + options.images.puceError + '" alt="puceError" />' + ((options.disp.errorLink)? '<a href="' +  options.onChange(parseHREF(aboutRelated)) + '">' : '') + '<span class="skostree-error" >' + aboutRelated + options.error.related + dataRelated.responseText + '</span>' + ((options.disp.errorLink)? '</a>' : ''));
									}
								},
								
								//Requete OK
								success: function(dataRelated) {
									$.each(dataRelated, function(keyRelated, valRelated) {
//PRE : about -> resource
										if(valRelated.rdf$resource == null) {
											valRelated.rdf$resource = valRelated.rdf$about;
										}
										
										//Plus
										var plusRelated = (valRelated.tps$specific != null)? ' <img alt="Plus" src="' + options.img + '/' + options.images.plus + '" />': '';
										
										//providers
										var providerRelated = providerOf(valRelated, valRelated.rdf$Description);
                    var depth ='';
                    if(valRelated.tps$depth != null){
                      if(valRelated.tps$depth != 0)  depth = "<span class='skostree-depth'> ["+valRelated.tps$depth+"] </span>"
                    }
                    
                    
										//Si prefLabel est un tableau
										if($.isArray(valRelated.skos$prefLabel)){
										
											//1er de la langue choisie
											var iLangRelated = 0;
											
											$.each(valRelated.skos$prefLabel, function(key, val) {
												if (val.xml$lang == options.lang) {
													return false;
												}
												iLangRelated++;
											});
											if(iLangRelated >=  valRelated.skos$prefLabel.length)
                        iLangRelated = 0;
                        
											if (valRelated.skos$prefLabel[iLangRelated].$t == null) {
												if (options.dispWarning) {
													//Affichage de l'erreur
													$('div[id=skostree-related-' + aboutRelated.replace(/.\//g, '-') + '-' + key + ']').append('<img src="' + options.img + '/' + options.images.cornerTopLeft + '" alt="cornerTopLeft" /><img src="' + options.img + '/' + options.images.puceRelated + '" alt="puce related" /><img src="' + options.img + '/' + options.images.puceError + '" alt="puceError" />' + ((options.disp.errorLink)? '<a href="' +  options.onChange(parseHREF(valRelated.rdf$resource)) + '">' : '') + '<span class="skostree-error" >' + options.error.tTab + aboutRelated + '</span>' + ((options.disp.errorLink)? '</a>' : ''));
												}
												return true;
											}
											
											//Affichage du related
											var titledisp= valRelated.skos$prefLabel[iLangRelated].$t+"&#013 ( "+aboutRelated.replace("./", voc)+" )";
											$('div[id=skostree-related-' + aboutRelated.replace(/.\//g, '-') + '-' + key + ']').append('<img src="' + options.img + '/' + options.images.cornerTopLeft + '" alt="cornerTopLeft" /><img src="' + options.img + '/' + options.images.puceRelated + '" alt="puce related" /><a href="' +  options.onChange(parseHREF(valRelated.rdf$resource)) + '" title="'+titledisp+'"><span class="skostree-text">'+ valRelated.skos$prefLabel[iLangRelated].$t + providerRelated + '</span></a>'+depth + plusRelated);
										}else {
											
											if (valRelated.skos$prefLabel.$t == null) {
												if (options.dispWarning) {
													//Affichage de l'erreur
													$('div[id=skostree-related-' + aboutRelated.replace(/.\//g, '-') + '-' + key + ']').append('<img src="' + options.img + '/' + options.images.cornerTopLeft + '" alt="cornerTopLeft" /><img src="' + options.img + '/' + options.images.puceRelated + '" alt="puce related" /><img src="' + options.img + '/' + options.images.puceError + '" alt="puceError" />' + ((options.disp.errorLink)? '<a href="' +  options.onChange(parseHREF(valRelated.rdf$resource)) + '">' : '') + '<span class="skostree-error" >' + options.error.t + aboutRelated + '</span>' + ((options.disp.errorLink)? '</a>' : ''));
												}
												return true;
											}
										
											//Affichage du related
											//dataRelated.skos$Concept.skos$prefLabel n'est pas un tableau
											var titledisp= valRelated.skos$prefLabel.$t+"&#013 ( "+aboutRelated.replace("./", voc)+" )";
											$('div[id=skostree-related-' + aboutRelated.replace(/.\//g, '-') + '-' + key + ']').append('<img src="' + options.img + '/' + options.images.cornerTopLeft + '" alt="cornerTopLeft" /><img src="' + options.img + '/' + options.images.puceRelated + '" alt="puce related" /><a href="' +  options.onChange(parseHREF(valRelated.rdf$resource)) + '" title="'+titledisp+'"><span class="skostree-text">'+ valRelated.skos$prefLabel.$t + providerRelated +'</span></a>'+depth + plusRelated);
										}
										
										//Post Prod : taille de la div related = taille de la div broader
										if ($('#skostree-broader').height() > $('#skostree-related').height()) {
											$('#skostree-related').css('top', ($('#skostree-broader').height()-$('#skostree-related').height()));
											$('#skostree-broader').css('top', 0);
										} else {
											$('#skostree-broader').css('top', ($('#skostree-related').height()-$('#skostree-broader').height()));
											$('#skostree-related').css('top', 0);
										}
										
										return false;
									});
								}
							});
							
							//Pour pas boucler si 1 seul élément
							if (! $.isArray(valCourant.skos$related))
								return false;
						});
						
					} else {
						if (options.dispAllWarning)
							$('#skostree-related').append('<div class="skostree-lev1"><span class="skostree-text-err">' + options.error.noRelated + '</span></div>');
						else
							$('#skostree-related').append('<div class="skostree-lev1"></div>');
					}
				}
				
			});
			
			//Mise en page		
			$('#skostree-lev0').wrap('<div id="skostree-courant"></div>');

			//Si opera : ajustement de l'alignement
			if ($.browser.opera) {		
				$('#skostree-lev0').css({
					'left': '45.6%'
				});
			}
		
//TODELETE alert de fin pour être sur que ca bug pas
			if(options.dispAllWarning) {
				alert('Fin requête ajax success');
			}
			return false;
		},
		
		complete: function() {

			
		}
	});
	
	return this;
};
})(jQuery)
