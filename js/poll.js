$(document).ready(function(){
	$.ajax({
		type: "GET",
		url: "data/poll.xml",
		dataType: "xml",
		success: parseQuestions
	});
});//document ready

function parseQuestions(xml){
	var bigArr = [];
	
	//setup the radio button filters
	var labelArr = ["Statewide", "Atlanta metro", "Men", "Women", "White", "Non-white",  "Insured", "Uninsured"];
	var buttonHTML = "";	
	for(var i=0; i<labelArr.length; i++){
		buttonHTML += '<input type="radio" id="radio'+i+'" name="radio" /><label for="radio'+i+'">'+labelArr[i]+'</label>';
	}
	$(document.getElementById('filters')).html(buttonHTML).buttonset(); //.buttonset() initializes the radio buttons for jQueryUI
	for(var i=0; i < labelArr.length; i++) {
		$('#radio'+i).click(function(num) {
			return function () {
				loadResults(num);
			}
		}(i));
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

		startup(Qid);
		
	});//xml.find(myQuestion)
	
	$("#radio0").click(); //default to the first filter
	
	function startup(Qid){
		var qText = '<div id=q'+Qid+'><div id="questionq'+Qid+'" class="question">'+bigArr[Qid].qLabel+'</div><div class="results">';
		for (var i=0; i<bigArr[Qid].responseArr.length; i++){ //-1 from .length if you have totals as your final row (so that you don't have to calculate total responses - useful for making sure all bars are the same length despite rounding)
			qText += '<div class="opt'+i+'percent" id="opt'+i+'q'+Qid+'"><div class="innerlabel">'+bigArr[Qid].responseArr[i].optlabel+'</div></div>'
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
	}//startup

	function loadResults (val){
		for(var i=0; i<bigArr.length; i++){
			var opts = [];
			for(var j=0; j<bigArr[i].responseArr.length; j++){ //-1 from .length if you have totals as your final row
				opts.push(bigArr[i].responseArr[j].demogArr[val]); //associate each demographic slice from each response with their corresponding filter button
				opts.id = val;
			}
			drawBars(i, opts);
		}
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
				content: bigArr[Qid].responseArr[i].optlabel+': <strong>' + opts[i] +'%</strong>',
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