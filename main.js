'use strict';

let gl;                         // The webgl context.
let surface;                    // A surface model
let shProgram;                  // A shader program
let spaceball;                  // A SimpleRotator object that lets the user rotate the view by mouse.

let uGranularity = 20;
let vGranularity = 20;

function deg2rad(angle) {
    return angle * Math.PI / 180;
}


//Оновлення даних двох слайдерів,
//що забезпечують можливість контролювати зернистість поверхні в U та V напрямках
function updateGranularity() {
    surface.uGranularity = parseInt(document.getElementById("uGranularity").value);
    surface.vGranularity = parseInt(document.getElementById("vGranularity").value);

    document.getElementById("uGranularityValue").textContent = surface.uGranularity;
    document.getElementById("vGranularityValue").textContent = surface.vGranularity;

    //Оновлення поверхні
    let surfaceData = CreateSurfaceData(surface.uGranularity, surface.vGranularity);
    surface.BufferData(surfaceData.vertices, surfaceData.indices, surfaceData.normals);
    draw();
}


// Constructor
function ShaderProgram(name, program) {

    this.name = name;
    this.prog = program;

    // Location of the attribute variable in the shader program.
    this.iAttribVertex = -1;
    // Location of the uniform specifying a color for the primitive.
    this.iColor = -1;
    // Location of the uniform matrix representing the combined transformation.
    this.iModelViewProjectionMatrix = -1;

    this.Use = function() {
        gl.useProgram(this.prog);
    }
}


/* 
 *  Draws
 */
function draw() { 
    //Колір чистого фону
    gl.clearColor(0.447, 0.58, 0.847, 1);
    //gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    /* Set the values of the projection transformation */
    let projection = m4.perspective(Math.PI / 6, 1500/500, 3, 25); 
    
    /* Get the view matrix from the SimpleRotator object.*/
    let modelView = spaceball.getViewMatrix();

    let rotateToPointZero = m4.axisRotation([0.707,0.707,0], 0.7);
    let translateToPointZero = m4.translation(0,0,-10);

    let matAccum0 = m4.multiply(rotateToPointZero, modelView );
    let matAccum1 = m4.multiply(translateToPointZero, matAccum0 );
        
    /* Multiply the projection matrix times the modelview matrix to give the
       combined transformation matrix, and send that to the shader program. */
    let modelViewProjection = m4.multiply(projection, matAccum1 );

    gl.uniformMatrix4fv(shProgram.iModelViewProjectionMatrix, false, modelViewProjection );
    
    /* Draw with this color. */
    gl.uniform4fv(shProgram.iColor, [0.95, 0.95, 1, 1] );
    //gl.uniform4fv(shProgram.iColor, [0, 1, 0, 1] );

    surface.Draw();
}


/* Initialize the WebGL context. Called from init() */
function initGL() {
    //Створення шейдерної програми
    let prog = createProgram( gl, vertexShaderSource, fragmentShaderSource );

    shProgram = new ShaderProgram('Basic', prog);
    shProgram.Use();

    //Зв'язуємо графічний процесор з центральним для всього, що використовуємо
    shProgram.iAttribVertex              = gl.getAttribLocation(prog, "vertex");
    shProgram.iModelViewProjectionMatrix = gl.getUniformLocation(prog, "ModelViewProjectionMatrix");
    shProgram.iColor                     = gl.getUniformLocation(prog, "color");
    shProgram.iAttribNormal              = gl.getAttribLocation(prog, "normal"); 

    //Створення буфера
    surface = new Model("RICHMOND'S MINIMAL SURFACE", vGranularity, uGranularity);

    //ФУНКЦІЯ ПОВЕРХНІ
    let surfaceData = CreateSurfaceData(surface.uGranularity, surface.vGranularity);
    surface.BufferData(surfaceData.vertices, surfaceData.indices, surfaceData.normals);

    gl.enable(gl.DEPTH_TEST);
}


/* Creates a program for use in the WebGL context gl, and returns the
 * identifier for that program.  If an error occurs while compiling or
 * linking the program, an exception of type Error is thrown.  The error
 * string contains the compilation or linking error.  If no error occurs,
 * the program identifier is the return value of the function.
 * The second and third parameters are strings that contain the
 * source code for the vertex shader and for the fragment shader.
 */
//Тут беремо шейдери
//І віддаємо компілятору глсл
function createProgram(gl, vShader, fShader) {
    //Вертексний шейдер
    let vsh = gl.createShader( gl.VERTEX_SHADER );
    gl.shaderSource(vsh,vShader);
    gl.compileShader(vsh);
    if ( ! gl.getShaderParameter(vsh, gl.COMPILE_STATUS) ) {
        throw new Error("Error in vertex shader:  " + gl.getShaderInfoLog(vsh));
     }
    //Фрагментний (піксельний) шейдер
    let fsh = gl.createShader( gl.FRAGMENT_SHADER );
    gl.shaderSource(fsh, fShader);
    gl.compileShader(fsh);
    if ( ! gl.getShaderParameter(fsh, gl.COMPILE_STATUS) ) {
       throw new Error("Error in fragment shader:  " + gl.getShaderInfoLog(fsh));
    }
    //Додаємо до програми
    let prog = gl.createProgram();
    gl.attachShader(prog,vsh);
    gl.attachShader(prog, fsh);
    gl.linkProgram(prog);
    if ( ! gl.getProgramParameter( prog, gl.LINK_STATUS) ) {
       throw new Error("Link error in program:  " + gl.getProgramInfoLog(prog));
    }
    return prog;
}


/**
 * initialization function that will be called when the page has loaded
 */
function init() {
    //Шукаємо канвас
    //І контекст вебгл
    let canvas;
    try {
        canvas = document.getElementById("webglcanvas");
        gl = canvas.getContext("webgl");
        if ( ! gl ) {
            throw "Browser does not support WebGL";
        }
    }
    catch (e) {
        document.getElementById("canvas-holder").innerHTML =
            "<p>Sorry, could not get a WebGL graphics context.</p>";
        return;
    }

    //Ініціюєму гл і трекболротатор
    try {
        initGL();  // initialize the WebGL graphics context
    }
    catch (e) {
        document.getElementById("canvas-holder").innerHTML =
            "<p>Sorry, could not initialize the WebGL graphics context: " + e + "</p>";
        return;
    }

    spaceball = new TrackballRotator(canvas, draw, 0);

    //Починаємо малювати
    draw();
}
