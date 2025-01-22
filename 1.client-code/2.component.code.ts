import {
  IProperty,
  IPropertyMap,
  EnumValidation,
  NumberValidation,
  StringValidation,
} from "../app.common";

export function createComponentCode(propertyMap: IPropertyMap): string {
  const className = `${propertyMap.name}Component`;
  const modelName = `I${propertyMap.name}`;
  const serviceName = `${propertyMap.name}Service`;
  const modelFileName = `${propertyMap.name.toLowerCase()}.model`;
  const serviceFileName = `${propertyMap.name.toLowerCase()}.service`;

  // Generate FormGroup fields
  const generateFormGroupFields = (): string => {
    return Object.entries(propertyMap.properties)
      .map(([key, prop]: [string, IProperty]) => {
        const validators: string[] = [];

        if (!prop.isOptional) {
          validators.push("Validators.required");
        }

        if (prop.validation) {
          if ("minLength" in prop.validation) {
            validators.push(
              `Validators.minLength(${prop.validation.minLength})`
            );
          }
          if ("maxLength" in prop.validation) {
            validators.push(
              `Validators.maxLength(${prop.validation.maxLength})`
            );
          }
          if ("pattern" in prop.validation) {
            validators.push(`Validators.pattern('${prop.validation.pattern}')`);
          }
        }

        return `${key}: [${prop.isOptional ? "null" : "''"}, [${validators.join(
          ", "
        )}]]`;
      })
      .join(",\n      ");
  };

  // Generate displayedColumns array
  const generateDisplayedColumns = (): string => {
    return Object.keys(propertyMap.properties)
      .filter((key) => propertyMap.properties[key].propType !== "object")
      .map((key) => `'${key}'`)
      .join(", ");
  };

  return `import { CommonModule } from '@angular/common';
  import { Component, OnInit } from '@angular/core';
  import {
    ReactiveFormsModule,
    FormBuilder,
    FormGroup,
    Validators,
  } from '@angular/forms';
  import { MatCardModule } from '@angular/material/card';
  import { MatIconModule } from '@angular/material/icon';
  import { MatTableModule } from '@angular/material/table';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatInputModule } from '@angular/material/input';
  import { ${modelName} } from './${modelFileName}';
  import { ${serviceName} } from './${serviceFileName}';
  
  @Component({
    selector: 'app-${propertyMap.name.toLowerCase()}',
    imports: [
      CommonModule,
      MatTableModule,
      MatCardModule,
      MatIconModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
    ],
    templateUrl: './${propertyMap.name.toLowerCase()}.component.html',
    styleUrls: ['./${propertyMap.name.toLowerCase()}.component.css'],
  })
  export class ${className} implements OnInit {
    displayedColumns: string[] = [${generateDisplayedColumns()}, 'actions'];
    dataSource: ${modelName}[] = [];
    isFormVisible = false;
    isEditMode = false;
    current${propertyMap.name}Id: number | null = null;
    ${propertyMap.name.toLowerCase()}Form!: FormGroup;
  
    constructor(
      private ${propertyMap.name.toLowerCase()}Service: ${serviceName},
      private fb: FormBuilder
    ) {}
  
    ngOnInit(): void {
      this.load${propertyMap.name}s();
      this.initForm();
    }
  
    load${propertyMap.name}s(): void {
      this.${propertyMap.name.toLowerCase()}Service.get().subscribe((data) => {
        this.dataSource = data;
      });
    }
  
    initForm(): void {
      this.${propertyMap.name.toLowerCase()}Form = this.fb.group({
        ${generateFormGroupFields()}
      });
    }
  
    toggleForm(): void {
      this.isFormVisible = !this.isFormVisible;
      this.isEditMode = false;
      this.${propertyMap.name.toLowerCase()}Form.reset();
    }
  
    edit${
      propertyMap.name
    }(${propertyMap.name.toLowerCase()}: ${modelName}): void {
      this.isFormVisible = true;
      this.isEditMode = true;
      this.current${
        propertyMap.name
      }Id = ${propertyMap.name.toLowerCase()}.Id ?? null;
      this.${propertyMap.name.toLowerCase()}Form.patchValue(${propertyMap.name.toLowerCase()});
    }
  
    delete${
      propertyMap.name
    }(${propertyMap.name.toLowerCase()}Id: number): void {
      this.${propertyMap.name.toLowerCase()}Service.delete(${propertyMap.name.toLowerCase()}Id).subscribe(() => {
        this.load${propertyMap.name}s();
      });
    }
  
    onSubmit(): void {
      if (this.${propertyMap.name.toLowerCase()}Form.valid) {
        const ${propertyMap.name.toLowerCase()} = this.${propertyMap.name.toLowerCase()}Form.value;
        if (this.isEditMode) {
          this.${propertyMap.name.toLowerCase()}Service.edit(${propertyMap.name.toLowerCase()}).subscribe(() => {
            this.load${propertyMap.name}s();
            this.toggleForm();
          });
        } else {
          this.${propertyMap.name.toLowerCase()}Service.add(${propertyMap.name.toLowerCase()}).subscribe(() => {
            this.load${propertyMap.name}s();
            this.toggleForm();
          });
        }
      }
    }
  
    getErrorMessages(controlName: string): string[] {
      const control = this.${propertyMap.name.toLowerCase()}Form.get(controlName);
      if (control?.touched && control?.invalid) {
        const errors: { [key: string]: string } = {
          required: 'This field is required.',
          minlength: 'Too short.',
          maxlength: 'Too long.',
          pattern: 'Invalid format.',
        };
        return Object.keys(control.errors || {}).map((key) => errors[key]);
      }
      return [];
    }
  }`;
}
