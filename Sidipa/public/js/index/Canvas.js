/*
* Modulo Manejo Canvas
*/
var Canvas = ( function(canvas_element,ancho,alto){
  /*
  * Variables
  */
  var _canvas;
  var _context2D;

  /*
  * Metodos y funciones
  */
  var _createRectangulo = function(x,y,ancho,alto,color){
    _context2D.fillStyle = color;
    _context2D.fillRect(x, y, ancho,alto);
  };

  var _createLine = function(xi,yi,xf,yf, ancho, color){
    _context2D.beginPath();    
    _context2D.moveTo(xi,yi);
    _context2D.lineTo(xf,yf);
    _context2D.strokeStyle = color;
    _context2D.lineWidth = ancho;
    _context2D.stroke();
  };

  var _createCircle = function(x,y,r,ancho,color){
    _context2D.beginPath();    
    _context2D.arc(x,y,r,ancho,2*Math.PI);
    _context2D.lineTo(xf,yf);
    _context2D.strokeStyle = color;
    _context2D.lineWidth = ancho;
    _context2D.closePath();
    _context2D.stroke();
  };

  var _clearLienzo = function(x,y,ancho,alto){
    _context2D.clearRect(x, y, ancho, alto);
  }; 

  var _createText = function(font, tamaño, text, x, y, color){
    font = tamaño.toString() + "px "+ font ;
    _context2D.fillStyle  = color;
    _context2D.font = font;
    _context2D.fillText(text,x, y+tamaño);
  };

   var __construct = function(canvas_element,ancho,alto){
    if(canvas_element.tagName  == "CANVAS" && canvas_element.ELEMENT_NODE){ 
      _canvas = canvas_element;
      _context2D = canvas_element.getContext('2d');
      _canvas.width = ancho;
      _canvas.height = alto;
      
      return{
        rectangulo: _createRectangulo,
        line: _createLine,
        circle: _createCircle,
        clear: _clearLienzo,
        text: _createText,
        setCanvas: __construct,
        getCanvas : function(){ return _canvas},
        getContext : function(){ return _context2D},
      }
    }
    else{
      return null;
      console.error('Se Han Ingresado Parametros Incorrectos');
    }
  };

  /*
  * Inicializamos El Modulo
  */
   return __construct(canvas_element,ancho,alto);
});
