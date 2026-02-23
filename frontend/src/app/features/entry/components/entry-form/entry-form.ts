import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { combineLatest, map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
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
    MatDatepickerModule,
    MatAutocompleteModule,
  ],
  templateUrl: './entry-form.html',
  styleUrl: './entry-form.scss',
})
export class EntryFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly entryService = inject(EntryService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly DESPAIR_LEVEL = DESPAIR_LEVEL;
  protected readonly levelOptions = Array.from(
    { length: DESPAIR_LEVEL.MAX - DESPAIR_LEVEL.MIN + 1 },
    (_, i) => i + DESPAIR_LEVEL.MIN,
  );
  protected readonly submitting = signal(false);

  protected readonly form = this.fb.group({
    memberName: ['', [Validators.required, Validators.maxLength(100)]],
    level: [5, [Validators.required, Validators.min(DESPAIR_LEVEL.MIN), Validators.max(DESPAIR_LEVEL.MAX)]],
    comment: [''],
    recordedDate: [null as Date | null],
  });

  // 既存メンバー名をロードし、入力値でフィルタしてオートコンプリート候補を提供
  private readonly memberNames$ = this.entryService.findMemberNames();
  protected readonly filteredMemberNames = toSignal(
    combineLatest([
      this.memberNames$,
      this.form.controls.memberName.valueChanges.pipe(startWith('')),
    ]).pipe(
      map(([names, value]) => {
        const input = (value ?? '').toLowerCase();
        if (!input) return names;
        return names.filter((n) => n.toLowerCase().includes(input));
      }),
    ),
    { initialValue: [] as string[] },
  );

  ngOnInit(): void {}

  protected submit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);

    const { memberName, level, comment, recordedDate } = this.form.getRawValue();
    this.entryService.create({
      memberName: memberName!,
      level: level!,
      comment: comment || undefined,
      recordedDate: recordedDate ? this.formatLocalDate(recordedDate) : undefined,
    }).subscribe({
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

  private formatLocalDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
