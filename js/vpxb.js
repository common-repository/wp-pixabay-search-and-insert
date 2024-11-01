var vpxb_imgs = {};
var vpxb_selected = new Array();
var vpxb_opened = false;
var vpxb_current = '';

function vpxb_insertatcaret(areaId, text) {
	var txtarea = document.getElementById(areaId);
	var scrollPos = txtarea.scrollTop;
	var strPos = 0;
	var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
			"ff" : (document.selection ? "ie" : false));
	if (br == "ie") {
		txtarea.focus();
		var range = document.selection.createRange();
		range.moveStart('character', -txtarea.value.length);
		strPos = range.text.length;
	}
	else if (br == "ff")
		strPos = txtarea.selectionStart;

	var front = (txtarea.value).substring(0, strPos);
	var back = (txtarea.value).substring(strPos, txtarea.value.length);
	txtarea.value = front + text + back;
	strPos = strPos + text.length;
	if (br == "ie") {
		txtarea.focus();
		var range = document.selection.createRange();
		range.moveStart('character', -txtarea.value.length);
		range.moveStart('character', strPos);
		range.moveEnd('character', 0);
		range.select();
	}
	else if (br == "ff") {
		txtarea.selectionStart = strPos;
		txtarea.selectionEnd = strPos;
		txtarea.focus();
	}
	txtarea.scrollTop = scrollPos;
}

