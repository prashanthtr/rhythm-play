

var midi = null;
var output = null;
var cur_acc="";
var pointer = -1,midiKeyboardswitch=0,song;

var kanjira_patterns = [["ta","tum","tumki","."],["ta tum", "tum ta","ta te","ta.",".ta","te.",".te","tum.",".tum"],["ta thum thum ta"],["ta tumki ta tumki"],["tumki. tumki. ta thum thum ta"],["ta ta thum thum ta thum thum ta"]];

	// Some helpers for the demos.
var steller = org.anclab.steller;       // Alias for namespace.
var util = steller.Util;

var AC = new webkitAudioContext();      // Make an audio context.
var src = AC.createBufferSource();
var sh = new steller.Scheduler(AC);     // Create a scheduler and start it running.
sh.running = true;
var models = steller.Models(sh);

	var wavs = ['ta', 'te', 'tum','tumki','thum', 'tha','thi','thom','num','dhin','dheem','dham','ri','tham','bheem'];
    var sounds = {};
	
	var leadVolume= 1.0, acmpVolume=1.0, melVolume = 1.0, delay_range=0.03,tempo,accomp_start,tala=1,accomp_flag = 0,kanjira_start=4,input=null, mridangam_in = null,play_on=0;

var generic=1, interval, intonation, duration, strokeDensity,accent,gap,dur_left;
	
	document.getElementById('lead_Volume').addEventListener( "change", function(){
		leadVolume = document.getElementById("lead_Volume").value;
	},false); 
		document.getElementById('acmp_Volume').addEventListener( "change", function(){
		acmpVolume = document.getElementById("acmp_Volume").value;
	}); 	
	
	document.getElementById('mel_Volume').addEventListener( "change", function(){
		melVolume = document.getElementById("acmp_Volume").value;
	}); 	

	
document.getElementById('tempo').addEventListener( "change", function(){		
		tempo = document.getElementById("tempo").value;
		//set delay range to 30ms
		delay_range = (2 *tempo )/ 600;
	}); 


//accompaniment selection controls


	document.getElementById('generic').addEventListener( "change", function(){
	    generic = parseInt(document.getElementById("generic").value);
	},false); 


	document.getElementById('strokeDensity').addEventListener( "change", function(){
	    strokeDensity = parseInt(document.getElementById("strokeDensity").value);
	},false); 

	document.getElementById('intonation').addEventListener( "change", function(){
	    intonation = parseInt(document.getElementById("intonation").value);
	},false); 

	document.getElementById('duration').addEventListener( "change", function(){
	    duration = parseInt(document.getElementById("duration").value);
	},false); 

	document.getElementById('accent').addEventListener( "change", function(){
	    accent = eval(document.getElementById("accent").value);
	},false); 

	document.getElementById('interval').addEventListener( "change", function(){
	    interval = parseInt(document.getElementById("interval").value);
	},false); 




/*
document.getElementById('accomp_start').addEventListener( 'change', function(){
		kanjira_start = document.getElementById("accomp_start").value;
	}); 	*/



document.getElementById('midiInput').addEventListener( 'click', function(){
		midiKeyboardswitch = 1;
	});

document.getElementById('keyboardInput').addEventListener( 'click', function(){midiKeyboardswitch = 0;
	}); 	


var play_pattern = document.getElementById('play');
			
play_pattern.addEventListener("click", playKanjira , true);

document.getElementById('stop').addEventListener( 'onclick', function(){
		play_on = 0;
	}); 



function init_vars(){
	//initialize tempo, volume, etc..
			leadVolume = document.getElementById("lead_Volume").value;
			acmpVolume = document.getElementById("acmp_Volume").value;
			tempo = document.getElementById("tempo").value;
//					kanjira_start = document.getElementById("accomp_start").value;
			

		song = document.getElementById("track").value;
		
		wavs.push(song);
		// will result in the wavs all being loaded in parallel.
	var loader = sh.fork(wavs.filter(function (w) { return w !== ','; }).map(function (w) {
			return (sounds[w] = sh.models.sample('../audio/' + w + '.wav').connect()).load;
		    }));

		sh.play(loader);
		// Make an action which when played like sh.play(action)


    strokeDensity = parseInt(document.getElementById("strokeDensity").value);
    intonation = parseInt(document.getElementById("intonation").value);    
    duration = parseInt(document.getElementById("duration").value);
    accent = eval(document.getElementById("accent").value);
    interval = parseInt(document.getElementById("interval").value);		
		
}

