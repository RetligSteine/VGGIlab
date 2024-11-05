let lightAngle = 0;
let lightRadius = 5; // Радіус руху світла
let ambientColor = [0.1, 0.1, 0.1]; // Слабке навколишнє освітлення
let diffuseColor = [0.8, 0.8, 0.8]; // Основний колір освітлення
let specularColor = [1.0, 1.0, 1.0]; // Висока інтенсивність для блисків
let shininess = 32; // Параметр блиску

function updateLightPosition() {
    lightAngle += 0.01;
    let lightX = lightRadius * Math.cos(lightAngle);
    let lightZ = lightRadius * Math.sin(lightAngle);
    let lightY = 2.0; // Висота джерела світла

    let lightPosition = [lightX, lightY, lightZ];

    // Передача світла у шейдери
    gl.uniform3fv(shProgram.iLightPosition, lightPosition);
    gl.uniform3fv(shProgram.iAmbientColor, ambientColor);
    gl.uniform3fv(shProgram.iDiffuseColor, diffuseColor);
    gl.uniform3fv(shProgram.iSpecularColor, specularColor);
    gl.uniform1f(shProgram.iShininess, shininess);
}