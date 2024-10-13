//RICHMOND'S MINIMAL SURFACE
//Basing on the skeleton project add a new js script file containing Model object.
//Model object has to draw the surface wireframe as two sets of vertices: a set of U polylines and a set of V polylines.

// Constructor
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
        //LINE_STRIP - полілінія, зміщення (звідки) і на скільки
        for (let i = 0; i < this.count; i++) {
            gl.drawArrays(gl.LINE_STRIP, i * linesInPolyLine, linesInPolyLine);
        }
        //gl.drawArrays(gl.LINE_STRIP, 0, this.count);
    }
}


//Створення точок самої поверхні
function CreateSurfaceData(linesInPolyLine) {
    let vertexList = [];
    let uMin = 0.1, uMax = 1, vMin = 0.1, vMax = 1

    let uStep = (uMax - uMin) / linesInPolyLine;
    let vStep = (vMax - vMin) / linesInPolyLine;

    for (let u = uMin; u <= uMax; u += uStep) {
        for (let v = vMin; v <= vMax; v += vStep) {
            if (u === 0 && v === 0) continue;

            let x = (-3*u - u*u*u*u*u + 2*u*u*u*v*v + 3*u*v*v*v*v) / (6 * (u*u + v*v));
            let y = (-3*v - 3*u*u*u*u*v - 2*u*u*v*v*v + v*v*v*v*v) / (6 * (u*u + v*v));
            let z = u;

            vertexList.push(x, y, z);
        }
    }
/*
    for (let v = vMin; v <= vMax; v += vStep) {
        for (let u = uMin; u <= uMax; u += uStep) {
            if (u === 0 && v === 0) continue;

            let x = (-3*u - u*u*u*u*u + 2*u*u*u*v*v + 3*u*v*v*v*v) / (6 * (u*u + v*v));
            let y = (-3*v - 3*u*u*u*u*v - 2*u*u*v*v*v + v*v*v*v*v) / (6 * (u*u + v*v));
            let z = u;

            vertexList.push(x, y, z);
        }
    }
*/
    return vertexList;
}