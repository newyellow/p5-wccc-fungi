
let AWAIT_LINES_PER_TICK = 6;
let mainHue = 35;

async function setup() {
  createCanvas(1080, 1080);
  pixelDensity(3);
  colorMode(HSB);
  strokeCap(SQUARE);
  background(0, 0, 3);;
  

  let treeCount = int(random(3, 6));

  let themeHue = random(0, 360);

  // rotational
  // for (let i = 0; i < treeCount; i++) {

  //   let nowRotValue = lerp(-80, 80, noise(i * 0.6, 888));

  //   let xOffset = lerp(-0.3, 0.3, noise(i * 0.4, 666)) * width;
  //   let yOffset = 0;

  //   let x1 = width / 2 + xOffset + sin(radians(nowRotValue + 180)) * width * 0.6;
  //   let y1 = height / 2 + yOffset + -cos(radians(nowRotValue + 180)) * height * 0.6;

  //   let x2 = width / 2 + xOffset + sin(radians(nowRotValue)) * width * 0.6;
  //   let y2 = height / 2 + yOffset + -cos(radians(nowRotValue)) * height * 0.6;

  //   let width1 = random(0.1, 0.24) * min(width, height);
  //   let width2 = random(0.3, 0.8) * width1;

  //   await drawTree(x1, y1, x2, y2, width1, width2);
  // }

  // random
  for (let i = 0; i < treeCount; i++) {

    let x1 = random(-0.1, 1.1) * width;
    let y1 = 1.1 * height;

    let x2 = random(-0.1, 1.1) * width;
    let y2 = -0.1 * height;

    let edgeRandom = random();
    if(edgeRandom < 0.26)
    {
      x2 = -0.1 * width;
      y2 = random(-0.1, 0.24) * height;
    }
    else if(edgeRandom < 0.54)
    {
      x2 = 1.1 * width;
      y2 = random(-0.1, 0.24) * height;
    }

    while(abs(x1 - x2) < 0.1 * width)
      x1 = random(-0.1, 1.1) * width;

    let width1 = random(0.1, 0.36) * min(width, height);
    let width2 = random(0.3, 0.8) * width1;

    await drawTree(x1, y1, x2, y2, width1, width2);
  }
}

