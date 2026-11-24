// Local GLB inventory. rotationOffset maps source front to canonical +X.
// muzzleOffset is a fraction of the normalized half-width / height / half-depth.
// Gameplay collision and targeting must not read this file.
export const ASSETS_CONFIG = Object.freeze({
  "bow": {
    "category": "defenders",
    "modelPath": "./assets/models/defenders/bow.glb",
    "tileFitRatio": 0.65,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0.32,
      "y": 0.84,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 1.12,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "bow"
  },
  "staff": {
    "category": "defenders",
    "modelPath": "./assets/models/defenders/staff.glb",
    "tileFitRatio": 0.55,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0.15,
      "y": 0.91,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 1.12,
    "castShadow": true,
    "receiveShadow": true,
    "tint": 11585279,
    "fallback": "staff"
  },
  "repeater": {
    "category": "defenders",
    "modelPath": "./assets/models/defenders/repeater.glb",
    "tileFitRatio": 0.72,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0.42,
      "y": 0.84,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 1.12,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "repeater"
  },
  "storm": {
    "category": "defenders",
    "modelPath": "./assets/models/defenders/storm.glb",
    "tileFitRatio": 0.65,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0.15,
      "y": 0.92,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 1.12,
    "castShadow": true,
    "receiveShadow": true,
    "tint": 12165631,
    "fallback": "storm"
  },
  "shield": {
    "category": "defenders",
    "modelPath": "./assets/models/defenders/shield.glb",
    "tileFitRatio": 0.8,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 1.12,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "shield"
  },
  "bastion": {
    "category": "defenders",
    "modelPath": "./assets/models/defenders/bastion.glb",
    "tileFitRatio": 0.88,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 1.12,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "bastion"
  },
  "flamebow": {
    "category": "defenders",
    "modelPath": "./assets/models/defenders/flamebow.glb",
    "tileFitRatio": 0.78,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0.45,
      "y": 0.81,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 1.12,
    "castShadow": true,
    "receiveShadow": true,
    "tint": 16756858,
    "fallback": "flamebow"
  },
  "icebow": {
    "category": "defenders",
    "modelPath": "./assets/models/defenders/icebow.glb",
    "tileFitRatio": 0.78,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0.45,
      "y": 0.8,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 1.12,
    "castShadow": true,
    "receiveShadow": true,
    "tint": 10214655,
    "fallback": "icebow"
  },
  "plague": {
    "category": "defenders",
    "modelPath": "./assets/models/defenders/plague.glb",
    "tileFitRatio": 0.75,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0.15,
      "y": 0.91,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 1.12,
    "castShadow": true,
    "receiveShadow": true,
    "tint": 11721586,
    "fallback": "plague"
  },
  "thunderfire": {
    "category": "defenders",
    "modelPath": "./assets/models/defenders/thunderfire.glb",
    "tileFitRatio": 0.82,
    "rotationOffset": 0,
    "muzzleOffset": {
      "x": 0.92,
      "y": 0.68,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 1.12,
    "castShadow": true,
    "receiveShadow": true,
    "tint": 16760202,
    "fallback": "thunderfire"
  },
  "citadel": {
    "category": "defenders",
    "modelPath": "./assets/models/defenders/citadel.glb",
    "tileFitRatio": 0.9,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 1.12,
    "castShadow": true,
    "receiveShadow": true,
    "tint": 10276847,
    "fallback": "citadel"
  },
  "furnacewall": {
    "category": "defenders",
    "modelPath": "./assets/models/defenders/furnacewall.glb",
    "tileFitRatio": 0.9,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0.8,
      "y": 0.82,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 1.12,
    "castShadow": true,
    "receiveShadow": true,
    "tint": 16755836,
    "fallback": "furnacewall"
  },
  "apocalypse": {
    "category": "defenders",
    "modelPath": "./assets/models/defenders/apocalypse.glb",
    "tileFitRatio": 0.85,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0.4,
      "y": 0.92,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 1.12,
    "castShadow": true,
    "receiveShadow": true,
    "tint": 16748655,
    "fallback": "apocalypse"
  },
  "aurora": {
    "category": "defenders",
    "modelPath": "./assets/models/defenders/aurora.glb",
    "tileFitRatio": 0.8,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0.15,
      "y": 0.94,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 1.12,
    "castShadow": true,
    "receiveShadow": true,
    "tint": 9958641,
    "fallback": "aurora"
  },
  "rat": {
    "category": "enemies",
    "modelPath": "./assets/models/enemies/rat.glb",
    "tileFitRatio": 0.45,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": "RatArmature|Rat_Idle",
      "walk": "RatArmature|Rat_Walk",
      "attack": "RatArmature|Rat_Attack",
      "die": "RatArmature|Rat_Death"
    },
    "groundOffset": 0,
    "heightFitRatio": 0.94,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "rat"
  },
  "bat": {
    "category": "enemies",
    "modelPath": "./assets/models/enemies/bat.glb",
    "tileFitRatio": 0.58,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": "Idle",
      "walk": null,
      "attack": "2H_Melee_Attack_Chop",
      "die": "Death_A"
    },
    "groundOffset": 0.28,
    "heightFitRatio": 0.94,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "bat"
  },
  "shell": {
    "category": "enemies",
    "modelPath": "./assets/models/enemies/shell.glb",
    "tileFitRatio": 0.65,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": "SpiderArmature|Spider_Idle",
      "walk": "SpiderArmature|Spider_Walk",
      "attack": "SpiderArmature|Spider_Attack",
      "die": "SpiderArmature|Spider_Death"
    },
    "groundOffset": 0,
    "heightFitRatio": 0.94,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "shell"
  },
  "wolf": {
    "category": "enemies",
    "modelPath": "./assets/models/enemies/wolf.glb",
    "tileFitRatio": 0.7,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": "AnimalArmature|Idle",
      "walk": "AnimalArmature|Walk",
      "attack": "AnimalArmature|Attack",
      "die": "AnimalArmature|Death"
    },
    "groundOffset": 0,
    "heightFitRatio": 0.94,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "wolf"
  },
  "mage": {
    "category": "enemies",
    "modelPath": "./assets/models/enemies/mage.glb",
    "tileFitRatio": 0.5,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": "SkeletonArmature|SkeletonArmature|Skeleton_Idle",
      "walk": "SkeletonArmature|SkeletonArmature|Skeleton_Running",
      "attack": "SkeletonArmature|SkeletonArmature|Skeleton_Attack",
      "die": "SkeletonArmature|SkeletonArmature|Skeleton_Death"
    },
    "groundOffset": 0,
    "heightFitRatio": 0.94,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "mage"
  },
  "wisp": {
    "category": "enemies",
    "modelPath": "./assets/models/enemies/wisp.glb",
    "tileFitRatio": 0.45,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": "Flying_Idle",
      "walk": "Fast_Flying",
      "attack": "Headbutt",
      "die": "Death"
    },
    "groundOffset": 0.2,
    "heightFitRatio": 0.94,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "wisp"
  },
  "brute": {
    "category": "enemies",
    "modelPath": "./assets/models/enemies/brute.glb",
    "tileFitRatio": 0.85,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": "Idle",
      "walk": "Walk",
      "attack": "Bite_Front",
      "die": "Death"
    },
    "groundOffset": 0,
    "heightFitRatio": 0.94,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "brute"
  },
  "boss": {
    "category": "enemies",
    "modelPath": "./assets/models/enemies/boss.glb",
    "tileFitRatio": 0.92,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": "Idle",
      "walk": null,
      "attack": "2H_Melee_Attack_Chop",
      "die": "Death_A"
    },
    "groundOffset": 0,
    "heightFitRatio": 1.2,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "boss"
  },
  "ember": {
    "category": "supports",
    "modelPath": "./assets/models/supports/ember.glb",
    "tileFitRatio": 0.35,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 0.9,
    "castShadow": true,
    "receiveShadow": true,
    "tint": 16747347,
    "fallback": "ember"
  },
  "frost": {
    "category": "supports",
    "modelPath": "./assets/models/supports/frost.glb",
    "tileFitRatio": 0.4,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 0.9,
    "castShadow": true,
    "receiveShadow": true,
    "tint": 8644351,
    "fallback": "frost"
  },
  "venom": {
    "category": "supports",
    "modelPath": "./assets/models/supports/venom.glb",
    "tileFitRatio": 0.35,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 0.9,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "venom"
  },
  "whet": {
    "category": "supports",
    "modelPath": "./assets/models/supports/whet.glb",
    "tileFitRatio": 0.35,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 0.9,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "whet"
  },
  "brazier": {
    "category": "supports",
    "modelPath": "./assets/models/supports/brazier.glb",
    "tileFitRatio": 0.55,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 0.9,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "brazier"
  },
  "glacial": {
    "category": "supports",
    "modelPath": "./assets/models/supports/glacial.glb",
    "tileFitRatio": 0.45,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 0.9,
    "castShadow": true,
    "receiveShadow": true,
    "tint": 8644351,
    "fallback": "glacial"
  },
  "blight": {
    "category": "supports",
    "modelPath": "./assets/models/supports/blight.glb",
    "tileFitRatio": 0.45,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 0.9,
    "castShadow": true,
    "receiveShadow": true,
    "tint": 10872685,
    "fallback": "blight"
  },
  "forge": {
    "category": "supports",
    "modelPath": "./assets/models/supports/forge.glb",
    "tileFitRatio": 0.45,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 0.9,
    "castShadow": true,
    "receiveShadow": true,
    "tint": 16041849,
    "fallback": "forge"
  },
  "arrow": {
    "category": "projectiles",
    "modelPath": "./assets/models/projectiles/arrow.glb",
    "tileFitRatio": 0.25,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 0.9,
    "castShadow": false,
    "receiveShadow": false,
    "tint": null,
    "fallback": "arrow"
  },
  "bolt": {
    "category": "projectiles",
    "modelPath": "./assets/models/projectiles/bolt.glb",
    "tileFitRatio": 0.3,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 0.9,
    "castShadow": false,
    "receiveShadow": false,
    "tint": null,
    "fallback": "bolt"
  },
  "arcane_orb": {
    "category": "projectiles",
    "modelPath": "./assets/models/projectiles/arcane_orb.glb",
    "tileFitRatio": 0.14,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 0.9,
    "castShadow": false,
    "receiveShadow": false,
    "tint": null,
    "fallback": "arcane_orb"
  },
  "fire_bolt": {
    "category": "projectiles",
    "modelPath": "./assets/models/projectiles/fire_bolt.glb",
    "tileFitRatio": 0.22,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 0.9,
    "castShadow": false,
    "receiveShadow": false,
    "tint": 16746055,
    "fallback": "fire_bolt"
  },
  "ice_shard": {
    "category": "projectiles",
    "modelPath": "./assets/models/projectiles/ice_shard.glb",
    "tileFitRatio": 0.2,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 0.9,
    "castShadow": false,
    "receiveShadow": false,
    "tint": null,
    "fallback": "ice_shard"
  },
  "poison_orb": {
    "category": "projectiles",
    "modelPath": "./assets/models/projectiles/poison_orb.glb",
    "tileFitRatio": 0.18,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 0.9,
    "castShadow": false,
    "receiveShadow": false,
    "tint": null,
    "fallback": "poison_orb"
  },
  "thunder_orb": {
    "category": "projectiles",
    "modelPath": "./assets/models/projectiles/thunder_orb.glb",
    "tileFitRatio": 0.22,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 0.9,
    "castShadow": false,
    "receiveShadow": false,
    "tint": 16771977,
    "fallback": "thunder_orb"
  },
  "meteor": {
    "category": "projectiles",
    "modelPath": "./assets/models/projectiles/meteor.glb",
    "tileFitRatio": 0.35,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 0.9,
    "castShadow": false,
    "receiveShadow": false,
    "tint": 16750690,
    "fallback": "meteor"
  },
  "gold_coin": {
    "category": "pickups",
    "modelPath": "./assets/models/pickups/gold_coin.glb",
    "tileFitRatio": 0.15,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 0.9,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "gold_coin"
  },
  "gold_pile": {
    "category": "pickups",
    "modelPath": "./assets/models/pickups/gold_pile.glb",
    "tileFitRatio": 0.28,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 0.9,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "gold_pile"
  },
  "loot_chest": {
    "category": "pickups",
    "modelPath": "./assets/models/pickups/loot_chest.glb",
    "tileFitRatio": 0.45,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 0.9,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "loot_chest"
  },
  "castle_gate": {
    "category": "environment",
    "modelPath": "./assets/models/environment/castle_gate.glb",
    "tileFitRatio": 3,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 3.2,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "castle_gate"
  },
  "castle_wall": {
    "category": "environment",
    "modelPath": "./assets/models/environment/castle_wall.glb",
    "tileFitRatio": 1,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 2.2,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "castle_wall"
  },
  "watchtower": {
    "category": "environment",
    "modelPath": "./assets/models/environment/watchtower.glb",
    "tileFitRatio": 0.8,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 2.2,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "watchtower"
  },
  "pine_tree_a": {
    "category": "environment",
    "modelPath": "./assets/models/environment/pine_tree_a.glb",
    "tileFitRatio": 0.8,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 2.5,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "pine_tree_a"
  },
  "pine_tree_b": {
    "category": "environment",
    "modelPath": "./assets/models/environment/pine_tree_b.glb",
    "tileFitRatio": 0.65,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 2.5,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "pine_tree_b"
  },
  "dead_tree": {
    "category": "environment",
    "modelPath": "./assets/models/environment/dead_tree.glb",
    "tileFitRatio": 0.65,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 2.5,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "dead_tree"
  },
  "rock_a": {
    "category": "environment",
    "modelPath": "./assets/models/environment/rock_a.glb",
    "tileFitRatio": 0.65,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 2.2,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "rock_a"
  },
  "rock_b": {
    "category": "environment",
    "modelPath": "./assets/models/environment/rock_b.glb",
    "tileFitRatio": 0.25,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 2.2,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "rock_b"
  },
  "grass_clump": {
    "category": "environment",
    "modelPath": "./assets/models/environment/grass_clump.glb",
    "tileFitRatio": 0.18,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 2.2,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "grass_clump"
  },
  "bush": {
    "category": "environment",
    "modelPath": "./assets/models/environment/bush.glb",
    "tileFitRatio": 0.4,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 2.2,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "bush"
  },
  "torch": {
    "category": "environment",
    "modelPath": "./assets/models/environment/torch.glb",
    "tileFitRatio": 0.18,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 2.2,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "torch"
  },
  "banner": {
    "category": "environment",
    "modelPath": "./assets/models/environment/banner.glb",
    "tileFitRatio": 0.25,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 2.2,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "banner"
  },
  "ruins": {
    "category": "environment",
    "modelPath": "./assets/models/environment/ruins.glb",
    "tileFitRatio": 2,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 2.2,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "ruins"
  },
  "mountain": {
    "category": "environment",
    "modelPath": "./assets/models/environment/mountain.glb",
    "tileFitRatio": 4,
    "rotationOffset": 1.5707963267948966,
    "muzzleOffset": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "animations": {
      "idle": null,
      "walk": null,
      "attack": null,
      "die": null
    },
    "groundOffset": 0,
    "heightFitRatio": 2.4,
    "castShadow": true,
    "receiveShadow": true,
    "tint": null,
    "fallback": "mountain"
  }
});
