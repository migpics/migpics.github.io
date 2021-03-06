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
        var lineDistance = 10;
        var angleChange = 360;
        var myIterations = 36;
        var myCompletionAngle = 90;
      
     

        var myGCode = new Array();
        var myPBPCode = new Array();

        context.strokeStyle = "#ffcc00";
        
        var controlTemplate = 
            $('#inputControlTemplate').html();
        
        Mustache.parse(
            controlTemplate);
        
        // Initialize the list of "variables."
        var variables = 
            [
                { name: 'clipAngle', label: 'Clip Angles', value: 18 },
                { name: 'iterations', label: 'Iterations', value: 54 },
                { name: 'angle2', label: 'Angle 2', value: 35 },
                { name: 'size', label: 'Size', value: 71},
                { name: 'angle1', label: 'Angle 1', value: 62 },
                { name: 'yAxis', label: 'Y Axis', value: 34 },
                { name: 'xAxis', label: 'X Axis', value: 34 }
            ];
        
        function draw(startX, startY, myAngle, lineDistance, angleChange, myIterations, myCompletionAngle) 
        {
            myGCode = new Array();
            myPBPCode = new Array();
            context.clearRect(0, 0, a_canvas.width, a_canvas.height);
            context.beginPath();
            context.moveTo(startX, startY);

            var newX = 0;
            var newY = 0;

            for (var j = 0; j < myIterations; j++) 
            {
                myAngle = myAngle + angleChange;

                //This loop moves the head one step and then tracks the coordinates.  By implementing i+=5, we can then control the resolution.
                for (var i = 0; i < myCompletionAngle; i+=1) 
                {
                    context.globalAlpha = 0.1;
                    context.lineTo(
                        startX + lineDistance * (Math.cos(Math.PI * (myAngle + i) / 180)), 
                        (startY + lineDistance * (Math.sin(Math.PI * (myAngle + i) / 180))));

                    startX = (startX + lineDistance * (Math.cos(Math.PI * (myAngle + i) / 180)));
                    startY = (startY + lineDistance * (Math.sin(Math.PI * (myAngle + i) / 180)));

                    myGCode.push(
                        'G00 X{0} Y{1};'.format(
                            Math.round(startX * 100) / 100,
                            Math.round(startY * 100) / 100));
                    
                    myPBPCode.push(
                        '[{0},{1}],'.format(
                            Math.round(startX * 100) / 100,
                            Math.round(startY * 100) / 100));
                }
            }
            
            context.globalAlpha = 0.5;
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
        
        
        
        //Generates the GCODE file
        //Please note, this is not the best way to do this.  Adding string information can be done best with by using JSON.
        //That code will come soon.
        
        function generateGCode() 
        { 
          var preCode = [";Pancake Spiral Generator v 0.1 GCODE Header Start","G21;  Set Units to MM", "G1 F7600;  Set Speed", "M107; Pump Off", "M84; Motors off", 
                       "G28; Home All Axis", myGCode[0] + '\n', "M106; Pump On\n","G4 P750 ;Pause for 750 milliseconds\n" ]; //This string is the start of the GCODE file
         
           var drawingCode = preCode.concat(myGCode).join('\n'); 
          
           var endCode = ["M107; Pump Off" ,"G4 P750 ;Pause for 750 milliseconds\n", "G28; Home All Axis"];
          
           var finalCode = drawingCode.concat(endCode);
            
            download(

                'Pancake_Spiral.GCODE', 
                finalCode); 
        } 
        
        function generatePBPCODE() //Generates the PBP file
        { 
          
           var preCode = ["[[\"Layer\",{\"applyMatrix\":true}],[\"Layer\",{\"applyMatrix\":true,\"children\":[[\"Path\",{\"applyMatrix\":true,\"data\":{\"color\":0,\"isPolygonal\":true},\"segments\":[ "];
           
            var lastElement = myPBPCode.slice(-1)[0];
            console.log(lastElement);
            var lastElement = lastElement.slice(0, -1);
            console.log(lastElement);
            myPBPCode.pop();
            
            var drawingCode = preCode.concat(myPBPCode).join('\n'); //Adds each element to drawing code.

            var drawingCode = drawingCode.concat(lastElement);

            
          
           var endCode = ["],\"closed\":true,\"strokeColor\":[1,0.91765,0.49412],\"strokeWidth\":5,\"strokeCap\":\"round\",\"miterLimit\":1}]]}]]"];
          
           var finalCode = drawingCode.concat(endCode);
            
            download(

                'Pancake_Spiral.PBP', 
                finalCode); 
        } 
        
                                                                                                   
                                                                                                   
        //Function for Downloading GCODE                                                                                           
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
        
                                                                                                   
        //Function for Downloading GCODE
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
        $('#GCODEDL').click(
            generateGCode);
        
        //pbp button click event handler
        $('#PBPDL').click(
            generatePBPCODE);

        // Draw the initial spiral.
        updateSpiral();
    });