async function drawTree(_x1, _y1, _x2, _y2, _width1, _width2) {

  dotTrailDensity = 0.2;
  dotNoiseZ += random(100, 300);
  areaNoiseZ += random(100, 300);
  treeTurnNoiseZ += random(100, 300);

  let pointStartX = _x1;
  let pointStartY = _y1;

  let pointEndX = _x2;
  let pointEndY = _y2;

  let widthFrom = _width1;
  let widthEnd = _width2;

  let colorFrom = new NYColor(31, 54, 61, 0.6);
  let colorEnd = new NYColor(42, 27, 57, 0.6);

  let fromPoint = {
    x: pointStartX,
    y: pointStartY,
    width: widthFrom,
    color: colorFrom
  };

  let toPoint = {
    x: pointEndX,
    y: pointEndY,
    width: widthEnd,
    color: colorEnd
  };

  mainHue = random(30, 60);

  // layer 1: tree dark back
  {
    noStroke();
    dotSize = 6;
    areaNoiseDrawMax = 1.0;
    areaNoiseDrawMin = 0.0;
    skipChance = 0.0;

    fromPoint.color = new NYColor(mainHue, 56, 17, 0.6);
    fromPoint.color.slightRandomize(30, 20, 20);

    toPoint.color = new NYColor(mainHue + 60, 63, 17, 0.6);
    toPoint.color.slightRandomize(30, 20, 20);
    await drawStick(fromPoint, toPoint);
    await sleep(1);
  }

  // layer 2: some random middle layer color
  for (let i = 0; i < 6; i++) {

    let nowHue = mainHue + random(-10, 10);
    let nowSat = random(40, 60);
    let nowBri = random(20 + 6 * 5, 60 + 6 * 5);
    let colorA = new NYColor(nowHue, nowSat, nowBri, 0.6);
    let colorB = colorA.copy();
    colorB.slightRandomize(20, 20, 20, 0);

    dotNoiseZ += random(0.1, 0.6);

    dotLength = random(10, 40);

    areaNoiseScale = random(0.006, 0.02);
    areaNoiseDrawMax = 0.8 - i * 0.05;
    areaNoiseDrawMin = 0.2;
    skipChance = random(0.4, 0.8);
    fromPoint.color = colorA;
    toPoint.color = colorB;
    await drawStick(fromPoint, toPoint);

    await sleep(1);
  }

  // layer 3: dark layer
  blendMode(MULTIPLY);
  {
    let nowHue = mainHue + random(-20, 20);
    let nowSat = random(30, 50);
    let nowBri = random(10, 40);
    let colorA = new NYColor(nowHue, nowSat, nowBri, 0.2);
    let colorB = colorA.copy();
    colorB.slightRandomize(20, 20, 20, 0);

    dotNoiseZ += random(0.1, 0.6);

    dotLength = 20;
    dotNoiseScale = 0.003;
    areaNoiseScale = 0.06;
    areaNoiseDrawMax = 0.6;
    areaNoiseDrawMin = 0.0;
    skipChance = 0.1;
    fromPoint.color = colorA;
    toPoint.color = colorB;
    await drawStick(fromPoint, toPoint);

    await sleep(1);
  }

  {
    let nowHue = mainHue + random(-20, 20);
    let nowSat = random(30, 50);
    let nowBri = random(10, 40);
    let colorA = new NYColor(nowHue, nowSat, nowBri, 0.3);
    let colorB = colorA.copy();
    colorB.slightRandomize(20, 20, 20, 0);

    dotNoiseZ += 30

    dotLength = 20;
    dotNoiseScale = 0.003;
    areaNoiseScale = 0.02;
    areaNoiseDrawMax = 0.4;
    areaNoiseDrawMin = 0.0;
    skipChance = 0.1;
    fromPoint.color = colorA;
    toPoint.color = colorB;
    await drawStick(fromPoint, toPoint);

    await sleep(1);
  }

  {
    let nowHue = mainHue + random(-30, 30);
    let nowSat = random(30, 50);
    let nowBri = random(10, 40);
    let colorA = new NYColor(nowHue, nowSat, nowBri, 0.3);
    let colorB = colorA.copy();
    colorB.slightRandomize(20, 20, 20, 0);

    dotNoiseZ += 0.2;
    areaNoiseZ += 1;

    dotLength = 20;
    dotNoiseScale = 0.003;
    areaNoiseScale = 0.02;
    areaNoiseDrawMax = 0.4;
    areaNoiseDrawMin = 0.0;
    skipChance = 0.1;
    fromPoint.color = colorA;
    toPoint.color = colorB;
    await drawStick(fromPoint, toPoint);

    await sleep(1);
  }

  {
    let nowHue = mainHue + random(-30, 30);
    let nowSat = random(30, 50);
    let nowBri = random(10, 40);
    let colorA = new NYColor(nowHue, nowSat, nowBri, 0.3);
    let colorB = colorA.copy();
    colorB.slightRandomize(20, 20, 20, 0);

    dotNoiseZ += 0.2;
    areaNoiseZ += 1;

    dotLength = 20;
    dotNoiseScale = 0.003;
    areaNoiseScale = 0.02;
    areaNoiseDrawMax = 0.4;
    areaNoiseDrawMin = 0.0;
    skipChance = 0.1;
    fromPoint.color = colorA;
    toPoint.color = colorB;
    await drawStick(fromPoint, toPoint);

    await sleep(1);
  }

  {
    let nowHue = mainHue + random(-30, 30);
    let nowSat = random(30, 50);
    let nowBri = random(10, 40);
    let colorA = new NYColor(nowHue, nowSat, nowBri, 0.3);
    let colorB = colorA.copy();
    colorB.slightRandomize(20, 20, 20, 0);

    dotNoiseZ += 0.2;
    areaNoiseZ += 2;

    dotLength = 20;
    dotNoiseScale = 0.003;
    areaNoiseScale = 0.02;
    areaNoiseDrawMax = 0.4;
    areaNoiseDrawMin = 0.0;
    skipChance = 0.1;
    fromPoint.color = colorA;
    toPoint.color = colorB;
    await drawStick(fromPoint, toPoint);

    await sleep(1);
  }

  mainHue = 138;
  blendMode(BLEND);
  areaNoiseZ += 10;

  // start spawn some green
  {
    smoothSkipChanceMultiplier = 0.6;
    smoothSkipChanceRange = 0.2;

    let nowHue = mainHue + random(-10, 10);
    let nowSat = random(30, 60);
    let nowBri = random(20, 40);
    let colorA = new NYColor(nowHue, nowSat, nowBri, 0.8);
    let colorB = colorA.copy();
    colorB.slightRandomize(20, 20, 20, 0);

    dotSize = 6;
    dotLength = 40;
    dotNoiseScale = 0.02;
    areaNoiseScale = 0.01;
    areaNoiseDrawMax = 0.4;
    areaNoiseDrawMin = 0.0;
    skipChance = 0.3;
    fromPoint.color = colorA;
    toPoint.color = colorB;
    await drawStick(fromPoint, toPoint);

    await sleep(1);
  }

  // start spawn some green
  {
    dotHDiff = 120;

    smoothSkipChanceMultiplier = 0.2;
    smoothSkipChanceRange = 0.1;

    let nowHue = mainHue + random(-10, 10);
    let nowSat = random(60, 80);
    let nowBri = random(60, 80);
    let colorA = new NYColor(nowHue, nowSat, nowBri, 0.8);
    let colorB = colorA.copy();
    colorB.slightRandomize(20, 20, 20, 0);

    dotSize = 6;
    dotLength = 40;
    dotNoiseScale = 0.02;
    areaNoiseScale = 0.01;
    areaNoiseDrawMax = 0.4;
    areaNoiseDrawMin = 0.0;
    skipChance = 0.9;
    fromPoint.color = colorA;
    toPoint.color = colorB;
    await drawStick(fromPoint, toPoint);

    await sleep(1);
  }

  // start spawn some dark green
  {
    dotHDiff = 120;

    smoothSkipChanceMultiplier = 0.2;
    smoothSkipChanceRange = 0.1;

    let nowHue = mainHue + random(-10, 10);
    let nowSat = random(20, 30);
    let nowBri = random(10, 20);
    let colorA = new NYColor(nowHue, nowSat, nowBri, 0.8);
    let colorB = colorA.copy();
    colorB.slightRandomize(20, 20, 20, 0);

    dotSize = 8;
    dotLength = 20;
    dotNoiseScale = 0.02;
    areaNoiseScale = 0.01;
    areaNoiseDrawMax = 0.4;
    areaNoiseDrawMin = 0.0;
    skipChance = 0.9;
    fromPoint.color = colorA;
    toPoint.color = colorB;
    await drawStick(fromPoint, toPoint);

    await sleep(1);
  }

  // light screen
  dotTrailDensity = 0.6;
  {
    dotHDiff = 120;

    smoothSkipChanceMultiplier = 0.2;
    smoothSkipChanceRange = 0.1;

    let nowHue = mainHue + random(-10, 10);
    let nowSat = random(40, 60);
    let nowBri = random(60, 100);
    let colorA = new NYColor(nowHue, nowSat, nowBri, 0.8);
    let colorB = colorA.copy();
    colorB.slightRandomize(20, 20, 20, 0);

    dotSize = 3;
    dotLength = 20;
    dotNoiseScale = 0.001;
    dotNoiseZ += 30;
    areaNoiseScale = 0.01;
    areaNoiseDrawMax = 0.4;
    areaNoiseDrawMin = 0.0;
    skipChance = 0.9;
    fromPoint.color = colorA;
    toPoint.color = colorB;
    await drawStick(fromPoint, toPoint);

    await sleep(1);
  }

  // spawn fungis
  {
    let fungiCount = random(120, 240);

    areaNoiseDrawMax = 1.0;
    areaNoiseDrawMin = 0.5;

    while (fungiCount > 0) {
      let xPosRatio = random(0.0, 1.0);

      if(random() < 0.5)
        xPosRatio = easeInSine(random()) * 0.5;
      else
        xPosRatio = 1 - easeInSine(random()) * 0.5;

      let yPosRatio = random(0.03, 0.97);

      if (drawStickFungi(fromPoint, toPoint, xPosRatio, yPosRatio))
        fungiCount--;

      await sleep(1);
    }
  }
}

async function draw() {

}

// async sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

