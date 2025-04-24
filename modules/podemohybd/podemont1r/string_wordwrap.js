
// ====================================================================
// String_WordWrap
// procedure to wrap the notes lines into a multiple lines for
// the screen display
// ====================================================================
function string_WordWrap(sourceString_i, lineLength) {
  pjs.define("sourceString_i", { type: 'char', length: 9999, varying: true, refParm: sourceString_i });
  pjs.define("lineLength", { type: 'integer', length: 5, decimals: 0, refParm: lineLength });

  pjs.define("RDS_Array", { type: 'data structure', likeDS: 'arrayWithCount_tp' });
  // constants for defining maximum values
  pjs.define("maxLines", { type: 'integer', length: 5, decimals: 0 });

  pjs.define("sourceString", { type: 'char', length: 9999, varying: true });
  pjs.define("tempString", { type: 'char', length: 9999, varying: true });
  pjs.define("idx", { type: 'integer', length: 5, decimals: 0 });
  pjs.define("endpos", { type: 'integer', length: 5, decimals: 0 });
  pjs.define("strpos", { type: 'integer', length: 5, decimals: 0 });
  pjs.define("length", { type: 'integer', length: 5, decimals: 0 });
  pjs.define("sourceLength", { type: 'integer', length: 5, decimals: 0 });

  pjs.define("lineFeed", { type: 'char', length: 1, initValue: String.fromEbcdicHex('0D') });
  pjs.define("endPosLF", { type: 'integer', length: 5, decimals: 0 });

  // ****
  maxLines = lineLength;
  pjs.clear(RDS_Array);
  sourceString = sourceString_i.rtrim();
  sourceLength = sourceString.length;
  if (sourceLength > 0) {
    idx = 0;
    endpos = 1;
    strpos = sourceString.check(' ', endpos);
    while (strpos > 0 && strpos <= sourceLength && idx < maxLines && sourceString.check(' ', strpos) > 0 && endpos < sourceLength) {
      if (strpos + lineLength > sourceLength) {
        endpos = sourceLength + 1;
      }
      else {
        endpos = string_ScanR(' ', pjs.refParm("sourceString"), strpos + lineLength);
        if (endpos <= strpos) {
          endpos = strpos + lineLength;
        }
        if (endpos > sourceLength) {
          endpos = sourceLength + 1;
        }
      }

      // break at linefeed character if there is one
      endPosLF = sourceString.scan(lineFeed, strpos);
      if (endPosLF > 0 && endPosLF < endpos) {
        endpos = endPosLF + 1;
      }

      length = endpos - strpos;
      idx += 1;
      tempString = sourceString.substr(strpos - 1, length);
      tempString = String.setLength(tempString, lineLength);
      RDS_Array.lineArray[idx] = tempString;
      try {
        strpos = sourceString.check(' ', endpos);
      }
      catch(err) {
        pjs.setError(err);
      }
    }
    RDS_Array.lineCount = idx;
  }
  return pjs.getDSValue(RDS_Array);
}

exports.string_WordWrap = string_WordWrap;