function onMidiInput( event ) {

	
//if(event.data[0] != 128){
		//sh.play(sounds[map(event.data[1])].trigger(1.0));
		if(event.data[0] != 128){	
			document.getElementById("mridangam_patterns").value = map(event.data[1]);	
			sh.play(sounds[map(event.data[1])].trigger(leadVolume));
		}	
		mridangam_in = event;
//	}
	
}		



function success(midiAccess){

     if(midiKeyboardswitch == 1){
		console.log( "MIDI ready!" );		
		//initialize midi in
		input = midiAccess.getInput( 0 );	
		input.onmessage = onMidiInput;
      }
}


function playMridangam(stroke,time){
    
    var time_now = performance.now();

//plays a stroke for 1 beat, adjusts the triggering delay by reducing the duration of the note  
    //sh.play(sounds[stroke].note(1,-0.2,(60/tempo)-((time_now - time)/1000)));
    sh.play(sounds[stroke].note(1,0,(60/tempo)- (0.2*(60/tempo)) - ((time_now - time)/1000)));
//    sh.play(sounds[stroke].trigger(leadVolume));
    

}

/*
var pressed = {},duration;
document.onkeyup = function(event){
	
	if(pressed[event.which]){
		duration = (pressed[event.which] - event.timeStamp)/1000;
	}
		
}


document.onkeydown = function(event){

var str = String.fromCharCode(event.keyCode);
if(!pressed[event.which]){
duration = 60/tempo;
}
pressed[event.which] = event.timeStamp;
   // var time = performance.now();
//need some way to say if sound buffer is alrady loaded then fork

if(str == "f"){
    document.getElementById("mridangam_patterns").value = "num";	
    //sh.play(sounds["num"].trigger(leadVolume));
    //playMridangam("num",time);
	sh.play(sounds[stroke].note(1,0,duration));
	
}

if(str == "m"){
	document.getElementById("mridangam_patterns").value = "tham";
//    playMridangam("tham",time);
    sh.play(sounds[stroke].note(1,0,duration));

//    sh.play(sounds["tham"].trigger(leadVolume));

}


}*/


document.onkeydown =function(event){
if(midiKeyboardswitch == 0){
var str = String.fromCharCode(event.keyCode);
    var time = performance.now();
//need some way to say if sound buffer is alrady loaded then fork

if(str == "f"){
    document.getElementById("mridangam_patterns").value = "num";	
    //sh.play(sounds["num"].trigger(leadVolume));
    playMridangam("num",time);

}

if(str == "g"){
    document.getElementById("mridangam_patterns").value = "dheem";	
    //sh.play(sounds["dhin"].trigger(leadVolume));
    playMridangam("dheem",time);

}

if(str == "j"){
	document.getElementById("mridangam_patterns").value = "thi";	
    //sh.play(sounds["thi"].trigger(leadVolume));
    playMridangam("thi",time);

}

if(str == "h"){
	document.getElementById("mridangam_patterns").value = "ri";	
    playMridangam("ri",time);
//sh.play(sounds["ri"].trigger(leadVolume));
}

if(str == ","){
	document.getElementById("mridangam_patterns").value = "tham";
    playMridangam("tham",time);
	
//    sh.play(sounds["tham"].trigger(leadVolume));
}

if(str == "m"){
	document.getElementById("mridangam_patterns").value = "tham";
    playMridangam("tham",time);

//    sh.play(sounds["tham"].trigger(leadVolume));
}

if(str == "."){
	document.getElementById("mridangam_patterns").value = "tham";	
    playMridangam("tham",time);
//    sh.play(sounds["tham"].trigger(leadVolume));
}


if(str == "a"){
	document.getElementById("mridangam_patterns").value = "thom";	
    playMridangam("thom",time);
 
 //  sh.play(sounds["thom"].trigger(leadVolume));
}


if(str == "s"){
	document.getElementById("mridangam_patterns").value = "tha";	
    playMridangam("tha",time);

//    sh.play(sounds["tha"].trigger(leadVolume));
}

}
}

	
function failure(msg){
	console.log("failure" + msg);
}

  
  
  var sequence = function(str){
	
 //converts text representation to score representation with notes and rests in between that can be played by sh.play
 //change this part to include the new representation
// Each phrase has a tempo and each phrase.. phrase_tempo, phrases contain the phrases and the tempo at which they are to played at

	    var phrases =  str.match(/\[.+?\]/g); 
	    if(phrases == null){ return;}
	    phrases = phrases.map( function (string) { return string.substring(1, string.length -1) } );
	 phrases = phrases.map (function (string) { temp = string.split(","); if( temp[1]!="" && temp[1]!=null){ temp[1] = parseInt(temp[1]);} else {temp[1] = 1.0;} return temp; });
	    
	    var nstrs = [], nstrs_tempo = [];    
	    	    
	    phrases.map(function parse_phrase(phrase){
	    //operation is done for all the phrases
		var str = phrase[0];
		var tempo = phrase[1];
		var nstr = str.toLowerCase().trim().split(/\s+/);
		var karvais = nstr.map( function(s) { return s.split(".");});
		var karvai_to_nstrs_index = karvais;

	    //based on the assumption that kanjira array is 1d 
	    //convert kanjira from 2d to 1d,  nstrs is a 1d array	    
	    
		for(stroke = 0; stroke < karvais.length; stroke++){
		    for(j=0;j< karvais[stroke].length;j++){
		    
			if(karvais[stroke][j] == ""){
			    nstrs.push(".");			    
			}
			else  {
			    nstrs.push(karvais[stroke][j]); 
			}
			if(karvais[stroke][j] == ""){karvais[stroke][j] == ".";}
		    }
			//karvai_to_nstrs_index[stroke][i] = nstrs[nstrs.length];			
			nstrs_tempo.push(tempo);
		}
	    
		var string = "";
		for(stroke = 0; stroke < karvais.length; stroke++){		    			string += karvais[stroke].join("") + " ";
								  }

	//	document.getElementById("kanjira_patterns").value += "[" + string + "," + phrase[1]+"]";
	    });

	    
	    return [nstrs,nstrs_tempo]; //the notes and rests in the order they have to be played	    
    }
    
    
