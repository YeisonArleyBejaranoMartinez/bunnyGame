import Phaser, { Scale } from "phaser";
let rabbit = "";
let possibleMoves = [570, 530, 480, 435, 385, 315, 265, 210, 165, 105, 65];
let currentPositionP1 = 0;
let currentPositionP2 = 0;
let canGoUpP1 = true;
let canGoDownP1 = true;
let canGoUpP2 = true;
let canGoDownP2 = true;
let secontPlayer = "";
let playerQuantity = 1;
let level = 1;
let carrots = "";
let pretimeText = "";
let physics = true;
let groupLeftVehicules = "";
let groupRightVehicules = "";
let arrayTypes = ["cars", "cars2", "bigvehicles", "motorCicles"];
let arrayCurrentTypes = ["cars", "cars2", "bigvehicles", "motorCicles"];
let levelName = level===1? "Easy": "Hard";
let modeName = "1 player";
let goUpP1 = false;
let goUpP2 = false;
let goDownP1 = false;
let goDownP2 = false
let sonidoPrincipa = false



export function inicializarJuego(container) {

  class Menu extends Phaser.Scene {
    constructor() {
      super("Menu");
    }
    preload() {
      let progressBar = this.add.graphics();
      let width = this.cameras.main.width;
      let height = this.cameras.main.height;
      let loadingText = this.add.text(
        width / 2,
        height / 2 - 50,
        "Cargando...",
        {
          fontSize: "32px",
          fill: "#fff",
        }
      );
      let percentText = this.add.text(width / 2, height / 2 - 25, "0%", {
        fontSize: "18px",
        fill: "#fff",
      });
      let assetText = this.add.text(width / 2, height / 2 + 50, "Assets", {
        fontSize: "18px",
        fill: "#fff",
      });
      this.load.on("progress", function (value) {
        percentText.setText(parseInt(value * 100) + "%");
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(width / 2 - 160, height / 2 - 10, value * 320, 50);
      });
      this.load.on("fileprogress", function (file) {
        assetText.setText("Cargando: " + file.key);
        console.log(file.src);
      });
      this.load.on("complete", function () {
        progressBar.destroy();
        loadingText.destroy();
        percentText.destroy();
        assetText.destroy();
      });


      this.load.image("bg", "assets/images/background.jpg");
      this.load.image("logo", "assets/images/BunnyGame.png");
      this.load.image("faceRabbit", "assets/images/faceRabbit.png");
      this.load.image("menu", "assets/images/menubuttons.png");
      this.load.image("gameTiles", "assets/images/tilemap.png");
      this.load.tilemapTiledJSON(
        "tilemap",
        "assets/images/tilemap-bunnygame.json"
      );
      this.load.image("carrot", "assets/images/carrot.png");
      this.load.spritesheet("cars", "assets/images/cars.png", {
        frameWidth: 140,
        frameHeight: 70,
      });
      this.load.spritesheet("cars2", "assets/images/cars2.png", {
        frameWidth: 150,
        frameHeight: 90,
      });
      this.load.spritesheet("bigvehicles", "assets/images/bigvehicles.png", {
        frameWidth: 250,
        frameHeight: 100,
      });
      this.load.spritesheet("motorCicles", "assets/images/motorcycle.png", {
        frameWidth: 158,
        frameHeight: 62.5,
      });
      this.load.spritesheet("rabbit", "assets/Images/rabbits.png", {
        frameWidth: 40,
        frameHeight: 40,
      });
      this.load.image("controlP1", "assets/images/Player1.png");
      this.load.image("controlP2", "assets/images/Player2.png");
      this.load.audio("bzzzt", "assets/sound/bzzzt.wav");
      this.load.audio("principal", "assets/sound/FranticLevel.wav");
      this.load.audio("rise", "assets/sound/Rise06.mp3");
    }

    create() {
      this.add.image(480, 320, "bg").setScale(2);
      this.add.image(400, 50, "logo");
      this.add.image(400, 400, "menu");
      this.add.image(150, 500, "faceRabbit");

     const zoneStart= this.add.zone(305, 220, 190, 75)
     zoneStart.setInteractive()
     zoneStart.setOrigin(0);
     zoneStart.on("pointerdown", () => {
        console.log("Click")
        this.scene.start("gameScene");
      })
      const zoneLevel  = this.add.zone(305,320, 190,75)
      zoneLevel.setInteractive()
      zoneLevel.setOrigin(0);
      zoneLevel.on("pointerdown", () => {
        this.scene.start("Level");
      })
      const zoneMode = this.add.zone(305,420, 190,75)
      zoneMode.setInteractive()
      zoneMode.setOrigin(0);
      zoneMode.on("pointerdown", () => {
      this.scene.start("Mode");
    })
      const zoneControls = this.add.zone(305,510,190,75)
      zoneControls.setInteractive()
      zoneControls.setOrigin(0);
      zoneControls.on("pointerdown", () => {
        this.scene.start("Controls");
      })



      this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(zoneLevel);
      this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(zoneStart);
      this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(zoneMode);
      this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(zoneControls);

      this.add.text(300, 100, "level:"+level, { fontFamily: "Arial", fontSize: "32px", color: "#000000" });
      this.add.text(300, 150, "mode:"+playerQuantity+ " players", { fontFamily: "Arial", fontSize: "32px", color: "#000000" });

    }

    update() {}
  }
  class MainScene extends Phaser.Scene {
    constructor() {
      super("gameScene");
    }
    preload() {

    }

    create() {
      const map = this.add.tilemap("tilemap");
      const tileset = map.addTilesetImage("Tilemap", "gameTiles");
      map.createLayer("Grass", tileset);
      map.createLayer("YellowLine", tileset);
      map.createLayer("GrayRace", tileset);
      map.createLayer("WhiteLine", tileset);
      rabbit = this.physics.add.sprite(200, 570, "rabbit", 25);
      rabbit.score = 0;
      rabbit.direction = "up";
      rabbit.death = 0;

      this.anims.create({
        key: "up",
        frames: this.anims.generateFrameNumbers("rabbit", {
          start: 24,
          end: 31,
        }),
        frameRate: 10,
        repeat: 0,
      });

      this.anims.create({
        key: "down",
        frames: this.anims.generateFrameNumbers("rabbit", {
          start: 8,
          end: 15,
        }),
        frameRate: 10,
        repeat: 0,
      });
      carrots = this.physics.add.group();
      this.add.rectangle(200, 625, 100, 50, 0xff0000);
      this.resultTXP1 = this.add.text(200, 615, 0, 50, 0xff0000);
      const collectCarrot = function (player, carrot) {
        carrot.disableBody(true, true);
        rabbit.score++;
        const sonido = this.sound.add("rise");
        sonido.play({
          volume: 1,
          loop: false,
        });
        this.resultTXP1.setText(rabbit.score);
        if (player.y === 65) {
          player.direction = "down";
          carrot.enableBody(true, 200, 570, true, true);
        } else {
          player.direction = "up";
          carrot.enableBody(true, 200, 65, true, true);
        }
      };

      this.physics.add.overlap(rabbit, carrots, collectCarrot, null, this);
      carrots.create(200, 65, "carrot");
      if (playerQuantity === 2) {
        carrots.create(500, 65, "carrot");
        secontPlayer = this.physics.add.sprite(500, 570, "rabbit", 25);
        secontPlayer.score = 0;
        secontPlayer.direction = "up";
        secontPlayer.death = 0;
        this.add.rectangle(500, 625, 100, 50, 0xff0000);
        this.resultTXP2 = this.add.text(495, 615, secontPlayer.score);
        const collectCarrotP2 = function (player, carrots2) {
          carrots2.disableBody(true, true);
          secontPlayer.score++;
          const sonido = this.sound.add("rise");
          sonido.play({
            volume: 1,
            loop: false,
          });

          this.resultTXP2.setText(secontPlayer.score);
          if (player.y === 65) {
            secontPlayer.direction = "down";
            carrots2.enableBody(true, 500, 570, true, true);
          } else {
            secontPlayer.direction = "up";
            carrots2.enableBody(true, 500, 65, true, true);
          }
        };
        this.physics.add.overlap(
          secontPlayer,
          carrots,
          collectCarrotP2,
          null,
          this
        );
      }

      this.add.rectangle(350, 625, 100, 50, 0xff0000);
      this.currentTime = 60;
      this.timeTxt = this.add.text(330, 615, pretimeText + this.currentTime, {
        fontFamily: "font1",
        fontSize: "20px",
        fill: "#fff",
        color: "white",
      });
      this.updateTime();
      groupLeftVehicules = this.physics.add.group();
      groupRightVehicules = this.physics.add.group();
      let vehiculesType1 = groupLeftVehicules.create(
        -100,
        165,
        this.randomCars(0),
        this.randomSprite(0)
      );
      this.randomVelocity(0, vehiculesType1, 1);
      let vehiculesType2 = groupLeftVehicules.create(
        -200,
        265,
        this.randomCars(1),
        this.randomSprite(1)
      );
      this.randomVelocity(1, vehiculesType2, 1);
      let vehiculesType3 = groupRightVehicules.create(
        900,
        385,
        this.randomCars(2),
        this.randomSprite(2)
      );
      this.randomVelocity(2, vehiculesType3, -1);
      vehiculesType3.flipX = true;
      let vehiculesType4 = groupRightVehicules.create(
        900,
        480,
        this.randomCars(3),
        this.randomSprite(3)
      );
      this.randomVelocity(3, vehiculesType4, -1);
      vehiculesType4.flipX = true;

      let limit1 = this.add.rectangle(850, 325, 25, 480, 0x000000);
      this.physics.add.existing(limit1);
      this.physics.add.collider(
        groupLeftVehicules,
        limit1,
        this.newLeftCar,
        null,
        this
      );
      limit1.body.immovable = true;

      let limit2 = this.add.rectangle(-150, 325, 25, 480, 0x000000);
      this.physics.add.existing(limit2);

      this.physics.add.collider(
        groupRightVehicules,
        limit2,
        this.newRightCar,
        null,
        this
      );
      limit2.body.immovable = true;
      this.physics.add.overlap(
        rabbit,
        groupLeftVehicules,
        this.playerCollider,
        null,
        this
      );
      this.physics.add.overlap(
        rabbit,
        groupRightVehicules,
        this.playerCollider,
        null,
        this
      );
      if (playerQuantity === 2) {
        this.physics.add.overlap(
          secontPlayer,
          groupLeftVehicules,
          this.playerColliderP2,
          null,
          this
        );
        this.physics.add.overlap(
          secontPlayer,
          groupRightVehicules,
          this.playerColliderP2,
          null,
          this
        );
      }
      if (window.screen.width <= 900) {
        console.log("esta en movil");
        this.add.image(100, 600, "controlP1").setScale(0.5);
        const zonaFlechaArriba= this.add.zone(80, 550, 40, 40);
        zonaFlechaArriba.setInteractive();
        zonaFlechaArriba.setOrigin(0);
        zonaFlechaArriba.on("pointerdown", () => {
         goUpP1 = true;
        })
        zonaFlechaArriba.on("pointerup", () => {
         goUpP1 = false;
        })
         zonaFlechaArriba.on("pointerupoutside", () => {
         goUpP1 = false;

        })
        const zonaFlechaAbajo = this.add.zone(80, 610, 40, 40);
        zonaFlechaAbajo.setInteractive();
        zonaFlechaAbajo.setOrigin(0);
        zonaFlechaAbajo.on("pointerdown", () => {
          goDownP1 = true;
        })
        zonaFlechaAbajo.on("pointerup", () => {
          goDownP1 = false;
        })
        zonaFlechaAbajo.on("pointerupoutside", () => {
          goDownP1 = false;
        })
        if (playerQuantity === 2) {
          this.add.image(600, 600, "controlP2").setScale(0.5);

        const zonaFlechaArribaP2 = this.add.zone(580, 550, 40, 40);
        zonaFlechaArribaP2.setInteractive();
        zonaFlechaArribaP2.setOrigin(0);
        zonaFlechaArribaP2.on("pointerdown", () => {
          goUpP2 = true;
        })
        zonaFlechaArribaP2.on("pointerup", () => {
          goUpP2 = false;
        })
        zonaFlechaArribaP2.on("pointerupoutside", () => {
          goUpP2 = false;
        })



        const zonaFlechaAbajoP2 = this.add.zone(580, 610, 40, 40);
        zonaFlechaAbajoP2.setInteractive();
        zonaFlechaAbajoP2.setOrigin(0);
        zonaFlechaAbajoP2.on("pointerdown", () => {
          goDownP2 = true;
        })
        zonaFlechaAbajoP2.on("pointerup", () => {
          goDownP2 = false;
        })
        zonaFlechaAbajoP2.on("pointerupoutside", () => {
          goDownP2 = false;
        })
        this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(zonaFlechaArribaP2);
        this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(zonaFlechaAbajoP2);
        }
        this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(zonaFlechaArriba);
        this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(zonaFlechaAbajo);
      }
     if (sonidoPrincipa) {
      sonidoPrincipa = false;
        const music = this.sound.add("principal");
        music.play({
          volume: 1,
          loop: true
        });
     }
    }
    playerCollider(player, element) {
      if (player.y === element.y) {
        player.death++;
        const deathMusic = this.sound.add("bzzzt");
        deathMusic.play({
          volume: 1,
          loop: false,
        });
        if (player.direction === "up") {
          rabbit.y = 570;
          currentPositionP1 = 0;
        } else {
          rabbit.y = 65;
          currentPositionP1 = possibleMoves.length - 1;
        }
      }
    }
    playerColliderP2(player, element) {

      if (player.y === element.y) {
         const deathMusic = this.sound.add("bzzzt");
        deathMusic.play({
          volume: 1,
          loop: false,
        });
        player.death++;
        if (player.direction === "up") {
          secontPlayer.y = 570;
          currentPositionP2 = 0;
        } else {
          secontPlayer.y = 65;
          currentPositionP2 = possibleMoves.length - 1;
        }
      }
    }
    newLeftCar(limit, element) {
      element.destroy();
      let vehicleType = element.y === 165 ? 0 : 1;
      let currentVehicle = groupLeftVehicules.create(
        -100,
        element.y,
        this.randomCars(vehicleType),
        this.randomSprite(vehicleType)
      );
      this.randomVelocity(vehicleType, currentVehicle, 1);
    }

    newRightCar(limit, element) {
      element.destroy();
      let vehicleType = element.y === 385 ? 2 : 3;
      let currentVehicle = groupRightVehicules.create(
        900,
        element.y,
        this.randomCars(vehicleType),
        this.randomSprite(vehicleType)
      );
      currentVehicle.flipX = true;
      this.randomVelocity(vehicleType, currentVehicle, -1);
    }
    randomVelocity(vehicleType, elem, direction) {
      var vehicleTypes = arrayCurrentTypes[vehicleType];
      switch (vehicleTypes) {
        case "cars":
          elem.setVelocityX((Math.random() * 220 + 160) * direction * level);
          break;

        case "cars2":
          elem.setVelocityX((Math.random() * 300 + 220) * direction * level);
          break;

        case "bigvehicles":
          elem.setVelocityX((Math.random() * 220 + 100) * direction * level);
          break;

        case "motorCicles":
          elem.setVelocityX((Math.random() * 375 + 300) * direction * level);
          break;
        default:
          break;
      }
    }
    randomSprite(vehicleType) {
      var vehicleTypes = arrayCurrentTypes[vehicleType];
      switch (vehicleTypes) {
        case "cars":
          return Math.floor(Math.random() * 9);

        case "cars2":
          return Math.floor(Math.random() * 23);

        case "bigvehicles":
          return Math.floor(Math.random() * 7);

        case "motorCicles":
          return Math.floor(Math.random() * 3);

        default:
          break;
      }
    }
    randomCars(vehiculeType) {
      arrayCurrentTypes[vehiculeType] =
        arrayTypes[Math.floor(Math.random() * arrayTypes.length)];
      return arrayCurrentTypes[vehiculeType];
    }
    updateTime() {
      this.currentTime--;
      if (this.currentTime < 10) {
        pretimeText = "00:0";
      } else {
        pretimeText = "00:";
      }
      this.timeTxt.setText(pretimeText + this.currentTime);
      if (this.currentTime === 0) {
        physics = false;
        this.physics.pause();
        this.time.addEvent({
          delay: 1000,
          loop: false,
          callback: () => {
            this.scene.start("EndScene");
          },
        });
      } else {
        this.time.delayedCall(1000, this.updateTime, [], this);
      }
    }

    getUpPlayerMove(currentPosition ) {
      if (currentPosition + 1 < possibleMoves.length) {
        currentPositionP1++;
        return possibleMoves[currentPositionP1];
      } else {
        return false;
      }
    }

    getUpPlayerMoveP2(currentPosition) {
      if (currentPosition + 1 < possibleMoves.length) {
        currentPositionP2++;
        return possibleMoves[currentPositionP2];
      } else {
        return false;
      }
    }

    getDownPlayerMove(currentPosition) {
      if (currentPosition - 1 >= 0) {
        currentPositionP1--;
        return possibleMoves[currentPositionP1];
      } else {
        return false;
      }
    }

    getDownPlayerMoveP2(currentPosition) {
      if (currentPosition - 1 >= 0) {
        currentPositionP2--;
        return possibleMoves[currentPositionP2];
      } else {
        return false;
      }
    }
    update() {
      if (physics) {
        let cursors = this.input.keyboard.createCursorKeys();

        if (cursors.up.isDown || goUpP1)  {
          if (canGoUpP1) {
            canGoUpP1 = false;
            goUpP1 = false;
            let nextUpMove = this.getUpPlayerMove(currentPositionP1);
            if (nextUpMove) {
              rabbit.anims.play("up", false);
              rabbit.y = nextUpMove;
            }
          }
        }
        if (cursors.down.isDown ||goDownP1) {
          if (canGoDownP1) {
            canGoDownP1 = false;
            goDownP1 = false;
            let nextDownMove = this.getDownPlayerMove(currentPositionP1);
            if (nextDownMove) {
              rabbit.anims.play("down", false);
              rabbit.y = nextDownMove;
            }
          }
        }
        if (cursors.up.isUp) {
          canGoUpP1 = true;
        }
        if (cursors.down.isUp) {
          canGoDownP1 = true;
        } else if (cursors.down.isDown) {
          rabbit.anims.play("down", false);
        } else {
          rabbit.setVelocityY(0);
        }
        if (playerQuantity === 2) {
          let KeyObjUp = this.input.keyboard.addKey("W");
          let keyObjDown = this.input.keyboard.addKey("S");
          let player2IsUp = KeyObjUp.isDown;
          let player2IsDown = keyObjDown.isDown;
          if ((player2IsUp || goUpP2) && canGoUpP2) {
            canGoUpP2 = false;
            goUpP2= false
            secontPlayer.anims.play("up", false);
            let nextUpMove = this.getUpPlayerMoveP2(currentPositionP2);
            if (nextUpMove) {
              secontPlayer.y = nextUpMove;
            }
          }
          if ((player2IsDown || goDownP2)&& canGoDownP2) {
            canGoDownP2 = false;
            goDownP2= false
            secontPlayer.anims.play("down", false);
            let nextDownMove = this.getDownPlayerMoveP2(currentPositionP2);
            if (nextDownMove) {
              secontPlayer.y = nextDownMove;
            }
          }
          if (KeyObjUp.isUp) {
            canGoUpP2 = true;
          }
          if (keyObjDown.isUp) {
            canGoDownP2 = true;
          }
        }
      }
    }
  }

  class Level extends Phaser.Scene {
    constructor() {
      super("Level");
    }
    preload() {
      this.load.image("bg", "assets/images/background.jpg");
      this.load.image("logo", "assets/images/BunnyGame.png");
      this.load.image("faceRabbit", "assets/images/faceRabbit.png");
      this.load.image("level", "assets/images/levelButtons.png");
    }

    create() {

      this.add.image(480, 320, "bg").setScale(2);
      this.add.image(400, 50, "logo");
      this.add.image(400, 400, "level");
      this.add.image(150, 500, "faceRabbit");
      const zoneEasy = this.add.zone(305, 220, 190, 75);
      zoneEasy.setInteractive();
      zoneEasy.setOrigin(0);
      zoneEasy.on("pointerdown", () => {
        level=1;
      });
      const zoneMedium = this.add.zone(305, 320, 190, 75);
      zoneMedium.setInteractive();
      zoneMedium.setOrigin(0);
      zoneMedium.on("pointerdown", () => {
        level=2;
      });
      const zoneHard = this.add.zone(305, 420, 190, 75);
      zoneHard.setInteractive();
      zoneHard.setOrigin(0);
      zoneHard.on("pointerdown", () => {
        level=3;
      });
      const zoneBack = this.add.zone(305, 510, 190, 75);
      zoneBack.setInteractive();
      zoneBack.setOrigin(0);
      zoneBack.on("pointerdown", () => {
        this.scene.start("Menu");
      });
      this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(zoneHard);
      this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(zoneMedium);
      this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(zoneEasy);
      this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(zoneBack);


    }

    update() {}
  }

  class Mode extends Phaser.Scene {
    constructor() {
      super("Mode");
    }
    preload() {
      this.load.image("bg", "assets/images/background.jpg");
      this.load.image("logo", "assets/images/BunnyGame.png");
      this.load.image("faceRabbit", "assets/images/faceRabbit.png");
      this.load.image("mode", "assets/images/modeButtons.png");
    }

    create() {
      this.add.image(480, 320, "bg").setScale(2);
      this.add.image(400, 50, "logo");
      this.add.image(400, 400, "mode");
      this.add.image(150, 500, "faceRabbit");
      const zoneSingle = this.add.zone(305, 270, 190, 75);
      zoneSingle.setInteractive();
      zoneSingle.setOrigin(0);
      zoneSingle.on("pointerdown", () => {
        playerQuantity = 1;
      });
      const zoneMulti = this.add.zone(305, 370, 190, 75);
      zoneMulti.setInteractive();
      zoneMulti.setOrigin(0);
      zoneMulti.on("pointerdown", () => {
        playerQuantity = 2;
      });
      const zoneBack = this.add.zone(305, 460, 190, 75);
      zoneBack.setInteractive();
      zoneBack.setOrigin(0);
      zoneBack.on("pointerdown", () => {
        this.scene.start("Menu");
      });
      this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(zoneMulti);
      this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(zoneSingle);
      this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(zoneBack);

    }

    update() {}
  }
  class Controls extends Phaser.Scene {
    constructor() {
      super("Controls");
    }
    preload() {
      this.load.image("bg", "assets/images/background.jpg");
      this.load.image("logo", "assets/images/BunnyGame.png");
      this.load.image("faceRabbit", "assets/images/faceRabbit.png");
      this.load.image("controlsP1", "assets/images/Player1.png");
      this.load.image("controlsP1Text", "assets/images/Player1text.png");
      this.load.image("controlsP2Text", "assets/images/Player2text.png");
      this.load.image("controlsP2", "assets/images/Player2.png");
    }

    create() {
      this.add.image(480, 320, "bg").setScale(2);
      this.add.image(400, 50, "logo");
      this.add.image(200, 300, "controlsP1");
      this.add.image(550, 300, "controlsP2");
      this.add.image(190, 140, "controlsP1Text");
      this.add.image(570, 140, "controlsP2Text");
     const zoneBack =  this.add.zone(0, 0, 800, 800)
     zoneBack.setInteractive()
     zoneBack.setOrigin(0)
     zoneBack.on("pointerdown", () => {
        this.scene.start("Menu");
      })
      this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(zoneBack);
    }

    update() {}
  }
  class EndScene extends Phaser.Scene {
    constructor() {
      super("EndScene");
    }
    preload() {
      this.load.image("bg", "assets/images/background.jpg");
      this.load.image("logo", "assets/images/BunnyGame.png");
      this.load.image("faceRabbit", "assets/images/faceRabbit.png");
    }
    create() {
      this.add.image(480, 320, "bg").setScale(2);
      this.add.image(400, 50, "logo");
      this.add.image(180, 450, "faceRabbit");
      this.add.text(
        10,
        100,
        "Player 1: " + rabbit.score + " Points" + rabbit.death + " Deaths",
        {
          fontSize: "32px",
          fill: "#111111",
        }
      );
      if (playerQuantity === 2) {
        this.add.text(
          10,
          150,
          "Player 2: " +
            secontPlayer.score +
            " Points" +
            secontPlayer.death +
            " Deaths",
          {
            fontSize: "32px",
            fill: "#111111",
          }
        );
      }
      this.add.text(400, 360, "Level: " + levelName,  {
        fontSize: "32px",
        fill: "#111111",
      });
      this.add.text(380, 400, " Mode: " + modeName, {
        fontSize: "32px",
        fill: "#111111",
      });
      let backOptions = this.add.zone(0, 0, 768, 672);
      backOptions.setOrigin(0, 0);
      backOptions.setInteractive();
      backOptions.on(
        "pointerdown",
        function () {
          this.scene.start("Menu");
        },
        this
      );
    }

    update() {}
  }
  const config = {
    type: Phaser.AUTO,
    width: 768,
    height: 672,
    scene: [Menu, MainScene, Controls, Mode, Level, EndScene],
    parent: container,
    Scale: {
      mode: Scale.ScaleManager.AUTO,
    },
    physics: {
      default: "arcade",
    },
  };

  return new Phaser.Game(config);
}
