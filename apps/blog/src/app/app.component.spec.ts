import { AppComponent } from './app.component';
import { MockComponent } from 'ng-mocks';
import { RouterNavComponent } from '@peterjokumsen/ui-elements';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';

describe('[blog] - AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],
    })
      .overrideComponent(AppComponent, {
        remove: {
          imports: [RouterNavComponent],
        },
        add: {
          imports: [MockComponent(RouterNavComponent)],
        },
      })
      .compileComponents();
  });

  it('should be created', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
