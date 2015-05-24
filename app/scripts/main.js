
(function(){

$(function(){


  var ref = new Firebase('https://streak1.firebaseio.com'),
    title, 
    curStreak,
    maxStreak,
    lastDate,
    done=false;  //done is whether task is already done today
    lastUpdated = new Date(),
    today = new Date(),
    oldTitle,
    i=0,
    user="solo",
    refUser,
    lastDate
  ;


//if user is known, update screen with db values
 //when value in db changes, update relevant fields
  ref.on('value', function(snapshot){
    refUser = ref.child(user);    
    
    refUser.on('value', function(snapshot){

      var msg = snapshot.val();
      title = msg.title;
      curStreak = msg.curStreak;
      maxStreak = msg.maxStreak;

      lastDateEpoch=msg.lastDate;
      lastUpdatedEpoch = msg.lastUpdated;


      if (maxStreak == undefined){
        maxStreak = 0;
      }
      if (curStreak == undefined){
        curStreak = 0;
      }
      if (title == undefined){
        title = "Enter Title";
      }
      if (lastUpdatedEpoch ==undefined){
        lastUpdatedEpoch = 0;
      }
      if (lastDateEpoch == undefined){
        lastDateEpoch = 0;
      }
      lastDate = new Date(lastDateEpoch);
      lastUpdated = new Date(lastUpdatedEpoch);

      $('#title h1').html(title);
      $('#curStreak').text(curStreak);
      $('#maxStreak').text(maxStreak);
      $('#lastUpdated').text(formatDate(lastUpdated));

    })

  });


    //if number is clicked, increment by 1
    $('#current').on("click", function(){

        var todayTMP = new Date();
        console.log("today tmp" + todayTMP.getTime());
        today = setDate(todayTMP); //zeroes out seconds, min, hours
        console.log("today" + today.getTime());

        console.log("lastdate" + lastDate.getTime());
        //if it hasn't been clicked yet today.. increment number
      
        if (today.getTime() > lastDate.getTime()){

            curStreak+=1;

            if (curStreak > maxStreak){
                maxStreak = curStreak;
            }
            i++;
           //  var obj = {'streak': curStreak, 'lastDate':today, 'maxStreak': maxStreak, 'lastUpdated':today};
            //streakObj = {'curStreak':curStreak, 'maxStreak':maxStreak, 'lastDate':'today', 'lastUpdated':todayEpoch, 'title':title};
            //var obj = {};
            //obj[user] = streakObj;
            obj = {'curStreak':curStreak, 'maxStreak':maxStreak, 'lastDate': today.getTime(), 'lastUpdated':today.getTime()};
            refUser.update(obj);
            showMessage("Good Job!");
        }
        else {
            showMessage("Come back tomorrow!");
        }
 
    })


    //if title is clicked, change to input box
    $('#title').on("tap", function(){
        checkItem = "titleInputDiv";
        var classArr = $(this).attr('class').split(' ');
        index = classArr.indexOf(checkItem);

        //do this if it is not in input mode
        if (index == -1){
          oldTitle = $('#title h1').text();

          $(this).addClass('titleInputDiv');


          $(this).html("<input type='text' class='form-control titleInput' value='" + oldTitle + "' </input>");
          $('.titleInput').select();
        } 
      
    })

 
    //in title box, save if enter is saved, undo if escape is hit
    $('#title').on("keyup", "input", function(e){
        //if enter is pressed
        if (e.keyCode == 13){
            var newInput = $(".titleInput").val();
            var newInputHTML = "<h1>" + newInput + "</h1>";

            //if nothing is entered, use old title
            if (newInput == ''){
                var oldTitleHTML = "<h1>" + oldTitle + "</h1>";

                $('#title').html(oldTitleHTML);
                $('#title').removeClass("titleInputDiv");
            } 
            //if something is entered, update db
            else {
                $('#title').html(newInputHTML);
                $('#title').removeClass("titleInputDiv");

                var obj = {'title':newInput};
                
                refUser.update(obj);
            }

        }

        //if press escape, don't change anything
        if (e.keyCode == 27){
            var oldTitleHTML = "<h1>" + oldTitle + "</h1>";

            $('#title').html(oldTitleHTML);
            $('#title').removeClass("titleInputDiv");

        }
    })

    //if user click outside input box, undo changes
    $('#title').on("blur","input", function(e) {
     var oldTitleHTML = "<h1>" + oldTitle + "</h1>";

            $('#title').html(oldTitleHTML);
            $('#title').removeClass("titleInputDiv");

    //    var obj = {'title':newInput};
    //    ref.update(obj);
        //drawTable();
    });

    //if reset icon is clicked, reset num to 0
    $('#curReset').click(function(){
        curStreak = 0;
        var defaultDate = new Date('2000','01','01');
        var obj = {'curStreak':curStreak, 'lastDate':defaultDate.getTime()};
        refUser.update(obj);
        hideMessage();

        $('#curStreak').text(curStreak);
       // drawButtons(curStreak);
      
    });

    $('#maxReset').click(function(){
        maxStreak = 0;
        var obj = {'maxStreak':maxStreak};
        
        refUser.update(obj);



    });

    $('.msgcontainer').click(function(){
        hideMessage();
    });

    $('#solo').click(function(){
        $('#popupDialog').popup("close");
        user='solo';
        rand = getRandom(0,100);
        refUser = ref.child(user);

        refUser.update({'trigger':rand});

    })


    $('#mungo').click(function(){
        $('#popupDialog').popup("close");
        user='mungo';
        rand = getRandom(0,100);
        refUser = ref.child(user);

        refUser.update({'trigger':rand});

    })

    $('#select-custom-1').change(function(){
        var name = $(this).find('option:selected').attr("name");
        user = name;

        console.log(name); 
        
        rand = getRandom(0,100);
        refUser = ref.child(user);

        refUser.update({'trigger':rand});


    })

  
    function setDate(date){
        //takes in a Date, and returns a Date with hours/seconds, blanked out
        only_date = new Date(date.getTime());
        //#= date.setMinutes(0);
        only_date.setMinutes(0);
        only_date.setHours(0);
        only_date.setSeconds(0);
        only_date.setMilliseconds(0);
        return only_date;
        

    }
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;    }
//$('#slide').click(function(){
    function showMessage(msg){
        var files = ["sheep.png","bird.png","chicken.png","cow.png","turkey.png"];
        rand = getRandom(0, files.length -1);
        var src = "images/" + files[rand];
        $('#littleguy').attr("src",src);
        $('.msgcontainer').animate({bottom:"0px"},600);
        $('#msg').text(msg);

    }
    function hideMessage(){
        $('.msgcontainer').animate({bottom:"-100px"},600);
    }

    function formatDate(date){
    //date is Date object
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        var date_str = (month +1) + "-" + day + "-" + year
        return (date_str);

}
//});
});


})();
