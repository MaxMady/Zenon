const { createCanvas } = require('canvas');
const { GifEncoder } = require('gifencoder');
const fs = require('fs');

const canvasWidth = 400;
const canvasHeight = 200;
const healthBarHeight = 10;
const healthBarBorderWidth = 1;

const canvas = createCanvas(canvasWidth, canvasHeight);
const context = canvas.getContext('2d');

const pokemon1SpriteUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png';
const pokemon2SpriteUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png';

const pokemon1Image = new Image();
const pokemon2Image = new Image();

const pokemon1HealthBarX = 10;
const pokemon1HealthBarY = 10;
const pokemon2HealthBarX = canvasWidth - 10;
const pokemon2HealthBarY = 10;

const healthBarWidth = (canvasWidth - 2 * pokemon1HealthBarX);

const encoder = new GifEncoder(canvasWidth, canvasHeight);
encoder.createReadStream().pipe(fs.createWriteStream('pokemon_battle.gif'));

encoder.start();
encoder.setRepeat(0);
encoder.setDelay(500);
encoder.setQuality(10);

pokemon1Image.onload = () => {
  const pokemon1Height = canvasHeight / 2;
  const pokemon1Width = pokemon1Image.width * (pokemon1Height / pokemon1Image.height);
  context.drawImage(pokemon1Image, 0, canvasHeight - pokemon1Height, pokemon1Width, pokemon1Height);
  
  pokemon2Image.onload = () => {
    const pokemon2Height = canvasHeight / 2;
    const pokemon2Width = pokemon2Image.width * (pokemon2Height / pokemon2Image.height);
    context.drawImage(pokemon2Image, canvasWidth - pokemon2Width, 0, pokemon2Width, pokemon2Height);

    context.fillStyle = 'white';
    context.fillRect(pokemon1HealthBarX, pokemon1HealthBarY, healthBarWidth, healthBarHeight);
    context.fillRect(pokemon2HealthBarX - healthBarWidth, pokemon2HealthBarY, healthBarWidth, healthBarHeight);

    context.fillStyle = 'red';
    context.fillRect(pokemon1HealthBarX + healthBarBorderWidth, pokemon1HealthBarY + healthBarBorderWidth, 
      healthBarWidth - 2 * healthBarBorderWidth, healthBarHeight - 2 * healthBarBorderWidth);
    context.fillRect(pokemon2HealthBarX - healthBarWidth + healthBarBorderWidth, pokemon2HealthBarY + healthBarBorderWidth, 
      healthBarWidth - 2 * healthBarBorderWidth, healthBarHeight - 2 * healthBarBorderWidth);

    context.fillStyle = 'grey';
    const pokemon1Health = 80;
    const pokemon1TotalHealth = 100;
    const pokemon2Health = 50;
    const pokemon2TotalHealth = 100;
    const pokemon1HealthBarLength = (healthBarWidth - 2 * healthBarBorderWidth) * (pokemon1Health / pokemon1TotalHealth);
    const pokemon2HealthBarLength = (healthBarWidth - 2 * healthBarBorderWidth) * (pokemon2Health / pokemon2TotalHealth);
    