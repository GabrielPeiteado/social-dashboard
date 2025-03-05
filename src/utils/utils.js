const parseBoolean = (value) => {
  if (value === "true") {
    return true;
  } else if (value === "false") {
    return false;
  } else if (value) {
    return null;
  } else {
    return "";
  }
};

const socialPlatforms = [
  "Facebook",
  "Instagram",
  "Twitter",
  "LinkedIn",
  "TikTok",
];

module.exports = { parseBoolean, socialPlatforms };
