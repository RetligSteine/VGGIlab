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
        //gl.drawArrays(gl.LINE_STRIP, 0, this.count);
        for (let i = 0; i < this.count; i++) {
            gl.drawArrays(gl.LINE_STRIP, i * (this.linesInPolyLine +1), this.linesInPolyLine+1);
        }     
    }
}


//Створення точок самої поверхні
function CreateSurfaceData(linesInPolyLine) {
    let vertexList = [];
    let rMin = 0.25, rMax = 1, oMin = 0, oMax = 2*Math.PI;

    let rStep = (rMax - rMin) / linesInPolyLine;
    let oStep = (oMax - oMin) / linesInPolyLine;

    for (let r = rMin; r <= rMax; r += rStep) {
        for (let o = oMin; o <= oMax; o += oStep) {
            let x = -Math.cos(o)/(2 * r) - (r*r*r*Math.cos(3*o))/6;
            let y = -Math.sin(o)/(2 * r) - (r*r*r*Math.sin(3*o))/6;
            let z = r*Math.cos(o);

            vertexList.push(x, y, z);
        }
    }
    
    for (let o = oMin; o <= oMax; o += oStep) {
        for (let r = rMin; r <= rMax; r += rStep) {
            let x = -Math.cos(o)/(2 * r) - (r*r*r*Math.cos(3*o))/6;
            let y = -Math.sin(o)/(2 * r) - (r*r*r*Math.sin(3*o))/6;
            let z = r*Math.cos(o);

            vertexList.push(x, y, z);
        }
    }

    return vertexList;
}