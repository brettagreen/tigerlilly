/**
 * $(function() {
	$('.chevron').click(function() {
		  $(this).toggleClass('oi-chevron-bottom');
		  $(this).toggleClass('oi-chevron-top');
 		  var hiddenSpan = $(this).siblings('.hidden');
 		  var ellipsisSpan = $(this).siblings('.ellipsis');

		  if ($(this).attr('title') === 'read more') {
			  $(this).attr('title', 'read less');
			  $(this).insertAfter(hiddenSpan)
			  hiddenSpan.css('display', 'inline');
			  ellipsisSpan.css('display', 'none');
		  } else {
			  $(this).attr('title', 'read more');
			  $(this).insertAfter(ellipsisSpan)
			  hiddenSpan.css('display', 'none');
			  ellipsisSpan.css('display', 'inline');
		  }
	});
});
 */
$(function() {
		
	$('.chevron').click(function() {
		  $(this).toggleClass('oi-chevron-bottom');
		  $(this).toggleClass('oi-chevron-top');
 		  var hiddenSpan = $(this).siblings('.hidden');
 		  var ellipsisSpan = $(this).siblings('.ellipsis');

		  if ($(this).attr('title') == 'read more') {
			  $(this).attr('title', 'read less');
			  $(this).insertAfter(hiddenSpan)
			  hiddenSpan.show('blind', 'linear', 800);
			  ellipsisSpan.css('display', 'none');
		  } else {
			  $(this).attr('title', 'read more');
			  $(this).insertAfter(ellipsisSpan)
			  hiddenSpan.hide('blind', 'linear', 800);
			  ellipsisSpan.css('display', 'inline');
		  }
	});
	
	$('.chevron').hover(function() {
        $(this).css('cursor','pointer');
    });
});

