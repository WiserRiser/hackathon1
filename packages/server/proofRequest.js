const { KYCAgeCredential } = require("./vcHelpers/KYCAgeCredential");

// design your own customised authentication requirement here using Query Language
// https://0xpolygonid.github.io/tutorials/verifier/verification-library/zk-query-language/

const humanReadableAuthReason = "Must be at least 13 years old";

const credentialSubject = {
  birthday: {
    // users must be born before this year
    // birthday is less than Jun 24, 2010
    $lt: 20100624,
  },
};

const proofRequest = KYCAgeCredential(credentialSubject);

module.exports = {
  humanReadableAuthReason,
  proofRequest,
};
