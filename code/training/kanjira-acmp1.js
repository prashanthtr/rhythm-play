    /*
var midi = null;
var output = null;
var cur_acc="";
var pointer = -1,midiKeyboardswitch=0,song;

var kanjira_patterns = [["ta","tum","te"],["ta tum", "tum ta","ta te","ta.",".ta","te.",".te","tum.",".tum"],["ta thum thum ta"],["ta tumki ta tumki"],["tumki. tumki. ta thum thum ta"],["ta ta thum thum ta thum thum ta"]];

	// Some helpers for the demos.
var steller = org.anclab.steller;       // Alias for namespace.
var util = steller.Util;

var AC = new webkitAudioContext();      // Make an audio context.

var sh = new steller.Scheduler(AC);     // Create a scheduler and start it running.
sh.running = true;
var models = steller.Models(sh);

	var wavs = ['ta', 'te', 'tum','tumki','thum', 'tha','thi','thom','num','dhin','dheem','dham','ri','tham','bheem'];
    var sounds = {};
	
	var leadVolume= 1.0, acmpVolume=1.0, melVolume = 1.0, delay_range=0.03,tempo,accomp_start,tala=1,accomp_flag = 0,kanjira_start=4,input=null, mridangam_in = null,play_on=0;
	
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


document.getElementById('accomp_start').addEventListener( 'change', function(){
		kanjira_start = document.getElementById("accomp_start").value;
	}); 	

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


document.onkeypress =function(event){
if(midiKeyboardswitch == 0){
var str = String.fromCharCode(event.keyCode);


//need some way to say if sound buffer is alrady loaded then fork

if(str == "f"){
    document.getElementById("mridangam_patterns").value = "num";	
    sh.play(sounds["num"].trigger(leadVolume));

}

if(str == "g"){
    document.getElementById("mridangam_patterns").value = "dheem";	
    sh.play(sounds["dhin"].trigger(leadVolume));

}

if(str == "j"){
	document.getElementById("mridangam_patterns").value = "thi";	
    sh.play(sounds["thi"].trigger(leadVolume));
}

if(str == "h"){
	document.getElementById("mridangam_patterns").value = "ri";	
    sh.play(sounds["ri"].trigger(leadVolume));
}

if(str == ","){
	document.getElementById("mridangam_patterns").value = "tham";	
    sh.play(sounds["tham"].trigger(leadVolume));
}

if(str == "m"){
	document.getElementById("mridangam_patterns").value = "tham";	
    sh.play(sounds["tham"].trigger(leadVolume));
}

if(str == "."){
	document.getElementById("mridangam_patterns").value = "tham";	
    sh.play(sounds["tham"].trigger(leadVolume));
}


if(str == "a"){
	document.getElementById("mridangam_patterns").value = "thom";	
    sh.play(sounds["thom"].trigger(leadVolume));
}


if(str == "s"){
	document.getElementById("mridangam_patterns").value = "tha";	
    sh.play(sounds["tha"].trigger(leadVolume));
}

if(str == "d"){
	document.getElementById("mridangam_patterns").value = "num";	
    sh.play(sounds["num"].trigger(leadVolume));
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

	play_on = 1; 
	sh.play(sounds[song].trigger(melVolume));
	//kanjira();

}

var kanjira = function(){
	
	
 	var currentComposition = sh.delay(1.0);
 	var track_delay = parseFloat(document.getElementById("track_delay").value);
 			currentComposition = sh.track(
					sh.rate(tempo/ 60),
					sh.track(
					sh.delay(track_delay),
					combine_track(),
					sh.delay(0.01),
					combine_track(),
					sh.delay(0.01),
					combine_track(),
					sh.delay(0.01),
					combine_track())
                    );
                    
                    sh.play(currentComposition);
                    
//sh.play(sh.repeat( 4, sh.track( currentComposition,sh.delay(32.0))));
//sh.play(sh.repeat( 4,(sh.dynamic(function (clock) { return currentComposition; })));                    

	
function combine_track(){

	
//schedules to play the kanjira accompaniment - but if mridangam event is in, forks the track and adds that schedules that event too	

cur_acc = kanjira_patterns[Math.floor( 2.3 + 3*Math.random())];
	cur_acc = cur_acc[0];
	var kanjira_pattern;
	if(cur_acc.split(" ").length == 8 || cur_acc.split(" ").length == 6 ){
		kanjira_pattern = "[" + cur_acc + "," + 4 + "]";
	}
	else{
		kanjira_pattern = "[" + cur_acc + "," + 2 + "]";
	}
	document.getElementById("kanjira_patterns").value = kanjira_pattern;	
	var accompaniment_seq = sequence(kanjira_pattern);
	var accomp = accompaniment_seq[0];
	var accomp_tempo = accompaniment_seq[1],times;	
	var times = 4;
	
	if(accomp.length == 4){
	//sh.play(sh.repeat(8, sh.dynamic(function (clock) { return currentComposition; })));
	times = 8;
	}

	if(accomp.length == 8){
	//sh.play(sh.repeat(4, sh.dynamic(function (clock) { return currentComposition; })));
	times = 4;
	}

	return sh.track( sh.repeat( times , sh.track( accomp.map(function(s,index){	
	
		if(s == "."){
			return sh.track(sh.delay(1.0/accomp_tempo[0]));
		}
	
		else{	
			return sh.track([sounds[s].trigger(acmpVolume), sh.delay(1.0/accomp_tempo[0])]);
		}

	}))));

}

}

navigator.requestMIDIAccess(success, failure);	
debugger;   
init_vars();

*/


