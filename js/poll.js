$(document).ready(function(){
	$.ajax({
		type: "GET",
		url: "data/poll.xml",
		dataType: "xml",
		success: parseQuestions
	});
});//document ready
/*$('.innerlabel').textOverflow({
    str: '...',
    autoUpdate: true
});*/
function parseQuestions(xml){
//	var responseArray = [];
	var buttonHTML = '<input type="radio" id="radio0" checked="checked" name="radio" /><label for="radio0">Total</label><input type="radio" id="radio1" name="radio" /><label for="radio1">Metro</label><input type="radio" id="radio2" name="radio" /><label for="radio2">Non-metro</label><input type="radio" id="radio3" name="radio" /><label for="radio3">North GA</label><input type="radio" id="radio4" name="radio" /><label for="radio4">Central GA</label><input type="radio" id="radio5" name="radio" /><label for="radio5">South GA</label><input type="radio" id="radio6" name="radio" /><label for="radio6">18-24</label><input type="radio" id="radio7" name="radio" /><label for="radio7">25-34</label><input type="radio" id="radio8" name="radio" /><label for="radio8">35-44</label><input type="radio" id="radio9" name="radio" /><label for="radio9">45-54</label><input type="radio" id="radio10" name="radio" /><label for="radio10">65+</label><input type="radio" id="radio11" name="radio" /><label for="radio11">Male</label><input type="radio" id="radio12" name="radio" /><label for="radio12">Female</label><input type="radio" id="radio13" name="radio" /><label for="radio13">No HS</label><input type="radio" id="radio14" name="radio" /><label for="radio14">HS GED</label><input type="radio" id="radio15" name="radio" /><label for="radio15">Some College</label><input type="radio" id="radio16" name="radio" /><label for="radio16">BA</label><input type="radio" id="radio17" name="radio" /><label for="radio17">Grad/Profession Degree</label><input type="radio" id="radio18" name="radio" /><label for="radio18">Black</label><input type="radio" id="radio19" name="radio" /><label for="radio19">White</label><input type="radio" id="radio20" name="radio" /><label for="radio20">Latino</label><input type="radio" id="radio21" name="radio" /><label for="radio21">Other</label><input type="radio" id="radio22" name="radio" /><label for="radio22">Democrat</label><input type="radio" id="radio23" name="radio" /><label for="radio23">Republican</label><input type="radio" id="radio24" name="radio" /><label for="radio24">Other</label>';
	document.getElementById('radio').innerHTML = buttonHTML;
	  //  document.getElementById('radio-foot').innerHTML = buttonHTML;
	$("#radio").buttonset();
	//$("#radio-foot").buttonset();

	var bigArray = [];
	var myQs = new Question();
	function Question(){//creating an object to initiate so we can prototype it, even though we aren't doing that here
	$(xml).find("myQuestion").each(function(index, element){
		this.id = index;
		bigArray[index] = this;
		var Qid = $(this).attr("Qid");
		qLabel = $(this).attr("label");
		var q = qLabel;
		var responseArray = []
		this.responseArray = responseArray;
		var totalsArr = [];
		this.totalsArr = totalsArr;
		var opts = [];
		$(this).find("Response").each(function(index, element){
			var option = new Object;
				var temp = $(this).text();
			//	var pcttotal = 0;
				tempArray = temp.split(',');
				option.groupArr = [];
				jQuery.each(tempArray, function(b, c){
					c=c*100;//get rid of this if data is represented in whole numbers instead of percent
					var newc = parseInt(c);
					option.groupArr[b] = newc;				
				});//format our number and multiply by 6 for chart
				option.optlabel = $(this).attr('Label');
			//	option.pcttotal = pcttotal;
			//	option.id = index;
				bigArray[Qid][index] = option;		
				responseArray[index] = option;//maybe delete later
		});//Response.each
		
		for (var u=0; u<responseArray.length -1; u++){//-1 only if you have totals as last row
			for(var m=0;m<responseArray[u].groupArr.length;m++){
				var temp = responseArray[u].groupArr[m];
				if (!isNaN(temp)){		
					if(totalsArr[m] != undefined){
						totalsArr[m] += temp;					
					}		
					else{	
						totalsArr[m] = temp;					
					}
				}
			}	
		}//for

		$('#qs').append('<div id=q'+Qid+'></div>');
		startup();	

		/*this.loadResults = function (val){// use this. to make it priveledged so others can access
			for(var g=0; g<responseArray.length -1; g++){//remove -1 if you don't have totals as your final row
				if(responseArray[g].groupArr[val] != undefined){
					opts[g] = responseArray[g].groupArr[val];
				}
				else{
					opts[g] = 0;
				}
				opts.totes = val;
			}	
			drawBars();
		}//loadResults*/
		function loadResults (val){
			for(var g=0; g<responseArray.length -1; g++){//remove -1 if you don't have totals as your final row
				if(responseArray[g].groupArr[val] != undefined){
					opts[g] = responseArray[g].groupArr[val];
				}
				else{
					opts[g] = 0;
				}
				opts.totes = val;
			}	
			drawBars();
		}//loadResults*/
		//this.loadResults(0);	//when declaring a priviledged method you can only reference it after it is declared
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
			var otherHolder = '<div id="holderq'+Qid+'"><div id="questionq'+Qid+'" class="question"></div><div id="results">';
			for (var p=0; p<bigArray[Qid].responseArray.length -1; p++){//-1 only if you have last response row as total responses (so that you don't have to calculate total responses - useful for making sure all bars are the same length despite rounding)
				otherHolder += '<div class="opt'+p+'percent" id="opt'+p+'q'+Qid+'"><div class="innerlabel">'+bigArray[Qid][p].optlabel+'</div></div>'
			}
			otherHolder += '</div></div>';
			$('#q'+Qid).append(otherHolder);
			$('#questionq'+Qid).append(q);
		}//startup
		function drawBars(){
			for(var i=0; i<opts.length; i++){
				if(opts[i] != undefined){
					var t = 5.7*((100/bigArray[Qid].totalsArr[opts.totes]).toFixed(2));//scale it to account for rounding causing to be more or less than 100			
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
							adjust: {
								x: 10,  y: 10
							}
						},
						hide: {
							fixed: true // Helps to prevent the tooltip from hiding ocassionally when tracking!
						},
						style: {
							classes: 'ui-tooltip-light ui-tooltip-shadow'
						}
					});//qtip
				}// if opts[i]!undefined
				//	})
			}//for(opts.length)	
		}//drawbars	
	});//xml.find(myQuestion)
}//question		
};//parseQuestions