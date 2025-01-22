import {
  IProperty,
  IPropertyMap,
  EnumValidation,
  NumberValidation,
  StringValidation,
} from "../app.common";

export function createComponentCSS(propertyMap: IPropertyMap): string {
  const columnCount = Object.keys(propertyMap.properties).length - 1;

  return `mat-card {
    margin: 20px;
  }
  
  .mat-elevation-z8 {
    width: 100%;
    overflow: auto;
  }
  
  table {
    width: 100%;
  }
  
  button {
    margin: 0 5px;
  }
  
  mat-card-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  form.form-container {
    display: grid;
    grid-template-columns: repeat(${columnCount}, 1fr); /* Align with table columns */
    gap: 20px;
  }
  
  mat-form-field {
    width: 100%;
  }
  
  .form-actions {
    grid-column: span ${columnCount}; /* Stretch buttons across the row */
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }`;
}
