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
import 'chartjs-adapter-date-fns';
import { ja } from 'date-fns/locale';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { EntryService } from '../../../../core/services/entry.service';
import { Entry } from '../../../../models/entry.model';

Chart.register(...registerables);

const CHART_COLORS = ['#f44336', '#2196f3', '#4caf50', '#ff9800', '#9c27b0'];

interface MemberChip {
  name: string;
  color: string;
}

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
  protected readonly memberChips = signal<MemberChip[]>([]);

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

    // メンバーごとにエントリをグループ化
    const memberGroups = new Map<string, Entry[]>();
    sorted.forEach((e) => {
      if (!memberGroups.has(e.memberName)) {
        memberGroups.set(e.memberName, []);
      }
      memberGroups.get(e.memberName)!.push(e);
    });

    // memberChips signal を更新
    this.memberChips.set(
      Array.from(memberGroups.keys()).map((name, idx) => ({
        name,
        color: CHART_COLORS[idx % CHART_COLORS.length],
      })),
    );

    // time scale 用のデータセット: {x: ISO文字列, y: 絶望度}
    const datasets = Array.from(memberGroups.entries()).map(([name, memberEntries], idx) => ({
      label: name,
      data: memberEntries.map((e) => ({ x: e.recordedAt, y: e.level })),
      borderColor: CHART_COLORS[idx % CHART_COLORS.length],
      backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] + '33',
      tension: 0.3,
      pointRadius: 5,
      pointHoverRadius: 7,
    }));

    const config: ChartConfiguration = {
      type: 'line',
      data: { datasets },
      options: {
        responsive: true,
        scales: {
          y: {
            min: 1,
            max: 10,
            ticks: { stepSize: 1 },
            title: { display: true, text: '絶望度' },
          },
          x: {
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: { day: 'MM/dd' },
              tooltipFormat: 'yyyy/MM/dd',
            },
            adapters: { date: { locale: ja } },
            title: { display: true, text: '記録日' },
          },
        },
        plugins: {
          legend: { display: false },
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
