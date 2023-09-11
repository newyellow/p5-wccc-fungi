let treeTurnNoiseZ = 1234;

let sketchDensity = 0.2;

let dotDensity = 0.6;
let dotSize = 6;
let dotLength = 60;

let dotTrailDensity = 0.2;

let dotNoiseScale = 0.01;
let dotNoiseZ = 6345;

let dotHDiff = 30;
let dotSDiff = 20;
let dotBDiff = 20;

let areaNoiseScale = 0.001;
let areaNoiseZ = 1234;
let areaNoiseDrawMax = 1.0;
let areaNoiseDrawMin = 0.0;

let smoothSkipChanceMultiplier = 0.1;
let smoothSkipChanceRange = 0.0;
let skipChance = 0.0;


async function drawStick(_fromPoint, _toPoint) {

    let sliceCount = dist(_fromPoint.x, _fromPoint.y, _toPoint.x, _toPoint.y) * sketchDensity;

    // let slope = getAngle(_fromPoint.x, _fromPoint.y, _toPoint.x, _toPoint.y) - 90;

    for (let i = 0; i < sliceCount; i++) {

        let t = i / (sliceCount - 1);

        let nowX = lerp(_fromPoint.x, _toPoint.x, t);
        let nowY = lerp(_fromPoint.y, _toPoint.y, t);

        let nowWidth = lerp(_fromPoint.width, _toPoint.width, t);
        let nowColor = NYLerpColor(_fromPoint.color, _toPoint.color, t);

        let xNoiseValue = noise(nowX * 0.001, nowY * 0.001, treeTurnNoiseZ);

        nowX += lerp(-0.5, 0.5, xNoiseValue) * 300;

        spawnDotLine(nowX - 0.5 * nowWidth, nowY, nowX + 0.5 * nowWidth, nowY, nowColor);

        if (i % AWAIT_LINES_PER_TICK == 0)
            await sleep(1);
    }
    // NYLine(_fromPoint.x, _fromPoint.y, _toPoint.x, _toPoint.y, _fromPoint.color, _toPoint.color);
}

function spawnDotLine(_x1, _y1, _x2, _y2, _color) {
    let spawnCount = dist(_x1, _y1, _x2, _y2) * dotDensity;
    for (let i = 0; i < spawnCount; i++) {
        let t = i / (spawnCount - 1);
        let nowX = lerp(_x1, _x2, t);
        let nowY = lerp(_y1, _y2, t);

        let areaNoiseValue = noise(nowX * areaNoiseScale, nowY * areaNoiseScale, areaNoiseZ);
        let closeRatio = min(abs(areaNoiseValue - areaNoiseDrawMin), abs(areaNoiseValue - areaNoiseDrawMax));

        let nowSkipChance = skipChance;

        if (smoothSkipChanceRange != 0 && closeRatio < smoothSkipChanceRange) {
            nowSkipChance += (1.0 - closeRatio / smoothSkipChanceRange) * smoothSkipChanceMultiplier;
        }

        if (areaNoiseValue < areaNoiseDrawMin || areaNoiseValue > areaNoiseDrawMax) {
            continue;
        }

        if (random() < nowSkipChance) {
            continue;
        }

        spawnDot(nowX, nowY, dotSize, dotLength, _color);
    }
}

function spawnDot(_x, _y, _size, _length, _color) {
    let dotCount = _length * dotTrailDensity;
    let dotDistance = _length / dotCount;

    let nowX = _x;
    let nowY = _y;
    let nowSize = _size;

    let fromColor = _color;
    let toColor = _color.copy();
    toColor.slightRandomize(dotHDiff, dotSDiff, dotBDiff);

    for (let i = 0; i < dotCount; i++) {
        let t = i / (dotCount - 1);

        nowSize = lerp(_size, 0, easeOutSine(t));

        let rotNoise = noise(nowX * dotNoiseScale, nowY * dotNoiseScale, dotNoiseZ);

        nowX += sin(radians(rotNoise * 720)) * dotDistance;
        nowY -= cos(radians(rotNoise * 720)) * dotDistance;

        let nowColor = NYLerpColor(fromColor, toColor, t);

        noStroke();
        fill(nowColor.h, nowColor.s, nowColor.b, nowColor.a);
        circle(nowX, nowY, nowSize);
    }
}

