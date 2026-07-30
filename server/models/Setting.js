const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: mongoose.Schema.Types.Mixed,
  description: String
}, { timestamps: true });

settingSchema.statics.getValue = async function(key) {
  const setting = await this.findOne({ key });
  return setting ? setting.value : null;
};

settingSchema.statics.setValue = async function(key, value, description = '') {
  let setting = await this.findOne({ key });
  if (setting) {
    setting.value = value;
    if (description) setting.description = description;
  } else {
    setting = new this({ key, value, description });
  }
  await setting.save();
  return setting;
};

module.exports = mongoose.model('Setting', settingSchema);