function map(num){
	
	if(num>0 && num<=20){
		return "num";
	}
	
	if(num>20 && num<=40){
		return "thi";
	}
	
	if(num>40 && num<=50){
		return "dhin";
	}
	
	if(num>50 && num<=60){
		return "tham";
	}
	
	if(num>60 && num<=70){
		return "num";
	}
	
	if(num>70 && num<=80){
		return "dheem";
	}
	
	if(num>80 && num<=128){
		return "bheem";
	}
	
	if(num>100 && num<=128){
		return "bheem";
	}

}	


function playKanjira(){
	//debugger;
     //sh.start();
    sh.running = true;
    play_on = 1; 
    //sh.play(sounds[song].trigger(melVolume));
    //document.getElementById("kanjira_patterns").value
    kanjira(tempo );

}

var kanjira = ( function (){
	
    var currentComposition = sh.delay(1.0);
    var track_delay = parseFloat(document.getElementById("track_delay").value);
 		
     
                  //  sh.play(currentComposition);
            /*currentComposition = sh.track(
                sh.rate(tempo / 60),
                combine_track()
	    );*/
//sh.play(sh.repeat( 4, sh.track( currentComposition,sh.delay(32.0))));
    sh.play(sh.loop(sh.dynamic(function (clock) { return currentComposition; })));                    

    function accent_pattern(){

	var strong = 5.0, weak = 0.4;	
	var arr = sarvalaghu(duration);
	document.getElementById("accent").value = arr.join(" ");
	
	var pattern = [], accent_arr=[];
	for(var i=0; i<arr.length;i++){
	    if(arr[i]>3){
		var inPattern = sarvalaghu(arr[i]);
		if(duration % arr[i] == 0 && generic == 1){
		    while(arrElementCmp(1,inPattern)){
			inPattern = sarvalaghu(arr[i]);
		    }
		}
		for(var iP = 0; iP < inPattern.length; iP++){
		    pattern.push(inPattern[iP]);
		}
		
	    }
	    else{
		pattern.push(arr[i]); 
	    }
	}

	for(var index = 0; index < pattern.length;index++){
	    accent_arr.push(strong);	    
	    for(var ind2 = 1; ind2 < pattern[index];ind2++){
		accent_arr.push(weak);
	    }
	}

	return accent_arr;
    }

/*    function accent_pattern(){

	var arr = sarvalaghu(duration), accent_arr = [];
	var strong = 5.0, weak = 0.4;	
	for(var index=0; index<arr.length;index++){
	    if(){
		
	    }
	    accent_arr.push(strong);
	    for(var ind2 = 1; ind2 < arr[index];ind2++){
		accent_arr.push(weak);
	    }
	}
	*/

/*	for(var i=1;i<=duration;i++){
	    if( arrElementCmp(i,accent) == 1){
		accent_arr.push(strong);
	    }
	    else{		
		accent_arr.push(weak);
	    }
	    
	}*/



    function sarvalaghu(duration){

	var combinations =[],arr=[]; //combination of 2's, 3's for accompaniment
	//var valid = [4,4],[3,3,2],[2,3,3],[3,2,3],[2,2,2,2],[1,1,1,1,1,1,1,1]; 
	debugger;   
	
	for(var i=1;i<=duration-1;i++){
	    allSums(0,i,arr,combinations);
	}


	function allSums(sum,num){
	    if(sum + num == duration){
		arr.push(num);
		combinations.push(arr.join(","));
		arr = arr.splice(0,arr.length-1);
		return sum;
	    }
	    else if(sum + num > duration){	    
		return sum;
	    }
	    else{
		sum += num;
		arr.push(num);
		for(var i=1;i<=duration-1;i++){
		    sum = allSums(sum,i);  //success		    
		}
		arr = arr.splice(0,arr.length-1);		
		return sum-num;

	    }
	}

	var genericAc = combinations.map(function(str,index){
	    
	    var array = str.split(",");
	    var ele = array[0];
	    if( duration % array.length == 0){	    
		if( numOccurences(ele,array) ==  array.length){  //means all the elements of the string are the same
		    return str;
		}	    		
	    }
	    else{
		
		var binary = array.map(function(num,index){
		    if(duration % num == 0 && num!=1){
			return 1;
		    }
		});
		if( numOccurences(1,binary) == binary.length ){
		    return str;
		}
		
		if(str.match(/1/gi) == null && str.match(/2/gi) != null && str.match(/3/gi) != null ){
		    return str;
		}
	    }
	    
	});

	var validGeneric = [];
	for(var index=0;index<genericAc.length;index++){
	    if(genericAc[index]){
		validGeneric.push(genericAc[index]);
	    }
	}

        
	
	if(genericcity == 3 || genericcity == 4){
	    var nonGeneric = combinations.map(function(str,index){
		
		if(str.match(/1/gi) != null){
		    return str;
		}
	    });
	    
	    var validNonGeneric = [];
	    for(var index = 0; index<nonGeneric.length;index++){
		if(nonGeneric[index]){
		    var flag = 0;
		    for(var index2 = 0; index2< validGeneric.length;index2++){
			if( nonGeneric[index] == validGeneric[index2] ){
			    flag = 1;
			}
		    }
		    if(flag == 0){
			validNonGeneric.push(nonGeneric[index]);
		    }

		}
	    }
	    return validNonGeneric[wholeRand(0,validNonGeneric.length-1)].split(",").map(parseFloat);
	}
	debugger;
	return validGeneric[wholeRand(0,validGeneric.length-1)].split(",").map(parseFloat);

    }

//non resonant strokes only on the accent beats
//resonant strokes on all the beats

var resonant = ["tum","tumki"];
var nonResonant = ["ta","te"];

function diction(accent){
    var strong = 5.0, weak = 0.4;	
    var pattern = accent.map(function(s,num){	
	if(s == strong){
	    var binary = wholeRand(0,1);
	    if(binary == 0){
		return resonant[wholeRand(0,1)];
	    }
	    else{
		return nonResonant[wholeRand(0,1)];
	    }
	}
	else{
	    return nonResonant[wholeRand(0,1)];
	}
    });    
    return pattern.join(" ");
}


/*

var dictionPattern = [["ta","te","tum"],["ta te","ta tum","tum ta","te ta"],["ta te ta","te ta te","tum ta te"]];

function diction(accent){

    var pattern=[]; 
    if(duration % accent.length == 0){	
	var index =  (duration / accent.length),arr = [],str;
	
	if(index > 2){
	    arr = sarvalaghu(index);
	}
	else{
	    str = dictionPattern[index-1][wholeRand(0,dictionPattern[index-1].length-1)];
	}
	
	for(var ind = 0; ind < accent.length; ind ++){
	    if(arr.length == 0){
		pattern.push(str);
	    }    
	    else{
		for(var ind2 =0; ind2<arr.length;ind2++){
		    str = dictionPattern[arr[ind2]-1][wholeRand(0,dictionPattern[arr[ind2]-1].length-1)];
		    pattern.push(str);
		}
	    }
	}
    }
    else{	
	pattern = accent.map(function(num){
	    return dictionPattern[num-1][wholeRand(0,dictionPattern[num-1].length-1)];
	});
    }
    return pattern.join(" ");
}*/

    function combine_track(cur_acc){

//schedules to play the kanjira accompaniment - but if mridangam event is in, forks the track and adds that schedules that event too	

        //cur_acc = kanjira_patterns[Math.floor( 2.3 + 3*Math.random())];
	//cur_acc = cur_acc[0];
	//cur_acc = document.getElementById("kanjira_patterns").value;
	var kanjira_pattern;
	/*
        if(cur_acc.split(" ").length == 8 || cur_acc.split(" ").length == 6 ){
		kanjira_pattern = "[" + cur_acc + "," + 4 + "]";
	}
	else{
		kanjira_pattern = "[" + cur_acc + "," + 2 + "]";
	}*/
        //kanjira_pattern = cur_acc;
	document.getElementById("kanjira_patterns").value = kanjira_pattern;	
	//var accompaniment_seq = sequence(kanjira_pattern);
		
	
	debugger;
	var accent_struct = accent_pattern();
	var accomp = diction(accent_struct);
	//pattern_gen(accent_struct[0]);//accompaniment_seq[0];
	var accomp = accomp.split(" ");
	var accent_arr = accent_struct;
	//var accomp_tempo = accompaniment_seq[1],times;
	var accomp_tempo,times;	
	
//	var accent_structure = accent_pattern();
//	var accent_arr = sequence("[" + accent_structure + "," + accomp_tempo[0] + "]");
	//      accent_arr = accent_arr[0];
//	accent_arr = accent_arr.map(parseFloat);

	var times = 4;
	
	if(accomp.length == 4){
	//sh.play(sh.repeat(8, sh.dynamic(function (clock) { return currentComposition; })));
	    times = 8;
	    accomp_tempo = 2;
	}

	if(accomp.length == 8){
	//sh.play(sh.repeat(4, sh.dynamic(function (clock) { return currentComposition; })));
	    times = 4;
	    accomp_tempo = 4;
	}

	document.getElementById("kanjira_patterns").value = "[" + accomp.join(" ") + "," + accomp_tempo + "]";	


 //	return sh.track( sh.repeat( times , sh.track( accomp.map(function(s,index){	
return sh.track( accomp.map(function(s,index){	
		if(s == "."){
			return sh.track(sh.delay(1.0/accomp_tempo));
		}
	
		else{	
			return sh.track([sounds[s].trigger(accent_arr[index]), sh.delay(1.0/accomp_tempo)]);
		}

}));

}

/*    function accent_pattern(){

	var accent_arr = [[weak, weak, weak,weak,strong, weak,weak, weak], [strong, weak, weak, strong,weak, weak, strong, weak]];

	var pattern = wholeRand(0,1);  //takadimi takajono or (3+3+2) pattern
	var accentPositions = accent_arr[pattern]; //select base accent pattern    
	var accent = selectAccent(genericity-1,pattern);
	//stores the correct pattern of strong and weak accents in the array
	accentPositions =  accentPositions.map(function(s,index){
	    if(arrElementCmp(index,accent)){
		return strong;
	    }
	    else{
		return weak;
	    }
	});

	
	//returns an array of accent patterns
	function selectAccent(generic,pattern){ 

	    //select one of the arrays of accent array
	    var accent = [[[5]],[[1,4,7]],[[[1,3],[1,5]],[[2,5,8]]]];

	    //generate triads of non-generic patterns
	    function triads( forbiddenCombinations  ){
		
		var accentGen = [];
		accentGen.push(wholeRand(0,7));

		do{
		    do{
			var element = wholeRand(0,7);
			if(arrElementCmp(element,accentGen) == 0){
			    accentGen.push(element);
			}
			
		    }while(accentGen.length <= 3);
		}while(arrCmp(forbiddenCombinations,accentGen));
		return accentGen;
	    }


	    if(generic == 0 || generic == 1){
		return accent[generic][pattern];
	    }
	    else{
		var forbiddenCombinations = [];
		for(generic = 1; generic>=0;generic--){
		    for(var len =0; len<accent[generic][pattern].length;len++ ){
			forbiddenCombinations.push(accent[generic][pattern][len]);
		    }
		}
		return triads(forbiddenCombinations);
	    }
	}

	return accentPositions;
    }

    function strokes(){

	var pattern = wholeRand(0,1);  //takadimi takajono or (3+3+2) pattern
	var generic = genericity(pattern);
	var noStrokes = selectStrokes(generic-1,pattern);

	//returns the number of strokes in the pattern
	function selectStrokes(generic,pattern){ 

	    // select no of strokes for only for non-generic patterns
	    function strokesNonGeneric(forbiddenCombinations){     
		
		var element;
		do{
		    element = wholeRand(0,7);	
		}while(arrElementCmp(element,forbiddenCombinations) != 0);
		return element;
	    }



	    //select one of the array values from the number of strokes
	    var noOfStrokes = [[[8],[8]],[[2,4],[3,7]]];
	    
	    //[[3,5,6,7],[4,5,6]]
	    
	    if(generic == 0){
		return noOfStrokes[generic][pattern];
	    }
	    else if(generic == 1){
		var arr = noOfStrokes[generic][pattern];	
		return noOfStrokes[generic][pattern][wholeRand(0,arr.length)]
	    }
	    else
	    {
		var forbiddenCombinations = [];
		for(generic = 1; generic>0;generic--){
		    for(var len =0; len<noOfStrokes[generic][pattern].length;len++ ){
			forbiddenCombinations.push(noOfStrokes[generic][pattern][len]);
		    }
		}
		return strokesNonGeneric(forbiddenCombinations);
	    }
	}

	return noStrokes;

    }*/

	
    function combine_track_rand(){

	
	
	//schedules to play the kanjira accompaniment - but if mridangam event is in, forks the track and adds that schedules that event too	

	//cur_acc = kanjira_patterns[Math.floor( 2.3 + 3*Math.random())];
	cur_acc = "";
	/*var dec = Math.floor( 0.6 + Math.random());
	  var len = 4;
	  /*if(dec = 0){
	  len = 4;	
	  }
	  else{
	  len = 8;
	  }
	  
	  for(var i=0; i< len; i++){
	  var temp = kanjira_patterns[0][Math.floor( 0.4 + 3*Math.random())]
	  if(temp == "."){
	  cur_acc += temp;	
	  }
	  else{
	  cur_acc += temp + " ";
	  }
	  
	  }*/
	
	//cur_acc = cur_acc.slice(0,cur_acc.length -1);
	var kanjira_pattern;
	cur_acc = "tumki. tumki. tumki. tumki. ta thum thum ta";
	/*if(cur_acc.split(" ").length == 8 || cur_acc.split(" ").length == 6 ){
	  kanjira_pattern = "[" + cur_acc + "," + 4 + "]";
	  }
	  else{
	  kanjira_pattern = "[" + cur_acc + "," + 2 + "]";
	  }*/
	kanjira_pattern = "[" + cur_acc + "," + 2 + "]";
	document.getElementById("kanjira_patterns").value = kanjira_pattern;	
	var accompaniment_seq = sequence(kanjira_pattern);
	var accomp = accompaniment_seq[0];
	var accomp_tempo = accompaniment_seq[1],times;	
	var times = 1;
	/*
	  if(accomp.length == 4){
	  //sh.play(sh.repeat(8, sh.dynamic(function (clock) { return currentComposition; })));
	  times = 3;
	  }*/

	return sh.track( sh.repeat( times , sh.track( accomp.map(function(s,index){	
	    
	    if(s == "."){
		return sh.track(sh.delay(1.0/accomp_tempo[0]));
	    }
	    
	    else{	
		return sh.track([sounds[s].trigger(acmpVolume), sh.delay(1.0/accomp_tempo[0])]);
	    }

	}))));

    }

    return function (tempo,cur_acc) {
        currentComposition = sh.track(
            sh.rate(tempo / 60),
            combine_track(cur_acc)
        );
    };

}());



