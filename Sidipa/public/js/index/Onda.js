"use strict";

/*
* Modulo Onda
*/
var Onda = (function(amplitud, frecuencia, desface) {
    /*Variables Privadas*/
    var _amplitud;
    var _frecuencia;
    var _desface;
    
    /* Funciones Y Metodos*/
    var _setAmplitud = function (amplitud) {
      (typeof  amplitud ==  "number") ? _amplitud = amplitud  : console.error("Tipo de Dato Invalido : Ingrese un Numero") ;
    };

    var _setFrecuencia = function (frecuencia) {
      (typeof  frecuencia ==  "number") ? _frecuencia = frecuencia : console.error("Tipo de Dato Invalido : Ingrese un Numero");
    };

    var _setDesface = function (desface) {
      (typeof  desface ==  "number") ? _desface =desface * Math.PI/180 : console.error("Tipo de Dato Invalido : Ingrese un Numero"); 
    };

    var _setAngularFrecuencia = function (frecuencia_angular) {
      (typeof  frecuencia_angular ==  "number") ? _frecuencia = frecuencia_angular / 2 * Math.PI  : console.error("Tipo de Dato Invalido : Ingrese un Numero"); return 0;
    };

    var _setPeriodo = function (periodo) {
      (typeof  periodo ==  "number") ? _frecuencia = 1 / periodo  : console.error("Tipo de Dato Invalido : Ingrese un Numero"); 
    };
    
    var _getAmplitud = function () {
      return _amplitud;   
    };

    var _getFrecuencia = function () {
      return _frecuencia;
    };
    
    var _getDesface = function () {
      return _desface * 180/Math.PI;
    };

    var _getAngularFrecuencia = function () {
      return 2 * Math.PI * _frecuencia;
    };

    var _getPeriodo = function () {
      return 1 / _frecuencia;
    };

    var _getFuntionForWindows = function (y, x , width_windows , num_peridos_windows) {
     var y = y - _amplitud * Math.sin( _getAngularFrecuencia() * x / (width_windows /num_peridos_windows) + _desface);
     return {'x':x , 'y': y};
   };
    
    var _getFuntionForTime= function (tiempo) {
        var w = _getAngularFrecuencia();
        var y = _amplitud * Math.trunc(Math.sin( w * tiempo/w + _desface));
        return {'x':tiempo ,'y': y};
    };

    var __construct = function(amplitud, frecuencia, desface){
      if(typeof  amplitud ==  "number" && typeof  frecuencia ==  "number" && typeof  desface ==  "number"){
        _setAmplitud(amplitud);
        _setFrecuencia(frecuencia);
        _setDesface(desface);

        return{
          setAmplitud: _setAmplitud,
          setFrecuencia: _setFrecuencia,
          setDesface:_setDesface,
          setAngularFrecuencia:_setAngularFrecuencia,
          setPeriodo:_setPeriodo,
          getAmplitud:_getAmplitud,
          getFrecuencia:_getFrecuencia,
          getDesface:_getDesface,
          getAngularFrecuencia:_getAngularFrecuencia,
          getPeriodo:_getPeriodo,
          getFuntionForWindows:_getFuntionForWindows,
          getFuntionForTime:_getFuntionForTime,
          set:__construct
        }
      }
      else{
        console.error("Se Han Ingresado Parametros Incorrectos");
        return null;
      }
    };

    /*Inicializamos El Modulo*/
    return __construct(amplitud, frecuencia, desface);
});
