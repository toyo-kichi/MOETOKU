import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EntryService } from '../../../../core/services/entry.service';
import { DESPAIR_LEVEL } from '../../../../models/entry-level.constant';

@Component({
  selector: 'app-entry-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './entry-form.html',
  styleUrl: './entry-form.scss',
})
export class EntryFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly entryService = inject(EntryService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly DESPAIR_LEVEL = DESPAIR_LEVEL;
  protected readonly levelOptions = Array.from(
    { length: DESPAIR_LEVEL.MAX - DESPAIR_LEVEL.MIN + 1 },
    (_, i) => i + DESPAIR_LEVEL.MIN,
  );
  protected readonly submitting = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    memberName: ['', [Validators.required, Validators.maxLength(100)]],
    level: [5, [Validators.required, Validators.min(DESPAIR_LEVEL.MIN), Validators.max(DESPAIR_LEVEL.MAX)]],
    comment: [''],
  });

  protected submit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);

    const { memberName, level, comment } = this.form.getRawValue();
    this.entryService.create({ memberName, level, comment: comment || undefined }).subscribe({
      next: () => {
        this.snackBar.open('絶望度を記録しました！', '閉じる', { duration: 3000 });
        this.form.reset({ level: 5 });
        this.submitting.set(false);
      },
      error: () => {
        this.snackBar.open('記録に失敗しました。', '閉じる', { duration: 3000 });
        this.submitting.set(false);
      },
    });
  }
}
