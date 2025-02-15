import {
  IProperty,
  IPropertyMap,
  EnumValidation,
  NumberValidation,
  StringValidation,
} from "../app.common";

export function createComponentCode(
  propertyMap: IPropertyMap,
  relation: { [key: string]: string[] }
): string {
  const className = `${propertyMap.name}Component`;
  const modelName = `I${propertyMap.name}`;
  const serviceName = `${propertyMap.name}Service`;
  const modelFileName = `${propertyMap.name.toLowerCase()}.model`;
  const serviceFileName = `${propertyMap.name.toLowerCase()}.service`;

  const generateEnumAttributes = (): string => {
    return Object.entries(propertyMap.properties)
      .filter(([key, prop]) => prop.propType == "enum")
      .map(
        ([key, prop]) =>
          `${key}List = [${(prop.validation as EnumValidation).values.map(
            (x) => `"${x}"`
          )}]; `
      )
      .join("\n");
  };

  const generateForeignAttributes = (): string => {
    return Object.entries(propertyMap.properties)
      .filter(([key, prop]) => prop.isForeign)
      .map(([key]) => `${key}Id = 0; `)
      .join("\n");
  };

  const generateOnInitCode = (): string => {
    let entries = Object.entries(propertyMap.properties)
      .filter(([key, prop]) => prop.isForeign)
      .map(([key]) => `this.${key}Id = +params['${key}Id']; `)
      .join("\n");

    return entries != ""
      ? `
          this.route.params.subscribe((params) => {
            ${entries}
            this.load${propertyMap.name}s();
            this.initForm();
          });
        `
      : `
        this.load${propertyMap.name}s();
        this.initForm();
        `;
  };

  const processRelationCode = (): string => {
    return Object.entries(relation)
      .filter(([key, value]) => key === propertyMap.name)
      .map(([key, valueList]) =>
        valueList
          .map(
            (eachValue) => `
          on${eachValue}s(${key.toLowerCase()}Id: number) {
            this.router.navigate(['${eachValue.toLowerCase()}/${key.toLowerCase()}', ${key.toLowerCase()}Id]);
          }
          `
          )
          .join("\n")
      )
      .join("\n");
  };

  const generateForeignIds = (): string => {
    return Object.entries(propertyMap.properties)
      .filter(([key, prop]) => prop.isForeign)
      .map(([key]) => `this.${key}Id`)
      .join(",");
  };

  const generateForeignValues = (): string => {
    return Object.entries(propertyMap.properties)
      .filter(([key, prop]) => prop.isForeign)
      .map(([key]) => `${key}: this.${key}Id`)
      .join(",");
  };

  const generateFormGroupFields = (): string => {
    return Object.entries(propertyMap.properties)
      .filter(
        ([key, prop]) =>
          propertyMap.properties[key].propType !== "object" &&
          !prop.isPrimary &&
          !prop.isForeign
      )
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
            validators.push(`Validators.pattern(/${prop.validation.pattern}/)`);
          }

          if (prop.propType == "enum") {
            validators.push(`
              (control: any) => {
                return this.${key}List.includes(
                  control.value?.toLowerCase().trim()
                )
                  ? null
                  : { invalidData: true };
              }`);
          }
        }

        return `${key}: [${prop.isOptional ? "null" : "''"}, [${validators.join(
          ", "
        )}]]`;
      })
      .join(",\n      ");
  };

  const generateDisplayedColumns = (): string => {
    return Object.entries(propertyMap.properties)
      .filter(
        ([key, prop]) =>
          propertyMap.properties[key].propType !== "object" &&
          !prop.isPrimary &&
          !prop.isForeign
      )
      .map(([key, prop]) => `'${key}'`)
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
  import { Router } from '@angular/router';
  import { ActivatedRoute } from '@angular/router';
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
      MatOptionModule,
    ],
    templateUrl: './${propertyMap.name.toLowerCase()}.component.html',
    styleUrls: ['./${propertyMap.name.toLowerCase()}.component.css'],
  })
  export class ${className} implements OnInit {
    ${generateForeignAttributes()}
    ${generateEnumAttributes()}

    displayedColumns: string[] = [${generateDisplayedColumns()}, 'actions'];
    dataSource: ${modelName}[] = [];
    isFormVisible = false;
    isEditMode = false;
    current${propertyMap.name}Id: number | null = null;
    ${propertyMap.name.toLowerCase()}Form!: FormGroup;
  
    constructor(
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private ${propertyMap.name.toLowerCase()}Service: ${serviceName}
    ) {}
  
    ngOnInit(): void {
      ${generateOnInitCode()}
    }
  
    load${propertyMap.name}s(): void {
      this.${propertyMap.name.toLowerCase()}Service.getAll(${generateForeignIds()}).subscribe((data) => {
        this.dataSource = data;
      });
    }
  
    initForm(): void {
      this.${propertyMap.name.toLowerCase()}Form = this.fb.group({
        Id: [null, []],
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
  
    ${processRelationCode()}

    onSubmit(): void {
      if (this.${propertyMap.name.toLowerCase()}Form.valid) {
        const ${propertyMap.name.toLowerCase()} = { ...this.${propertyMap.name.toLowerCase()}Form.value, 
          ${generateForeignValues()} };

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
          invalidData: 'invalid Data'
        };
        return Object.keys(control.errors || {}).map((key) => errors[key]);
      }
      return [];
    }
  }`;
}
