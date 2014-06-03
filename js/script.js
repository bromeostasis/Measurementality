//Version 2.0. We have some form of collision detection (space bar in correct location), but I still don't know how to
//make multiple notes appear at different times.
//I messed with ticker for a while, but couldn't get it working.
//Drew a staff across the screen and now have the notes lining up on them for our notes that exist so far.
//We need a better way to represent the notes though rather than hardcoding, so I'll probably work on that next.
//Also, added an octave variable to the create note method.
//Added in the ability to use sixteenth notes, eigth notes, quarter notes, half notes, and whole notes!
//Also, made it easy to select note letter, value, and octave.  Programmed hot cross buns!
//Next, have to program actual gameplay.
//WOOOOOOOO, added gameplay! Though, doesn't keep track of whether or not the person is holding the space bar for the right amount of time.
//Version 10: TheNote.id is now being used to keep track of octave
//Version 11: Added ability to button map using an array of values as input.
//Version 12: Changed note values to use actual values used in music.
//Version 13: Changed the half note file to be more like the others.  Added in tails to all the notes, but have yet to make these matter in hit detection...
//Version 14: Made it so that if you hit the space button on a tail it counts as a hit.  Also, changed the way the way notes progress in the array
//to a counter because it seemed to be taking a lot of resources using shifts.
//Version 15: So now if you lift up during a note you can't resume. Also added in a score bonus for "perfect" hits and letters to accompany the notes.
//Version 16: Now if you don't hit anything during a note it adds 1000 misses.
//Version 18: Moved the ticker from the generate note function to the init function for performance reasons. Also got rid of some unnecessary stage updates.
//Version 19: The tails change color now!!!!!!!
//Version 20: Fixed hit detection to make it easier to get a "perfect hit" using currentX variable. Added a bonus for hitting the note right on
//at its start. Now we have a small bonus for getting the beginning and a big bonus for releasing at the right time. I made hit detection so when I played
//through the level comfortably, I pretty much got a perfect score. Let me know if you think it's too easy.
//Version 20: Also added an "ideal score" which comes from (hand calculated) values based on each generateNote call.
//Still working on getting the score to display at the end.
//Version 21: Added in rests and the scoring logic for rests.
//Version 22: Added in a few comments, but will do more commenting later.  Also, made generate rest a seperate function and made it so that tails are invisible
//for rests.
//Version 23: Added in half rests and whole rests.  Moved the gClef to the right.  Added in a variable to choose whether or not a letter appears under a note.
//Removed the function that checked to see if a variable was a rest or not in favor of a boolean vaule isRest. Fixed whole notes so that spacing is correct
//with their tails.
//Version 24: Added a line as a visual aid as to where to press space.  Not sure how I feel about it though.
//Version 25: Fixed some music playback errors
//VERSION 26: Started drawing scorebox, fixed some hit detection issues.
//Version 27: Added in sharp and flat signs on the clef.
//Version 28: ?
//Version 29: You can now put flats, sharps, and naturals on notes! In fact, not only can you do that, but you have to.  I also a good amount of the hit detection
//stuff to inside the ticker and had to add to the keyup function in order for sharps and flats to work. So, woo!
//Version 30: Octave change is now based on when you press the spacebar and it defaults to right after the note passes the hit line (although this
//change still takes a little too long, I can't think of any other way to enact a quicker switch).

