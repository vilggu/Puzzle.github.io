
$(document).ready(function(){


    //var lataustesti ={"messageType":"SAVE","gameState":{"score":3,"boardstate":["10","15","5","","9","4","7","11","1","2","6","13","8","14","12","3"]}}


    // Counter for time
    var timer = 0;
    $("#time").text(": "+timer);
    laskuri();

    $(createGame);

    // Forming the board
    function createGame() {
        
        
        var lauta = $("<div></div>");
        lauta.addClass("mt-5");
        lauta.attr("id", "game-area");
        
        var numero = 1;
        
        for(var i = 0; i<4; i++){
            var rivi = $("<div></div>");
            rivi.addClass("d-flex flex-row justify-content-center");
            
            for (var j = 0;j<4; j++){
                var laatta = $("<div></div>");
                var sisempi = $("<div></div>");
                
                if(numero === 16){
                    sisempi.addClass("m-1");
                    sisempi.attr('id', 'empty');
                }else{
                    sisempi.attr('id',numero);
                    sisempi.addClass("piece m-1");
                    sisempi.text(numero);
                }
             
                
                if(numero === 12 || numero ===15){
                    sisempi.addClass("movable");
                }
                sisempi.addClass(numero.toString());
                sisempi.click(function(){
                    movePiece(sisempi);
                });
                numero++;
                laatta.append(sisempi);
                rivi.append(laatta);
                
                
            }
            lauta.append(rivi);
            
        }

        //
        var voita = $("<button></button>");
        voita.addClass("voitto");
        voita.text("voita");
        lauta.append(voita);

        //
        
        
        $("#pohja").append(lauta);
        
        // listeners for movable pieces and new game button
        $(".movable").click(function(){
            movePiece($(this));
        });

        $(".voitto").click(function(){
            instantWin();
        });

        $("#newgame").click(function(){
            sufflePieces();
        });

        // suffle the pieces
        sufflePieces();
    }


    // Moving the piece
    function movePiece(piece) {
        
        // Make empty piece regular piece 
        var empty = $("#empty");
        empty.removeAttr("id");
        empty.addClass("piece");
        empty.text(piece.text());
        
        // Make regular piece empty piece
        piece.removeClass("piece");
        piece.text("");
        piece.attr("id","empty");
        piece.removeClass("movable");
        
        // Set pieces that can move
        setMovablePieces();
        
        // Check winning condition
        checkWin();
       
          
    }

    // Function for randomly shuffling the pieces
    function sufflePieces() {
        
        var numerot = [];
        while(numerot.length < 16){
            var satunnainen = Math.floor(Math.random() * 16)+ 1;
            if((numerot.includes(satunnainen))===false){
                numerot.push(satunnainen);
                
            }
        }
        //console.log(numerot);
        
        // set all unmovable
        setUnmovable();
        
        var empty = $("#empty");
        empty.removeAttr("id");
        empty.addClass("piece");
       
        
        for(var i =1; i<=16; i++){
            var laatta = $("."+i);
           if(numerot[i-1] === 16){
               laatta.attr("id","empty");
               laatta.removeClass("piece");
               laatta.text("");
           }else{
               laatta.text(numerot[i-1]);
           }
            
            
        }
        
        setMovablePieces();

        // Stop the counter
        clearInterval(counter);

        // start new counter from 0
        laskuri();
        
         
    }


    function getCoors(piece) {
        
        return piece.attr("id");
    }



    // Function for setting movable pieces
    function setMovablePieces() {
        
        
        setUnmovable();
        
        var empty = getEmpty();
      
        // viimeinen sarake 
        if(empty % 4 === 0){
            $("."+(empty-1)).addClass("movable");
            

        // eka sarake
        }else if(empty+3 % 4 === 0){
            $("."+(empty+1)).addClass("movable");
            
        // välisarakkeet    
        }else {
            $("."+(empty+1)).addClass("movable");
            $("."+(empty-1)).addClass("movable");
        }
        
        //riveittäin
        if(empty <= 4){
            $("."+(empty+4)).addClass("movable");
        }else if(empty >= 13){
            $("."+(empty-4)).addClass("movable");
        }else{
            $("."+(empty+4)).addClass("movable");
            $("."+(empty-4)).addClass("movable");
        }
        
         $(".movable").click(function(){
            movePiece($(this));
        }); 
        
        

    }

    // Function for getting empty piece
    function getEmpty(){

        for(var i = 1; i<= 16; i++){
            var ruutu = $("."+i);
            
            if(ruutu.text() === ""){
                return (i);
            }
        }
        
        
    }

    // set all nonmovable
    function setUnmovable(){
        for(var i = 1; i<= 16; i++){
            var ruutu = $("."+i);
            ruutu.removeClass("movable");
            ruutu.unbind( "click" );
            }
           
            
    }
    // Check if win condition is applied
    function checkWin(){
        var voittorivi = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15"];
        var voitto = true;

        for(var i = 1; i<=15;i++){
            
            var  ruutu = $("."+i);
            

            if(ruutu.text() !== voittorivi[i-1]){
                voitto = false;
            }
            
        }

        // If won, send the time as a score to server
        if(voitto===true){
            clearInterval(counter);

            alert("You won! Life spent: "+timer +" seconds");

            var msg={
                messageType: "SCORE",
                score: timer
            };

            window.parent.postMessage(msg, "*");
            
        }
    }

    function instantWin(){
        
        for(var i =1; i<=16; i++){
            var laatta = $("."+i);
            laatta.text(i);
         
        }
        checkWin();
    }

    // Function for setting the counter for time
    function laskuri(){
        
        timer=0;
        counter = setInterval(function(){
        timer=timer+1;
        $("#time").text(": "+timer);
    },1000);
    }

    // Function for loading the game state, takes gamestate object
    // as parameter
    function loadState(state){

        // set timer to saved time
        timer = state.score;
        $("#time").text(timer);

        // remove previous empty piece
        var empty = $("#empty");
        empty.removeAttr("id");
        empty.addClass("piece");

        // set saved values for new pieces 
        for(var i = 1 ; i <=16; i++){
            var laatta = $("."+i);
            laatta.text(state.boardstate[i-1]);
            if(laatta.text()===""){
                laatta.attr("id","empty");
                laatta.removeClass("piece");
            }
        }
        
        // set movable pieces
        setMovablePieces();

    }

    // Function for saving game state and time
    $("#save").click(function(){

        var board = [];
        for(var i = 1; i<=16;i++){
            board.push($("."+i).text());
        }

        var msg = {
            messageType:"SAVE",
            gameState: {
                score: timer,
                boardstate: board
            } 
        };

        lataustesti = msg;
        clearInterval(counter);

        window.parent.postMessage(msg, "*");
        
     
      });

    //Load method when load button is pressed
    $("#load").click(function(){


        // Load request from game to service
        // for getting the saved data.
        var msg = {
            messageType: "LOAD_REQUEST"
        };

        window.parent.postMessage(msg, "*");


        //console.log(lataustesti.gameState);
        //loadState(lataustesti.gameState);

    
        
    });

    window.addEventListener("message", receiveMessage);

    function receiveMessage(event){
        console.log("message received");
        console.log(event.data);
        loadState(JSON.parse(event.data).gameState);
    }



})
