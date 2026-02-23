import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { EntryService } from '../../../../core/services/entry.service';
import { Entry } from '../../../../models/entry.model';

Chart.register(...registerables);

@Component({
  selector: 'app-despair-chart',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './despair-chart.html',
  styleUrl: './despair-chart.scss',
})
export class DespairChartComponent implements OnInit, AfterViewInit {
  private readonly entryService = inject(EntryService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('chartCanvas');
  protected readonly memberNameControl = new FormControl('');
  protected readonly loading = signal(false);

  private chart: Chart | null = null;

  ngOnInit(): void {
    this.memberNameControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((name) => this.loadEntries(name ?? undefined));
  }

  ngAfterViewInit(): void {
    this.loadEntries();
  }

  private loadEntries(memberName?: string): void {
    this.loading.set(true);
    this.entryService.findAll(memberName || undefined).subscribe({
      next: (entries) => {
        this.renderChart(entries);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  private renderChart(entries: Entry[]): void {
    const sorted = [...entries].sort(
      (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime(),
    );

    const labels = sorted.map((e) =>
      new Date(e.recordedAt).toLocaleString('ja-JP', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    );

    const memberGroups = new Map<string, number[]>();
    sorted.forEach((e) => {
      const levels = memberGroups.get(e.memberName) ?? new Array(sorted.length).fill(null);
      memberGroups.set(e.memberName, levels);
    });

    sorted.forEach((e, i) => {
      const levels = memberGroups.get(e.memberName)!;
      levels[i] = e.level;
    });

    const colors = ['#f44336', '#2196f3', '#4caf50', '#ff9800', '#9c27b0'];
    const datasets = Array.from(memberGroups.entries()).map(([name, data], idx) => ({
      label: name,
      data,
      borderColor: colors[idx % colors.length],
      backgroundColor: colors[idx % colors.length] + '33',
      tension: 0.3,
      spanGaps: true,
    }));

    const config: ChartConfiguration = {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        scales: {
          y: { min: 1, max: 10, title: { display: true, text: '絶望度' } },
          x: { title: { display: true, text: '記録日時' } },
        },
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: '絶望度推移' },
        },
      },
    };

    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(this.canvasRef().nativeElement, config);
  }
}