/*

function diction(accent){

    var dictionPattern = [["ta","te","tum"],["ta te","ta tum","tum ta"],["ta te ta","te ta te","tum ta tum"],["ta tum tum ta"],["te tum tum te"]];
    var pattern = [];

    if(duration % accent.length == 0){	
	var index =  (duration / accent.length) ;
	var str = dictionPattern[index-1 ][wholeRand(0,dictionPattern[index-1].length-1)];
	for(var ind = 0; ind < accent.length; ind ++){
	    pattern.push(str);
	}
    }
    else{
	pattern = accent.map(function(num,index){		
	    var len = dictionPattern[num-1].length-1;

	    if(index == 0){ //always start with a strong beat
		var str = dictionPattern[num-1][wholeRand(0,len)];	    
		while( str.split(" ")[0] == "tum"){
		    str = dictionPattern[num-1][wholeRand(0,len)];
		}
		return str;
	    }
	    else if(index == accent.length-1){ // do not end with a tum ta tum
		if(num == 3){
		    var str = dictionPattern[num-1][wholeRand(0,len)];
		    while( str == "tum ta tum"){
			str = dictionPattern[num-1][wholeRand(0,len)];
		    }
		}
		else{
		   str = dictionPattern[num-1][wholeRand(0,len)];
		}
		return str;
	    }
	    else{
		return dictionPattern[num-1][wholeRand(0,len)];
	    }
	});
    }
    return pattern.join(" ");
}

*/




