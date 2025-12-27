const wandb = require("wandb");

let initialized = false;

function initWandb() {
  if (initialized) return;

  wandb.init({
    project: process.env.WANDB_PROJECT || "mailto",
    entity: process.env.WANDB_ENTITY,
  });

  initialized = true;
  console.log("📊 W&B Initialized");
}

function log(data) {
  try {
    initWandb();
    wandb.log(data);
  } catch (err) {
    console.error("W&B Log Error:", err.message);
  }
}

module.exports = { log };