function vpxb_escapehtml(html) {
	var fn = function (tag) {
		var charsToReplace = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&#34;'
		};
		return charsToReplace[tag] || tag;
	}
	return html.replace(/[&<>"]/g, fn);
}

jQuery("#vpxb_search").click(function () {
	vpxb_showimages(1);
});

jQuery('.vpxb_btn').live('click', function () {
	eid = jQuery(this).attr('data-editor');
	jQuery('#vpxb_eid').val(eid)
});

jQuery(document).ready(function (jQuery) {
	jQuery('.vpxb_btn').live('click', function () {
		if (vpxb_opened) {
			jQuery.colorbox({
				width    : "930px",
				height   : "460px",
				inline   : true,
				href     : "#vpxb_popup",
				scrolling: false,
				fixed    : true
			});
		} else {
			jQuery.colorbox({
				width    : "648px",
				height   : "460px",
				inline   : true,
				href     : "#vpxb_popup",
				scrolling: false,
				fixed    : true
			});
		}
	});
});

jQuery("#vpxb_page a").live("click", function () {
	jQuery('#vpxb_page').html('');
	vpxb_showimages(jQuery(this).attr("rel"));
});

jQuery("#vpxb_page-select").live("change", function () {
	vpxb_showimages(jQuery(this).val());
});

jQuery("#vpxb_insert").live("click", function () {
	for (var i = 0; i < vpxb_selected.length; i++) {
		vinsert = '';
		valign = '';
		valign2 = '';
		eid = jQuery('#vpxb_eid').val();
		if (jQuery('#vpxb_align').val() != '') {
			valign = ' align="' + vpxb_escapehtml(jQuery('#vpxb_align').val()) + '"';
			valign2 = ' class="' + vpxb_escapehtml(jQuery('#vpxb_align').val()) + '"';
		}
		var cid = vpxb_selected[i];
		if (vpxb_imgs[cid].img_caption != '') {
			vinsert = '[caption id="" ' + valign + ']';
		}
		if (jQuery('#vpxb_link').val() == 1) {
			vinsert += '<a href="' + vpxb_escapehtml(vpxb_imgs[cid].img_site) + '" title="' + vpxb_escapehtml(vpxb_imgs[cid].img_title) + '"';
		}
		if (jQuery('#vpxb_link').val() == 2) {
			vinsert += '<a href="' + vpxb_escapehtml(vpxb_imgs[cid].img_full) + '" title="' + vpxb_escapehtml(vpxb_imgs[cid].img_title) + '"';
		}
		if (jQuery('#vpxb_blank').is(':checked')) {
			vinsert += ' target="_blank"';
		}
		if (jQuery('#vpxb_nofollow').is(':checked')) {
			vinsert += ' rel="nofollow"';
		}
		if (jQuery('#vpxb_link').val() != 0) {
			vinsert += '>';
		}
		vinsert += '<img ' + valign2 + ' src="' + vpxb_escapehtml(vpxb_imgs[cid].img_full) + '" width="' + vpxb_escapehtml(vpxb_imgs[cid].img_width) + '" height="' + vpxb_escapehtml(vpxb_imgs[cid].img_height) + '" title="' + vpxb_escapehtml(vpxb_imgs[cid].img_title) + '" alt="' + vpxb_escapehtml(vpxb_imgs[cid].img_title) + '"/>';
		if (jQuery('#vpxb_link').val() != 0) {
			vinsert += '</a>';
		}
		if (vpxb_imgs[cid].img_caption != '') {
			vinsert += ' ' + vpxb_escapehtml(vpxb_imgs[cid].img_caption) + '[/caption]';
		}
		vinsert += '\n';
		if (!tinyMCE.activeEditor || tinyMCE.activeEditor.isHidden()) {
			vpxb_insertatcaret(eid, vinsert);
		} else {
			tinyMCE.activeEditor.execCommand('mceInsertContent', 0, vinsert);
		}
	}
	jQuery.colorbox.close();
});

jQuery("#vpxb_featured").live("click", function () {
	vffurl = jQuery('#vpxb_url').val();
	jQuery('#vpxb_featured_url').val(vffurl);
	jQuery('#postimagediv div.inside img').remove();
	jQuery('#postimagediv div.inside').prepend('<img src="' + vffurl + '" width="270"/>');
	jQuery.colorbox.close();
});

jQuery("#remove-post-thumbnail").live("click", function () {
	jQuery('#vpxb_featured_url').val('');
});

jQuery(".vpxb_item-overlay").live("click", function (event) {
	var checkbox = jQuery(this).parent().find(':checkbox');
	var checkbox_id = jQuery(this).attr('rel');

	jQuery.colorbox.resize({width: "930px", height: "460px"});
	vpxb_opened = true;
	vpxb_current = checkbox_id;

	if (event.ctrlKey) {

		if (!checkbox.is(':checked')) {
			vpxb_selected.push(checkbox_id);
		} else {
			vpxb_selected.splice(vpxb_selected.indexOf(checkbox_id), 1);
		}

		checkbox.attr('checked', !checkbox.is(':checked'));
	} else {
		if (!checkbox.is(':checked')) {
			vpxb_selected = [checkbox_id];
			jQuery('#vpxb_popup').find('input:checkbox').removeAttr('checked');
			checkbox.attr('checked', !checkbox.is(':checked'));
		}
	}

	jQuery("#vpxb_use-image").show();
	jQuery('#vpxb_title').val(vpxb_imgs[checkbox_id].img_title);
	jQuery('#vpxb_caption').val(vpxb_imgs[checkbox_id].img_caption);
	jQuery('#vpxb_width').val(vpxb_imgs[checkbox_id].img_width);
	jQuery('#vpxb_height').val(vpxb_imgs[checkbox_id].img_height);
	jQuery('#vpxb_site').val(vpxb_imgs[checkbox_id].img_site);
	jQuery('#vpxb_url').val(vpxb_imgs[checkbox_id].img_full);
	jQuery('#vpxb_view').html('<img src="' + vpxb_imgs[checkbox_id].img_full + '"/>');
	jQuery('#vpxb_error').html('');

	jQuery('#vpxb_insert').val('Insert (' + vpxb_selected.length + ')');
	jQuery('#vpxb_save').val('Save&Insert (' + vpxb_selected.length + ')');
});

function vpxb_showimages(page) {
	if (jQuery("#vpxb_input").val() == '') {
		alert('Please enter keyword to search!');
	} else {
		jQuery('#vpxb_spinner').show();
		jQuery('#vpxb_container').html("");

		var USERNAME = vpxb_vars.vpxb_username;
		var API_KEY = vpxb_vars.vpxb_key;
		var PER_PAGE = 8;
		var vurl = "https://pixabay.com/api/?username=" + USERNAME + "&key=" + API_KEY + "&lang=" + jQuery('#vpxb_language').val() + "&image_type=" + jQuery('#vpxb_type').val() + "&orientation=" + jQuery('#vpxb_orientation').val() + "&editors_choice=" + jQuery('#vpxb_editorchoice').val() + "&order=" + jQuery('#vpxb_order').val() + "&safesearch=" + jQuery('#vpxb_safesearch').val() + "&q=" + encodeURIComponent(jQuery('#vpxb_input').val()) + "&per_page=" + PER_PAGE + "&page=" + page;

		jQuery.ajax({
			url     : vurl,
			dataType: "jsonp",
			success : function (data) {
				if (data.totalHits > 0) {
					jQuery('#vpxb_spinner').hide();
					for (var i = 0; i < data.hits.length; i++) {
						img_id = data.hits[i].id;
						img_ext = data.hits[i].webformatURL.split('.').pop().toUpperCase().substring(0, 4);
						img_site = data.hits[i].pageURL;
						img_thumb = data.hits[i].previewURL;
						img_full = data.hits[i].webformatURL;
						img_width = data.hits[i].webformatWidth;
						img_height = data.hits[i].webformatHeight;
						img_title = String(data.hits[i].tags);
						jQuery('#vpxb_container').append('<div class="vpxb_item" bg="' + img_thumb + '"><div class="vpxb_item-overlay" rel="' + img_id + '"></div><div class="vpxb_check"><input type="checkbox" value="' + img_id + '"/></div><span>' +
								img_ext + ' | ' + img_width + 'x' + img_height + '</span></div>'
						)
						vpxb_imgs[img_id] = {
							img_ext    : img_ext,
							img_site   : img_site,
							img_thumb  : img_thumb,
							img_full   : img_full,
							img_width  : img_width,
							img_height : img_height,
							img_title  : img_title,
							img_caption: ''
						};
					}

					jQuery('.vpxb_item').each(function () {
						imageUrl = jQuery(this).attr('bg');
						jQuery(this).css('background-image', 'url(' + imageUrl + ')');
					});

					var vpages = "About " + data.totalHits + " results / Pages: ";

					if ((data.totalHits / PER_PAGE + 1) < 10) {
						for (var j = 1; j < data.totalHits / PER_PAGE + 1; j++) {
							vpages += '<a href="javascript: void (0);" rel="' + j + '" title="Page ' + j + '">' + j + '</a> ';
						}
					} else {
						vpages += '<select id="vpxb_page-select" class="vpxb_page-select">';
						for (var j = 1; j < data.totalHits / PER_PAGE + 1; j++) {
							vpages += '<option value="' + j + '"';
							if (j == page) {
								vpages += ' selected';
							}
							vpages += '>' + j + '</option> ';
						}
						vpages += '</select>';
					}

					jQuery('#vpxb_page').html(vpages);
				} else {
					jQuery('#vpxb_spinner').hide();
					jQuery('#vpxb_container').html('No result! Please try again!');
					jQuery('#vpxb_page').html('');
				}
			}
		});
	}
}

function vpxb_escapehtml(html) {
	return html;
}

function vpxb_isurl(str) {
	var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
			'(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
	return pattern.test(str);
}

//change value
function vpxb_change_value(img_id, img_field, img_value) {
	vpxb_imgs[img_id][img_field] = img_value;
}
jQuery("#vpxb_title").change(function () {
	vpxb_change_value(vpxb_current, 'img_title', jQuery(this).val());
});
jQuery("#vpxb_caption").change(function () {
	vpxb_change_value(vpxb_current, 'img_caption', jQuery(this).val());
});
jQuery("#vpxb_width").change(function () {
	vpxb_change_value(vpxb_current, 'img_width', jQuery(this).val());
});
jQuery("#vpxb_height").change(function () {
	vpxb_change_value(vpxb_current, 'img_height', jQuery(this).val());
});