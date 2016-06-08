var simulacion;

function createSimulacion() {
    var simulacion = null;
    var canvas = Canvas(document.getElementById('myCanvas') , window.innerWidth, window.innerHeight - 150);
    var onda = Onda(100, 1, 0);
    simulacion = Graph(canvas, onda);
    simulacion.setParam(0, canvas.getCanvas().height / 2 , 1, 1, 2, 'red');
    return simulacion;
}

$(document).ready(function (){
    setInterval(function(){
        amplitud = parseFloat($('#ctr_amplitud').val());
        frecuencia = parseFloat($('#ctr_frecuencia').val());
        fase = parseFloat($('input[name=fase]:checked').val());
        periodos = parseFloat($('#ctr_periodos').val());
        velocidad = parseFloat($('#ctr_velocidad').val());
        
        if(simulacion){
            simulacion.Ionda().set(amplitud, frecuencia, fase);
            simulacion.setVelocidad(velocidad);
            simulacion.setNumPeriodos(periodos);
        }
        else {
            simulacion = createSimulacion();
        }
       
        $('#info_amplitud').html(((simulacion.Ionda().getAmplitud() / parseFloat($('#ctr_amplitud')[0].max)) * 100).toFixed(2) + "%");
        $('#info_frecuencia').html(((simulacion.Ionda().getFrecuencia() / parseFloat($('#ctr_frecuencia')[0].max)) * 100).toFixed(2) + "%");
        $('#info_fase').html(((simulacion.Ionda().getDesface() / 360) * 100).toFixed(2) + "%");
        $('#inf_freAng').html(simulacion.Ionda().getAngularFrecuencia().toFixed(2));
        $('#info_periodo').html(simulacion.Ionda().getPeriodo().toFixed(4));
        
        $('#porc_amp')[0].style.width = $('#info_amplitud').html();
        $('#porc_fre')[0].style.width = $('#info_frecuencia').html();
        $('#porc_fase')[0].style.width = $('#info_fase').html();
        
    }, 100);
});
