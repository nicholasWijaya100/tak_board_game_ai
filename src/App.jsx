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
  const [tempArr, setTempArr] = useState([]);
  
  useEffect(() => {
  }, []);

  function selectStoneType(stoneType) {
    setSelectedStone(stoneType);
  }

  function findWeight(_papan) {
    var weight = 0;   
    
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

    for(var i = 0; i < 5; i++) {
      var breakTrue = false;
      for(var j = 0; j < 5; j++) {
        var traceFlagKiri = [];  var flagKiri = checkIfConnectedWithBorder(_papan.arr, i, j, giliran, traceFlagKiri, "KIRI");
        var traceFlagKanan = [];  var flagKanan = checkIfConnectedWithBorder(_papan.arr, i, j, giliran, traceFlagKanan, "KANAN");
        var traceFlagAtas = [];  var flagAtas = checkIfConnectedWithBorder(_papan.arr, i, j, giliran, traceFlagAtas, "ATAS");
        var traceFlagBawah = [];  var flagBawah = checkIfConnectedWithBorder(_papan.arr, i, j, giliran, traceFlagBawah, "BAWAH");

        if((flagKiri && flagKanan) || (flagAtas && flagBawah)) {
          weight = weight + 1500;
          breakTrue = true;
          break;
        }
      }
      if(breakTrue) {
        break;
      }
    }

    for(var i = 0; i < 5; i++) {
      var breakTrue = false;
      for(var j = 0; j < 5; j++) {
        var traceFlagKiriLawan = [];  var flagKiriLawan = checkIfConnectedWithBorder(_papan.arr, i, j, !giliran, traceFlagKiriLawan, "KIRI");
        var traceFlagKananLawan = [];  var flagKananLawan = checkIfConnectedWithBorder(_papan.arr, i, j, !giliran, traceFlagKananLawan, "KANAN");
        var traceFlagAtasLawan = [];  var flagAtasLawan = checkIfConnectedWithBorder(_papan.arr, i, j, !giliran, traceFlagAtasLawan, "ATAS");
        var traceFlagBawahLawan = [];  var flagBawahLawan = checkIfConnectedWithBorder(_papan.arr, i, j, !giliran, traceFlagBawahLawan, "BAWAH");

        if((flagKiriLawan && flagKananLawan) || (flagAtasLawan && flagBawahLawan)) {
          weight = weight - 1000;
          breakTrue = true;
          break;
        }
      }
      if(breakTrue) {
        break;
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

  function getChildren(stackAi, _giliran) {
    var jum = 0; 
    for(var i = 0; i < stackAi.length; i++) {
      if (_giliran == global.BLACKTURN && stackAi[i] <= global.CAPSTONE_BLACK) {
        jum+=1; 
      }
      else if (_giliran == global.WHITETURN && stackAi[i] > global.CAPSTONE_BLACK && stackAi[i] <= global.CAPSTONE_WHITE) {
        jum+=1; 
      }
    }
    return jum; 
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
      status['maxweight'] = 700000;
      status['bar'] = -1;
      status['kol'] = -1;
      status['koin'] = -1;

      // probabilitas 1
      for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
          if (_papan.arr[i][j].length == 0)     // jika kotak tsb kondisi kosong
          {
            var _arr = copyArray(_papan.arr);
            for (var k = 0; k < pilihanKoin.length; k++) {
              _arr[i][j].push(pilihanKoin[k]);
              var weight = maksimum(_level + 1, _notgiliran, new Clsboard(_giliran, _arr), _result);

              console.log("level " + _level + " -> after maksimum = " + i + ", " + j + " = " + weight); 

              if (weight < status['maxweight']) {
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
      status['maxweight'] = -700000;
      status['bar'] = -1;
      status['kol'] = -1;
      status['koin'] = -1;

      //Gerak AI ke-1 --> menaruh stone
      for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
          if (_papan.arr[i][j].length == 0)
          {
            var _arr = copyArray(_papan.arr);
            for (var k = 0; k < pilihanKoin.length; k++) {
              _arr[i][j].push(pilihanKoin[k]);
              var weight = minimum(_level + 1, _notgiliran, new Clsboard(_giliran, _arr), _result);

              console.log("level " + _level + " -> after minimum = " + i + ", " + j + " = " + weight); 

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

      //Gerak AI ke-2 --> menggerakkan stone
      for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
          if (_papan.arr[i][j].length > 0)     // jika kotak tsb pasti ada isinya
          {
            var len = _papan.arr[i][j].length;

            if ((_giliran == global.BLACKTURN && _papan.arr[i][j][len - 1] <= global.CAPSTONE_BLACK) ||
                (_giliran == global.WHITETURN && _papan.arr[i][j][len - 1] <= global.CAPSTONE_WHITE && 
                                                 _papan.arr[i][j][len - 1] >  global.CAPSTONE_BLACK)) {
              var _arr = copyArray(_papan.arr);

              var stackAI = _papan.arr[i][j];

              if(getChildren(stackAI, _giliran) > 1) {
                var _notgiliran = _giliran;
                if (_giliran == global.BLACKTURN) {
                  _notgiliran = global.WHITETURN;
  
                  //Move ke atas
                  if(i > 0) {
                    
                  }
                  //Move ke bawah
                  if(i < 4) {

                  }
                  //Move ke kiri
                  if(j > 0) {
                    
                  }
                  //Move ke kanan
                  if(j < 4) {
                    
                  }
                }
  
                var weight = minimum(_level + 1, _notgiliran, new Clsboard(_giliran, _arr), _result);
                if (weight > status['maxweight']) {
                  status['maxweight'] = weight;
                  status['bar'] = i;
                  status['kol'] = j;
                  status['koin'] = koin;
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
    maksimum(level, giliran, papan, result);
    console.log("result = " + result['maxweight'] + " --- " + result['bar'] + " ---- " + result['kol']); 

    papan.arr[result['bar']][result['kol']].push(result['koin']);
    if(result['koin'] == global.FLATSTONE_BLACK || result['koin'] == global.WALLSTONE_BLACK) {
      global.NUMBER_OF_BLACK_FLATSTONE = global.NUMBER_OF_BLACK_FLATSTONE - 1;
    } else if(result['koin'] == global.CAPSTONE_BLACK || result['koin'] == global.CAPSTONE_BLACK) {
      global.NUMBER_OF_BLACK_CAPSTONE = global.NUMBER_OF_BLACK_CAPSTONE - 1;
    } else if(result['koin'] == global.FLATSTONE_WHITE || result['koin'] == global.WALLSTONE_WHITE) {
      global.NUMBER_OF_WHITE_FLATSTONE = global.NUMBER_OF_WHITE_FLATSTONE - 1;
    } else {
      global.NUMBER_OF_WHITE_CAPSTONE = global.NUMBER_OF_WHITE_CAPSTONE - 1;
    }

    // cek menang 
    var trace = []; 
    trace = [];  var flagKiri = checkIfConnectedWithBorder(papan.arr, result['bar'], result['kol'], giliran, trace, "KIRI");
    trace = [];  var flagKanan = checkIfConnectedWithBorder(papan.arr, result['bar'], result['kol'], giliran, trace, "KANAN");
    trace = [];  var flagAtas = checkIfConnectedWithBorder(papan.arr, result['bar'], result['kol'], giliran, trace, "ATAS");
    trace = [];  var flagBawah = checkIfConnectedWithBorder(papan.arr, result['bar'], result['kol'], giliran, trace, "BAWAH");

    if(flagKiri == true && flagKanan == true) { alert('horizontal win'); }
    else if(flagAtas == true && flagBawah == true) { alert('vertical win'); }

    if(giliran == global.BLACKTURN) { gantiGiliran() }
    else { gantiGiliran() }
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

  function CellNormal(indexbar, indexkol, node) {
    return <div onClick={() => playerAction(indexbar, indexkol)} 
          className='card w-25 h-20 rounded-sm bg-blue-500 box-border p-0.5 m-0.5' 
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

  function CellSelectedStack(indexbar, indexkol, node) {
    return <div onClick={() => playerAction(indexbar, indexkol)} className='card' style={{ width: '100px', height: '80px', borderRadius: '2px', backgroundColor: '#00FFFF', boxSizing: 'border-box', padding: '1px', margin: '1px' }} key={indexbar + indexkol}>
      <table style={{ width: '100%' }}>
        {node.slice().reverse().map((revnode, indexitem) => (
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
          <input 
              type='button' 
              onClick={() => runAI() }
              value="Run AI" 
              className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition duration-300" 
          />
          <div className="mt-4">
            {jumMelangkah >= 2 && (
              <div className="flex items-center space-x-4">
                {['flatstone', 'wallstone', 'capstone'].map((type) => (
                  <label key={type} className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="stoneType" 
                      value={type}
                      onChange={() => selectStoneType(giliran === global.BLACKTURN ? global.FLATSTONE_BLACK : global.FLATSTONE_WHITE)} 
                      checked={selectedStone === (giliran === global.BLACKTURN ? global.FLATSTONE_BLACK : global.FLATSTONE_WHITE)}
                      className="form-radio text-blue-600"
                    />
                    <span className="text-gray-700 capitalize">{type}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
        <table className="border-0 ml-[-3rem] mb-10">
          <tbody>
            {papan.arr.map((item, indexbar) => (
              <tr key={indexbar}>
                {indexbar == 0 ? (
                  <td className="border">{showStackInHand()}</td>
                ) : (
                  <td></td>
                )}
                {item.map((node, indexkol) => (
                  <td key={indexkol} className="border">
                    {(indexbar == brsAngkat && indexkol == klmAngkat)
                      ? CellNormal(indexbar, indexkol, node)
                      : CellSelectedStack(indexbar, indexkol, node)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )}

export default App
