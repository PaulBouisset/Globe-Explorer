
var datasheet = [];
var sheetscale = [];
var spreadsheetID = "185UpX6CL0ttnTHGAyoiLkKzmXhKajrQU-PCcVd1y-Qo";
var minscale;
var maxscale;
var sheets_titles;
var scale_sheet;
var globe;

var img = new Image();
img.onload = startGlobe();
img.src = "http://paulbouisset.com/Globe-explorer/img/world03.jpg";


function startGlobe() {

if(!Detector.webgl){
  Detector.addGetWebGLMessage();
} else {
  var container = document.getElementById('container');
    globe = DAT.Globe(document.getElementById('container'), function() {
    });
    globe.animate();
  }

  var x = location.search;
  if(x){
    sharedLink(x.substr(1));
  }
  else{
    $('#init_page').fadeIn(200);
  }

function sharedLink(link){
  var cuturl01= link.substr(0, link.indexOf('scale='));
  var scaleurl = link.substr(link.indexOf('scale=')+6)
  var url = "https://spreadsheets.google.com/feeds/list/" + cuturl01 + "/od6/public/values?alt=json";
    $.getJSON(url, function(data) {
    var entry = data.feed.entry;
      $(entry).each(function(key,value){
        var object = {};
        for(val in value){
          if(val.substr(0,3) == "gsx"){
            var label = val.substr(4);
            var data_value = value[val].$t;
            object[label] = data_value;
            object.id=key;
          }
        }
        datasheet.push(object);
      })
      $(data.feed.title).each(function(){
        sheets_titles = (this.$t);
      });
    }).done(function() {
      $('#accessShare_name').text(sheets_titles);
      startdata(scaleurl);
    }).fail(function() {
      $('#init_page').fadeIn(100);
    });
    $('#accessShare_page').fadeIn(200);

}




$('.init_button').click(function(){
        var urlchoosed = $('#init_input').val();
        if (urlchoosed){
          var cuturl01= urlchoosed.substr(urlchoosed.indexOf('d/')+2, urlchoosed.indexOf('/e'));
          var cuturl02=  cuturl01.substr( 0 , cuturl01.indexOf('/e'));
          spreadsheetID = cuturl02;
        }
        var url = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/od6/public/values?alt=json";
        console.log(url);
          $.getJSON(url, function(data) {
          var entry = data.feed.entry;
            $(entry).each(function(key,value){
              var object = {};
              for(val in value){
                if(val.substr(0,3) == "gsx"){
                  var label = val.substr(4);
                  var data_value = value[val].$t;
                  object[label] = data_value;
                  object.id=key;
                }
              }
              datasheet.push(object);
            })
            $(data.feed.title).each(function(){
              sheets_titles = (this.$t);
            });
          }).done(function() {
              $('.loading-spinner').fadeOut(100,function(){
                chooseScale();
              })
              }).fail(function() {
                $('.loading-spinner').fadeOut(10, function(){
                  $('.init_button').fadeIn(10);
                  $('.init_instruction02').fadeIn(200);
                });
                spreadsheetID = "185UpX6CL0ttnTHGAyoiLkKzmXhKajrQU-PCcVd1y-Qo";
           });
            $('.init_button').fadeOut(10, function(){
              $('.init_instruction02').fadeOut(10,function(){
                $('.loading-spinner').fadeIn(10);
              })
            });
});


  function startdata(scaleFactor){
        scale_sheet = scaleFactor;
        $('#init_page').fadeOut(200);
        $('#title_doc').text(sheets_titles);

        for (val in datasheet){
          sheetscale.push(parseInt(datasheet[val][scaleFactor]));
        }
        maxscale = Math.max.apply(Math,sheetscale);
        minscale = Math.min.apply(Math,sheetscale);

        for (var i = 0; i<datasheet.length; i++){
           $('.country_wrap').append('<h2 class="positions"'+ 'id="'+datasheet[i].id+'">'+datasheet[i].positions+'<div class="positions_background" id="positions_background_'+datasheet[i].id+'"></div></h2>');
         }
        dataset(datasheet);
        function dataset(data){
              globe.addData(data, {format: 'magnitude', name : 'positions', animated: true});
              globe.createPoints(function(){
                globe.animate();
              });
        };

  }

  function chooseScale(){
    $('#init_scale_label').fadeIn(200);
          for (label in datasheet[0]){
            if (label != "positions" && label != "lat" && label != "lon" && label != "id" ){
              $('.init_scale_list').append('<li class="init_scale_elem"><a class="init_scale_elem_link">'+label+'</a></li>');
            }
          }
  }

  $('.init_scale_list').on("click",".init_scale_elem_link",function(){
     var selected = $(this).text();
     startdata(selected);
  })

  };
