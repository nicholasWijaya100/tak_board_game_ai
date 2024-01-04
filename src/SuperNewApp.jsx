import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import global from './Global'
import { Clsboard } from './Clsboard'

function App() {
  var [sbe, setSBE] = useState([
    [0, 0, 0, 0, 0],
    [0, 80, 90, 80, 0],
    [0, 90, 100, 90, 0],
    [0, 80, 90, 80, 0],
    [0, 0, 0, 0, 0]
  ]);
  var [papan, setPapan] = useState(
    new Clsboard(global.BLACKTURN, [
      [[], [], [], [], [11,11,11,11,11]],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
    ])
  );
  var [batu, setBatu] = useState("flatstone");
  var [giliran, setGiliran] = useState(global.BLACKTURN);
  var [jumMelangkah, setJumMelangkah] = useState(0);
  var [jumBlackStone, setJumBlackStone] = useState(21);
  var [jumBlackCapStone, setJumBlackCapStone] = useState(1);
  var [jumWhiteStone, setJumWhiteStone] = useState(21);
  var [jumWhiteCapStone, setJumWhiteCapStone] = useState(1);

  var [maxLevel, setMaxLevel] = useState(1);
  var [brsAngkat, setBrsAngkat] = useState(-1);
  var [klmAngkat, setKlmAngkat] = useState(-1);
  var [lastBrs, setLastBrs] = useState(-1);
  var [lastKlm, setLastKlm] = useState(-1);
  var [brsDirection, setBrsDirection] = useState(-1);
  var [klmDirection, setKlmDirection] = useState(-1);
  var [stackAngkat, setStackAngkat] = useState([]);

  useEffect(() => {
  }, []);

  function onValueChange(event) { setBatu(event.target.value); }

  function findWeight(_papan) {
    var weight = 0;
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 5; j++) {
        if (_papan.arr[i][j].length > 0) {
          var t = _papan.arr[i][j].length - 1;
          if (_papan.giliran == global.BLACKTURN) {
            if (_papan.arr[i][j][t] >= global.FLATSTONE_BLACK && _papan.arr[i][j][t] <= global.CAPSTONE_BLACK) {
              weight = weight + sbe[i][j];
            }
          }
          else {
            if (_papan.arr[i][j][t] >= global.FLATSTONE_WHITE && _papan.arr[i][j][t] <= global.CAPSTONE_WHITE) {
              weight = weight + sbe[i][j];
            }
          }
        }
      }
    }
    return weight;
  }

  function copyArray(src) {
    var _arr = [];
    for (var b = 0; b < 5; b++) {
      var temparr = [];
      for (var k = 0; k < 5; k++) {

        var item = [];
        for (var t = 0; t < src[b][k].length; t++) {
          item.push(src[b][k][t]);
        }

        temparr.push(item);
      }
      _arr.push(temparr);
    }
    return _arr;
  }

  function isRightPath(arr, brs, klm, gil) {
    if (arr[brs][klm].length == 0) { return false; }
    else {
      if (gil == global.BLACKTURN) {
        if (arr[brs][klm][arr[brs][klm].length - 1] == global.FLATSTONE_BLACK || arr[brs][klm][arr[brs][klm].length - 1] == global.CAPSTONE_BLACK) { return true; }
      }
      else {
        if (arr[brs][klm][arr[brs][klm].length - 1] == global.FLATSTONE_WHITE || arr[brs][klm][arr[brs][klm].length - 1] == global.CAPSTONE_WHITE) { return true; }
      }
      return false;
    }
  }

  function nabrakTembok(arr, brs, klm, warna, trace, sisi) {
    if (sisi == "KIRI" && klm == 0 && isRightPath(arr, brs, klm, warna) == true) { return true; }
    else if (sisi == "KANAN" && klm == 4 && isRightPath(arr, brs, klm, warna) == true) { return true; }
    else if (sisi == "ATAS" && brs == 0 && isRightPath(arr, brs, klm, warna) == true) { return true; }
    else if (sisi == "BAWAH" && brs == 4 && isRightPath(arr, brs, klm, warna) == true) { return true; }
    else {
      var filter = trace.filter(item => item.brs == brs && item.klm == klm);
      if (filter.length == 0) {
        var valid = false;
        if (arr[brs][klm].length > 0) {
          if (isRightPath(arr, brs, klm, warna) == true) { valid = true; }
        }

        if (valid == true) {
          trace.push({ brs: brs, klm: klm });
          var flag = false;
          var dx = [0, 0, 1, -1];
          var dy = [1, -1, 0, 0];
          for (var i = 0; i < 4 && flag == false; i++) {
            if (brs + dy[i] >= 0 && brs + dy[i] < 5 && klm + dx[i] >= 0 && klm + dx[i] < 5) {
              flag = nabrakTembok(arr, brs + dy[i], klm + dx[i], warna, trace, sisi);
              if (flag == false) {
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

  function minimum(_level, _giliran, _papan, _result) {
    if (_level > maxLevel) {
      return findWeight(_papan);
    }
    else {
      var status = [];
      status['maxweight'] = 0;
      status['bar'] = -1;
      status['kol'] = -1;
      status['koin'] = -1;

      for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
          if (_papan.arr[i][j].length == 0)     // jika kotak tsb kondisi kosong
          {
            if (jumMelangkah < 2) {
              // hanya boleh meletakkan flatstone 

            }
            else  // jumMelangkah < 2 adlah @ player melangkah pertama kali (harus flat_stone)
            {
              var _arr = copyArray(_papan.arr);
              var koin = "";
              var _notgiliran = _giliran;
              if (_giliran == global.BLACKTURN) {
                _notgiliran = global.WHITETURN;
                koin = global.FLATSTONE_BLACK;
                _arr[i][j].push(global.FLATSTONE_BLACK);
              }
              else {
                _notgiliran = global.BLACKTURN;
                koin = global.FLATSTONE_WHITE;
                _arr[i][j].push(global.FLATSTONE_WHITE);
              }

              var weight = maksimum(_level + 1, _notgiliran, new Clsboard(_giliran, _arr), _result);
              if (weight < status['maxweight']) {
                status['maxweight'] = weight;
                status['bar'] = i;
                status['kol'] = j;
                status['koin'] = koin;
              }
            }
          }
        }
      }

      _result['maxweight'] = status['maxweight'];
      _result['bar'] = status['bar'];
      _result['kol'] = status['kol'];
      _result['koin'] = status['koin'];
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

  function maksimum(_level, _giliran, _papan, _result) {
    if (_level <= maxLevel) {
      var status = [];
      status['maxweight'] = 0;
      status['bar'] = -1;
      status['kol'] = -1;
      status['koin'] = -1;

      // probabilitas 1
      for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
          if (_papan.arr[i][j].length == 0)     // jika kotak tsb kondisi kosong
          {
            if (jumMelangkah >= 2) { }
            else  // jumMelangkah < 2 adlah @ player melangkah pertama kali (harus flat_stone)
            {
              var _arr = copyArray(_papan.arr);
              var koin = "";
              var _notgiliran = _giliran;
              if (_giliran == global.BLACKTURN) {
                _notgiliran = global.WHITETURN;
                koin = global.FLATSTONE_BLACK;
                _arr[i][j].push(global.FLATSTONE_BLACK);
              }
              else {
                _notgiliran = global.BLACKTURN;
                koin = global.FLATSTONE_WHITE;
                _arr[i][j].push(global.FLATSTONE_WHITE);
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

      // probabilitas 2
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
  
                  // ke atas
                  
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

    if (giliran == global.BLACKTURN) { setGiliran(global.WHITETURN); }
    else { setGiliran(global.BLACKTURN); }
  }

  function gantiGiliran() {
    if(jumMelangkah != 1) {
      if (giliran == global.BLACKTURN) { setGiliran(global.WHITETURN); }
      else { setGiliran(global.BLACKTURN); }  
    }
  }

  function validTaruh(parambrs, paramklm, paramgiliran) {
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

  function bukadiv(brs, klm) {
    // jumMelangkah < 2 hanya boleh flatstone 
    if (papan.arr[brs][klm].length == 0 && brsAngkat == -1) {      // jika kotak kosong
      if (giliran == global.BLACKTURN) {
        if(batu == "flatstone") {
          setJumBlackStone(jumBlackStone - 1); 
          papan.arr[brs][klm].push(global.FLATSTONE_BLACK);  
        }
        else if(batu == "wallstone") {
          setJumBlackStone(jumBlackStone - 1); 
          papan.arr[brs][klm].push(global.WALLSTONE_BLACK);  
        }
        else {
          setJumBlackCapStone(jumBlackCapStone - 1); 
          papan.arr[brs][klm].push(global.CAPSTONE_BLACK);  
          setBatu("flatstone"); 
        }
      }
      else {
        if(batu == "flatstone") {
          setJumWhiteStone(jumWhiteStone - 1); 
          papan.arr[brs][klm].push(global.FLATSTONE_WHITE);
          }
        else if(batu == "wallstone") {
          setJumWhiteStone(jumWhiteStone - 1); 
          papan.arr[brs][klm].push(global.WALLSTONE_WHITE);
        }
        else {
          setJumWhiteCapStone(jumWhiteCapStone - 1); 
          papan.arr[brs][klm].push(global.CAPSTONE_WHITE);
          setBatu("flatstone"); 
        }
      }

      // cek menang 
      var trace = [];
      trace = []; var flagKiri = nabrakTembok(papan.arr, brs, klm, giliran, trace, "KIRI");
      trace = []; var flagKanan = nabrakTembok(papan.arr, brs, klm, giliran, trace, "KANAN");
      trace = []; var flagAtas = nabrakTembok(papan.arr, brs, klm, giliran, trace, "ATAS");
      trace = []; var flagBawah = nabrakTembok(papan.arr, brs, klm, giliran, trace, "BAWAH");

      if (flagKiri == true && flagKanan == true) { alert('horizontal win'); }
      else if (flagAtas == true && flagBawah == true) { alert('vertical win'); }

      setJumMelangkah(jumMelangkah + 1);

      gantiGiliran();
    }
    else {                          // jika kotak tidak kosong
      if(brsAngkat == -1) {
        var top = papan.arr[brs][klm].length - 1;
        var topstack = papan.arr[brs][klm][top];
        if (giliran == global.BLACKTURN && (topstack == global.WALLSTONE_BLACK || topstack == global.FLATSTONE_BLACK || topstack == global.CAPSTONE_BLACK)) {
            setBrsAngkat(brs); setKlmAngkat(klm); setBrsDirection(-1); setKlmDirection(-1); setStackAngkat(papan.arr[brs][klm]);
            papan.arr[brs][klm] = []; 
        }
        else if (giliran == global.WHITETURN && (topstack == global.WALLSTONE_WHITE || topstack == global.FLATSTONE_WHITE || topstack == global.CAPSTONE_WHITE)) {
          setBrsAngkat(brs); setKlmAngkat(klm); setBrsDirection(-1); setKlmDirection(-1); setStackAngkat(papan.arr[brs][klm]);
          papan.arr[brs][klm] = []; 
      }  
      }
      else {
        if(validTaruh(brs, klm, giliran) == true) {
          var bolehTumpuk = false; 
          if(papan.arr[brs][klm].length > 0) {
            var tlen = papan.arr[brs][klm].length; 
            if(papan.arr[brs][klm][tlen - 1] == global.WALLSTONE_BLACK || papan.arr[brs][klm][tlen - 1] == global.WALLSTONE_WHITE)
            { bolehTumpuk = false; 
              if(topstack == global.CAPSTONE_BLACK || topstack == global.CAPSTONE_WHITE) {
                bolehTumpuk = true; 
              }
            }
            else if(papan.arr[brs][klm][tlen - 1] == global.CAPSTONE_BLACK || papan.arr[brs][klm][tlen - 1] == global.CAPSTONE_WHITE)
            { bolehTumpuk = false; }
            else 
            { bolehTumpuk = true; }
          }
          else { bolehTumpuk = true; }

          if(bolehTumpuk == true) {
            if(papan.arr[brs][klm].length > 0) {
              var tlen = papan.arr[brs][klm].length; 
              if(papan.arr[brs][klm][tlen - 1] == global.WALLSTONE_BLACK) { papan.arr[brs][klm][tlen - 1] = global.FLATSTONE_BLACK; }
              if(papan.arr[brs][klm][tlen - 1] == global.WALLSTONE_WHITE) { papan.arr[brs][klm][tlen - 1] = global.FLATSTONE_WHITE; }
            }
            papan.arr[brs][klm].push(stackAngkat[0]);
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
              }
              else {
                setLastBrs(brs); 
                setLastKlm(klm);                
              }
            }  
          }
        }
        else { console.log("wrong"); }
      }
    }
  }

  function sideBar() {
    return <div className='card' style={{ width: '100px', height: '80px', borderRadius: '2px', backgroundColor: '#00AAFF', boxSizing: 'border-box', padding: '1px', margin: '1px' }} key='sidebar'>
      <table style={{ width: '100%' }}>
        {stackAngkat.slice().reverse().map((revnode, indexitem) => (
          <>
            {
              <tr style={{ width: '100%' }}>
                <td style={{ width: '100%' }}>
                  {revnode == global.FLATSTONE_BLACK && <div style={{ width: '100%', height: '10px', color: 'white', backgroundColor: 'black', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}></div>}
                  {revnode == global.FLATSTONE_WHITE && <div style={{ width: '100%', height: '10px', color: 'white', backgroundColor: 'red', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                  {revnode == global.WALLSTONE_BLACK && <div style={{ width: '10%', marginLeft: '45%', height: '30px', color: 'white', backgroundColor: 'black', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                  {revnode == global.WALLSTONE_WHITE && <div style={{ width: '10%', marginLeft: '45%', height: '30px', color: 'red', backgroundColor: 'red', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                  {revnode == global.CAPSTONE_BLACK && <div style={{ width: '20%', marginLeft: '40%', height: '20px', color: 'red', backgroundColor: 'black', borderRadius: '10px', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                  {revnode == global.CAPSTONE_WHITE && <div style={{ width: '20%', marginLeft: '40%', height: '20px', color: 'red', backgroundColor: 'red', borderRadius: '10px', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                </td>
              </tr>
            }
          </>
        ))}
      </table>
    </div>
  }

  function Kotak1(indexbar, indexkol, node) {
    return <div onClick={() => bukadiv(indexbar, indexkol)} className='card' style={{ width: '100px', height: '80px', borderRadius: '2px', backgroundColor: '#00AAFF', boxSizing: 'border-box', padding: '1px', margin: '1px' }} key={indexbar + indexkol}>
      <table style={{ width: '100%' }}>
        {node.slice().reverse().map((revnode, indexitem) => (
          <>
            {
              <tr style={{ width: '100%' }}>
                <td style={{ width: '100%' }}>
                  {revnode == global.FLATSTONE_BLACK && <div style={{ width: '100%', height: '10px', color: 'white', backgroundColor: 'black', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}></div>}
                  {revnode == global.FLATSTONE_WHITE && <div style={{ width: '100%', height: '10px', color: 'white', backgroundColor: 'red', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                  {revnode == global.WALLSTONE_BLACK && <div style={{ width: '10%', marginLeft: '45%', height: '30px', color: 'white', backgroundColor: 'black', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                  {revnode == global.WALLSTONE_WHITE && <div style={{ width: '10%', marginLeft: '45%', height: '30px', color: 'red', backgroundColor: 'red', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                  {revnode == global.CAPSTONE_BLACK && <div style={{ width: '20%', marginLeft: '40%', height: '20px', color: 'red', backgroundColor: 'black', borderRadius: '10px', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                  {revnode == global.CAPSTONE_WHITE && <div style={{ width: '20%', marginLeft: '40%', height: '20px', color: 'red', backgroundColor: 'red', borderRadius: '10px', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                </td>
              </tr>
            }
          </>
        ))}
      </table>
    </div>
  }

  function Kotak2(indexbar, indexkol, node) {
    return <div onClick={() => bukadiv(indexbar, indexkol)} className='card' style={{ width: '100px', height: '80px', borderRadius: '2px', backgroundColor: '#00FFFF', boxSizing: 'border-box', padding: '1px', margin: '1px' }} key={indexbar + indexkol}>
      <table style={{ width: '100%' }}>
        {node.slice().reverse().map((revnode, indexitem) => (
          <>
            {
              <tr style={{ width: '100%' }}>
                <td style={{ width: '100%' }}>  
                  {revnode == global.FLATSTONE_BLACK && <div style={{ width: '100%', height: '10px', color: 'white', backgroundColor: 'black', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}></div>}
                  {revnode == global.FLATSTONE_WHITE && <div style={{ width: '100%', height: '10px', color: 'white', backgroundColor: 'red', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                  {revnode == global.WALLSTONE_BLACK && <div style={{ width: '10%', marginLeft: '45%', height: '30px', color: 'white', backgroundColor: 'black', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                  {revnode == global.WALLSTONE_WHITE && <div style={{ width: '10%', marginLeft: '45%', height: '30px', color: 'red', backgroundColor: 'red', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                  {revnode == global.CAPSTONE_BLACK && <div style={{ width: '20%', marginLeft: '40%', height: '20px', color: 'red', backgroundColor: 'black', borderRadius: '10px', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                  {revnode == global.CAPSTONE_WHITE && <div style={{ width: '20%', marginLeft: '40%', height: '20px', color: 'red', backgroundColor: 'red', borderRadius: '10px', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
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
      <h4>Playtak</h4>
      <h5>Giliran : { giliran == 1 ? "Hitam" : "Merah" }</h5>
      { giliran == global.BLACKTURN && 
        <>
          <label><input type="radio" value="flatstone" checked={batu === "flatstone"} onChange={onValueChange} />FlatStone ({ jumBlackStone })</label>
          { jumMelangkah >= 2 && <label><input type="radio" value="wallstone" checked={batu === "wallstone"} onChange={onValueChange} />WallStone</label> }
          { jumMelangkah >= 2 && jumBlackCapStone > 0 && <label><input type="radio" value="capstone" checked={batu === "capstone"} onChange={onValueChange} />CapStone ({ jumBlackCapStone })</label> }
          <br /><br />
        </>
      }
      { giliran == global.WHITETURN && 
        <>
          <label><input type="radio" value="flatstone" checked={batu === "flatstone"} onChange={onValueChange} />FlatStone ({ jumWhiteStone })</label>
          { jumMelangkah >= 2 && <label><input type="radio" value="wallstone" checked={batu === "wallstone"} onChange={onValueChange} />WallStone</label> }
          { jumMelangkah >= 2 && jumWhiteCapStone > 0 && <label><input type="radio" value="capstone" checked={batu === "capstone"} onChange={onValueChange} />CapStone ({ jumWhiteCapStone })</label> }
          <br /><br />
        </>
      }
      <input type='button' onClick={() => runAI()} value="Run AI" /><br /><br />
      <table border='0'>
        <tr>
          <td valign='top'>{sideBar()}</td>
          <td>
            <table border='1'>
              {
                papan.arr.map((item, indexbar) => (
                  <tr>
                    {
                      item.map((node, indexkol) => (
                        <td>
                          {(indexbar == brsAngkat && indexkol == klmAngkat) ? Kotak1(indexbar, indexkol, node) : Kotak2(indexbar, indexkol, node)}
                        </td>
                      ))
                    }
                  </tr>
                ))}
            </table>
          </td>
        </tr>
      </table>
    </>
  )
}

export default App
