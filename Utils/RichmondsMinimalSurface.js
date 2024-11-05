//RICHMOND'S MINIMAL SURFACE
//Basing on the skeleton project add a new js script file containing Model object.
//Model object has to draw the surface wireframe as two sets of vertices: a set of U polylines and a set of V polylines.

//Shading Gouraud



//Constructor
function Model(name, uGranularity, vGranularity) {
    this.name = name;

    this.iVertexBuffer = gl.createBuffer();
    this.iIndexBuffer = gl.createBuffer();
    this.iNormalBuffer = gl.createBuffer();

    this.count = 0;
    this.uGranularity = uGranularity;
    this.vGranularity = vGranularity;

    //Забуферизувати дані
    this.BufferData = function (vertices, indices, normals) {
        //Вершини
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STREAM_DRAW);

        //VBO
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        //Нормалі
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        this.count = indices.length;
    }

    //Відтворити дані
    this.Draw = function () {
        // Прив'язка буфера вершин і передача в атрибут `vertex`
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);

        // Прив'язка буфера нормалей і передача в атрибут `normal`
        gl.bindBuffer(gl.ARRAY_BUFFER, this.iNormalBuffer);
        gl.vertexAttribPointer(shProgram.iAttribNormal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribNormal);

        // Прив'язка буфера індексів і відтворення елементів
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iIndexBuffer);
        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
    }
}


//Створення точок Мінімальної поверхні Річмонда
function CreateSurfaceData(uGranularity, vGranularity) {
    let vertexList = [];
    let indexList = [];
    let normalList = [];

    //Границі
    let uMin = 0.25, uMax = 1, vMin = 0, vMax = 2 * Math.PI;

    //Кроки
    let uStep = (uMax - uMin) / uGranularity;
    let vStep = (vMax - vMin) / vGranularity;

    //Вершини і нормалі
    for (let i = 0; i <= uGranularity; i++) {
        let u = uMin + i * uStep;
        for (let j = 0; j <= vGranularity; j++) {
            let v = vMin + j * vStep;

            //Координати
            let x = -Math.cos(v) / (2 * u) - (u * u * u * Math.cos(3 * v)) / 6;
            let y = -Math.sin(v) / (2 * u) - (u * u * u * Math.sin(3 * v)) / 6;
            let z = u * Math.cos(v);
            vertexList.push(x, y, z);

            //Нормаль
            let normal = calculateNormal(u, v);
            normalList.push(...normal);
        }
    }

    //VBO (Vertex Buffer Object) з індексами
    for (let i = 0; i < uGranularity; i++) {
        for (let j = 0; j < vGranularity; j++) {
            let first = i * (vGranularity + 1) + j;
            let second = first + vGranularity + 1;

            //Два трикутника на кожну вершину
            indexList.push(first, second, first + 1);
            indexList.push(second, second + 1, first + 1);
        }
    }

    return { vertices: vertexList, indices: indexList, normals: normalList };
}








//
//NORMAL ANALYTIC
//
//Обчислюємо вектор нормалі як перехресний добуток дотичних U та V
function calculateNormal(u, v) {
    let tu = tangentU(u, v);
    let tv = tangentV(u, v);

    //Перехресний добуток
    let nx = tu[1] * tv[2] - tu[2] * tv[1];
    let ny = tu[2] * tv[0] - tu[0] * tv[2];
    let nz = tu[0] * tv[1] - tu[1] * tv[0];

    return [nx / length, ny / length, nz / length];
}

//Дотична по напрямку U
function tangentU(u, v) {
    let delta = 0.001;
    let u1 = u + delta;

    //f(u, v)
    let x0 = -Math.cos(v) / (2 * u) - (u * u * u * Math.cos(3 * v)) / 6;
    let y0 = -Math.sin(v) / (2 * u) - (u * u * u * Math.sin(3 * v)) / 6;
    let z0 = u * Math.cos(v);

    //f(u + delta, v)
    let x1 = -Math.cos(v) / (2 * u1) - (u1 * u1 * u1 * Math.cos(3 * v)) / 6;
    let y1 = -Math.sin(v) / (2 * u1) - (u1 * u1 * u1 * Math.sin(3 * v)) / 6;
    let z1 = u1 * Math.cos(v);

    return [(x1 - x0) / delta, (y1 - y0) / delta, (z1 - z0) / delta];
}

//Дотична по напрямку V
function tangentV(u, v) {
    let delta = 0.001;
    let v1 = v + delta;

    //f(u, v)
    let x0 = -Math.cos(v) / (2 * u) - (u * u * u * Math.cos(3 * v)) / 6;
    let y0 = -Math.sin(v) / (2 * u) - (u * u * u * Math.sin(3 * v)) / 6;
    let z0 = u * Math.cos(v);

    //f(u, v + delta)
    let x1 = -Math.cos(v1) / (2 * u) - (u * u * u * Math.cos(3 * v1)) / 6;
    let y1 = -Math.sin(v1) / (2 * u) - (u * u * u * Math.sin(3 * v1)) / 6;
    let z1 = u * Math.cos(v1);

    return [(x1 - x0) / delta, (y1 - y0) / delta, (z1 - z0) / delta];
}


