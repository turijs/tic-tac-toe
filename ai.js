(function(){
  
  var x = bin('000000000'), o = bin('000000000');
  var mask = bin('111111111');

  window.threeInARow = function(){
    var wins = [
      bin('100100100'),
      bin('010010010'),
      bin('001001001'),
      bin('111000000'),
      bin('000111000'),
      bin('000000111'),
      bin('100010001'),
      bin('001010100')
    ]

      return function(xo){
        for(var i = 0; i < 8; i++)
          if((wins[i] & xo) == wins[i])
            return wins[i];
        return false;
      }
  }();




  logBoard(x,o);

  var t1 = performance.now();

  minimax(1, x, o, 10);

  var t2 = performance.now();

  console.log(t2-t1);


  window.findBestMove = function(playerToMove, x, o){
    var move, moves = ~(x | o) & mask;

    if(playerToMove) {
      var max = -100;
      while(move = moves & -moves) {
        moves ^= move;//take away the current move
        var m = minimax(!playerToMove, x | move, o, 9)
        if(m > max) {
          max = m;
          bestMove = move;
        }
      }
      return bestMove;
    } else {
      var min = 100;
      while(move = moves & -moves) {
        moves ^= move;//take away the current move
        var m = minimax(!playerToMove, x, o | move, 9);
        if(m < min) {
          min = m;
          bestMove = move;
        }
      }
      return bestMove;
    }
  }

  //1 is x; 0 is o
  function minimax(playerToMove, x, o, depth){
    //logBoard(x,o);

    if(threeInARow(playerToMove ? o : x)) {
      //console.log("3 in a row!");
      return (1 + depth)*(playerToMove ? -1 : 1);
    }

    var move, moves = ~(x | o) & mask;
    if(!moves) return 0;

    if(playerToMove) {
      var max = -100;
      while(move = moves & -moves) {
        moves ^= move;//take away the current move
        var m = minimax(!playerToMove, x | move, o, depth-1)
        if(m > max) max = m;
      }
      //console.log('Max at depth '+depth+": ",max);
      return max;
    } else {
      var min = 100;
      while(move = moves & -moves) {
        moves ^= move;//take away the current move
        var m = minimax(!playerToMove, x, o | move, depth-1);
        if(m < min) min = m;
      }
      //console.log('Min at depth '+depth+": ",min);
      return min;
    }
  }




  function buildBitToIndexMap(n) {
    var arr = [];
    for (var i = 0; i < n; i++)
      arr[1 << i] = i;
    return arr;
  }



  function bin(num){
    return parseInt(''+num,2);
  }



}());

function logBoard(x,o) {
  var str = "";
  for(var i = 8; i >= 0 ; i--){
    if (x & (1<<i))
      str += "X ";
    else if (o & (1<<i))
      str += "O ";
    else str += "– "

    if(!((i)%3)) str += "\n";
  }
  console.log(str);
}