function drawStickFungi(_fromPoint, _toPoint, _xRatio, _yRatio) {

    let nowX = lerp(_fromPoint.x, _toPoint.x, _yRatio);
    let nowY = lerp(_fromPoint.y, _toPoint.y, _yRatio);
    let nowWidth = lerp(_fromPoint.width, _toPoint.width, _yRatio);

    let xNoiseValue = noise(nowX * 0.001, nowY * 0.001, treeTurnNoiseZ);
    nowX += lerp(-0.5, 0.5, xNoiseValue) * 300;

    let leftX = nowX - 0.5 * nowWidth;
    let rightX = nowX + 0.5 * nowWidth;
    let spawnX = lerp(leftX, rightX, _xRatio);

    let areaNoiseValue = noise(nowX * areaNoiseScale, nowY * areaNoiseScale, areaNoiseZ);
    if (areaNoiseValue < areaNoiseDrawMin || areaNoiseValue > areaNoiseDrawMax) {
        return false;
    }

    let fungiLength = random(30, 90);
    let fungiThickness = random(1, 3);
    let headSize = random(6, 12);

    let stickAngle = getAngle(_fromPoint.x, _fromPoint.y, _toPoint.x, _toPoint.y);
    let startAngle = 0.0;

    if(_xRatio < 0.5)
        startAngle = lerp(-120, -40, _xRatio * 2) + random(-20, 20);
    else
        startAngle = lerp(40, 120, (_xRatio - 0.5) * 2) + random(-20, 20);

    startAngle += stickAngle;
    spawnFungi(spawnX, nowY, fungiLength, fungiThickness, headSize, startAngle);
    return true;
}

let fungiLineDensity = 0.8;
let fungiHeadLineDensity = 0.9;

function spawnFungi(_x, _y, _length, _thickness, _headSize, _startAngle) {
    let nowX = _x;
    let nowY = _y;

    let nowAngle = _startAngle;
    let smoothPower = random(0.01, 0.06);

    let lineCount = _length * fungiLineDensity;
    let stepLength = _length / lineCount;

    for (let i = 0; i < lineCount; i++) {
        let t = i / (lineCount - 1);

        if (t < 0.7) {
            let angleNoiseValue = noise(nowX * 0.01, nowY * 0.01, 3456)
            nowAngle += lerp(-12, 12, angleNoiseValue);
        }
        else {
            nowAngle = lerp(nowAngle, 0.0, smoothPower);
        }

        nowX += sin(radians(nowAngle)) * stepLength;
        nowY -= cos(radians(nowAngle)) * stepLength;

        fill(0, 0, 100, 0.6);
        noStroke();

        let dotSize = map(t, 0.0, 0.15, 0, 1, true);

        push();
        translate(nowX, nowY);
        rotate(radians(nowAngle));
        NYArc(0, 0, _thickness, _thickness * 0.6, random(dotSize), 0.6);
        pop();
    }

    // draw head
    let sizeAngleRandom = random(0, 720);
    let headSizeX = (sin(radians(sizeAngleRandom)) + 1) / 2 * _headSize;
    let headSizeY = (cos(radians(sizeAngleRandom)) + 1) / 2 * _headSize;

    push();
    translate(nowX, nowY);
    rotate(radians(nowAngle));
    drawFungiHead(0, 0, headSizeX, headSizeY);
    pop();
}

function drawFungiHead(_x, _y, _width, _length) {
    let arcCount = _length * fungiHeadLineDensity;
    let stepLength = _length / arcCount;

    let nowX = _x;
    let nowY = _y;
    let nowAngle = 0;
    for (let i = 0; i < arcCount; i++) {
        let t = i / (arcCount - 1);
        let curveT = easeInSine(t);

        nowX += sin(radians(nowAngle)) * stepLength;
        nowY += -cos(radians(nowAngle)) * stepLength;

        let nowWidth = lerp(1.0, 0.2, curveT) * _width;
        let nowHeight = 0.6 * nowWidth;

        NYArc(nowX, nowY, nowWidth, nowHeight, random(3), 0.6);
    }
}

function NYArc(_x, _y, _width, _height, _dotSize = 3, _density = 0.6) {
    let dotCount = (_width + _height) * _density;

    push();
    translate(_x, _y);

    for (let i = 0; i < dotCount; i++) {
        let t = i / (dotCount - 1);

        let nowDotAngle = lerp(120, 240, t);

        let nowX = sin(radians(nowDotAngle)) * _width * 0.5;
        let nowY = -cos(radians(nowDotAngle)) * _height * 0.5;

        circle(nowX, nowY, _dotSize);
    }
    pop();

}
