//RICHMOND'S MINIMAL SURFACE
//Basing on the skeleton project add a new js script file containing Model object.
//Model object has to draw the surface wireframe as two sets of vertices: a set of U polylines and a set of V polylines.
//Shading Gouraud

//Кут з градусів в радіани
function deg2rad(angle) {
    return angle * Math.PI / 180;
}

function Vertex(p)
{
    this.p = p;
    this.normal = [];
    this.triangles = [];
}

function Triangle(v0, v1, v2)
{
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;
    this.normal = [];
    this.tangent = [];
}


function Model(name) {
    this.name = name;
    this.iVertexBuffer = gl.createBuffer();
    this.iIndexBuffer = gl.createBuffer();
    this.count = 0;

    //Забуферизувати дані
    this.BufferData = function(vertices, indices) {

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STREAM_DRAW);

        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STREAM_DRAW);

        this.count = indices.length;
    }

    //Відтворити дані
    this.Draw = function() {
        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
    }
}



function CreateSurfaceData(data) {
    let vertices = [];
    let triangles = [];

    //Surface bounds
    let uMin = 0.25, uMax = 1, vMin = 0, vMax = 2 * Math.PI;

    //Steps for u and v
    let uStep = (uMax - uMin) / uGranularity;
    let vStep = (vMax - vMin) / vGranularity;

    //Vertices calculation
    for (let i = 0; i <= uGranularity; i++) {
        let u = uMin + i * uStep;
        for (let j = 0; j <= vGranularity; j++) {
            let v = vMin + j * vStep;

            //Richmond's minimal surface parametric equations
            //From PA#1
            let x = -Math.cos(v) / (2 * u) - (u * u * u * Math.cos(3 * v)) / 6;
            let y = -Math.sin(v) / (2 * u) - (u * u * u * Math.sin(3 * v)) / 6;
            let z = u * Math.cos(v);

            vertices.push(new Vertex([x, y, z]));
        }
    }

    //Triangles calculation
    for (let i = 0; i < uGranularity; i++) {
        for (let j = 0; j < vGranularity; j++) {
            //Indices of the four vertices of each quad
            let v0 = i * (vGranularity + 1) + j;
            let v1 = v0 + 1;
            let v2 = v0 + (vGranularity + 1);
            let v3 = v2 + 1;

            // wo triangles for each quad
            triangles.push(new Triangle(v0, v2, v1));
            triangles.push(new Triangle(v1, v2, v3));

            //Attach triangles to vertices for normal calculation or other operations
            let trianInd = triangles.length - 2;
            vertices[v0].triangles.push(trianInd);
            vertices[v2].triangles.push(trianInd);
            vertices[v1].triangles.push(trianInd);

            let trianInd2 = triangles.length - 1;
            vertices[v1].triangles.push(trianInd2);
            vertices[v2].triangles.push(trianInd2);
            vertices[v3].triangles.push(trianInd2);
        }
    }

    data.verticesF32 = new Float32Array(vertices.length * 3);
    for (let i = 0, len = vertices.length; i < len; i++) {
        data.verticesF32[i * 3 + 0] = vertices[i].p[0];
        data.verticesF32[i * 3 + 1] = vertices[i].p[1];
        data.verticesF32[i * 3 + 2] = vertices[i].p[2];
    }

    data.indicesU16 = new Uint16Array(triangles.length * 3);
    for (let i = 0, len = triangles.length; i < len; i++) {
        data.indicesU16[i * 3 + 0] = triangles[i].v0;
        data.indicesU16[i * 3 + 1] = triangles[i].v1;
        data.indicesU16[i * 3 + 2] = triangles[i].v2;
    }
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


