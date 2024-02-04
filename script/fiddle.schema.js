const schema = {
  name: {
    alias: "name",
    datatype: "string"
  },
  ingredients: {
    alias: "ingredients",
    datatype: "array"
  },
  diet: {
    alias: "diet",
    datatype: "enum"
  },
  prep_time: {
    alias: "preptime",
    datatype: "number"
  },
  cook_time: {
    alias: "cooktime",
    datatype: "number"
  },
  flavor_profile: {
    alias: "flavorprofile",
    datatype: "enum"
  },
  course: {
    alias: "course",
    datatype: "enum"
  },
  state: {
    alias: "state",
    datatype: "number"
  },
  region: {
    alias: "region",
    datatype: "enum"
  }
}

module.exports = {
  schema
}