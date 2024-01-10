import { useState, useEffect } from 'react'
import global from './Global'
import { Clsboard } from './Clsboard'

function App() {
  var [papan, setPapan] = useState(
                              new Clsboard(global.BLACKTURN, [
                                [[], [], [], [], []],
                                [[], [], [], [], []],
                                [[], [], [], [], []],
                                [[], [], [], [], []],
                                [[], [], [], [], []],
                              ])
                          );

  var [tempPapan, setTempPapan] = useState(papan);
  var [giliran, setGiliran] = useState(global.WHITETURN);
  var [jumMelangkah, setJumMelangkah] = useState(0);
  var [selectedStone, setSelectedStone] = useState(jumMelangkah === 1 ? (giliran === global.WHITETURN ? global.FLATSTONE_WHITE : global.FLATSTONE_BLACK) : global.FLATSTONE_BLACK);
  var [maxLevel, setMaxLevel] = useState(3);
  var [brsAngkat, setBrsAngkat] = useState(-1);
  var [klmAngkat, setKlmAngkat] = useState(-1);
  var [lastBrs, setLastBrs] = useState(-1);
  var [lastKlm, setLastKlm] = useState(-1);
  var [brsDirection, setBrsDirection] = useState(-1);
  var [klmDirection, setKlmDirection] = useState(-1);
  var [stackAngkat, setStackAngkat] = useState([]);
  var [selectedStack, setSelectedStack] = useState([]);
  const [tempArr, setTempArr] = useState([]);
  
  useEffect(() => {
  }, []);

  function selectStoneType(stoneType) {
    setSelectedStone(stoneType);
  }

  function findWeight(_papan) {
    var weight = 0;
    var notgiliran = giliran;

    if (giliran == global.BLACKTURN) {
      notgiliran = global.WHITETURN;
    }
    else {
      notgiliran = global.BLACKTURN;
    }   

    var playerMenang = false;
    var indexPlayerDariKiri = 0;
    var indexPlayerDariKanan = 0;
    var indexPlayerDariAtas = 0;
    var indexPlayerDariBawah = 0;
    for(var i = 0; i < 5; i++) {
      for(var j = 0; j < 5; j++) {
        var traceFlagKiri = [];  var flagKiri = checkIfConnectedWithBorder(_papan.arr, i, j, giliran, traceFlagKiri, "KIRI");
        var traceFlagKanan = [];  var flagKanan = checkIfConnectedWithBorder(_papan.arr, i, j, giliran, traceFlagKanan, "KANAN");
        var traceFlagAtas = [];  var flagAtas = checkIfConnectedWithBorder(_papan.arr, i, j, giliran, traceFlagAtas, "ATAS");
        var traceFlagBawah = [];  var flagBawah = checkIfConnectedWithBorder(_papan.arr, i, j, giliran, traceFlagBawah, "BAWAH");

        if((flagKiri && flagKanan) || (flagAtas && flagBawah)) {
          playerMenang = true;
        }
        if(flagKiri) {
          var tempIndex = j * 10;
          if(tempIndex > indexPlayerDariKiri) {
            indexPlayerDariKiri = tempIndex;
          }
        }
        if(flagKanan) {
          var tempIndex = (4 - j) * 10;
          if(tempIndex > indexPlayerDariKanan) {
            indexPlayerDariKanan = tempIndex;
          }
        }
        if(flagAtas) {
          var tempIndex = i * 10;
          if(tempIndex > indexPlayerDariAtas) {
            indexPlayerDariAtas = tempIndex;
          }
        }
        if(flagBawah) {
          var tempIndex = (4 - 1) * 10;
          if(tempIndex > indexPlayerDariBawah) {
            indexPlayerDariBawah = tempIndex;
          }
        }
      }
    }
    if(playerMenang) {
      weight = weight + 11000;
    }
    weight = weight + indexPlayerDariAtas + indexPlayerDariBawah + indexPlayerDariKanan + indexPlayerDariKiri;

    var lawanMenang = false;
    var indexLawanDariKiri = 0;
    var indexLawanDariKanan = 0;
    var indexLawanDariAtas = 0;
    var indexLawanDariBawah = 0;
    for(var i = 0; i < 5; i++) {
      for(var j = 0; j < 5; j++) {
        var traceFlagKiriLawan = [];  var flagKiriLawan = checkIfConnectedWithBorder(_papan.arr, i, j, notgiliran, traceFlagKiriLawan, "KIRI");
        var traceFlagKananLawan = [];  var flagKananLawan = checkIfConnectedWithBorder(_papan.arr, i, j, notgiliran, traceFlagKananLawan, "KANAN");
        var traceFlagAtasLawan = [];  var flagAtasLawan = checkIfConnectedWithBorder(_papan.arr, i, j, notgiliran, traceFlagAtasLawan, "ATAS");
        var traceFlagBawahLawan = [];  var flagBawahLawan = checkIfConnectedWithBorder(_papan.arr, i, j, notgiliran, traceFlagBawahLawan, "BAWAH");

        if((flagKiriLawan && flagKananLawan) || (flagAtasLawan && flagBawahLawan)) {
          lawanMenang = true
        }

        if(flagKiriLawan) {
          var tempIndex = j * -10;
          if(tempIndex < indexLawanDariKiri) {
            indexLawanDariKiri = tempIndex;
          }
        }
        if(flagKananLawan) {
          var tempIndex = (4 - j) * -10;
          if(tempIndex < indexLawanDariKanan) {
            indexLawanDariKanan = tempIndex;
          }
        }
        if(flagAtasLawan) {
          var tempIndex = i * -10;
          if(tempIndex < indexLawanDariAtas) {
            indexLawanDariAtas = tempIndex;
          }
        }
        if(flagBawahLawan) {
          var tempIndex = (4 - 1) * -10;
          if(tempIndex < indexLawanDariBawah) {
            indexLawanDariBawah = tempIndex;
          }
        }
      }
    }

    if(lawanMenang) {
      weight = weight - 12000;
    }
    weight = weight + indexLawanDariAtas + indexLawanDariBawah + indexLawanDariKanan + indexLawanDariKiri;
    
    for(var i = 0; i < 5; i++) {
      for(var j = 0; j < 5; j++) {
        if(_papan.arr[i][j].length > 0) {
          var t = _papan.arr[i][j].length - 1; 
          if(_papan.giliran == global.BLACKTURN) {
            if(_papan.arr[i][j][t] <= 13) {
              weight = weight + (1 * _papan.arr[i][j].length); 
              
            }
            else if(_papan.arr[i][j][t] >= 21 && _papan.arr[i][j][t] <= 23) {
              weight = weight - (1 * _papan.arr[i][j].length); 
            } 
          }
          else {
            if(_papan.arr[i][j][t] <= 13) {
              weight = weight - (1 * _papan.arr[i][j].length);
            }
            else if(_papan.arr[i][j][t] >= 21 && _papan.arr[i][j][t] <= 23) {
              weight = weight + (1 * _papan.arr[i][j].length); 
            }  
          }
        }
      }
    }

    return weight; 
  }

  function copyArray(src) {
    var _arr = [];
    for(var b = 0; b < 5; b++) {
      var temparr = []; 
      for(var k = 0; k < 5; k++) {
        
        var item = []; 
        for(var t = 0; t < src[b][k].length; t++) {
          item.push(src[b][k][t]); 
        }

        temparr.push(item); 
      }
      _arr.push(temparr); 
    }
    return _arr; 
  }

  function isRightPath(arr, brs, klm, gil) {
    if(arr[brs][klm].length == 0) { return false; }
    else {
      if(gil == global.BLACKTURN) { 
        if(arr[brs][klm][arr[brs][klm].length - 1] == 11 || arr[brs][klm][arr[brs][klm].length - 1] == 13)
        { return true; }
      }  
      else {
        if(arr[brs][klm][arr[brs][klm].length - 1] == 21 || arr[brs][klm][arr[brs][klm].length - 1] == 23)
        { return true; }
      }
      return false; 
    }
  }

  function checkIfConnectedWithBorder(arr, brs, klm, warna, trace, sisi) {
    if(sisi == "KIRI" && klm == 0 && isRightPath(arr, brs, klm, warna) == true) { return true; }
    else if(sisi == "KANAN" && klm == 4 && isRightPath(arr, brs, klm, warna) == true) { return true; }
    else if(sisi == "ATAS" && brs == 0 && isRightPath(arr, brs, klm, warna) == true) { return true; }
    else if(sisi == "BAWAH" && brs == 4 && isRightPath(arr, brs, klm, warna) == true) { return true; }
    else {      
      var filter = trace.filter(item => item.brs == brs && item.klm == klm);
      if(filter.length == 0) {
        var valid = false;
        if(arr[brs][klm].length > 0) {
          if(isRightPath(arr, brs, klm, warna) == true) 
          { valid = true; }
        } 
  
        if(valid == true) {
          trace.push({brs: brs, klm: klm});
          var flag = false; 
          var dx = [0, 0, 1, -1]; 
          var dy = [1,-1, 0, 0 ];
          for(var i = 0; i < 4 && flag == false; i++) {
            if(brs + dy[i] >= 0 && brs + dy[i] < 5 && klm + dx[i] >= 0 && klm + dx[i] < 5) {
              flag = checkIfConnectedWithBorder(arr, brs + dy[i], klm + dx[i], warna, trace, sisi);
              if(flag == false) {
                trace.slice(trace.length - 1, 1); 
              }
            }
          }
          return flag; 
        }            
        else { return false; }
      }
      else { return false; }        
    }
  }

  function tryMoving(vb, vk, vgiliran, varr, db, dk, vmode) {
    var len = varr[vb][vk].length;
    var moveFlag = 0;
    var stackAI = [];
    if ((vgiliran == global.BLACKTURN && varr[vb][vk][len - 1] <= global.CAPSTONE_BLACK) ||
      (vgiliran == global.WHITETURN && varr[vb][vk][len - 1] <= global.CAPSTONE_WHITE &&
        varr[vb][vk][len - 1] > global.CAPSTONE_BLACK)) {
      var _arr = copyArray(varr);
      for (var z = 0; z < varr[vb][vk].length; z++) { stackAI.push(varr[vb][vk][z]); }
      _arr[vb][vk] = [];

      if ((db < 0 && vb > 0) || (db > 0 && vb < 4) || (dk < 0 && vk > 0) || (dk > 0 && vk < 4)) {
        var moveBrs = vb; var moveKlm = vk;
        if(vmode != 0) { moveBrs+=db; moveKlm+=dk; }
        while (moveFlag == 0) {
          var enough = false;
          do {
            if (stackAI.length == 0) { enough = true; }
            else {
              var palingBawah = stackAI[0];
              //console.log("cek = " + moveBrs + "," + moveKlm + " => " + vb + "," + vk + "=> " + db + "," + dk + "-" + vmode);
              _arr[moveBrs][moveKlm].push(palingBawah);
              if (vgiliran == global.BLACKTURN && palingBawah <= global.CAPSTONE_BLACK) { enough = true; }
              else if (vgiliran == global.WHITETURN && palingBawah > global.CAPSTONE_BLACK && palingBawah <= global.CAPSTONE_WHITE) { enough = true; }
              stackAI.splice(0, 1);
            }
          }
          while (enough == false);
          moveBrs += db; moveKlm += dk;
          if (!(moveBrs >= 0 && moveBrs < 5 && moveKlm >= 0 && moveKlm < 5)) {
            if ((db != 0 && moveBrs == vb + db) || (dk != 0 && moveKlm == vk + dk)) { moveFlag = -1; }
            else {
              moveFlag = 1;
              while (stackAI.length > 0) {
                var palingBawah = stackAI[0];
                if (db != 0) {
                  _arr[moveBrs + (db * -1)][moveKlm].push(palingBawah);
                }
                else {
                  _arr[moveBrs][moveKlm + (dk * -1)].push(palingBawah);
                }
                stackAI.splice(0, 1);
              }
            }
          }
          else if (stackAI.length == 0) {
            //console.log("habis = movebrs = " + moveBrs + " - vb = " + vb);
            if ((db != 0 && moveBrs == vb + db) || (dk != 0 && moveKlm == vk + dk)) { moveFlag = -1; }
            else { moveFlag = 1; }
          }
          else {
            //console.log("masuk sini " + moveBrs + "***" + moveKlm);
            var len2 = _arr[moveBrs][moveKlm].length;
            if (len2 != 0) {
              //console.log("masuk sini lagi");
              var topval = _arr[moveBrs][moveKlm][len2 - 1];
              if (vgiliran == global.BLACKTURN && topval != global.FLATSTONE_BLACK) {  // tidak boleh naik 
                //console.log("tidak boleh naik");
                if ((db != 0 && moveBrs == vb + db) || (dk != 0 && moveKlm == vk + dk)) {
                  moveFlag = -2;
                  //console.log(db + "***" + dk);
                  //console.log(moveBrs + "***" + moveKlm);
                }
                else {
                  //console.log("kesini");
                  moveFlag = 1;
                  moveBrs += (db * -1); moveKlm += (dk * -1);
                  //console.log("masuk sini " + moveBrs + "***" + moveKlm);
                  while (stackAI.length > 0) {
                    var palingBawah = stackAI[0];
                    _arr[moveBrs][moveKlm].push(palingBawah);
                    stackAI.splice(0, 1);
                  }
                }
              }
            }
          }
        }
      }
    }
    if (moveFlag == 1) {
      for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
          varr[i][j] = _arr[i][j];
        }
      }
    }
    return moveFlag;
  }

  function minimum(_level, _giliran, _papan, _result) {
    if(_level > maxLevel) {
      return findWeight(_papan);
    }
    else {
      var pilihanKoin = [];
      var _notgiliran = _giliran;

      if (_giliran == global.BLACKTURN) {
        _notgiliran = global.WHITETURN;
        if (global.NUMBER_OF_BLACK_FLATSTONE > 0) { pilihanKoin.push(global.FLATSTONE_BLACK); }
        if (jumMelangkah >= 2) {
          if (global.NUMBER_OF_BLACK_FLATSTONE > 0) { pilihanKoin.push(global.WALLSTONE_BLACK); }
          if (global.NUMBER_OF_BLACK_CAPSTONE == 1) { pilihanKoin.push(global.CAPSTONE_BLACK); }
        }
      }
      else {
        _notgiliran = global.BLACKTURN;
        if (global.NUMBER_OF_WHITE_FLATSTONE > 0) { pilihanKoin.push(global.FLATSTONE_WHITE); }
        if (jumMelangkah >= 2) {
          if (global.NUMBER_OF_WHITE_FLATSTONE > 0) { pilihanKoin.push(global.WALLSTONE_WHITE); }
          if (global.NUMBER_OF_WHITE_CAPSTONE == 1) { pilihanKoin.push(global.CAPSTONE_WHITE); }
        }
      }

      var status = []; 
      status['maxweight'] = 70000;
      status['bar'] = -1;
      status['kol'] = -1;
      status['koin'] = -1;

      var win = false;
      for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
          if (_papan.arr[i][j].length == 0)     // jika kotak tsb kondisi kosong
          {
            var _arr = copyArray(_papan.arr);
            for (var k = 0; k < pilihanKoin.length; k++) {
              _arr[i][j].push(pilihanKoin[k]);
              var weight = findWeight(new Clsboard(_giliran, _arr));
              if(!(weight < -5000)) {
                weight = maksimum(_level + 1, _notgiliran, new Clsboard(_giliran, _arr), _result);
              } 
              if((weight < -5000)) {
                win = true;
              } 

              //console.log("level " + _level + " -> after maksimum = " + i + ", " + j + " = " + weight); 

              if (weight < status['maxweight']) {
                status['maxweight'] = weight;
                status['bar'] = i;
                status['kol'] = j;
                status['koin'] = pilihanKoin[k];
              }
              _arr[i][j].pop();
              if(win) {
                break;
              }
            }
          }
          if(win) {
            break;
          }
        }
        if(win) {
          break;
        }
      }
      

      _result['maxweight'] = status['maxweight'];
      _result['bar'] = status['bar'];
      _result['kol'] = status['kol'];
      _result['koin'] = status['koin'];

      return status['maxweight']; 
    }
  }

  function maksimum(_level, _giliran, _papan, _result) {
    if(_level <= maxLevel) {
      var pilihanKoin = [];
      var _notgiliran = _giliran;

      if (_giliran == global.BLACKTURN) {
        _notgiliran = global.WHITETURN;
        if(jumMelangkah < 2) {
          pilihanKoin.push(global.FLATSTONE_WHITE);
        }
        else if (jumMelangkah >= 2) {
          if (global.NUMBER_OF_BLACK_FLATSTONE > 0) { pilihanKoin.push(global.FLATSTONE_BLACK); }
          if (global.NUMBER_OF_BLACK_FLATSTONE > 0) { pilihanKoin.push(global.WALLSTONE_BLACK); }
          if (global.NUMBER_OF_BLACK_CAPSTONE == 1) { pilihanKoin.push(global.CAPSTONE_BLACK); }
        }
      }
      else {
        _notgiliran = global.BLACKTURN;
        if(jumMelangkah < 2) {
          pilihanKoin.push(global.FLATSTONE_BLACK);
        }
        else if (jumMelangkah >= 2) {
          if (global.NUMBER_OF_WHITE_FLATSTONE > 0) { pilihanKoin.push(global.FLATSTONE_WHITE); }
          if (global.NUMBER_OF_WHITE_FLATSTONE > 0) { pilihanKoin.push(global.WALLSTONE_WHITE); }
          if (global.NUMBER_OF_WHITE_CAPSTONE == 1) { pilihanKoin.push(global.CAPSTONE_WHITE); }
        }
      }

      var status = []; 
      status['maxweight'] = -70000;
      status['bar'] = -1;
      status['kol'] = -1;
      status['koin'] = -1;

      var win = false;
      //Gerak AI ke-1 --> menaruh stone
      for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
          if (_papan.arr[i][j].length == 0)
          {
            var _arr = copyArray(_papan.arr);
            for (var k = 0; k < pilihanKoin.length; k++) {
              _arr[i][j].push(pilihanKoin[k]);
              var weight = findWeight(new Clsboard(_giliran, _arr));
              if(!(weight > 5000)) {
                weight = minimum(_level + 1, _notgiliran, new Clsboard(_giliran, _arr), _result);
              }
              if(weight > 5000) {
                win = true;
              }

              //console.log("level " + _level + " -> after minimum = " + i + ", " + j + " = " + weight); 

              if (weight > status['maxweight']) {
                status['maxweight'] = weight;
                status['bar'] = i;
                status['kol'] = j;
                status['koin'] = pilihanKoin[k];
              }
              _arr[i][j].pop();
            }
          }
        }
      }

      //Gerak AI ke-2 --> menggerakan stone
      for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
          var len = _papan.arr[i][j].length;
          if (len > 0)     // jika kotak tsb ada isinya
          {
            if ((_giliran == global.BLACKTURN && _papan.arr[i][j][len - 1] <= global.CAPSTONE_BLACK) ||
              (_giliran == global.WHITETURN && _papan.arr[i][j][len - 1] <= global.CAPSTONE_WHITE &&
                _papan.arr[i][j][len - 1] > global.CAPSTONE_BLACK)) {

              for (var arah = 0; arah < 4; arah += 1) {
                var db = -1; var dk = -1; 
                if(arah == 0) { db = -1; dk = 0; }      // atas
                else if(arah == 1) { db = 0; dk = 1; }  // kanan
                else if(arah == 2) { db = 1; dk = 0; }  // bawah
                else if(arah == 3) { db = 0; dk = -1; } // kiri

                // kemungkinan bisa start dari kotak dia dan bisa dari kotak disampingnya
                var value = 0;
                for (var k = 0; k < 2; k++) {
                  var _arr = copyArray(_papan.arr);
                  var moveFlag = tryMoving(i, j, _giliran, _arr, db, dk, value);
                  if (moveFlag == 1) {
                    //console.log("masuk 2 = " + i + "," + j);
                    // _arr yg isinya adalah papan yg sudah berubah sesuai disribusi koin
                    var weight = minimum(_level + 1, _notgiliran, new Clsboard(_giliran, _arr), _result);
                    //console.log("level " + _level + " -> after minimum = " + i + ", " + j + " = " + weight);
                    if (weight > status['maxweight']) {
                      status['maxweight'] = weight;
                      status['bar'] = i;
                      status['kol'] = j;
                      if(arah == 0) { status['koin'] = "moveup"; }
                      else if(arah == 1) { status['koin'] = "moveright"; }
                      else if(arah == 2) { status['koin'] = "movedown"; }
                      else if(arah == 3) { status['koin'] = "moveleft"; }
                      status['value'] = -1;
                    }
                  }
                  value = -1;
                }
              }
            }
          }
        }
      }
      
      _result['maxweight'] = status['maxweight'];
      _result['bar'] = status['bar'];
      _result['kol'] = status['kol'];
      _result['koin'] = status['koin'];

      return status['maxweight']; 
    }
  }

  function runAI() {
    var level = 1
    var result = [];
    result['maxweight'] = 0;
    result['bar'] = -1;
    result['kol'] = -1;
    result['koin'] = -1;
    result['value'] = 99;
    maksimum(level, giliran, papan, result);
    console.log("posisi AI ambil = " + result['maxweight'] + " --- " + result['bar'] + " ---- " + result['kol'] + " ---- " + result['koin']);

    if (result['koin'] == "moveup") {
      console.log("posisi AI ambil = " + result['value']);
      console.log("ubah moveup");
      var _arr = copyArray(papan.arr);
      tryMoving(result['bar'], result['kol'], giliran, _arr, -1, 0, result['value']);
      papan.arr = _arr;
    }
    else if (result['koin'] == "moveright") {
      console.log("posisi AI ambil = " + result['value']);
      console.log("ubah moveright");
      var _arr = copyArray(papan.arr);
      tryMoving(result['bar'], result['kol'], giliran, _arr, 0, 1, result['value']);
      papan.arr = _arr;
    }
    else if (result['koin'] == "movedown") {
      console.log("posisi AI ambil = " + result['value']);
      console.log("ubah movedown");
      var _arr = copyArray(papan.arr);
      tryMoving(result['bar'], result['kol'], giliran, _arr, 1, 0, result['value']);
      papan.arr = _arr;
    }
    else if (result['koin'] == "moveleft") {
      console.log("posisi AI ambil = " + result['value']);
      console.log("ubah moveleft");
      var _arr = copyArray(papan.arr);
      tryMoving(result['bar'], result['kol'], giliran, _arr, 0, -1, result['value']);
      papan.arr = _arr;
    }
    else {
      papan.arr[result['bar']][result['kol']].push(result['koin']);
      if(result['koin'] == global.WALLSTONE_BLACK || result['koin'] == global.FLATSTONE_BLACK) {
        global.NUMBER_OF_BLACK_FLATSTONE = global.NUMBER_OF_BLACK_FLATSTONE - 1;
      } else if(result['koin'] == global.WALLSTONE_WHITE || result['koin'] == global.FLATSTONE_WHITE) {
        global.NUMBER_OF_WHITE_FLATSTONE = global.NUMBER_OF_WHITE_FLATSTONE - 1;
      } else if(result['koin'] == global.CAPSTONE_BLACK) {
        global.NUMBER_OF_BLACK_CAPSTONE = global.NUMBER_OF_BLACK_CAPSTONE - 1;
      } else if(result['koin'] == global.CAPSTONE_WHITE) {
        global.NUMBER_OF_WHITE_CAPSTONE = global.NUMBER_OF_WHITE_CAPSTONE - 1;
      }
    }

    var menang = false;
    for(var i = 0; i < 5; i++) {
      for(var j = 0; j < 5; j++) {
        // cek menang 
        var trace = []; 
        trace = [];  var flagKiri = checkIfConnectedWithBorder(papan.arr, i, j, giliran, trace, "KIRI");
        trace = [];  var flagKanan = checkIfConnectedWithBorder(papan.arr, i, j, giliran, trace, "KANAN");
        trace = [];  var flagAtas = checkIfConnectedWithBorder(papan.arr, i, j, giliran, trace, "ATAS");
        trace = [];  var flagBawah = checkIfConnectedWithBorder(papan.arr, i, j, giliran, trace, "BAWAH");

        if(flagKiri == true && flagKanan == true) { alert('horizontal win'); menang = true; break; }
        else if(flagAtas == true && flagBawah == true) { alert('vertical win'); menang = true; break; }
      }
      if(menang) {
        break;
      }
    }

    gantiGiliran();
  }


  function arraysEqual(a, b) {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i].length !== b[i].length) return false;

        for (let j = 0; j < a[i].length; j++) {
            if (a[i][j].length !== b[i][j].length) return false;

            for (let k = 0; k < a[i][j].length; k++) {
                if (a[i][j][k] !== b[i][j][k]) return false;
            }
        }
    }
    return true;
  }


  function gantiGiliran() {
    if(!arraysEqual(tempArr, papan.arr)){
      setJumMelangkah(jumMelangkah + 1);
      if(giliran == global.BLACKTURN) { 
        setGiliran(global.WHITETURN);
        if(jumMelangkah < 1) {
          setSelectedStone(global.FLATSTONE_BLACK);
        } else {
          setSelectedStone(global.FLATSTONE_WHITE);
        }


      }
      else { 
        setGiliran(global.BLACKTURN); 
        if(jumMelangkah < 1) {
          setSelectedStone(global.FLATSTONE_WHITE);
        } else {
          setSelectedStone(global.FLATSTONE_BLACK);
        }
      }  
    }
  }

  function validTaruh(parambrs, paramklm, paramgiliran) {
    if (papan.arr[parambrs][paramklm].length > 0) {
      let topStone = papan.arr[parambrs][paramklm][papan.arr[parambrs][paramklm].length - 1];
      
      if ((stackAngkat[0] === global.FLATSTONE_BLACK || stackAngkat[0] === global.FLATSTONE_WHITE || stackAngkat[0] === global.WALLSTONE_BLACK || stackAngkat[0] === global.WALLSTONE_WHITE) 
      && topStone !== global.WALLSTONE_BLACK && topStone !== global.WALLSTONE_WHITE && topStone !== global.CAPSTONE_BLACK && topStone !== global.CAPSTONE_WHITE) {
        
      }
  
      else if (stackAngkat[0] === global.CAPSTONE_BLACK || stackAngkat[0] === global.CAPSTONE_WHITE) {
        
      }

      else {
        return false;
      }
    }
    
    if(brsDirection == -1 && klmDirection == -1) {
      if(parambrs == brsAngkat && paramklm == klmAngkat) { return true; }
      else {
        var selisihbrs = Math.abs(parambrs - brsAngkat);
        var selisihklm = Math.abs(paramklm - klmAngkat); 
        if((selisihbrs == 0 && selisihklm == 1) || (selisihbrs == 1 && selisihklm == 0)) 
        { return true; }
      }
    }
    else {
      if(parambrs - lastBrs == brsDirection && paramklm - lastKlm == klmDirection)
      { return true; }
      else if(parambrs == lastBrs && paramklm == lastKlm) 
      { return true; }
    }

    return false;
  }

  function playerAction(brs, klm) {
    // Check if the selected cell is empty
    if (papan.arr[brs][klm].length === 0 && brsAngkat == -1) {
      if(((selectedStone === global.FLATSTONE_BLACK || selectedStone === global.WALLSTONE_BLACK) && global.NUMBER_OF_BLACK_FLATSTONE > 0) || 
        ((selectedStone === global.FLATSTONE_WHITE || selectedStone === global.WALLSTONE_WHITE) && global.NUMBER_OF_WHITE_FLATSTONE > 0) || 
        (selectedStone === global.CAPSTONE_BLACK && global.NUMBER_OF_BLACK_CAPSTONE > 0) ||
        (selectedStone === global.CAPSTONE_WHITE && global.NUMBER_OF_WHITE_CAPSTONE > 0)) {
          setTempArr(copyArray(papan.arr));
          papan.arr[brs][klm].push(selectedStone);

          if ((selectedStone === global.FLATSTONE_BLACK || selectedStone === global.WALLSTONE_BLACK) && global.NUMBER_OF_BLACK_FLATSTONE > 0) {
            global.NUMBER_OF_BLACK_FLATSTONE = global.NUMBER_OF_BLACK_FLATSTONE - 1;
          } else if ((selectedStone === global.FLATSTONE_WHITE || selectedStone === global.WALLSTONE_WHITE) && global.NUMBER_OF_WHITE_FLATSTONE > 0) {
            global.NUMBER_OF_WHITE_FLATSTONE = global.NUMBER_OF_WHITE_FLATSTONE - 1;
          } else if (selectedStone === global.CAPSTONE_BLACK && global.NUMBER_OF_BLACK_CAPSTONE > 0) {
            global.NUMBER_OF_BLACK_CAPSTONE = global.NUMBER_OF_BLACK_CAPSTONE - 1;
          } else if (selectedStone === global.CAPSTONE_WHITE && global.NUMBER_OF_WHITE_CAPSTONE > 0) {
            global.NUMBER_OF_WHITE_CAPSTONE = global.NUMBER_OF_WHITE_CAPSTONE - 1;
          }
          
          //Check whether player has won or not
          var trace = []; 
          trace = [];  var flagKiri = checkIfConnectedWithBorder(papan.arr, brs, klm, giliran, trace, "KIRI");
          trace = [];  var flagKanan = checkIfConnectedWithBorder(papan.arr, brs, klm, giliran, trace, "KANAN");
          trace = [];  var flagAtas = checkIfConnectedWithBorder(papan.arr, brs, klm, giliran, trace, "ATAS");
          trace = [];  var flagBawah = checkIfConnectedWithBorder(papan.arr, brs, klm, giliran, trace, "BAWAH");

          if(flagKiri == true && flagKanan == true) { alert('horizontal win'); }
          else if(flagAtas == true && flagBawah == true) { alert('vertical win'); }
          
          gantiGiliran(); 
      }
    } else {
      if(brsAngkat == -1) {
        setTempArr(copyArray(papan.arr));
        var top = papan.arr[brs][klm].length - 1;
        var topstack = papan.arr[brs][klm][top];
        var stackLength = papan.arr[brs][klm].length <= 5 ? papan.arr[brs][klm].length : 5;
        if (giliran == global.BLACKTURN && (topstack == global.FLATSTONE_BLACK || topstack == global.CAPSTONE_BLACK || topstack == global.WALLSTONE_BLACK)) {
          setBrsAngkat(brs); setKlmAngkat(klm); setBrsDirection(-1); setKlmDirection(-1); setStackAngkat(papan.arr[brs][klm].slice(-1 * stackLength));
          papan.arr[brs][klm].splice(-1 * stackLength, stackLength); 
        }
        else if (giliran == global.WHITETURN && (topstack == global.FLATSTONE_WHITE || topstack == global.CAPSTONE_WHITE || topstack == global.WALLSTONE_WHITE)) {
          setBrsAngkat(brs); setKlmAngkat(klm); setBrsDirection(-1); setKlmDirection(-1); setStackAngkat(papan.arr[brs][klm].slice(-1 * stackLength));
          papan.arr[brs][klm].splice(-1 * stackLength, stackLength); 
        }  
      }
      else {
        if(validTaruh(brs, klm, giliran) == true) {
          if(papan.arr[brs][klm].length > 0) {
            var tp = papan.arr[brs][klm].length - 1;
            if(papan.arr[brs][klm][tp] === global.WALLSTONE_BLACK) {
              papan.arr[brs][klm][tp] = global.FLATSTONE_BLACK;
            } else if(papan.arr[brs][klm][tp] === global.WALLSTONE_WHITE) {
              papan.arr[brs][klm][tp] = global.FLATSTONE_WHITE;
            }
            papan.arr[brs][klm].push(stackAngkat[0]);
          } else {
            papan.arr[brs][klm].push(stackAngkat[0]);
          }

          setStackAngkat(stackAngkat.filter((item, index) => index != 0));
          if(stackAngkat.length == 1) {
            setBrsAngkat(-1); setKlmAngkat(-1); setBrsDirection(-1); setKlmDirection(-1); setLastBrs(-1); setLastKlm(-1); 
            var menang = false;
            for(var i = 0; i < 5; i++) {
              for(var j = 0; j < 5; j++) {
                // cek menang 
                var trace = []; 
                trace = [];  var flagKiri = checkIfConnectedWithBorder(papan.arr, i, j, giliran, trace, "KIRI");
                trace = [];  var flagKanan = checkIfConnectedWithBorder(papan.arr, i, j, giliran, trace, "KANAN");
                trace = [];  var flagAtas = checkIfConnectedWithBorder(papan.arr, i, j, giliran, trace, "ATAS");
                trace = [];  var flagBawah = checkIfConnectedWithBorder(papan.arr, i, j, giliran, trace, "BAWAH");

                if(flagKiri == true && flagKanan == true) { alert('horizontal win'); menang = true; break; }
                else if(flagAtas == true && flagBawah == true) { alert('vertical win'); menang = true; break; }
              }
              if(menang) {
                break;
              }
            }
            gantiGiliran();
          }
          else {
            if(brsDirection == -1 && klmDirection == -1) {
              if(!(brs == brsAngkat && klm == klmAngkat)) {
                setBrsDirection(brs - brsAngkat); 
                setKlmDirection(klm - klmAngkat);  
                setLastBrs(brs); 
                setLastKlm(klm);                
              }
              else {
                setLastBrs(brs); 
                setLastKlm(klm);                
              }  
            } else {
              setLastBrs(brs); 
              setLastKlm(klm); 
            }
          }
        }
      }
    }
  }

  function showStackInHand() {
    return <div className='card' style={{ width: '100px', height: '80px', borderRadius: '2px', backgroundColor: '#00AAFF', boxSizing: 'border-box', padding: '1px', margin: '1px' }} key='stackInHand'>
      <table style={{ width: '100%' }}>
        {stackAngkat.slice().reverse().map((revnode, indexitem) => (
          <>
            {
              <tr style={{ width: '100%' }}>
                <td style={{ width: '100%' }}>
                { revnode == global.FLATSTONE_BLACK && 
                  <div style={{width: '100%', height: '10px', backgroundColor: 'black', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px'}}>
                  </div>
                }
                { revnode == global.FLATSTONE_WHITE && 
                  <div style={{width: '100%', height: '10px', backgroundColor: 'white', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px'}}>
                  </div>
                }
                { revnode == global.WALLSTONE_BLACK && 
                  <div style={{width: '10%', marginLeft: '45%', height: '30px', backgroundColor: 'black', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px'}}>
                  </div>
                }
                { revnode == global.WALLSTONE_WHITE && 
                  <div style={{width: '10%', marginLeft: '45%', height: '30px', backgroundColor: 'white', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px'}}>
                  </div>
                }
                { revnode == global.CAPSTONE_BLACK && 
                  <div style={{width: '20%', marginLeft: '40%', height: '20px', backgroundColor: 'black', borderRadius: '10px', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px'}}>
                  </div>
                }
                { revnode == global.CAPSTONE_WHITE && 
                  <div style={{width: '20%', marginLeft: '40%', height: '20px', backgroundColor: 'white', borderRadius: '10px', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px'}}>
                  </div>
                }
                </td>
              </tr>
            }
          </>
        ))}
      </table>
    </div>
  }

  function CellSelectedStack(indexbar, indexkol, node) {
    return <div onClick={() => playerAction(indexbar, indexkol)} 
          className='card w-25 h-20 rounded-sm bg-green-700 box-border p-0.5 m-0.5' 
          key={indexbar + indexkol}>
      <table className='w-full'>
        {node.slice().reverse().map((revnode, indexitem) => (
          <tr className='w-full'>
            <td className='w-full'>
              {revnode == global.FLATSTONE_BLACK && 
                <div className='w-full h-2.5 bg-black'></div>
              }
              {revnode == global.FLATSTONE_WHITE && 
                <div className='w-full h-2.5 bg-white'></div>
              }
              {revnode == global.WALLSTONE_BLACK && 
                <div className='w-1/10 ml-9/20 h-7.5 bg-black'></div>
              }
              {revnode == global.WALLSTONE_WHITE && 
                <div className='w-1/10 ml-9/20 h-7.5 bg-white'></div>
              }
              {revnode == global.CAPSTONE_BLACK && 
                <div className='w-1/5 ml-2/5 h-5 bg-black rounded-full'></div>
              }
              {revnode == global.CAPSTONE_WHITE && 
                <div className='w-1/5 ml-2/5 h-5 bg-white rounded-full'></div>
              }
            </td>
          </tr>
        ))}
      </table>
    </div>
  }

  function showCurrentStack() {
    return <div className='card' style={{ width: '100px', height: '80px', borderRadius: '2px', backgroundColor: '#00AAFF', boxSizing: 'border-box', padding: '1px', margin: '1px' }} key='stackInHand'>
      <table style={{ width: '100%' }}>
        {selectedStack.slice().reverse().map((revnode, indexitem) => (
          <>
            {
              <tr style={{ width: '100%' }}>
                <td style={{ width: '100%' }}>
                { revnode == global.FLATSTONE_BLACK && 
                  <div style={{width: '100%', height: '10px', backgroundColor: 'black', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px'}}>
                  </div>
                }
                { revnode == global.FLATSTONE_WHITE && 
                  <div style={{width: '100%', height: '10px', backgroundColor: 'white', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px'}}>
                  </div>
                }
                { revnode == global.WALLSTONE_BLACK && 
                  <div style={{width: '10%', marginLeft: '45%', height: '30px', backgroundColor: 'black', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px'}}>
                  </div>
                }
                { revnode == global.WALLSTONE_WHITE && 
                  <div style={{width: '10%', marginLeft: '45%', height: '30px', backgroundColor: 'white', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px'}}>
                  </div>
                }
                { revnode == global.CAPSTONE_BLACK && 
                  <div style={{width: '20%', marginLeft: '40%', height: '20px', backgroundColor: 'black', borderRadius: '10px', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px'}}>
                  </div>
                }
                { revnode == global.CAPSTONE_WHITE && 
                  <div style={{width: '20%', marginLeft: '40%', height: '20px', backgroundColor: 'white', borderRadius: '10px', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px'}}>
                  </div>
                }
                </td>
              </tr>
            }
          </>
        ))}
      </table>
    </div>
  }

  function setHoveredCell(brs, klm){
    var stackLength = papan.arr[brs][klm].length;
    setSelectedStack(papan.arr[brs][klm].slice(-1 * stackLength));
  }

  function CellNormal(indexbar, indexkol, node) {
    return <div onClick={() => 
                          playerAction(indexbar, indexkol)
                        } 
                        onMouseEnter={() => setHoveredCell(indexbar, indexkol)}
                        onMouseLeave={() => setSelectedStack([])}
                        className="card bg-[url('/tile.jpg')]" style={{ width: '100px', height: '80px', borderRadius: '2px', boxSizing: 'border-box', padding: '1px', margin: '1px' }} key={indexbar + indexkol}>
      <table className='w-full'>
        {node.slice().reverse().map((revnode, indexitem) => (
          <>
            {
              <tr style={{ width: '100%' }}>
                {indexitem == 0 ? 
                  <td style={{ width: '100%' }}>  
                  { revnode == global.FLATSTONE_BLACK && 
                    <div style={{width: '100%', height: '75px', backgroundColor: 'black', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px'}}>
                    </div>
                  }
                  { revnode == global.FLATSTONE_WHITE && 
                    <div style={{width: '100%', height: '75px', backgroundColor: 'white', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px'}}>
                    </div>
                  }
                  { revnode == global.WALLSTONE_BLACK && 
                    <div style={{width: '10%', marginLeft: '45%', height: '75px', backgroundColor: 'black', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px'}}>
                    </div>
                  }
                  { revnode == global.WALLSTONE_WHITE && 
                    <div style={{width: '10%', marginLeft: '45%', height: '75px', backgroundColor: 'white', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px'}}>
                    </div>
                  }
                  { revnode == global.CAPSTONE_BLACK && 
                    <div style={{width: '80%', marginLeft: '10%', height: '75px', backgroundColor: 'black', borderRadius: '100%', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px'}}>
                    </div>
                  }
                  { revnode == global.CAPSTONE_WHITE && 
                    <div style={{width: '80%', marginLeft: '10%', height: '75px', backgroundColor: 'white', borderRadius: '100%', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px'}}>
                    </div>
                  }
                  </td> : null
                }
              </tr>
            }
          </>
        ))}
      </table>
    </div>
  }

  return (
    <>
      <div className="flex justify-center items-center flex-col h-full w-full bg-gray-600">
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg my-12">
          <h4 className="text-2xl font-bold text-gray-800 mb-3">Tak Board Game</h4>
          <div className="mb-4">
            <h5 className="text-lg font-medium text-gray-600">
                Giliran: <span className="text-gray-800">{giliran === 1 ? "BLACK" : "WHITE"}</span>
            </h5>
            <h5 className="text-lg font-medium text-gray-600">Jumlah Stone Di Tangan Player White:</h5>
            <div className="text-sm text-gray-700 pl-4">
                Flatstones: {global.NUMBER_OF_WHITE_FLATSTONE}
            </div>
            <div className="text-sm text-gray-700 pl-4">
                Capstones: {global.NUMBER_OF_WHITE_CAPSTONE}
            </div>
            <h5 className="text-lg font-medium text-gray-600">Jumlah Stone Di Tangan Player Black:</h5>
            <div className="text-sm text-gray-700 pl-4">
                Flatstones: {global.NUMBER_OF_BLACK_FLATSTONE}
            </div>
            <div className="text-sm text-gray-700 pl-4">
                Capstones: {global.NUMBER_OF_BLACK_CAPSTONE}
            </div>
          </div>
          <div className='flex flex-wrap w-full'>
            <input 
                type='button' 
                onClick={() => runAI() }
                value="Run AI" 
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition duration-300" 
            />
            <div className='ml-10 border-1'>Stack in Hand : {showStackInHand()}</div>
            <div className='ml-10 border-1'>Current Stack : {showCurrentStack()}</div>
          </div>
          <div className="mt-4">
            {jumMelangkah >= 2 && (
              <div className="flex items-center space-x-4">
                 {jumMelangkah >= 2 && (
                  <>
                    <label>
                      <input 
                        type="radio" 
                        name="stoneType" 
                        value="flatstone"
                        onChange={() => selectStoneType(giliran === global.BLACKTURN ? global.FLATSTONE_BLACK : global.FLATSTONE_WHITE)} 
                        checked={selectedStone === (giliran === global.BLACKTURN ? global.FLATSTONE_BLACK : global.FLATSTONE_WHITE)}
                        className="form-radio text-blue-600"
                      />
                      <span className="text-gray-700 capitalize">Flatstone</span>
                    </label>

                    <label>
                      <input 
                        type="radio" 
                        name="stoneType" 
                        value="wallstone"
                        onChange={() => selectStoneType(giliran === global.BLACKTURN ? global.WALLSTONE_BLACK : global.WALLSTONE_WHITE)} 
                        checked={selectedStone === (giliran === global.BLACKTURN ? global.WALLSTONE_BLACK : global.WALLSTONE_WHITE)}
                        className="form-radio text-blue-600"
                      />
                      <span className="text-gray-700 capitalize">Wallstone</span>
                    </label>

                    <label>
                      <input 
                        type="radio" 
                        name="stoneType" 
                        value="capstone"
                        onChange={() => selectStoneType(giliran === global.BLACKTURN ? global.CAPSTONE_BLACK : global.CAPSTONE_WHITE)} 
                        checked={selectedStone === (giliran === global.BLACKTURN ? global.CAPSTONE_BLACK : global.CAPSTONE_WHITE)}
                        className="form-radio text-blue-600"
                      />
                      <span className="text-gray-700 capitalize">Capstone</span>
                    </label>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <table className="border-0 mb-10">
          <tbody>
            {papan.arr.map((item, indexbar) => (
              <tr key={indexbar}>
                {indexbar == 0 ? (
                  <td></td>
                ) : (
                  <td></td>
                )}
                {item.map((node, indexkol) => (
                  <td key={indexkol} className="border">
                    {(indexbar == brsAngkat && indexkol == klmAngkat)
                      ? CellSelectedStack(indexbar, indexkol, node)
                      : CellNormal(indexbar, indexkol, node)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default App