var midi = null;
var output = null;
var cur_acc="";
var pointer = -1,midiKeyboardswitch=0,song;

var kanjira_patterns = [["ta","tum","te"],["ta tum", "tum ta","ta te","ta.",".ta","te.",".te","tum.",".tum"],["ta thum thum ta"],["ta tumki ta tumki"],["tumki. tumki. ta thum thum ta"],["ta ta thum thum ta thum thum ta"]];

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
    sh.play(sounds[stroke].note(1,0,(60/tempo)-((time_now - time)/1000)));
//    sh.play(sounds[stroke].trigger(leadVolume));
    

}


document.onkeypress =function(event){
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

	play_on = 1; 
	sh.play(sounds[song].trigger(melVolume));
	//kanjira();

}

var kanjira = function(){
	
	
 	var currentComposition = sh.delay(1.0);
    var track_delay = 0.0;//parseFloat(document.getElementById("track_delay").value);
 			currentComposition = sh.track(
					sh.rate(tempo/ 60),
					sh.track(
					sh.delay(track_delay),
					combine_track(),
					sh.delay(0.01),
					combine_track(),
					sh.delay(0.01),
					combine_track(),
					sh.delay(0.01),
					combine_track())
                    );
                    
                    sh.play(currentComposition);
                    
//sh.play(sh.repeat( 4, sh.track( currentComposition,sh.delay(32.0))));
//sh.play(sh.repeat( 4,(sh.dynamic(function (clock) { return currentComposition; })));                    

	
function combine_track(){

	
//schedules to play the kanjira accompaniment - but if mridangam event is in, forks the track and adds that schedules that event too	

cur_acc = kanjira_patterns[Math.floor( 2.3 + 3*Math.random())];
	cur_acc = cur_acc[0];
	var kanjira_pattern;
	if(cur_acc.split(" ").length == 8 || cur_acc.split(" ").length == 6 ){
		kanjira_pattern = "[" + cur_acc + "," + 4 + "]";
	}
	else{
		kanjira_pattern = "[" + cur_acc + "," + 2 + "]";
	}
	document.getElementById("kanjira_patterns").value = kanjira_pattern;	
	var accompaniment_seq = sequence(kanjira_pattern);
	var accomp = accompaniment_seq[0];
	var accomp_tempo = accompaniment_seq[1],times;	
	var times = 4;
	
	if(accomp.length == 4){
	//sh.play(sh.repeat(8, sh.dynamic(function (clock) { return currentComposition; })));
	times = 8;
	}

	if(accomp.length == 8){
	//sh.play(sh.repeat(4, sh.dynamic(function (clock) { return currentComposition; })));
	times = 4;
	}

	return sh.track( sh.repeat( times , sh.track( accomp.map(function(s,index){	
	
		if(s == "."){
			return sh.track(sh.delay(1.0/accomp_tempo[0]));
		}
	
		else{	
			return sh.track([sounds[s].trigger(acmpVolume), sh.delay(1.0/accomp_tempo[0])]);
		}

	}))));

}

}

navigator.requestMIDIAccess(success, failure);	
debugger;   
init_vars();

