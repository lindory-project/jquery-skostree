$(function() {
	var pre_url = ($.url.param('servSid')) ? $.url.param('servSid') : 'http://sterm.intra.inist.fr:51021';
	$('#skostree').skostree({
		basic : 'YWdvc3RpbmhvLnF1aW50ZWxhQGluaXN0LmZyOmluaXN0MDE=',
		preUrl:  pre_url, //'http://ida.intra.inist.fr:51021',
		//vocSid:  ($.url.param('vocSid')) ? $.url.param('vocSid') : '/termsciences/TE-2508', //Exemple Homme
		 vocSid:  ($.url.param('vocSid')) ? $.url.param('vocSid') : '/termsciences/TE-4902', //Exemple Anatomie
		lang: ($.url.param('lang') == null)?'fr':$.url.param('lang'),
		limite: 4,
		dispWarning: true,
		img : '../images/skostree',
		legende: {
			titre: 'Légende',
			courant: 'Concept courant',
			broader: 'Broader',
			specific: 'Narrower Calculé',
			narrower: 'Narrower',
			exactMatch: 'exactMatch',
			closeMatch: 'closeMatch',
			related: 'Related',
			allProvider: 'Fournisseurs',
			allSemCategory: 'semCategory',
			allOriginDomain: 'originDomain',
			allScopeDomain: 'scopeDomain',
			minimum: false
		},

	});
	
	var hide = true;
	$('#skostree-legende').hide();
	$('#skostree-legende-bulle-help').click(function() {
		if (hide) {
			hide = false;
			$('#skostree-legende').show('slow');
		} else {
			hide = true;
			$('#skostree-legende').hide('slow');
		}
	});
});
