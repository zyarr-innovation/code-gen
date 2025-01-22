import {
  IProperty,
  IPropertyMap,
  EnumValidation,
  NumberValidation,
  StringValidation,
} from "../app.common";

export function createComponentHTML(propertyMap: IPropertyMap): string {
  const generateTableColumns = (): string => {
    return Object.entries(propertyMap.properties)
      .filter(([_, prop]) => prop.propType !== "object")
      .map(
        ([key]) => `
        <ng-container matColumnDef="${key}">
          <th mat-header-cell *matHeaderCellDef>${
            key.charAt(0).toUpperCase() + key.slice(1)
          }</th>
          <td mat-cell *matCellDef="let element">{{ element.${key} }}</td>
        </ng-container>`
      )
      .join("\n");
  };

  const generateFormFields = (): string => {
    return Object.entries(propertyMap.properties)
      .filter(([_, prop]) => prop.propType !== "object")
      .map(
        ([key]) => `
        <mat-form-field appearance="fill">
          <mat-label>${key.charAt(0).toUpperCase() + key.slice(1)}</mat-label>
          <input matInput formControlName="${key}" />
          <mat-error *ngFor="let error of getErrorMessages('${key}')">{{ error }}</mat-error>
        </mat-form-field>`
      )
      .join("\n");
  };

  return `<mat-card>
    <mat-card-title>
      <span>${propertyMap.name} Details</span>
      <button mat-icon-button color="primary" class="add-btn" (click)="toggleForm()">
        <mat-icon>{{ isFormVisible ? 'edit' : 'add' }}</mat-icon>
      </button>
    </mat-card-title>
    <mat-card-content>
      <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
        ${generateTableColumns()}
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let element">
            <button mat-icon-button color="primary" (click)="edit${
              propertyMap.name
            }(element)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="delete${
              propertyMap.name
            }(element.Id)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </mat-card-content>
  </mat-card>
  
  <mat-card *ngIf="isFormVisible">
    <mat-card-title>
      <mat-icon>{{ isEditMode ? 'edit' : 'add' }}</mat-icon>
      {{ isEditMode ? 'Update ${propertyMap.name}' : 'Add ${
    propertyMap.name
  }' }}
    </mat-card-title>
    <mat-card-content>
      <form [formGroup]="${propertyMap.name.toLowerCase()}Form" (ngSubmit)="onSubmit()" class="form-container">
        ${generateFormFields()}
        <div class="form-actions">
          <button mat-raised-button color="primary" type="submit" [disabled]="${propertyMap.name.toLowerCase()}Form.invalid">
            {{ isEditMode ? 'Update' : 'Add' }}
          </button>
          <button mat-button type="button" (click)="toggleForm()">Cancel</button>
        </div>
      </form>
    </mat-card-content>
  </mat-card>`;
}