/*
function pattern_gen(){
    
    var cur_pattern;
    debugger;
    var pattern = parseInt(document.getElementById("pattern").value);
    //accent = eval(document.getElementById("accent").value);
    var gap = 8 - strokeDensity - accent.length;
    if(gap < 0){gap = 0; }
    var dur_left = duration - accent.length, constraint = 0;

    if(pattern == 0){
	cur_pattern = ["tha", "thum", "thum", "tha","tha", "thum", "thum", "tha"];
    }
    else{
	cur_pattern = ["tha", "tha", "thum", "thum", "tha", "thum", "thum", "tha"];
    }

    if(intonation == 1){
	cur_pattern = cur_pattern.map(function(s,index){
	    if(s == "thum"){
		return "tumki";
	    }
	    else{
		return s;
	    }
	});
    }

    //generates a valid accompaniment that satisfies the constraints
    do{

	constraint = 0;    
	
	cur_pattern = cur_pattern.map(function(s,index){
	    
	    if(accent.length != 0){
	    
		if(arrElementCmp(index+1,accent) == 1){
		    return s;
		}
		
		else{
		    
		    if(gap > dur_left){
			constraint = 1;
		    }
		    else if(gap == dur_left){
			dur_left--;
			gap--;
			return ".";
		    }
		    else if(gap == 0){
			dur_left--;
			return s;		
		    }
		    else if(gap<dur_left && gap>0){

			//randomly select 1 -> note, 0 -> gap
			if( wholeRand(0,1) ){
			    dur_left--;
			    return s;
			}
			else{
			    dur_left--;
			    gap--;
			    return ".";
			}
			
		    }
		    
		}
	    }
	    else{
		return s;
	    }

	});
	 
    }while(constraint == 1);

    return cur_pattern;    
    
}*/