(function(){
//DisplayObject.suppressCrossDomainErrors = true;
var stage;
var canvas=$("#myCanv").get(0);
var noteXValue = 0;                                                 //Stores the x offset for each note
var size = 50;                                                      //The distance between each ledger line in the staff
var octave = 3;                                                     //The octave that the player is currently in

/*The default note values for each letter.
 *All values default to the third octave position.
 */
var fKey = 125 + size*3.5;                                              
var dKey = 125 + size*4.5;
var cKey = 125 + size*5;
var bKey = 125 + size*2;
var aKey = 125 + size*2.5;
var gKey = 125 + size*3;
var eKey = 125 + size*4;

var gClef;
var staff;
var hitLine;
var scoreBox;
var scoreBoxWidth = 250;
var notes = new Array();                                            //Array for storing the notes/rests in a level
var tails = new Array();                                            //Array for storing the tails for each note
var letters = new Array();                                          //Array for storing the letters tied to each note
var accidentals = new Array();
var c = 0;                                                          //A counter to keep track of level progression
var score = 0;
var colorCounter = 0;                                               //The amount of green that a tail should be
var misses = 0;
var scoreBoard;                                           
var perfection;
var noteMap = new Object();
var defaultMap = new Array(97, 98, 99, 100, 101, 102, 103, 32, 106, 107);
var released = false;                                          //Boolean for if the spacebar has been released
//Ben, these seem to be similarly named, but I'm not sure exactly what fHit does, and it currently didn't fit my needs, so I made firstHit, which
//detects whether this is the player's first time hitting notes[c]. I use it to give them an initial points boost for accurate hits.
var fHit = false;
var firstHit = true;
var gotSpotOn = false;
var noteToPlay = null;
var hasRested = true;
var played = false;
var anote1 = null;
var anote2 = null;
var anote3 = null;
var anote4 = null;
var anote5 = null;
var anoteb1 = null;
var anoteb2 = null;
var anoteb3 = null;
var anoteb4 = null;
var anoteb5 = null;

var bnote1 = null;
var bnote2 = null;
var bnote3 = null;
var bnote4 = null;
var bnote5 = null;
var bnoteb1 = null;
var bnoteb2 = null;
var bnoteb3 = null;
var bnoteb4 = null;
var bnoteb5 = null;

var cnote1 = null;
var cnote2 = null;
var cnote3 = null;
var cnote4 = null;
var cnote5 = null;

var dnote1 = null;
var dnote2 = null;
var dnote3 = null;
var dnote4 = null;
var dnote5 = null;
var dnoteb1 = null;
var dnoteb2 = null;
var dnoteb3 = null;
var dnoteb4 = null;
var dnoteb5 = null;

var enote1 = null;
var enote2 = null;
var enote3 = null;
var enote4 = null;
var enote5 = null;
var enoteb1 = null;
var enoteb2 = null;
var enoteb3 = null;
var enoteb4 = null;
var enoteb5 = null;

var fnote1 = null;
var fnote2 = null;
var fnote3 = null;
var fnote4 = null;
var fnote5 = null;

var gnote1 = null;
var gnote2 = null;
var gnote3 = null;
var gnote4 = null;
var gnote5 = null;
var gnoteb1 = null;
var gnoteb2 = null;
var gnoteb3 = null;
var gnoteb4 = null;
var gnoteb5 = null;
var failsound = null;
var currentOctave;
var misssound = null;
var idealScore = 0;
var currentX = 0;
var REST_XOFFSET = 10;
var REST_YOFFSET = 45;
var isSharp = false;
var isFlat = false;
var sharpSym = new createjs.Bitmap("images/sharp_symbol.svg");
var flatSym = new createjs.Bitmap("images/flat_symbol.svg");
var naturalSym = new createjs.Bitmap("images/natural_symbol.svg");
var title;
var startbutton;

this.init=function(){
    stage = new createjs.Stage(canvas);
    stage.suppressCrossDomainErrors = true;
    title=new createjs.Bitmap("images/Untitled.png");
    title.x=300;
    title.y=150;
    stage.addChild(title);   
    startbutton=new createjs.Bitmap("images/start game.png");
    startbutton.x=470;
    startbutton.y=250;
    startbutton.onClick = function(e){
    	levelSelect();	
    }
    stage.addChild(startbutton);
    stage.update();
    createjs.Ticker.setFPS(32);
    createjs.Ticker.addListener(this);
    
}

this.initMenu = function(data){
	
    myMenu = new DockMenu(data);
    myMenu.x = 100;
    myMenu.y = 100;
    stage.addChild(myMenu);
    stage.update();      
}
this.tick = function(){
  stage.tick();
}
this.levelSelect = function(){
	
	stage.removeAllChildren();
	$.ajax({
        type: "GET",
        crossDomain: false,  
        url: "data/menu.xml",
        dataType: "xml",
        success: initMenu
    });		
        
    	//icon=new Icon(90,144,92,"images/icon.png","#1E90FF","LEVEL 1!");
    	//icon.onClick = function(e){playlevel();};
    	//stage.addChild(icon);
    	/*lvl2.x=225;
    	lvl2.y=100;
    	stage.addChild(lvl2);    	
    	lvl3.x=375;
    	lvl3.y=100;
    	stage.addChild(lvl3);
    	lvl4.x=525;
    	lvl4.y=100;
    	stage.addChild(lvl4); 	
    	lvl5.x=675;
    	lvl5.y=100;
    	stage.addChild(lvl5);
    	lvl6.x=825;
    	lvl6.y=100;
    	stage.addChild(lvl6);
    	lvl7.x=975;
    	lvl7.y=100;
    	stage.addChild(lvl7);
    	lvl8.x=75;
    	lvl8.y=200;
    	stage.addChild(lvl8);
    	lvl9.x=225;
    	lvl9.y=200;
    	stage.addChild(lvl9);
    	lvl10.x=375;
    	lvl10.y=200;
    	stage.addChild(lvl10);
    	lvl11.x=525;
    	lvl11.y=200;
    	stage.addChild(lvl11);
    	lvl12.x=675;
    	lvl12.y=200;
    	stage.addChild(lvl12);
    	lvl13.x=825;
    	lvl13.y=200;
    	stage.addChild(lvl13);
    	lvl14.x=975;
    	lvl14.y=200;
    	stage.addChild(lvl14); 	
    	lvl15.x=75;
    	lvl15.y=300;
    	stage.addChild(lvl15);
    	lvl16.x=225;
    	lvl16.y=300;
    	stage.addChild(lvl16);
    	lvl17.x=375;
    	lvl17.y=300;
    	stage.addChild(lvl17);
    	lvl18.x=525;
    	lvl18.y=300;
    	stage.addChild(lvl18);
    	lvl19.x=675;
    	lvl19.y=300;
    	stage.addChild(lvl19);
    	lvl20.x=825;
    	lvl20.y=300;
    	stage.addChild(lvl20);
    	lvl21.x=975;
    	lvl21.y=300;
    	stage.addChild(lvl21);*/
    	stage.update();
}

this.playlevel = function(data){
	stage.removeAllChildren();
         		
    staff = new createjs.Shape();
    staff.graphics.beginStroke("black");
    staff.graphics.setStrokeStyle(5);
    staff.graphics.moveTo(0, 125 + size*4);
    staff.graphics.lineTo(canvas.width, 125 + size*4);
    staff.graphics.moveTo(0, 125 + size*3);
    staff.graphics.lineTo(canvas.width, 125 + size*3);
    staff.graphics.moveTo(0, 125 + size*2);
    staff.graphics.lineTo(canvas.width, 125 + size*2);
    staff.graphics.moveTo(0, 125 + size);
    staff.graphics.lineTo(canvas.width, 125 + size);
    staff.graphics.moveTo(0, 125);
    staff.graphics.lineTo(canvas.width, 125);
    stage.addChild(staff);
    
    noteMap = generateButtonMap(defaultMap);
    
    gClef = new createjs.Bitmap("images/TrebleClef.svg.hi.png");
    gClef.regY = 298;
    gClef.scaleX = .1;
    gClef.scaleY = .1;
    gClef.x = 100;
    gClef.y = cKey;
    gClef.width = 22;
    stage.addChild(gClef);
    
    naturalSym.scaleX = .6;
    naturalSym.scaleY = .6;
    naturalSym.regY = 50;
    naturalSym.x = gClef.x - 50;
    naturalSym.y = gClef.y;
    stage.addChild(naturalSym);
    
    sharpSym.scaleX = .2;
    sharpSym.scaleY = .2;
    sharpSym.regY = 100;
    sharpSym.x = gClef.x - 50;
    sharpSym.y = gClef.y;
    sharpSym.visible = false;
    stage.addChild(sharpSym);
    
    flatSym.scaleX = .15;
    flatSym.scaleY = .15;
    flatSym.regY = 200;
    flatSym.x = gClef.x - 50;
    flatSym.y = gClef.y;
    flatSym.visible = false;
    stage.addChild(flatSym);
    
    hitLine = new createjs.Shape();
    hitLine.graphics.beginStroke("black");
    hitLine.graphics.setStrokeStyle(2);
    hitLine.graphics.moveTo(gClef.x + gClef.width/2, 0);
    hitLine.graphics.lineTo(gClef.x + gClef.width/2, 600);
    stage.addChild(hitLine);
    
    var scoreBoxOutline = new createjs.Shape();
    scoreBoxOutline.graphics.beginStroke("black");
    scoreBoxOutline.graphics.setStrokeStyle(20);
    scoreBoxOutline.graphics.moveTo(canvas.width - 400, 410);
    scoreBoxOutline.graphics.lineTo(canvas.width - 50, 410);
    scoreBoxOutline.graphics.lineTo(canvas.width-50, 485);
    scoreBoxOutline.graphics.moveTo(canvas.width - 390, 410);
    scoreBoxOutline.graphics.lineTo(canvas.width - 390, 485);
    scoreBoxOutline.graphics.lineTo(canvas.width-40, 485);
    stage.addChild(scoreBoxOutline);
    
    var graphics2 = new createjs.Graphics().beginFill("#00ff00").drawRect(820, 420, 250, 55);
    scoreBox = new createjs.Shape(graphics2);

    stage.addChild(scoreBox);
    
    scoreBoard = new createjs.Text();
    scoreBoard.text = "Hits: " + score + "  Misses: " + misses;
    scoreBoard.font = "20px Arial";
    scoreBoard.color = "purple";
    scoreBoard.x = 50;
    scoreBoard.y = 450;
    scoreBoard.rotation = -30;
    stage.addChild(scoreBoard);
    		
    var note;
    var letter;
    var accidental;
    var octave;
    var wLetter;
    var oct;
    var letterNum;
    var type;
    var rest;
    $(data).find('item').each(function(){
        
        type = $(this).find("type").text();
        if(type=="n"){
    		note = $(this).find("note").text();
    		letter = $(this).find("letter").text();
    		accidental = $(this).find("accidental").text();
        	octave = $(this).find("octave").text();
        	wLetter = $(this).find("wLetter").text();
                    
        	if(letter=="aKey"){
        	  	letterNum=aKey;
        	}
        	else if(letter=="bKey"){
        	  	letterNum=bKey;
        	}
        	else if(letter=="cKey"){
        	   	letterNum=cKey;
        	}
        	else if(letter=="dKey"){
        	  	letterNum=dKey;
        	}
        	else if(letter=="eKey"){
           		letterNum=eKey;
        	}
        	else if(letter=="fKey"){
          		letterNum=fKey;
        	}
        	else if(letter=="gKey"){
           		letterNum=gKey;
        	}
        	var oct=parseInt(octave);
			
        	console.log("note: "+note+" letter: "+letter+" octave: "+octave);
    		
    		generateNote(note,letterNum,accidental,oct,wLetter);
    	}
    	else if (type=="r"){
    		rest = $(this).find("rest").text();
    		generateRest(rest);
    	}
    	
   	});
   	
   	bigSub = 2*(320/(notes.length));
    smallSub = 320/(notes.length);
    currentOctave = notes[0].id;
    
    idealScore += notes.length * 1500;
    //alert(idealScore);
    cnote1 = new buzz.sound("sounds/neatonk__piano-med-c1",{formats: [ "ogg", "mp3" ]});
    dnote1 = new buzz.sound("sounds/neatonk__piano-med-d1",{formats: [ "ogg", "mp3" ]});
    enote1 = new buzz.sound("sounds/neatonk__piano-med-e1",{formats: [ "ogg", "mp3" ]});
    fnote1 = new buzz.sound("sounds/neatonk__piano-med-f1",{formats: [ "ogg", "mp3" ]});
    gnote1 = new buzz.sound("sounds/neatonk__piano-med-g1",{formats: [ "ogg", "mp3" ]});
    anote1 = new buzz.sound("sounds/neatonk__piano-med-a1",{formats: [ "ogg", "mp3" ]});
    bnote1 = new buzz.sound("sounds/neatonk__piano-med-b1",{formats: [ "ogg", "mp3" ]});
    cnote2 = new buzz.sound("sounds/neatonk__piano-med-c2",{formats: [ "ogg", "mp3" ]});
    dnote2 = new buzz.sound("sounds/neatonk__piano-med-d2",{formats: [ "ogg", "mp3" ]});
    enote2 = new buzz.sound("sounds/neatonk__piano-med-e2",{formats: [ "ogg", "mp3" ]});
    fnote2 = new buzz.sound("sounds/neatonk__piano-med-f2",{formats: [ "ogg", "mp3" ]});
    gnote2 = new buzz.sound("sounds/neatonk__piano-med-g2",{formats: [ "ogg", "mp3" ]});
    anote2 = new buzz.sound("sounds/neatonk__piano-med-a2",{formats: [ "ogg", "mp3" ]});
    bnote2 = new buzz.sound("sounds/neatonk__piano-med-b2",{formats: [ "ogg", "mp3" ]});
    cnote3 = new buzz.sound("sounds/neatonk__piano-med-c3",{formats: [ "ogg", "mp3" ]});
    dnote3 = new buzz.sound("sounds/neatonk__piano-med-d3",{formats: [ "ogg", "mp3" ]});
    enote3 = new buzz.sound("sounds/neatonk__piano-med-e3",{formats: [ "ogg", "mp3" ]});
    fnote3 = new buzz.sound("sounds/neatonk__piano-med-f3",{formats: [ "ogg", "mp3" ]});
    gnote3 = new buzz.sound("sounds/neatonk__piano-med-g3",{formats: [ "ogg", "mp3" ]});
    anote3 = new buzz.sound("sounds/neatonk__piano-med-a3",{formats: [ "ogg", "mp3" ]});
    bnote3 = new buzz.sound("sounds/neatonk__piano-med-b3",{formats: [ "ogg", "mp3" ]});
    cnote4 = new buzz.sound("sounds/neatonk__piano-med-c4",{formats: [ "ogg", "mp3" ]});
    dnote4 = new buzz.sound("sounds/neatonk__piano-med-d4",{formats: [ "ogg", "mp3" ]});
    enote4 = new buzz.sound("sounds/neatonk__piano-med-e4",{formats: [ "ogg", "mp3" ]});
    fnote4 = new buzz.sound("sounds/neatonk__piano-med-f4",{formats: [ "ogg", "mp3" ]});
    gnote4 = new buzz.sound("sounds/neatonk__piano-med-g4",{formats: [ "ogg", "mp3" ]});
    anote4 = new buzz.sound("sounds/neatonk__piano-med-a4",{formats: [ "ogg", "mp3" ]});
    bnote4 = new buzz.sound("sounds/neatonk__piano-med-b4",{formats: [ "ogg", "mp3" ]});
    cnote5 = new buzz.sound("sounds/neatonk__piano-med-c5",{formats: [ "ogg", "mp3" ]});
    dnote5 = new buzz.sound("sounds/neatonk__piano-med-d5",{formats: [ "ogg", "mp3" ]});
    enote5 = new buzz.sound("sounds/neatonk__piano-med-e5",{formats: [ "ogg", "mp3" ]});
    fnote5 = new buzz.sound("sounds/neatonk__piano-med-f5",{formats: [ "ogg", "mp3" ]});
    gnote5 = new buzz.sound("sounds/neatonk__piano-med-g5",{formats: [ "ogg", "mp3" ]});
    anote5 = new buzz.sound("sounds/neatonk__piano-med-a5",{formats: [ "ogg", "mp3" ]});
    bnote5 = new buzz.sound("sounds/neatonk__piano-med-b5",{formats: [ "ogg", "mp3" ]});

    dnoteb1 = new buzz.sound("sounds/neatonk__piano-med-db1",{formats: [ "ogg", "mp3" ]});
    enoteb1 = new buzz.sound("sounds/neatonk__piano-med-eb1",{formats: [ "ogg", "mp3" ]});
    
    gnoteb1 = new buzz.sound("sounds/neatonk__piano-med-g1",{formats: [ "ogg", "mp3" ]});
    anoteb1 = new buzz.sound("sounds/neatonk__piano-med-ab1",{formats: [ "ogg", "mp3" ]});
    bnoteb1 = new buzz.sound("sounds/neatonk__piano-med-bb1",{formats: [ "ogg", "mp3" ]});
    
    dnoteb2 = new buzz.sound("sounds/neatonk__piano-med-db2",{formats: [ "ogg", "mp3" ]});
    enoteb2 = new buzz.sound("sounds/neatonk__piano-med-eb2",{formats: [ "ogg", "mp3" ]});
    
    gnoteb2 = new buzz.sound("sounds/neatonk__piano-med-gb2",{formats: [ "ogg", "mp3" ]});
    anoteb2 = new buzz.sound("sounds/neatonk__piano-med-ab2",{formats: [ "ogg", "mp3" ]});
    bnoteb2 = new buzz.sound("sounds/neatonk__piano-med-bb2",{formats: [ "ogg", "mp3" ]});
    
    dnoteb3 = new buzz.sound("sounds/neatonk__piano-med-db3",{formats: [ "ogg", "mp3" ]});
    enoteb3 = new buzz.sound("sounds/neatonk__piano-med-eb3",{formats: [ "ogg", "mp3" ]});
    
    gnoteb3 = new buzz.sound("sounds/neatonk__piano-med-gb3",{formats: [ "ogg", "mp3" ]});
    anoteb3 = new buzz.sound("sounds/neatonk__piano-med-ab3",{formats: [ "ogg", "mp3" ]});
    bnoteb3 = new buzz.sound("sounds/neatonk__piano-med-bb3",{formats: [ "ogg", "mp3" ]});
    
    dnoteb4 = new buzz.sound("sounds/neatonk__piano-med-db4",{formats: [ "ogg", "mp3" ]});
    enoteb4 = new buzz.sound("sounds/neatonk__piano-med-eb4",{formats: [ "ogg", "mp3" ]});
    
    gnoteb4 = new buzz.sound("sounds/neatonk__piano-med-gb4",{formats: [ "ogg", "mp3" ]});
    anoteb4 = new buzz.sound("sounds/neatonk__piano-med-ab4",{formats: [ "ogg", "mp3" ]});
    bnoteb4 = new buzz.sound("sounds/neatonk__piano-med-bb4",{formats: [ "ogg", "mp3" ]});
    
    dnoteb5 = new buzz.sound("sounds/neatonk__piano-med-db5",{formats: [ "ogg", "mp3" ]});
    enoteb5 = new buzz.sound("sounds/neatonk__piano-med-eb5",{formats: [ "ogg", "mp3" ]});
    
    gnoteb5 = new buzz.sound("sounds/neatonk__piano-med-gb5",{formats: [ "ogg", "mp3" ]});
    anoteb5 = new buzz.sound("sounds/neatonk__piano-med-ab5",{formats: [ "ogg", "mp3" ]});
    bnoteb5 = new buzz.sound("sounds/neatonk__piano-med-bb5",{formats: [ "ogg", "mp3" ]});

    misssound = new buzz.sound("sounds/miss", {formats: ["ogg","mp3 "]});
    failsound = new buzz.sound("sounds/Sad-Trombone", {formats: ["ogg","mp3"]});
    
    var oneTime = true;
    createjs.Ticker.setFPS(60);
       	
    
    createjs.Ticker.addListener(function(){
        if (scoreBoxWidth > 0) {
            scoreBoard.text = "Hits: " + score + "  Misses: " + misses;
            for (i = 0; i < notes.length; i++) {
                notes[i].x -= 6;
                tails[i].x -= 6;
                letters[i].x -= 6;
                accidentals[i].x -= 6;
            }
            //Once the current note has passed the hit box..
            if (fHit && !released) {
                tails[c].graphics.clear();
                var newTail = new createjs.Shape();
                newTail.graphics.beginStroke("rgb(0," + Math.ceil(colorCounter*(256/(tails[c].width/.3) + 1)) + ",0)");
                newTail.graphics.setStrokeStyle(20, "round");
                newTail.graphics.moveTo(notes[c].x + 100, notes[c].y);
                newTail.graphics.lineTo(notes[c].x + tails[c].width + 100, notes[c].y);
                newTail.width = tails[c].width;
                tails[c] = newTail;
                stage.addChild(newTail);
                score++;
                colorCounter++;
	    }
            if ((notes[c].x + tails[c].width + (120 + gClef.width/2) - gClef.x) < 0) {
		if(c+1 < notes.length){
		    currentOctave = notes[c+1].id;
		}
                released = false;
                if (!fHit) {
		    //alert(notes[c].isRest);
                    if (notes[c].isRest && hasRested) {
                        score+=1500;
                        scoreBoxWidth += smallSub;
                        drawScore(scoreBoxWidth);
                    }
                    else{
                        misses += 1000;
                        scoreBoxWidth -= bigSub;
                        drawScore(scoreBoxWidth);
                    }
                }
		
                fHit = false;
                firstHit = true;
                gotSpotOn = false;
                hasRested = true;
                c++;
                played = false;
                colorCounter = 0;
            }
            stage.update();
        }
        else{
            scoreBoxWidth=0;
            drawScore(0);
            //alert("FAILURE");
            failsound.play();
            note[1000] = 10;
        }
    });
}

/*
this.scoreScreen=new function(){
	stage.removeAllChildren();
	startbutton=new createjs.Bitmap("images/start game.png");
    startbutton.x=470;
    startbutton.y=250;
    startbutton.onClick = function(e){
    	levelSelect();	
    }
}*/
    	
document.onkeyup = function(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    if (charCode == noteMap.hit) {
            if (fHit) {
                released = true;
                played = false;
            }
            //If they release at the correct time and hit it right (gotSpotOn) at the beginning, give them extra extra score!
    
            currentX = tails[c].width + notes[c].x;
    
            //if (gotSpotOn) {
                //  alert(currentX);
            //}
            if (currentX < 30 && currentX > 0 && gotSpotOn) {                    
                playNote(noteToPlay,notes[0].id);
                score += 500;
                colorCounter += 50;
                scoreBoxWidth += smallSub;
                drawScore(scoreBoxWidth);
            }
            gotSpotOn = false;
            played = false;
            stopNote(noteToPlay,notes[0].id);
            //sound.stop();
    } else if (isSharp) {
        isSharp = false;
        sharpSym.visible = false;
        naturalSym.visible = true;
        flatSym.visible = false;
    } else if (isFlat) {
        isFlat = false;
        flatSym.visible = false;
        naturalSym.visible = true;
        sharpSym.visible = false;
    }
}

document.onkeypress = function(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var map = new Object();
    switch (charCode) {
	case noteMap.a:
	    noteToPlay = 'a';
	    played = false;
	    gClef.y = aKey - (currentOctave - 3)*7*25;
            naturalSym.y = gClef.y;
            sharpSym.y = gClef.y;
            flatSym.y = gClef.y;
	    stage.update();
	    break;
	case noteMap.hit:
            //alert(notes[c].x);
            if (notes[c].isRest && (notes[c].x < (-30 + gClef.x)) && (notes[c].x > (-110 - tails[c].width + gClef.x))) {
                hasRested = false;
            }
	    if (notes[c].x > ((-30 + gClef.width/2) + gClef.x) || notes[c].x < (-110 + gClef.width/2 - tails[c].width + gClef.x) || notes[c].y != gClef.y || notes[c].flat !=isFlat || notes[c].sharp != isSharp) {
                misssound.stop();
		misssound.play();
		misses++;
                scoreBoxWidth -= smallSub;
                drawScore(scoreBoxWidth);
	    } else if (!released && notes[c].flat == isFlat && notes[c].sharp == isSharp) {
                playNote(noteToPlay,notes[c].id);
		if(c+1 < notes.length){
		    currentOctave = notes[c+1].id;
		}
		fHit = true;
                //If they get it right on, give them extra score!
                if (notes[c].x > (-100 + gClef.x + gClef.width/2) && firstHit) {
                    score += 1000;
                    colorCounter += 20;
                    firstHit = false;
                    gotSpotOn = true;
                    scoreBoxWidth += bigSub;
                    drawScore(scoreBoxWidth);
                }
            }else{
                misssound.stop();
                misssound.play();
                misses++;
            }
	    stage.update();
	    break;
	case noteMap.b:
	    noteToPlay = 'b';
	    played = false;
	    gClef.y = bKey - ((currentOctave - 3)*7*25);
            naturalSym.y = gClef.y;
            sharpSym.y = gClef.y;
            flatSym.y = gClef.y;
	    stage.update();
	    break;
	case noteMap.c:
	    noteToPlay = 'c';
	    played = false;
	    gClef.y = cKey - ((currentOctave - 3)*7*25);
            naturalSym.y = gClef.y;
            sharpSym.y = gClef.y;
            flatSym.y = gClef.y;
	    stage.update();
	    break;
	case noteMap.d:
	    noteToPlay = 'd';
	    played = false;
	    gClef.y = dKey - ((currentOctave - 3)*7*25);
            naturalSym.y = gClef.y;
            sharpSym.y = gClef.y;
            flatSym.y = gClef.y;
	    stage.update();
	    break;
	case noteMap.e:
	    noteToPlay = 'e';
	    played = false;
	    gClef.y = eKey - ((currentOctave - 3)*7*25);
            naturalSym.y = gClef.y;
            sharpSym.y = gClef.y;
            flatSym.y = gClef.y;
	    stage.update();
	    break;
	case noteMap.f:
	    noteToPlay = 'f';
	    played = false;
	    gClef.y = fKey - ((currentOctave - 3)*7*25);
            naturalSym.y = gClef.y;
            sharpSym.y = gClef.y;
            flatSym.y = gClef.y;
	    stage.update();
	    break;
	case noteMap.g:
	    noteToPlay = 'g';
	    played = false;
	    gClef.y = gKey - ((currentOctave - 3)*7*25);
            naturalSym.y = gClef.y;
            sharpSym.y = gClef.y;
            flatSym.y = gClef.y;
	    stage.update();
	    break;
        case noteMap.sharp:
            isSharp = true;
            isFlat = false;
            sharpSym.visible = true;
            naturalSym.visible = false;
            flatSym.visible = false;
            stage.update();
            break;
        case noteMap.flat:
            isFlat = true;
            isSharp = false;
            flatSym.visible = true;
            naturalSym.visible = false;
            sharpSym.visible = false;
            stage.update();
            break;
	default:
	    break;
    }
}

this.generateButtonMap=function(valueArray) {
    var myMap = {a: valueArray[0], b: valueArray[1], c: valueArray[2], d: valueArray[3], e: valueArray[4], f: valueArray[5], g: valueArray[6], hit: valueArray[7], sharp: valueArray[8], flat: valueArray[9]}
    return myMap;
}

this.generateRest=function(restType) {
    var canvas = document.getElementById("myCanv");
    var canvasRight = canvas.width;
    var canvasBottom = canvas.height;
    var tail = new createjs.Shape();
    var theRest;
    var restLetter;
    var acciPlaceHolder = new createjs.Bitmap("images/natural_symbol.svg");
    if (restType == "q") {
        theRest = new createjs.Bitmap("images/quarter_rest.svg");
        theRest.regY = 740;
	theRest.scaleX = .25;
	theRest.scaleY = .25;
	theRest.x = canvasRight + noteXValue;
	theRest.y = canvasBottom/2 + 5;
	noteXValue += 400;
        tail.graphics.beginStroke();
        var tailStart = theRest.x + 400;
        var tailEnd = theRest.x + 400;
        tail.visible = false;
        tail.graphics.moveTo(tailStart + REST_XOFFSET, theRest.y - REST_YOFFSET);
        tail.graphics.lineTo(tailEnd, theRest.y - REST_YOFFSET);
        tail.width = 300;
    } else if (restType == "e") {
        theRest = new createjs.Bitmap("images/eigth_rest.svg");
	theRest.regY = 740;
	theRest.scaleX = .25;
	theRest.scaleY = .25;
	theRest.x = canvasRight + noteXValue;
	theRest.y = canvasBottom/2 + 5;
	noteXValue += 200;
        tail.graphics.beginStroke();
        var tailStart = theRest.x + 200;
        var tailEnd = theRest.x + 200;
        tail.graphics.moveTo(tailStart + REST_XOFFSET, theRest.y - REST_YOFFSET);
        tail.graphics.lineTo(tailEnd, theRest.y - REST_YOFFSET);
        tail.width = 100;
    } else if (restType == "h") {
        theRest = new createjs.Bitmap("images/half_rest.png");
	theRest.x = canvasRight + noteXValue;
	theRest.y = 145;
	noteXValue += 800;
        tail.graphics.beginStroke();
        var tailStart = theRest.x + 800;
        var tailEnd = theRest.x + 800;
        tail.graphics.moveTo(tailStart, theRest.y);
        tail.graphics.lineTo(tailEnd, theRest.y);
        tail.width = 700;
    } else if (restType == "w") {
        theRest = new createjs.Bitmap("images/whole_rest.png");
        theRest.scaleX = .11;
        theRest.scaleY = .11;
	theRest.x = canvasRight + noteXValue;
	theRest.y = 174;
	noteXValue += 1600;
        tail.graphics.beginStroke();
        var tailStart = theRest.x + 1600;
        var tailEnd = theRest.x + 1600;
        tail.graphics.moveTo(tailStart, theRest.y);
        tail.graphics.lineTo(tailEnd, theRest.y);
        tail.width = 1500;
    }
    restLetter = new createjs.Text();
    restLetter.text = "R";
    restLetter.font = "20px Arial";
    restLetter.color = "purple";
    restLetter.x = theRest.x + 65;
    restLetter.y = theRest.y + 25;
    theRest.id = 3;
    theRest.isRest = true;
    theRest.isNatural = false;
    theRest.isFlat = false;
    theRest.isSharp = false;
    tail.visible = false;
    stage.addChild(theRest);
    stage.addChild(tail);
    notes.push(theRest);
    tails.push(tail);
    letters.push(restLetter);
    accidentals.push(acciPlaceHolder);
}

this.generateNote=function(note, letter, accid, oct, withLetter) {    
    var canvas = document.getElementById("myCanv");
    var canvasRight = canvas.width;
    var canvasBottom = canvas.height;
    var tail = new createjs.Shape();
    var theNote;
    var noteLetter;
    if (note == "s") {
	theNote = new createjs.Bitmap("images/sixteenth_note.svg");
	theNote.regY = 740;
	theNote.scaleX = .25;
	theNote.scaleY = .25;
	theNote.x = canvasRight + noteXValue;
	theNote.y = letter - ((oct - 3)*7*25);
	noteXValue += 100;
	tail.graphics.beginStroke("black");
	tail.graphics.setStrokeStyle(20, "round");
	var tailStart = theNote.x + 100;
	var tailEnd = theNote.x + 100;
	tail.graphics.moveTo(tailStart, theNote.y);
	tail.graphics.lineTo(tailEnd, theNote.y);
	tail.width = 0;
    } else if (note == "e") {
	theNote = new createjs.Bitmap("images/eighth_note.svg");
	theNote.regY = 740;
	theNote.scaleX = .25;
	theNote.scaleY = .25;
	theNote.x = canvasRight + noteXValue;
	theNote.y = letter - ((oct - 3)*7*25);
	noteXValue += 200;
	tail.graphics.beginStroke("black");
	tail.graphics.setStrokeStyle(20, "round");
	var tailStart = theNote.x + 100;
	var tailEnd = theNote.x + 200;
	tail.graphics.moveTo(tailStart, theNote.y);
	tail.graphics.lineTo(tailEnd, theNote.y);
	tail.width = 100;
        idealScore +=40;
    } else if (note == "q") {
	theNote = new createjs.Bitmap("images/quarter_note.svg");
	theNote.regY = 740;
	theNote.x = canvasRight + noteXValue;
	theNote.y = letter - ((oct - 3)*7*25);
	theNote.scaleX = .25;
	theNote.scaleY = .25;
	noteXValue += 400;
	tail.graphics.beginStroke("rgb(0," + score + ",0)");
	tail.graphics.setStrokeStyle(20, "round");
	var tailStart = theNote.x + 100;
	var tailEnd = theNote.x + 400;
	tail.graphics.moveTo(tailStart, theNote.y);
	tail.graphics.lineTo(tailEnd, theNote.y);
	tail.width = 300;
        idealScore += 92;
    } else if (note == "h") {
	theNote = new createjs.Bitmap("images/half_note.svg");
	theNote.regY = 740;
	theNote.scaleX = .25;
	theNote.scaleY = .25;
	theNote.x = canvasRight + noteXValue;
	theNote.y = letter - ((oct - 3)*7*25);
	noteXValue += 800;
	tail.graphics.beginStroke("black");
	tail.graphics.setStrokeStyle(20, "round");
	var tailStart = theNote.x + 100;
	var tailEnd = theNote.x + 800;
	tail.graphics.moveTo(tailStart, theNote.y);
	tail.graphics.lineTo(tailEnd, theNote.y);
	tail.width = 700;
        idealScore += 190;
    } else if (note == "w") {
	theNote = new createjs.Bitmap("images/whole_note.svg");
        theNote.regX = -5
	theNote.regY = 3.5;
	theNote.scaleX = 6.2;
	theNote.scaleY = 6.2;
	theNote.x = canvasRight + noteXValue;
	theNote.y = letter - ((oct - 3)*7*25);
	noteXValue += 1600;
	tail.graphics.beginStroke("black");
	tail.graphics.setStrokeStyle(20, "round");
	var tailStart = theNote.x + 100;
	var tailEnd = theNote.x + 1600;
	tail.graphics.moveTo(tailStart, theNote.y);
	tail.graphics.lineTo(tailEnd, theNote.y);
	tail.width = 1500;
        idealScore += 400;
    }
    if (accid == "n") {
        var naturalSign = new createjs.Bitmap("images/natural_symbol.svg");
        naturalSign.scaleX = .6;
        naturalSign.scaleY = .6;
        naturalSign.regY = 50;
        naturalSign.y = theNote.y;
        naturalSign.x = theNote.x + 25;
        theNote.natural = true;
        theNote.sharp = false;
        theNote.flat = false;
        accidentals.push(naturalSign);
        stage.addChild(naturalSign);
    } else if (accid == "s") {
        var sharpSign = new createjs.Bitmap("images/sharp_symbol.svg");
        sharpSign.scaleX = .2;
        sharpSign.scaleY = .2;
        sharpSign.regY = 100;
        sharpSign.y = theNote.y;
        sharpSign.x = theNote.x + 10;
        theNote.sharp = true;
        theNote.natural = false;
        theNote.flat = false;
        accidentals.push(sharpSign);
        stage.addChild(sharpSign);
    } else if (accid == "f"){
        var flatSign = new createjs.Bitmap("images/flat_symbol.svg");
        flatSign.scaleX = .15;
        flatSign.scaleY = .15;
        flatSign.regY = 200;
        flatSign.y = theNote.y;
        flatSign.x = theNote.x + 10;
        theNote.flat = true;
        theNote.natural = false;
        theNote.sharp = false;
        accidentals.push(flatSign);
        stage.addChild(flatSign);
    }
    if (withLetter) {
        if (letter == aKey) {
            noteLetter = new createjs.Text();
            noteLetter.text = "A";
            noteLetter.font = "20px Arial";
            noteLetter.color = "purple";
            noteLetter.x = theNote.x + 65;
            noteLetter.y = theNote.y + 25;
            stage.addChild(noteLetter);
        } else if (letter == bKey) {
            noteLetter = new createjs.Text();
            noteLetter.text = "B"
            noteLetter.font = "20px Arial";
            noteLetter.color = "purple";
            noteLetter.x = theNote.x + 65;
            noteLetter.y = theNote.y + 25;
            stage.addChild(noteLetter);
        } else if (letter == cKey) {
            noteLetter = new createjs.Text();
            noteLetter.text = "C"
            noteLetter.font = "20px Arial";
            noteLetter.color = "purple";
            noteLetter.x = theNote.x + 65;
            noteLetter.y = theNote.y + 25;
            stage.addChild(noteLetter);
        } else if (letter == dKey) {
            noteLetter = new createjs.Text();
            noteLetter.text = "D";
            noteLetter.font = "20px Arial";
            noteLetter.color = "purple";
            noteLetter.x = theNote.x + 65;
            noteLetter.y = theNote.y + 25;
            stage.addChild(noteLetter);
        } else if (letter == eKey) {
            noteLetter = new createjs.Text();
            noteLetter.text = "E";
            noteLetter.font = "20px Arial";
            noteLetter.color = "purple";
            noteLetter.x = theNote.x + 65;
            noteLetter.y = theNote.y + 25;
            stage.addChild(noteLetter);
        } else if (letter == fKey) {
            noteLetter = new createjs.Text();
            noteLetter.text = "F";
            noteLetter.font = "20px Arial";
            noteLetter.color = "purple";
            noteLetter.x = theNote.x + 65;
            noteLetter.y = theNote.y + 25;
            stage.addChild(noteLetter);
        } else if (letter == gKey) {
            noteLetter = new createjs.Text();
            noteLetter.text = "G";
            noteLetter.font = "20px Arial";
            noteLetter.color = "purple";
            noteLetter.x = theNote.x + 65;
            noteLetter.y = theNote.y + 25;
            stage.addChild(noteLetter);
        }
    }
    theNote.id = oct;
    theNote.isRest = false;
    stage.addChild(theNote);
    stage.addChild(tail);
    notes.push(theNote);
    tails.push(tail);
    letters.push(noteLetter);
}

this.playNote=function(letter, octave){if (octave == 1){
    if (letter == 'a') {
    if(!played) {
        if(isSharp){
        bnoteb1.play();
        played = true;
    }
    else if(isFlat){
        anoteb1.play();
        played = true;
    }else{
        anote1.play();
        played = true;
    }
    } 
    } else if (letter == 'b') {
    if(!played) {
        if(isSharp){
            cnote2.play();
        played = true;
    }
    else if(isFlat){
        bnoteb1.play();
        played = true;
    }else{
        bnote1.play();
        played = true;
    }
    } 
    } else if (letter == 'c') {
    if(!played) {
        if(isSharp){
            dnoteb1.play();
        played = true;
    }
    else if(isFlat){
        ;//no notebb0 yet...
    }else{
        cnote1.play();
        played = true;
    }
    } 
    } else if (letter == 'd') {
    if(!played) {
        if(isSharp){
            enoteb1.play();
        played = true;
    }
    else if(isFlat){
        dnoteb1.play();
        played = true;
    }else{
        dnote1.play();
        played = true;
    }
    } 
    } else if (letter == 'e') {
    if(!played) {
        if(isSharp){
            fnote1.play();
        played = true;
    }
    else if(isFlat){
        enoteb1.play();
        played = true;
    }else{
        enote1.play();
        played = true;
    }
    } 
    } else if (letter == 'f') {
    if(!played) {
        if(isSharp){
            gnoteb1.play();
        played = true;
    }
    else if(isFlat){
        enote1.play();
        played = true;
    }else{
        fnote1.play();
        played = true;
    }
    } 
    } else if (letter == 'g') {
    if(!played) {
        if(isSharp){
            anoteb1.play();
        played = true;
    }
    else if(isFlat){
        gnoteb1.play();
        played = true;
    }else{
        gnote1.play();
        played = true;
    }
    } 
    }
}else if (octave == 2){
if (letter == 'a') {
    if(!played) {
        if(isSharp){
        bnoteb2.play();
        played = true;
    }
    else if(isFlat){
        anoteb2.play();
        played = true;
    }else{
        anote2.play();
        played = true;
    }
    } 
    } else if (letter == 'b') {
    if(!played) {
        if(isSharp){
            cnote3.play();
        played = true;
    }
    else if(isFlat){
        bnoteb2.play();
        played = true;
    }else{
        bnote2.play();
        played = true;
    }
    } 
    } else if (letter == 'c') {
    if(!played) {
        if(isSharp){
            dnoteb2.play();
        played = true;
    }
    else if(isFlat){
        bnote1.play();
        played = true;
    }else{
        cnote2.play();
        played = true;
    }
    } 
    } else if (letter == 'd') {
    if(!played) {
        if(isSharp){
            enoteb2.play();
        played = true;
    }
    else if(isFlat){
        dnoteb2.play();
        played = true;
    }else{
        dnote2.play();
        played = true;
    }
    } 
    } else if (letter == 'e') {
    if(!played) {
        if(isSharp){
            fnote2.play();
        played = true;
    }
    else if(isFlat){
        enoteb2.play();
        played = true;
    }else{
        enote2.play();
        played = true;
    }
    } 
    } else if (letter == 'f') {
    if(!played) {
        if(isSharp){
            gnoteb2.play();
        played = true;
    }
    else if(isFlat){
        enote2.play();
        played = true;
    }else{
        fnote2.play();
        played = true;
    }
    } 
    } else if (letter == 'g') {
    if(!played) {
        if(isSharp){
            anoteb2.play();
        played = true;
    }
    else if(isFlat){
        gnoteb2.play();
        played = true;
    }else{
        gnote2.play();
        played = true;
    }
    } 
    }
}else if (octave == 3){
if (letter == 'a') {
    if(!played) {
        if(isSharp){
        bnoteb3.play();
        played = true;
    }
    else if(isFlat){
        anoteb3.play();
        played = true;
    }else{
        anote3.play();
        played = true;
    }
    } 
    } else if (letter == 'b') {
    if(!played) {
        if(isSharp){
            cnote4.play();
        played = true;
    }
    else if(isFlat){
        bnoteb3.play();
        played = true;
    }else{
        bnote3.play();
        played = true;
    }
    } 
    } else if (letter == 'c') {
    if(!played) {
        if(isSharp){
            dnoteb3.play();
        played = true;
    }
    else if(isFlat){
        bnote2.play();
        played = true;
    }else{
        cnote3.play();
        played = true;
    }
    } 
    } else if (letter == 'd') {
    if(!played) {
        if(isSharp){
            enoteb3.play();
        played = true;
    }
    else if(isFlat){
        dnoteb3.play();
        played = true;
    }else{
        dnote3.play();
        played = true;
    }
    } 
    } else if (letter == 'e') {
    if(!played) {
        if(isSharp){
            fnote3.play();
        played = true;
    }
    else if(isFlat){
        enoteb3.play();
        played = true;
    }else{
        enote3.play();
        played = true;
    }
    } 
    } else if (letter == 'f') {
    if(!played) {
        if(isSharp){
            gnoteb3.play();
        played = true;
    }
    else if(isFlat){
        enote3.play();
        played = true;
    }else{
        fnote3.play();
        played = true;
    }
    } 
    } else if (letter == 'g') {
    if(!played) {
        if(isSharp){
            anoteb3.play();
        played = true;
    }
    else if(isFlat){
        gnoteb3.play();
        played = true;
    }else{
        gnote3.play();
        played = true;
    }
    } 
    }
}else if (octave == 4){
if (letter == 'a') {
    if(!played) {
        if(isSharp){
        bnoteb4.play();
        played = true;
    }
    else if(isFlat){
        anoteb4.play();
        played = true;
    }else{
        anote4.play();
        played = true;
    }
    } 
    } else if (letter == 'b') {
    if(!played) {
        if(isSharp){
            cnote5.play();
        played = true;
    }
    else if(isFlat){
        bnoteb4.play();
        played = true;
    }else{
        bnote4.play();
        played = true;
    }
    } 
    } else if (letter == 'c') {
    if(!played) {
        if(isSharp){
            dnoteb4.play();
        played = true;
    }
    else if(isFlat){
        bnote3.play();
        played = true;
    }else{
        cnote4.play();
        played = true;
    }
    } 
    } else if (letter == 'd') {
    if(!played) {
        if(isSharp){
            enoteb4.play();
        played = true;
    }
    else if(isFlat){
        dnoteb4.play();
        played = true;
    }else{
        dnote4.play();
        played = true;
    }
    } 
    } else if (letter == 'e') {
    if(!played) {
        if(isSharp){
            fnote4.play();
        played = true;
    }
    else if(isFlat){
        enoteb4.play();
        played = true;
    }else{
        enote4.play();
        played = true;
    }
    } 
    } else if (letter == 'f') {
    if(!played) {
        if(isSharp){
            gnoteb4.play();
        played = true;
    }
    else if(isFlat){
        enote4.play();
        played = true;
    }else{
        fnote4.play();
        played = true;
    }
    } 
    } else if (letter == 'g') {
    if(!played) {
        if(isSharp){
            anoteb4.play();
        played = true;
    }
    else if(isFlat){
        gnoteb4.play();
        played = true;
    }else{
        gnote4.play();
        played = true;
    }
    } 
    }
}else if (octave == 5){
    if (letter == 'a') {
    if(!played) {
        if(isSharp){
        bnoteb5.play();
        played = true;
    }
    else if(isFlat){
        anoteb5.play();
        played = true;
    }else{
        anote5.play();
        played = true;
    }
    } 
    } else if (letter == 'b') {
    if(!played) {
        if(isSharp){
        //    cnote6.play();
        //played = true;
    }
    else if(isFlat){
        bnoteb5.play();
        played = true;
    }else{
        bnote5.play();
        played = true;
    }
    } 
    } else if (letter == 'c') {
    if(!played) {
        if(isSharp){
            dnoteb5.play();
        played = true;
    }
    else if(isFlat){
        bnote4.play();
        played = true;
    }else{
        cnote5.play();
        played = true;
    }
    } 
    } else if (letter == 'd') {
    if(!played) {
        if(isSharp){
            enoteb5.play();
        played = true;
    }
    else if(isFlat){
        dnoteb5.play();
        played = true;
    }else{
        dnote5.play();
        played = true;
    }
    } 
    } else if (letter == 'e') {
    if(!played) {
        if(isSharp){
            fnote5.play();
        played = true;
    }
    else if(isFlat){
        enoteb5.play();
        played = true;
    }else{
        enote5.play();
        played = true;
    }
    } 
    } else if (letter == 'f') {
    if(!played) {
        if(isSharp){
            gnoteb5.play();
        played = true;
    }
    else if(isFlat){
        enote5.play();
        played = true;
    }else{
        fnote5.play();
        played = true;
    }
    } 
    } else if (letter == 'g') {
    if(!played) {
        if(isSharp){
            anoteb5.play();
        played = true;
    }
    else if(isisFlat){
        gnoteb5.play();
        played = true;
    }else{
        gnote5.play();
        played = true;
    }
    } 
    }
}
}

this.stopNote=function(letter, octave){
    
    anote1.stop();
    anote2.stop();
    anote3.stop();
    anote4.stop();
    anote5.stop();
    anoteb1.stop();
    anoteb2.stop();
    anoteb3.stop();
    anoteb4.stop();
    anoteb5.stop();

    bnote1.stop();
    bnote2.stop();
    bnote3.stop();
    bnote4.stop();
    bnote5.stop();
    bnoteb1.stop();
    bnoteb2.stop();
    bnoteb3.stop();
    bnoteb4.stop();
    bnoteb5.stop();

    cnote1.stop();
    cnote2.stop();
    cnote3.stop();
    cnote4.stop();
    cnote5.stop();

    dnote1.stop();
    dnote2.stop();
    dnote3.stop();
    dnote4.stop();
    dnote5.stop();
    dnoteb1.stop();
    dnoteb2.stop();
    dnoteb3.stop();
    dnoteb4.stop();
    dnoteb5.stop();

    enote1.stop();
    enote2.stop();
    enote3.stop();
    enote4.stop();
    enote5.stop();
    enoteb1.stop();
    enoteb2.stop();
    enoteb3.stop();
    enoteb4.stop();
    enoteb5.stop();

    fnote1.stop();
    fnote2.stop();
    fnote3.stop();
    fnote4.stop();
    fnote5.stop();

    gnote1.stop();
    gnote2.stop();
    gnote3.stop();
    gnote4.stop();
    gnote5.stop();
    gnoteb1.stop();
    gnoteb2.stop();
    gnoteb3.stop();
    gnoteb4.stop();
    gnoteb5.stop();
}

this.drawScore=function(newWidth) {
    if (newWidth > 320){
        newWidth = 320;
        scoreBoxWidth = 320;
    }
    else if (newWidth < 0) {
        newWidth = 0;
    }
    var greenVal = 0;
    var redVal = 0;
    if (newWidth > 160) {
        greenVal = Math.ceil((1.5*newWidth) - 242.5);
    }
    else{
        redVal = Math.floor((-1.6*newWidth) + 233.99);
    }
    //alert(greenVal);
    scoreBox.graphics.clear();
    var graphics2 = new createjs.Graphics().beginFill("rgba(" + redVal + ", " + greenVal + ", 0, 1)").drawRect(820, 420, newWidth, 55);
    scoreBox = new createjs.Shape(graphics2);
    stage.addChild(scoreBox);
}

window.onload=init();
})();