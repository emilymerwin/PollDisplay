$(document).ready(function(){
	$.ajax({
		type: "GET",
		url: "data/poll.xml",
		dataType: "xml",
		success: parseQuestions
	});
});//document ready
function parseQuestions(xml){
	var labelArr = ["Statewide", "Atlanta metro", "Men", "Women", "White", "Non-white",  "Insured", "Uninsured"];
	var buttonHTML = ""
	for(var i=0; i<labelArr.length; i++){
		buttonHTML += '<input type="radio" id="radio'+i+'" name="radio" /><label for="radio'+i+'">'+labelArr[i]+'</label>';
	}
	document.getElementById('radio').innerHTML = buttonHTML;
	$("#radio0").prop("checked", "checked");
	$("#radio").buttonset();
	var bigArray = [];
	var myQs = new Question();
	function Question(){//creating an object to initiate so we can prototype it, even though we aren't doing that here
		$(xml).find("myQuestion").each(function(index, element){
			this.id = index;
			bigArray[index] = this;
			var Qid = $(this).attr("Qid");
			qLabel = $(this).attr("label");
			var q = qLabel;
			var responseArray = [];
			this.responseArray = responseArray;
			var totalsArr = [];
			this.totalsArr = totalsArr;
			var opts = [];
			$(this).find("Response").each(function(index, element){
				var optLabel = $(this).attr('Label');
				var option = new Object;
				var temp = $(this).text();
				tempArray = temp.split(',');
				option.groupArr = [];
				jQuery.each(tempArray, function(b, c){
					option.groupArr[b] = +c;
				});//convert to integer and add to demographic breakdown array
				option.optlabel = optLabel;
				bigArray[Qid][index] = option;
				responseArray[index] = option;//maybe delete later
			});//Response.each
			//for (var u=0; u<responseArray.length -1; u++){//-1 only if you have totals as last row
			for (var u=0; u<responseArray.length; u++){
				for(var m=0;m<responseArray[u].groupArr.length;m++){
					var temp = responseArray[u].groupArr[m];
					if(totalsArr[m]){
						totalsArr[m] += temp;
					} else{
						totalsArr[m] = temp;
					}
				}
			}//for
			var myParent = '#qs';
			if(Qid == 8){
				$(myParent).append('<div class="question">Here are several elements of the Affordable Care Act.  For each one, please tell me whether your view of the provision is favorable or unfavorable.</div><div id="groupQ"></div>');
			}
			if(Qid >7){
				myParent = '#groupQ';
			}
			$(myParent).append('<div id=q'+Qid+'></div>');
			startup();

			function loadResults (val){
				//for(var g=0; g<responseArray.length -1; g++){//remove -1 if you don't have totals as your final row
				for(var g=0; g<responseArray.length; g++){
					opts[g] = responseArray[g].groupArr[val];
					opts.totes = val;
				}
				drawBars();
			}//loadResults*/
			loadResults(0);
			//consolidate these
			for(var w=0, myRadio; w < responseArray[0].groupArr.length; w++){
				var myString = '#radio'+w;
				var myRadio = $(myString);
				myRadio.click(function(num){
					return function (){
						loadResults(num);
					}
				}(w));
			}
			function startup(){
				var otherHolder = '<div id="holderq'+Qid+'"><div id="questionq'+Qid+'" class="question"></div><div class="results">';
				//for (var p=0; p<bigArray[Qid].responseArray.length -1; p++){//-1 only if you have last response row as total responses (so that you don't have to calculate total responses - useful for making sure all bars are the same length despite rounding)
				for (var p=0; p<bigArray[Qid].responseArray.length; p++){
					otherHolder += '<div class="opt'+p+'percent" id="opt'+p+'q'+Qid+'"><div class="innerlabel">'+bigArray[Qid][p].optlabel+'</div></div>'
				}
				otherHolder += '</div></div>';
				$('#q'+Qid).append(otherHolder);
				$('#questionq'+Qid).append(q);
			}//startup
			function drawBars(){
				var multiplier = ($("#qs").width()-10)/100;
				for(var i=0; i<opts.length; i++){
					if(Qid > 7){
						multiplier = ($("#groupQ").width()-10)/100;
					}
					var t = multiplier*((100/bigArray[Qid].totalsArr[opts.totes]).toFixed(2));//scale it to account for rounding causing to be more or less than 100
					var barWidth = opts[i]*t;
					$('#opt'+i+'q'+Qid).delay(100).animate({'width':barWidth+'px'},'slow').hover(function () {
						$(this).css({'opacity':'0.7'});
					}, function () {
						$('#opt'+i+'q'+Qid).find("span:last").remove();
						$(this).css({'opacity':'1.0'});
					}).qtip({
						content: bigArray[Qid].responseArray[i].optlabel+': <b>' + opts[i] +'%</b>',
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
		});//xml.find(myQuestion)
	}//question
};//parseQuestions