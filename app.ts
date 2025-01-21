import { IPropertyMap } from "./server-code/0.common";
import { generateServerCode } from "./server-code/100.generateCode";

const propertyMap: IPropertyMap = {
  name: "Teacher",
  properties: {
    Id: { value: 123, type: "optional" },
    name: { value: "John Doe", type: "required" },
    adhaar: { value: "1234-5678-9012", type: "required" },
    school: { value: "ABC High School", type: "required" },
    // isActive: { value: true, type: "optional" },
    // grade: { value: null, type: "optional" }, // Null for unknown or any
    // metadata: { value: { age: 16 }, type: "optional" }, // Object
    // tags: { value: ["science", "math"], type: "optional" }, // Array
  },
};

generateServerCode(propertyMap);
