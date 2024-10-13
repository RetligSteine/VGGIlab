//RICHMOND'S MINIMAL SURFACE
//Basing on the skeleton project add a new js script file containing Model object.
//Model object has to draw the surface wireframe as two sets of vertices: a set of U polylines and a set of V polylines.



function CreateSurfaceData(steps = 20) {
    let vertexList = [];
    let uMin = -1, uMax = 1, vMin = 0.2, vMax = 1

    let uStep = (uMax - uMin) / steps;
    let vStep = (vMax - vMin) / steps;
    for (let u = uMin; u <= uMax; u += uStep) {
        for (let v = vMin; v <= vMax; v += vStep) {
            if (u === 0 && v === 0) continue;

            let x = (-3 * u - u * u * u * u * u + 2 * u * u * u * v * v + 3 * u * v * v * v * v) / (6 * (u * u + v * v));
            let y = (-3 * v - 3 * u * u * u * u * v - 2 * u * u * v * v * v + v * v * v * v * v) / (6 * (u * u + v * v));
            let z = u;

            vertexList.push(x, y, z);
        }
    }


    for (let v = vMin; v <= vMax; v += vStep) {
        for (let u = uMin; u <= uMax; u += uStep) {
            if (u === 0 && v === 0) continue;

            let x = (-3 * u - u * u * u * u * u + 2 * u * u * u * v * v + 3 * u * v * v * v * v) / (6 * (u * u + v * v));
            let y = (-3 * v - 3 * u * u * u * u * v - 2 * u * u * v * v * v + v * v * v * v * v) / (6 * (u * u + v * v));
            let z = u;

            vertexList.push(x, y, z);
        }
    }

    return vertexList;
}