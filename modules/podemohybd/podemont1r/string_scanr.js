
// ********************************************************
// ScanR - same as %scan built in function except it works from the right
// parms: search value
// text to be searched
// position from right to start searching

// returns: first position from right of beginning of search value
// position is distance from left not from right

function string_ScanR(searchValue, sourceString, startPos_in) {
  pjs.define("searchValue", { type: 'char', length: 9999, varying: true, refParm: searchValue });
  pjs.define("sourceString", { type: 'char', length: 9999, varying: true, refParm: sourceString });
  pjs.define("startPos_in", { type: 'integer', length: 5, decimals: 0, noPass: true, refParm: startPos_in });

  pjs.define("idx", { type: 'integer', length: 5, decimals: 0 });
  pjs.define("endpos", { type: 'integer', length: 5, decimals: 0 });
  pjs.define("startpos", { type: 'integer', length: 5, decimals: 0 });
  pjs.define("foundSpace", { type: 'boolean' });
  pjs.define("lineLength", { type: 'integer', length: 5, decimals: 0 });

  lineLength = sourceString.length;
  if (arguments.length === 2) {
    startpos = lineLength - searchValue.length + 1;
  }
  else if (arguments.length === 3) {
    startpos = startPos_in;
  }
  idx = startpos;
  if (idx + searchValue.length > lineLength + 1) {
    idx = lineLength - searchValue.length + 1;
  }

  foundSpace = false;
  do {
    if (sourceString.substr(idx - 1, searchValue.length) === searchValue) {
      foundSpace = true;
    }
    else {
      idx -= 1;
    }
  } while (!(foundSpace || idx <= 0));
  if (idx <= 0) {
    endpos = 0;
  }
  else {
    endpos = idx;
  }
  return endpos;
}

exports.string_ScanR = string_ScanR;
