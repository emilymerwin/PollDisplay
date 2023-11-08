var bigArr = [],
		scale = {},
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
	createButtons();
	parseQuestions(data);
	setupChart();
}


function createButtons() {
	console.log("Create buttons");

	var topButtonsHtml = makeButtonsHtml('top');
	var bottomButtonsHtml = makeButtonsHtml('bottom');

	$(document.getElementById('buttonsTop')).html(topButtonsHtml);
	$(document.getElementById('buttonsBottom')).html(bottomButtonsHtml);

	function makeButtonsHtml(topOrBottom) {
		var buttonHtml = ``;
		for( var i=0; i<labelArr.length; i++ ){
			var targetID = `${ topOrBottom }btn${ i }`;
			// Note that these are checkboxes, not radio buttons, because we want to style the matching button on the other (top/bottom) button group to match the one on the active button group. We'll use javascript later to deselect everything other than the most recently clicked button (and it's matching sibling) later
			buttonHtml += `<input type="checkbox" class="btn-check" id="${ targetID }" autocomplete="off" data-label-val="${ labelArr[i] }" data-index-val="${ i }" ${ i==0 ? 'checked' : '' }>
										 <label class="btn btn-outline-primary" for="${ targetID }">${ labelArr[i] }</label>`;
		}
		return buttonHtml;
	}
} // createButtons()

function setupChart() {
	scale = chroma.scale('Blues').domain([r_max(),0]); // color scale is based on the maximum number of potential responses to any question, so we can have a more limited range of colors if we don't need to have a lot, and there's no telling how many there could be

	for (var i =0; i< bigArr.length; i++) {
		buildQuestionsHtml(i);
	}

	$("#topbtn0").click(); //default to the first filter


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

	$("input[type^='checkbox']").change(function(){
		let btnTxt = this.dataset.labelVal;

		$("input[type^='checkbox']").not(this).prop('checked', false); //make sure no other buttons are selected
		var $selectedCheckboxes = $(`input[type^='checkbox'][data-label-val='${ btnTxt }']`); //select this and partner button

		//$otherRadioButtons.checked = true;
		$selectedCheckboxes.prop('checked', true);
		loadResults(this.dataset.indexVal);
	});

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
