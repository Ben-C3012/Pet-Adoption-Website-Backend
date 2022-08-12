
const petSchema = {
    type: "object",
    properties: {
      type: {type: "string"},
      name: {type: "string"}
    },
    required: ["foo"],
    additionalProperties: false
  }
  
  module.exports = {
    petSchema
  }