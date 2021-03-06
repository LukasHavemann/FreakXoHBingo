$(document).ready(function() {
  var config = {
    bingoCard: {
      width: 7,
      height: 7,
      size: 49,

      addWinnigBoards: {
        "FreakshowF": [9, 10, 11, 12, 16, 23, 24, 25, 30, 37],
        "Diamant": [3, 9, 11, 15, 19, 21, 27, 29, 33, 37, 19, 45],
        "atzeichen": ["TODO"],
        "Bierkrug": ["TODO"],
        "Apfel": ["TODO"]
      }
    },
    buzzwordCount: 57
  };

  var $bingoBody = $('#BingoBody');

  var model = {
    bingoCard: _.fill(new Array(config.bingoCard.size), false)
  };

  init();

  function init() {
    createBingoCard();
    bindEventHandler();
    initBingoCard();
  }

  function createBingoCard() {
    var $row = $('<tr>');

    _.times(config.bingoCard.size, function(i) {
      $cell = $('<td>');
      $cell.attr('id', 'cell' + i);
      $cell.attr('data-id', i);

      $cell.append($('<img>'));

      $row.append($cell);

      // Ueberpruefe ob Reihe voll
      if (i % config.bingoCard.width == config.bingoCard.width - 1) {
        $bingoBody.append($row);
        $row = $('<tr>');
      }
    });
  }

  function initBingoCard() {
    var allBingoCards = _.range(1, config.buzzwordCount);

    // Mische alle Bingo-Karten und Teile alle Karten diese in Zwei-Teile auf
    var tmp = _.chunk(_.shuffle(allBingoCards), config.bingoCard.size);
    var usedBingoCards = tmp[0];
    var missingBingoCards = tmp[1];

    setImgOn('#cell', usedBingoCards);
    setImgOn('#missing', missingBingoCards);
  }

  function setImgOn(htmlId, imgIds) {
    _.times(imgIds.length, function(id) {
      var $elem = $(htmlId + id);
      $elem.find('img').attr('src', 'images/' + imgIds[id] + '.svg');
      $elem.attr('data-img-id', imgIds[id]);
    });
  }

  function bindEventHandler() {
    $('#neueKarte').click(function() {
      initBingoCard();
    });

    $('.resizeTiles').click(function() {
      resizeTiles(parseInt($(this).attr('data-tile-size')));
    });

    $("#BingoBody td").click(function() {
      $(this).toggleClass("clickedCell");
      var idx = parseInt($(this).attr('data-id'));
      model.bingoCard[idx] = !model.bingoCard[idx];

      if(checkWin(model.bingoCard)) {
        alert("Gewonnen!")
      }
    });
  }

  function checkWin(bingoCard) {
    var bingoCardHorizontal = _.chunk(bingoCard, config.bingoCard.width);
    var bingoCardVertikal = _.zip.apply(_, bingoCardHorizontal);

    return checkLines(bingoCardHorizontal) || 
           checkLines(bingoCardVertikal) || 
           checkAddWinningBoards(bingoCard);
  }

  function checkAddWinningBoards(bingoCard) {
    var convertedToNum = _.reduce(bingoCard, function(result, val, idx) {
      if(val) {
        result.push(idx);
      }
      return result;
    }, []);

    console.log(convertedToNum);

    var addWinnigBoards = _.collect(config.bingoCard.addWinnigBoards);
    for(var i = 0; i < addWinnigBoards.length; i++) {
      if(_.eq(_.intersection(addWinnigBoards[i], convertedToNum), addWinnigBoards[i])){
        return true;
      }
    }

    return false;
  }

  function checkLines(array2d) {
    for (var i = 0; i < array2d.length; i++) {
      if(_.reduce(array2d[i], and, true)) {
        return true;
      }
    }
    return false;
  }

  function and(a, b) {
    return a && b;
  }

  function resizeTiles(tileSize) {
    $('div.resize img').width(tileSize).height(tileSize);
    $('div.resize td').width(tileSize).height(tileSize);
    $('div.resize').width(tileSize * config.bingoCard.width + 50)
  }
});