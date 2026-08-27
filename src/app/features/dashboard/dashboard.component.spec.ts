import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from './dashboard.service';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardService: {
    getRecentEvents: ReturnType<typeof vi.fn>;
    getSummary: ReturnType<typeof vi.fn>;
    getPreferences: ReturnType<typeof vi.fn>;
    updatePreferences: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    dashboardService = {
      getRecentEvents: vi.fn(() =>
        of([{ drinkType: 'french-press', eventType: 'VIEW', createdAt: '2026-08-27T00:00:00Z' }])
      ),
      getSummary: vi.fn(() => of([{ drinkType: 'french-press', count: 3 }])),
      getPreferences: vi.fn(() => of({ defaultDrinkType: 'french-press', units: 'metric' })),
      updatePreferences: vi.fn(() => of({ defaultDrinkType: 'french-press', units: 'metric' })),
    };

    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [{ provide: DashboardService, useValue: dashboardService }],
    });

    fixture = TestBed.createComponent(DashboardComponent);
  });

  it('loads and displays recent events, summary, and preferences on init', () => {
    fixture.detectChanges();

    expect(dashboardService.getRecentEvents).toHaveBeenCalled();
    expect(dashboardService.getSummary).toHaveBeenCalled();
    expect(dashboardService.getPreferences).toHaveBeenCalled();

    const component = fixture.componentInstance;
    expect(component.recentEvents()).toHaveLength(1);
    expect(component.summary()).toHaveLength(1);
    expect(component.defaultDrinkTypeControl.value).toBe('french-press');
    expect(component.loadingRecent()).toBe(false);
    expect(component.loadingSummary()).toBe(false);
    expect(component.loadingPreferences()).toBe(false);
  });

  it('shows empty-state copy when there are no recent events', () => {
    dashboardService.getRecentEvents.mockReturnValue(of([]));

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No activity yet');
  });

  it('stops the recent-activity loading state when the request errors', () => {
    dashboardService.getRecentEvents.mockReturnValue(throwError(() => new Error('network error')));

    fixture.detectChanges();

    expect(fixture.componentInstance.loadingRecent()).toBe(false);
  });

  it('saves preferences when the units control changes', () => {
    fixture.detectChanges();

    fixture.componentInstance.unitsControl.setValue('imperial');

    expect(dashboardService.updatePreferences).toHaveBeenCalledWith({ units: 'imperial' });
  });
});