navigator.requestMIDIAccess(success, failure);	
debugger;   
init_vars();


//------------------ Common functions --------------------------//

//generates whole random number between the given intervals
function wholeRand(low,high){
    return low + Math.floor( 0.5 + Math.random()*(high-low));
}

//returns 1 if element found in array and returns 0 if no element is found
function arrElementCmp(element,array){
    var compare = 0;
    for(var index=0;index<array.length;index++){
	if(element == array[index]){compare = 1;}
    }
    return compare;
}

//compares if one array is part of another array
function arrCmp(mainArr,subArr){

    var compare = 0;
    for(index = 0; index<mainArr.length; index++){
	if( mainArr[index].join("") == subArr.join("") ){
	    compare = 1;
	}
    }
    return compare;
}


//returns number of occurences of an element in a array
function numOccurences(ele,array){
    var count = 0;
    for(var index=0;index<array.length;index++){
	if(ele == array[index]){
	    count++;
	}
    }
    return count;
}


/*       var accentPos = return function(accentPos,genericity){

       for(var i=0;i<duration;i++){ 
	       flag = 0;
	      for(var pos=0;pos<accent.length[pattern];pos++){ 
	           if(i == accent[pos]){
	       	    accent[i]=strong;
		    flag = 1;
		    }		    
	       }
	       if(flag == 0){accent[i] = weak;}
	
       }
	    return accent;
   });
	      return accentPos;
}




*/
