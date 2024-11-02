//RICHMOND'S MINIMAL SURFACE
//Basing on the skeleton project add a new js script file containing Model object.
//Model object has to draw the surface wireframe as two sets of vertices: a set of U polylines and a set of V polylines.

//Constructor
function Model(name, uGranularity, vGranularity) {
    this.name = name;

    this.iVertexBuffer = gl.createBuffer();
    this.iIndexBuffer = gl.createBuffer();

    this.count = 0;
    this.uGranularity = uGranularity;
    this.vGranularity = vGranularity;

    //Забуферизувати дані
    this.BufferData = function (vertices, indices) {

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STREAM_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        this.count = indices.length;
    }

    //Відтворити дані
    this.Draw = function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        //false -- не треба нормалізація
        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);

        //Відмальовування
        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
        //gl.drawArrays(gl.LINE_STRIP, 0, this.count);
        /*
        for (let i = 0; i < this.count; i++) {
            gl.drawArrays(gl.LINE_STRIP, i * (this.uGranularity + 1), this.uGranularity + 1);
        }
        */
    }
}


//Створення точок Мінімальної поверхні Річмонда
function CreateSurfaceData(uGranularity, vGranularity) {
    let vertexList = [];
    let indexList = [];
    let uMin = 0.25, uMax = 1, vMin = 0, vMax = 2 * Math.PI;

    let uStep = (uMax - uMin) / uGranularity;
    let vStep = (vMax - vMin) / vGranularity;

    //Generate vertices
    for (let i = 0; i <= uGranularity; i++) {
        let u = uMin + i * uStep;
        for (let j = 0; j <= vGranularity; j++) {
            let v = vMin + j * vStep;

            let x = -Math.cos(v) / (2 * u) - (u * u * u * Math.cos(3 * v)) / 6;
            let y = -Math.sin(v) / (2 * u) - (u * u * u * Math.sin(3 * v)) / 6;
            let z = u * Math.cos(v);

            vertexList.push(x, y, z);
        }
    }

    //Generate indices
    for (let i = 0; i < uGranularity; i++) {
        for (let j = 0; j < vGranularity; j++) {
            let first = i * (vGranularity + 1) + j;
            let second = first + vGranularity + 1;

            // reate two triangles for each quad
            indexList.push(first, second, first + 1);
            indexList.push(second, second + 1, first + 1);
        }
    }

    return { vertices: vertexList, indices: indexList };
}




//Shading Gouraud
//Normal Analytic