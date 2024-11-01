//RICHMOND'S MINIMAL SURFACE
//Basing on the skeleton project add a new js script file containing Model object.
//Model object has to draw the surface wireframe as two sets of vertices: a set of U polylines and a set of V polylines.

//Constructor
function Model(name, linesInPolyLine) {
    this.name = name;
    this.iVertexBuffer = gl.createBuffer();
    this.count = 0;
    this.linesInPolyLine = linesInPolyLine;

    //Забуферизувати дані
    this.BufferData = function(vertices) {

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STREAM_DRAW);

        this.count = vertices.length/3;
    }

    //Відтворити дані
    this.Draw = function() {

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);
   
        //Відмальовування
        //gl.drawArrays(gl.LINE_STRIP, 0, this.count);
        for (let i = 0; i < this.count; i++) {
            gl.drawArrays(gl.LINE_STRIP, i * (this.linesInPolyLine + 1), this.linesInPolyLine + 1);
        }     
    }
}


//Створення точок Мінімальної поверхні Річмонда
function CreateSurfaceData(linesInPolyLine) {
    let vertexList = [];
    let uMin = 0.25, uMax = 1, vMin = 0, vMax = 2*Math.PI;

    let uStep = (uMax - uMin) / linesInPolyLine;
    let vStep = (vMax - vMin) / linesInPolyLine;

    for (let u = uMin; u <= uMax; u += uStep) {
        for (let v = vMin; v <= vMax; v += vStep) {
            let x = -Math.cos(v)/(2 * u) - (u*u*u*Math.cos(3*v))/6;
            let y = -Math.sin(v)/(2 * u) - (u*u*u*Math.sin(3*v))/6;
            let z = u * Math.cos(v);

            vertexList.push(x, y, z);
        }
    }
    
    for (let v = vMin; v <= vMax; v += vStep) {
        for (let u = uMin; u <= uMax; u += uStep) {
            let x = -Math.cos(v)/(2 * u) - (u*u*u*Math.cos(3*v))/6;
            let y = -Math.sin(v)/(2 * u) - (u*u*u*Math.sin(3*v))/6;
            let z = u * Math.cos(v);

            vertexList.push(x, y, z);
        }
    }

    return vertexList;
}




//Shading Gouraud
//Normal Analytic