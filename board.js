var x = 0, o = 0;
var turn = 1, soloMode = false, gameEnded = false;
var bitIndexMap = buildBitToIndexMap(9);
var undoHistory = [];

var $undo = $('#undo'), $message = $('#message');

$('.empty').on({
  click: function(){
    if(!$(this).hasClass('empty')|| gameEnded) return;

    var move = 1 << (8 - $(this).attr('id'));
    doMove(turn, move);

    if(soloMode || gameEnded) return;
    logBoard(x,o);

    doMove(turn, window.findBestMove(turn,x,o));

  },
  mouseenter: function(){
    if(!$(this).hasClass('empty') || gameEnded) return;
    cssClass = turn ? "x" : "o";
    $(this).addClass(cssClass);
  },
  mouseleave: function(){
    if(!$(this).hasClass('empty') || gameEnded) return;
    cssClass = turn ? "x" : "o";
    $(this).removeClass(cssClass);
  },
});
$undo.click(undo);

$('.new-game').click(function(){
  x = 0; o = 0; undoHistory = [];
  gameEnded = false; turn = 1; soloMode = false;
  updateMessage('');

  $('#board > div').removeClass('x o three-in-a-row').addClass('empty');

  id = $(this).attr('id');
  if(id == "new-o")
    doMove(turn, window.findBestMove(turn,x,o));
  else if(id == "new-solo")
    soloMode = true;
});

function doMove(player,move) {
  if(player == 1) {
    x = x | move;
    var cssClass = "x"
  } else {
    o = o | move;
    var cssClass = "o"
  }
  var id = bitIndexMap[move];
  $('#'+id).removeClass('empty').addClass(cssClass);
  makeHistory(move);
  updateGameStatus();
  turn = !turn;
}

function updateGameStatus(curSquare, three){
  if(three = threeInARow(turn ? x : o)) {
    while(curSquare = three & -three) {
      three ^= curSquare;
      var id = bitIndexMap[curSquare];
      $('#'+id).addClass("three-in-a-row");
    }
    updateMessage(soloMode ? "Win!" : "I win!")
    return gameEnded = true;
  }
  if((x | o) == parseInt('111111111',2)) {
    updateMessage("Draw.")
    return gameEnded = "draw";
  }
}

function makeHistory(move){
  undoHistory.push(move);
  //console.log(undoHistory);
  $undo.addClass('active');
}

function undo() {
  clear(undoHistory.pop());
  if(!soloMode && gameEnded != 'draw') //go back an additional move
    clear(undoHistory.pop());
  else turn = !turn;

  gameEnded = false;
  updateMessage('');
  $('.three-in-a-row').removeClass('three-in-a-row');

  if(undoHistory.length < 1)
    $undo.removeClass('active');
}


function clear(move){
  x &= ~move; o &= ~move;
  var id = bitIndexMap[move];
  $('#'+id).removeClass('x o').addClass('empty');
}

function updateMessage(text) {
  $message.text(text)
}



function buildBitToIndexMap(n) {
  var arr = [];
  for (var i = 0; i < n; i++)
    arr[1 << (n-1-i)] = i;
  return arr;
}
