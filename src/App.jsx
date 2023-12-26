import { useState, useEffect } from 'react'
import global from './Global'
import { Clsboard } from './Clsboard'

function App() {
  var [sbe, setSBE] = useState([
                                [0,   0,  0,  0,  0],
                                [0,   80, 90, 80, 0],
                                [0,   90, 100,90, 0],
                                [0,   80, 90, 80, 0],
                                [0,   0,  0,  0,  0]
                              ]);
  var [papan, setPapan] = useState(
                              new Clsboard(global.BLACKTURN, [
                                [[], [], [], [], []],
                                [[], [], [], [], []],
                                [[], [], [], [], []],
                                [[], [], [], [], []],
                                [[], [], [], [], []],
                              ])
                          );
  var [batu, setBatu] = useState(global.flat);
  var [giliran, setGiliran] = useState(global.BLACKTURN);
  var [jumMelangkah, setJumMelangkah] = useState(0);
  var [maxLevel, setMaxLevel] = useState(1);

  useEffect(() => {
  }, []);

  function findWeight(_papan) {
    var weight = 0;   
    for(var i = 0; i < 5; i++) {
      for(var j = 0; j < 5; j++) {
        if(_papan.arr[i][j].length > 0) {
          var t = _papan.arr[i][j].length - 1; 
          if(_papan.giliran == global.BLACKTURN) {
            if(_papan.arr[i][j][t] <= 13) {
              weight = weight + sbe[i][j]; 
            }    
          }
          else {
            if(_papan.arr[i][j][t] >= 21 && _papan.arr[i][j][t] <= 23) {
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

  function nabrakTembok(arr, brs, klm, warna, trace, sisi) {
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
              flag = nabrakTembok(arr, brs + dy[i], klm + dx[i], warna, trace, sisi);
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

  function minimum(_level, _giliran, _papan, _result) {
    if(_level > maxLevel) {
      return findWeight(_papan);
    }
    else {
      var status = []; 
      status['maxweight'] = 0;
      status['bar'] = -1;
      status['kol'] = -1;
      status['koin'] = -1;

      for(var i = 0; i < 5; i++)
      {
        for(var j = 0; j < 5; j++)
        {
          if(_papan.arr[i][j].length == 0)     // jika kotak tsb kondisi kosong
          {
            if (jumMelangkah >= 2)  {}
            else  // jumMelangkah < 2 adlah @ player melangkah pertama kali (harus flat_stone)
            {
              var _arr = copyArray(_papan.arr);
              var koin = ""; 
              var _notgiliran = _giliran;
              if(_giliran == global.BLACKTURN) {
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
              if(weight < status['maxweight']) {
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

  function maksimum(_level, _giliran, _papan, _result) {
    if(_level <= maxLevel) {
      var status = []; 
      status['maxweight'] = 0;
      status['bar'] = -1;
      status['kol'] = -1;
      status['koin'] = -1;

      for(var i = 0; i < 5; i++)
      {
        for(var j = 0; j < 5; j++)
        {
          if(_papan.arr[i][j].length == 0)     // jika kotak tsb kondisi kosong
          {
            if (jumMelangkah >= 2)  {}
            else  // jumMelangkah < 2 adlah @ player melangkah pertama kali (harus flat_stone)
            {
              var _arr = copyArray(_papan.arr);
              var koin = ""; 
              var _notgiliran = _giliran;
              if(_giliran == global.BLACKTURN) {
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
              if(weight > status['maxweight']) {
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

    if(giliran == global.BLACKTURN) { setGiliran(global.WHITETURN); }
    else { setGiliran(global.BLACKTURN); }
  }

  function gantiGiliran() {
    if(giliran == global.BLACKTURN) { setGiliran(global.WHITETURN); }
    else { setGiliran(global.BLACKTURN); }
  }

  function bukadiv(brs, klm) {
    if(giliran == global.BLACKTURN) {
      papan.arr[brs][klm].push(global.FLATSTONE_BLACK);
    }
    else {
      papan.arr[brs][klm].push(global.FLATSTONE_WHITE);
    }
    
    // cek menang 
    var trace = []; 
    trace = [];  var flagKiri = nabrakTembok(papan.arr, brs, klm, giliran, trace, "KIRI");
    trace = [];  var flagKanan = nabrakTembok(papan.arr, brs, klm, giliran, trace, "KANAN");
    trace = [];  var flagAtas = nabrakTembok(papan.arr, brs, klm, giliran, trace, "ATAS");
    trace = [];  var flagBawah = nabrakTembok(papan.arr, brs, klm, giliran, trace, "BAWAH");

    if(flagKiri == true && flagKanan == true) { alert('horizontal win'); }
    else if(flagAtas == true && flagBawah == true) { alert('vertical win'); }
    
    gantiGiliran(); 
  }

  return (
    <>
      <h4>Playtak</h4>
      <h5>Giliran : { giliran }</h5>
      <input type='button' onClick={() => runAI() } value="Run AI" /><br /><br />
      <table border='1'>
      {papan.arr.map((item, indexbar) => (
          <tr key={indexbar}>
          {
            item.map((node, indexkol) => (
              <td key={indexkol}>
                <div onClick={() => bukadiv(indexbar, indexkol)} className="card" style={{width: '100px', height: '80px', borderRadius: '2px', backgroundColor: '#00FFFF', boxSizing: 'border-box', padding: '1px', margin: '1px'}} key={indexbar + indexkol}>
                  <table style={{width: '100%'}}>
                  {
                    node.slice().reverse().map((node, indexitem) => (
                      <>
                        {
                        <tr style={{width: '100%'}}>
                          <td style={{width: '100%'}}>
                            { node == global.FLATSTONE_BLACK && 
                              <div style={{width: '100%', height: '10px', color: 'white', backgroundColor: 'black', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px'}}>
                              </div>
                            }
                            { node == global.FLATSTONE_WHITE && 
                              <div style={{width: '100%', height: '10px', color: 'white', backgroundColor: 'red', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px'}}>
                              </div>
                            }
                            { node == global.WALLSTONE_BLACK && 
                              <div style={{width: '10%', marginLeft: '45%', height: '30px', color: 'white', backgroundColor: 'black', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px'}}>
                              </div>
                            }
                            { node == global.WALLSTONE_WHITE && 
                              <div style={{width: '10%', marginLeft: '45%', height: '30px', color: 'red', backgroundColor: 'black', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px'}}>
                              </div>
                            }
                            { node == global.CAPSTONE_BLACK && 
                              <div style={{width: '20%', marginLeft: '40%', height: '20px', color: 'red', backgroundColor: 'black', borderRadius: '10px', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px'}}>
                              </div>
                            }
                          </td>
                        </tr>
                        }
                      </>
                    ))
                  }
                  </table>
                </div>
              </td>
            ))
          }
          </tr>
      ))}
      </table>
    </>
  )}

export default App