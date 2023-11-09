var bigArr = [],
		scale = {},
		//menuType = "dropdown",
//setup the filter buttons
// labelArr = ["Total", "Men", "Women", "Democrats", "Republicans", "Independents", "Support Deal", "Support Carter", "Whites", "Non-whites", "18-39", "40-64", "65+", "Under $50k", "$50k-$100k", "$100k or more", "Have children", "No children", "Atlanta metro", "Atlanta exurbs"];
  // labelArr = ["Total", "Democrat", "Republican", "Independent", "White", "Black", "North Ga.", "Atlanta Exurbs", "Atlanta Metro", "Southeast Ga.", "Southwest Ga."];
	labelArr = ["Total","Male","Female","High School or less","Some college","College graduate","Under $25,000","$25-49,999","$50-74,999","$75-99,999","$100-149,999","Over $150,000","White","Black","Other race", "18 - 29", "30 - 44", "45 - 64", "65+", "Liberal", "Moderate", "Conservative", "Republican", "Democrat", "Independent"];

$(document).ready(function(){
	$.ajax({
		type: "GET",
		url: "nov2023-poll.xml", // TODO: Update with infile from settings
		dataType: "xml",
		success: init
	});
});

function init(data) {
	console.log("Data loaded ✅");
	createMenus();
	parseQuestions(data);
	setupChart();
	//console.log(menuType)
}

function createMenus() {
	console.log("Create menus");

	var topListGroupHtml = makeMenuHtml('top', 'Btn', makeListGroupHtml);
	var bottomListGroupHtml = makeMenuHtml('bottom', 'Btn', makeListGroupHtml);
	var topDropdownHtml = makeDropdownHtml('top');
	var bottomDropdownHtml = makeDropdownHtml('bottom');

	$('#listGroupTop').html(topListGroupHtml);
	$('#listGroupBottom').html(bottomListGroupHtml);

	if (labelArr.length > 12) {
		$('#dropdownTop').html(topDropdownHtml);
		$('#dropdownBottom').html(bottomDropdownHtml);
	} else {
		$('.list-group-horizontal').removeClass('d-none');
		$('.form-select').addClass('d-none');
	}

	function makeMenuHtml(topOrBottom, btnOrOption, callback) {
		var menuHtml = ``;

		for( var i=0; i<labelArr.length; i++ ){
			menuHtml += callback(i, labelArr, `${ topOrBottom }${ btnOrOption }${ i }`);
		}

		return menuHtml;
	} // makeMenuHtml

	function makeDropdownHtml(topOrBottom) {
		return `
			<select class="form-select form-select-sm" id="${ topOrBottom }Dropdown" aria-label="Demographic selection dropdown">
				${ makeMenuHtml(topOrBottom, 'Option', makeDropdownOption) }
			</select>
			<label for="${ topOrBottom }Dropdown">Select a demographic group to filter results</label>
		`;
	} // makeDropdownHtml ()

	function makeDropdownOption(i, labelArr, targetID) {
		return `<option value="${ labelArr[i] }" data-choice-index='${ i }'>${ labelArr[i] }</option>`;
	}

	function makeListGroupHtml(i, labelArr, targetID) {
		return `
				${ /* class="w-100" forces a break in the row - this is how we are displaying 5 columns, instead of using col-2 (6 columns) or col-3 (4 columns) - that div is wrapped in a div that will display:none at xs breakpoint so it won't interfere with wrapping there */ '' }
				${ (i%5 === 0 && i>0) ? '<div class="w-100 d-none d-sm-block d-md-none"></div>' : '' }
				<div class="col-4 col-sm col-md-2">
					<button class="list-group-item list-group-item-action btn btn-sm ${ i==0 ? 'active' : '' }" data-choice-index='${ i }' id="${ targetID }">${ labelArr[i] }</button>
				 </div>
			`;
	} // makeListGroupHtml

} // createMenus()


function setupChart() {
	scale = chroma.scale('Blues').domain([r_max(),0]); // color scale is based on the maximum number of potential responses to any question, so we can have a more limited range of colors if we don't need to have a lot, and there's no telling how many there could be

	for (var i =0; i< bigArr.length; i++) {
		buildQuestionsHtml(i);
	}

	$("#topBtn0").click(); //default to the first filter


	//find the max number of potential responses to a question for color scale
	function r_max(){
		var max = 0;
		for (var i=0; i< bigArr.length; i++){
			var len = bigArr[i].responseArr.length;
			if ( max < len ){
				max = len;
			}
		}
		return max;
	} // r_max()
} // setupChart()

