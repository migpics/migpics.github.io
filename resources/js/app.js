String.prototype.format = 
    String.prototype.f = 
        function() 
        {
            var s = this,
                i = arguments.length;

            while (i--) 
            {
                s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
            }
            
            return s;
        };

$(document).ready(
    function()
    {
        // Set up!
        var a_canvas = document.getElementById("a");
        var context = a_canvas.getContext("2d");

        // Start Slider Code

        var canvas_width = 400;
        var canvas_height = 200;

        var myAngle = 360;
        var lineDistance = 1;
        var angleChange = 360;
        var myIterations = 36;
        var myCompletionAngle = 360;

        var myGCode = new Array();

        context.strokeStyle = "#ffcc00";
        
        var controlTemplate = 
            $('#inputControlTemplate').html();
        
        Mustache.parse(
            controlTemplate);
        
        // Initialize the list of "variables."
        var variables = 
            [
                { name: 'clipAngle', label: 'Clip Angle', value: 80 },
                { name: 'iterations', label: 'Iterations', value: 52 },
                { name: 'angle2', label: 'Angle 2', value: 21 },
                { name: 'size', label: 'Size', value: 52 },
                { name: 'angle1', label: 'Angle 1', value: 40 },
                { name: 'yAxis', label: 'Y Axis', value: 40 },
                { name: 'xAxis', label: 'X Axis', value: 50 }
            ];
        
        function draw(startX, startY, myAngle, lineDistance, angleChange, myIterations, myCompletionAngle) 
        {
            myGCode = new Array();
            context.clearRect(0, 0, a_canvas.width, a_canvas.height);
            context.beginPath();
            context.moveTo(startX, startY);

            var newX = 0;
            var newY = 0;

            for (var j = 0; j < myIterations; j++) 
            {
                myAngle = myAngle + angleChange;

                for (var i = 0; i < myCompletionAngle; i++) 
                {
                    context.gobalAlpha = 0.1;
                    context.lineTo(
                        startX + lineDistance * (Math.cos(Math.PI * (myAngle + i) / 180)), 
                        (startY + lineDistance * (Math.sin(Math.PI * (myAngle + i) / 180))));

                    startX = (startX + lineDistance * (Math.cos(Math.PI * (myAngle + i) / 180)));
                    startY = (startY + lineDistance * (Math.sin(Math.PI * (myAngle + i) / 180)));

                    myGCode.push(
                        'G00 X{0} Y{1};'.format(
                            Math.round(startX * 100) / 100,
                            Math.round(startY * 100) / 100));
                }
            }
            
            context.gobalAlpha = 0.1;
            context.lineWidth = 2;
            context.stroke();
        }
        
        function getSliderValue(id)
        {
            return $('#{0}'.format(id)).slider('getValue') / 100;
        }
        
        function updateSpiral()
        {
            draw(
                canvas_width * getSliderValue('xAxis'), 
                canvas_height * getSliderValue('yAxis'), 
                myAngle * getSliderValue('angle1'), 
                lineDistance * getSliderValue('size'), 
                angleChange * getSliderValue('angle2'), 
                myIterations * getSliderValue('iterations'), 
                myCompletionAngle * getSliderValue('clipAngle'));
        }
        
        function generateGCode() 
        { 
          var preCode = ["G21;  Set Units to MM", "G1 F7600;  Set Speed", "M107; Pump Off", "M84; Motors off", 
                       "G28; Home All Axis", myGCode[0] + "M106; Pump On" ]; 
         
           var drawingCode = preCode.concat(myGCode).join('\n\n'); 
          
           var endCode = ["M107; Pump Off" , "G28; Home All Axis"];
          
           var finalCode = drawingCode.concat(endCode);
            
            download(

                'Pancake_Spiral.GCODE', 
                finalCode); 
        } 
        
        function generatePBP() 
        { 
          var preCode = ["G21;  Set Units to MM\n", "G1 F7600;  Set Speed\n", "M107; Pump Off\n", "M84; Motors off\n", 
                       "G28; Home All Axis\n", myGCode[0] + '\n', "M106; Pump On\n" ]; 
         
           var drawingCode = preCode.concat(myGCode).join('\n\n'); 
          
           var endCode = ["M107; Pump Off" , "G28; Home All Axis"];
          
           var finalCode = drawingCode.concat(endCode);
            
            download(

                'Pancake_Spiral.GCODE', 
                finalCode); 
        } 
        
         function download(filename, pbpCode) 
        { 
            var element = 
                document.createElement('a'); 

            element.setAttribute(
                'href', 
                'data:text/plain;charset=utf-8,{0}'.format(
                    encodeURIComponent(
                        pbpCode))); 
            
            element.setAttribute(
                'download', 
                filename); 
            element.style.display = 
                'none'; 
            
            document.body.appendChild(
                element); 
            element.click(); 
            
            document.body.removeChild(
                element); 
        }
        
        function download(filename, gcode) 
        { 
            var element = 
                document.createElement('a'); 

            element.setAttribute(
                'href', 
                'data:text/plain;charset=utf-8,{0}'.format(
                    encodeURIComponent(
                        gcode))); 
            
            element.setAttribute(
                'download', 
                filename); 
            element.style.display = 
                'none'; 
            
            document.body.appendChild(
                element); 
            element.click(); 
            
            document.body.removeChild(
                element); 
        }
        
        // Write out all input control HTML.
        $('#inputControls').html(
            Mustache.render(
                controlTemplate, 
                variables));

        // Wire-up input controls as sliders.
        variables.forEach(
            function(elt, i) 
            {
                $('#{0}'.format(elt.name)).slider(
                    {
                        min: 0, 
                        max: 100, 
                        value: elt.value, 
                        labelledby: 
                            '{0}-label'.format(
                                elt.name)
                    });
            });
        
        // Redraw when there are changes to any slider.
        $('input.slider').change(
            function()
            {
                updateSpiral();
            });

        // gcode button click event handler
        $('button.GC').click(
            generateGCode);
        
        //pbp button click event handler
        $('button.PP').click(
            generatePBP);

        // Draw the initial spiral.
        updateSpiral();
    });
