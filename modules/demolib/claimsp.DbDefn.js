module.exports = {
  useSQL: true,
  dbObject: "claimsp",
  format: "claims",
  uniqueKey: [
    { field: "cmnumber", ascending: true }
  ],
  overrides: {
    cmnumber: { type: "packed" },
    cmtime: { type: "packed" },
    cmunits: { type: "packed" },
    cminjured: { type: "packed" },
    cmzip: { type: "packed" },
    cmeqest: { type: "packed" },
    cmothest: { type: "packed" },
    cmpropest: { type: "packed" },
    cmeqcost: { type: "packed" },
    cmothcost: { type: "packed" },
    cmpropcost: { type: "packed" },
  },

  // These built-in routes were auto generated by PJS Conversion. Correct as needed and uncomment to activate them.
  // The path does not need to match the data object name. Ensure the path parameters match the uniqueKey.
  //routes: {
    // add:     "/claimsp",
    // get:     "/claimsp/:cmnumber",
    // getList: "/claimsp",
    // update:  "/claimsp/:cmnumber",
    // delete:  "/claimsp/:cmnumber",
  //}
}