function buildQuestionsHtml(Qid){

	var qText = '<div id=q'+Qid+'><div id="questionq'+Qid+'" class="question">'+bigArr[Qid].qLabel+'</div><div class="results">';
	for (var i=0; i<bigArr[Qid].responseArr.length; i++){ //-1 from .length if you have totals as your final row (so that you don't have to calculate total responses - useful for making sure all bars are the same length despite rounding)
		qText += '<div class="opt'+i+'percent opt" id="opt'+i+'q'+Qid+'", style="background-color:'+scale(i)+'"><div class="innerlabel">'+bigArr[Qid].responseArr[i].optlabel+'</div></div>'
	}
	qText += '</div></div>';
	var myParent = '#qs';
	/*if(Qid == 8){
		$(myParent).append('<div class="question">Question group intro text</div><div id="groupQ"></div>');
	}
	if(Qid > 7){
		myParent = '#groupQ';
	}*/
	$(myParent).append(qText);
} // buildQuestionsHtml()

function parseQuestions(xml){
	console.log("Parse questions");

	var $listGroupChoices = $("button.list-group-item");
	// $listGroupChoices.on("click change", function(e) {
	// 	changeSelection(e.target);
	// });
	$listGroupChoices.click(function(e) {
		changeSelection(e.target);
	});
	$(".form-select").change(function(e) {
		changeSelection(e.target);
	});

	function changeSelection(target) {
		// we have two different menu types (listGroup and dropdown) depending on viewport and they target properties differently so we'll be doing things twice here

		let btnTxt = target.value || target.innerText; //select menu uses value, listGroup uses innerText
		let $selectedOption = $(`option[value='${ btnTxt }']`); // we are intentionally selecting the option from both top and bottom menues
		let choiceIndex = target.dataset.choiceIndex || $selectedOption.data().choiceIndex;

		$listGroupChoices.not(target).removeClass('active'); //make sure no other buttons are selected

		$selectedOption.prop('selected', true);
		var $selectedChoice = $(`.list-group-item:contains(${ btnTxt })`); //select this and partner button
		$('.dropdown-toggle').text(`${ btnTxt }`);

		$selectedChoice.addClass('active');
		loadResults(choiceIndex);
	}

	$(xml).find("myQuestion").each(function(index){
		this.responseArr = [];
		this.totalsArr = [];
		this.qLabel = $(this).attr("label");
		var Qid = index;

		bigArr.push(this);

		$(this).find("Response").each(function(){
			var option = new Object;
			option.optlabel = $(this).attr('Label');
			option.demogArr = [];
			tempArr = $(this).text().split(',');
			jQuery.each(tempArr, function(b, c){
				option.demogArr.push(+c);
			});//convert to integer and add to demographic breakdown array
			bigArr[Qid].responseArr.push(option);
		});//Response.each

		for (var i=0; i<this.responseArr.length; i++){ //-1 from .length if you have totals as your final row
			//add up each demographic group, so we can use it later to force them to appear to be 100% to account for rounding
			for(var j=0; j<this.responseArr[i].demogArr.length; j++){
				var temp = this.responseArr[i].demogArr[j];
				if(this.totalsArr[j]){
					this.totalsArr[j] += temp;
				} else{
					this.totalsArr[j] = temp;
				}
			}
		}//for

	});//xml.find(myQuestion)


	function loadResults (val){
		var pymChild = new pym.Child();

		for(var i=0; i<bigArr.length; i++){
			var opts = [];
			for(var j=0; j<bigArr[i].responseArr.length; j++){ //-1 from .length if you have totals as your final row
				opts.push(bigArr[i].responseArr[j].demogArr[val]); //associate each demographic slice from each response with their corresponding filter button
				opts.id = val;
			}
			drawBars(i, opts);
		}
    pymChild.sendHeight();
	}//loadResults

	function drawBars(Qid, opts){
		var multiplier = ($("#qs").width()-10)/100; //subtract 10 to give it enough buffer to prevent it overflowing its container when animating
		for(var i=0; i<opts.length; i++){
			/*if(Qid > 7){
				multiplier = ($("#groupQ").width()-10)/100;
			}*/
			var t = multiplier*((100/bigArr[Qid].totalsArr[opts.id]).toFixed(2)); //scale it to account for rounding causing to be more or less than 100//not sure we need the .toFixed(2) anymore now that our data uses whole numbers, this may have been to get around the .float rounding error
			var barWidth = opts[i]*t;
			$('#opt'+i+'q'+Qid).delay(100).animate({'width':barWidth+'px'},'slow').hover(function () {
				$(this).css({'opacity':'0.7'});
			}, function () {
				$('#opt'+i+'q'+Qid).find("span:last").remove();
				$(this).css({'opacity':'1.0'});
			}).qtip({
				content: bigArr[Qid].responseArr[i].optlabel+': <strong>' + Math.round(opts[i]) +'%</strong>',
				position: {
					my: 'top right',
					target: 'mouse',
					viewport: $(window), // Keep it on-screen at all times if possible
					adjust: { x: 10,  y: 10 }
				},
				hide: { fixed: true /*Helps to prevent the tooltip from hiding ocassionally when tracking!*/ },
				style: { classes: 'ui-tooltip-light ui-tooltip-shadow ttip' }
			});//qtip
		}//for(opts.length)
	}//drawbars
};//parseQuestions
