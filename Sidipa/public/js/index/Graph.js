/*
* Modulo Graficardor
*/
var Graph = (function (Canvas, Onda){
  var _Onda = Onda;
  var _Param = {'init':{'xi':0, 'yi':0},
                'i':0,'xi':0, 'yi':0, 'velocidad':1, 'num_periodos':1, 'grosor_linea':2, 'color_linea':'red'
              };
  var _running = false;
  var _finish = false;
    
  var _createPlano = function (){
    var canvas = Canvas.getCanvas();
    Canvas.rectangulo(0,0,canvas.width,canvas.height,"white");
     /*Linea Horizontal*/
    Canvas.line(0,canvas.height/2, canvas.width, canvas.height/2, 2, 'green');
      /*Texto vertical*/
    Canvas.text("Georgia",20, 0,0 , canvas.height/2,"red");

    _setLinesHorizontal(canvas);
    _setLinesVertical(canvas);
  };

  _getPosicion = function(i){
      if(i==0){
          return "0";
      }
      else if(i%2 == 0 && i/2 == 1){
          return "π";
      }
      else if(i%2 != 0 && i == 1){
          return "π/2";
      }
      else if(i%2 != 0 && i/2 != 1){
          return i.toString() + "π/2";
      }
      else if(i%2 == 0 && i/2 != 1){
          return (i/2).toString() + "π";
      }
  }

  var _setLinesHorizontal = function(canvas)  {
      var max = canvas.height /2;
      var min = canvas.height /2;
      for (var i = 0; i<canvas.width;i++ ){
          var amplitudWindow = Onda.getFuntionForWindows(canvas.height /2,i,canvas.width,_Param.num_periodos).y ;

          if(max < amplitudWindow){
              max = amplitudWindow;
          }
          if(min> amplitudWindow){
              min = amplitudWindow;
          }
      }
      aux =Onda.getAmplitud();
      /*Linea Horizontal Mayor*/
      Canvas.line(0,max, canvas.width, max, 2, 'green');
      /*Texto vertical*/
      Canvas.text("Georgia",20,- aux, 0, max,"red");
      /*Linea Horizontal Menor*/
      Canvas.line(0,min, canvas.width, min, 2, 'green');
      /*Texto vertical*/
      Canvas.text("Georgia",20, aux, 0, min,"red");
  }

  var _setLinesVertical = function(canvas){
      var distanciaX = Math.round(canvas.width / (_Param.num_periodos * 4)) ;
      var numLines = _Param.num_periodos * 4;
      var posActual = 0;

      for (var i = 0; i <= numLines; i++) {
          var aux = _getPosicion(i);

          /*Linea Vertical*/
          Canvas.line(posActual,0, posActual, canvas.height,2,'green');
          /*Texto Horizontal*/
          Canvas.text("Georgia",20, aux,posActual-20,canvas.height/2,"red");

          posActual += distanciaX;
      }
  }
   
  _createPlano();
 
  var _printOnda = function(callback){ 
    var canvas = Canvas.getCanvas();
    if (_Param.i < canvas.width) {
      for(var e=0;e< 2001-_Param.velocidad ;e++){
        var x = _Param.i;
        var y = Onda.getFuntionForWindows(canvas.height/2, x, canvas.width,_Param.num_periodos).y;
        Canvas.line(_Param.xi, _Param.yi, x, y, _Param.grosor_linea, _Param.color_linea);
        _Param.xi = x ;
        _Param.yi = y ;
      }
      _Param.i++;
    }
    else{
      _Param.xi = _Param.init.xi;
      _Param.yi = _Param.init.yi;
      _Param.i=0;
      Canvas.clear(0,0,canvas.width,canvas.height,"white");
      _createPlano();
      (_finish) ? _finish(true) : null; 
    }
  };

  var _setXi = function(xi){
      _Param.init.xi = parseInt(xi);
      _Param.xi = parseInt(xi);
  };
  
  var _setYi = function(yi){
      _Param.init.yi = parseInt(yi);
      _Param.yi = parseInt(yi);
  };

  var _setVelocidad = function(velocidad){
      _Param.velocidad = parseInt(velocidad);
  };
  
  var _setNumPeriodos = function(periodos){
      _Param.num_periodos = parseInt(periodos);
  };

  var _setGrosor = function(grosor_linea){
      _Param.grosor_linea = parseInt(grosor_linea);
  };

  var _setColor = function(color_linea){
       _Param.color_linea = color_linea.toString();
  };

  var _ParamsGraph = function(xi, yi,velocidad, num_periodos, grosor_linea, color_linea){
    _setXi(xi);
    _setYi(yi);
    _setVelocidad(velocidad);
    _setNumPeriodos(num_periodos);
    _setGrosor(grosor_linea);
    _setColor(color_linea);
  }

  function _render(){
       $('#ctr_amplitud').val(Onda.getAmplitud());
       $('#ctr_frecuencia').val(Onda.getFrecuencia());
       $('#ctr_periodos').val(_Param.num_periodos);
       $('#ctr_velocidad').val(_Param.velocidad);
       $('#ctr_amplitud_label').html('Amplitud Maxima: '+Onda.getAmplitud());
       $('#ctr_frecuencia_label').html('Frecuencia de Onda: '+Onda.getFrecuencia());
       $('#ctr_velocidad_label').html('Velocidad Renderizado: '+ _Param.velocidad);
       $('#ctr_periodos_label').html('Periodos Por Pantalla: '+ _Param.num_periodos);

        var fase = Onda.getDesface();
        var inputs = $('input[name=fase]');
        for(index in  inputs){
            if(inputs[index].value == fase){
                inputs[index].checked=true;
            }
        }


  }
    
  var _run = function (){
    _running = setInterval(function(){ //refresco
        _printOnda();
    }, 1);
  }

  var _stop = function() {
      (_running) ? clearInterval(_running) : null;
  }

  var _getState = function(){
    var canvas = Canvas.getCanvas();
    return {
        onda:{amplitud:Onda.getAmplitud(),frecuencia:Onda.getFrecuencia(),fase:Onda.getDesface()},
        param: { 'velocidad':_Param.velocidad, 'num_periodos':_Param.num_periodos, 'grosor_linea':_Param.grosor_linea, 'color_linea':_Param.color_linea
        }}
  }

  var _setState = function(state){
      Onda.setAmplitud(state.onda.amplitud);
      Onda.setFrecuencia(state.onda.frecuencia);
      Onda.setDesface(state.onda.fase);
      _Param.velocidad = state.param.velocidad;
      _Param.num_periodos= state.param.num_periodos;
      _Param.grosor_linea = state.param.grosor_linea;
      _Param.color_linea = state.param.color_linea;
      _render();
  }

  return{
    setParam : _ParamsGraph,
    setXi: _setXi,
    setYi: _setYi,
    setVelocidad: _setVelocidad,
    setNumPeriodos: _setNumPeriodos,
    setGrosor: _setGrosor,
    setColor: _setColor,
    Ionda: function(){ return _Onda },
    getParam:function(){return _Param},
    run: function(){ _run()},
    stop: function(){ _stop()},
    clean: function () { _createPlano() },
    reset: function () { _Param.i = 0;},
    getContext: function(){ return _getState()},
    setContext: function(context){ _setState(context)},
    onfinish: function(action){ if (typeof action === "function" || action === false) { _finish = action;} return _finish; }
  }

});
