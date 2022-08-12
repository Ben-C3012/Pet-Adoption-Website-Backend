
const petSchema = {
  type: "object",
  properties: {
    type: { type: "string" },
    name: { type: "string" }
  },
  required: ["title", "name"],
  additionalProperties: false
}

module.exports = petSchema
