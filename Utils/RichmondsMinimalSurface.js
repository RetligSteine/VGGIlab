//RICHMOND'S MINIMAL SURFACE
//Basing on the skeleton project add a new js script file containing Model object.
//Model object has to draw the surface wireframe as two sets of vertices: a set of U polylines and a set of V polylines.

//Constructor
function Model(name, uGranularity, vGranularity) {
    this.name = name;
    this.iVertexBuffer = gl.createBuffer();
    this.count = 0;
    this.uGranularity = uGranularity;
    this.vGranularity = vGranularity;

    //Забуферизувати дані
    this.BufferData = function(vertices) {

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STREAM_DRAW);

        this.count = vertices.length/3;
    }

    //Відтворити дані
    this.Draw = function() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        //false -- не треба нормалізація
        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);
   
        //Відмальовування
        gl.drawArrays(gl.LINE_STRIP, 0, this.count);
        /*
        for (let i = 0; i < this.count; i++) {
            gl.drawArrays(gl.LINE_STRIP, i * (this.uGranularity + 1), this.uGranularity + 1);
        }
        */
        console.log("count " + this.count);
        console.log("uGranularity " + this.uGranularity);
        console.log("vGranularity " + this.vGranularity);
    }
}


//Створення точок Мінімальної поверхні Річмонда
function CreateSurfaceData(uGranularity, vGranularity) {
    let vertexList = [];
    let uMin = 0.25, uMax = 1, vMin = 0, vMax = 2*Math.PI;

    let uStep = (uMax - uMin) / uGranularity;
    let vStep = (vMax - vMin) / vGranularity;

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